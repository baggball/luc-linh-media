"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UserMenu({ name, isAdmin }: { name: string; isAdmin?: boolean }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <details className="user-menu">
      <summary className="user-menu-trigger" aria-label="Mở menu tài khoản">
        <span className="user-avatar" aria-hidden="true">
          {name.trim().charAt(0).toUpperCase() || "T"}
        </span>
        <span className="user-menu-name">{name}</span>
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="user-menu-panel">
        <Link href="/tai-khoan/san-pham">Sản phẩm của tôi</Link>
        {isAdmin && (
          <>
            <div className="user-menu-divider" />
            <Link href="/admin/dashboard">Dashboard kinh doanh</Link>
            <Link href="/admin/quan-ly-san-pham">Quản lý sản phẩm</Link>
            <Link href="/admin/them-prompt">Thêm prompt</Link>
            <Link href="/admin/don-hang">Đơn hàng</Link>
            <Link href="/admin/yeu-cau">Yêu cầu khách</Link>
          </>
        )}
        <div className="user-menu-divider" />
        <button type="button" onClick={handleSignOut}>Đăng xuất</button>
      </div>
    </details>
  );
}
