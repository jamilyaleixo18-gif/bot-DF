import { useState, useRef, useEffect } from "react";
import Message from "./components/Message";
import TypingIndicator from "./components/TypingIndicator";
import { SUGGESTIONS, INITIAL_MESSAGE, BRAND, FONT_FAMILY, FONT_SIZE } from "./constants";
import logo from "./img/logo.jpg";

export default function NutritionChat() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      const reply = data?.reply || "Desculpe, não consegui processar sua mensagem.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro ao conectar. Tente novamente." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-wrapper">
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        *, *::before, *::after { box-sizing: border-box; }
        textarea::placeholder { color: #a78bca; }
        textarea:focus { outline: none; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f5f0ff; }
        ::-webkit-scrollbar-thumb { background: #c4a0f5; border-radius: 3px; }
        .suggestion-btn:hover { background: #ede5ff !important; border-color: ${BRAND.primary} !important; color: ${BRAND.primaryDark} !important; }
        .send-btn:hover { transform: scale(1.05); }
        .send-btn:active { transform: scale(0.97); }

        .chat-wrapper {
          min-height: 100vh;
          min-height: 100dvh;
          background: #ffffff;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          font-family: ${FONT_FAMILY};
          padding: 12px 20px 20px;
        }
        .chat-card {
          width: 100%;
          max-width: 680px;
          height: 90vh;
          height: 90dvh;
          max-height: 780px;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e0d0f8;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(106,63,171,0.12), 0 4px 16px rgba(0,0,0,0.06);
        }
        .chat-header {
          padding: 16px 20px;
          flex-shrink: 0;
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 14px 16px 6px;
          background: #fdfbff;
          min-height: 0;
        }
        .chat-suggestions {
          padding: 0 16px 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          background: #fdfbff;
          flex-shrink: 0;
        }
        .chat-input-area {
          padding: 12px 16px;
          border-top: 1px solid #e0d0f8;
          background: #ffffff;
          display: flex;
          gap: 10px;
          align-items: flex-end;
          flex-shrink: 0;
        }
        .chat-textarea {
          flex: 1;
          min-width: 0;
          background: #f5f0ff;
          border: 1px solid #ddd6fe;
          border-radius: 12px;
          padding: 10px 12px;
          color: #1a0a2e;
          font-size: 16px;
          font-weight: 500;
          font-family: inherit;
          resize: none;
          line-height: 1.4;
          max-height: 100px;
          overflow-y: auto;
          min-height: 44px;
        }
        .suggestion-btn {
          font-weight: 600;
        }
        @media (max-width: 640px) {
          .chat-wrapper { padding: 0; }
          .chat-card {
            height: 100vh;
            height: 100dvh;
            max-height: none;
            border-radius: 0;
            border: none;
            box-shadow: none;
          }
          .chat-header { padding: 12px 16px; }
          .chat-input-area { padding: 10px 12px 14px; }
        }
      `}</style>

      <div className="chat-card">
        {/* Header */}
        <div
          className="chat-header"
          style={{
            background: BRAND.primary,
            borderBottom: `1px solid ${BRAND.primaryDark}`,
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              overflow: "hidden",
              background: BRAND.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "none",
              flexShrink: 0,
            }}
          >
            <img
              src={logo}
              alt="DF Nutri"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = `<span style="font-size:16px;font-weight:bold;color:${BRAND.primary}">DF</span>`;
              }}
            />
          </div>
          <div>
            <div style={{ color: "#ffffff", fontSize: FONT_SIZE.xl, fontWeight: "bold", letterSpacing: "0.3px" }}>
              DF Nutri
            </div>
            <div style={{ color: "#ddd6fe", fontSize: FONT_SIZE.sm, marginTop: "2px" }}>
              Sugestões de pratos e substituições
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Quick suggestions */}
        {messages.length <= 1 && (
          <div className="chat-suggestions">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                className="suggestion-btn"
                onClick={() => sendMessage(s)}
                style={{
                  padding: "6px 12px",
                  background: "#f5f0ff",
                  border: "1px solid #ddd6fe",
                  borderRadius: "20px",
                  color: BRAND.primary,
                  fontSize: FONT_SIZE.sm,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="chat-input-area">
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite ingredientes ou alimento..."
            rows={1}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
            }}
          />
          <button
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background:
                loading || !input.trim()
                  ? "#e0d0f8"
                  : `linear-gradient(135deg, ${BRAND.primaryLight}, ${BRAND.primary})`,
              border: "none",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              flexShrink: 0,
              boxShadow:
                loading || !input.trim()
                  ? "none"
                  : "0 4px 14px rgba(106,63,171,0.4)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                stroke={loading || !input.trim() ? "#a78bca" : "#fff"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
