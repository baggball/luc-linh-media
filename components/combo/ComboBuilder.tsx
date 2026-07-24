"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { createClient } from "@/lib/supabase/client";
import { formatVND } from "@/lib/format";
import type { Product } from "@/lib/types";

const MONTHLY_PRICE = 399000;
const YEARLY_PRICE = 3830000;

function isComboTest(product: Product) {
  return product.slug.includes("combo-test") || product.title.toLowerCase().includes("combo test");
}

export default function ComboBuilder({ products }: { products: Product[] }) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const comboProducts = useMemo(
    () => products.filter((item) => item.type === "chatbot" && !item.is_free && item.is_published && !isComboTest(item)),
    [products]
  );
  const selectedProducts = comboProducts.filter((item) => selectedIds.includes(item.id));
  const selectedTotal = selectedProducts.reduce((sum, item) => sum + item.price, 0);
  const comboPrice = billingCycle === "yearly" ? YEARLY_PRICE : MONTHLY_PRICE;
  const saving = Math.max(selectedTotal - comboPrice, 0);

  function toggleProduct(productId: string) {
    setError("");
    setSelectedIds((current) => {
      if (current.includes(productId)) return current.filter((id) => id !== productId);
      if (current.length >= 3) {
        setError("Combo tự chọn chỉ gồm đúng 3 chatbot. Anh bỏ một sản phẩm rồi chọn lại nhé.");
        return current;
      }
      return [...current, productId];
    });
  }

  async function checkoutCombo() {
    setError("");
    if (selectedIds.length !== 3) {
      setError("Vui lòng chọn đúng 3 chatbot để tạo combo.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/dang-nhap?next=/chatbot");
      return;
    }

    const { data, error: rpcError } = await supabase.rpc("create_combo_purchase", {
      p_product_ids: selectedIds,
      p_billing_cycle: billingCycle,
    });

    setLoading(false);
    if (rpcError || !data) {
      setError(rpcError?.message || "Không thể tạo đơn combo, vui lòng thử lại.");
      return;
    }

    track("begin_combo_checkout", { count: selectedIds.length, billing: billingCycle, value: comboPrice });
    router.push(`/thanh-toan/${data}`);
  }

  if (comboProducts.length < 3) return null;

  return (
    <div className="combo-builder" id="combo-tu-chon">
      <div className="combo-builder-head">
        <div>
          <span className="combo-builder-kicker">Combo tự chọn</span>
          <h2>Chọn 3 chatbot bất kỳ, thanh toán một lần</h2>
          <p>Khách chọn đúng 3 chatbot phù hợp với ngách đang bán. Sau khi SePay xác nhận, tài khoản tự mở khóa cả 3 sản phẩm.</p>
        </div>
        <div className="combo-price-panel">
          <div className="combo-billing-toggle" aria-label="Chọn chu kỳ combo">
            <button type="button" className={billingCycle === "monthly" ? "active" : ""} onClick={() => setBillingCycle("monthly")}>
              Theo tháng
            </button>
            <button type="button" className={billingCycle === "yearly" ? "active" : ""} onClick={() => setBillingCycle("yearly")}>
              Theo năm -20%
            </button>
          </div>
          <b>{formatVND(comboPrice)}</b>
          <span>{billingCycle === "yearly" ? "Gói năm · tương đương 319.000đ/tháng" : "Gói tháng · chọn 3 chatbot"}</span>
        </div>
      </div>

      <div className="combo-pick-grid">
        {comboProducts.map((product) => {
          const active = selectedIds.includes(product.id);
          return (
            <button
              type="button"
              className={`combo-pick-card${active ? " active" : ""}`}
              onClick={() => toggleProduct(product.id)}
              key={product.id}
            >
              <span className="combo-check">{active ? "✓" : selectedIds.length < 3 ? "+" : "—"}</span>
              <b>{product.title}</b>
              <small>{product.is_free ? "Miễn phí" : formatVND(product.price)}</small>
            </button>
          );
        })}
      </div>

      <div className="combo-builder-foot">
        <div>
          <b>Đã chọn {selectedIds.length}/3 chatbot</b>
          <span>
            {selectedIds.length === 3
              ? `Giá lẻ: ${formatVND(selectedTotal)} · Giá combo: ${formatVND(comboPrice)}${saving > 0 ? ` · Tiết kiệm ${formatVND(saving)}` : ""}`
              : "Chọn đủ 3 chatbot để tạo đơn thanh toán combo."}
          </span>
        </div>
        <button className="btn btn-primary" type="button" onClick={checkoutCombo} disabled={loading || selectedIds.length !== 3}>
          {loading ? "Đang tạo đơn..." : "Thanh toán combo"}
        </button>
      </div>
      {error && <p className="combo-error">{error}</p>}
    </div>
  );
}
