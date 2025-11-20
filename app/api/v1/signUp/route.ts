import {
  getApiWithCookies,
  handleServerApiError,
} from "@/lib/axiosServerInstance";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/v1/signUp
 *
 * This Next.js API route handles institution registration requests from the frontend.
 * It acts as a proxy between the client and the backend server.
 *
 * Flow:
 * 1. Frontend calls: POST /api/v1/signUp
 * 2. This route forwards to backend: POST /v1/auth/register/institution
 * 3. Backend returns tokens and user/tenant data
 * 4. Tokens are stored in HTTP-only cookies with domain-level access
 * 5. Response (without tokens) is sent back to frontend
 *
 * Benefits of this approach:
 * - Cookies are properly forwarded from client to backend
 * - Backend URL is hidden from client
 * - Tokens stored securely in HTTP-only cookies
 * - Domain-level cookies allow access across subdomains (tenant.domain.com)
 * - Centralized error handling
 */
export async function POST(request: NextRequest) {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(
    `🎯 [NEXT.JS API ROUTE] /api/v1/signUp - ${new Date().toISOString()}`
  );
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  try {
    console.log("📥 [STEP 1] Parsing request body...");

    // Parse the JSON body from the frontend request
    const body = await request.json();
    console.log("📦 [REQUEST BODY]", JSON.stringify(body, null, 2));

    console.log("🔧 [STEP 2] Getting axios instance with cookies...");

    // Get axios instance with cookies from the incoming request
    const api = await getApiWithCookies();

    console.log("🚀 [STEP 3] Forwarding request to backend...");
    console.log(
      `   Target: ${process.env.NEXT_PUBLIC_BACKEND_API_URL}/v1/auth/register/institution`
    );

    // Forward the request to the backend server
    const response = await api.post("/v1/auth/register/institution", body);

    console.log("✅ [STEP 4] Received successful response from backend");
    console.log(`   Status: ${response.status}`);
    console.log(`   Data:`, JSON.stringify(response.data, null, 2));

    // Extract tokens and tenant info from backend response
    const { accessToken, refreshToken } = response.data.data.tokens;
    const { tenant } = response.data.data;

    console.log("🍪 [STEP 5] Setting authentication cookies...");
    console.log(`   Tenant: ${tenant.name}`);

    // Create response data (excluding tokens for security)
    // Tokens should never be sent in the response body
    const responseData = {
      ...response.data,
      data: {
        ...response.data.data,
        tokens: undefined, // Remove tokens from response body
      },
    };

    // Create NextResponse to set cookies
    const nextResponse = NextResponse.json(responseData, {
      status: response.status,
    });

    // Get cookie domain from environment variable
    // This allows cookies to work across subdomains (e.g., tenant.domain.com)
    const cookieDomain = process.env.COOKIE_DOMAIN;
    console.log(`   Cookie Domain: ${cookieDomain}`);

    // Set accessToken cookie with domain-level access
    nextResponse.cookies.set("accessToken", accessToken, {
      httpOnly: true, // Prevents JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "lax", // CSRF protection
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: "/", // Available for all routes
      domain: cookieDomain, // KEY: Allows access across subdomains
    });

    // Set refreshToken cookie with domain-level access
    nextResponse.cookies.set("refreshToken", refreshToken, {
      httpOnly: true, // Prevents JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "lax", // CSRF protection
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: "/", // Available for all routes
      domain: cookieDomain, // KEY: Allows access across subdomains
    });

    // Optional: Store tenant name in a cookie for easy access
    // This helps with subdomain routing and can be accessed by JavaScript
    nextResponse.cookies.set("tenantName", tenant.name, {
      httpOnly: false, // Allow JavaScript access for routing purposes
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
      path: "/",
      domain: cookieDomain, // KEY: Allows access across subdomains
    });

    console.log("✅ [COOKIES SET] Tokens stored with domain-level access");
    console.log("   - accessToken: Set (httpOnly, 7 days, domain-level)");
    console.log("   - refreshToken: Set (httpOnly, 7 days, domain-level)");
    console.log(
      `   - tenantName: ${tenant.name} (accessible by JS, 30 days, domain-level)`
    );

    console.log("📤 [STEP 6] Sending response to frontend");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Return response (tokens are in cookies, not in body)
    return nextResponse;
  } catch (error) {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ [ERROR CAUGHT] Processing error in API route");

    // Extract user-friendly error message from the error
    const errorMessage = handleServerApiError(error);

    // Determine appropriate HTTP status code
    const status = axios.isAxiosError(error)
      ? error.response?.status || 500 // Use backend status code if available
      : 500; // Default to 500 for unknown errors

    console.error(`   Status Code: ${status}`);
    console.error(`   Error Message: ${errorMessage}`);

    console.log("📤 [SENDING ERROR RESPONSE] Returning error to frontend");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Return error response to frontend
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
