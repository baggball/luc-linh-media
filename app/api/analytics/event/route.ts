import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const VISITOR_COOKIE = "llva_vid";
const SESSION_COOKIE = "llva_sid";
const COOKIE_YEAR = 60 * 60 * 24 * 365;
const SESSION_30_MINUTES = 60 * 30;
const ALLOWED_EVENTS = new Set([
  "page_view",
  "view_product",
  "add_to_cart",
  "begin_checkout",
  "purchase_completed",
  "sign_up",
]);

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanPath(value: unknown) {
  const path = cleanText(value, 300);
  return path.startsWith("/") ? path : "/";
}

function safeUuid(value: string | undefined) {
  return value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value
    : crypto.randomUUID();
}

function referrerDomain(value: unknown) {
  const referrer = cleanText(value, 500);
  if (!referrer) return "";
  try {
    const hostname = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
    return hostname === "luclinhvideoai.com" ? "" : hostname.slice(0, 160);
  } catch {
    return "";
  }
}

function trafficSource(utmSource: string, referrer: string) {
  if (utmSource) return utmSource.toLowerCase().slice(0, 80);
  if (!referrer) return "direct";
  if (referrer.includes("google.")) return "google";
  if (referrer.includes("facebook.") || referrer === "fb.com" || referrer === "l.facebook.com") return "facebook";
  if (referrer.includes("tiktok.")) return "tiktok";
  if (referrer.includes("zalo.")) return "zalo";
  if (referrer.includes("youtube.") || referrer === "youtu.be") return "youtube";
  return referrer;
}

function deviceType(userAgent: string) {
  if (/ipad|tablet|playbook|silk/i.test(userAgent)) return "tablet";
  if (/mobile|iphone|ipod|android/i.test(userAgent)) return "mobile";
  if (!userAgent) return "other";
  return "desktop";
}

function safeMetadata(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const entries = Object.entries(value as Record<string, unknown>)
    .slice(0, 20)
    .flatMap(([key, item]) => {
      const safeKey = cleanText(key, 50);
      if (!safeKey || !["string", "number", "boolean"].includes(typeof item)) return [];
      return [[safeKey, typeof item === "string" ? item.slice(0, 300) : item]];
    });
  return Object.fromEntries(entries);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const originHost = new URL(origin).hostname;
      if (originHost !== request.nextUrl.hostname) return NextResponse.json({ ok: false }, { status: 403 });
    } catch {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  if (/bot|crawler|spider|preview|lighthouse|pagespeed/i.test(userAgent)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const eventName = cleanText(body.eventName, 40);
  if (!ALLOWED_EVENTS.has(eventName)) return NextResponse.json({ ok: false }, { status: 400 });

  const visitorId = safeUuid(request.cookies.get(VISITOR_COOKIE)?.value);
  const sessionId = safeUuid(request.cookies.get(SESSION_COOKIE)?.value);
  const referrer = referrerDomain(body.referrer);
  const utmSource = cleanText(body.utmSource, 80);
  const path = cleanPath(body.path);
  const value = typeof body.value === "number" && Number.isFinite(body.value)
    ? Math.max(0, Math.round(body.value))
    : null;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();
  const { error } = await admin.rpc("record_analytics_event", {
    p_session_id: sessionId,
    p_visitor_id: visitorId,
    p_user_id: user?.id ?? null,
    p_event_name: eventName,
    p_path: path,
    p_referrer_domain: referrer || null,
    p_source: trafficSource(utmSource, referrer),
    p_medium: cleanText(body.utmMedium, 80) || null,
    p_campaign: cleanText(body.utmCampaign, 120) || null,
    p_device_type: deviceType(userAgent),
    p_product_slug: cleanText(body.productSlug, 180) || null,
    p_value: value,
    p_metadata: safeMetadata(body.metadata),
  });

  if (error) {
    console.error("analytics_event_error", error.message);
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(VISITOR_COOKIE, visitorId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_YEAR,
  });
  response.cookies.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_30_MINUTES,
  });
  return response;
}
