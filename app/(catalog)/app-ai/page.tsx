import CatalogPage from "@/components/catalog/CatalogPage";

export const revalidate = 0;
export const metadata = { title: "App" };

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
