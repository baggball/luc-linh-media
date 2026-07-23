import CatalogPage from "@/components/catalog/CatalogPage";

export const revalidate = 0;
export const metadata = {
  title: "Workflow AI tạo video & nội dung tự động",
  description:
    "Workflow AI dựng sẵn giúp tự động hóa quy trình tạo ảnh, video, kịch bản và nội dung bán hàng.",
  alternates: { canonical: "/workflow" },
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
