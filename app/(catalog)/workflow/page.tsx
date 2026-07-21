import CatalogPage from "@/components/catalog/CatalogPage";

export const revalidate = 0;
export const metadata = { title: "Workflow" };

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
