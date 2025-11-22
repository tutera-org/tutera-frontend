import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";
  const baseDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

  // --- Ignore assets & API ---
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api/") ||
    url.pathname === "/favicon.ico" ||
    url.pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/i)
  ) {
    return NextResponse.next();
  }

  // --- Detect tenant from hostname ---
  let tenant: string | null = null;

  if (hostname.includes("localhost")) {
    const parts = hostname.split(".");
    if (parts.length >= 2 && parts[0] !== "localhost") {
      tenant = parts[0];
    }
  } else if (hostname.endsWith(`.${baseDomain}`)) {
    tenant = hostname.replace(`.${baseDomain}`, "");
  }

  // --- EXCLUDE "www" from being treated as a tenant ---
  if (tenant === "www") {
    tenant = null;
  }

  // --- Handle main-domain public routes (only if no tenant) ---
  if (!tenant) {
    const mainPublicRoutes = [
      "/",
      "/contact",
      "/Pricing",
      "/forgotPassword",
      "/resetPassword",
      "/resetSuccess",
      "/signIn",
      "/signUp",
      "/verifyOtp",
    ];

    if (
      mainPublicRoutes.some(
        (route) =>
          url.pathname === route || url.pathname.startsWith(route + "/")
      )
    ) {
      return NextResponse.next();
    }
  }

  // --- Tenant subdomain logic ---
  if (tenant) {
    // Prevent double rewrite
    if (url.pathname.startsWith(`/${tenant}`)) {
      return NextResponse.next();
    }

    // Check authentication
    const token = req.cookies.get("accessToken")?.value;
    const isAuthenticated = !!token;

    // Public routes that don't require authentication on tenant subdomains
    const tenantPublicRoutes = [
      "/signIn",
      "/signUp",
      "/forgotPassword",
      "/resetPassword",
      "/resetSuccess",
      "/verifyOtp",
    ];

    const isTenantPublic = tenantPublicRoutes.some((route) =>
      url.pathname.startsWith(route)
    );

    // Redirect to signIn if not authenticated and not on public route
    if (!isAuthenticated && !isTenantPublic) {
      console.log(`🔒 [MIDDLEWARE] Unauthenticated access to ${url.pathname}`);
      console.log(`   Redirecting to /signIn on tenant: ${tenant}`);

      const redirectUrl = url.clone();
      redirectUrl.pathname = "/signIn";
      redirectUrl.searchParams.set("redirect", url.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If authenticated, log it for debugging
    if (isAuthenticated) {
      console.log(
        `✅ [MIDDLEWARE] Authenticated access to ${url.pathname} for tenant: ${tenant}`
      );
    }

    // Rewrite to tenant dynamic route
    url.pathname = `/${tenant}${url.pathname}`;
    const res = NextResponse.rewrite(url);
    res.headers.set("x-tenant-slug", tenant);
    return res;
  }

  // --- Default fallthrough ---
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
