import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import { ZALO_COMMUNITY_URL } from "@/lib/community";

export const metadata = {
  title: "Dùng thử miễn phí prompt tạo video AI",
  description:
    "Nhận bộ prompt miễn phí để thử quy trình tạo ảnh KOC, kịch bản review và prompt video AI trước khi mua chatbot chuyên ngành.",
  alternates: { canonical: "/dung-thu-mien-phi" },
};

const freePrompts = [
  {
    title: "Prompt tạo ảnh KOC cầm sản phẩm",
    tag: "Ảnh tham chiếu",
    text:
      "Tạo ảnh một KOC Việt Nam đang cầm sản phẩm [MÔ TẢ SẢN PHẨM], bối cảnh sáng sạch, ánh sáng thương mại, gương mặt tự nhiên, sản phẩm rõ nhãn, bố cục dọc 9:16, phong cách phù hợp TikTok Shop.",
  },
  {
    title: "Prompt kịch bản review 20 giây",
    tag: "Kịch bản",
    text:
      "Viết kịch bản video review 20 giây cho sản phẩm [TÊN SẢN PHẨM]. Cấu trúc gồm hook 3 giây đầu, vấn đề của khách, cách sản phẩm giải quyết, cảm nhận thật, CTA mua hàng. Giọng nói tự nhiên, không nói quá công dụng.",
  },
  {
    title: "Prompt video demo sản phẩm",
    tag: "Veo/Flow",
    text:
      "Tạo prompt video dọc 9:16, một KOC đang demo sản phẩm [TÊN SẢN PHẨM] trong bối cảnh [BỐI CẢNH]. Một hành động chính, camera mượt, giữ đúng hình dáng và logo sản phẩm, ánh sáng đẹp, kết thúc bằng khoảnh khắc chốt đơn tự nhiên.",
  },
];

const funnels = [
  {
    title: "Mỹ phẩm",
    href: "/chatbot/koc-my-pham-ai-review-dep-chot-don",
    body: "Tạo review skincare, makeup, body care với hook, ảnh KOC và 5 prompt video.",
  },
  {
    title: "Gia dụng",
    href: "/chatbot/koc-gia-dung-ai-anh-thanh-video-chot-don",
    body: "Biến sản phẩm tiện ích thành video vấn đề - giải pháp dễ hiểu, dễ chốt đơn.",
  },
  {
    title: "Thời trang",
    href: "/chatbot/koc-pho-ai-thu-do-video-affiliate",
    body: "Tạo outfit check, thử đồ AI và video street style cho TikTok/Reels.",
  },
];

export default function DungThuMienPhiPage() {
  return (
    <AppShell>
      <div className="content-wrap">
        <section className="trial-hero">
          <div className="eyebrow">Dùng thử miễn phí</div>
          <h1>Thử quy trình tạo video AI trước khi mua chatbot</h1>
          <p>
            Copy 3 prompt mẫu bên dưới để tạo ảnh KOC, kịch bản review và prompt video. Khi muốn làm nhanh hơn theo từng ngành,
            dùng chatbot chuyên ngành để nó dẫn bạn từng bước.
          </p>
          <div className="trial-hero-actions">
            <a className="btn btn-primary" href="#free-prompts">Lấy prompt miễn phí</a>
            <a className="btn btn-ghost" href={ZALO_COMMUNITY_URL} target="_blank" rel="noopener">
              Vào cộng đồng Zalo
            </a>
          </div>
        </section>

        <section id="free-prompts" className="section trial-section">
          <div className="sec-head">
            <div>
              <h2>3 prompt miễn phí để test ngay</h2>
              <div className="sub">Dùng được cho Gemini, ChatGPT hoặc công cụ AI bạn đang quen.</div>
            </div>
          </div>
          <div className="trial-prompt-grid">
            {freePrompts.map((prompt) => (
              <article className="trial-prompt-card" key={prompt.title}>
                <span>{prompt.tag}</span>
                <h3>{prompt.title}</h3>
                <p>{prompt.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section trial-section">
          <div className="trial-convert-band">
            <div>
              <span className="trial-kicker">Muốn nhanh hơn?</span>
              <h2>Chatbot chuyên ngành sẽ hỏi đúng dữ liệu và xuất trọn bộ 5 prompt video</h2>
              <p>
                Prompt miễn phí giúp bạn thử ý tưởng. Chatbot trả phí giúp bạn lặp lại quy trình ổn định cho từng sản phẩm,
                từng ngách và từng chiến dịch affiliate.
              </p>
            </div>
            <Link className="btn btn-primary" href="/chatbot">Xem chatbot đang bán</Link>
          </div>
        </section>

        <section className="section trial-section">
          <a className="community-box community-box-wide" href={ZALO_COMMUNITY_URL} target="_blank" rel="noopener">
            <b>Vào cộng đồng Zalo Lục Linh</b>
            <span>Nơi gom khách hàng, cập nhật chatbot/prompt mới, chia sẻ output và hỏi đáp cách làm video AI bán hàng.</span>
          </a>
        </section>

        <section className="section trial-section">
          <div className="sec-head">
            <div>
              <h2>Bắt đầu với 3 sản phẩm dễ bán nhất</h2>
              <div className="sub">Đây là 3 ngách nên dùng để test doanh thu đầu tiên.</div>
            </div>
          </div>
          <div className="trial-funnel-grid">
            {funnels.map((item) => (
              <Link className="trial-funnel-card" href={item.href} key={item.title}>
                <span>{item.title}</span>
                <h3>{item.body}</h3>
                <b>Xem sản phẩm →</b>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </AppShell>
  );
}
