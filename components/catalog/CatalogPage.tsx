import Link from "next/link";
import type { ReactNode } from "react";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import ProductCatalog from "@/components/catalog/ProductCatalog";
import { createClient } from "@/lib/supabase/server";
import { applyProductsOverrides } from "@/lib/product-overrides";
import { publicProductSlug } from "@/lib/product-url";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { PRODUCT_TYPE_LABEL, PRODUCT_TYPE_ROUTE, type Product, type ProductType } from "@/lib/types";

const CATALOG_SEO = {
  chatbot: {
    title: "Chatbot AI tạo video bán hàng theo từng ngành",
    intro:
      "Kho chatbot AI của Lục Linh Video AI giúp người bán hàng, shop online và người làm affiliate biến thông tin sản phẩm thành concept hình ảnh, lời thoại tiếng Việt, kịch bản review và prompt video ngắn. Mỗi chatbot được thiết kế theo một ngành hàng cụ thể để bạn dễ bắt đầu và tạo nội dung nhất quán hơn.",
    points: [
      ["Đúng ngành, đúng khách hàng", "Chọn chatbot theo mỹ phẩm, gia dụng, thời trang, mẹ bé, thú cưng, nông nghiệp và nhiều ngành khác."],
      ["Nội dung dành cho người Việt", "Ưu tiên nhân vật Việt Nam, bối cảnh quen thuộc, lời thoại tiếng Việt và cách chốt đơn tự nhiên."],
      ["Dễ đưa vào công cụ video AI", "Nhận prompt có cấu trúc để tiếp tục triển khai bằng Gemini, Google Flow, Veo, Kling hoặc công cụ bạn đang sử dụng."],
    ],
    faqs: [
      ["Chatbot AI bán hàng dùng để làm gì?", "Chatbot hướng dẫn bạn nhập đúng dữ liệu sản phẩm rồi tạo concept, kịch bản, lời thoại, caption và prompt video bán hàng theo từng ngành."],
      ["Tôi có cần biết viết prompt không?", "Không. Bạn chỉ cần làm theo câu hỏi hướng dẫn, cung cấp ảnh và thông tin thật của sản phẩm. Chatbot sẽ giúp sắp xếp thành prompt hoàn chỉnh."],
      ["Mua xong tôi nhận được gì?", "Sau khi thanh toán được xác nhận, tài khoản của bạn được mở khóa sản phẩm đã mua, kèm hướng dẫn sử dụng và cộng đồng Zalo hỗ trợ."],
    ],
  },
  workflow: {
    title: "Workflow AI giúp tạo ảnh và video bán hàng nhanh hơn",
    intro:
      "Workflow AI là quy trình được đóng gói sẵn để rút ngắn các bước tạo ảnh, storyboard, lời thoại và prompt video. Bạn nhập dữ liệu sản phẩm theo biểu mẫu, nhận đầu ra có cấu trúc và tiếp tục tạo nội dung trên công cụ AI phù hợp.",
    points: [
      ["Quy trình rõ từng bước", "Biết cần chuẩn bị ảnh nào, nhập thông tin gì và dùng đầu ra ở đâu thay vì thử prompt rời rạc."],
      ["Tái sử dụng cho nhiều sản phẩm", "Giữ cấu trúc làm việc ổn định và chỉ thay ảnh, lợi ích, đối tượng khách hàng hoặc phong cách nội dung."],
      ["Phù hợp video ngắn", "Dễ tạo storyboard và prompt cho TikTok, Facebook Reels, YouTube Shorts và nội dung affiliate."],
    ],
    faqs: [
      ["Workflow AI khác chatbot AI thế nào?", "Chatbot tập trung tư vấn và sinh nội dung qua hội thoại; workflow tập trung chuẩn hóa một chuỗi thao tác để tạo đầu ra nhanh và lặp lại được."],
      ["Workflow có tự tạo video miễn phí không?", "Không phải workflow nào cũng trực tiếp render video. Một số workflow tạo ảnh, storyboard và prompt để bạn đưa sang công cụ video AI; chi phí tạo video phụ thuộc nền tảng đó."],
      ["Người mới có sử dụng được không?", "Có. Mỗi sản phẩm đều mô tả dữ liệu cần chuẩn bị và quy trình sử dụng, phù hợp cả khi bạn chưa quen viết prompt."],
    ],
  },
} as const;

function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function isPublicCatalogHidden(product: Product) {
  const text = `${product.slug} ${product.title}`.toLowerCase();
  return text.includes("combo-test") || text.includes("san-pham-test") || text.includes("sản phẩm test");
}

export default async function CatalogPage({
  type,
  heading,
  description,
  ctaLabel,
  ctaHref,
}: {
  type: ProductType;
  heading: ReactNode;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .eq("type", type)
    .order("created_at", { ascending: false });

  const products = applyProductsOverrides((data ?? []) as Product[]).filter((product) => type !== "chatbot" || !isPublicCatalogHidden(product));
  const seo = type === "chatbot" || type === "workflow" ? CATALOG_SEO[type] : null;
  const listUrl = absoluteUrl(`/${PRODUCT_TYPE_ROUTE[type]}`);
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${PRODUCT_TYPE_LABEL[type]} | ${SITE_NAME}`,
    url: listUrl,
    inLanguage: "vi-VN",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/${PRODUCT_TYPE_ROUTE[type]}/${publicProductSlug(product)}`),
        name: product.title,
        image: product.images?.[0] ? absoluteUrl(product.images[0]) : undefined,
      })),
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: PRODUCT_TYPE_LABEL[type], item: listUrl },
    ],
  };
  const faqJsonLd = seo
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: seo.faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      }
    : null;

  return (
    <AppShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />}
      <div className="content-wrap">
        <div className="pg-head">
          <div className="crumb">
            <Link href="/">Trang chủ</Link>
            <span className="sep">/</span>
            <span className="cur">{PRODUCT_TYPE_LABEL[type]}</span>
          </div>
        </div>
        <div className="pg-head" style={{ paddingTop: 8 }}>
          <h1>{heading}</h1>
          <p>{description}</p>
        </div>

        <section className="section" style={{ padding: "26px 0 60px" }}>
          <ProductCatalog products={products} ctaLabel={ctaLabel} ctaHref={ctaHref} enableCart={type === "chatbot"} />
        </section>

        {seo && (
          <section className="catalog-seo" aria-labelledby={`${type}-seo-title`}>
            <h2 id={`${type}-seo-title`}>{seo.title}</h2>
            <p>{seo.intro}</p>
            <div className="catalog-seo-points">
              {seo.points.map(([title, body]) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
            <div className="catalog-seo-links" aria-label="Nội dung hữu ích">
              <Link href="/dung-thu-mien-phi">Dùng thử miễn phí</Link>
              <Link href="/prompt-mien-phi">Xem prompt miễn phí</Link>
              <Link href="/huong-dan">Hướng dẫn sử dụng</Link>
              <Link href="/bang-gia">Xem bảng giá</Link>
            </div>
            <h2>Câu hỏi thường gặp</h2>
            <div className="catalog-seo-faq">
              {seo.faqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </AppShell>
  );
}
