import type { Product } from "@/lib/types";

type ProductOverride = Partial<Pick<Product, "title" | "description" | "images">>;

const PRODUCT_OVERRIDES: Record<string, ProductOverride> = {
  "workflow-koc-5-canh-tu-1-anh-san-pham": {
    title: "Video 5 Cảnh Từ 1 Ảnh",
    description:
      "Workflow Google Flow giúp biến 1 ảnh sản phẩm thành storyboard video bán hàng 5 cảnh: hook mở đầu, cận cảnh sản phẩm, demo sử dụng, lợi ích/cảm nhận và CTA chốt đơn.",
    images: ["https://luclinhvideoai.com/products/video-5-canh-tu-1-anh-cover-v2.png"],
  },
  "thay-quan-ao-cho-nganh-thoi-trang": {
    title: "Thay Đồ Thời Trang AI",
    description:
      "Workflow giúp tạo concept thay đồ thời trang bằng AI: biến một mẫu ảnh/người mẫu thành nhiều phong cách outfit, lookbook hoặc street style để bán quần áo, váy, áo khoác, túi, giày và phụ kiện.",
    images: ["https://luclinhvideoai.com/products/thay-do-thoi-trang-ai-cover-v2.png"],
  },
  "thay-quan-ao-cho-nganh-thoi-trang-mruclqyf": {
    title: "Thay Đồ Thời Trang AI",
    description:
      "Workflow giúp tạo concept thay đồ thời trang bằng AI: biến một mẫu ảnh/người mẫu thành nhiều phong cách outfit, lookbook hoặc street style để bán quần áo, váy, áo khoác, túi, giày và phụ kiện.",
    images: ["https://luclinhvideoai.com/products/thay-do-thoi-trang-ai-cover-v2.png"],
  },
};

export function applyProductOverrides<T extends Product>(product: T): T {
  const override = PRODUCT_OVERRIDES[product.slug];
  if (!override) return product;
  return { ...product, ...override };
}

export function applyProductsOverrides<T extends Product>(products: T[]): T[] {
  return products.map(applyProductOverrides);
}
