import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import ViralHooksClient from "@/components/static/ViralHooksClient";

export const metadata = { title: "Viral Video Hooks" };

export default function ViralHooksPage() {
  return (
    <AppShell>
      <div className="content-wrap">
        <div className="pg-head">
          <span className="free-badge" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(51,196,141,0.14)", color: "var(--success)", border: "1px solid rgba(51,196,141,0.4)", fontFamily: "var(--font-mono)", fontSize: 12, padding: "5px 12px", borderRadius: 999, marginBottom: 14 }}>
            ✦ Hoàn toàn miễn phí
          </span>
          <h1>
            Viral Video Hooks — <em style={{ color: "var(--success)" }}>giữ chân người xem</em> trong 3 giây đầu
          </h1>
          <p>Kho câu mở đầu (hook) được kiểm chứng hiệu quả cho video ngắn — sao chép và dùng ngay, không giới hạn số lần.</p>
          <div className="stat-row">
            <span className="stat">
              🎯 <b className="font-mono">5.600+</b>&nbsp;người dùng
            </span>
            <span className="stat">
              🪝 <b className="font-mono">60+</b>&nbsp;Hook mẫu
            </span>
            <span className="stat">
              📋 <b className="font-mono">32.000+</b>&nbsp;lượt sao chép
            </span>
          </div>
        </div>

        <section className="section" style={{ padding: "26px 0 60px" }}>
          <ViralHooksClient />

          <div className="cta-band">
            <div>
              <h3>Muốn nhiều hook hơn, cập nhật mỗi tuần?</h3>
              <p>Tạo tài khoản miễn phí để lưu hook yêu thích và nhận hook mới hàng tuần.</p>
            </div>
            <Link className="btn btn-primary" href="/dang-ky">
              Tạo tài khoản miễn phí →
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </AppShell>
  );
}
