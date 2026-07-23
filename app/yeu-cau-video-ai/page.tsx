import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import RequestVideoForm from "@/components/forms/RequestVideoForm";

export const metadata = { title: "Yêu cầu Video AI" };

export default function YeuCauVideoAiPage() {
  return (
    <AppShell>
      <div className="content-wrap">
        <div className="layout-2col">
          <aside className="info-panel">
            <span className="new-badge">✦ Dịch vụ mới</span>
            <h1>Yêu cầu Video AI theo ý tưởng riêng</h1>
            <p>Không tìm được workflow có sẵn phù hợp? Mô tả ý tưởng của bạn, đội ngũ Lục Linh Video AI sẽ dựng video AI theo đúng yêu cầu.</p>
            <div className="info-steps">
              <div className="info-step">
                <span className="num">1</span>
                <div>
                  <b>Gửi yêu cầu</b>
                  <span>Điền form bên cạnh với mô tả càng chi tiết càng tốt.</span>
                </div>
              </div>
              <div className="info-step">
                <span className="num">2</span>
                <div>
                  <b>Nhận báo giá trong 24h</b>
                  <span>Đội ngũ liên hệ qua Zalo/email để chốt chi tiết &amp; báo giá.</span>
                </div>
              </div>
              <div className="info-step">
                <span className="num">3</span>
                <div>
                  <b>Nhận video hoàn chỉnh</b>
                  <span>Bàn giao video theo đúng nền tảng và thời lượng yêu cầu.</span>
                </div>
              </div>
            </div>
            <div className="info-stats">
              <div className="stat">
                <b className="font-mono">420+</b>
                <span>yêu cầu đã xử lý</span>
              </div>
              <div className="stat">
                <b className="font-mono">&lt; 24h</b>
                <span>thời gian báo giá</span>
              </div>
              <div className="stat">
                <b className="font-mono">4.9/5</b>
                <span>đánh giá dịch vụ</span>
              </div>
            </div>
          </aside>

          <RequestVideoForm />
        </div>
      </div>
      <Footer />
    </AppShell>
  );
}
