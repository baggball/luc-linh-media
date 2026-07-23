export const SITE_NAME = "Lục Linh Video AI";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://luclinhvideoai.com";
export const SITE_DESCRIPTION =
  "Chatbot, prompt và workflow AI giúp KOC, người làm affiliate tạo video bán hàng nhanh hơn, không cần biết kỹ thuật.";

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}
