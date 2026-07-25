"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef("");

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    const currentPath = `${pathname}${window.location.search}`;
    if (lastTrackedPath.current === currentPath) return;
    lastTrackedPath.current = currentPath;

    const params = new URLSearchParams(window.location.search);
    void fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "page_view",
        path: pathname,
        referrer: document.referrer,
        utmSource: params.get("utm_source"),
        utmMedium: params.get("utm_medium"),
        utmCampaign: params.get("utm_campaign"),
      }),
      keepalive: true,
    }).catch(() => {
      // Không ảnh hưởng trải nghiệm nếu dịch vụ thống kê tạm thời gián đoạn.
    });
  }, [pathname]);

  return null;
}
