import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatVND } from "@/lib/format";

export const revalidate = 0;
export const metadata = { title: "Quản lý đơn hàng" };

type AdminPurchase = {
  id: string;
  order_code: string;
  amount: number;
  status: string;
  created_at: string;
  paid_at: string | null;
  sepay_reference_code: string | null;
  products: { title: string } | null;
  profiles: { full_name: string | null } | null;
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("purchases")
    .select("id, order_code, amount, status, created_at, paid_at, sepay_reference_code, products(title), profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(200);
  const orders = (data ?? []) as unknown as AdminPurchase[];
  const revenue = orders.filter((x) => x.status === "paid").reduce((sum, x) => sum + x.amount, 0);

  return (
    <div className="content-wrap" style={{ padding: 32 }}>
      <div className="crumb" style={{ marginBottom: 20 }}>
        <Link href="/">Trang chủ</Link><span className="sep">/</span><span className="cur">Đơn hàng</span>
      </div>
      <div className="section-title">
        <div><h1 style={{ fontSize: 26 }}>Quản lý đơn hàng</h1><p style={{ color: "var(--mute)", fontSize: 14, marginTop: 6 }}>Tối đa 200 đơn gần nhất</p></div>
        <span style={{ color: "var(--success)", fontSize: 16 }}>Doanh thu: {formatVND(revenue)}</span>
      </div>
      <div style={{ overflowX: "auto", marginTop: 22 }}>
        <table className="plan-table" style={{ minWidth: 900 }}>
          <thead><tr><th>Mã đơn</th><th>Sản phẩm</th><th>Khách hàng</th><th>Số tiền</th><th>Trạng thái</th><th>Thời gian</th><th>Mã ngân hàng</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td><b>{order.order_code}</b></td><td>{order.products?.title ?? "—"}</td><td>{order.profiles?.full_name ?? "—"}</td>
                <td>{formatVND(order.amount)}</td>
                <td style={{ color: order.status === "paid" ? "var(--success)" : order.status === "pending" ? "var(--amber)" : "var(--mute-dim)" }}>{order.status}</td>
                <td>{new Date(order.paid_at ?? order.created_at).toLocaleString("vi-VN")}</td><td>{order.sepay_reference_code ?? "—"}</td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center" }}>Chưa có đơn hàng</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
