import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { formatVND } from "@/lib/format";
import { PRODUCT_TYPE_ROUTE, type ProductType } from "@/lib/types";

export const revalidate = 0;
export const metadata = { title: "Sản phẩm của tôi" };

type PurchaseRow = {
  id: string;
  amount: number;
  status: string;
  paid_at: string | null;
  created_at: string;
  product_id: string;
  products: { title: string; type: ProductType; images: string[] } | null;
};

export default async function MyProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/tai-khoan/san-pham");

  const { data } = await supabase
    .from("purchases")
    .select("id, amount, status, paid_at, created_at, product_id, products(title, type, images)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const purchases = (data ?? []) as unknown as PurchaseRow[];

  return (
    <AppShell>
      <div className="content-wrap" style={{ paddingTop: 36, paddingBottom: 60 }}>
        <div className="eyebrow">Tài khoản</div>
        <h1 style={{ fontSize: 30, margin: "12px 0 8px" }}>Sản phẩm và đơn hàng của tôi</h1>
        <p style={{ color: "var(--mute)", marginBottom: 28 }}>Xem lại sản phẩm đã mua và tiếp tục các đơn đang chờ thanh toán.</p>

        {purchases.length === 0 ? (
          <div className="empty-added">
            Bạn chưa có đơn hàng nào. <Link href="/chatbot" style={{ color: "var(--electric-bright)" }}>Khám phá sản phẩm</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {purchases.map((purchase) => {
              const product = purchase.products;
              const paid = purchase.status === "paid";
              const href = paid && product
                ? `/${PRODUCT_TYPE_ROUTE[product.type]}/${purchase.product_id}`
                : `/thanh-toan/${purchase.id}`;
              return (
                <div key={purchase.id} className="section-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: paid ? "var(--success)" : "var(--amber)", fontSize: 12, fontWeight: 800, marginBottom: 5 }}>
                      {paid ? "ĐÃ THANH TOÁN" : purchase.status === "cancelled" ? "ĐÃ HỦY" : "CHỜ THANH TOÁN"}
                    </div>
                    <h2 style={{ fontSize: 17 }}>{product?.title ?? "Sản phẩm không còn tồn tại"}</h2>
                    <p style={{ color: "var(--mute-dim)", fontSize: 13, marginTop: 5 }}>
                      {formatVND(purchase.amount)} · {new Date(purchase.paid_at ?? purchase.created_at).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  {purchase.status !== "cancelled" && product && (
                    <Link className="btn btn-primary" href={href}>{paid ? "Mở sản phẩm" : "Tiếp tục thanh toán"}</Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </AppShell>
  );
}
