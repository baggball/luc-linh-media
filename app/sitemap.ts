import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { publicProductSlug } from "@/lib/product-url";
import { absoluteUrl } from "@/lib/site";
import { PRODUCT_TYPE_ROUTE, type ProductType } from "@/lib/types";

const STATIC_PAGES = [
  { path: "/", priority: 1, changeFrequency: "daily" as const },
  { path: "/chatbot", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/workflow", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/app-ai", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/veo3-workflow", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/prompt-mien-phi", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/viral-hooks", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/huong-dan", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/bang-gia", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/gioi-thieu", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/lien-he", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/chinh-sach-bao-mat", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/chinh-sach-hoan-tien", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/dieu-khoan-dich-vu", priority: 0.3, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, slug, type, updated_at, images")
    .eq("is_published", true);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: absoluteUrl(page.path),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const productEntries: MetadataRoute.Sitemap = (products ?? []).map((product) => ({
    url: absoluteUrl(
      `/${PRODUCT_TYPE_ROUTE[product.type as ProductType]}/${publicProductSlug({
        id: product.id,
        slug: product.slug,
      })}`,
    ),
    lastModified: product.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
    images: product.images ?? undefined,
  }));

  return [...staticEntries, ...productEntries];
}
