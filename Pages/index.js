// pages/index.js
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../styles/Login.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return alert("Please enter a username");
    // Pass username via query param
    router.push(`/chat?username=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Welcome — Login</h1>
        <input
          className={styles.input}
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={30}
        />
        <button className={styles.button} type="submit">Connect</button>
      </form>
    </div>
  );
}
