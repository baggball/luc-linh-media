import CatalogPage from "@/components/catalog/CatalogPage";

export const revalidate = 0;
export const metadata = { title: "VEO3 Workflow" };

export default function Veo3CatalogPage() {
  return (
    <CatalogPage
      type="veo3"
      heading={
        <>
          VEO3 Workflow cho <em>video AI chuyên nghiệp</em>
        </>
      }
      description="Workflow dựng video bằng Google Veo3 — quy trình dựng sẵn, chỉ cần thay nội dung theo sản phẩm của bạn."
    />
  );
}
