import type { Metadata } from "next";
import { getPublishedProduct } from "@/lib/products";
import { publicProductSlug } from "@/lib/product-url";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { PRODUCT_TYPE_LABEL, PRODUCT_TYPE_ROUTE, type ProductType } from "@/lib/types";

const PRODUCT_SEO_OVERRIDES: Record<string, { title: string; description: string }> = {
  "koc-my-pham-ai-review-dep-chot-don": {
    title: "KOC Mỹ Phẩm AI – Tạo Video Review Chốt Đơn",
    description:
      "Chatbot KOC Mỹ phẩm AI giúp tạo ảnh beauty, lời thoại tiếng Việt và prompt video review mỹ phẩm có hook, demo sản phẩm và CTA chốt đơn.",
  },
  "koc-gia-dung-ai-anh-thanh-video-chot-don": {
    title: "KOC Gia Dụng AI – Tạo Video Review Bán Hàng",
    description:
      "Chatbot KOC Gia dụng AI biến ảnh sản phẩm thành kịch bản, lời thoại tiếng Việt và prompt video review có cảnh demo, lợi ích và CTA bán hàng.",
  },
  "koc-pho-ai-thu-do-video-affiliate": {
    title: "KOC Thời Trang AI – Tạo Video Affiliate",
    description:
      "Chatbot KOC Thời trang AI giúp tạo ảnh người mẫu Việt, phối đồ đường phố, lời thoại và prompt video affiliate cho TikTok, Reels và Shorts.",
  },
};

function descriptionFor(title: string, description: string | null, kind: string) {
  const fallback = `${title} – ${kind} dựng sẵn giúp tạo video KOC, nội dung affiliate và kịch bản bán hàng nhanh hơn.`;
  const text = (description || fallback).replace(/\s+/g, " ").trim();
  return text.length > 158 ? `${text.slice(0, 155).replace(/\s+\S*$/, "")}…` : text;
}

export async function buildProductMetadata(type: ProductType, id: string): Promise<Metadata> {
  const product = await getPublishedProduct(type, id);

  if (!product) {
    return {
      title: "Không tìm thấy sản phẩm",
      robots: { index: false, follow: false },
    };
  }

  const kind = PRODUCT_TYPE_LABEL[type];
  const route = PRODUCT_TYPE_ROUTE[type];
  const slug = publicProductSlug(product);
  const canonical = absoluteUrl(`/${route}/${slug}`);
  const seo = PRODUCT_SEO_OVERRIDES[slug];
  const title = seo?.title ?? product.title;
  const description = seo?.description ?? descriptionFor(product.title, product.description, kind);
  const image = product.images?.[0];

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: image ? [{ url: image, alt: product.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
