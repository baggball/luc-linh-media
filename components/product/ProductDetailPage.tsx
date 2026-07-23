import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import FaqAccordion from "@/components/product/FaqAccordion";
import CopyLinkButton from "@/components/product/CopyLinkButton";
import SaveButton from "@/components/product/SaveButton";
import BuyButton from "@/components/product/BuyButton";
import ProductViewTracker from "@/components/product/ProductViewTracker";
import { createClient } from "@/lib/supabase/server";
import { getPublishedProduct } from "@/lib/products";
import { publicProductSlug } from "@/lib/product-url";
import { formatVND } from "@/lib/format";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { PRODUCT_TYPE_LABEL, PRODUCT_TYPE_ROUTE, type ProductType } from "@/lib/types";

const KIND_ICON: Record<ProductType, React.ReactNode> = {
  chatbot: <path d="M13 2 3 14h7l-1 8 10-12h-7z" />,
  workflow: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M6 9v3a3 3 0 0 0 3 3h6" />
    </>
  ),
  app: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  veo3: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M6 9v3a3 3 0 0 0 3 3h6" />
    </>
  ),
};

function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function defaultFaq(type: ProductType) {
  const isChatbot = type === "chatbot";
  return [
    {
      question: "Sau khi thanh toán tôi nhận được gì?",
      answer:
        "Sản phẩm được mở khóa trong tài khoản Lục Linh Video AI, gồm liên kết sử dụng, hướng dẫn đi kèm và video hướng dẫn nếu sản phẩm có cung cấp.",
    },
    {
      question: isChatbot ? "Tôi cần tài khoản ChatGPT nào để sử dụng?" : "Tôi cần chuẩn bị gì để sử dụng?",
      answer: isChatbot
        ? "Bạn cần đăng nhập ChatGPT để mở và trò chuyện với GPT. Khả năng tạo ảnh, video hoặc dùng công cụ nâng cao còn phụ thuộc tính năng mà tài khoản ChatGPT của bạn đang được hỗ trợ."
        : "Hãy xem phần mô tả và hướng dẫn của sản phẩm để chuẩn bị đúng ảnh, video hoặc dữ liệu đầu vào trước khi bắt đầu.",
    },
    {
      question: "Tôi có được chia sẻ hoặc bán lại sản phẩm không?",
      answer:
        "Không. Quyền mua dành cho người mua sử dụng vào công việc của mình; không được bán lại, phát tán công khai hoặc chia sẻ nguyên bản liên kết và nội dung được mở khóa.",
    },
    {
      question: "Nếu không mở được sản phẩm thì làm sao?",
      answer:
        "Hãy gửi mã đơn hàng qua Zalo hoặc trang Liên hệ. Đội ngũ sẽ kiểm tra quyền mua và hỗ trợ lỗi truy cập theo chính sách của website.",
    },
  ];
}

export default async function ProductDetailPage({ type, id }: { type: ProductType; id: string }) {
  const product = await getPublishedProduct(type, id);
  if (!product) notFound();
  const canonicalSlug = publicProductSlug(product);
  if (id !== canonicalSlug) {
    permanentRedirect(`/${PRODUCT_TYPE_ROUTE[type]}/${canonicalSlug}`);
  }

  const supabase = await createClient();
  const productFaq = product.faq ?? [];
  const faq = productFaq.length > 0 ? productFaq : defaultFaq(type);
  const listHref = `/${PRODUCT_TYPE_ROUTE[type]}`;
  const kindLabel = PRODUCT_TYPE_LABEL[type];
  const productUrl = absoluteUrl(`${listHref}/${canonicalSlug}`);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || undefined,
    image: product.images ?? [],
    category: kindLabel,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "VND",
      price: product.is_free ? 0 : product.price,
      availability: "https://schema.org/InStock",
    },
    ...(product.sold_count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating ?? 5,
            reviewCount: product.sold_count,
          },
        }
      : {}),
  };
  const faqJsonLd = faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasPurchased = false;
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    isAdmin = profile?.role === "admin";

    if (!product.is_free && !isAdmin) {
      const { data: purchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .eq("status", "paid")
        .maybeSingle();
      hasPurchased = !!purchase;
    }
  }

  const hasAccess = product.is_free || hasPurchased || isAdmin;
  let privateContent: { workflow_link: string | null; video_url: string | null } | null = null;
  if (hasAccess) {
    const { data: content } = await supabase
      .from("product_private_content")
      .select("workflow_link, video_url")
      .eq("product_id", product.id)
      .maybeSingle();
    privateContent = content;
  }

  const workflowLink = privateContent?.workflow_link ?? null;
  const videoUrl = privateContent?.video_url ?? null;

  return (
    <AppShell>
      <ProductViewTracker product={canonicalSlug} category={type} price={product.is_free ? 0 : product.price} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(productJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />}
      <div className="content-wrap">
        <div className="crumb" style={{ padding: "24px 0 0" }}>
          <Link href="/">Trang chủ</Link>
          <span className="sep">/</span>
          <Link href={listHref}>{kindLabel}</Link>
          <span className="sep">/</span>
          <span className="cur">{product.title}</span>
        </div>

        <div className="detail-grid" style={{ marginTop: 20 }}>
          <ProductGallery images={product.images} title={product.title} />

          <div>
            <div className="info-top">
              <span className="kind-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {KIND_ICON[type]}
                </svg>
                {kindLabel}
              </span>
              <SaveButton />
            </div>

            <h1 className="p-title">{product.title}</h1>

            <div className="detail-stat-row">
              <div className="stat-item">
                <div className="stat-icon" style={{ background: "rgba(242,181,68,0.16)", color: "var(--amber)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7L18.2 21 12 17.3 5.8 21l1.6-7.1L2 9.2l7.1-.6z" />
                  </svg>
                </div>
                <b>{product.sold_count > 0 ? (product.rating ?? 5).toFixed(1) : "Mới"}</b>
                <span>{product.sold_count > 0 ? "Đánh giá" : "Ra mắt"}</span>
              </div>
              <div className="stat-item">
                <div className="stat-icon" style={{ background: "rgba(51,196,141,0.16)", color: "var(--success)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 8l-9-5-9 5 9 5 9-5z" />
                    <path d="M3 8v8l9 5 9-5V8" />
                  </svg>
                </div>
                <b>{product.sold_count > 0 ? product.sold_count.toLocaleString("vi-VN") : "Mới"}</b>
                <span>Đã bán</span>
              </div>
              <div className="stat-item">
                <div className="stat-icon" style={{ background: "rgba(47,177,255,0.16)", color: "var(--electric-bright)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />
                  </svg>
                </div>
                <b>{product.warranty || "15 ngày"}</b>
                <span>Bảo hành</span>
              </div>
              <div className="stat-item">
                <div className="stat-icon" style={{ background: "rgba(124,92,240,0.16)", color: "var(--violet)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
                    <path d="M21 15a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2zM3 15a2 2 0 0 0 2 2h1v-5H5a2 2 0 0 0-2 2z" />
                  </svg>
                </div>
                <b>1:1</b>
                <span>Hỗ trợ</span>
              </div>
            </div>

            <div className="price-box">
              <div className="lbl">Giá</div>
              <div className={`val${product.is_free ? "" : " paid"}`}>
                {product.is_free ? "Miễn phí" : formatVND(product.price)}
              </div>
            </div>

            {product.is_free ? (
              <div className="access-box unlocked">
                <div className="access-head ok">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                  </svg>
                  {kindLabel} miễn phí — xem link và hướng dẫn bên dưới
                </div>
                {workflowLink && (
                  <>
                    <a className="btn btn-primary" href={workflowLink} target="_blank" rel="noopener">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <path d="M15 3h6v6" />
                        <path d="M10 14L21 3" />
                      </svg>
                      Mở ngay
                    </a>
                    <div className="link-field">
                      <span>{workflowLink}</span>
                      <CopyLinkButton text={workflowLink} />
                    </div>
                  </>
                )}
                <div className="access-caption">Copy link để sử dụng</div>
              </div>
            ) : hasAccess ? (
              <div className="access-box unlocked">
                <div className="access-head ok">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                  </svg>
                  {isAdmin
                    ? "Quyền quản trị viên — xem link mà không cần thanh toán"
                    : "Bạn đã mua sản phẩm này — xem link bên dưới"}
                </div>
                {workflowLink && (
                  <>
                    <a className="btn btn-primary" href={workflowLink} target="_blank" rel="noopener">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <path d="M15 3h6v6" />
                        <path d="M10 14L21 3" />
                      </svg>
                      Mở ngay
                    </a>
                    <div className="link-field">
                      <span>{workflowLink}</span>
                      <CopyLinkButton text={workflowLink} />
                    </div>
                  </>
                )}
                <div className="access-caption">Copy link để sử dụng</div>
              </div>
            ) : (
              <div className="access-box locked">
                <div className="access-head no">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Sản phẩm trả phí — mua để mở khoá toàn bộ nội dung
                </div>
                <div className="paid-price-line">{formatVND(product.price)}</div>
                {user ? (
                  <BuyButton productId={product.id} productSlug={canonicalSlug} />
                ) : (
                  <Link className="btn btn-primary" href="/dang-nhap">
                    Đăng nhập để mua
                  </Link>
                )}
                <div className="access-caption">
                  Thanh toán một lần · Mở khóa trong tài khoản ·{" "}
                  <Link href="/chinh-sach-hoan-tien">Xem chính sách hoàn tiền</Link>
                </div>
              </div>
            )}

            <div className="contact-box">
              <span className="ico">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-9 8.4A8.5 8.5 0 1 1 21 11.5z" />
                </svg>
              </span>
              <div>
                <a href="https://zalo.me/0379062594" target="_blank" rel="noopener">
                  Liên hệ Zalo tư vấn
                </a>
                <span>Người tạo: Đội ngũ {SITE_NAME}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-section product-value-grid">
          <div className="section-card product-value-card">
            <div className="section-head-row">
              <span className="ico value-ok">✓</span>
              <div>
                <h2>Bạn nhận được gì?</h2>
                <div className="sub">Quyền lợi rõ ràng sau khi đơn hàng được xác nhận</div>
              </div>
            </div>
            <ul className="product-value-list">
              <li>Liên kết sản phẩm được mở khóa trong tài khoản của bạn</li>
              <li>Hướng dẫn và video đi kèm nếu sản phẩm có cung cấp</li>
              <li>Nhận các cập nhật được phát hành trên cùng sản phẩm</li>
              <li>Hỗ trợ lỗi truy cập qua Zalo trong thời hạn niêm yết</li>
            </ul>
          </div>

          <div className="section-card product-value-card">
            <div className="section-head-row">
              <span className="ico value-note">!</span>
              <div>
                <h2>Cần biết trước khi mua</h2>
                <div className="sub">Để sử dụng đúng kỳ vọng và tránh mua nhầm</div>
              </div>
            </div>
            <ul className="product-value-list">
              {type === "chatbot" && <li>Chatbot hoạt động bên trong ChatGPT; bạn cần đăng nhập ChatGPT để sử dụng</li>}
              <li>Kết quả AI phụ thuộc ảnh, dữ liệu đầu vào và nền tảng AI bên thứ ba</li>
              <li>Đây là công cụ hỗ trợ sáng tạo, không cam kết doanh số hoặc kết quả kinh doanh</li>
              <li>Không chia sẻ công khai, bán lại hoặc phát tán nguyên bản sản phẩm</li>
            </ul>
          </div>
        </div>

        <div className="detail-section">
          <div className="section-card">
            <div className="section-head-row">
              <span className="ico">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
                </svg>
              </span>
              <div>
                <h2>Mô tả sản phẩm</h2>
              </div>
            </div>
            <div className="divider-line"></div>
            <p className="desc-text">{product.description || "Chưa có mô tả."}</p>
          </div>
        </div>

        <div className="detail-section">
          <div className="section-card">
            <div className="section-head-row">
              <span className="ico">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <div>
                <h2>Video hướng dẫn</h2>
                <div className="sub">Xem video để hiểu cách sử dụng {kindLabel.toLowerCase()} này</div>
              </div>
            </div>
            {hasAccess ? (
              videoUrl ? (
                <div className="video-box">
                  <div className="lock-circle playable">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <h3>Sẵn sàng phát</h3>
                  <a className="btn btn-primary" href={videoUrl} target="_blank" rel="noopener">
                    Xem video hướng dẫn
                  </a>
                </div>
              ) : (
                <div className="video-box">
                  <div className="lock-circle playable">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <h3>Chưa có video hướng dẫn</h3>
                  <p>Đội ngũ {SITE_NAME} sẽ cập nhật video sớm nhất.</p>
                </div>
              )
            ) : (
              <div className="video-box">
                <div className="lock-circle">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3>Video bị khoá</h3>
                <p>Mua sản phẩm để mở khoá video hướng dẫn</p>
                {user ? (
                  <BuyButton productId={product.id} productSlug={canonicalSlug} />
                ) : (
                  <Link className="btn btn-primary" href="/dang-nhap">
                    Đăng nhập để mua
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="detail-section">
          <div className="section-card">
            <div className="section-head-row">
              <span className="ico">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 4" />
                  <path d="M12 17h.01" />
                </svg>
              </span>
              <div>
                <h2>Câu hỏi thường gặp</h2>
              </div>
            </div>
            <div className="divider-line"></div>
            <FaqAccordion faq={faq} />
          </div>
        </div>
      </div>
      <Footer />
    </AppShell>
  );
}
