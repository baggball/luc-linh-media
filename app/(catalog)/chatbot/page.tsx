import CatalogPage from "@/components/catalog/CatalogPage";

export const revalidate = 0;
export const metadata = { title: "Chatbot GPT" };

export default function ChatbotCatalogPage() {
  return (
    <CatalogPage
      type="chatbot"
      heading={
        <>
          Chatbot GPT cho <em>người sáng tạo &amp; bán hàng</em>
        </>
      }
      description="Chatbot dựng sẵn theo ngành hàng — dán thẳng vào ChatGPT và dùng ngay, không cần chỉnh prompt."
      ctaLabel="Yêu cầu Custom Chatbot"
      ctaHref="/custom-chatbot"
    />
  );
}
