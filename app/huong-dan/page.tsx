import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import styles from "./huong-dan.module.css";

export const metadata = { title: "Hướng dẫn" };

export default function HuongDanPage() {
  return (
    <AppShell>
      <section className="page-hero">
        <div className="content-wrap">
          <span className="eyebrow">HƯỚNG DẪN SỬ DỤNG</span>
          <h1>
            Bắt đầu với Lục Linh Media trong <em>vài phút</em>
          </h1>
          <p>Từ sao chép prompt đầu tiên đến chạy chatbot &amp; workflow tự động — mọi thứ bạn cần biết đều ở đây.</p>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className={styles.sectionHead}>
            <h2>Bắt đầu chỉ trong 3 bước</h2>
            <p>Không cần biết code, không cần cài đặt gì thêm</p>
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className="cmd">01 · Chọn sản phẩm</div>
              <h3>1. Chọn sản phẩm phù hợp</h3>
              <p>Duyệt theo ngành hàng: thời trang, mỹ phẩm, gia dụng, sách... mỗi sản phẩm có demo xem trước.</p>
            </div>
            <div className={styles.step}>
              <div className="cmd">02 · Quét QR chuyển khoản</div>
              <h3>2. Thanh toán an toàn</h3>
              <p>Quét mã QR ngân hàng và chuyển khoản đúng nội dung. SePay tự động xác nhận giao dịch.</p>
            </div>
            <div className={styles.step}>
              <div className="cmd">03 · Mở khóa tự động</div>
              <h3>3. Nhận sản phẩm ngay</h3>
              <p>Sản phẩm xuất hiện trong tài khoản ngay sau khi giao dịch được xác nhận thành công.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className={styles.sectionHead}>
            <h2>Hướng dẫn theo tính năng</h2>
            <p>Chọn đúng chủ đề bạn đang cần để xem hướng dẫn chi tiết</p>
          </div>
          <div className={styles.guideGrid}>
            <div className={styles.guideCard}>
              <div className={styles.guideIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="12" height="12" rx="2" />
                  <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
                </svg>
              </div>
              <h3>Cách sao chép &amp; dùng Prompt</h3>
              <p>Cách dán prompt vào ChatGPT, Midjourney, Nano Banana đúng cách và thay thông tin sản phẩm của bạn.</p>
              <Link className={styles.guideLink} href="/prompt-mien-phi">
                Xem prompt mẫu miễn phí →
              </Link>
            </div>
            <div className={styles.guideCard}>
              <div className={styles.guideIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-9 8.4A8.5 8.5 0 1 1 21 11.5z" />
                </svg>
              </div>
              <h3>Cách dùng Chatbot GPT</h3>
              <p>Kích hoạt chatbot đã mua, thiết lập lần đầu và mẹo khai thác tối đa từng chatbot theo ngành hàng.</p>
              <Link className={styles.guideLink} href="/chatbot">
                Khám phá Chatbot →
              </Link>
            </div>
            <div className={styles.guideCard}>
              <div className={styles.guideIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="18" cy="18" r="3" />
                  <path d="M6 9v3a3 3 0 0 0 3 3h6" />
                </svg>
              </div>
              <h3>Cách chạy Workflow</h3>
              <p>Tải nguyên liệu đầu vào, chọn thông số và nhận kết quả tự động — không cần biết kỹ thuật.</p>
              <Link className={styles.guideLink} href="/workflow">
                Khám phá Workflow →
              </Link>
            </div>
            <div className={styles.guideCard}>
              <div className={styles.guideIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </div>
              <h3>Cách thanh toán &amp; nhận sản phẩm</h3>
              <p>Các phương thức thanh toán được hỗ trợ, thời gian nhận sản phẩm và cách xem lại đơn hàng đã mua.</p>
              <Link className={styles.guideLink} href="/bang-gia">
                Xem bảng giá →
              </Link>
            </div>
            <div className={styles.guideCard}>
              <div className={styles.guideIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 4V2m0 20v-2M4 15H2m20 0h-2M6.3 6.3 5 5m14 14-1.3-1.3M6.3 17.7 5 19m14-14-1.3 1.3" />
                  <circle cx="15" cy="9" r="4" />
                </svg>
              </div>
              <h3>Cách đặt Custom Chatbot</h3>
              <p>Quy trình gửi yêu cầu, thời gian báo giá và bàn giao khi bạn cần chatbot huấn luyện riêng.</p>
              <Link className={styles.guideLink} href="/custom-chatbot">
                Đặt Custom Chatbot →
              </Link>
            </div>
            <div className={styles.guideCard}>
              <div className={styles.guideIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="6" width="14" height="12" rx="2" />
                  <path d="M16 10l6-4v12l-6-4" />
                </svg>
              </div>
              <h3>Cách gửi Yêu cầu Video AI</h3>
              <p>Mô tả ý tưởng, đính kèm ảnh tham khảo và theo dõi tiến độ báo giá cho video AI theo yêu cầu riêng.</p>
              <Link className={styles.guideLink} href="/yeu-cau-video-ai">
                Gửi yêu cầu →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className="cta-band">
            <div>
              <h3>Không tìm thấy hướng dẫn bạn cần?</h3>
              <p>Xem câu hỏi thường gặp hoặc liên hệ trực tiếp đội ngũ hỗ trợ.</p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link className="btn btn-primary" href="/faq">
                Xem câu hỏi thường gặp →
              </Link>
              <Link className="btn btn-ghost" href="/lien-he">
                Liên hệ hỗ trợ
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </AppShell>
  );
}
