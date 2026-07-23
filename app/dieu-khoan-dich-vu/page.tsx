import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";

export const metadata = { title: "Điều khoản dịch vụ" };

export default function DieuKhoanDichVuPage() {
  return (
    <AppShell>
      <div className="content-wrap doc-wrap">
        <div className="doc-head">
          <h1>Điều khoản dịch vụ</h1>
          <span className="updated">Cập nhật lần cuối: 01/07/2026</span>
        </div>

        <div className="doc">
          <h2>1. Phạm vi dịch vụ</h2>
          <p>
            Lục Linh Video AI cung cấp kho prompt, chatbot GPT, workflow tự động hoá và các dịch vụ tuỳ chỉnh (Custom
            Chatbot, Yêu cầu Video AI) phục vụ mục đích sáng tạo nội dung và bán hàng. Bằng việc truy cập hoặc sử
            dụng website, bạn đồng ý tuân thủ các điều khoản dưới đây.
          </p>

          <h2>2. Tài khoản người dùng</h2>
          <ul>
            <li>Bạn cần cung cấp thông tin chính xác khi đăng ký tài khoản và chịu trách nhiệm bảo mật thông tin đăng nhập của mình.</li>
            <li>Mỗi tài khoản chỉ dùng cho một cá nhân hoặc tổ chức; không chia sẻ tài khoản cho bên thứ ba dưới mọi hình thức.</li>
            <li>Chúng tôi có quyền tạm khoá hoặc chấm dứt tài khoản vi phạm điều khoản sử dụng mà không cần báo trước.</li>
          </ul>

          <h2>3. Quyền sử dụng nội dung &amp; prompt</h2>
          <p>Khi mua prompt, chatbot hoặc workflow, bạn được cấp quyền sử dụng cho mục đích cá nhân hoặc kinh doanh của riêng bạn. Cụ thể:</p>
          <ul>
            <li>Được phép: sử dụng, chỉnh sửa nội dung đầu ra để phục vụ công việc/kinh doanh của bạn.</li>
            <li>Không được phép: bán lại, phân phối lại hoặc chia sẻ công khai nguyên văn prompt/chatbot dưới tên khác.</li>
            <li>Nội dung do AI tạo ra dựa trên prompt của chúng tôi thuộc quyền sử dụng của bạn, Lục Linh Video AI không giữ bản quyền đối với kết quả đầu ra.</li>
          </ul>

          <h2>4. Thanh toán &amp; gói dịch vụ</h2>
          <p>
            Giá sản phẩm được niêm yết công khai tại trang Bảng giá và có thể thay đổi theo thời gian. Các gói theo
            tháng/năm tự động hết hạn vào cuối chu kỳ nếu không gia hạn; sản phẩm mua lẻ được sở hữu vĩnh viễn theo
            Mục 3. Chi tiết hoàn tiền xem tại trang Chính sách hoàn tiền.
          </p>

          <h2>5. Giới hạn trách nhiệm</h2>
          <p>
            Lục Linh Video AI nỗ lực đảm bảo chất lượng prompt và chatbot, nhưng không cam kết kết quả đầu ra từ công cụ
            AI của bên thứ ba (ChatGPT, Midjourney, Veo3...) là chính xác tuyệt đối trong mọi trường hợp. Chúng tôi
            không chịu trách nhiệm cho thiệt hại gián tiếp phát sinh từ việc sử dụng nội dung do AI tạo ra.
          </p>

          <div className="note-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4M12 17h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
            <span>Bạn nên kiểm duyệt nội dung do AI tạo ra trước khi sử dụng công khai (quảng cáo, đăng tải...) để đảm bảo phù hợp với thương hiệu và tuân thủ quy định pháp luật hiện hành.</span>
          </div>

          <h2>6. Thay đổi điều khoản</h2>
          <p>
            Chúng tôi có thể cập nhật điều khoản dịch vụ theo thời gian. Phiên bản mới nhất luôn được đăng tại trang
            này kèm ngày cập nhật. Việc tiếp tục sử dụng dịch vụ sau khi điều khoản thay đổi đồng nghĩa bạn chấp nhận
            các điều khoản mới.
          </p>

          <h2>7. Liên hệ</h2>
          <p>
            Mọi thắc mắc về điều khoản dịch vụ, vui lòng liên hệ qua email <b>luclinhstudio@gmail.com</b> hoặc trang{" "}
            <Link href="/lien-he">Liên hệ</Link>.
          </p>

          <div className="cta-band" style={{ marginTop: 36, textAlign: "center", padding: 26 }}>
            <h3 style={{ fontSize: 17, marginBottom: 6 }}>Có thắc mắc về điều khoản?</h3>
            <p style={{ marginBottom: 16 }}>Đội ngũ pháp lý &amp; hỗ trợ sẵn sàng giải đáp cho bạn.</p>
            <Link className="btn btn-primary" href="/lien-he">
              Liên hệ hỗ trợ →
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </AppShell>
  );
}
