import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function Footer() {
  return (
    <footer>
      <div className="content-wrap">
        <div className="foot-grid">
          <div>
            <Link className="sidebar-brand" href="/" style={{ padding: "0 0 12px" }}>
              <span className="brand-mark">
                <Image
                  className="brand-logo-image"
                  src="/brand/luc-linh-logo-gold.png"
                  alt=""
                  width={38}
                  height={38}
                />
              </span>
              <span className="brand-word">
                Lục Linh
                <small>Video AI</small>
              </span>
            </Link>
            <p style={{ color: "var(--mute-dim)", fontSize: "13.5px", maxWidth: "32ch" }}>
              Chatbot, prompt và workflow AI dành cho KOC, người làm affiliate và bán hàng tại Việt Nam.
            </p>
          </div>
          <div>
            <h4>Sản phẩm</h4>
            <Link href="/chatbot">Chatbot</Link>
            <Link href="/workflow">Workflow</Link>
            <a href="https://luclinhmedia.com/" target="_blank" rel="noopener noreferrer">
              Kho tài nguyên ↗
            </a>
            <a href="https://luclinhonlineshop.io.vn/" target="_blank" rel="noopener noreferrer">
              Voice AI ↗
            </a>
          </div>
          <div>
            <h4>Công ty</h4>
            <Link href="/gioi-thieu">Giới thiệu</Link>
            <Link href="/bang-gia">Bảng giá</Link>
            <Link href="/huong-dan">Hướng dẫn</Link>
            <Link href="/lien-he">Liên hệ</Link>
          </div>
          <div>
            <h4>Hỗ trợ</h4>
            <Link href="/faq">Câu hỏi thường gặp</Link>
            <Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link href="/chinh-sach-hoan-tien">Chính sách hoàn tiền</Link>
            <Link href="/dieu-khoan-dich-vu">Điều khoản dịch vụ</Link>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} {SITE_NAME}. Bảo lưu mọi quyền.</span>
          <span className="font-mono">made in Việt Nam</span>
        </div>
      </div>
    </footer>
  );
}
