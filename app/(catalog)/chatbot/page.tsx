import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import ProductCatalog from "@/components/catalog/ProductCatalog";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

export const revalidate = 0;

export const metadata = { title: "Chatbot GPT" };

export default async function ChatbotCatalogPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .eq("type", "chatbot")
    .order("created_at", { ascending: false });

  const products = (data ?? []) as Product[];

  return (
    <AppShell>
      <div className="content-wrap">
        <div className="pg-head">
          <div className="crumb">
            <Link href="/">Trang chủ</Link>
            <span className="sep">/</span>
            <span className="cur">Chatbot</span>
          </div>
        </div>
        <div className="pg-head" style={{ paddingTop: 8 }}>
          <h1>
            Chatbot GPT cho <em>người sáng tạo &amp; bán hàng</em>
          </h1>
          <p>Chatbot dựng sẵn theo ngành hàng — dán thẳng vào ChatGPT và dùng ngay, không cần chỉnh prompt.</p>
        </div>

        <section className="section" style={{ padding: "26px 0 60px" }}>
          <ProductCatalog products={products} ctaLabel="Yêu cầu Custom Chatbot" ctaHref="/custom-chatbot" />
        </section>
      </div>
      <Footer />
    </AppShell>
  );
}
