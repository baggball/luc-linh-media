import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import FreePromptViewer from "@/components/prompts/FreePromptViewer";
import { createClient } from "@/lib/supabase/server";
import { FREE_PROMPT_SEEDS } from "@/lib/free-prompt-seeds";
import type { FreePrompt } from "@/lib/types";

export const revalidate = 0;
export const metadata = {
  title: "Prompt AI miễn phí cho ảnh, video & bán hàng",
  description:
    "Dùng thử prompt AI tiếng Việt miễn phí cho video KOC, ảnh sản phẩm, kịch bản bán hàng và Veo 3.",
  alternates: { canonical: "/prompt-mien-phi" },
};

export default async function PromptMienPhiPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("free_prompts").select("*").order("created_at", { ascending: false });
  const dbPrompts = (data ?? []) as FreePrompt[];
  const dbIds = new Set(dbPrompts.map((prompt) => prompt.id));
  const prompts = [...dbPrompts, ...FREE_PROMPT_SEEDS.filter((prompt) => !dbIds.has(prompt.id))];

  return (
    <AppShell>
      <div className="content-wrap">
        {prompts.length > 0 ? (
          <FreePromptViewer prompts={prompts} />
        ) : (
          <div className="empty-state" style={{ margin: "60px 0" }}>
            Chưa có prompt miễn phí nào.{" "}
            <Link href="/admin/them-prompt">Thêm prompt đầu tiên →</Link>
          </div>
        )}
      </div>
      <Footer />
    </AppShell>
  );
}
