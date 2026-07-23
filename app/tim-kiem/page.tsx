import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tìm kiếm sản phẩm",
  description: "Tìm chatbot, workflow, ứng dụng và prompt video AI trên Lục Linh Video AI.",
  robots: { index: false, follow: true },
};

export default async function TimKiemPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = rawQuery?.trim().slice(0, 80) ?? "";
  let products: Product[] = [];

  if (query.length >= 2) {
    const safeQuery = query.replace(/[^\p{L}\p{N}\s-]/gu, " ").replace(/\s+/g, " ").trim();
    if (safeQuery) {
      const supabase = await createClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_published", true)
        .or(`title.ilike.%${safeQuery}%,description.ilike.%${safeQuery}%`)
        .order("created_at", { ascending: false })
        .limit(24);
      products = (data ?? []) as Product[];
    }
  }

  return (
    <AppShell>
      <main className="content-wrap search-page">
        <div className="pg-head">
          <span className="eyebrow">TÌM NHANH CÔNG CỤ PHÙ HỢP</span>
          <h1>Kết quả tìm kiếm</h1>
          {query ? (
            <p>
              {products.length > 0
                ? `Tìm thấy ${products.length} sản phẩm cho “${query}”.`
                : `Chưa tìm thấy sản phẩm phù hợp với “${query}”.`}
            </p>
          ) : (
            <p>Nhập ít nhất 2 ký tự vào ô tìm kiếm phía trên.</p>
          )}
        </div>

        {products.length > 0 ? (
          <div className="grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state search-empty">
            <b>Chưa có kết quả phù hợp.</b>
            <span>Thử từ khóa ngắn hơn như “KOC”, “gia dụng”, “Veo 3” hoặc xem toàn bộ kho sản phẩm.</span>
            <Link className="btn btn-primary" href="/chatbot">
              Xem kho Chatbot
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </AppShell>
  );
}
