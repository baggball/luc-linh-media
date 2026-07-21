"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import styles from "../auth.module.css";

export default function DangKyPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const pwMismatch = password2.length > 0 && password2 !== password;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== password2) {
      setError("Mật khẩu xác nhận chưa khớp.");
      return;
    }
    if (!agree) {
      setError("Bạn cần đồng ý với Điều khoản dịch vụ để tiếp tục.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className={styles.authShell}>
        <AuthBrandPanel />
        <div className={styles.authFormPanel}>
          <div className={styles.authCard}>
            <div className={styles.successView}>
              <div className={styles.envIcon}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16v12H4z" />
                  <path d="M4 7l8 6 8-6" />
                </svg>
              </div>
              <h1>Kiểm tra hộp thư của bạn</h1>
              <p>Chúng tôi đã gửi email xác nhận đến</p>
              <p className={styles.successEmail}>{email}</p>
              <p style={{ marginTop: 14 }}>
                Bấm vào liên kết trong email để kích hoạt tài khoản. Liên kết có hiệu lực trong 24 giờ.
              </p>
              <Link href="/dang-nhap" className={styles.btn + " " + styles.btnPrimary} style={{ display: "block", marginTop: 22, textAlign: "center" }}>
                Đến trang đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authShell}>
      <AuthBrandPanel />
      <div className={styles.authFormPanel}>
        <div className={styles.authCard}>
          <Link className={styles.backLink} href="/">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Về trang chủ
          </Link>
          <h1>Tạo tài khoản</h1>
          <p className={styles.authSub}>
            Đã có tài khoản? <Link href="/dang-nhap">Đăng nhập →</Link>
          </p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="fullname">Họ và tên</label>
              <div className={styles.inputWrap}>
                <input
                  id="fullname"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="reg-email">Email</label>
              <div className={styles.inputWrap}>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="ban@vidu.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="reg-password">Mật khẩu</label>
              <div className={styles.inputWrap}>
                <input
                  id="reg-password"
                  type={showPw ? "text" : "password"}
                  placeholder="Tối thiểu 8 ký tự"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.toggleEye}
                  aria-label="Hiện mật khẩu"
                  onClick={() => setShowPw((v) => !v)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="reg-password2">Xác nhận mật khẩu</label>
              <div className={styles.inputWrap}>
                <input
                  id="reg-password2"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                />
              </div>
              {pwMismatch && <div className={styles.hint + " " + styles.hintError}>Mật khẩu xác nhận chưa khớp</div>}
            </div>
            <label className={styles.agree}>
              <input type="checkbox" required checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span>
                Tôi đồng ý với <Link href="/dieu-khoan-dich-vu">Điều khoản dịch vụ</Link> &amp; Chính sách bảo mật của Lục Linh Media.
              </span>
            </label>
            <button type="submit" className={styles.btn + " " + styles.btnPrimary} disabled={loading}>
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản miễn phí"}
            </button>
          </form>

          <p className={styles.formFoot}>Bằng việc đăng ký, bạn xác nhận đã đủ 16 tuổi trở lên.</p>
        </div>
      </div>
    </div>
  );
}

function AuthBrandPanel() {
  return (
    <div className={styles.authBrand}>
      <Link className={styles.brandRow} href="/">
        <span className={styles.brandMark}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
          </svg>
        </span>
        <span className={styles.brandWord}>
          Lục Linh<small>Media</small>
        </span>
      </Link>

      <div className={styles.brandMid}>
        <h2>Tạo tài khoản, mở khóa toàn bộ kho prompt</h2>
        <p>Miễn phí khởi tạo, nâng cấp bất cứ lúc nào. Không cần thẻ tín dụng để bắt đầu.</p>
        <ul className={styles.featList}>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            5 prompt miễn phí ngay khi đăng ký
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Đồng bộ prompt trên mọi thiết bị
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Hủy gói bất cứ lúc nào, không ràng buộc
          </li>
        </ul>
      </div>

      <div className={styles.statRow}>
        <div className={styles.stat}>
          <b className="font-mono">6.200+</b>
          <span>người dùng</span>
        </div>
        <div className={styles.stat}>
          <b className="font-mono">4.9/5</b>
          <span>đánh giá</span>
        </div>
        <div className={styles.stat}>
          <b className="font-mono">24.800+</b>
          <span>lượt mua</span>
        </div>
      </div>
    </div>
  );
}
