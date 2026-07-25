"use client";

import { useEffect, useRef } from "react";
import { trackBusinessEvent } from "@/lib/analytics-client";

export default function ProductViewTracker({
  product,
  category,
  price,
}: {
  product: string;
  category: string;
  price: number;
}) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackBusinessEvent("view_product", { product, category, price, value: price });
  }, [category, price, product]);

  return null;
}
