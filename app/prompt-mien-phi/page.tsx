import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import FreePromptViewer from "@/components/prompts/FreePromptViewer";
import { createClient } from "@/lib/supabase/server";
import type { FreePrompt } from "@/lib/types";

export const revalidate = 0;
export const metadata = { title: "Prompt miễn phí" };

export default async function PromptMienPhiPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("free_prompts").select("*").order("created_at", { ascending: false });
  const prompts = (data ?? []) as FreePrompt[];

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
