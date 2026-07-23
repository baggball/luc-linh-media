import Link from "next/link";
import styles from "./bang-gia.module.css";

const CHECK = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function BangGiaClient() {
  return (
    <div className={styles.wrap}>
      <div className="stat-row" style={{ justifyContent: "center", marginBottom: 28 }}>
        <span className="stat">✓ Giá công khai theo từng sản phẩm</span>
        <span className="stat">✓ Thanh toán QR tự động xác nhận</span>
        <span className="stat">✓ Hỗ trợ sử dụng 1:1</span>
      </div>

      <div className={styles.pgHead}>
        <span className={styles.premiumBadge}>Mua đúng nhu cầu · Không phí duy trì bắt buộc</span>
        <h1>
          Chọn cách phù hợp để <em>bắt đầu kinh doanh với AI</em>
        </h1>
        <p>
          Sản phẩm số được niêm yết giá riêng và mở khóa sau khi thanh toán. Dịch vụ tùy chỉnh được báo giá rõ ràng
          theo phạm vi công việc.
        </p>
      </div>

      <div className={styles.plans}>
        <div className={styles.plan}>
          <div className={styles.planName}>Mua sản phẩm lẻ</div>
          <div className={styles.planDesc}>Phù hợp khi bạn muốn dùng ngay một chatbot, workflow hoặc app cụ thể.</div>
          <div className={styles.planPrice}>
            <span className={`${styles.amount} font-mono`}>Niêm yết</span>
          </div>
          <div className={styles.planOld}>Giá hiển thị tại từng trang sản phẩm</div>
          <Link className={styles.planCta} href="/chatbot">
            Xem kho sản phẩm
          </Link>
          <ul className={styles.planFeats}>
            <li>{CHECK}Xem trước mô tả và quy trình sử dụng</li>
            <li>{CHECK}Thanh toán bằng QR ngân hàng</li>
            <li>{CHECK}Tự động mở khóa trong tài khoản</li>
            <li>{CHECK}Không tự động gia hạn</li>
          </ul>
        </div>

        <div className={`${styles.plan} ${styles.feat}`}>
          <span className={styles.planTag}>PHÙ HỢP KOC &amp; AFFILIATE</span>
          <div className={styles.planName}>Video AI theo yêu cầu</div>
          <div className={styles.planDesc}>Dành cho video sản phẩm, KOC, quảng cáo ngắn hoặc chiến dịch riêng.</div>
          <div className={styles.planPrice}>
            <span className={`${styles.amount} font-mono`}>Báo giá</span>
          </div>
          <div className={styles.planOld}>Theo thời lượng, số cảnh và mức độ hoàn thiện</div>
          <Link className={styles.planCta} href="/yeu-cau-video-ai">
            Gửi yêu cầu video
          </Link>
          <ul className={styles.planFeats}>
            <li>{CHECK}Trao đổi ý tưởng và nền tảng đăng</li>
            <li>{CHECK}Báo giá trước khi triển khai</li>
            <li>{CHECK}Chốt phạm vi và thời gian bàn giao</li>
            <li>{CHECK}Hỗ trợ 1:1 qua Zalo/email</li>
          </ul>
        </div>

        <div className={styles.plan}>
          <div className={styles.planName}>Chatbot riêng</div>
          <div className={styles.planDesc}>Dành cho cá nhân, shop hoặc doanh nghiệp cần chatbot theo ngành hàng.</div>
          <div className={styles.planPrice}>
            <span className={`${styles.amount} font-mono`}>Tùy chỉnh</span>
          </div>
          <div className={styles.planOld}>Theo nền tảng, dữ liệu và tính năng cần xây dựng</div>
          <Link className={styles.planCta} href="/custom-chatbot">
            Nhận tư vấn chatbot
          </Link>
          <ul className={styles.planFeats}>
            <li>{CHECK}Khảo sát mục tiêu và quy trình bán hàng</li>
            <li>{CHECK}Thiết kế hướng dẫn, câu lệnh và luồng hội thoại</li>
            <li>{CHECK}Bàn giao kèm hướng dẫn sử dụng</li>
            <li>{CHECK}Thống nhất chi phí trước khi thực hiện</li>
          </ul>
        </div>
      </div>

      <div className={styles.below}>
        <p>
          Chưa chắc nên chọn gì? Hãy gửi nhu cầu, đội ngũ sẽ gợi ý phương án phù hợp trước khi bạn thanh toán.
        </p>
        <Link className="btn" href="/lien-he">
          Liên hệ tư vấn
        </Link>
      </div>
    </div>
  );
}
