import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import NewsletterForm from "@/components/home/NewsletterForm";
import { createClient } from "@/lib/supabase/server";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import type { Product } from "@/lib/types";
import styles from "./home.module.css";

export const revalidate = 0;
export const metadata = {
  title: "Chatbot & Workflow tạo video AI bán hàng",
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default async function Home() {
  const supabase = await createClient();

  const [{ data: newest }, { data: chatbots }] = await Promise.all([
    supabase.from("products").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(4),
    supabase
      .from("products")
      .select("*")
      .eq("is_published", true)
      .eq("type", "chatbot")
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  return (
    <AppShell>
      <section className={styles.hero}>
        <div className={`content-wrap ${styles.wrap}`}>
          <div>
            <span className="eyebrow">CHỢ PROMPT &amp; CÔNG CỤ AI CHO NGƯỜI SÁNG TẠO</span>
            <h1>
              Biến một dòng lệnh thành <em>video, chatbot &amp; kịch bản bán hàng</em> hoàn chỉnh
            </h1>
            <p className={styles.heroSub}>
              Chatbot, prompt và workflow dựng sẵn cho KOC, video AI Veo 3 và bán hàng đa kênh. Chọn đúng ngành hàng,
              làm theo từng bước và dùng ngay.
            </p>
            <div className={styles.heroCtas}>
              <Link className="btn btn-primary" href="/chatbot">
                Khám phá sản phẩm →
              </Link>
              <Link className="btn btn-ghost" href="/prompt-mien-phi">
                Dùng thử prompt miễn phí
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <b className="font-mono">15+</b>
                <span>Chatbot theo ngành</span>
              </div>
              <div className={styles.stat}>
                <b className="font-mono">4</b>
                <span>Nhóm công cụ AI</span>
              </div>
              <div className={styles.stat}>
                <b className="font-mono">1:1</b>
                <span>Hỗ trợ sử dụng</span>
              </div>
            </div>
          </div>

          <div className={styles.terminal}>
            <div className={styles.terminalBar}>
              <span></span>
              <span></span>
              <span></span>
              <span className="lbl">luclinhvideoai.com — trợ lý KOC</span>
            </div>
            <div className={styles.terminalBody}>
              <div className={styles.tLine}>
                <span className={styles.tPrompt}>→</span>{" "}
                <span className={styles.tUser}>Viết kịch bản KOC 30s bán son môi, giọng gen Z, chèn 1 câu chốt đơn</span>
              </div>
              <div className={styles.tOut}>
                {"✓ Đang tạo kịch bản...\n✓ Hook 3 giây đầu: \"Đừng lướt vội, môi bạn xứng đáng hơn thế\"\n✓ 3 bước demo sản phẩm + 1 lời chốt đơn tự nhiên\n✓ Xuất kèm prompt dựng video Veo3 tương ứng"}
              </div>
              <div className={styles.tLine} style={{ marginTop: 16 }}>
                <span className={styles.tPrompt}>→</span> <span className={styles.caret}></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 8 }}>
        <div className="content-wrap">
          <div className="rail">
            <span className="pill active">Tất cả</span>
            <Link className="pill" href="/chatbot">
              Chatbot
            </Link>
            <Link className="pill" href="/workflow">
              Workflow
            </Link>
            <Link className="pill" href="/app-ai">
              App
            </Link>
            <Link className="pill" href="/veo3-workflow">
              VEO3 Workflow
            </Link>
            <Link className="pill" href="/viral-hooks">
              Viral Video Hooks
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 8 }}>
        <div className="content-wrap">
          <div className="sec-head">
            <div>
              <h2>Sản phẩm mới nhất</h2>
              <p className="sub">Vừa được thêm vào {SITE_NAME}</p>
            </div>
          </div>

          <div className="grid">
            {newest && newest.length > 0 ? (
              (newest as Product[]).map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <div className="empty-state">
                Chưa có sản phẩm nào. <Link href="/admin/quan-ly-san-pham">Thêm sản phẩm đầu tiên →</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className="sec-head">
            <div>
              <h2>Chatbot nổi bật</h2>
              <p className="sub">Những chatbot được cộng đồng KOC dùng nhiều nhất tuần này</p>
            </div>
            <Link className="see-all" href="/chatbot">
              Xem tất cả →
            </Link>
          </div>

          <div className="grid">
            {chatbots && chatbots.length > 0 ? (
              (chatbots as Product[]).map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <div className="empty-state">Chưa có chatbot nào được đăng.</div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className="sec-head">
            <div>
              <h2>Bắt đầu chỉ trong 3 bước</h2>
              <p className="sub">Không cần biết code, không cần cài đặt gì thêm</p>
            </div>
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className="cmd">$ chọn-prompt --danh-muc=chatbot</div>
              <h3>1. Chọn sản phẩm phù hợp</h3>
              <p>Duyệt theo ngành hàng: thời trang, mỹ phẩm, gia dụng, sách... mỗi sản phẩm có demo xem trước.</p>
            </div>
            <div className={styles.step}>
              <div className="cmd">$ thanh-toan --phuong-thuc=chuyen-khoan</div>
              <h3>2. Thanh toán an toàn</h3>
              <p>Quét mã QR chuyển khoản đúng nội dung, hệ thống SePay tự xác nhận và mở sản phẩm trong tài khoản.</p>
            </div>
            <div className={styles.step}>
              <div className="cmd">$ su-dung --ngay-bay-gio</div>
              <h3>3. Dùng ngay, không giới hạn</h3>
              <p>Sao chép prompt vào công cụ AI bạn đang dùng hoặc chạy thẳng workflow có sẵn.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className={styles.ctaBand}>
            <div>
              <h3>Nhận prompt mới &amp; ưu đãi mỗi tuần</h3>
              <p>Nhận hướng dẫn thực chiến, prompt mới và ưu đãi từ {SITE_NAME}.</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>

      <Footer />
    </AppShell>
  );
}
