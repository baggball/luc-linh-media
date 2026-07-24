import Link from "next/link";
import styles from "./bang-gia.module.css";
import { ZALO_COMMUNITY_URL } from "@/lib/community";

const CHECK = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const plans = [
  {
    name: "Mua chatbot lẻ",
    tag: "BẮT ĐẦU NHẸ",
    price: "159K–199K",
    old: "Chọn đúng 1 ngành cần làm trước",
    desc: "Phù hợp khi bạn muốn test một ngách KOC cụ thể trước khi mua nhiều chatbot.",
    href: "/chatbot",
    cta: "Xem kho chatbot",
    features: [
      "Mua đúng sản phẩm đang cần",
      "Có mô tả, quy trình dùng và demo output",
      "Thanh toán QR, mở khóa trong tài khoản",
      "Không thuê bao, không tự gia hạn",
    ],
  },
  {
    name: "Combo 3 chatbot mũi nhọn",
    tag: "KHUYÊN DÙNG",
    price: "399K",
    old: "Tiết kiệm hơn mua lẻ từng sản phẩm",
    desc: "Combo cố định gồm 3 ngách dễ bán nhất: mỹ phẩm, gia dụng và thời trang/phố. Hợp cho người làm affiliate, TikTok Shop, Reels.",
    href: "/chatbot",
    cta: "Chọn combo 3 chatbot",
    featured: true,
    features: [
      "KOC Mỹ phẩm AI: review đẹp, chốt đơn",
      "KOC Gia dụng AI: demo đồ dùng thành video",
      "KOC Phố AI: thời trang, phụ kiện, outfit",
      "Ưu tiên hỗ trợ setup và hướng dẫn dùng",
    ],
  },
  {
    name: "Full bộ chatbot KOC",
    tag: "MỞ RỘNG KINH DOANH",
    price: "899K",
    old: "Dành cho người muốn phủ nhiều ngành",
    desc: "Dành cho team nội dung, shop nhiều ngành hoặc người muốn xây kho video AI affiliate lâu dài.",
    href: "/chatbot",
    cta: "Xem toàn bộ chatbot",
    features: [
      "Nhiều ngách KOC: mẹ & bé, pet, công nghệ, nội thất...",
      "Có thể dùng lặp lại nhiều lần theo sản phẩm mới",
      "Phù hợp xây hệ thống nội dung bán hàng",
      "Có thể nâng cấp theo phiên bản mới",
    ],
  },
];

export default function BangGiaClient() {
  return (
    <div className={styles.wrap}>
      <div className={styles.trustRow}>
        <span>✓ Sản phẩm số mua một lần</span>
        <span>✓ Thanh toán QR tự động xác nhận</span>
        <span>✓ Có link dùng sau khi mua</span>
        <span>✓ Hỗ trợ Zalo 1:1</span>
      </div>

      <div className={styles.pgHead}>
        <span className={styles.premiumBadge}>Bảng giá combo chatbot KOC AI</span>
        <h1>
          Chọn gói phù hợp để <em>bắt đầu tạo video bán hàng bằng AI</em>
        </h1>
        <p>
          Nếu mới bắt đầu, mua lẻ một chatbot để test. Nếu muốn chạy thật, combo 3 chatbot mũi nhọn là lựa chọn dễ ra nội dung và dễ bán nhất.
        </p>
      </div>

      <div className={styles.comboBand}>
        <div>
          <span className={styles.comboKicker}>Đang test thanh toán combo</span>
          <h2>Combo test SePay 15.000đ</h2>
          <p>Dùng riêng để anh kiểm tra QR, webhook SePay, tự động duyệt đơn và mở khóa sau thanh toán.</p>
        </div>
        <Link className="btn btn-primary" href="/chatbot/combo-test-sepay-15-000d">
          Mua thử combo 15K
        </Link>
      </div>

      <div className={styles.communityBand}>
        <div>
          <span>Cộng đồng khách hàng</span>
          <h2>Sau khi mua, khách được mời vào nhóm Zalo để được chăm sóc và thảo luận</h2>
          <p>Đây là cộng đồng dành cho khách hàng đã mua: nhận hướng dẫn dùng chatbot, chia sẻ output, cập nhật prompt mới và được Lục Linh đồng hành lâu dài.</p>
        </div>
        <a className="btn btn-primary" href={ZALO_COMMUNITY_URL} target="_blank" rel="noopener">
          Vào cộng đồng Zalo
        </a>
      </div>

      <div className={styles.plans}>
        {plans.map((plan) => (
          <div className={`${styles.plan} ${plan.featured ? styles.feat : ""}`} key={plan.name}>
            <span className={styles.planTag}>{plan.tag}</span>
            <div className={styles.planName}>{plan.name}</div>
            <div className={styles.planDesc}>{plan.desc}</div>
            <div className={styles.planPrice}>
              <span className={`${styles.amount} font-mono`}>{plan.price}</span>
            </div>
            <div className={styles.planOld}>{plan.old}</div>
            <Link className={styles.planCta} href={plan.href}>
              {plan.cta}
            </Link>
            <ul className={styles.planFeats}>
              {plan.features.map((feature) => (
                <li key={feature}>{CHECK}{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.compare}>
        <div className={styles.compareCard}>
          <h2>Nên chọn gói nào?</h2>
          <div className={styles.pickGrid}>
            <div><b>Người mới</b><span>Mua 1 chatbot lẻ để hiểu quy trình.</span></div>
            <div><b>Muốn bán thật</b><span>Chọn combo 3 chatbot mũi nhọn.</span></div>
            <div><b>Làm nhiều ngách</b><span>Chọn full bộ để phủ nhiều sản phẩm.</span></div>
          </div>
        </div>
        <div className={styles.compareCard}>
          <h2>Dịch vụ riêng</h2>
          <p>Nếu anh cần làm video AI theo yêu cầu hoặc xây chatbot riêng cho shop/doanh nghiệp, phần này vẫn báo giá theo phạm vi.</p>
          <div className={styles.serviceActions}>
            <Link href="/yeu-cau-video-ai">Gửi yêu cầu video</Link>
            <Link href="/custom-chatbot">Tư vấn chatbot riêng</Link>
          </div>
        </div>
      </div>

      <div className={styles.below}>
        <p>Gợi ý: sau khi test combo 15K thành công, anh có thể đổi combo thật thành sản phẩm riêng để khách mua trực tiếp.</p>
        <Link className="btn" href="/lien-he">
          Cần tư vấn chọn combo
        </Link>
      </div>
    </div>
  );
}
