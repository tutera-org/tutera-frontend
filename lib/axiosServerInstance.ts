import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

/**
 * Create a server-side axios instance with cookies
 * This function is used in Next.js API routes to make requests to the backend
 * It forwards cookies from the client request to the backend server
 *
 * IMPORTANT: This must only be called from:
 * - Server Components
 * - Server Actions
 * - Route Handlers (API routes)
 */
export async function getApiWithCookies() {
  console.log("🔧 [SERVER INSTANCE] Creating axios instance with cookies...");

  // Get all cookies from the incoming request
  const cookieStore = await cookies();

  // Combine all cookies into a single Cookie header string
  // This allows the backend to identify the user's session
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  if (process.env.NODE_ENV === "development") {
    console.log("🍪 [COOKIES] Found cookies:", cookieHeader || "(none)");
  }

  // Create a new axios instance configured to call the backend server
  const serverApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL, // Points to: https://tutera-backend.onrender.com
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader, // Forward cookies to backend for authentication
    },
  });

  console.log(
    `🔗 [SERVER INSTANCE] Base URL: ${process.env.NEXT_PUBLIC_BACKEND_API_URL}`
  );

  // Request interceptor - logs outgoing requests to backend
  serverApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Enhanced logging for server-side requests to backend
      if (process.env.NODE_ENV === "development") {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`🚀 [SERVER→BACKEND REQUEST] ${new Date().toISOString()}`);
        console.log(`   Method: ${config.method?.toUpperCase()}`);
        console.log(`   Full URL: ${config.baseURL}${config.url}`);
        console.log(`   Headers:`, JSON.stringify(config.headers, null, 2));
        if (config.data) {
          console.log(`   Body:`, JSON.stringify(config.data, null, 2));
        }
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      }
      return config;
    },
    (error: AxiosError) => {
      console.error("❌ [SERVER REQUEST ERROR]", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - logs responses from backend
  serverApi.interceptors.response.use(
    (response) => {
      // Enhanced logging for server-side responses from backend
      if (process.env.NODE_ENV === "development") {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`✅ [BACKEND→SERVER RESPONSE] ${new Date().toISOString()}`);
        console.log(`   Status: ${response.status} ${response.statusText}`);
        console.log(`   URL: ${response.config.url}`);
        console.log(`   Data:`, JSON.stringify(response.data, null, 2));
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      }
      return response;
    },
    (error: AxiosError) => {
      // Enhanced error logging for server-side requests
      if (process.env.NODE_ENV === "development") {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.error(`❌ [BACKEND ERROR] ${new Date().toISOString()}`);
        console.error(`   Status: ${error.response?.status}`);
        console.error(`   URL: ${error.config?.url}`);
        console.error(`   Error Message:`, error.message);
        console.error(
          `   Response Data:`,
          JSON.stringify(error.response?.data, null, 2)
        );
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      }

      // Handle 401 Unauthorized - User not authenticated or token expired
      if (error.response?.status === 401) {
        console.error("🔒 [UNAUTHORIZED] User not authenticated");
        throw new Error("UNAUTHORIZED");
      }

      // Handle 403 Forbidden - User authenticated but doesn't have permission
      if (error.response?.status === 403) {
        console.error("🚫 [FORBIDDEN] User doesn't have permission");
        throw new Error("FORBIDDEN");
      }

      // Handle 404 Not Found - Requested resource doesn't exist on backend
      if (error.response?.status === 404) {
        console.error("🔍 [NOT FOUND] Resource not found on backend");
        throw new Error("NOT_FOUND");
      }

      // Handle 500 Internal Server Error - Backend server error
      if (error.response?.status === 500) {
        console.error("💥 [INTERNAL SERVER ERROR] Backend server error");
        throw new Error("INTERNAL_SERVER_ERROR");
      }

      return Promise.reject(error);
    }
  );

  return serverApi;
}

/**
 * Helper function to extract and format error messages from API errors
 * Used in API routes to send user-friendly error messages to the client
 */
export function handleServerApiError(error: unknown): string {
  console.error("🔧 [ERROR HANDLER] Processing error:", error);

  if (axios.isAxiosError(error)) {
    // Server responded with an error status (4xx, 5xx)
    if (error.response) {
      // Extract error message from backend response, fallback to status text
      const message = error.response.data?.message || error.response.statusText;
      console.error(`📝 [ERROR MESSAGE] Extracted: "${message}"`);
      return `${message}`;
    }
    // Request was made but no response received (network error, timeout, etc.)
    if (error.request) {
      console.error("🌐 [NETWORK ERROR] No response from backend");
      return "Unable to reach the server. Please check your internet connection.";
    }
  }
  // Something else happened while setting up the request
  console.error("⚠️ [UNEXPECTED ERROR] Unknown error type");
  return "An unexpected error occurred. Please try again.";
}
