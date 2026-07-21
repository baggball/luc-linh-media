import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import CustomChatbotForm from "@/components/forms/CustomChatbotForm";

export const metadata = { title: "Custom Chatbot" };

export default function CustomChatbotPage() {
  return (
    <AppShell>
      <div className="content-wrap">
        <div className="layout-2col">
          <aside className="info-panel">
            <h1>Đặt làm Custom Chatbot riêng</h1>
            <p>Chatbot có sẵn chưa đúng ý? Mô tả ngành hàng và tính năng bạn cần, đội ngũ Lục Linh Media sẽ huấn luyện chatbot riêng cho bạn.</p>
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
                  <b>Bàn giao trong 48h</b>
                  <span>Nhận chatbot đã huấn luyện, sẵn sàng dùng ngay trên nền tảng bạn chọn.</span>
                </div>
              </div>
            </div>
            <div className="info-stats">
              <div className="stat">
                <b className="font-mono">180+</b>
                <span>chatbot đã custom</span>
              </div>
              <div className="stat">
                <b className="font-mono">48h</b>
                <span>bàn giao trung bình</span>
              </div>
              <div className="stat">
                <b className="font-mono">4.9/5</b>
                <span>đánh giá dịch vụ</span>
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
