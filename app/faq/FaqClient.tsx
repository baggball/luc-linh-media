"use client";

import { useState } from "react";
import styles from "./faq.module.css";

const GROUPS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Tài khoản & Thanh toán",
    items: [
      {
        q: "Tôi có cần tạo tài khoản để dùng prompt miễn phí không?",
        a: "Không bắt buộc — bạn có thể xem và sao chép prompt mẫu miễn phí ngay mà không cần đăng ký. Tuy nhiên tạo tài khoản giúp lưu lại lịch sử mua hàng và đồng bộ trên nhiều thiết bị.",
      },
      {
        q: "Lục Linh Media hỗ trợ những phương thức thanh toán nào?",
        a: "Hiện tại chúng tôi hỗ trợ chuyển khoản ngân hàng bằng mã QR. SePay tự động xác nhận giao dịch và sản phẩm sẽ xuất hiện trong tài khoản của bạn ngay sau khi thanh toán thành công.",
      },
      {
        q: "Tôi có thể huỷ gói đăng ký bất cứ lúc nào không?",
        a: "Có. Các gói theo tháng/năm không ràng buộc thời hạn tối thiểu — bạn có thể huỷ bất cứ lúc nào và vẫn dùng được đến hết chu kỳ đã thanh toán.",
      },
    ],
  },
  {
    title: "Sản phẩm & Sử dụng",
    items: [
      {
        q: "Prompt mua rồi có dùng được mãi mãi không?",
        a: "Có, khi mua lẻ từng Chatbot Prompt bạn sở hữu vĩnh viễn. Với các gói theo tháng/năm, quyền truy cập chatbot/workflow gắn theo thời hạn gói đang hoạt động.",
      },
      {
        q: "Chatbot GPT hoạt động trên nền tảng nào?",
        a: "Chatbot dựng sẵn chạy trên ChatGPT (GPTs). Nếu cần triển khai trên Zalo OA, website riêng hoặc Facebook Messenger, bạn có thể đặt qua dịch vụ Custom Chatbot.",
      },
      {
        q: "Tôi không rành kỹ thuật thì có dùng được Workflow không?",
        a: "Có. Mọi workflow đều có hướng dẫn từng bước — bạn chỉ cần tải nguyên liệu đầu vào (ảnh, video...) và chọn thông số, workflow sẽ tự xử lý phần còn lại.",
      },
    ],
  },
  {
    title: "Hoàn tiền & Bảo hành",
    items: [
      {
        q: "Chính sách hoàn tiền như thế nào?",
        a: "Gói Khởi đầu và Sáng tạo được hoàn tiền trong 7 ngày nếu không hài lòng; gói Studio là 2 ngày. Xem chi tiết tại trang Chính sách hoàn tiền.",
      },
      {
        q: "Tài khoản AI đi kèm có được bảo hành không?",
        a: "Có, tài khoản AI đi kèm các gói đăng ký được bảo hành 15 ngày kể từ ngày kích hoạt, hỗ trợ xử lý qua Zalo.",
      },
      {
        q: "Làm sao để yêu cầu hoàn tiền?",
        a: "Gửi yêu cầu qua trang Liên hệ hoặc nhắn Zalo hotline kèm mã đơn hàng — đội ngũ sẽ xử lý trong vòng 24 giờ làm việc.",
      },
    ],
  },
];

export default function FaqClient() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <>
      {GROUPS.map((group) => (
        <div className={styles.faqGroup} key={group.title}>
          <div className={styles.faqGroupTitle}>{group.title}</div>
          {group.items.map((item) => {
            const key = group.title + item.q;
            const isOpen = openKey === key;
            return (
              <div className={`${styles.faqItem}${isOpen ? " " + styles.open : ""}`} key={key}>
                <button className={styles.faqQ} onClick={() => setOpenKey(isOpen ? null : key)}>
                  <span>{item.q}</span>
                  <svg className={styles.chev} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div className={styles.faqA}>
                  <div className={styles.faqAInner}>{item.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
