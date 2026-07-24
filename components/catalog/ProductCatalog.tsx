"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import ProductCard from "@/components/product/ProductCard";
import { createClient } from "@/lib/supabase/client";
import { formatVND } from "@/lib/format";
import type { Product } from "@/lib/types";

type SortMode = "new" | "sold" | "price-asc" | "price-desc";
type BillingCycle = "monthly" | "yearly";

const COMBO_MONTHLY_PRICE = 399000;
const COMBO_YEARLY_PRICE = 3830000;

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function isComboTest(product: Product) {
  return product.slug.includes("combo-test") || product.title.toLowerCase().includes("combo test");
}

export default function ProductCatalog({
  products,
  ctaLabel,
  ctaHref,
  enableCart = false,
}: {
  products: Product[];
  ctaLabel?: string;
  ctaHref?: string;
  enableCart?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("new");
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    let list = products.filter((p) => !q || normalize(p.title).includes(q));
    list = list.slice();
    if (sort === "sold") list.sort((a, b) => b.sold_count - a.sold_count);
    else if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return list;
  }, [products, query, sort]);

  const cartProducts = useMemo(() => products.filter((product) => cartIds.includes(product.id)), [cartIds, products]);
  const subtotal = cartProducts.reduce((sum, product) => sum + product.price, 0);
  const isCombo = cartProducts.length === 3;
  const comboPrice = billingCycle === "yearly" ? COMBO_YEARLY_PRICE : COMBO_MONTHLY_PRICE;
  const checkoutTotal = isCombo ? comboPrice : subtotal;
  const saving = isCombo ? Math.max(subtotal - comboPrice, 0) : 0;

  function canAddToCart(product: Product) {
    return enableCart && product.type === "chatbot" && !product.is_free && !isComboTest(product);
  }

  function toggleCart(product: Product) {
    setError("");
    setCartIds((current) => {
      if (current.includes(product.id)) return current.filter((id) => id !== product.id);
      if (current.length >= 3) {
        setCartOpen(true);
        setError("Giỏ hàng combo hiện hỗ trợ tối đa 3 chatbot. Hãy bỏ bớt một chatbot nếu muốn chọn sản phẩm khác.");
        return current;
      }
      setCartOpen(true);
      return [...current, product.id];
    });
  }

  async function checkoutCart() {
    setError("");
    if (cartIds.length === 0) {
      setError("Giỏ hàng đang trống.");
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

    const { data, error: rpcError } = await supabase.rpc("create_cart_purchase", {
      p_product_ids: cartIds,
      p_billing_cycle: isCombo ? billingCycle : "monthly",
    });

    setLoading(false);
    if (rpcError || !data) {
      setError(rpcError?.message || "Không thể tạo đơn giỏ hàng, vui lòng thử lại.");
      return;
    }

    track(isCombo ? "begin_combo_checkout" : "begin_cart_checkout", {
      count: cartIds.length,
      billing: isCombo ? billingCycle : "single",
      value: checkoutTotal,
    });
    router.push(`/thanh-toan/${data}`);
  }

  return (
    <>
      <div className="tools-row">
        <div className="tools-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Tìm theo tên..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value as SortMode)}>
          <option value="new">Mới nhất</option>
          <option value="sold">Bán chạy nhất</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
        </select>
        <span className="result-count">{filtered.length} kết quả</span>
        {enableCart && (
          <button className="catalog-cart-open" type="button" onClick={() => setCartOpen(true)}>
            Giỏ hàng <b>{cartIds.length}</b>
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid">
          {filtered.map((p) => {
            const inCart = cartIds.includes(p.id);
            const allowCart = canAddToCart(p);
            return (
              <div className={`catalog-card-wrap${inCart ? " in-cart" : ""}`} key={p.id}>
                <ProductCard product={p} />
                {allowCart && (
                  <button className="add-cart-btn" type="button" onClick={() => toggleCart(p)}>
                    {inCart ? "✓ Đã trong giỏ" : "Thêm vào giỏ"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state" style={{ padding: "60px 20px" }}>
          <p>Không tìm thấy sản phẩm phù hợp. Thử từ khoá khác.</p>
        </div>
      )}

      {ctaLabel && ctaHref && (
        <div className="cta-band">
          <div>
            <h3>Không tìm thấy sản phẩm đúng ý?</h3>
            <p>Đặt làm sản phẩm riêng theo nhu cầu của bạn.</p>
          </div>
          <Link className="btn btn-primary" href={ctaHref}>
            {ctaLabel} →
          </Link>
        </div>
      )}

      {enableCart && (
        <>
          {cartIds.length > 0 && !cartOpen && (
            <button className="floating-cart-btn" type="button" onClick={() => setCartOpen(true)}>
              <span>Giỏ hàng</span>
              <b>{cartIds.length}</b>
            </button>
          )}
          {cartOpen && (
            <div className="cart-overlay" role="dialog" aria-modal="true" aria-label="Giỏ hàng chatbot">
              <button className="cart-backdrop" type="button" onClick={() => setCartOpen(false)} aria-label="Đóng giỏ hàng" />
              <aside className="cart-drawer">
                <div className="cart-head">
                  <div>
                    <span>Giỏ hàng</span>
                    <h2>Chatbot đã chọn</h2>
                  </div>
                  <button type="button" onClick={() => setCartOpen(false)} aria-label="Đóng">×</button>
                </div>

                {cartProducts.length === 0 ? (
                  <div className="cart-empty">
                    <p>Giỏ hàng đang trống. Hãy chọn chatbot muốn mua.</p>
                  </div>
                ) : (
                  <div className="cart-items">
                    {cartProducts.map((product) => (
                      <div className="cart-item" key={product.id}>
                        {product.images?.[0] ? <img src={product.images[0]} alt={product.title} /> : <div className="cart-thumb-fallback" />}
                        <div>
                          <b>{product.title}</b>
                          <span>{formatVND(product.price)}</span>
                        </div>
                        <button type="button" onClick={() => toggleCart(product)} aria-label={`Bỏ ${product.title}`}>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="cart-summary">
                  <div className="cart-row"><span>Tạm tính</span><b>{formatVND(subtotal)}</b></div>
                  {cartProducts.length < 3 && (
                    <p className="cart-hint">Chọn đủ 3 chatbot để tự động áp giá combo 399.000đ/tháng hoặc gói năm giảm 20%.</p>
                  )}
                  {isCombo && (
                    <>
                      <div className="cart-combo-box">
                        <span>Đã đủ 3 chatbot — áp giá combo</span>
                        <div className="combo-billing-toggle">
                          <button type="button" className={billingCycle === "monthly" ? "active" : ""} onClick={() => setBillingCycle("monthly")}>
                            Theo tháng
                          </button>
                          <button type="button" className={billingCycle === "yearly" ? "active" : ""} onClick={() => setBillingCycle("yearly")}>
                            Theo năm -20%
                          </button>
                        </div>
                      </div>
                      {saving > 0 && <div className="cart-row save"><span>Tiết kiệm</span><b>-{formatVND(saving)}</b></div>}
                    </>
                  )}
                  <div className="cart-row total"><span>Tổng thanh toán</span><b>{formatVND(checkoutTotal)}</b></div>
                  {error && <p className="combo-error">{error}</p>}
                  <button className="btn btn-primary" type="button" onClick={checkoutCart} disabled={loading || cartProducts.length === 0}>
                    {loading ? "Đang tạo đơn..." : "Tiến hành thanh toán"}
                  </button>
                  <button className="cart-continue" type="button" onClick={() => setCartOpen(false)}>
                    ← Tiếp tục xem sản phẩm
                  </button>
                </div>
              </aside>
            </div>
          )}
        </>
      )}
    </>
  );
}
