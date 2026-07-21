"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./bang-gia.module.css";

const MONTH = {
  unit: "/tháng",
  plans: [
    { price: "199.000đ", old: "399.000đ" },
    { price: "645.000đ", old: "1.290.000đ" },
    { price: "1.245.000đ", old: "2.490.000đ" },
  ],
};
const YEAR = {
  unit: "/năm",
  plans: [
    { price: "1.990.000đ", old: "3.990.000đ" },
    { price: "6.450.000đ", old: "12.900.000đ" },
    { price: "12.450.000đ", old: "24.900.000đ" },
  ],
};

const CHECK = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function BangGiaClient() {
  const [mode, setMode] = useState<"month" | "year">("month");
  const data = mode === "month" ? MONTH : YEAR;

  return (
    <div className={styles.wrap}>
      <div className="stat-row" style={{ justifyContent: "center", marginBottom: 28 }}>
        <span className="stat">
          👥 <b className="font-mono">6.200+</b>&nbsp;người dùng
        </span>
        <span className="stat">
          🤖 <b className="font-mono">210+</b>&nbsp;Chatbot Prompt
        </span>
        <span className="stat">
          🛒 <b className="font-mono">24.800+</b>&nbsp;lượt mua
        </span>
      </div>

      <div className={styles.pgHead}>
        <span className={styles.premiumBadge}>☆ Ưu đãi ra mắt — rẻ hơn 50%</span>
        <h1>
          Mở khóa toàn bộ <em>Chatbot Prompt</em>
        </h1>
        <p>Truy cập không giới hạn, hướng dẫn chi tiết và cập nhật mới nhất mỗi tuần.</p>
      </div>

      <div className={styles.toggle}>
        <div className={styles.toggleTrack}>
          <button className={`${styles.toggleOpt}${mode === "month" ? " " + styles.active : ""}`} onClick={() => setMode("month")}>
            Hàng tháng
          </button>
          <button className={`${styles.toggleOpt}${mode === "year" ? " " + styles.active : ""}`} onClick={() => setMode("year")}>
            Gói năm Studio <span className={styles.saveChip}>Tặng khoá học</span>
          </button>
        </div>
      </div>

      <div className={styles.plans}>
        <div className={styles.plan}>
          <div className={styles.planName}>Khởi đầu</div>
          <div className={styles.planDesc}>Người mới thử nghiệm AI làm video</div>
          <div className={styles.planPrice}>
            <span className={`${styles.amount} font-mono`}>{data.plans[0].price}</span>
            <span className={styles.unit}>{data.unit}</span>
          </div>
          <div className={`${styles.planOld} font-mono`}>{data.plans[0].old}</div>
          <button className={styles.planCta}>Bắt đầu</button>
          <ul className={styles.planFeats}>
            <li>{CHECK}5 chatbot/tháng (tự chọn)</li>
            <li>{CHECK}3 ngày Tools Workflow thử đầu</li>
            <li>{CHECK}Không có workflow template</li>
            <li>{CHECK}Cộng đồng hỗ trợ</li>
          </ul>
          <div className={styles.planFine}>
            <span>↩ Hoàn tiền 7 ngày nếu không hài lòng</span>
            <span>🛡 Bảo hành tài khoản AI 15 ngày · Hỗ trợ Zalo</span>
          </div>
        </div>

        <div className={`${styles.plan} ${styles.feat}`}>
          <span className={styles.planTag}>★ ĐƯỢC CHỌN NHIỀU NHẤT</span>
          <div className={styles.planName}>Sáng tạo</div>
          <div className={styles.planDesc}>Dành cho creator, KOC, freelancer cần chatbot &amp; workflow</div>
          <div className={styles.planPrice}>
            <span className={`${styles.amount} font-mono`}>{data.plans[1].price}</span>
            <span className={styles.unit}>{data.unit}</span>
          </div>
          <div className={`${styles.planOld} font-mono`}>{data.plans[1].old}</div>
          <button className={styles.planCta}>Chọn Sáng tạo</button>
          <ul className={styles.planFeats}>
            <li>{CHECK}15 chatbot/tháng (tự chọn)</li>
            <li>{CHECK}3 workflow template/tháng</li>
            <li>{CHECK}License Tools Workflow 30 ngày, gia hạn theo tháng</li>
            <li>{CHECK}Hỗ trợ ưu tiên</li>
          </ul>
          <div className={styles.planFine}>
            <span>↩ Hoàn tiền 7 ngày nếu không hài lòng</span>
            <span>🛡 Bảo hành tài khoản AI 15 ngày · Hỗ trợ Zalo</span>
          </div>
        </div>

        <div className={styles.plan}>
          <div className={styles.planName}>Studio</div>
          <div className={styles.planDesc}>Agency, doanh nghiệp làm video AI quy mô lớn</div>
          <div className={styles.planPrice}>
            <span className={`${styles.amount} font-mono`}>{data.plans[2].price}</span>
            <span className={styles.unit}>{data.unit}</span>
          </div>
          <div className={`${styles.planOld} font-mono`}>{data.plans[2].old}</div>
          <button className={styles.planCta} style={{ background: "var(--amber)", color: "#231604", border: "none" }}>
            Chọn Gói này
          </button>
          <ul className={styles.planFeats}>
            <li>
              {CHECK}Chatbot tuỳ chọn: <b className="font-mono">∞</b>
            </li>
            <li>
              {CHECK}Workflow template: <b className="font-mono">∞</b>
            </li>
            <li>{CHECK}License Tools Workflow 365 ngày</li>
            <li>{CHECK}Chatbot KHÔNG GIỚI HẠN — full toàn bộ kho</li>
            <li>{CHECK}Hỗ trợ 1-1 qua Zalo 24/7</li>
            <li>{CHECK}Cập nhật Chatbot hàng tuần</li>
          </ul>
          <div className={styles.planFine}>
            <span>↩ Hoàn tiền 2 ngày nếu không hài lòng</span>
            <span>🛡 Bảo hành tài khoản AI 15 ngày · Hỗ trợ Zalo</span>
          </div>
        </div>
      </div>

      <div className={styles.below}>
        <p>
          Không muốn theo gói? Bạn vẫn có thể mua lẻ từng Chatbot Prompt từ <b className="font-mono">99.000đ</b> — sở hữu vĩnh viễn.
        </p>
        <Link className="btn" href="/chatbot">
          Xem kho Chatbot Prompt
        </Link>
      </div>
    </div>
  );
}
