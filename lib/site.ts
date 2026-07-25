export const SITE_NAME = "Lục Linh Video AI";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://luclinhvideoai.com";
export const SITE_DESCRIPTION =
  "Kho chatbot, prompt và workflow AI giúp shop, KOC, affiliate tạo ảnh, video và kịch bản bán hàng nhanh hơn.";

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}
