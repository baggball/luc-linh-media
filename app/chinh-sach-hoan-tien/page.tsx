import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Chính sách hoàn tiền",
  description: "Điều kiện, thời hạn và quy trình xử lý hoàn tiền tại Lục Linh Video AI.",
  alternates: { canonical: "/chinh-sach-hoan-tien" },
};

export default function ChinhSachHoanTienPage() {
  return (
    <AppShell>
      <main className="content-wrap doc-wrap">
        <div className="doc-head">
          <h1>Chính sách hoàn tiền</h1>
          <span className="updated">Cập nhật lần cuối: 23/07/2026</span>
        </div>

        <div className="doc">
          <h2>1. Sản phẩm số mua lẻ</h2>
          <p>
            Vì chatbot, prompt, workflow và app là nội dung số được mở khóa ngay sau thanh toán, yêu cầu hoàn tiền được
            xem xét trong vòng 3 ngày kể từ thời điểm thanh toán khi có một trong các trường hợp:
          </p>
          <ul>
            <li>Thanh toán bị ghi nhận trùng cho cùng một đơn hàng.</li>
            <li>Giao dịch đã xác nhận nhưng sản phẩm không được mở khóa và đội ngũ không thể khắc phục.</li>
            <li>Sản phẩm lỗi kỹ thuật nghiêm trọng hoặc khác đáng kể so với mô tả tại thời điểm mua.</li>
          </ul>

          <h2>2. Dịch vụ tùy chỉnh</h2>
          <p>
            Với Video AI theo yêu cầu hoặc Custom Chatbot, điều kiện hoàn tiền được xác định theo báo giá/phạm vi đã
            chốt. Phần công việc đã hoàn thành và được khách hàng xác nhận sẽ không thuộc khoản hoàn lại. Nếu Lục Linh
            Video AI không thể tiếp tục thực hiện phần còn lại, khoản chưa thực hiện sẽ được đối soát để hoàn phù hợp.
          </p>

          <h2>3. Trường hợp không áp dụng</h2>
          <ul>
            <li>Khách hàng đổi ý sau khi sản phẩm số đã được mở khóa và sử dụng bình thường.</li>
            <li>Lỗi phát sinh do nền tảng bên thứ ba, thiết bị hoặc tài khoản của khách hàng không đáp ứng điều kiện.</li>
            <li>Sản phẩm bị sao chép, chia sẻ, bán lại hoặc sử dụng trái với điều khoản dịch vụ.</li>
            <li>Yêu cầu được gửi sau thời hạn nêu trên mà không có sự cố kỹ thuật đang được hỗ trợ.</li>
          </ul>

          <h2>4. Cách gửi yêu cầu</h2>
          <ol>
            <li>
              Gửi qua trang <Link href="/lien-he">Liên hệ</Link> hoặc Zalo 0379 062 594, kèm email tài khoản, mã đơn hàng
              và mô tả vấn đề.
            </li>
            <li>Đội ngũ xác nhận đã nhận yêu cầu và kiểm tra trong vòng 24 giờ làm việc.</li>
            <li>Nếu đủ điều kiện, khoản hoàn được xử lý trong 3–7 ngày làm việc theo thông tin hai bên xác nhận.</li>
          </ol>

          <div className="note-box">
            <span>
              Chúng tôi ưu tiên sửa lỗi hoặc bàn giao lại đúng sản phẩm trước khi hoàn tiền. Việc gửi yêu cầu không đồng
              nghĩa yêu cầu tự động được chấp thuận; kết quả dựa trên dữ liệu đơn hàng và tình trạng sử dụng thực tế.
            </span>
          </div>

          <div className="cta-band" style={{ marginTop: 36, textAlign: "center", padding: 26 }}>
            <h3 style={{ fontSize: 17, marginBottom: 6 }}>Cần hỗ trợ đơn hàng?</h3>
            <p style={{ marginBottom: 16 }}>Gửi mã đơn hàng để đội ngũ kiểm tra nhanh nhất.</p>
            <Link className="btn btn-primary" href="/lien-he">
              Liên hệ hỗ trợ →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </AppShell>
  );
}
