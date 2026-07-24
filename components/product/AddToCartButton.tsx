"use client";

import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";

const CART_KEY = "llm_chatbot_cart_ids";

export default function AddToCartButton({ productId, productSlug }: { productId: string; productSlug: string }) {
  const router = useRouter();

  function addToCart() {
    try {
      const current = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]") as string[];
      const next = current.includes(productId) ? current : [...current, productId].slice(0, 3);
      window.localStorage.setItem(CART_KEY, JSON.stringify(next));
      track("add_to_cart", { product: productSlug, count: next.length });
    } catch {
      window.localStorage.setItem(CART_KEY, JSON.stringify([productId]));
    }
    router.push("/chatbot?cart=1");
  }

  return (
    <button className="btn btn-ghost" type="button" onClick={addToCart} style={{ width: "100%" }}>
      Thêm vào giỏ combo
    </button>
  );
}
