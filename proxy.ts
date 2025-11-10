import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";
  const baseDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000";

  // --- Ignore assets & API ---
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api/") ||
    url.pathname === "/favicon.ico"
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
    const token = req.cookies.get("auth_token")?.value;
    const isAuthenticated = !!token;

    // TODO: Remove "/dashboard" when backend API is connected
    const tenantPublicRoutes = ["/signIn", "/signUp", "/dashboard"];
    const isTenantPublic = tenantPublicRoutes.some((route) =>
      url.pathname.startsWith(route)
    );

    // Redirect to signIn if not authenticated and not on public route
    if (!isAuthenticated && !isTenantPublic) {
      const redirectUrl = url.clone();
      redirectUrl.pathname = "/signIn";
      redirectUrl.searchParams.set("redirect", url.pathname);
      return NextResponse.redirect(redirectUrl);
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
