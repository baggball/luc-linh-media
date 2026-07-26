import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatVND } from "@/lib/format";
import styles from "./customers.module.css";

export const revalidate = 0;
export const metadata = { title: "Danh sách khách hàng" };

type PurchaseRow = {
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
  paid_at: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLocaleLowerCase("vi");
  const admin = createAdminClient();

  const [{ data: authData, error: authError }, { data: profileData }, { data: purchaseData }] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    admin.from("profiles").select("id, full_name, email, role, created_at").limit(1000),
    admin.from("purchases").select("user_id, amount, status, created_at, paid_at").order("created_at", { ascending: false }).limit(5000),
  ]);

  const profiles = new Map((profileData ?? []).map((profile) => [profile.id, profile]));
  const purchaseStats = new Map<string, { paid: number; pending: number; revenue: number; lastPurchase: string | null }>();

  for (const row of (purchaseData ?? []) as PurchaseRow[]) {
    const current = purchaseStats.get(row.user_id) ?? { paid: 0, pending: 0, revenue: 0, lastPurchase: null };
    if (row.status === "paid") {
      current.paid += 1;
      current.revenue += row.amount;
    } else if (row.status === "pending") {
      current.pending += 1;
    }
    const purchaseTime = row.paid_at ?? row.created_at;
    if (!current.lastPurchase || new Date(purchaseTime) > new Date(current.lastPurchase)) current.lastPurchase = purchaseTime;
    purchaseStats.set(row.user_id, current);
  }

  const customers = (authData?.users ?? [])
    .map((user) => {
      const profile = profiles.get(user.id);
      const stats = purchaseStats.get(user.id) ?? { paid: 0, pending: 0, revenue: 0, lastPurchase: null };
      return {
        id: user.id,
        name: profile?.full_name || user.user_metadata?.full_name || "Khách chưa đặt tên",
        email: profile?.email || user.email || "—",
        role: profile?.role || "customer",
        createdAt: profile?.created_at || user.created_at,
        lastSignIn: user.last_sign_in_at,
        confirmed: Boolean(user.email_confirmed_at),
        ...stats,
      };
    })
    .filter((customer) => !query || `${customer.name} ${customer.email}`.toLocaleLowerCase("vi").includes(query))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const allUsers = authData?.users ?? [];
  const totalBuyers = [...purchaseStats.values()].filter((item) => item.paid > 0).length;
  const totalRevenue = [...purchaseStats.values()].reduce((sum, item) => sum + item.revenue, 0);
  const newThisMonth = allUsers.filter((user) => {
    const date = new Date(user.created_at);
    const now = new Date();
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }).length;

  return (
    <main className={styles.wrap}>
      <div className="crumb" style={{ marginBottom: 20 }}>
        <Link href="/admin/dashboard">Dashboard</Link><span className="sep">/</span><span className="cur">Khách hàng</span>
      </div>

      <header className={styles.head}>
        <div>
          <h1>Danh sách khách hàng</h1>
          <p>Toàn bộ tài khoản đã đăng ký, trạng thái email và lịch sử mua hàng trên website.</p>
        </div>
        <div className={styles.headActions}>
          <Link className="btn btn-ghost" href="/admin/dashboard">Dashboard</Link>
          <Link className="btn btn-primary" href="/admin/don-hang">Xem đơn hàng</Link>
        </div>
      </header>

      <section className={styles.stats}>
        <div className={styles.stat}><span>Tổng tài khoản</span><b>{allUsers.length.toLocaleString("vi-VN")}</b></div>
        <div className={styles.stat}><span>Đăng ký tháng này</span><b>{newThisMonth.toLocaleString("vi-VN")}</b></div>
        <div className={styles.stat}><span>Khách đã mua</span><b>{totalBuyers.toLocaleString("vi-VN")}</b></div>
        <div className={styles.stat}><span>Doanh thu từ khách</span><b>{formatVND(totalRevenue)}</b></div>
      </section>

      <section>
        <div className={styles.toolbar}>
          <form className={styles.search} method="get">
            <input name="q" defaultValue={q} type="search" placeholder="Tìm theo tên hoặc email..." aria-label="Tìm khách hàng" />
            <button className="btn btn-primary" type="submit">Tìm kiếm</button>
            {q && <Link className="btn btn-ghost" href="/admin/khach-hang">Xóa lọc</Link>}
          </form>
          <span className={styles.count}>{customers.length.toLocaleString("vi-VN")} khách được hiển thị</span>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr><th>Khách hàng</th><th>Vai trò</th><th>Xác thực</th><th>Ngày đăng ký</th><th>Đăng nhập gần nhất</th><th>Đơn đã mua</th><th>Đơn chờ</th><th>Tổng chi tiêu</th><th>Mua gần nhất</th></tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td><span className={styles.name}>{customer.name}</span><br /><a className={styles.email} href={`mailto:${customer.email}`}>{customer.email}</a></td>
                  <td><span className={styles.role}>{customer.role === "admin" ? "Quản trị viên" : "Khách hàng"}</span></td>
                  <td><span className={customer.confirmed ? styles.verified : styles.unverified}>{customer.confirmed ? "Đã xác thực" : "Chưa xác thực"}</span></td>
                  <td>{formatDate(customer.createdAt)}</td>
                  <td className={styles.muted}>{formatDate(customer.lastSignIn)}</td>
                  <td>{customer.paid.toLocaleString("vi-VN")}</td>
                  <td>{customer.pending.toLocaleString("vi-VN")}</td>
                  <td className={styles.money}>{formatVND(customer.revenue)}</td>
                  <td className={styles.muted}>{formatDate(customer.lastPurchase)}</td>
                </tr>
              ))}
              {customers.length === 0 && <tr><td className={styles.empty} colSpan={9}>{authError ? "Không thể tải danh sách tài khoản." : "Không tìm thấy khách hàng phù hợp."}</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
