"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (!username.trim()) return alert("Enter username");
    localStorage.setItem("chat-username", username);
    router.push("/chat");
  };

  const pageStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to bottom right, #2563eb, #60a5fa)",
    fontFamily: "Arial, sans-serif",
  };

  const boxStyle = {
    background: "white",
    padding: "35px",
    borderRadius: "12px",
    width: "350px",
    boxShadow: "0px 4px 15px rgba(0,0,0,0.15)",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#2563eb",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "16px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.2s",
  };

  const buttonHover = {
    background: "#1e4fcf",
  };

  return (
    <div style={pageStyle}>
      <div style={boxStyle}>
        <div style={titleStyle}>Login to Chat 💬</div>

        <input
          style={inputStyle}
          type="text"
          placeholder="Enter username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <button
          style={buttonStyle}
          onMouseEnter={(e) => (e.target.style.background = buttonHover.background)}
          onMouseLeave={(e) => (e.target.style.background = buttonStyle.background)}
          onClick={handleLogin}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
