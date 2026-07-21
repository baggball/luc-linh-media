"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UserMenu({ name }: { name: string }) {
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
      <button className="btn btn-ghost" onClick={handleSignOut}>
        Đăng xuất
      </button>
    </div>
  );
}
