import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatVND } from "@/lib/format";

export const revalidate = 0;
export const metadata = { title: "Quản lý đơn hàng" };

async function approvePurchaseAction(formData: FormData) {
  "use server";

  const purchaseId = String(formData.get("purchaseId") ?? "");
  if (!purchaseId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return;

  const admin = createAdminClient();
  await admin
    .from("purchases")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      sepay_reference_code: "MANUAL_ADMIN_APPROVAL",
    })
    .eq("id", purchaseId)
    .eq("status", "pending");

  revalidatePath("/admin/don-hang");
  revalidatePath("/tai-khoan/san-pham");
}

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

type AdminPurchaseItem = {
  purchase_id: string;
  products: { title: string } | null;
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("purchases")
    .select("id, order_code, amount, status, created_at, paid_at, sepay_reference_code, products(title), profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(200);
  const orders = (data ?? []) as unknown as AdminPurchase[];
  const orderIds = orders.map((order) => order.id);
  const { data: itemData } = orderIds.length
    ? await supabase.from("purchase_items").select("purchase_id, products(title)").in("purchase_id", orderIds)
    : { data: [] };
  const itemsByOrder = new Map<string, string[]>();
  for (const item of ((itemData ?? []) as unknown as AdminPurchaseItem[])) {
    if (!item.products?.title) continue;
    const current = itemsByOrder.get(item.purchase_id) ?? [];
    current.push(item.products.title);
    itemsByOrder.set(item.purchase_id, current);
  }
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
          <thead><tr><th>Mã đơn</th><th>Sản phẩm</th><th>Khách hàng</th><th>Số tiền</th><th>Trạng thái</th><th>Thời gian</th><th>Mã ngân hàng</th><th>Thao tác</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td><b>{order.order_code}</b></td><td>{(itemsByOrder.get(order.id)?.length ?? 0) > 1 ? `Combo: ${itemsByOrder.get(order.id)?.join(" · ")}` : order.products?.title ?? "—"}</td><td>{order.profiles?.full_name ?? "—"}</td>
                <td>{formatVND(order.amount)}</td>
                <td style={{ color: order.status === "paid" ? "var(--success)" : order.status === "pending" ? "var(--amber)" : "var(--mute-dim)" }}>{order.status}</td>
                <td>{new Date(order.paid_at ?? order.created_at).toLocaleString("vi-VN")}</td><td>{order.sepay_reference_code ?? "—"}</td>
                <td>
                  {order.status === "pending" ? (
                    <form action={approvePurchaseAction}>
                      <input type="hidden" name="purchaseId" value={order.id} />
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ padding: "8px 12px", fontSize: 12.5, whiteSpace: "nowrap" }}
                      >
                        Duyệt thanh toán
                      </button>
                    </form>
                  ) : (
                    <span style={{ color: "var(--mute-dim)" }}>—</span>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={8} style={{ textAlign: "center" }}>Chưa có đơn hàng</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
