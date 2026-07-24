import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import BangGiaClient from "./BangGiaClient";

export const metadata = {
  title: "Bảng giá combo chatbot KOC AI",
  description:
    "Xem giá mua lẻ, combo 3 chatbot mũi nhọn và full bộ chatbot KOC AI dành cho affiliate, TikTok Shop và người bán hàng.",
  alternates: { canonical: "/bang-gia" },
};

export default function BangGiaPage() {
  return (
    <AppShell>
      <div className="content-wrap">
        <BangGiaClient />
      </div>
      <Footer />
    </AppShell>
  );
}
