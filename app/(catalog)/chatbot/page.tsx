import CatalogPage from "@/components/catalog/CatalogPage";

export const revalidate = 0;
export const metadata = {
  title: "Chatbot tạo video AI cho KOC & Affiliate",
  description:
    "Kho chatbot GPT dựng sẵn giúp tạo ảnh KOC, kịch bản review, prompt video Veo 3 và nội dung bán hàng theo từng ngành.",
  alternates: { canonical: "/chatbot" },
};

export default function ChatbotCatalogPage() {
  return (
    <CatalogPage
      type="chatbot"
      heading={
        <>
          Chatbot GPT cho <em>người sáng tạo &amp; bán hàng</em>
        </>
      }
      description="Chatbot dựng sẵn theo ngành hàng — mở trong ChatGPT, làm theo hướng dẫn và tạo nội dung theo sản phẩm của bạn."
      ctaLabel="Yêu cầu Custom Chatbot"
      ctaHref="/custom-chatbot"
    />
  );
}
