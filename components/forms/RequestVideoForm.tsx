"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import FormPrivacyConsent from "./FormPrivacyConsent";

export default function RequestVideoForm() {
  const [loaiVideo, setLoaiVideo] = useState("");
  const [nenTang, setNenTang] = useState("");
  const [moTa, setMoTa] = useState("");
  const [thoiLuong, setThoiLuong] = useState("8 giây");
  const [nganSach, setNganSach] = useState("Dưới 500.000đ");
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
      kind: "video_request",
      name: ten,
      email,
      phone_zalo: zalo,
      payload: { loai_video: loaiVideo, nen_tang: nenTang, mo_ta: moTa, thoi_luong: thoiLuong, ngan_sach: nganSach, deadline },
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
            <span className="k">Loại video</span>
            <span className="v">{loaiVideo}</span>
          </div>
          <div className="row">
            <span className="k">Nền tảng</span>
            <span className="v">{nenTang}</span>
          </div>
          <div className="row">
            <span className="k">Thời lượng</span>
            <span className="v">{thoiLuong}</span>
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
      <h2>Mô tả yêu cầu video của bạn</h2>
      <p className="sub">Điền càng chi tiết, báo giá và bản dựng thử sẽ càng sát với mong muốn của bạn.</p>

      {error && <p style={{ color: "var(--coral)", fontSize: 13.5, marginBottom: 16 }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="loai-video">Loại video</label>
            <select id="loai-video" required value={loaiVideo} onChange={(e) => setLoaiVideo(e.target.value)}>
              <option value="">— Chọn loại video —</option>
              <option>Quảng cáo sản phẩm</option>
              <option>Video KOC / thử đồ</option>
              <option>Video bất động sản</option>
              <option>Video ẩm thực</option>
              <option>Khác</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="nen-tang">Nền tảng đăng</label>
            <select id="nen-tang" required value={nenTang} onChange={(e) => setNenTang(e.target.value)}>
              <option value="">— Chọn nền tảng —</option>
              <option>TikTok</option>
              <option>YouTube Shorts</option>
              <option>Instagram Reels</option>
              <option>Facebook</option>
              <option>Khác</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="mo-ta">Mô tả ý tưởng</label>
          <textarea
            id="mo-ta"
            placeholder="Ví dụ: Video quảng cáo son môi 8 giây, ánh sáng studio, sản phẩm xoay 360°, kết thúc bằng logo thương hiệu..."
            required
            value={moTa}
            onChange={(e) => setMoTa(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="thoi-luong">Thời lượng mong muốn</label>
            <select id="thoi-luong" value={thoiLuong} onChange={(e) => setThoiLuong(e.target.value)}>
              <option>8 giây</option>
              <option>15 giây</option>
              <option>30 giây</option>
              <option>60 giây trở lên</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="ngan-sach">Ngân sách dự kiến</label>
            <select id="ngan-sach" value={nganSach} onChange={(e) => setNganSach(e.target.value)}>
              <option>Dưới 500.000đ</option>
              <option>500.000đ – 1.500.000đ</option>
              <option>1.500.000đ – 3.000.000đ</option>
              <option>Trên 3.000.000đ</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="deadline">Deadline mong muốn</label>
          <input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>

        <div className="divider-label">Thông tin liên hệ</div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="ten">Họ và tên</label>
            <input id="ten" type="text" placeholder="Nguyễn Văn A" autoComplete="name" minLength={2} required value={ten} onChange={(e) => setTen(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="lien-he-email">Email</label>
            <input id="lien-he-email" type="email" placeholder="ban@vidu.com" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="zalo">Số điện thoại / Zalo</label>
          <input id="zalo" type="tel" placeholder="09xx xxx xxx" autoComplete="tel" inputMode="tel" minLength={9} required value={zalo} onChange={(e) => setZalo(e.target.value)} />
        </div>

        <FormPrivacyConsent id="video-privacy-consent" />
        <button type="submit" className="btn btn-primary" disabled={sending} style={{ width: "100%", padding: 14 }}>
          {sending ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>
      </form>
    </div>
  );
}
