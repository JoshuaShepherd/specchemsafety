import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes without authentication
  const publicPaths = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/api/public",
    "/api/auth",
  ];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  try {
    const supabase = await createClient();

    // Refresh session if expired - required for Server Components
    // and Server Actions to be able to read cookies
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      // Redirect unauthenticated users to the login page
      const redirectTo = request.nextUrl.pathname;
      const loginUrl = new URL("/auth/login", request.url);
      if (redirectTo !== "/") {
        loginUrl.searchParams.set("redirectTo", redirectTo);
      }
      return NextResponse.redirect(loginUrl);
    }

    // User is authenticated, allow the request
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // If an error occurs, redirect to login for safety
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (static assets)
     * - api/public (public API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/|.*\\..*|api/public).*)",
  ],
};
