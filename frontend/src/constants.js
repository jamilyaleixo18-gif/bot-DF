export const FONT_FAMILY = "Manrope, system-ui, sans-serif";

export const FONT_SIZE = {
  sm: "14px",
  base: "15px",
  lg: "18px",
  xl: "20px",
};

export const BRAND = {
  primary: "#6A3FAB",
  primaryDark: "#5A3691",
  primaryLight: "#7B56B6",
};

export const SUGGESTIONS = [
  "Tenho ingredientes, o que faço?",
  "Trocar minha proteína",
  "Trocar meu carboidrato",
  "Quero uma opção de lanche",
  "Quero uma opção rápida",
  "Quero comer algo doce",
];

export const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Olá, sou a assistente DF Nutri!\nPosso te ajudar de duas formas:\n• Informe os ingredientes que você tem em casa e sugiro pratos para preparar\n• Informe um alimento e a quantidade (ex: 200g de frango) e indico substituições equivalentes\nComo posso te ajudar hoje?",
};
