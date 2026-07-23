import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import styles from "./gioi-thieu.module.css";

export const metadata = {
  title: "Giới thiệu Lục Linh Video AI",
  description:
    "Lục Linh Video AI xây dựng chatbot, prompt và workflow thực chiến cho người sáng tạo nội dung và bán hàng Việt Nam.",
  alternates: { canonical: "/gioi-thieu" },
};

export default function GioiThieuPage() {
  return (
    <AppShell>
      <section className="page-hero">
        <div className="content-wrap">
          <span className="eyebrow">VỀ LỤC LINH MEDIA</span>
          <h1>
            Giúp người sáng tạo Việt Nam <em>làm việc với AI</em> dễ dàng hơn mỗi ngày
          </h1>
          <p>
            Chúng tôi xây dựng kho prompt, chatbot và workflow đã được kiểm chứng — để bạn không phải mất hàng giờ mày
            mò cách &quot;nói chuyện&quot; với AI, mà dùng được ngay kết quả chất lượng.
          </p>
          <div className="stat-row" style={{ justifyContent: "center" }}>
            <div className="stat">
              <b className="font-mono">15+</b>
              <span>chatbot theo ngành</span>
            </div>
            <div className="stat">
              <b className="font-mono">4</b>
              <span>nhóm công cụ AI</span>
            </div>
            <div className="stat">
              <b className="font-mono">1:1</b>
              <span>hỗ trợ sử dụng</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className={styles.storyGrid}>
            <div>
              <span className="eyebrow" style={{ marginBottom: 14 }}>
                CÂU CHUYỆN CỦA CHÚNG TÔI
              </span>
              <p style={{ marginTop: 14 }}>
                Lục Linh Video AI ra đời từ chính trải nghiệm của đội ngũ sáng lập — những người từng mất hàng giờ mỗi
                ngày để viết kịch bản KOC, tạo ảnh sản phẩm và dựng video quảng cáo bằng AI, rồi nhận ra phần khó nhất
                không phải là công cụ, mà là biết &quot;yêu cầu&quot; đúng cách.
              </p>
              <p>
                Chúng tôi tin rằng AI chỉ thực sự hữu ích khi đi kèm với prompt đã được kiểm chứng và hướng dẫn rõ
                ràng. Vì vậy, Lục Linh Video AI tập trung biến những kịch bản, workflow phức tạp thành thứ ai cũng dùng
                được — không cần biết code, không cần hiểu kỹ thuật.
              </p>
              <p>Từ những prompt mẫu đầu tiên, chúng tôi đã phát triển thành một thư viện chatbot theo nhiều ngành hàng dành cho nhà sáng tạo và người bán hàng Việt Nam.</p>
            </div>
            <div className={styles.storyVisual}>
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="rgba(255,255,255,0.08)" />
                <path
                  d="M28 34h44a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H46l-10 10v-10h-8a8 8 0 0 1-8-8V42a8 8 0 0 1 8-8z"
                  fill="var(--paper)"
                />
                <circle cx="42" cy="50" r="3.2" fill="var(--electric-deep)" />
                <circle cx="58" cy="50" r="3.2" fill="var(--electric-deep)" />
                <path d="M76 22l2.4 5.6L84 30l-5.6 2.4L76 38l-2.4-5.6L68 30l5.6-2.4z" fill="var(--amber)" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className={styles.sectionHead}>
            <span className="eyebrow" style={{ justifyContent: "center", marginBottom: 14 }}>
              SỨ MỆNH
            </span>
            <h2>Giúp việc dùng AI trở nên đơn giản như sao chép &amp; dán</h2>
            <p>
              Mỗi prompt, chatbot và workflow trên Lục Linh Video AI đều được thử nghiệm thực tế trước khi đưa lên kho —
              để bạn tiết kiệm thời gian, tăng chất lượng nội dung và tập trung vào việc bán hàng, sáng tạo.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3>Chất lượng kiểm chứng</h3>
              <p>Mọi prompt đều được thử nghiệm thực tế trước khi đưa vào kho, không có sản phẩm &quot;chưa test&quot;.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
              </div>
              <h3>Tốc độ bàn giao</h3>
              <p>Yêu cầu tuỳ chỉnh được báo giá trong 24h và bàn giao trong tối đa 48h.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-9 8.4A8.5 8.5 0 1 1 21 11.5z" />
                </svg>
              </div>
              <h3>Hỗ trợ tận tâm</h3>
              <p>Đội ngũ hỗ trợ qua Zalo, phản hồi nhanh, đồng hành cùng bạn từ lúc mua đến lúc dùng thành thạo.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
                </svg>
              </div>
              <h3>Cập nhật liên tục</h3>
              <p>Kho prompt và chatbot được bổ sung hàng tuần theo xu hướng AI và nhu cầu thực tế người dùng.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className={styles.sectionHead}>
            <span className="eyebrow" style={{ justifyContent: "center", marginBottom: 14 }}>
              HÀNH TRÌNH
            </span>
            <h2>Những cột mốc của Lục Linh Video AI</h2>
          </div>

          <div className={styles.timeline}>
            <div className={styles.tItem}>
              <div className={styles.tWhen}>Quý 3 · 2025</div>
              <h3>Ra mắt phiên bản đầu tiên</h3>
              <p>Bộ 50 prompt mẫu đầu tiên cho ảnh sản phẩm và kịch bản KOC, phục vụ nhóm người dùng thân thiết.</p>
            </div>
            <div className={styles.tItem}>
              <div className={styles.tWhen}>Quý 4 · 2025</div>
              <h3>Vượt mốc 1.000 người dùng</h3>
              <p>Ra mắt dòng sản phẩm Chatbot GPT dựng sẵn theo ngành hàng, mở rộng sang mỹ phẩm và thời trang.</p>
            </div>
            <div className={styles.tItem}>
              <div className={styles.tWhen}>Quý 1 · 2026</div>
              <h3>Ra mắt Workflow &amp; VEO3 Workflow</h3>
              <p>Bổ sung quy trình tự động hoá từ ảnh sang video, cùng bộ lệnh Veo3 tối ưu sẵn theo mục đích.</p>
            </div>
            <div className={styles.tItem}>
              <div className={styles.tWhen}>Quý 2 · 2026</div>
              <h3>Mở rộng hệ sinh thái Video AI</h3>
              <p>Ra mắt dịch vụ Custom Chatbot và Yêu cầu Video AI theo yêu cầu riêng, mở rộng đội ngũ hỗ trợ.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className={styles.sectionHead}>
            <span className="eyebrow" style={{ justifyContent: "center", marginBottom: 14 }}>
              LIÊN HỆ
            </span>
            <h2>Cần tư vấn thêm? Chúng tôi luôn sẵn sàng</h2>
          </div>

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
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className={styles.ctaBand}>
            <h3>Sẵn sàng thử Lục Linh Video AI?</h3>
            <p>Tạo tài khoản miễn phí và nhận ngay 5 prompt mẫu để bắt đầu.</p>
            <div className={styles.ctaBtns}>
              <Link className="btn btn-primary" href="/dang-ky">
                Tạo tài khoản miễn phí →
              </Link>
              <Link className="btn btn-ghost" href="/prompt-mien-phi">
                Dùng thử prompt miễn phí
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </AppShell>
  );
}
