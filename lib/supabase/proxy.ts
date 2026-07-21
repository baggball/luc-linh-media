import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session on every request that matches proxy.ts's
 * config.matcher, and writes the refreshed cookies onto the response.
 * This is the Next.js 16 "Proxy" equivalent of the classic Supabase
 * middleware.ts session-refresh pattern (middleware.ts was renamed to proxy.ts
 * in Next.js 16 — same execution model, new file/function name).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Touches the session so an expired access token gets refreshed and the
  // new cookies are attached to the response above.
  await supabase.auth.getUser();

  return response;
}
