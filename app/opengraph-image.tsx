import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} – Chatbot và workflow tạo video bán hàng`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 78px",
        color: "#f7fbff",
        background:
          "radial-gradient(circle at 82% 18%, rgba(67, 208, 255, .38), transparent 28%), radial-gradient(circle at 12% 82%, rgba(124, 92, 240, .3), transparent 30%), #07101f",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            color: "#06101b",
            background: "linear-gradient(145deg, #72ddff, #2fb1ff)",
          }}
        >
          ⚡
        </div>
        <div style={{ fontSize: 34, fontWeight: 800 }}>{SITE_NAME}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 26, maxWidth: 940 }}>
        <div style={{ fontSize: 72, lineHeight: 1.04, fontWeight: 900 }}>
          Tạo video KOC &amp; nội dung bán hàng nhanh hơn với AI
        </div>
        <div style={{ fontSize: 28, lineHeight: 1.35, color: "#b8c8da" }}>{SITE_DESCRIPTION}</div>
      </div>
      <div style={{ display: "flex", gap: 16, fontSize: 22, color: "#72ddff" }}>
        Chatbot GPT <span>•</span> Prompt Veo 3 <span>•</span> Workflow Affiliate
      </div>
    </div>,
    size,
  );
}
