import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();

  if (hostname === "web-bice-six-68.vercel.app" || hostname === "www.luclinhvideoai.com") {
    const destination = request.nextUrl.clone();
    destination.protocol = "https:";
    destination.host = "luclinhvideoai.com";
    return NextResponse.redirect(destination, 308);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Chạy trên mọi route trừ file tĩnh/ảnh, để phiên đăng nhập luôn được làm mới.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
