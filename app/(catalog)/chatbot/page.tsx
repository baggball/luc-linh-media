import CatalogPage from "@/components/catalog/CatalogPage";
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Chatbot AI tạo video bán hàng theo ngành",
  description:
    "Kho chatbot AI tạo video bán hàng theo ngành: mỹ phẩm, gia dụng, thời trang, mẹ bé, thú cưng. Tạo kịch bản, lời thoại tiếng Việt và prompt video.",
  alternates: { canonical: "/chatbot", languages: { "vi-VN": "/chatbot", "x-default": "/chatbot" } },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/chatbot",
    siteName: SITE_NAME,
    title: "Chatbot AI tạo video bán hàng theo ngành",
    description: "Chọn chatbot AI theo ngành để tạo ảnh KOC, kịch bản review, lời thoại tiếng Việt và prompt video bán hàng.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Kho chatbot AI Lục Linh Video AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chatbot AI tạo video bán hàng theo ngành",
    description: "Tạo kịch bản, lời thoại tiếng Việt và prompt video bán hàng theo đúng ngành sản phẩm.",
    images: ["/opengraph-image"],
  },
};

export default function ChatbotCatalogPage() {
  return (
    <CatalogPage
      type="chatbot"
      heading={
        <>
          Chatbot AI cho <em>người sáng tạo &amp; bán hàng</em>
        </>
      }
      description="Chatbot dựng sẵn theo ngành hàng — mở bằng link được bàn giao, làm theo hướng dẫn và tạo nội dung theo sản phẩm của bạn."
      ctaLabel="Yêu cầu Custom Chatbot"
      ctaHref="/custom-chatbot"
    />
  );
}
