import type { Product } from "@/lib/types";

export function publicProductSlug(product: Pick<Product, "id" | "slug">) {
  return product.slug?.replace(/-[a-z0-9]{8}$/i, "") || product.id;
}
