import logo from "../img/logo.jpg";
import { BRAND, FONT_SIZE } from "../constants";

export default function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "12px",
        animation: "fadeSlide 0.3s ease forwards",
      }}
    >
      {!isUser && (
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            overflow: "hidden",
            marginRight: "10px",
            flexShrink: 0,
            marginTop: "4px",
          }}
        >
          <img src={logo} alt="DF" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
      )}
      <div
        style={{
          maxWidth: "75%",
          padding: "8px 12px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser
            ? `linear-gradient(135deg, ${BRAND.primaryLight}, ${BRAND.primary})`
            : "#f0ebff",
          color: isUser ? "#ffffff" : "#1a0a2e",
          fontSize: FONT_SIZE.base,
          fontWeight: 400,
          lineHeight: "1.5",
          letterSpacing: "0.01em",
          boxShadow: isUser
            ? "0 2px 12px rgba(106,63,171,0.3)"
            : "0 2px 8px rgba(106,63,171,0.08)",
          whiteSpace: "pre-wrap",
          border: isUser ? "none" : "1px solid #ddd6fe",
        }}
      >
        {msg.content}
      </div>
    </div>
  );
}
