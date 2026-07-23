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
        q: "Lục Linh Video AI hỗ trợ những phương thức thanh toán nào?",
        a: "Hiện tại chúng tôi hỗ trợ chuyển khoản ngân hàng bằng mã QR. SePay tự động xác nhận giao dịch và sản phẩm sẽ xuất hiện trong tài khoản của bạn ngay sau khi thanh toán thành công.",
      },
      {
        q: "Website có tự động gia hạn hoặc tự động trừ tiền không?",
        a: "Không. Hiện tại mỗi đơn hàng được thanh toán riêng bằng mã QR ngân hàng. Website không lưu thông tin ngân hàng và không tự động trừ tiền.",
      },
    ],
  },
  {
    title: "Sản phẩm & Sử dụng",
    items: [
      {
        q: "Prompt mua rồi có dùng được mãi mãi không?",
        a: "Bạn được quyền tiếp tục sử dụng sản phẩm số đã mua theo điều khoản tại thời điểm mua. Không được chia sẻ công khai, bán lại hoặc phân phối lại nội dung gốc.",
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
        a: "Sản phẩm số được xem xét hoàn tiền trong vòng 3 ngày nếu thanh toán trùng, không được mở khóa hoặc có lỗi nghiêm trọng không thể khắc phục. Xem đầy đủ điều kiện tại trang Chính sách hoàn tiền.",
      },
      {
        q: "Nếu sản phẩm không mở khóa sau khi chuyển khoản thì sao?",
        a: "Hãy giữ nguyên nội dung chuyển khoản và gửi mã đơn hàng qua trang Liên hệ hoặc Zalo. Đội ngũ sẽ đối soát giao dịch và hỗ trợ mở khóa.",
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
