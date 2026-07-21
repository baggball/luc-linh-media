"use client";

import { useState, type FormEvent } from "react";
import styles from "@/app/home.module.css";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setDone(true);
  }

  if (done) {
    return <p style={{ color: "var(--success)", fontWeight: 700, fontSize: 14 }}>Cảm ơn bạn đã đăng ký, {email}!</p>;
  }

  return (
    <form className={styles.ctaForm} onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="email@cuaban.com"
        aria-label="Email của bạn"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn-primary" type="submit">
        Đăng ký
      </button>
    </form>
  );
}
