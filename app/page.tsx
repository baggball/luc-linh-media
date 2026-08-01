import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import NewsletterForm from "@/components/home/NewsletterForm";
import HeroHologram from "@/components/home/HeroHologram";
import { createClient } from "@/lib/supabase/server";
import { applyProductsOverrides } from "@/lib/product-overrides";
import { SITE_NAME } from "@/lib/site";
import type { Product } from "@/lib/types";
import type { Metadata } from "next";
import styles from "./home.module.css";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Chatbot AI tạo video bán hàng | Lục Linh Video AI",
  description:
    "Chatbot, workflow và prompt AI giúp shop, KOC và affiliate tạo ảnh sản phẩm, video ngắn, lời thoại tiếng Việt và kịch bản bán hàng nhanh hơn.",
  alternates: { canonical: "/", languages: { "vi-VN": "/", "x-default": "/" } },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: SITE_NAME,
    title: "Chatbot AI tạo video bán hàng | Lục Linh Video AI",
    description: "Tạo ảnh sản phẩm, video ngắn, lời thoại tiếng Việt và kịch bản bán hàng bằng chatbot và workflow AI.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Lục Linh Video AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chatbot AI tạo video bán hàng | Lục Linh Video AI",
    description: "Chatbot, workflow và prompt AI dành cho shop, KOC và affiliate Việt Nam.",
    images: ["/opengraph-image"],
  },
};

const HERO_PRODUCTS = [
  "koc-my-pham-ai-review-dep-chot-don",
  "koc-gia-dung-ai-anh-thanh-video-chot-don",
  "koc-pho-ai-thu-do-video-affiliate",
];

function pickBySlug(products: Product[], slugs: string[], fallbackLimit: number) {
  const picked = slugs
    .map((slug) => products.find((product) => product.slug === slug || product.slug.startsWith(`${slug}-`)))
    .filter(Boolean) as Product[];

  const fallback = products.filter((product) => !picked.some((item) => item.id === product.id)).slice(0, fallbackLimit - picked.length);
  return [...picked, ...fallback].slice(0, fallbackLimit);
}

export default async function Home() {
  const supabase = await createClient();

  const [{ data: newest }, { data: chatbots }, { data: workflows }, { data: freeTools }] = await Promise.all([
    supabase.from("products").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(6),
    supabase.from("products").select("*").eq("is_published", true).eq("type", "chatbot").order("created_at", { ascending: false }).limit(16),
    supabase.from("products").select("*").eq("is_published", true).eq("type", "workflow").order("created_at", { ascending: false }).limit(8),
    supabase.from("products").select("*").eq("is_published", true).eq("is_free", true).order("created_at", { ascending: false }).limit(4),
  ]);

  const newestProducts = applyProductsOverrides((newest ?? []) as Product[]);
  const chatbotProducts = applyProductsOverrides((chatbots ?? []) as Product[]);
  const workflowProducts = applyProductsOverrides((workflows ?? []) as Product[]);
  const freeProducts = applyProductsOverrides((freeTools ?? []) as Product[]);
  const heroProducts = pickBySlug(chatbotProducts, HERO_PRODUCTS, 3);
  const featuredWorkflows = workflowProducts.slice(0, 3);

  return (
    <AppShell>
      <section className={styles.hero}>
        <div className={`content-wrap ${styles.wrap}`}>
          <div>
            <span className="eyebrow">Hệ sinh thái AI bán hàng cho người Việt</span>
            <h1>
              Tạo ảnh, video & kịch bản chốt đơn <em>nhanh hơn cho shop, KOC và affiliate</em>
            </h1>
            <p className={styles.heroSub}>
              {SITE_NAME} gom sẵn chatbot theo ngành, workflow Google Flow và prompt miễn phí để anh/chị biến một ảnh sản phẩm
              thành concept, lời thoại, prompt video và nội dung bán hàng có thể triển khai ngay.
            </p>
            <div className={styles.heroCtas}>
              <Link className="btn btn-primary" href="/chatbot#combo-tu-chon">
                Chọn combo 3 chatbot →
              </Link>
              <Link className="btn btn-ghost" href="/workflow/dai-su-san-pham-ai-tao-anh-nguoi-viet-theo-nganh">
                Dùng tool miễn phí
              </Link>
              <Link className="btn btn-ghost" href="/prompt-mien-phi">
                Xem prompt miễn phí
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <b className="font-mono">3</b>
                <span>Chatbot tự chọn trong combo</span>
              </div>
              <div className={styles.stat}>
                <b className="font-mono">20+</b>
                <span>Prompt/tool/workflow đang có</span>
              </div>
              <div className={styles.stat}>
                <b className="font-mono">1:1</b>
                <span>Hỗ trợ qua Zalo cộng đồng</span>
              </div>
            </div>
          </div>

          <HeroHologram />
        </div>
      </section>

      <section className={styles.funnelStrip}>
        <div className={`content-wrap ${styles.funnelGrid}`}>
          {[
            ["01", "Thử miễn phí trước", "Dùng prompt và tool mẫu để xem cách tạo ảnh, lời thoại và prompt video cho sản phẩm của bạn."],
            ["02", "Chọn đúng ngành đang bán", "Mỗi chatbot được thiết kế theo từng nhóm sản phẩm như mỹ phẩm, gia dụng, thời trang, mẹ bé, thú cưng…"],
            ["03", "Nhận hướng dẫn sau mua", "Sau khi mở khóa, bạn có link sử dụng, hướng dẫn và cộng đồng Zalo để hỏi khi cần."],
          ].map(([num, title, body]) => (
            <div className={styles.funnelItem} key={num}>
              <span>{num}</span>
              <b>{title}</b>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 8 }}>
        <div className="content-wrap">
          <div className="rail">
            <span className="pill active">Nên bắt đầu</span>
            <Link className="pill" href="/workflow/dai-su-san-pham-ai-tao-anh-nguoi-viet-theo-nganh">
              Tool miễn phí
            </Link>
            <Link className="pill" href="/chatbot#combo-tu-chon">
              Combo 3 chatbot
            </Link>
            <Link className="pill" href="/workflow">
              Workflow video
            </Link>
            <Link className="pill" href="/bang-gia">
              Bảng giá
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 8 }}>
        <div className="content-wrap">
          <div className={styles.salesBand}>
            <div>
              <span className={styles.bandKicker}>Dùng thử miễn phí</span>
              <h2>Đại Sứ Sản Phẩm AI</h2>
              <p>
                Nhập ngành hàng, tên sản phẩm, mẫu sản phẩm và lợi ích chính để nhận ngay prompt tạo ảnh người Việt bán hàng,
                lời thoại tiếng Việt và prompt video ngắn. Phù hợp để bạn thử ý tưởng trước khi chọn chatbot hoặc workflow nâng cao.
              </p>
            </div>
            <div className={styles.bandActions}>
              <Link className="btn btn-primary" href="/workflow/dai-su-san-pham-ai-tao-anh-nguoi-viet-theo-nganh">
                Dùng miễn phí ngay
              </Link>
              <Link className="btn btn-ghost" href="/prompt-mien-phi">
                Xem thư viện prompt
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className="sec-head">
            <div>
              <h2>3 chatbot được nhiều người bán hàng cần nhất</h2>
              <p className="sub">Dành cho các ngành dễ làm video ngắn: mỹ phẩm, gia dụng và thời trang.</p>
            </div>
            <Link className="see-all" href="/chatbot">
              Xem tất cả chatbot →
            </Link>
          </div>

          <div className="grid">
            {heroProducts.length > 0 ? (
              heroProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  badge={index === 0 ? "premium" : "new"}
                  badgeLabels={index === 0 ? ["Bán chạy", "Phù hợp affiliate"] : ["Mới cập nhật"]}
                />
              ))
            ) : (
              <div className="empty-state">Chưa có chatbot phù hợp nào được đăng.</div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className={styles.comboPanel} id="combo-tu-chon-home">
            <div className={styles.comboCopy}>
              <span className={styles.bandKicker}>Combo tự chọn</span>
              <h2>Chọn 3 chatbot bất kỳ, thanh toán một lần</h2>
              <p>
                Nếu bạn đang bán nhiều ngành hàng, hãy chọn 3 chatbot phù hợp nhất với sản phẩm của mình. Hệ thống sẽ tự áp
                giá combo trong giỏ hàng và mở khóa sau khi thanh toán thành công.
              </p>
              <ul>
                <li>Giá combo rõ ràng, không phải mua từng chatbot lẻ.</li>
                <li>Gói năm giảm 20% cho người muốn dùng lâu dài.</li>
                <li>Sau mua có cộng đồng Zalo để nhận hướng dẫn và cập nhật mới.</li>
              </ul>
            </div>
            <div className={styles.comboCard}>
              <b>Gợi ý combo dễ dùng</b>
              <span>Mỹ phẩm + Gia dụng + Thời trang</span>
              <p>Đủ 3 nhóm sản phẩm hot cho TikTok Shop, Reels và affiliate.</p>
              <Link className="btn btn-primary" href="/chatbot#combo-tu-chon">
                Vào giỏ chọn combo →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className="sec-head">
            <div>
              <h2>Workflow giúp tạo output nhanh hơn</h2>
              <p className="sub">Dùng khi bạn đã có ảnh sản phẩm và muốn tạo nhanh ảnh/video bán hàng.</p>
            </div>
            <Link className="see-all" href="/workflow">
              Xem workflow →
            </Link>
          </div>

          <div className="grid">
            {featuredWorkflows.length > 0 ? (
              featuredWorkflows.map((product) => <ProductCard key={product.id} product={product} badgeLabels={product.is_free ? ["Mới cập nhật"] : ["Phù hợp affiliate"]} />)
            ) : (
              <div className="empty-state">Chưa có workflow nào được đăng.</div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className="sec-head">
            <div>
              <h2>Bắt đầu chỉ trong 3 bước</h2>
              <p className="sub">Không cần biết prompt từ đầu, chỉ cần đi theo từng bước.</p>
            </div>
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className="cmd">01 · Chọn ngành</div>
              <h3>Chọn chatbot hoặc workflow phù hợp</h3>
              <p>Chọn theo ngành bạn đang bán: mỹ phẩm, gia dụng, thời trang, mẹ bé, thú cưng, nông nghiệp…</p>
            </div>
            <div className={styles.step}>
              <div className="cmd">02 · Nhập sản phẩm</div>
              <h3>Điền tên, mẫu và lợi ích sản phẩm</h3>
              <p>Tool sẽ gợi ý concept, prompt ảnh người Việt, lời thoại tiếng Việt và prompt video theo đúng ngữ cảnh.</p>
            </div>
            <div className={styles.step}>
              <div className="cmd">03 · Tạo output</div>
              <h3>Copy một lần và triển khai</h3>
              <p>Dùng output cho Gemini, Flow, Veo, Kling, Runway, Luma hoặc đưa vào quy trình content đang dùng.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className={styles.demoGrid}>
            {[
              ["Ảnh đại sứ sản phẩm", "Người Việt, bối cảnh Việt Nam, sản phẩm rõ, dễ dùng làm video ngắn."],
              ["Lời thoại tiếng Việt", "Kịch bản nói tự nhiên, không quá quảng cáo, phù hợp TikTok/Reels/Shorts."],
              ["Prompt video 5 cảnh", "Hook, cận sản phẩm, demo, lợi ích và CTA được chia rõ để copy nhanh."],
              ["Cộng đồng sau mua", "Nhận hướng dẫn, cập nhật prompt/chatbot mới và chia sẻ output thực tế cùng người dùng khác."],
            ].map(([title, body]) => (
              <div className={styles.demoItem} key={title}>
                <span>✦</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className="sec-head">
            <div>
              <h2>Sản phẩm mới nhất</h2>
              <p className="sub">Các tool, chatbot và workflow vừa cập nhật trong {SITE_NAME}</p>
            </div>
          </div>

          <div className="grid">
            {newestProducts.length > 0 ? (
              newestProducts.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="empty-state">
                Chưa có sản phẩm nào. <Link href="/admin/quan-ly-san-pham">Thêm sản phẩm đầu tiên →</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {freeProducts.length > 0 && (
        <section className="section">
          <div className="content-wrap">
            <div className="sec-head">
              <div>
                <h2>Dùng thử miễn phí</h2>
                <p className="sub">Trải nghiệm prompt và tool mẫu trước khi chọn sản phẩm nâng cao.</p>
              </div>
              <Link className="see-all" href="/dung-thu-mien-phi">
                Vào trang dùng thử →
              </Link>
            </div>

            <div className="grid">
              {freeProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} badgeLabels={["Mới cập nhật"]} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="content-wrap">
          <div className={styles.ctaBand}>
            <div>
              <h3>Sẵn sàng tạo video AI bán hàng nhanh hơn?</h3>
              <p>Nhận prompt mới, ý tưởng demo output và ưu đãi combo từ {SITE_NAME}.</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>

      <Footer />
    </AppShell>
  );
}
