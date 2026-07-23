"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from("inquiries").insert({
      kind: "contact",
      name,
      email,
      payload: { chu_de: topic, noi_dung: message },
    });
    setSending(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="form-card success-view">
        <div className="ok-icon">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2>Đã gửi tin nhắn thành công!</h2>
        <p>Cảm ơn bạn đã liên hệ. Đội ngũ Lục Linh Video AI sẽ phản hồi trong vòng 24 giờ qua email bạn đã cung cấp.</p>
        <Link className="btn btn-primary" href="/" style={{ display: "block", textAlign: "center", marginTop: 18 }}>
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="form-card">
      <h2 style={{ textAlign: "center" }}>Gửi tin nhắn cho chúng tôi</h2>
      <p className="sub" style={{ textAlign: "center" }}>
        Điền form bên dưới, đội ngũ sẽ phản hồi qua email bạn cung cấp.
      </p>

      {error && <p style={{ color: "var(--coral)", fontSize: 13.5, marginBottom: 16 }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="lh-ten">Họ và tên</label>
            <input id="lh-ten" type="text" placeholder="Nguyễn Văn A" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="lh-email">Email</label>
            <input id="lh-email" type="email" placeholder="ban@vidu.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="lh-chu-de">Chủ đề</label>
          <select id="lh-chu-de" required value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="">— Chọn chủ đề —</option>
            <option>Hỗ trợ kỹ thuật</option>
            <option>Hợp tác kinh doanh</option>
            <option>Khiếu nại / Hoàn tiền</option>
            <option>Khác</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="lh-noi-dung">Nội dung</label>
          <textarea
            id="lh-noi-dung"
            placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={sending} style={{ width: "100%", padding: 14 }}>
          {sending ? "Đang gửi..." : "Gửi tin nhắn"}
        </button>
      </form>
    </div>
  );
}
