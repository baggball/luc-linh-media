import type { Metadata } from "next";
import { getPublishedProduct } from "@/lib/products";
import { publicProductSlug } from "@/lib/product-url";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { PRODUCT_TYPE_LABEL, PRODUCT_TYPE_ROUTE, type ProductType } from "@/lib/types";

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
  const canonical = absoluteUrl(`/${route}/${publicProductSlug(product)}`);
  const description = descriptionFor(product.title, product.description, kind);
  const image = product.images?.[0];

  return {
    title: product.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: canonical,
      siteName: SITE_NAME,
      title: product.title,
      description,
      images: image ? [{ url: image, alt: product.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
