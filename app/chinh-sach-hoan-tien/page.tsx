import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";

export const metadata = { title: "Chính sách hoàn tiền" };

export default function ChinhSachHoanTienPage() {
  return (
    <AppShell>
      <div className="content-wrap doc-wrap">
        <div className="doc-head">
          <h1>Chính sách hoàn tiền</h1>
          <span className="updated">Cập nhật lần cuối: 01/07/2026</span>
        </div>

        <div className="doc">
          <h2>1. Điều kiện áp dụng</h2>
          <p>Lục Linh Media hỗ trợ hoàn tiền cho các gói đăng ký (Khởi đầu, Sáng tạo, Studio) và sản phẩm mua lẻ nếu:</p>
          <ul>
            <li>Yêu cầu hoàn tiền được gửi trong thời hạn quy định kể từ ngày thanh toán thành công.</li>
            <li>Sản phẩm/chatbot chưa được sử dụng vượt quá 20% giới hạn sử dụng của gói (ví dụ: số lượt tải chatbot, số workflow đã chạy).</li>
            <li>Lý do hoàn tiền hợp lệ: sản phẩm lỗi kỹ thuật không thể khắc phục, không đúng như mô tả, hoặc mua nhầm gói.</li>
          </ul>

          <h2>2. Thời hạn hoàn tiền theo từng gói</h2>
          <table className="plan-table">
            <tbody>
              <tr>
                <th>Gói / Hình thức</th>
                <th>Thời hạn hoàn tiền</th>
                <th>Ghi chú</th>
              </tr>
              <tr>
                <td>
                  <b>Khởi đầu</b>
                </td>
                <td>7 ngày</td>
                <td>Kể từ ngày kích hoạt gói</td>
              </tr>
              <tr>
                <td>
                  <b>Sáng tạo</b>
                </td>
                <td>7 ngày</td>
                <td>Kể từ ngày kích hoạt gói</td>
              </tr>
              <tr>
                <td>
                  <b>Studio</b>
                </td>
                <td>2 ngày</td>
                <td>Kể từ ngày kích hoạt gói</td>
              </tr>
              <tr>
                <td>
                  <b>Mua lẻ Chatbot Prompt</b>
                </td>
                <td>3 ngày</td>
                <td>Nếu chatbot lỗi kỹ thuật không dùng được</td>
              </tr>
            </tbody>
          </table>

          <h2>3. Quy trình yêu cầu hoàn tiền</h2>
          <ol>
            <li>
              Gửi yêu cầu qua trang <Link href="/lien-he">Liên hệ</Link> hoặc Zalo hotline, kèm mã đơn hàng và lý do hoàn tiền.
            </li>
            <li>Đội ngũ hỗ trợ xác nhận và phản hồi trong vòng 24 giờ làm việc.</li>
            <li>Nếu yêu cầu hợp lệ, tiền được hoàn về phương thức thanh toán gốc trong 3–7 ngày làm việc.</li>
          </ol>

          <div className="note-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4M12 17h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
            <span>Bảo hành tài khoản AI đi kèm (15 ngày) là chính sách riêng, độc lập với chính sách hoàn tiền và không tính vào thời hạn hoàn tiền của gói.</span>
          </div>

          <h2>4. Trường hợp không áp dụng hoàn tiền</h2>
          <ul>
            <li>Đã sử dụng vượt quá 20% giới hạn của gói (số lượt tải chatbot, số workflow đã chạy...).</li>
            <li>Yêu cầu hoàn tiền gửi sau thời hạn quy định ở Mục 2.</li>
            <li>Lý do hoàn tiền không liên quan đến lỗi sản phẩm (ví dụ: đổi ý sau khi đã dùng thử đầy đủ).</li>
            <li>Sản phẩm được mua trong chương trình khuyến mãi có ghi chú &quot;không hoàn tiền&quot; tại thời điểm mua.</li>
          </ul>

          <h2>5. Liên hệ</h2>
          <p>
            Mọi thắc mắc về chính sách hoàn tiền, vui lòng liên hệ qua email <b>luclinhstudio@gmail.com</b> hoặc trang{" "}
            <Link href="/lien-he">Liên hệ</Link>.
          </p>

          <div className="cta-band" style={{ marginTop: 36, textAlign: "center", padding: 26 }}>
            <h3 style={{ fontSize: 17, marginBottom: 6 }}>Cần hỗ trợ hoàn tiền?</h3>
            <p style={{ marginBottom: 16 }}>Gửi yêu cầu ngay, đội ngũ phản hồi trong vòng 24 giờ.</p>
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
