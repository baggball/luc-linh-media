import CatalogPage from "@/components/catalog/CatalogPage";

export const revalidate = 0;
export const metadata = {
  title: "Workflow Veo 3 tạo video AI chuyên nghiệp",
  description:
    "Quy trình và prompt Veo 3 dựng sẵn giúp tạo video quảng cáo, video KOC và video affiliate nhanh hơn.",
  alternates: { canonical: "/veo3-workflow" },
};

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
