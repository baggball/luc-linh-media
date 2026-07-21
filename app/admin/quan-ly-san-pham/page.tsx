import Link from "next/link";
import AdminProductManager from "@/components/admin/AdminProductManager";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

export const revalidate = 0;
export const metadata = { title: "Quản lý sản phẩm" };

export default async function QuanLySanPhamPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  const products = (data ?? []) as Product[];

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
