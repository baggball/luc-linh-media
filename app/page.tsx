import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import NewsletterForm from "@/components/home/NewsletterForm";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import styles from "./home.module.css";

export const revalidate = 0;

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
              Hơn 1.200 prompt, workflow và chatbot GPT dựng sẵn — chuyên cho KOC, video AI Veo3 và bán hàng đa kênh.
              Mua một lần, dùng mãi mãi.
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
                <b className="font-mono">1.200+</b>
                <span>Prompt &amp; workflow</span>
              </div>
              <div className={styles.stat}>
                <b className="font-mono">18.500</b>
                <span>Lượt tải về</span>
              </div>
              <div className={styles.stat}>
                <b className="font-mono">4.9 / 5</b>
                <span>Đánh giá trung bình</span>
              </div>
            </div>
          </div>

          <div className={styles.terminal}>
            <div className={styles.terminalBar}>
              <span></span>
              <span></span>
              <span></span>
              <span className="lbl">prompt.mauailamvideo.com — zsh</span>
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
              <p className="sub">Vừa được thêm vào Lục Linh Media</p>
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
              <div className="cmd">$ thanh-toan --phuong-thuc=vnpay,momo</div>
              <h3>2. Thanh toán an toàn</h3>
              <p>Hỗ trợ ví điện tử và chuyển khoản, nhận sản phẩm ngay trong tài khoản sau khi thanh toán.</p>
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
              <p>Tham gia cộng đồng người sáng tạo đang nhận bản tin của Lục Linh Media.</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>

      <Footer />
    </AppShell>
  );
}
