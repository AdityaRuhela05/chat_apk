"use client";

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

let socket;

export default function ChatPage() {
  const [username, setUsername] = useState("");
  const [receiver, setReceiver] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // ✅ Setup username + socket
  useEffect(() => {
    const user = localStorage.getItem("chat-username");
    if (!user) return;
    setUsername(user);

    socket = io("http://localhost:3001");
    socket.emit("register_user", user);

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [
        ...prev,
        { sender: msg.sender, text: msg.text, me: false },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ✅ Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Load chat history function
  async function loadHistory() {
    if (!username || !receiver) return;
    try {
      const res = await fetch(
        `/api/messages?user1=${username}&user2=${receiver}`
      );

      if (!res.ok) {
        console.error("Error fetching messages:", await res.text());
        return;
      }

      const data = await res.json();
      setMessages(
        data.map((m) => ({
          sender: m.sender,
          text: m.text,
          me: m.sender === username,
        }))
      );
    } catch (err) {
      console.error("❌ JSON parse error:", err);
    }
  }

  // ✅ Auto fetch when receiver changes
  useEffect(() => {
    if (receiver.trim()) {
      loadHistory();
    }
  }, [receiver]);

  // ✅ Send message
  const sendMessage = () => {
    if (!receiver || !text.trim()) return;

    socket.emit("send_message", {
      sender: username,
      receiver,
      text,
    });

    setMessages((prev) => [...prev, { sender: username, text, me: true }]);
    setText("");
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f3f4f6" }}>

      {/* TOP BAR */}
      <div style={{ background: "#2563eb", padding: "15px", color: "white", fontWeight: "bold", fontSize: "16px" }}>
        Logged in as: {username}
      </div>

      {/* RECEIVER INPUT */}
      <div style={{ padding: "12px", background: "white", borderBottom: "1px solid #ddd" }}>
        <input
          placeholder="Enter username to chat..."
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          onBlur={() => loadHistory()}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "15px",
          }}
        />
      </div>

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.me ? "flex-end" : "flex-start", marginBottom: "8px" }}>
            <div
              style={{
                maxWidth: "70%",
                padding: "10px 14px",
                borderRadius: "10px",
                background: m.me ? "#2563eb" : "#e5e7eb",
                color: m.me ? "white" : "black",
                fontSize: "14px",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BOX */}
      <div style={{
        display: "flex",
        padding: "10px",
        background: "white",
        borderTop: "1px solid #ddd"
      }}>
        <input
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "15px"
          }}
          placeholder="Type message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          style={{
            marginLeft: "10px",
            padding: "10px 16px",
            borderRadius: "6px",
            border: "none",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
            fontSize: "15px"
          }}
        >   
          Send
        </button>
      </div>
    </div>
  );
}
