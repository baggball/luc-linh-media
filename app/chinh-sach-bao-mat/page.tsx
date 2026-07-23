import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description: "Cách Lục Linh Video AI thu thập, sử dụng và bảo vệ thông tin của khách hàng.",
  alternates: { canonical: "/chinh-sach-bao-mat" },
};

export default function ChinhSachBaoMatPage() {
  return (
    <AppShell>
      <main className="content-wrap doc-wrap">
        <div className="doc-head">
          <h1>Chính sách bảo mật</h1>
          <span className="updated">Cập nhật lần cuối: 23/07/2026</span>
        </div>

        <div className="doc">
          <h2>1. Thông tin chúng tôi thu thập</h2>
          <p>
            Khi bạn đăng ký tài khoản, mua sản phẩm hoặc gửi yêu cầu tư vấn, chúng tôi có thể nhận họ tên, email, số
            điện thoại/Zalo, nội dung yêu cầu, thông tin đơn hàng và trạng thái giao dịch. Chúng tôi không lưu số thẻ
            ngân hàng hay mật khẩu ngân hàng của bạn.
          </p>

          <h2>2. Mục đích sử dụng</h2>
          <ul>
            <li>Tạo và bảo vệ tài khoản, xử lý thanh toán, mở khóa sản phẩm đã mua.</li>
            <li>Phản hồi yêu cầu hỗ trợ, báo giá dịch vụ và xử lý khiếu nại.</li>
            <li>Gửi hướng dẫn hoặc ưu đãi khi bạn chủ động đăng ký nhận tin; bạn có thể yêu cầu ngừng nhận bất cứ lúc nào.</li>
            <li>Phòng chống gian lận, cải thiện chất lượng và bảo mật website.</li>
          </ul>

          <h2>3. Đơn vị hỗ trợ xử lý dữ liệu</h2>
          <p>
            Website sử dụng các nhà cung cấp hạ tầng cần thiết như Vercel (vận hành website), Supabase (tài khoản và dữ
            liệu), SePay/ngân hàng liên kết (xác nhận giao dịch). Các đơn vị này chỉ nhận dữ liệu cần thiết để cung cấp
            chức năng tương ứng.
          </p>
          <p>
            Vercel Web Analytics và Speed Insights được dùng để ghi nhận dữ liệu truy cập ẩn danh, nguồn giới thiệu,
            loại thiết bị và chỉ số tốc độ. Công cụ này không dùng cookie theo tài liệu của Vercel; chúng tôi không gửi
            email, số điện thoại hoặc nội dung biểu mẫu vào sự kiện phân tích.
          </p>

          <h2>4. Lưu trữ và bảo vệ</h2>
          <p>
            Chúng tôi áp dụng kiểm soát truy cập, kết nối HTTPS và giới hạn quyền trên cơ sở dữ liệu. Dữ liệu được giữ
            trong thời gian cần thiết để cung cấp dịch vụ, đối soát giao dịch và thực hiện nghĩa vụ liên quan.
          </p>

          <h2>5. Quyền của bạn</h2>
          <p>
            Bạn có thể yêu cầu xem, sửa hoặc xóa thông tin cá nhân không còn cần thiết bằng cách gửi email tới{" "}
            <b>luclinhstudio@gmail.com</b>. Một số dữ liệu giao dịch có thể cần được lưu theo thời hạn đối soát hoặc
            quy định áp dụng.
          </p>

          <h2>6. Liên hệ</h2>
          <p>
            Nếu có câu hỏi về quyền riêng tư, hãy dùng trang <Link href="/lien-he">Liên hệ</Link> hoặc email nêu trên.
            Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
          </p>
        </div>
      </main>
      <Footer />
    </AppShell>
  );
}
