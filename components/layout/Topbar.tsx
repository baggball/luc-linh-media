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
        <form className="search" action="/tim-kiem" role="search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input name="q" type="search" placeholder="Tìm prompt, chatbot, workflow..." aria-label="Tìm sản phẩm" />
          <button className="search-submit" type="submit" aria-label="Tìm kiếm">
            Tìm
          </button>
        </form>
        <div className="topbar-right">
          <Link className="icon-btn" href="/tai-khoan/san-pham" aria-label="Sản phẩm đã mua" title="Sản phẩm đã mua">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z" />
              <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
            </svg>
          </Link>
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
