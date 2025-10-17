import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Refresh session if expired - required for Server Components
    // and Server Actions to be able to read cookies
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && !request.nextUrl.pathname.startsWith("/auth/login")) {
      // Redirect unauthenticated users to the login page
      const redirectTo = request.nextUrl.pathname;
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirectTo", redirectTo);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (e) {
    // If an error occurs, try to refresh the session
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
