"use client";

import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics";

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
    track("view_product", { product, category, price });
  }, [category, price, product]);

  return null;
}
