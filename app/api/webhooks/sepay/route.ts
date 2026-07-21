import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { extractOrderCode } from "@/lib/order-code";

type SepayWebhookPayload = {
  id: number | string;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  content: string;
  code: string | null;
  transferType: "in" | "out";
  transferAmount: number;
  referenceCode: string;
};

export async function POST(request: NextRequest) {
  if (!process.env.SEPAY_WEBHOOK_API_KEY || !process.env.SUPABASE_SECRET_KEY) {
    return NextResponse.json({ success: false, error: "payment service is not configured" }, { status: 503 });
  }

  const authHeader = request.headers.get("authorization") ?? "";
  const expected = `Apikey ${process.env.SEPAY_WEBHOOK_API_KEY}`;
  if (authHeader !== expected) {
    return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as SepayWebhookPayload;

  if (payload.transferType !== "in") {
    return NextResponse.json({ success: true, ignored: "not an incoming transfer" });
  }

  const orderCode = extractOrderCode(payload.code || "") || extractOrderCode(payload.content || "");
  if (!orderCode) {
    return NextResponse.json({ success: true, ignored: "no order code found in transaction content" });
  }

  const supabase = createAdminClient();
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, amount, status")
    .eq("order_code", orderCode)
    .maybeSingle();

  if (!purchase) {
    return NextResponse.json({ success: true, ignored: `no purchase found for order code ${orderCode}` });
  }
  if (purchase.status === "paid") {
    return NextResponse.json({ success: true, ignored: "purchase already paid" });
  }
  if (payload.transferAmount < purchase.amount) {
    return NextResponse.json({ success: true, ignored: "transfer amount is less than order amount" });
  }

  const { data: updatedPurchase, error: updateError } = await supabase
    .from("purchases")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      sepay_transaction_id: String(payload.id),
      sepay_reference_code: payload.referenceCode,
    })
    .eq("id", purchase.id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (updateError) {
    return NextResponse.json({ success: false, error: "failed to confirm payment" }, { status: 500 });
  }
  if (!updatedPurchase) {
    return NextResponse.json({ success: true, ignored: "purchase was already processed" });
  }

  return NextResponse.json({ success: true });
}
