"use client";

import { track } from "@vercel/analytics";

export type BusinessEvent =
  | "view_product"
  | "add_to_cart"
  | "begin_checkout"
  | "purchase_completed"
  | "sign_up";

type EventProperties = Record<string, string | number | boolean | null | undefined>;

export function trackBusinessEvent(eventName: BusinessEvent, properties: EventProperties = {}) {
  track(eventName, properties);

  const productSlug = typeof properties.product === "string"
    ? properties.product
    : typeof properties.product_slug === "string"
      ? properties.product_slug
      : undefined;
  const value = typeof properties.value === "number" ? properties.value : undefined;

  void fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      path: window.location.pathname,
      productSlug,
      value,
      metadata: properties,
    }),
    keepalive: true,
  }).catch(() => {
    // Tracking không được phép làm gián đoạn hành động mua hàng.
  });
}
