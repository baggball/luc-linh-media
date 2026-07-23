import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import CustomChatbotForm from "@/components/forms/CustomChatbotForm";

export const metadata: Metadata = {
  title: "Đặt làm Custom Chatbot",
  description: "Gửi yêu cầu xây dựng chatbot theo ngành hàng, nền tảng và quy trình bán hàng của bạn.",
  alternates: { canonical: "/custom-chatbot" },
};

export default function CustomChatbotPage() {
  return (
    <AppShell>
      <div className="content-wrap">
        <div className="layout-2col">
          <aside className="info-panel">
            <h1>Đặt làm Custom Chatbot riêng</h1>
            <p>Chatbot có sẵn chưa đúng ý? Mô tả ngành hàng và tính năng bạn cần, đội ngũ Lục Linh Video AI sẽ huấn luyện chatbot riêng cho bạn.</p>
            <div className="info-steps">
              <div className="info-step">
                <span className="num">1</span>
                <div>
                  <b>Gửi yêu cầu</b>
                  <span>Mô tả ngành hàng, tính năng và nền tảng triển khai mong muốn.</span>
                </div>
              </div>
              <div className="info-step">
                <span className="num">2</span>
                <div>
                  <b>Nhận báo giá trong 24h</b>
                  <span>Đội ngũ liên hệ qua Zalo/email để chốt phạm vi &amp; báo giá.</span>
                </div>
              </div>
              <div className="info-step">
                <span className="num">3</span>
                <div>
                  <b>Thống nhất và bàn giao</b>
                  <span>Chốt thời gian thực hiện, nghiệm thu và nhận hướng dẫn sử dụng.</span>
                </div>
              </div>
            </div>
            <div className="info-stats">
              <div className="stat">
                <b className="font-mono">24h</b>
                <span>mục tiêu phản hồi</span>
              </div>
              <div className="stat">
                <b className="font-mono">RÕ RÀNG</b>
                <span>phạm vi và báo giá</span>
              </div>
              <div className="stat">
                <b className="font-mono">1:1</b>
                <span>trao đổi yêu cầu</span>
              </div>
            </div>
          </aside>

          <CustomChatbotForm />
        </div>
      </div>
      <Footer />
    </AppShell>
  );
}
