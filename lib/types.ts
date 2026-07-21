export type ProductType = "chatbot" | "workflow" | "app" | "veo3";

export type Product = {
  id: string;
  type: ProductType;
  slug: string;
  title: string;
  description: string | null;
  is_free: boolean;
  price: number;
  workflow_link: string | null;
  warranty: string | null;
  rating: number | null;
  sold_count: number;
  images: string[];
  video_url: string | null;
  faq: { question: string; answer: string }[];
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export const PRODUCT_TYPE_ROUTE: Record<ProductType, string> = {
  chatbot: "chatbot",
  workflow: "workflow",
  app: "app-ai",
  veo3: "veo3-workflow",
};

export const PRODUCT_TYPE_LABEL: Record<ProductType, string> = {
  chatbot: "Chatbot AI",
  workflow: "Workflow",
  app: "App",
  veo3: "VEO3 Workflow",
};
