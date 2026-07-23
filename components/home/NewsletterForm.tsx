"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import styles from "@/app/home.module.css";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from("inquiries").insert({
      kind: "contact",
      name: "Đăng ký nhận tin",
      email,
      payload: { chu_de: "Đăng ký nhận tin", noi_dung: "Khách đồng ý nhận prompt mới và ưu đãi qua email.", source: "homepage_newsletter" },
    });
    setSending(false);
    if (insertError) {
      setError("Chưa thể đăng ký lúc này. Vui lòng thử lại hoặc liên hệ đội ngũ hỗ trợ.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return <p style={{ color: "var(--success)", fontWeight: 700, fontSize: 14 }}>✓ Đã đăng ký thành công. Hãy kiểm tra email {email}.</p>;
  }

  return (
    <div className={styles.newsletterWrap}>
      <form className={styles.ctaForm} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email@cuaban.com"
          aria-label="Email của bạn"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={sending}>
          {sending ? "Đang gửi..." : "Đăng ký"}
        </button>
      </form>
      <small>
        Khi đăng ký, bạn đồng ý với <Link href="/chinh-sach-bao-mat">chính sách bảo mật</Link>.
      </small>
      {error && <p className={styles.newsletterError}>{error}</p>}
    </div>
  );
}
