import ProductDetailPage from "@/components/product/ProductDetailPage";

export const revalidate = 0;

export default async function Veo3DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailPage type="veo3" id={id} />;
}
