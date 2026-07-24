"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { createClient } from "@/lib/supabase/client";
import { formatVND } from "@/lib/format";
import { ZALO_COMMUNITY_URL } from "@/lib/community";

export default function CheckoutStatus({
  purchaseId,
  initialStatus,
  qrUrl,
  orderCode,
  productHref,
  successCtaLabel = "Xem sản phẩm ngay",
  bankName,
  bankAccount,
  bankAccountName,
  amount,
}: {
  purchaseId: string;
  initialStatus: string;
  qrUrl: string;
  orderCode: string;
  productHref: string;
  successCtaLabel?: string;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  amount: number;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [copied, setCopied] = useState<"account" | "content" | null>(null);
  const trackedPaid = useRef(false);

  async function copyValue(value: string, kind: "account" | "content") {
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1800);
  }

  useEffect(() => {
    if (status === "paid") return;
    const supabase = createClient();
    const interval = setInterval(async () => {
      const { data } = await supabase.from("purchases").select("status").eq("id", purchaseId).maybeSingle();
      if (data?.status === "paid") setStatus("paid");
    }, 3000);
    return () => clearInterval(interval);
  }, [purchaseId, status]);

  useEffect(() => {
    if (status === "paid" && !trackedPaid.current) {
      trackedPaid.current = true;
      track("purchase_completed", {
        purchase_id: purchaseId,
        order_code: orderCode,
        product: productHref,
        value: amount,
        currency: "VND",
      });
    }
  }, [amount, orderCode, productHref, purchaseId, status]);

  if (status === "paid") {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 66,
            height: 66,
            margin: "0 auto 20px",
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(155deg, rgba(51,196,141,0.22), rgba(51,196,141,0.06))",
            border: "1px solid rgba(51,196,141,0.4)",
            color: "var(--success)",
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 style={{ fontSize: 19, marginBottom: 10 }}>Thanh toán thành công!</h2>
        <p style={{ color: "var(--mute)", fontSize: 14, marginBottom: 20 }}>Đơn hàng của bạn đã được xác nhận. Nội dung trả phí đã được mở khoá.</p>
        <Link className="btn btn-primary" href={productHref} style={{ display: "block", textAlign: "center" }}>
          {successCtaLabel}
        </Link>
        <a className="community-box community-box-success" href={ZALO_COMMUNITY_URL} target="_blank" rel="noopener">
          <b>Vào nhóm Zalo cộng đồng</b>
          <span>Nhận hướng dẫn, cập nhật prompt mới và trao đổi cách dùng với Lục Linh.</span>
        </a>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: "#fff", borderRadius: 14, padding: 12, marginBottom: 16 }}>
        <img src={qrUrl} alt="Mã QR thanh toán" style={{ width: "100%", display: "block", borderRadius: 8 }} />
      </div>
      <div
        style={{
          background: "var(--ink-card)",
          border: "1px solid var(--line-strong)",
          borderRadius: 10,
          padding: "10px 14px",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          color: "var(--mute)",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px 12px" }}>
          <span>Ngân hàng</span><b style={{ color: "var(--paper)" }}>{bankName}</b>
          <span>Số tài khoản</span><b style={{ color: "var(--paper)" }}>{bankAccount}</b>
          <span>Chủ tài khoản</span><b style={{ color: "var(--paper)" }}>{bankAccountName}</b>
          <span>Số tiền</span><b style={{ color: "var(--paper)" }}>{formatVND(amount)}</b>
          <span>Nội dung</span><b style={{ color: "var(--paper)" }}>{orderCode}</b>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <button className="btn btn-ghost" type="button" onClick={() => copyValue(bankAccount, "account")} style={{ flex: "1 1 160px" }}>
          {copied === "account" ? "Đã sao chép" : "Sao chép số tài khoản"}
        </button>
        <button className="btn btn-primary" type="button" onClick={() => copyValue(orderCode, "content")} style={{ flex: "1 1 160px" }}>
          {copied === "content" ? "Đã sao chép" : "Sao chép nội dung"}
        </button>
      </div>
      <p style={{ color: "var(--mute-dim)", fontSize: 12.5, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span className="caret" style={{ width: 7, height: 15, background: "var(--electric-bright)", display: "inline-block" }}></span>
        Đang chờ thanh toán — trang sẽ tự cập nhật khi nhận được tiền
      </p>
      <a className="community-box" href={ZALO_COMMUNITY_URL} target="_blank" rel="noopener">
        <b>Sau khi thanh toán, hãy vào cộng đồng Zalo</b>
        <span>Nơi nhận hỗ trợ, cập nhật và trao đổi cách triển khai video AI bán hàng.</span>
      </a>
    </div>
  );
}
