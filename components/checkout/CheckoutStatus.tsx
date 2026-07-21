"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutStatus({
  purchaseId,
  initialStatus,
  qrUrl,
  orderCode,
  productHref,
}: {
  purchaseId: string;
  initialStatus: string;
  qrUrl: string;
  orderCode: string;
  productHref: string;
}) {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    if (status === "paid") return;
    const supabase = createClient();
    const interval = setInterval(async () => {
      const { data } = await supabase.from("purchases").select("status").eq("id", purchaseId).maybeSingle();
      if (data?.status === "paid") setStatus("paid");
    }, 3000);
    return () => clearInterval(interval);
  }, [purchaseId, status]);

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
          Xem sản phẩm ngay
        </Link>
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
        Nội dung chuyển khoản: <b style={{ color: "var(--paper)" }}>{orderCode}</b>
      </div>
      <p style={{ color: "var(--mute-dim)", fontSize: 12.5, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span className="caret" style={{ width: 7, height: 15, background: "var(--electric-bright)", display: "inline-block" }}></span>
        Đang chờ thanh toán — trang sẽ tự cập nhật khi nhận được tiền
      </p>
    </div>
  );
}
