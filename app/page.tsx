import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import NewsletterForm from "@/components/home/NewsletterForm";
import HeroHologram from "@/components/home/HeroHologram";
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

          <HeroHologram />
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
              <div className="cmd">01 · Chọn sản phẩm</div>
              <h3>1. Chọn sản phẩm phù hợp</h3>
              <p>Duyệt theo ngành hàng: thời trang, mỹ phẩm, gia dụng, sách... mỗi sản phẩm có demo xem trước.</p>
            </div>
            <div className={styles.step}>
              <div className="cmd">02 · Quét QR chuyển khoản</div>
              <h3>2. Thanh toán an toàn</h3>
              <p>Quét mã QR ngân hàng và chuyển khoản đúng nội dung. SePay tự động xác nhận giao dịch.</p>
            </div>
            <div className={styles.step}>
              <div className="cmd">03 · Mở khóa tự động</div>
              <h3>3. Nhận sản phẩm ngay</h3>
              <p>Sản phẩm xuất hiện trong tài khoản ngay sau khi giao dịch được xác nhận thành công.</p>
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
