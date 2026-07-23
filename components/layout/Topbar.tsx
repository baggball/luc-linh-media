import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import UserMenu from "./UserMenu";

export default async function Topbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    isAdmin = profile?.role === "admin";
  }

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <Link className="topbar-mobile-brand" href="/" aria-label="Lục Linh Video AI — Trang chủ">
          <Image src="/brand/luc-linh-logo-gold.png" alt="" width={38} height={38} priority />
        </Link>
        <div className="search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input type="text" placeholder="Tìm prompt, chatbot, workflow..." />
        </div>
        <div className="topbar-right">
          <button className="icon-btn" aria-label="Giỏ hàng">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6" />
              <circle cx="9" cy="21" r="1" />
              <circle cx="18" cy="21" r="1" />
            </svg>
          </button>
          {user ? (
            <UserMenu name={(user.user_metadata?.full_name as string) || user.email || "Tài khoản"} isAdmin={isAdmin} />
          ) : (
            <Link className="btn btn-primary" href="/dang-nhap" style={{ display: "inline-block" }}>
              Đăng ký / Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
