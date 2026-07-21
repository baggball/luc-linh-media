import ProductDetailPage from "@/components/product/ProductDetailPage";

export const revalidate = 0;

export default async function ChatbotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailPage type="chatbot" id={id} />;
}
