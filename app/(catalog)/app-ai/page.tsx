import CatalogPage from "@/components/catalog/CatalogPage";

export const revalidate = 0;
export const metadata = {
  title: "Ứng dụng AI cho sáng tạo nội dung & bán hàng",
  description:
    "Khám phá ứng dụng AI tiếng Việt dành cho người sáng tạo, KOC, affiliate và chủ shop.",
  alternates: { canonical: "/app-ai" },
  robots: { index: false, follow: true },
};

export default function AppCatalogPage() {
  return (
    <CatalogPage
      type="app"
      heading={
        <>
          App AI cho <em>công việc hàng ngày</em>
        </>
      }
      description="Các App AI dựng sẵn, cài đặt nhanh và dùng ngay cho công việc sáng tạo nội dung, bán hàng."
    />
  );
}
