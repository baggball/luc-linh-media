import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import VisitorTracker from "@/components/analytics/VisitorTracker";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lục Linh Video AI — Chatbot & Workflow tạo video bán hàng",
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: "/manifest.webmanifest",
  keywords: [
    "chatbot tạo video AI",
    "KOC AI",
    "video affiliate",
    "prompt video AI",
    "prompt Veo 3",
    "workflow video AI",
    "kịch bản video bán hàng",
    "prompt bán hàng TikTok",
    "chatbot affiliate",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/icon.png", sizes: "512x512" }],
  },
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Lục Linh Video AI — Chatbot & Workflow tạo video bán hàng",
    description: SITE_DESCRIPTION,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lục Linh Video AI — Chatbot & Workflow tạo video bán hàng",
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://xyezaxkktghzthzbhiwd.supabase.co" />
        <link rel="dns-prefetch" href="https://xyezaxkktghzthzbhiwd.supabase.co" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/icon.png`,
              email: "luclinhstudio@gmail.com",
              sameAs: ["https://luclinhmedia.com/", "https://luclinhonlineshop.io.vn/"],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+84-379-062-594",
                contactType: "customer support",
                availableLanguage: "Vietnamese",
              },
            }).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              inLanguage: "vi-VN",
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/tim-kiem?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <VisitorTracker />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
