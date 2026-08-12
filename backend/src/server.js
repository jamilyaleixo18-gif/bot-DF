import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";

const app = express();
console.log("ANTHROPIC_API_KEY definida:", !!process.env.ANTHROPIC_API_KEY);
const getClient = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Você é a assistente nutricional DF Nutri. Você tem três modos de operação:

MODO 1 - Sugestão de pratos
Quando o usuário listar ingredientes disponíveis, sugira de 2 a 3 pratos que podem ser feitos com esses ingredientes. Para cada prato:
- Nome do prato
- Ingredientes usados (da lista fornecida)
- Modo de preparo resumido (3-5 passos)
- Informação nutricional aproximada

MODO 2 - Substituição de alimentos (lista de opções)
Quando o usuário informar um alimento e uma quantidade SEM especificar pelo que quer substituir (ex: "200g de frango", "1 xícara de arroz"), ou pedir troca de proteína/carboidrato, identifique a categoria e sugira substitutos APENAS da mesma categoria, nutricionalmente equivalentes, com quantidades proporcionais (mínimo 30 opções). Responda APENAS no formato abaixo, sem nenhum texto antes ou depois:

Alimento | Quantidade
Nome do substituto | XXX g
Nome do substituto | XXX g
(continue para todos os substitutos da mesma categoria)

MODO 3 - Substituição de alimento específico
Quando o usuário informar um alimento com quantidade E especificar exatamente pelo que quer substituir, calcule APENAS a quantidade equivalente. Responda APENAS no formato abaixo:

Alimento | Quantidade
Nome do substituto especificado | XXX g

Regras de estilo da resposta (obrigatórias):
- Nunca use emojis
- Nunca use markdown: sem **, sem *, sem #, sem __, sem links markdown
- Nunca use travessão (—) nem meia-risca (–); use hífen simples (-) ou vírgula
- Texto limpo, direto, em português
- Pode usar listas com hífen (-) ou bullet simples (•)

Detecte automaticamente qual modo usar. Seja claro, prático e objetivo.`;

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://chat.danielfabiocruz.com",
  "https://nutri.danielfabiocruz.com",
  "https://danielfabiocruz.com",
  "https://www.danielfabiocruz.com",
];

function cleanReply(text) {
  return String(text || "")
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/—/g, "-")
    .replace(/–/g, "-")
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[\uFE0F\u200D]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
app.use(
  cors({
    origin: (origin, cb) => {
      if (
        !origin ||
        ALLOWED_ORIGINS.includes(origin) ||
        /\.vercel\.app$/.test(origin)
      ) {
        return cb(null, true);
      }
      return cb(new Error("CORS bloqueado"));
    },
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, hasKey: !!process.env.ANTHROPIC_API_KEY });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages inválido" });
    }

    // Remove a mensagem inicial do assistente (índice 0) — a API exige que comece com "user"
    const apiMessages = messages
      .filter((m) => m.role === "user" || messages.indexOf(m) > 0)
      .map((m) => ({ role: m.role, content: m.content }));

    const response = await getClient().messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: apiMessages,
    });

    res.json({ reply: cleanReply(response.content[0].text) });
  } catch (err) {
    console.error("Erro na API:", err.message);
    res.status(500).json({ error: "Erro ao processar a mensagem." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
  console.log("API KEY definida:", !!process.env.ANTHROPIC_API_KEY);
});
