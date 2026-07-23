"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { createClient } from "@/lib/supabase/client";

export default function BuyButton({ productId, productSlug }: { productId: string; productSlug: string }) {
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

    const { data, error: insertError } = await supabase.rpc("create_purchase", {
      p_product_id: productId,
    });

    setLoading(false);
    if (insertError || !data) {
      setError(insertError?.message || "Không thể tạo đơn hàng, thử lại sau.");
      return;
    }
    track("begin_checkout", { product: productSlug });
    router.push(`/thanh-toan/${data}`);
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
