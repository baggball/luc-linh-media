import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Product, ProductType } from "@/lib/types";

export const getPublishedProduct = cache(async (type: ProductType, id: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("type", type)
    .eq("is_published", true)
    .maybeSingle();

  return (data as Product | null) ?? null;
});
