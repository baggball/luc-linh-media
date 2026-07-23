import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Lục Linh AI",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#060911",
    theme_color: "#060911",
    lang: "vi",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
