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

type ProfileContact = { id: string; full_name: string | null; email?: string | null };

type AnalyticsSessionRow = {
  id: string;
  visitor_id: string;
  user_id: string | null;
  first_path: string;
  last_path: string;
  source: string;
  device_type: "desktop" | "mobile" | "tablet" | "other";
  page_views: number;
  started_at: string;
  last_seen_at: string;
};

type AnalyticsEventRow = {
  visitor_id: string;
  user_id: string | null;
  event_name: "page_view" | "view_product" | "add_to_cart" | "begin_checkout" | "purchase_completed" | "sign_up";
  path: string;
  product_slug: string | null;
  created_at: string;
};

async function getProfileContacts(supabase: ReturnType<typeof createAdminClient>) {
  const withEmail = await supabase.from("profiles").select("id, full_name, email").limit(1000);
  if (!withEmail.error) return (withEmail.data ?? []) as ProfileContact[];

  const withoutEmail = await supabase.from("profiles").select("id, full_name").limit(1000);
  return (withoutEmail.data ?? []) as ProfileContact[];
}

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

function formatShortDate(date: Date) {
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

function sameDay(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
}

function buildDailyRevenue(rows: PurchaseRow[], days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = daysAgo(days - 1 - index);
    const dayRows = rows.filter((row) => sameDay(new Date(row.paid_at ?? row.created_at), date));
    return {
      label: formatShortDate(date),
      revenue: sum(dayRows),
      orders: dayRows.length,
    };
  });
}

function uniqueCount<T>(rows: T[], getKey: (row: T) => string | null | undefined) {
  return new Set(rows.map(getKey).filter((value): value is string => Boolean(value))).size;
}

function buildDailyVisitors(rows: AnalyticsEventRow[], days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = daysAgo(days - 1 - index);
    const dayRows = rows.filter((row) => row.event_name === "page_view" && sameDay(new Date(row.created_at), date));
    return {
      label: formatShortDate(date),
      visitors: uniqueCount(dayRows, (row) => row.visitor_id),
      views: dayRows.length,
    };
  });
}

function lineChartPoints(values: number[], max: number) {
  if (values.length <= 1) return "0,130 720,130";
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 720;
      const y = 130 - (max ? (value / max) * 108 : 0);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();
  const [
    { data: purchasesData },
    { data: productsData },
    { data: inquiriesData },
    usersResult,
    profileContacts,
    sessionsResult,
    eventsResult,
  ] = await Promise.all([
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
    getProfileContacts(supabase),
    supabase
      .from("analytics_sessions")
      .select("id, visitor_id, user_id, first_path, last_path, source, device_type, page_views, started_at, last_seen_at")
      .gte("last_seen_at", daysAgo(90).toISOString())
      .order("last_seen_at", { ascending: false })
      .limit(10000),
    supabase
      .from("analytics_events")
      .select("visitor_id, user_id, event_name, path, product_slug, created_at")
      .gte("created_at", daysAgo(90).toISOString())
      .order("created_at", { ascending: false })
      .limit(20000),
  ]);

  const purchases = (purchasesData ?? []) as unknown as PurchaseRow[];
  const products = (productsData ?? []) as ProductLite[];
  const inquiries = (inquiriesData ?? []) as InquiryRow[];
  const registeredUsers = usersResult.data?.users ?? [];
  const sessions = (sessionsResult.data ?? []) as AnalyticsSessionRow[];
  const events = (eventsResult.data ?? []) as AnalyticsEventRow[];
  const analyticsReady = !sessionsResult.error && !eventsResult.error;
  const emailByUser = new Map(registeredUsers.map((user) => [user.id, user.email ?? ""]));
  for (const profile of profileContacts) {
    if (profile.email) emailByUser.set(profile.id, profile.email);
  }
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

  const sessions30 = sessions.filter((row) => isAfter(row.last_seen_at, daysAgo(30)));
  const sessions7 = sessions.filter((row) => isAfter(row.last_seen_at, daysAgo(7)));
  const sessionsToday = sessions.filter((row) => isAfter(row.last_seen_at, startOfDay(new Date())));
  const events30 = events.filter((row) => isAfter(row.created_at, daysAgo(30)));
  const events7 = events.filter((row) => isAfter(row.created_at, daysAgo(7)));
  const totalVisitors30 = uniqueCount(sessions30, (row) => row.visitor_id);
  const visitors7 = uniqueCount(sessions7, (row) => row.visitor_id);
  const visitorsToday = uniqueCount(sessionsToday, (row) => row.visitor_id);
  const registeredVisitors30 = uniqueCount(sessions30.filter((row) => row.user_id), (row) => row.user_id);
  const guestVisitors30 = uniqueCount(sessions30.filter((row) => !row.user_id), (row) => row.visitor_id);
  const registered30 = registeredUsers.filter((user) => isAfter(user.created_at, daysAgo(30))).length;
  const registered7 = registeredUsers.filter((user) => isAfter(user.created_at, daysAgo(7))).length;
  const pageViews30 = events30.filter((row) => row.event_name === "page_view").length;
  const pageViews7 = events7.filter((row) => row.event_name === "page_view").length;
  const bounceSessions30 = sessions30.filter((row) => row.page_views <= 1).length;
  const bounceRate = pct(bounceSessions30, sessions30.length);

  const dailyVisitors = buildDailyVisitors(events, 14);
  const maxDailyVisitors = Math.max(...dailyVisitors.map((item) => item.visitors), 0);
  const visitorPoints = lineChartPoints(dailyVisitors.map((item) => item.visitors), maxDailyVisitors);
  const visitorAreaPoints = `0,140 ${visitorPoints} 720,140`;

  const sourceMap = new Map<string, Set<string>>();
  for (const row of sessions30) {
    const key = row.source || "direct";
    const visitors = sourceMap.get(key) ?? new Set<string>();
    visitors.add(row.visitor_id);
    sourceMap.set(key, visitors);
  }
  const topSources = [...sourceMap.entries()]
    .map(([source, visitors]) => ({ source, visitors: visitors.size }))
    .sort((a, b) => b.visitors - a.visitors)
    .slice(0, 8);
  const maxSourceVisitors = Math.max(...topSources.map((item) => item.visitors), 0);

  const pageMap = new Map<string, { views: number; visitors: Set<string> }>();
  for (const row of events30.filter((item) => item.event_name === "page_view")) {
    const current = pageMap.get(row.path) ?? { views: 0, visitors: new Set<string>() };
    current.views += 1;
    current.visitors.add(row.visitor_id);
    pageMap.set(row.path, current);
  }
  const topPages = [...pageMap.entries()]
    .map(([path, value]) => ({ path, views: value.views, visitors: value.visitors.size }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  const deviceMap = new Map<string, Set<string>>();
  for (const row of sessions30) {
    const visitors = deviceMap.get(row.device_type) ?? new Set<string>();
    visitors.add(row.visitor_id);
    deviceMap.set(row.device_type, visitors);
  }
  const deviceRows = [
    { label: "Điện thoại", value: deviceMap.get("mobile")?.size ?? 0 },
    { label: "Máy tính", value: deviceMap.get("desktop")?.size ?? 0 },
    { label: "Máy tính bảng", value: deviceMap.get("tablet")?.size ?? 0 },
    { label: "Khác", value: deviceMap.get("other")?.size ?? 0 },
  ];

  const visitorFunnelRows = [
    { label: "Khách truy cập", value: totalVisitors30, sub: "Khách duy nhất trong 30 ngày" },
    { label: "Xem sản phẩm", value: uniqueCount(events30.filter((row) => row.event_name === "view_product"), (row) => row.visitor_id), sub: "Đã mở trang chi tiết sản phẩm" },
    { label: "Thêm vào giỏ", value: uniqueCount(events30.filter((row) => row.event_name === "add_to_cart"), (row) => row.visitor_id), sub: "Có ý định mua rõ ràng" },
    { label: "Bắt đầu thanh toán", value: uniqueCount(events30.filter((row) => row.event_name === "begin_checkout"), (row) => row.visitor_id), sub: "Đã tạo đơn thanh toán" },
    { label: "Thanh toán thành công", value: uniqueCount(events30.filter((row) => row.event_name === "purchase_completed"), (row) => row.visitor_id), sub: "Đã được mở khóa sản phẩm" },
  ];
  const maxVisitorFunnel = Math.max(...visitorFunnelRows.map((item) => item.value), 1);

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
  const dailyRevenue = buildDailyRevenue(paid, 14);
  const maxDailyRevenue = Math.max(...dailyRevenue.map((item) => item.revenue), 0);
  const revenuePoints = lineChartPoints(dailyRevenue.map((item) => item.revenue), maxDailyRevenue);
  const revenueAreaPoints = `0,140 ${revenuePoints} 720,140`;
  const funnelRows = [
    { label: "Tổng đơn tạo", value: purchases.length, sub: "Khách đã bấm mua / tạo đơn" },
    { label: "Đã thanh toán", value: paid.length, sub: `${conversion} chuyển đổi thành công` },
    { label: "Đang chờ", value: pending.length, sub: `${formatVND(abandonedValue)} có thể thu hồi` },
    { label: "Lead tư vấn", value: inquiries.length, sub: `${lead7} lead trong 7 ngày` },
  ];
  const maxFunnelValue = Math.max(...funnelRows.map((item) => item.value), 1);
  const statusRows = [
    { label: "Đã thanh toán", value: paid.length, className: styles.paidDot },
    { label: "Chờ thanh toán", value: pending.length, className: styles.pendingDot },
    { label: "Đã hủy", value: cancelled.length, className: styles.cancelledDot },
  ];

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
        : "Trang dùng thử miễn phí nên có form nhận email/Zalo rõ hơn để chăm sóc khách tiềm năng.",
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
          <div className={styles.heroActions}>
            <Link className="btn btn-primary" href="/admin/khach-hang">Danh sách khách hàng</Link>
            <Link className="btn btn-ghost" href="/admin/don-hang">Quản lý đơn hàng</Link>
          </div>
        </div>
        <div className={`${styles.heroCard} ${styles.quickList}`}>
          <h2>Việc nên nhìn mỗi ngày</h2>
          <div className={styles.quickItem}><span className={styles.dot} /><span><b>Đơn chờ:</b> {pending.length} đơn — {formatVND(abandonedValue)}</span></div>
          <div className={styles.quickItem}><span className={styles.dot} /><span><b>Lead 7 ngày:</b> {lead7} khách để chăm sóc</span></div>
          <div className={styles.quickItem}><span className={styles.dot} /><span><b>Sản phẩm đang bán:</b> {publishedProducts} sản phẩm hiển thị</span></div>
          <Link className={styles.quickLink} href="/admin/khach-hang">Mở danh sách email khách hàng →</Link>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statCard}><div className={styles.statLabel}>Tổng doanh thu</div><div className={styles.statValue}>{formatVND(totalRevenue)}</div><div className={styles.statSub}>{paid.length} đơn đã thanh toán</div></div>
        <div className={styles.statCard}><div className={styles.statLabel}>Tháng này</div><div className={styles.statValue}>{formatVND(sum(monthPaid))}</div><div className={styles.statSub}>{monthPaid.length} đơn paid</div></div>
        <div className={styles.statCard}><div className={styles.statLabel}>7 ngày gần nhất</div><div className={styles.statValue}>{formatVND(sum(last7Paid))}</div><div className={styles.statSub}>Hôm nay: {formatVND(sum(todayPaid))}</div></div>
        <div className={styles.statCard}><div className={styles.statLabel}>Tỷ lệ thanh toán</div><div className={styles.statValue}>{conversion}</div><div className={styles.statSub}>AOV: {formatVND(avgOrder)} · Hủy: {cancelled.length}</div></div>
      </section>

      <section className={styles.sectionIntro}>
        <div>
          <span className={styles.kicker}>KHÁCH TRUY CẬP & ĐĂNG KÝ</span>
          <h2>Toàn cảnh lượng khách trong 30 ngày</h2>
        </div>
        <span className={styles.pill}>{analyticsReady ? "Đang ghi nhận trực tiếp" : "Cần chạy migration analytics"}</span>
      </section>

      <section className={styles.stats}>
        <div className={styles.statCard}><div className={styles.statLabel}>Khách hôm nay</div><div className={styles.statValue}>{visitorsToday}</div><div className={styles.statSub}>{pageViews7} lượt xem trong 7 ngày</div></div>
        <div className={styles.statCard}><div className={styles.statLabel}>Khách 7 ngày</div><div className={styles.statValue}>{visitors7}</div><div className={styles.statSub}>{totalVisitors30} khách trong 30 ngày</div></div>
        <div className={styles.statCard}><div className={styles.statLabel}>Khách vãng lai</div><div className={styles.statValue}>{guestVisitors30}</div><div className={styles.statSub}>Chưa đăng nhập · 30 ngày</div></div>
        <div className={styles.statCard}><div className={styles.statLabel}>Khách đã đăng nhập</div><div className={styles.statValue}>{registeredVisitors30}</div><div className={styles.statSub}>Đã nhận diện · 30 ngày</div></div>
        <div className={styles.statCard}><div className={styles.statLabel}>Tổng tài khoản</div><div className={styles.statValue}>{registeredUsers.length}</div><div className={styles.statSub}>+{registered7} trong 7 ngày</div></div>
        <div className={styles.statCard}><div className={styles.statLabel}>Đăng ký 30 ngày</div><div className={styles.statValue}>{registered30}</div><div className={styles.statSub}>{pct(registered30, totalVisitors30)} trên lượng khách</div></div>
        <div className={styles.statCard}><div className={styles.statLabel}>Lượt xem trang</div><div className={styles.statValue}>{pageViews30}</div><div className={styles.statSub}>Trung bình {totalVisitors30 ? (pageViews30 / totalVisitors30).toFixed(1) : "0"} trang/khách</div></div>
        <div className={styles.statCard}><div className={styles.statLabel}>Phiên xem 1 trang</div><div className={styles.statValue}>{bounceRate}</div><div className={styles.statSub}>Nên giảm dần khi nội dung tốt hơn</div></div>
      </section>

      <section className={styles.trafficGrid}>
        <div className={`${styles.card} ${styles.revenueChartCard}`}>
          <div className={styles.cardHead}>
            <div><h2>Khách truy cập 14 ngày</h2><p>Số khách duy nhất theo từng ngày.</p></div>
            <span className={styles.pill}>Cao nhất: {maxDailyVisitors} khách/ngày</span>
          </div>
          <div className={styles.lineChart}>
            <svg viewBox="0 0 720 150" preserveAspectRatio="none" aria-label="Biểu đồ khách truy cập 14 ngày">
              <defs>
                <linearGradient id="visitorArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(51,196,141,.42)" />
                  <stop offset="100%" stopColor="rgba(51,196,141,0)" />
                </linearGradient>
              </defs>
              <line x1="0" y1="22" x2="720" y2="22" className={styles.gridLine} />
              <line x1="0" y1="76" x2="720" y2="76" className={styles.gridLine} />
              <line x1="0" y1="130" x2="720" y2="130" className={styles.gridLine} />
              <polygon points={visitorAreaPoints} className={styles.visitorAreaShape} />
              <polyline points={visitorPoints} className={styles.visitorLineShape} />
            </svg>
          </div>
          <div className={styles.dayBars}>
            {dailyVisitors.map((item) => (
              <div className={styles.dayBar} key={item.label} title={`${item.label}: ${item.visitors} khách · ${item.views} lượt xem`}>
                <div className={styles.dayBarTrack}>
                  <span className={styles.visitorDayBar} style={{ height: barWidth(item.visitors, maxDailyVisitors) }} />
                </div>
                <small>{item.label}</small>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div><h2>Phễu chuyển đổi 30 ngày</h2><p>Từ khách truy cập đến người mua.</p></div>
          </div>
          <div className={styles.funnel}>
            {visitorFunnelRows.map((item) => (
              <div className={styles.funnelRow} key={item.label}>
                <div><b>{item.label}</b><span>{item.sub}</span></div>
                <div className={styles.funnelTrack}><i style={{ width: barWidth(item.value, maxVisitorFunnel) }} /></div>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div><h2>Nguồn khách 30 ngày</h2><p>Khách đến từ Google, mạng xã hội hoặc truy cập trực tiếp.</p></div>
          </div>
          {topSources.length ? (
            <div className={styles.bars}>
              {topSources.map((item) => (
                <div className={styles.barRow} key={item.source}>
                  <span className={styles.barName}>{item.source === "direct" ? "Truy cập trực tiếp" : item.source}</span>
                  <div className={styles.barTrack}><div className={styles.barFill} style={{ width: barWidth(item.visitors, maxSourceVisitors) }} /></div>
                  <div className={styles.barVal}>{item.visitors} khách</div>
                </div>
              ))}
            </div>
          ) : <div className={styles.empty}>Dữ liệu nguồn khách sẽ xuất hiện sau khi bản mới hoạt động.</div>}
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div><h2>Thiết bị truy cập</h2><p>Giúp ưu tiên tối ưu giao diện đúng thiết bị khách đang dùng.</p></div>
          </div>
          <div className={styles.deviceGrid}>
            {deviceRows.map((item) => (
              <div className={styles.deviceCard} key={item.label}>
                <b>{item.value}</b>
                <span>{item.label}</span>
                <small>{pct(item.value, totalVisitors30)}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHead}>
          <div><h2>Trang được xem nhiều nhất</h2><p>Lượt xem và số khách duy nhất trong 30 ngày.</p></div>
        </div>
        {topPages.length ? (
          <div className={styles.topPages}>
            {topPages.map((item, index) => (
              <Link href={item.path} className={styles.topPage} key={item.path}>
                <span className={styles.rank}>{index + 1}</span>
                <b>{item.path === "/" ? "Trang chủ" : item.path}</b>
                <span>{item.visitors} khách</span>
                <strong>{item.views} lượt xem</strong>
              </Link>
            ))}
          </div>
        ) : <div className={styles.empty}>Chưa có dữ liệu xem trang trong hệ thống mới.</div>}
      </section>

      <section className={styles.chartsGrid}>
        <div className={`${styles.card} ${styles.revenueChartCard}`}>
          <div className={styles.cardHead}>
            <div><h2>Biểu đồ doanh thu 14 ngày</h2><p>Theo các đơn đã thanh toán thành công.</p></div>
            <span className={styles.pill}>Cao nhất: {formatVND(maxDailyRevenue)}</span>
          </div>
          <div className={styles.lineChart}>
            <svg viewBox="0 0 720 150" preserveAspectRatio="none" aria-label="Biểu đồ doanh thu 14 ngày">
              <defs>
                <linearGradient id="revenueArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(47,177,255,.42)" />
                  <stop offset="100%" stopColor="rgba(47,177,255,0)" />
                </linearGradient>
              </defs>
              <line x1="0" y1="22" x2="720" y2="22" className={styles.gridLine} />
              <line x1="0" y1="76" x2="720" y2="76" className={styles.gridLine} />
              <line x1="0" y1="130" x2="720" y2="130" className={styles.gridLine} />
              <polygon points={revenueAreaPoints} className={styles.areaShape} />
              <polyline points={revenuePoints} className={styles.lineShape} />
            </svg>
          </div>
          <div className={styles.dayBars}>
            {dailyRevenue.map((item) => (
              <div className={styles.dayBar} key={item.label} title={`${item.label}: ${formatVND(item.revenue)} · ${item.orders} đơn`}>
                <div className={styles.dayBarTrack}>
                  <span style={{ height: barWidth(item.revenue, maxDailyRevenue) }} />
                </div>
                <small>{item.label}</small>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div><h2>Phễu đơn hàng</h2><p>Nhìn nhanh điểm rơi của tiền và lead.</p></div>
          </div>
          <div className={styles.funnel}>
            {funnelRows.map((item) => (
              <div className={styles.funnelRow} key={item.label}>
                <div>
                  <b>{item.label}</b>
                  <span>{item.sub}</span>
                </div>
                <div className={styles.funnelTrack}>
                  <i style={{ width: barWidth(item.value, maxFunnelValue) }} />
                </div>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div><h2>Trạng thái đơn</h2><p>Tỷ trọng paid / pending / cancelled.</p></div>
          </div>
          <div className={styles.statusChart}>
            <div
              className={styles.donut}
              style={{
                background: `conic-gradient(var(--success) 0 ${pct(paid.length, purchases.length)}, var(--amber) ${pct(paid.length, purchases.length)} ${pct(paid.length + pending.length, purchases.length)}, rgba(148,163,184,.42) ${pct(paid.length + pending.length, purchases.length)} 100%)`,
              }}
            >
              <div><b>{purchases.length}</b><span>đơn</span></div>
            </div>
            <div className={styles.legend}>
              {statusRows.map((item) => (
                <div key={item.label}>
                  <span className={item.className} />
                  <b>{item.label}</b>
                  <em>{item.value} · {pct(item.value, purchases.length)}</em>
                </div>
              ))}
            </div>
          </div>
        </div>
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
