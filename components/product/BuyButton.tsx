"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateOrderCode } from "@/lib/order-code";

export default function BuyButton({ productId, amount }: { productId: string; amount: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBuy() {
    setError("");
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/dang-nhap");
      return;
    }

    const { data, error: insertError } = await supabase
      .from("purchases")
      .insert({ user_id: user.id, product_id: productId, amount, order_code: generateOrderCode(), status: "pending" })
      .select("id")
      .single();

    setLoading(false);
    if (insertError || !data) {
      setError(insertError?.message || "Không thể tạo đơn hàng, thử lại sau.");
      return;
    }
    router.push(`/thanh-toan/${data.id}`);
  }

  return (
    <>
      {error && <p style={{ color: "var(--coral)", fontSize: 12.5, marginBottom: 8 }}>{error}</p>}
      <button className="btn btn-primary" onClick={handleBuy} disabled={loading} style={{ width: "100%" }}>
        {loading ? "Đang tạo đơn..." : "Mua ngay"}
      </button>
    </>
  );
}
