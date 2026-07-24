import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import FaqAccordion from "@/components/product/FaqAccordion";
import CopyLinkButton from "@/components/product/CopyLinkButton";
import SaveButton from "@/components/product/SaveButton";
import BuyButton from "@/components/product/BuyButton";
import AddToCartButton from "@/components/product/AddToCartButton";
import ProductViewTracker from "@/components/product/ProductViewTracker";
import { createClient } from "@/lib/supabase/server";
import { getPublishedProduct } from "@/lib/products";
import { publicProductSlug } from "@/lib/product-url";
import { formatVND } from "@/lib/format";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { ZALO_COMMUNITY_URL } from "@/lib/community";
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
      question: isChatbot ? "Tôi cần tài khoản AI nào để sử dụng?" : "Tôi cần chuẩn bị gì để sử dụng?",
      answer: isChatbot
        ? "Bạn cần đăng nhập đúng nền tảng AI được bàn giao trong link sản phẩm, hiện ưu tiên Gemini/Gem cho các chatbot KOC. Khả năng tạo ảnh, video hoặc dùng công cụ nâng cao còn phụ thuộc tính năng tài khoản AI của bạn đang được hỗ trợ."
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

type SalesProfile = {
  audience: string;
  promise: string;
  buyers: string[];
  outcomes: string[];
  steps: { title: string; body: string }[];
  demos: { label: string; body: string }[];
  proof: string;
  faqs?: { question: string; answer: string }[];
};

const GENERIC_CHATBOT_PROFILE: SalesProfile = {
  audience: "Người làm nội dung, KOC, affiliate và shop nhỏ muốn tạo video AI nhanh hơn mà không phải tự nghĩ prompt từ đầu.",
  promise: "Nhận một trợ lý Gemini/AI đã được đóng gói sẵn để dẫn bạn từ ảnh sản phẩm đến concept, kịch bản và prompt video có thể đem đi chạy trên công cụ tạo video.",
  buyers: [
    "Người bán hàng online cần ra video đều nhưng thiếu ý tưởng",
    "Affiliate/KOC muốn tạo nhiều concept theo từng sản phẩm",
    "Shop nhỏ muốn thử video AI trước khi thuê đội content riêng",
  ],
  outcomes: [
    "Link chatbot AI theo ngách sản phẩm, mở được ngay sau khi thanh toán",
    "Bộ câu hỏi dẫn dắt để nhập đúng ảnh KOC, ảnh sản phẩm và thông tin bán hàng",
    "Prompt tạo ảnh tham chiếu, kịch bản ngắn, caption và CTA",
    "5 prompt video theo cùng một nhân vật, cùng sản phẩm và cùng phong cách",
    "Hỗ trợ 1:1 khi không mở được link hoặc chưa biết cách dùng",
  ],
  steps: [
    { title: "Mở chatbot", body: "Bấm link bàn giao sau thanh toán và đăng nhập nền tảng AI tương ứng." },
    { title: "Gõ START", body: "Chatbot sẽ hỏi đúng dữ liệu cần có thay vì để bạn tự mò." },
    { title: "Gửi ảnh sản phẩm", body: "Đưa ảnh sản phẩm, ảnh KOC hoặc mô tả người mẫu nếu chưa có ảnh." },
    { title: "Chọn concept", body: "Chatbot đề xuất nhiều hướng quay phù hợp với ngách hàng." },
    { title: "Tạo prompt video", body: "Nhận kịch bản và prompt dùng cho Veo, Flow hoặc công cụ video AI đang dùng." },
    { title: "Xuất bản", body: "Thêm logo, giá, caption và CTA rồi đăng TikTok, Reels hoặc Shorts." },
  ],
  demos: [
    { label: "Concept", body: "3 góc quay bán hàng theo vấn đề, lợi ích và khoảnh khắc dùng sản phẩm." },
    { label: "Prompt ảnh", body: "Ảnh KOC giữ đúng sản phẩm, bối cảnh rõ, ánh sáng thương mại." },
    { label: "Prompt video", body: "5 cảnh ngắn có hook, hành động chính, lời thoại và CTA." },
  ],
  proof: "Phù hợp để tạo bản nháp nội dung nhanh trong 15-30 phút, sau đó bạn tinh chỉnh lại theo thương hiệu và sản phẩm thật.",
};

function getSalesProfile(slug: string, title: string, type: ProductType): SalesProfile | null {
  if (type !== "chatbot") return null;

  if (slug.includes("koc-my-pham")) {
    return {
      audience: "KOC mỹ phẩm, spa, shop skincare và affiliate làm video review đẹp, rõ công dụng và có lời chốt tự nhiên.",
      promise: "Biến ảnh sản phẩm mỹ phẩm thành concept review, ảnh KOC tham chiếu, kịch bản nói chuyện và prompt video giữ đúng visual sản phẩm.",
      buyers: [
        "Shop mỹ phẩm/skincare muốn có video review đẹp mà không thuê mẫu thật mỗi ngày",
        "Affiliate TikTok Shop cần nhiều hook, nhiều góc review cho cùng một sản phẩm",
        "Spa, beauty seller cần kịch bản nói tự nhiên, tránh thổi phồng công dụng",
        "Người mới làm video AI muốn có quy trình hỏi - đáp sẵn, không tự viết prompt từ đầu",
      ],
      outcomes: [
        "Link Gem KOC Mỹ phẩm AI dùng riêng sau khi thanh toán",
        "Bộ câu hỏi dẫn nhập để lấy đúng: loại sản phẩm, công dụng, tệp khách, tone review",
        "Prompt tạo ảnh KOC beauty có ánh sáng sạch, giữ rõ chai/lọ/logo và cảm giác cao cấp",
        "5 prompt video review 15-30 giây có hook, hành động apply, cảm nhận và lời chốt",
        "Gợi ý caption, CTA và checklist tránh nói quá công dụng/y khoa",
      ],
      steps: [
        { title: "Chuẩn bị ảnh", body: "Ảnh sản phẩm rõ nhãn, ảnh KOC hoặc mô tả gương mặt/phong cách muốn dùng." },
        { title: "Gõ START", body: "Gem hỏi loại sản phẩm, tệp khách hàng, tone review và điểm mạnh thật." },
        { title: "Chọn concept", body: "Chọn hướng review sang, gần gũi, chuyên gia hoặc TikTok chốt đơn." },
        { title: "Tạo ảnh KOC", body: "Copy prompt ảnh sang Gemini/AI ảnh để tạo ảnh tham chiếu." },
        { title: "Gửi ảnh đạt", body: "Đưa ảnh KOC đã tạo lại cho Gem để giữ nhân vật nhất quán." },
        { title: "Lấy 5 video", body: "Copy từng prompt video sang Veo/Flow, rồi edit caption, giá và CTA." },
      ],
      demos: [
        { label: "Hook mở đầu", body: "“Da nhìn mệt nhưng vẫn muốn nền mịn? Mình test nhanh sản phẩm này trong 15 giây cho bạn xem.”" },
        { label: "Prompt ảnh KOC", body: "Cận mặt clean beauty, da khỏe tự nhiên, tay cầm đúng sản phẩm, nhãn rõ, ánh sáng studio mềm, nền tối giản cao cấp." },
        { label: "Video output", body: "5 cảnh: nêu vấn đề da, cận texture, apply sản phẩm, biểu cảm sau khi dùng, CTA mua hàng tự nhiên." },
      ],
      proof: "Trang này nên dùng để bán các sản phẩm skincare, makeup, body care và dụng cụ làm đẹp cần video review nhanh.",
      faqs: [
        { question: "Chatbot này có tự tạo video luôn không?", answer: "Không tạo video trực tiếp trên website. Chatbot tạo concept, ảnh tham chiếu, kịch bản và prompt video để bạn đưa sang Gemini/Veo/Flow hoặc công cụ video AI đang dùng." },
        { question: "Có phù hợp cho sản phẩm mỹ phẩm nhạy cảm như trị mụn, nám không?", answer: "Có thể dùng để làm nội dung, nhưng chatbot sẽ hướng dẫn viết theo hướng trải nghiệm và lợi ích hợp lý, tránh cam kết y khoa hoặc phóng đại kết quả." },
        { question: "Tôi chưa biết viết prompt có dùng được không?", answer: "Có. Bạn chỉ cần gõ START, trả lời câu hỏi của chatbot và copy output sang công cụ AI theo từng bước." },
      ],
    };
  }

  if (slug.includes("koc-gia-dung")) {
    return {
      audience: "Người bán đồ gia dụng, TikTok Shop, affiliate và shop muốn demo sản phẩm theo kiểu vấn đề - giải pháp.",
      promise: "Từ ảnh sản phẩm gia dụng, Gem dựng quy trình demo dễ hiểu: tình huống đau đầu, cách dùng, kết quả nhìn thấy và lời chốt mua.",
      buyers: [
        "Shop đồ gia dụng/đồ tiện ích cần video demo dễ hiểu, dễ chốt",
        "Affiliate TikTok Shop bán đồ bếp, đồ vệ sinh, hộp đựng, máy mini",
        "Người muốn biến ảnh sản phẩm tĩnh thành nhiều cảnh demo có hành động",
        "Team content cần ra nhiều kịch bản video theo vấn đề - giải pháp",
      ],
      outcomes: [
        "Link Gem KOC Gia dụng AI mở khóa trong tài khoản",
        "3 concept demo theo bối cảnh: bếp, phòng khách, nhà tắm, góc làm việc",
        "Prompt ảnh KOC đang cầm/dùng sản phẩm trong bối cảnh đời thật",
        "5 prompt video chia cảnh rõ: vấn đề, thao tác, kết quả, lợi ích, CTA",
        "Caption, checklist góc quay và lời chốt phù hợp đồ gia dụng",
      ],
      steps: [
        { title: "Gửi ảnh sản phẩm", body: "Ảnh chính diện, ảnh chi tiết và thông tin công dụng thật." },
        { title: "Chọn bối cảnh", body: "Bếp, nhà tắm, phòng khách, phòng ngủ hoặc góc làm việc." },
        { title: "Nhận concept", body: "Gem đề xuất 3 hướng demo theo vấn đề, tiện ích hoặc tiết kiệm thời gian." },
        { title: "Tạo ảnh tham chiếu", body: "Copy prompt ảnh để tạo KOC đang sử dụng sản phẩm." },
        { title: "Tạo video", body: "Nhận 5 prompt video có hành động chính rõ ràng cho từng cảnh." },
        { title: "Chốt đơn", body: "Thêm chữ, giá, mã giảm và CTA trước khi đăng." },
      ],
      demos: [
        { label: "Concept", body: "“Góc bếp bừa bộn thành gọn gàng trong 20 giây nhờ một món nhỏ ai cũng dùng được.”" },
        { label: "Prompt ảnh", body: "KOC đứng trong bếp sáng sạch, tay cầm sản phẩm đúng logo, mặt bàn có before/after rõ ràng." },
        { label: "Video output", body: "5 cảnh: nêu vấn đề, đưa sản phẩm vào khung hình, thao tác dùng, kết quả thấy ngay, CTA mua thử." },
      ],
      proof: "Rất hợp với đồ bếp, đồ vệ sinh, hộp đựng, máy mini, đồ tiện ích và sản phẩm giải quyết vấn đề hằng ngày.",
      faqs: [
        { question: "Tôi chỉ có ảnh sản phẩm từ sàn TMĐT, dùng được không?", answer: "Dùng được nếu ảnh rõ sản phẩm. Chatbot sẽ hướng dẫn tạo thêm ảnh KOC/bối cảnh trước khi lấy prompt video." },
        { question: "Sản phẩm không có người mẫu thì sao?", answer: "Chatbot có bước tạo KOC tham chiếu đang sử dụng sản phẩm, sau đó dùng ảnh đó để tạo prompt video nhất quán hơn." },
        { question: "Video tạo ra có bán hàng được ngay không?", answer: "Bạn vẫn nên thêm chữ, giá, logo shop, nhạc và CTA trong CapCut hoặc công cụ edit trước khi đăng." },
      ],
    };
  }

  if (slug.includes("koc-pho")) {
    return {
      audience: "Shop thời trang, phụ kiện, KOC thử đồ và affiliate cần video street style nhanh cho TikTok/Reels.",
      promise: "Tạo concept phối đồ, ảnh KOC mặc sản phẩm và prompt video chuyển động đường phố giữ đúng outfit, màu sắc và form dáng.",
      buyers: [
        "Shop thời trang/phụ kiện muốn tạo video thử đồ nhanh mà không thuê mẫu liên tục",
        "Affiliate bán túi, giày, outfit, đồng hồ, phụ kiện lifestyle",
        "Người làm TikTok/Reels cần nhiều concept street style, lookbook, outfit check",
        "Brand nhỏ muốn thử nhiều visual trước khi sản xuất video thật",
      ],
      outcomes: [
        "Link Gem KOC Phố/Thời trang AI dùng sau khi thanh toán",
        "Prompt thử đồ theo casual, luxury street, Gen Z, công sở trẻ hoặc đi chơi",
        "Kịch bản outfit check, chuyển dáng, close-up chất liệu và lời chốt",
        "5 prompt video có chuyển động rõ, giữ cùng nhân vật, outfit và màu sắc",
        "Caption, hashtag và CTA phù hợp affiliate thời trang/phụ kiện",
      ],
      steps: [
        { title: "Gửi ảnh đồ", body: "Ảnh áo, quần, túi, giày hoặc phụ kiện cần thử." },
        { title: "Chọn style", body: "Street, minimal, Gen Z, luxury, công sở hoặc đi chơi." },
        { title: "Tạo KOC", body: "Gem đưa prompt tạo ảnh người mẫu mặc đúng sản phẩm." },
        { title: "Kiểm tra ảnh", body: "Nếu sai logo, form hoặc màu, Gem đưa prompt sửa lại." },
        { title: "Lấy prompt video", body: "Nhận 5 cảnh outfit check, walk, close-up, reaction và CTA." },
        { title: "Đăng bán", body: "Thêm nhạc, chữ, giá và link sản phẩm trước khi đăng." },
      ],
      demos: [
        { label: "Hook", body: "“Một outfit đi cà phê nhưng lên hình như lookbook brand lớn — đây là cách phối nhanh.”" },
        { label: "Prompt ảnh KOC", body: "Người mẫu street style ở phố đêm, outfit đúng màu/form, phụ kiện rõ chi tiết, ánh sáng fashion editorial." },
        { label: "Video output", body: "5 cảnh: outfit reveal, bước đi qua phố, close-up chất liệu, đổi pose, CTA xem link sản phẩm." },
      ],
      proof: "Dùng tốt cho quần áo, túi, giày, phụ kiện, đồng hồ và sản phẩm cần hình ảnh lifestyle bắt mắt.",
      faqs: [
        { question: "AI có giữ đúng màu/form sản phẩm không?", answer: "Chatbot sẽ đưa prompt nhấn mạnh màu, form, logo và chi tiết sản phẩm. Tuy vậy output AI vẫn cần kiểm tra lại, nếu sai chatbot có hướng dẫn prompt sửa." },
        { question: "Có dùng được cho túi, giày, đồng hồ không?", answer: "Có. Nhóm sản phẩm phụ kiện/lifestyle rất hợp vì cần visual đẹp, chuyển động rõ và nhiều góc cận chi tiết." },
        { question: "Tôi có thể dùng cho TikTok Shop không?", answer: "Có. Chatbot có gợi ý hook, caption, hashtag và CTA để bạn chỉnh lại theo sản phẩm/thương hiệu trước khi đăng." },
      ],
    };
  }

  return {
    ...GENERIC_CHATBOT_PROFILE,
    audience: `${title} phù hợp cho người bán hàng cần một quy trình tạo nội dung AI theo ngách rõ ràng, dễ lặp lại.`,
  };
}

export default async function ProductDetailPage({ type, id }: { type: ProductType; id: string }) {
  const product = await getPublishedProduct(type, id);
  if (!product) notFound();
  const canonicalSlug = publicProductSlug(product);
  if (id !== canonicalSlug) {
    permanentRedirect(`/${PRODUCT_TYPE_ROUTE[type]}/${canonicalSlug}`);
  }

  const supabase = await createClient();
  const salesProfile = getSalesProfile(canonicalSlug, product.title, type);
  const productFaq = product.faq ?? [];
  const faq = productFaq.length > 0 ? productFaq : [...(salesProfile?.faqs ?? []), ...defaultFaq(type)];
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
      if (purchase) {
        hasPurchased = true;
      } else {
        const { data: comboItem } = await supabase
          .from("purchase_items")
          .select("id, purchases!inner(id)")
          .eq("product_id", product.id)
          .eq("purchases.user_id", user.id)
          .eq("purchases.status", "paid")
          .limit(1)
          .maybeSingle();
        hasPurchased = !!comboItem;
      }
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
            {salesProfile && (
              <div className="sales-promise">
                <span>Dành cho</span>
                <p>{salesProfile.audience}</p>
              </div>
            )}

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
                <a className="community-box" href={ZALO_COMMUNITY_URL} target="_blank" rel="noopener">
                  <b>Vào cộng đồng Zalo sau khi mở khóa</b>
                  <span>Nhận hỗ trợ, cập nhật prompt/chatbot mới và trao đổi cách triển khai thực tế.</span>
                </a>
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
                <a className="community-box" href={ZALO_COMMUNITY_URL} target="_blank" rel="noopener">
                  <b>Vào cộng đồng Zalo sau khi mua</b>
                  <span>Nơi nhận hướng dẫn, cập nhật và trao đổi cùng cộng đồng khách hàng Lục Linh.</span>
                </a>
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
                  <div className="detail-cta-stack">
                    <BuyButton productId={product.id} productSlug={canonicalSlug} />
                    {type === "chatbot" && <AddToCartButton productId={product.id} productSlug={canonicalSlug} />}
                  </div>
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
            <a className="community-box community-box-compact" href={ZALO_COMMUNITY_URL} target="_blank" rel="noopener">
              <b>Tham gia cộng đồng Zalo</b>
              <span>Vào nhóm để được chăm sóc sau mua và xem các cập nhật mới.</span>
            </a>
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
              {(salesProfile?.outcomes ?? [
                "Liên kết sản phẩm được mở khóa trong tài khoản của bạn",
                "Hướng dẫn và video đi kèm nếu sản phẩm có cung cấp",
                "Nhận các cập nhật được phát hành trên cùng sản phẩm",
                "Hỗ trợ lỗi truy cập qua Zalo trong thời hạn niêm yết",
              ]).map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
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
              {type === "chatbot" && <li>Chatbot hoạt động qua link AI được bàn giao, hiện ưu tiên Gemini/Gem; bạn cần đăng nhập tài khoản phù hợp để sử dụng</li>}
              <li>Kết quả AI phụ thuộc ảnh, dữ liệu đầu vào và nền tảng AI bên thứ ba</li>
              <li>Đây là công cụ hỗ trợ sáng tạo, không cam kết doanh số hoặc kết quả kinh doanh</li>
              <li>Không chia sẻ công khai, bán lại hoặc phát tán nguyên bản sản phẩm</li>
            </ul>
          </div>
        </div>

        {salesProfile && (
          <>
            <div className="detail-section">
              <div className="section-card buyer-fit-card">
                <div className="section-head-row">
                  <span className="ico value-ok">★</span>
                  <div>
                    <h2>Ai nên mua?</h2>
                    <div className="sub">Nhóm khách phù hợp nhất với chatbot này</div>
                  </div>
                </div>
                <div className="buyer-fit-grid">
                  {salesProfile.buyers.map((buyer) => (
                    <div className="buyer-fit-item" key={buyer}>
                      <span>✓</span>
                      <p>{buyer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="detail-section">
              <div className="section-card sales-workflow-card">
                <div className="section-head-row">
                  <span className="ico">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 6h5v5H4zM15 6h5v5h-5zM4 15h5v5H4zM15 15h5v5h-5z" />
                      <path d="M9 8.5h6M6.5 11v4M17.5 11v4M9 17.5h6" />
                    </svg>
                  </span>
                  <div>
                    <h2>Quy trình sử dụng 6 bước</h2>
                    <div className="sub">{salesProfile.promise}</div>
                  </div>
                </div>
                <div className="sales-step-grid">
                  {salesProfile.steps.map((step, index) => (
                    <div className="sales-step" key={step.title}>
                      <span className="sales-step-num">{index + 1}</span>
                      <div>
                        <b>{step.title}</b>
                        <p>{step.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="detail-section">
              <div className="section-card demo-output-card">
                <div className="section-head-row">
                  <span className="ico">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 5h16v14H4z" />
                      <path d="M8 9h8M8 13h5" />
                    </svg>
                  </span>
                  <div>
                    <h2>Demo output</h2>
                    <div className="sub">Khách nhìn thấy được đầu ra trước khi mua</div>
                  </div>
                </div>
                <div className="demo-output-grid">
                  {salesProfile.demos.map((demo) => (
                    <div className="demo-output-item" key={demo.label}>
                      <span>{demo.label}</span>
                      <p>{demo.body}</p>
                    </div>
                  ))}
                </div>
                <div className="demo-proof">{salesProfile.proof}</div>
                <div className="demo-cta-row">
                  <Link className="btn btn-ghost" href="/dung-thu-mien-phi">Dùng thử miễn phí</Link>
                  {type === "chatbot" && !hasAccess && <AddToCartButton productId={product.id} productSlug={canonicalSlug} />}
                  {!hasAccess &&
                    (user ? (
                      <BuyButton productId={product.id} productSlug={canonicalSlug} />
                    ) : (
                      <Link className="btn btn-primary" href="/dang-nhap">Đăng nhập để mua</Link>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}

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
