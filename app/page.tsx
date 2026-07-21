import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <AppShell>
      <section style={{ padding: "72px 0" }}>
        <div className="content-wrap" style={{ textAlign: "center" }}>
          <span className="eyebrow" style={{ justifyContent: "center" }}>
            ĐANG XÂY DỰNG
          </span>
          <h1 style={{ fontSize: "clamp(26px, 3.4vw, 38px)", margin: "14px 0" }}>
            Khung sườn Lục Linh Media đã sẵn sàng
          </h1>
          <p style={{ color: "var(--mute)", fontSize: "15.5px", maxWidth: "56ch", margin: "0 auto" }}>
            Đây là phiên bản web thật (Next.js) — trang chủ đầy đủ và dữ liệu sản phẩm thật sẽ được
            nối vào ở bước tiếp theo, sau khi kết nối Supabase.
          </p>
        </div>
      </section>
      <Footer />
    </AppShell>
  );
}
