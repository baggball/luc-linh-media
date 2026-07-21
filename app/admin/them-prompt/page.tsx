import Link from "next/link";
import AdminPromptManager from "@/components/admin/AdminPromptManager";
import { createClient } from "@/lib/supabase/server";
import type { FreePrompt } from "@/lib/types";

export const revalidate = 0;
export const metadata = { title: "Thêm prompt" };

export default async function ThemPromptPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("free_prompts").select("*").order("created_at", { ascending: false });
  const prompts = (data ?? []) as FreePrompt[];

  return (
    <div className="content-wrap" style={{ padding: 32 }}>
      <div className="crumb" style={{ marginBottom: 20 }}>
        <Link href="/">Trang chủ</Link>
        <span className="sep">/</span>
        <span className="cur">Thêm prompt</span>
      </div>
      <AdminPromptManager initialPrompts={prompts} />
    </div>
  );
}
