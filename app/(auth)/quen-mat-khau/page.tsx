"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./quen-mat-khau.module.css";

export default function QuenMatKhauPage() {
  return (
    <Suspense fallback={null}>
      <QuenMatKhauFlow />
    </Suspense>
  );
}

function QuenMatKhauFlow() {
  const searchParams = useSearchParams();
  const isResetStep = searchParams.get("step") === "reset";

  const [step, setStep] = useState<1 | 2 | 4>(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [resetDone, setResetDone] = useState(false);

  async function handleRequestReset(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/quen-mat-khau?step=reset")}`,
    });
    setLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setStep(2);
  }

  function handleResend() {
    setResendCooldown(30);
    const supabase = createClient();
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/quen-mat-khau?step=reset")}`,
    });
    const timer = setInterval(() => {
      setResendCooldown((n) => {
        if (n <= 1) {
          clearInterval(timer);
          return 0;
        }
        return n - 1;
      });
    }, 1000);
  }

  async function handleSetNewPassword(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (newPw !== newPw2) {
      setError("Mật khẩu xác nhận chưa khớp.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password: newPw });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setResetDone(true);
  }

  if (isResetStep && !resetDone) {
    return (
      <Card>
        <div className={styles.stepIcon}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            <circle cx="12" cy="16" r="1.5" />
          </svg>
        </div>
        <h1>Đặt mật khẩu mới</h1>
        <p className={styles.sub}>Tạo mật khẩu mới cho tài khoản của bạn.</p>
        {error && <div className={styles.errorBox}>{error}</div>}
        <form onSubmit={handleSetNewPassword}>
          <div className={styles.field}>
            <label htmlFor="new-pw">Mật khẩu mới</label>
            <input
              id="new-pw"
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              required
              minLength={8}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="new-pw2">Xác nhận mật khẩu mới</label>
            <input
              id="new-pw2"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              required
              minLength={8}
              value={newPw2}
              onChange={(e) => setNewPw2(e.target.value)}
            />
            {newPw2 && newPw2 !== newPw && <div className={`${styles.hint} ${styles.hintError}`}>Mật khẩu xác nhận chưa khớp</div>}
          </div>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
            {loading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
          </button>
        </form>
      </Card>
    );
  }

  if (isResetStep && resetDone) {
    return (
      <Card>
        <div className={`${styles.stepIcon} ${styles.ok}`}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1>Đặt lại mật khẩu thành công</h1>
        <p className={styles.sub}>Mật khẩu của bạn đã được cập nhật. Hãy đăng nhập lại bằng mật khẩu mới.</p>
        <Link className={`${styles.btn} ${styles.btnPrimary}`} style={{ display: "block", textAlign: "center" }} href="/dang-nhap">
          Đăng nhập ngay
        </Link>
      </Card>
    );
  }

  if (step === 2) {
    return (
      <Card>
        <div className={`${styles.stepIcon} ${styles.ok}`}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16v12H4z" />
            <path d="M4 7l8 6 8-6" />
          </svg>
        </div>
        <h1>Đã gửi email khôi phục</h1>
        <p className={styles.sub}>
          Chúng tôi vừa gửi liên kết đặt lại mật khẩu đến <b>{email}</b>. Bấm vào liên kết trong email để tiếp tục.
        </p>
        <div className={styles.resendRow}>
          Không thấy email?{" "}
          <button type="button" disabled={resendCooldown > 0} onClick={handleResend}>
            {resendCooldown > 0 ? `Gửi lại sau ${resendCooldown}s` : "Gửi lại"}
          </button>
        </div>
        <div className={styles.backRow}>
          Đã nhớ mật khẩu? <Link href="/dang-nhap">Đăng nhập</Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className={styles.stepIcon}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h1>Quên mật khẩu?</h1>
      <p className={styles.sub}>Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.</p>
      {error && <div className={styles.errorBox}>{error}</div>}
      <form onSubmit={handleRequestReset}>
        <div className={styles.field}>
          <label htmlFor="fp-email">Email</label>
          <input
            id="fp-email"
            type="email"
            placeholder="ban@vidu.com"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi liên kết khôi phục"}
        </button>
      </form>
      <div className={styles.backRow}>
        Đã nhớ mật khẩu? <Link href="/dang-nhap">Đăng nhập</Link>
      </div>
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link className={styles.brandRow} href="/">
          <span className={styles.brandMark}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
            </svg>
          </span>
          <span className={styles.brandWord}>Lục Linh Media</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
