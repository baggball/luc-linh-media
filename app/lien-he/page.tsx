import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/forms/ContactForm";

export const metadata = { title: "Liên hệ" };

export default function LienHePage() {
  return (
    <AppShell>
      <section className="page-hero">
        <div className="content-wrap">
          <span className="eyebrow">LIÊN HỆ</span>
          <h1>
            Cần tư vấn thêm? <em>Chúng tôi luôn sẵn sàng</em>
          </h1>
          <p>Gửi câu hỏi qua form bên dưới hoặc liên hệ trực tiếp — đội ngũ Lục Linh Media phản hồi trong vòng 24 giờ.</p>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className="contact-grid">
            <div className="contact-card">
              <div className="value-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16v12H4z" />
                  <path d="M4 7l8 6 8-6" />
                </svg>
              </div>
              <h3>Email hỗ trợ</h3>
              <p>Phản hồi trong vòng 24h các ngày làm việc</p>
              <p className="v font-mono">luclinhstudio@gmail.com</p>
            </div>
            <div className="contact-card">
              <div className="value-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15.5a2.5 2.5 0 0 1-2.5 2.5A16 16 0 0 1 4 4.5 2.5 2.5 0 0 1 6.5 2h1a1 1 0 0 1 1 .8l1 4a1 1 0 0 1-.5 1.1L7.3 9.1a12 12 0 0 0 5.6 5.6l1.2-1.7a1 1 0 0 1 1.1-.5l4 1a1 1 0 0 1 .8 1v1z" />
                </svg>
              </div>
              <h3>Zalo / Hotline</h3>
              <p>8:30 – 21:00 tất cả các ngày trong tuần</p>
              <p className="v font-mono">0379 062 594</p>
            </div>
            <div className="contact-card">
              <div className="value-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3>Văn phòng</h3>
              <p>Làm việc từ xa, đội ngũ trên toàn quốc</p>
              <p className="v">TP. Hồ Chí Minh, Việt Nam</p>
            </div>
          </div>

          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </AppShell>
  );
}
