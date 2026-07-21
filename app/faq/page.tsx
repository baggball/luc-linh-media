import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import FaqClient from "./FaqClient";
import styles from "./faq.module.css";

export const metadata = { title: "Câu hỏi thường gặp" };

export default function FaqPage() {
  return (
    <AppShell>
      <section className="page-hero">
        <div className="content-wrap" style={{ maxWidth: 840 }}>
          <span className="eyebrow">HỖ TRỢ</span>
          <h1>
            Câu hỏi <em>thường gặp</em>
          </h1>
          <p>Chưa tìm được câu trả lời? Xem thêm ở trang Hướng dẫn hoặc liên hệ trực tiếp đội ngũ hỗ trợ.</p>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap" style={{ maxWidth: 840 }}>
          <FaqClient />

          <div className={styles.ctaBand}>
            <h3>Vẫn còn thắc mắc?</h3>
            <p>Đội ngũ Lục Linh Media luôn sẵn sàng hỗ trợ bạn.</p>
            <Link className="btn btn-primary" href="/lien-he">
              Liên hệ hỗ trợ →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </AppShell>
  );
}
