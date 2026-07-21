"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "../auth.module.css";

export default function DangNhapPage() {
  return (
    <Suspense fallback={null}>
      <DangNhapForm />
    </Suspense>
  );
}

function DangNhapForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Email hoặc mật khẩu không đúng."
          : signInError.message
      );
      return;
    }
    router.push(searchParams.get("next") || "/");
    router.refresh();
  }

  return (
    <div className={styles.authShell}>
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
          <h2>Chào mừng quay lại với kho prompt của bạn</h2>
          <p>Đăng nhập để tiếp tục dùng chatbot, workflow và prompt đã mua — đồng bộ trên mọi thiết bị.</p>
          <ul className={styles.featList}>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              1.200+ prompt &amp; chatbot chuyên nghiệp
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Cập nhật chatbot mới mỗi tuần
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Hoàn tiền trong 7 ngày nếu không hài lòng
            </li>
          </ul>
        </div>

        <div className={styles.terminal}>
          <div className={styles.terminalBar}>
            <span></span>
            <span></span>
            <span></span>
            <span className="lbl">mauailamvideo.com — zsh</span>
          </div>
          <div className={styles.terminalBody}>
            → <b>đăng-nhập --tai-khoan=ban@vidu.com</b>
            <br />
            ✓ Đồng bộ prompt đã lưu
            <br />
            ✓ Sẵn sàng dùng ngay
          </div>
        </div>
      </div>

      <div className={styles.authFormPanel}>
        <div className={styles.authCard}>
          <Link className={styles.backLink} href="/">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Về trang chủ
          </Link>
          <h1>Đăng nhập</h1>
          <p className={styles.authSub}>
            Chưa có tài khoản? <Link href="/dang-ky">Tạo tài khoản miễn phí →</Link>
          </p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputWrap}>
                <input
                  id="email"
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
              <label htmlFor="password">Mật khẩu</label>
              <div className={styles.inputWrap}>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  required
                  autoComplete="current-password"
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
            <div className={styles.rowBetween}>
              <label className={styles.remember}>
                <input type="checkbox" /> Ghi nhớ đăng nhập
              </label>
              <Link href="/quen-mat-khau">Quên mật khẩu?</Link>
            </div>
            <button type="submit" className={styles.btn + " " + styles.btnPrimary} disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className={styles.formFoot}>
            Bằng việc đăng nhập, bạn đồng ý với <Link href="/dieu-khoan-dich-vu">Điều khoản dịch vụ</Link> &amp; Chính sách bảo mật.
          </p>
        </div>
      </div>
    </div>
  );
}
