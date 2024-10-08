import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@/lib/pocketbase";

// For protected pages
// If auth is not valid for matching routes
// Redirect to a redirect path
export function middleware(request: NextRequest) {
  const redirect_path = "/signin";
  const cookieStore = cookies();

  const { authStore } = createServerClient(cookieStore);

  if (!authStore.isValid) {
    return NextResponse.redirect(redirect_path); // Redirect ohne Host-Angabe
  } else {
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login route)
     * - / (root path)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|signin|signup|$).*)",
  ],
};
