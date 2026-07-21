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
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--paper)" }}>{name}</span>
      <Link className="btn btn-ghost" href="/tai-khoan/san-pham" style={{ display: "inline-block" }}>
        Sản phẩm của tôi
      </Link>
      {isAdmin && (
        <>
          <Link className="btn btn-ghost" href="/admin/quan-ly-san-pham" style={{ display: "inline-block" }}>
            Quản lý sản phẩm
          </Link>
          <Link className="btn btn-ghost" href="/admin/them-prompt" style={{ display: "inline-block" }}>
            Thêm prompt
          </Link>
          <Link className="btn btn-ghost" href="/admin/don-hang" style={{ display: "inline-block" }}>
            Đơn hàng
          </Link>
          <Link className="btn btn-ghost" href="/admin/yeu-cau" style={{ display: "inline-block" }}>
            Yêu cầu khách
          </Link>
        </>
      )}
      <button className="btn btn-ghost" onClick={handleSignOut}>
        Đăng xuất
      </button>
    </div>
  );
}
