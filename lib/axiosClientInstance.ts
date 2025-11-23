// For client-side API calls that need to go through Next.js API routes

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - runs before every request is sent
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    // Handle request errors (e.g., network issues before request is sent)
    if (process.env.NODE_ENV === "development") {
      console.error("❌ [CLIENT REQUEST ERROR]", error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor - runs after every response is received
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // Handle error responses (non-2xx status codes)
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Mark this request as retried to prevent infinite loops
      originalRequest._retry = true;

      try {
        console.log("🔄 [TOKEN REFRESH] Attempting to refresh token...");

        //TODO: create the route below for refreshToken
        await api.post("/auth/refresh", {}, { withCredentials: true });

        console.log("✅ [TOKEN REFRESH] Token refreshed successfully");

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // Token refresh failed - user needs to login again
        console.error("❌ [TOKEN REFRESH FAILED]", refreshError);

        // Redirect to signIn page
        if (typeof window !== "undefined") {
          // Store the current URL to redirect back after login
          const currentPath = window.location.pathname;
          if (currentPath !== "/signIn") {
            sessionStorage.setItem("redirectAfterLogin", currentPath);
          }
          window.location.href = "/signIn";
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden - User doesn't have permission to access this resource
    if (error.response?.status === 403) {
      console.error("🚫 [FORBIDDEN] User does not have permission");

      // Show error notification to user
      if (typeof window !== "undefined") {
        toast.error("You don't have permission to access this resource");
      }
    }

    // Handle 404 Not Found - Resource doesn't exist
    if (error.response?.status === 404) {
      console.error("🔍 [NOT FOUND] Resource not found");

      toast.error("The requested resource was not found");
    }

    // Handle 500 Internal Server Error - Something went wrong on the server
    if (error.response?.status === 500) {
      console.error("💥 [SERVER ERROR] Internal server error occurred");

      toast.error("Something went wrong. Please try again later.");
    }

    // Handle 429 Too Many Requests - Rate limiting
    if (error.response?.status === 429) {
      console.error("⏱️ [RATE LIMITED] Too many requests");

      toast.error("Too many requests. Please wait a moment and try again.");
    }

    // Handle network errors (no response received)
    if (!error.response) {
      console.error("🌐 [NETWORK ERROR] No response received from server");

      toast.error("Network error. Please check your internet connection.");
    }

    // Reject the promise so the calling code can handle the error
    return Promise.reject(error);
  }
);

// Helper function to extract and format error messages from API errors
export function handleClientApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Server responded with an error status (4xx, 5xx)
    if (error.response) {
      // Extract message from response data, fallback to status text
      const message = error.response.data?.message || error.response.statusText;
      return `${message}`;
    }
    // Request was made but no response received (network error, timeout, etc.)
    if (error.request) {
      return "Unable to reach the server. Please check your internet connection.";
    }
  }
  // Something else happened while setting up the request
  return "An unexpected error occurred. Please try again.";
}
