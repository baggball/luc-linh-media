import ProductDetailPage from "@/components/product/ProductDetailPage";

export const revalidate = 0;

export default async function AppDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailPage type="app" id={id} />;
}
