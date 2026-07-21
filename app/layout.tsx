import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lục Linh Media — Chợ Prompt & Công Cụ AI",
    template: "%s — Lục Linh Media",
  },
  description:
    "Chợ prompt, chatbot & workflow AI dành cho người sáng tạo nội dung và bán hàng tại Việt Nam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
