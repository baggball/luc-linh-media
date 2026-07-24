import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatVND } from "@/lib/format";
import { PRODUCT_TYPE_ROUTE, type ProductType } from "@/lib/types";
import { publicProductSlug } from "@/lib/product-url";
import styles from "./dashboard.module.css";

export const revalidate = 0;
export const metadata = { title: "Dashboard kinh doanh" };

type ProductLite = {
  id: string;
  slug: string;
  title: string;
  type: ProductType;
  price: number;
  is_published: boolean;
  created_at: string;
};

type PurchaseRow = {
  id: string;
  user_id: string;
  product_id: string;
  order_code: string;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  created_at: string;
  paid_at: string | null;
  sepay_reference_code: string | null;
  products: ProductLite | null;
  profiles: { full_name: string | null } | null;
};

type InquiryRow = {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysAgo(days: number) {
  const date = startOfDay(new Date());
  date.setDate(date.getDate() - days);
  return date;
}

function startOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function isAfter(value: string | null, date: Date) {
  if (!value) return false;
  return new Date(value).getTime() >= date.getTime();
}

function pct(part: number, total: number) {
  if (!total) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("vi-VN");
}

function sum(rows: PurchaseRow[]) {
  return rows.reduce((total, row) => total + row.amount, 0);
}

function barWidth(value: number, max: number) {
  if (!max) return "4%";
  return `${Math.max(4, Math.round((value / max) * 100))}%`;
}

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();
  const [{ data: purchasesData }, { data: productsData }, { data: inquiriesData }, usersResult] = await Promise.all([
    supabase
      .from("purchases")
      .select("id, user_id, product_id, order_code, amount, status, created_at, paid_at, sepay_reference_code, products(id, slug, title, type, price, is_published, created_at), profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(1000),
    supabase
      .from("products")
      .select("id, slug, title, type, price, is_published, created_at")
      .order("created_at", { ascending: false })
      .limit(500),
    supabase
      .from("inquiries")
      .select("id, type, name, email, phone, payload, created_at")
      .order("created_at", { ascending: false })
      .limit(300),
    supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  const purchases = (purchasesData ?? []) as unknown as PurchaseRow[];
  const products = (productsData ?? []) as ProductLite[];
  const inquiries = (inquiriesData ?? []) as InquiryRow[];
  const emailByUser = new Map((usersResult.data?.users ?? []).map((user) => [user.id, user.email ?? ""]));
  const paid = purchases.filter((row) => row.status === "paid");
  const pending = purchases.filter((row) => row.status === "pending");
  const cancelled = purchases.filter((row) => row.status === "cancelled");
  const last7Paid = paid.filter((row) => isAfter(row.paid_at ?? row.created_at, daysAgo(7)));
  const last30Paid = paid.filter((row) => isAfter(row.paid_at ?? row.created_at, daysAgo(30)));
  const monthPaid = paid.filter((row) => isAfter(row.paid_at ?? row.created_at, startOfMonth()));
  const todayPaid = paid.filter((row) => isAfter(row.paid_at ?? row.created_at, startOfDay(new Date())));
  const totalRevenue = sum(paid);
  const conversion = pct(paid.length, purchases.length);
  const avgOrder = paid.length ? Math.round(totalRevenue / paid.length) : 0;

  const productMap = new Map<string, { title: string; href: string; revenue: number; paidCount: number; pendingCount: number }>();
  for (const row of purchases) {
    const product = row.products;
    if (!product) continue;
    const href = `/${PRODUCT_TYPE_ROUTE[product.type]}/${publicProductSlug(product)}`;
    const current = productMap.get(product.id) ?? { title: product.title, href, revenue: 0, paidCount: 0, pendingCount: 0 };
    if (row.status === "paid") {
      current.revenue += row.amount;
      current.paidCount += 1;
    }
    if (row.status === "pending") current.pendingCount += 1;
    productMap.set(product.id, current);
  }
  const topProducts = [...productMap.values()].sort((a, b) => b.revenue - a.revenue || b.paidCount - a.paidCount).slice(0, 8);
  const maxProductRevenue = Math.max(...topProducts.map((item) => item.revenue), 0);

  const customerMap = new Map<string, { name: string; email: string; revenue: number; paidCount: number; pendingCount: number; lastBuy: string | null; products: Set<string> }>();
  for (const row of purchases) {
    const current = customerMap.get(row.user_id) ?? {
      name: row.profiles?.full_name || "Khách chưa đặt tên",
      email: emailByUser.get(row.user_id) || "—",
      revenue: 0,
      paidCount: 0,
      pendingCount: 0,
      lastBuy: null,
      products: new Set<string>(),
    };
    if (row.status === "paid") {
      current.revenue += row.amount;
      current.paidCount += 1;
      current.products.add(row.products?.title ?? "Sản phẩm không xác định");
      const time = row.paid_at ?? row.created_at;
      if (!current.lastBuy || new Date(time).getTime() > new Date(current.lastBuy).getTime()) current.lastBuy = time;
    }
    if (row.status === "pending") current.pendingCount += 1;
    customerMap.set(row.user_id, current);
  }
  const topCustomers = [...customerMap.values()].sort((a, b) => b.revenue - a.revenue || b.paidCount - a.paidCount).slice(0, 8);
  const recentOrders = purchases.slice(0, 12);
  const recentInquiries = inquiries.slice(0, 8);
  const abandonedValue = sum(pending);
  const publishedProducts = products.filter((item) => item.is_published).length;
  const lead7 = inquiries.filter((item) => isAfter(item.created_at, daysAgo(7))).length;

  const actions = [
    {
      title: pending.length > 0 ? "Ưu tiên xử lý đơn chờ" : "Luồng thanh toán đang gọn",
      body: pending.length > 0
        ? `Có ${pending.length} đơn chờ với tổng giá trị ${formatVND(abandonedValue)}. Nên kiểm tra webhook hoặc nhắn khách hoàn tất chuyển khoản.`
        : "Không có đơn chờ trong 1.000 đơn gần nhất. Tiếp tục test webhook sau mỗi lần sửa SePay.",
    },
    {
      title: topProducts[0] ? `Đẩy mạnh: ${topProducts[0].title}` : "Cần có sản phẩm mũi nhọn",
      body: topProducts[0]
        ? `Sản phẩm này đang tạo doanh thu cao nhất: ${formatVND(topProducts[0].revenue)}. Nên đưa lên trang chủ, bài bán hàng và quảng cáo.`
        : "Chưa có sản phẩm có doanh thu. Nên chạy test 3 sản phẩm mũi nhọn trước.",
    },
    {
      title: lead7 > 0 ? "Có lead mới để chăm sóc" : "Cần tăng lead đầu phễu",
      body: lead7 > 0
        ? `${lead7} yêu cầu/email mới trong 7 ngày. Nên gọi/Zalo/email trong 24h để tăng tỷ lệ chốt.`
        : "Trang dùng thử miễn phí nên có form lấy email/Zalo rõ hơn để gom khách tiềm năng.",
    },
  ];

  return (
    <div className={styles.wrap}>
      <div className="crumb" style={{ marginBottom: 20 }}>
        <Link href="/">Trang chủ</Link><span className="sep">/</span><span className="cur">Dashboard kinh doanh</span>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <span className={styles.kicker}>BUSINESS COMMAND CENTER</span>
          <h1>Dashboard theo dõi hệ thống kinh doanh</h1>
          <p>
            Nhìn nhanh doanh thu, đơn hàng, khách mua, sản phẩm bán chạy và những điểm cần xử lý để định hướng phát triển Lục Linh Video AI.
          </p>
        </div>
        <div className={`${styles.heroCard} ${styles.quickList}`}>
          <h2>Việc nên nhìn mỗi ngày</h2>
          <div className={styles.quickItem}><span className={styles.dot} /><span><b>Đơn chờ:</b> {pending.length} đơn — {formatVND(abandonedValue)}</span></div>
          <div className={styles.quickItem}><span className={styles.dot} /><span><b>Lead 7 ngày:</b> {lead7} khách để chăm sóc</span></div>
          <div className={styles.quickItem}><span className={styles.dot} /><span><b>Sản phẩm đang bán:</b> {publishedProducts} sản phẩm hiển thị</span></div>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statCard}><div className={styles.statLabel}>Tổng doanh thu</div><div className={styles.statValue}>{formatVND(totalRevenue)}</div><div className={styles.statSub}>{paid.length} đơn đã thanh toán</div></div>
        <div className={styles.statCard}><div className={styles.statLabel}>Tháng này</div><div className={styles.statValue}>{formatVND(sum(monthPaid))}</div><div className={styles.statSub}>{monthPaid.length} đơn paid</div></div>
        <div className={styles.statCard}><div className={styles.statLabel}>7 ngày gần nhất</div><div className={styles.statValue}>{formatVND(sum(last7Paid))}</div><div className={styles.statSub}>Hôm nay: {formatVND(sum(todayPaid))}</div></div>
        <div className={styles.statCard}><div className={styles.statLabel}>Tỷ lệ thanh toán</div><div className={styles.statValue}>{conversion}</div><div className={styles.statSub}>AOV: {formatVND(avgOrder)} · Hủy: {cancelled.length}</div></div>
      </section>

      <section className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div><h2>Sản phẩm tạo doanh thu</h2><p>Sắp xếp theo doanh thu đã thanh toán.</p></div>
            <span className={styles.pill}>{formatVND(sum(last30Paid))} / 30 ngày</span>
          </div>
          {topProducts.length ? (
            <div className={styles.bars}>
              {topProducts.map((item) => (
                <div className={styles.barRow} key={item.href}>
                  <Link className={styles.barName} href={item.href}>{item.title}</Link>
                  <div className={styles.barTrack}><div className={styles.barFill} style={{ width: barWidth(item.revenue, maxProductRevenue) }} /></div>
                  <div className={styles.barVal}>{formatVND(item.revenue)} · {item.paidCount} đơn</div>
                </div>
              ))}
            </div>
          ) : <div className={styles.empty}>Chưa có doanh thu sản phẩm.</div>}
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div><h2>Khách hàng giá trị cao</h2><p>Email, sản phẩm đã mua và tổng chi tiêu.</p></div>
            <span className={styles.pill}>{customerMap.size} khách</span>
          </div>
          {topCustomers.length ? (
            <div className={styles.miniList}>
              {topCustomers.map((item) => (
                <div className={styles.miniItem} key={`${item.email}-${item.name}`}>
                  <div>
                    <b>{item.name}</b>
                    <span className={styles.email}>{item.email}</span>
                    <span>{[...item.products].slice(0, 2).join(" · ") || "Chưa có đơn paid"}</span>
                  </div>
                  <div className={styles.score}>{formatVND(item.revenue)}</div>
                </div>
              ))}
            </div>
          ) : <div className={styles.empty}>Chưa có khách mua thành công.</div>}
        </div>
      </section>

      <section className={styles.twoCol}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div><h2>Đơn hàng gần nhất</h2><p>Theo dõi mã đơn, email, sản phẩm, trạng thái.</p></div>
            <Link className={styles.pill} href="/admin/don-hang">Xem tất cả</Link>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Mã đơn</th><th>Khách</th><th>Sản phẩm</th><th>Số tiền</th><th>Trạng thái</th><th>Thời gian</th></tr></thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td><b>{order.order_code}</b></td>
                    <td><span>{order.profiles?.full_name ?? "—"}</span><br /><span className={styles.email}>{emailByUser.get(order.user_id) || "—"}</span></td>
                    <td>{order.products?.title ?? "—"}</td>
                    <td>{formatVND(order.amount)}</td>
                    <td><span className={`${styles.status} ${styles[order.status]}`}>{order.status}</span></td>
                    <td>{formatDate(order.paid_at ?? order.created_at)}</td>
                  </tr>
                ))}
                {!recentOrders.length && <tr><td colSpan={6}><div className={styles.empty}>Chưa có đơn hàng.</div></td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div><h2>Lead & yêu cầu mới</h2><p>Email/Zalo từ form liên hệ, video AI, custom chatbot.</p></div>
            <Link className={styles.pill} href="/admin/yeu-cau">Xem yêu cầu</Link>
          </div>
          {recentInquiries.length ? (
            <div className={styles.miniList}>
              {recentInquiries.map((item) => (
                <div className={styles.miniItem} key={item.id}>
                  <div>
                    <b>{item.name} · {item.type}</b>
                    <span className={styles.email}>{item.email}{item.phone ? ` · ${item.phone}` : ""}</span>
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : <div className={styles.empty}>Chưa có lead/yêu cầu mới.</div>}
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHead}>
          <div><h2>Gợi ý điều hành tiếp theo</h2><p>Em biến dữ liệu thành việc cần làm để anh phát triển website.</p></div>
        </div>
        <div className={styles.actions}>
          {actions.map((item) => (
            <div className={styles.actionCard} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
