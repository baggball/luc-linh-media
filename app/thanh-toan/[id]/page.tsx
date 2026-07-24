import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatVND } from "@/lib/format";
import { PRODUCT_TYPE_ROUTE, type ProductType } from "@/lib/types";
import CheckoutStatus from "@/components/checkout/CheckoutStatus";

export const revalidate = 0;
export const metadata = { title: "Thanh toán", robots: { index: false, follow: false } };

export default async function ThanhToanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/dang-nhap?next=/thanh-toan/${id}`);

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, order_code, amount, status, product_id, products(title, type)")
    .eq("id", id)
    .maybeSingle();

  if (!purchase) notFound();

  const product = purchase.products as unknown as { title: string; type: ProductType } | null;
  const { data: itemData } = await supabase
    .from("purchase_items")
    .select("products(title, type)")
    .eq("purchase_id", purchase.id);
  const purchaseItems = (itemData ?? []) as unknown as { products: { title: string; type: ProductType } | null }[];
  const isMultiItem = purchaseItems.length > 1;
  const isCombo = purchaseItems.length === 3;
  const displayTitle = isCombo
    ? `Combo tự chọn ${purchaseItems.length} Chatbot KOC AI`
    : isMultiItem
      ? `Giỏ hàng Chatbot AI (${purchaseItems.length} sản phẩm)`
    : product?.title || "Đơn hàng";
  const bankAccount = process.env.SEPAY_BANK_ACCOUNT;
  const bankName = process.env.SEPAY_BANK_NAME;
  const bankAccountName = process.env.SEPAY_BANK_ACCOUNT_NAME;
  const qrUrl = `https://qr.sepay.vn/img?acc=${encodeURIComponent(bankAccount || "")}&bank=${encodeURIComponent(bankName || "")}&amount=${purchase.amount}&des=${encodeURIComponent(purchase.order_code)}`;
  const productHref = isMultiItem || !product ? "/tai-khoan/san-pham" : `/${PRODUCT_TYPE_ROUTE[product.type]}/${purchase.product_id}`;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: 440, background: "var(--ink-raised)", border: "1px solid var(--line)", borderRadius: 20, padding: "34px 30px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "linear-gradient(155deg, var(--electric-bright), var(--electric-deep))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#04101a",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
            </svg>
          </span>
          <span style={{ fontWeight: 800, fontSize: 15.5 }}>Lục Linh Video AI</span>
        </Link>

        <h1 style={{ fontSize: 21, marginBottom: 6 }}>Thanh toán đơn hàng</h1>
        <p style={{ color: "var(--mute)", fontSize: 14, marginBottom: 22 }}>
          {displayTitle} — <b style={{ color: "var(--paper)" }}>{formatVND(purchase.amount)}</b>
        </p>
        {isMultiItem && purchaseItems.length > 0 && (
          <div style={{ display: "grid", gap: 6, margin: "-10px 0 18px", padding: "12px 14px", borderRadius: 12, border: "1px solid var(--line)", background: "rgba(255,255,255,.025)" }}>
            {purchaseItems.map((item, index) => (
              <span key={`${item.products?.title}-${index}`} style={{ color: "var(--mute)", fontSize: 12.5 }}>
                ✓ {item.products?.title ?? "Chatbot trong combo"}
              </span>
            ))}
          </div>
        )}

        {!bankAccount || !bankName || !bankAccountName ? (
          <p style={{ color: "var(--coral)", fontSize: 13.5 }}>
            Chưa cấu hình tài khoản nhận thanh toán. Vui lòng liên hệ quản trị viên.
          </p>
        ) : (
          <CheckoutStatus
            purchaseId={purchase.id}
            initialStatus={purchase.status}
            qrUrl={qrUrl}
            orderCode={purchase.order_code}
            productHref={productHref}
            successCtaLabel={isMultiItem ? "Xem chatbot đã mở khóa" : "Xem sản phẩm ngay"}
            bankName={bankName}
            bankAccount={bankAccount}
            bankAccountName={bankAccountName}
            amount={purchase.amount}
          />
        )}
      </div>
    </div>
  );
}
