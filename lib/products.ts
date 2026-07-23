import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Product, ProductType } from "@/lib/types";

export const getPublishedProduct = cache(async (type: ProductType, id: string) => {
  const supabase = await createClient();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  const baseQuery = () =>
    supabase.from("products").select("*").eq("type", type).eq("is_published", true);

  if (isUuid) {
    const { data } = await baseQuery().eq("id", id).maybeSingle();
    return (data as Product | null) ?? null;
  }

  const { data: exact } = await baseQuery().eq("slug", id).maybeSingle();
  if (exact) return exact as Product;

  const { data: compatible } = await baseQuery().like("slug", `${id}-%`).limit(2);
  const product = compatible?.length === 1 ? compatible[0] : null;

  return (product as Product | null) ?? null;
});
