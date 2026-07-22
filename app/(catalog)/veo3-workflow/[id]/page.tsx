import type { Metadata } from "next";
import ProductDetailPage from "@/components/product/ProductDetailPage";
import { buildProductMetadata } from "@/lib/product-metadata";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return buildProductMetadata("veo3", id);
}

export default async function Veo3DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailPage type="veo3" id={id} />;
}
