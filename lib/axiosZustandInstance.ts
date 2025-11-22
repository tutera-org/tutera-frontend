// For client-side API calls that DON'T need to go through Next.js API routes

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

export const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL, // https://tutera-backend.onrender.com/api
  withCredentials: true, // Important: Send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - logs outgoing requests
backendApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🚀 [BACKEND API] ${config.method?.toUpperCase()} ${config.baseURL}${
          config.url
        }`
      );
    }
    return config;
  },
  (error: AxiosError) => {
    if (process.env.NODE_ENV === "development") {
      console.error("[BACKEND API ERROR]", error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor - handles errors and token refresh
backendApi.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ [BACKEND API] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (process.env.NODE_ENV === "development") {
      console.error(
        `❌ [BACKEND API ERROR] ${error.response?.status} ${originalRequest?.url}`,
        error.response?.data
      );
    }

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("🔄 [TOKEN REFRESH] Attempting to refresh token...");

        // Call backend refresh endpoint directly
        await backendApi.post(
          "/v1/auth/refresh",
          {},
          { withCredentials: true }
        );

        console.log("✅ [TOKEN REFRESH] Token refreshed successfully");

        // Retry original request
        return backendApi(originalRequest);
      } catch (refreshError) {
        console.error("❌ [TOKEN REFRESH FAILED]", refreshError);

        // Redirect to sign in
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          if (currentPath !== "/signIn") {
            sessionStorage.setItem("redirectAfterLogin", currentPath);
          }
          window.location.href = "/signIn";
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("🚫 [FORBIDDEN] Access denied");
      if (typeof window !== "undefined") {
        toast.error("You don't have permission to access this resource");
      }
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error("🔍 [NOT FOUND] Resource not found");
      toast.error("The requested resource was not found");
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error("💥 [SERVER ERROR] Internal server error");
      toast.error("Something went wrong. Please try again later.");
    }

    // Handle network errors
    if (!error.response) {
      console.error("🌐 [NETWORK ERROR] No response from server");
      toast.error("Network error. Please check your internet connection.");
    }

    return Promise.reject(error);
  }
);

// Helper function to extract error messages
export function handleBackendApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const message = error.response.data?.message || error.response.statusText;
      return `${message}`;
    }
    if (error.request) {
      return "Unable to reach the server. Please check your internet connection.";
    }
  }
  return "An unexpected error occurred. Please try again.";
}
