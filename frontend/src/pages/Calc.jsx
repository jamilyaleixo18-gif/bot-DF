import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo.jpg";
import { BRAND, FONT_FAMILY, FONT_SIZE } from "../constants";

const ACTIVITY_LEVELS = [
  { label: "Sedentário", factor: 1.2, desc: "Pouco ou nenhum exercício" },
  { label: "Levemente ativo", factor: 1.375, desc: "Exercício leve 1–3x/semana" },
  { label: "Moderadamente ativo", factor: 1.55, desc: "Exercício moderado 3–5x/semana" },
  { label: "Muito ativo", factor: 1.725, desc: "Exercício intenso 6–7x/semana" },
  { label: "Extremamente ativo", factor: 1.9, desc: "Atleta / treino 2x ao dia" },
];

const GOALS = [
  { label: "Perder peso", multiplier: 0.8, emoji: "↓" },
  { label: "Manter peso", multiplier: 1.0, emoji: "=" },
  { label: "Ganhar massa", multiplier: 1.15, emoji: "↑" },
];

export default function Calc() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ age: "", weight: "", height: "", sex: "female", activity: 1.55, goal: 1.0 });
  const [result, setResult] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const calculate = () => {
    const age = Number(form.age);
    const weight = Number(form.weight);
    const height = Number(form.height);
    if (!age || !weight || !height) return;

    const bmr =
      form.sex === "female"
        ? 10 * weight + 6.25 * height - 5 * age - 161
        : 10 * weight + 6.25 * height - 5 * age + 5;

    const tdee = bmr * form.activity;
    const target = tdee * form.goal;

    const protein = weight * 2.0;
    const fat = (target * 0.25) / 9;
    const carbs = (target - protein * 4 - fat * 9) / 4;

    setResult({ bmr: Math.round(bmr), tdee: Math.round(tdee), target: Math.round(target), protein: Math.round(protein), fat: Math.round(fat), carbs: Math.round(carbs) });
  };

  const inputStyle = {
    width: "100%",
    background: "#f5f0ff",
    border: "1px solid #ddd6fe",
    borderRadius: "12px",
    padding: "12px 14px",
    color: "#1a0a2e",
    fontSize: FONT_SIZE.base,
    fontFamily: "inherit",
    boxSizing: "border-box",
    outline: "none",
  };

  const labelStyle = { fontSize: FONT_SIZE.sm, color: "#5A3691", fontWeight: "600", marginBottom: "6px", display: "block" };

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", alignItems: "flex-start", justifyContent: "center", fontFamily: FONT_FAMILY, padding: "12px 20px 40px" }}>
      <style>{`
        input::placeholder { color: #a78bca; }
        input:focus, select:focus { outline: none; border-color: ${BRAND.primary} !important; }
        .pill-btn { cursor: pointer; transition: all 0.2s; border: 2px solid #ddd6fe; border-radius: 20px; padding: 8px 16px; background: #f5f0ff; color: #5A3691; font-family: inherit; font-size: ${FONT_SIZE.sm}; }
        .pill-btn.active { background: ${BRAND.primary}; border-color: ${BRAND.primary}; color: #fff; }
        .calc-btn:hover { transform: scale(1.02); }
        .back-btn:hover { opacity: 0.7; }
      `}</style>

      <div style={{ width: "100%", maxWidth: "680px", display: "flex", flexDirection: "column", background: "#ffffff", borderRadius: "20px", border: "1px solid #e0d0f8", overflow: "hidden", boxShadow: "0 20px 60px rgba(106,63,171,0.12), 0 4px 16px rgba(0,0,0,0.06)", marginTop: "0" }}>

        {/* Header */}
        <div style={{ padding: "20px 24px", background: BRAND.primary, display: "flex", alignItems: "center", gap: "12px" }}>
          <button className="back-btn" onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center", color: "#ddd6fe", fontSize: "20px" }}>
            ←
          </button>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", overflow: "hidden", flexShrink: 0 }}>
            <img src={logo} alt="DF Muses" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ color: "#ffffff", fontSize: FONT_SIZE.xl, fontWeight: "bold" }}>Calculadora</div>
            <div style={{ color: "#ddd6fe", fontSize: FONT_SIZE.sm }}>Calorias e macronutrientes</div>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: "24px", background: "#fdfbff", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Age / Weight / Height */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Idade</label>
              <input type="number" placeholder="anos" value={form.age} onChange={(e) => set("age", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Peso (kg)</label>
              <input type="number" placeholder="kg" value={form.weight} onChange={(e) => set("weight", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Altura (cm)</label>
              <input type="number" placeholder="cm" value={form.height} onChange={(e) => set("height", e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* Sex */}
          <div>
            <label style={labelStyle}>Sexo</label>
            <div style={{ display: "flex", gap: "10px" }}>
              {[{ v: "female", l: "Feminino" }, { v: "male", l: "Masculino" }].map(({ v, l }) => (
                <button key={v} className={`pill-btn${form.sex === v ? " active" : ""}`} onClick={() => set("sex", v)}>{l}</button>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div>
            <label style={labelStyle}>Nível de atividade</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {ACTIVITY_LEVELS.map(({ label, factor, desc }) => (
                <button key={factor} className={`pill-btn${form.activity === factor ? " active" : ""}`} onClick={() => set("activity", factor)} style={{ textAlign: "left", borderRadius: "12px", padding: "10px 14px" }}>
                  <div style={{ fontWeight: "600" }}>{label}</div>
                  <div style={{ fontSize: "13px", opacity: 0.75, marginTop: "2px" }}>{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div>
            <label style={labelStyle}>Objetivo</label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {GOALS.map(({ label, multiplier, emoji }) => (
                <button key={multiplier} className={`pill-btn${form.goal === multiplier ? " active" : ""}`} onClick={() => set("goal", multiplier)}>{emoji} {label}</button>
              ))}
            </div>
          </div>

          {/* Calculate button */}
          <button
            className="calc-btn"
            onClick={calculate}
            style={{ padding: "14px", background: `linear-gradient(135deg, ${BRAND.primaryLight}, ${BRAND.primary})`, border: "none", borderRadius: "14px", color: "#fff", fontSize: FONT_SIZE.lg, fontWeight: "bold", fontFamily: "inherit", cursor: "pointer", boxShadow: "0 4px 14px rgba(106,63,171,0.4)", transition: "all 0.2s" }}
          >
            Calcular
          </button>

          {/* Result */}
          {result && (
            <div style={{ background: "#f0ebff", border: "1px solid #ddd6fe", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ fontSize: FONT_SIZE.lg, fontWeight: "bold", color: BRAND.primary, textAlign: "center" }}>
                Resultado
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", textAlign: "center" }}>
                {[
                  { label: "TMB", value: result.bmr, unit: "kcal/dia", tip: "Taxa metabólica basal" },
                  { label: "TDEE", value: result.tdee, unit: "kcal/dia", tip: "Gasto total com atividade" },
                  { label: "Meta", value: result.target, unit: "kcal/dia", tip: "Calorias para seu objetivo" },
                ].map(({ label, value, unit, tip }) => (
                  <div key={label} style={{ background: "#fff", borderRadius: "12px", padding: "12px 8px", border: "1px solid #ddd6fe" }}>
                    <div style={{ fontSize: "12px", color: "#a78bca", marginBottom: "4px" }}>{tip}</div>
                    <div style={{ fontSize: FONT_SIZE.xl, fontWeight: "bold", color: BRAND.primary }}>{value}</div>
                    <div style={{ fontSize: "13px", color: "#5A3691" }}>{unit}</div>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: FONT_SIZE.sm, fontWeight: "600", color: "#5A3691", marginBottom: "10px" }}>Macronutrientes sugeridos</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { label: "Proteínas", value: result.protein, color: "#7B56B6" },
                    { label: "Carboidratos", value: result.carbs, color: "#9B76D6" },
                    { label: "Gorduras", value: result.fat, color: "#B596F0" },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", borderRadius: "10px", padding: "10px 14px", border: "1px solid #ddd6fe" }}>
                      <span style={{ color: "#1a0a2e", fontSize: FONT_SIZE.base }}>{label}</span>
                      <span style={{ color, fontWeight: "bold", fontSize: FONT_SIZE.base }}>{value}g / dia</span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => navigate("/")} style={{ padding: "12px", background: "none", border: `2px solid ${BRAND.primary}`, borderRadius: "12px", color: BRAND.primary, fontSize: FONT_SIZE.base, fontWeight: "600", fontFamily: "inherit", cursor: "pointer", transition: "all 0.2s" }}>
                Usar o assistente para substituições
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
