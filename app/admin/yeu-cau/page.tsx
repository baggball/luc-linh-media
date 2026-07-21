import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;
export const metadata = { title: "Yêu cầu khách hàng" };

type Inquiry = {
  id: string;
  kind: "contact" | "video_request" | "custom_chatbot";
  name: string;
  email: string;
  phone_zalo: string | null;
  payload: Record<string, unknown>;
  status: string;
  created_at: string;
};

const KIND_LABEL: Record<Inquiry["kind"], string> = {
  contact: "Liên hệ",
  video_request: "Yêu cầu Video AI",
  custom_chatbot: "Custom Chatbot",
};

function payloadText(payload: Record<string, unknown>) {
  return Object.entries(payload)
    .filter(([, value]) => value !== "" && value !== null && value !== undefined)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
    .join(" · ");
}

export default async function AdminInquiriesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(200);
  const inquiries = (data ?? []) as Inquiry[];

  return (
    <div className="content-wrap" style={{ padding: 32 }}>
      <div className="crumb" style={{ marginBottom: 20 }}>
        <Link href="/">Trang chủ</Link><span className="sep">/</span><span className="cur">Yêu cầu khách hàng</span>
      </div>
      <div className="section-title">
        <div>
          <h1 style={{ fontSize: 26 }}>Yêu cầu khách hàng</h1>
          <p style={{ color: "var(--mute)", fontSize: 14, marginTop: 6 }}>Liên hệ, yêu cầu video và chatbot tùy chỉnh</p>
        </div>
        <span>{inquiries.length} yêu cầu</span>
      </div>

      <div style={{ display: "grid", gap: 14, marginTop: 22 }}>
        {inquiries.map((item) => (
          <article key={item.id} className="section-card">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
              <div>
                <div style={{ color: "var(--electric-bright)", fontSize: 12, fontWeight: 800 }}>{KIND_LABEL[item.kind]}</div>
                <h2 style={{ fontSize: 17, marginTop: 4 }}>{item.name}</h2>
              </div>
              <div style={{ color: "var(--mute-dim)", fontSize: 12 }}>{new Date(item.created_at).toLocaleString("vi-VN")}</div>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 13, marginBottom: 10 }}>
              <a href={`mailto:${item.email}`} style={{ color: "var(--electric-bright)" }}>{item.email}</a>
              {item.phone_zalo && <a href={`https://zalo.me/${item.phone_zalo.replace(/\D/g, "")}`} target="_blank" rel="noopener" style={{ color: "var(--electric-bright)" }}>{item.phone_zalo}</a>}
              <span style={{ color: "var(--amber)" }}>{item.status}</span>
            </div>
            <p style={{ color: "var(--mute)", fontSize: 13.5, whiteSpace: "pre-wrap" }}>{payloadText(item.payload)}</p>
          </article>
        ))}
        {inquiries.length === 0 && <div className="empty-added">Chưa có yêu cầu nào.</div>}
      </div>
    </div>
  );
}
