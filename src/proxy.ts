// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/signup(.*)",
  "/sso-callback(.*)",
  "/pricing(.*)",
  "/blog(.*)",
  "/contact(.*)",
  "/api/humanize",
  "/api/checkout",
  // Admin auth routes are public (login page + API)
  "/admin/login(.*)",
  "/api/auth/admin-login(.*)",
  "/api/auth/admin-logout(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAdminAuthRoute = createRouteMatcher([
  "/admin/login(.*)",
  "/api/auth/admin-login(.*)",
  "/api/auth/admin-logout(.*)",
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  // Admin routes: use cookie-based session, not Clerk
  if (isAdminRoute(request)) {
    // Allow login page and auth API through
    if (isAdminAuthRoute(request)) return NextResponse.next();

    // Check for admin session cookie
    const adminSession = request.cookies.get("admin_session");
    if (!adminSession?.value) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  // All other non-public routes: protect with Clerk
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
