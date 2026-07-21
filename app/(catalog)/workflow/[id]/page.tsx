import ProductDetailPage from "@/components/product/ProductDetailPage";

export const revalidate = 0;

export default async function WorkflowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailPage type="workflow" id={id} />;
}
