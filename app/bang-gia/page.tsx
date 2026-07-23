import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import BangGiaClient from "./BangGiaClient";

export const metadata = {
  title: "Bảng giá chatbot & workflow AI",
  description:
    "Xem giá chatbot GPT, workflow video AI và dịch vụ tùy chỉnh dành cho KOC, affiliate và người bán hàng.",
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
