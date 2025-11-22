import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

export async function getApiWithCookies() {
  console.log("🔧 [SERVER INSTANCE] Creating axios instance with cookies...");

  // Get all cookies from the incoming request
  const cookieStore = await cookies();

  // Combine all cookies into a single Cookie header string
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  if (process.env.NODE_ENV === "development") {
    console.log("🍪 [COOKIES] Found cookies:", cookieHeader || "(none)");
  }

  // Create a new axios instance configured to call the backend server
  const serverApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
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
      return config;
    },
    (error: AxiosError) => {
      console.error("❌ [SERVER REQUEST ERROR]", error);
      return Promise.reject(error);
    }
  );

  serverApi.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
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
