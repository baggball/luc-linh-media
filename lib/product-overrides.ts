import type { Product } from "@/lib/types";

const IMAGE_OVERRIDES: Record<string, string[]> = {
  "thay-quan-ao-cho-nganh-thoi-trang-mruclqyf": [
    "https://luclinhvideoai.com/products/workflow-thay-quan-ao-thoi-trang-cover.png",
  ],
};

export function applyProductOverrides<T extends Product>(product: T): T {
  const images = IMAGE_OVERRIDES[product.slug];
  if (!images) return product;
  return { ...product, images };
}

export function applyProductsOverrides<T extends Product>(products: T[]): T[] {
  return products.map(applyProductOverrides);
}
