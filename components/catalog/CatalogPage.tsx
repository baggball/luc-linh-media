import Link from "next/link";
import type { ReactNode } from "react";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import ProductCatalog from "@/components/catalog/ProductCatalog";
import { createClient } from "@/lib/supabase/server";
import { PRODUCT_TYPE_LABEL, type Product, type ProductType } from "@/lib/types";

export default async function CatalogPage({
  type,
  heading,
  description,
  ctaLabel,
  ctaHref,
}: {
  type: ProductType;
  heading: ReactNode;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .eq("type", type)
    .order("created_at", { ascending: false });

  const products = (data ?? []) as Product[];

  return (
    <AppShell>
      <div className="content-wrap">
        <div className="pg-head">
          <div className="crumb">
            <Link href="/">Trang chủ</Link>
            <span className="sep">/</span>
            <span className="cur">{PRODUCT_TYPE_LABEL[type]}</span>
          </div>
        </div>
        <div className="pg-head" style={{ paddingTop: 8 }}>
          <h1>{heading}</h1>
          <p>{description}</p>
        </div>

        <section className="section" style={{ padding: "26px 0 60px" }}>
          <ProductCatalog products={products} ctaLabel={ctaLabel} ctaHref={ctaHref} enableCart={type === "chatbot"} />
        </section>
      </div>
      <Footer />
    </AppShell>
  );
}
