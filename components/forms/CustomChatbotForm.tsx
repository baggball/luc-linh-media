"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import FormPrivacyConsent from "./FormPrivacyConsent";

export default function CustomChatbotForm() {
  const [nganhHang, setNganhHang] = useState("");
  const [nenTang, setNenTang] = useState("");
  const [tinhNang, setTinhNang] = useState("");
  const [quyMo, setQuyMo] = useState("Dưới 20 câu");
  const [nganSach, setNganSach] = useState("Dưới 1.000.000đ");
  const [deadline, setDeadline] = useState("");
  const [ten, setTen] = useState("");
  const [email, setEmail] = useState("");
  const [zalo, setZalo] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from("inquiries").insert({
      kind: "custom_chatbot",
      name: ten,
      email,
      phone_zalo: zalo,
      payload: { nganh_hang: nganhHang, nen_tang: nenTang, tinh_nang: tinhNang, quy_mo: quyMo, ngan_sach: nganSach, deadline },
    });
    setSending(false);
    if (insertError) {
      setError("Chưa thể gửi yêu cầu lúc này. Vui lòng thử lại hoặc liên hệ qua Zalo.");
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
        <h2>Đã nhận yêu cầu của bạn!</h2>
        <p>Đội ngũ Lục Linh Video AI sẽ liên hệ trong vòng 24 giờ qua email hoặc Zalo bạn đã cung cấp để báo giá chi tiết.</p>
        <div className="success-summary">
          <div className="row">
            <span className="k">Người gửi</span>
            <span className="v">{ten}</span>
          </div>
          <div className="row">
            <span className="k">Ngành hàng</span>
            <span className="v">{nganhHang}</span>
          </div>
          <div className="row">
            <span className="k">Nền tảng</span>
            <span className="v">{nenTang}</span>
          </div>
          <div className="row">
            <span className="k">Quy mô train</span>
            <span className="v">{quyMo}</span>
          </div>
          <div className="row">
            <span className="k">Ngân sách</span>
            <span className="v">{nganSach}</span>
          </div>
        </div>
        <Link className="btn btn-primary" href="/" style={{ display: "block", textAlign: "center" }}>
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="form-card">
      <h2>Mô tả chatbot bạn cần</h2>
      <p className="sub">Điền càng chi tiết, chatbot dựng thử sẽ càng sát với ngành hàng và tính cách bạn mong muốn.</p>

      {error && <p style={{ color: "var(--coral)", fontSize: 13.5, marginBottom: 16 }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="nganh-hang">Ngành hàng</label>
            <select id="nganh-hang" required value={nganhHang} onChange={(e) => setNganhHang(e.target.value)}>
              <option value="">— Chọn ngành hàng —</option>
              <option>Thời trang</option>
              <option>Mỹ phẩm</option>
              <option>Gia dụng</option>
              <option>Sách</option>
              <option>Ẩm thực</option>
              <option>Khác</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="nen-tang-cb">Nền tảng triển khai</label>
            <select id="nen-tang-cb" required value={nenTang} onChange={(e) => setNenTang(e.target.value)}>
              <option value="">— Chọn nền tảng —</option>
              <option>ChatGPT (GPTs)</option>
              <option>Zalo OA</option>
              <option>Website riêng</option>
              <option>Facebook Messenger</option>
              <option>Khác</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="tinh-nang">Tính năng mong muốn</label>
          <textarea
            id="tinh-nang"
            placeholder="Ví dụ: Chatbot tư vấn size quần áo, trả lời câu hỏi chất liệu, gợi ý phối đồ và chốt đơn tự động..."
            required
            value={tinhNang}
            onChange={(e) => setTinhNang(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="quy-mo">Số lượng câu hỏi cần train</label>
            <select id="quy-mo" value={quyMo} onChange={(e) => setQuyMo(e.target.value)}>
              <option>Dưới 20 câu</option>
              <option>20 – 50 câu</option>
              <option>50 – 100 câu</option>
              <option>Trên 100 câu</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="ngan-sach-cb">Ngân sách dự kiến</label>
            <select id="ngan-sach-cb" value={nganSach} onChange={(e) => setNganSach(e.target.value)}>
              <option>Dưới 1.000.000đ</option>
              <option>1.000.000đ – 3.000.000đ</option>
              <option>3.000.000đ – 6.000.000đ</option>
              <option>Trên 6.000.000đ</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="deadline-cb">Deadline mong muốn</label>
          <input id="deadline-cb" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>

        <div className="divider-label">Thông tin liên hệ</div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="ten-cb">Họ và tên</label>
            <input id="ten-cb" type="text" placeholder="Nguyễn Văn A" autoComplete="name" minLength={2} required value={ten} onChange={(e) => setTen(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="lien-he-email-cb">Email</label>
            <input id="lien-he-email-cb" type="email" placeholder="ban@vidu.com" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="zalo-cb">Số điện thoại / Zalo</label>
          <input id="zalo-cb" type="tel" placeholder="09xx xxx xxx" autoComplete="tel" inputMode="tel" minLength={9} required value={zalo} onChange={(e) => setZalo(e.target.value)} />
        </div>

        <FormPrivacyConsent id="chatbot-privacy-consent" />
        <button type="submit" className="btn btn-primary" disabled={sending} style={{ width: "100%", padding: 14 }}>
          {sending ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>
      </form>
    </div>
  );
}
