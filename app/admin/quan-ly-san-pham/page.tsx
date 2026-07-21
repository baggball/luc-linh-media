import Link from "next/link";
import AdminProductManager from "@/components/admin/AdminProductManager";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

export const revalidate = 0;
export const metadata = { title: "Quản lý sản phẩm" };

export default async function QuanLySanPhamPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, product_private_content(workflow_link, video_url)")
    .order("created_at", { ascending: false });
  const products = (data ?? []).map((row) => {
    const privateContent = Array.isArray(row.product_private_content)
      ? row.product_private_content[0]
      : row.product_private_content;
    const { product_private_content: _privateContent, ...product } = row;
    void _privateContent;
    return {
      ...product,
      workflow_link: privateContent?.workflow_link ?? null,
      video_url: privateContent?.video_url ?? null,
    } as Product;
  });

  return (
    <div className="content-wrap" style={{ padding: 32 }}>
      <div className="crumb" style={{ marginBottom: 20 }}>
        <Link href="/">Trang chủ</Link>
        <span className="sep">/</span>
        <span className="cur">Quản lý sản phẩm</span>
      </div>
      <AdminProductManager initialProducts={products} />
    </div>
  );
}
