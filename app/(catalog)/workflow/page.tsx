import CatalogPage from "@/components/catalog/CatalogPage";
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Workflow AI tạo ảnh và video bán hàng",
  description:
    "Workflow AI dựng sẵn giúp tạo ảnh, storyboard, lời thoại và prompt video bán hàng cho TikTok, Reels, Shorts và affiliate.",
  alternates: { canonical: "/workflow", languages: { "vi-VN": "/workflow", "x-default": "/workflow" } },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/workflow",
    siteName: SITE_NAME,
    title: "Workflow AI tạo ảnh và video bán hàng",
    description: "Quy trình AI dựng sẵn để tạo ảnh, storyboard, lời thoại và prompt video ngắn nhanh hơn.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Workflow AI Lục Linh Video AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Workflow AI tạo ảnh và video bán hàng",
    description: "Quy trình AI dựng sẵn cho TikTok, Reels, Shorts và nội dung affiliate.",
    images: ["/opengraph-image"],
  },
};

export default function WorkflowCatalogPage() {
  return (
    <CatalogPage
      type="workflow"
      heading={
        <>
          Workflow AI cho <em>dựng nội dung tự động</em>
        </>
      }
      description="Workflow dựng sẵn — chỉ cần vài thao tác để tự động hoá quy trình tạo video, ảnh và kịch bản."
    />
  );
}
