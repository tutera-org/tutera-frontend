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

// ADDED: Variables to handle multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// ADDED: Process all queued requests after token refresh
const processQueue = (error: AxiosError | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

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
      // IMPROVED: Check if we're already refreshing
      if (isRefreshing) {
        // Queue this request to be retried after refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Mark this request as retried to prevent infinite loops
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 [TOKEN REFRESH] Attempting to refresh token...");

        // Call your refresh token endpoint
        await api.post("/v1/refreshToken", {}, { withCredentials: true });

        console.log("✅ [TOKEN REFRESH] Token refreshed successfully");

        // Process all queued requests
        processQueue(null);
        isRefreshing = false;

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // Token refresh failed - user needs to login again
        console.error("❌ [TOKEN REFRESH FAILED]", refreshError);

        // Reject all queued requests
        processQueue(refreshError as AxiosError);
        isRefreshing = false;

        // Redirect to signIn page
        if (typeof window !== "undefined") {
          // Store the current URL to redirect back after login
          const currentPath = window.location.pathname;
          if (currentPath !== "/signIn") {
            localStorage.setItem("redirectAfterLogin", currentPath);
          }
          window.location.href = "/signIn";
        }

        return Promise.reject(refreshError);
      }
    }

    // Show backend error message for all other errors
    if (error.response && typeof window !== "undefined") {
      const responseData = error.response.data as any;
      const backendMessage =
        responseData?.data?.message ||
        responseData?.data?.error ||
        responseData?.message ||
        responseData?.error ||
        responseData?.msg ||
        error.response.statusText;

      // Only show toast if there's a meaningful message
      if (backendMessage && typeof backendMessage === "string") {
        toast.error(backendMessage);
      }
    }

    // Handle network errors (no response received)
    if (!error.response && typeof window !== "undefined") {
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
      const responseData = error.response.data as any;

      // Extract message from backend - try multiple possible fields
      const backendMessage =
        responseData?.data?.message ||
        responseData?.data?.error ||
        responseData?.message ||
        responseData?.error ||
        responseData?.msg ||
        error.response.statusText;

      return typeof backendMessage === "string" && backendMessage
        ? backendMessage
        : "An error occurred";
    }
    // Request was made but no response received (network error, timeout, etc.)
    if (error.request) {
      return "Unable to reach the server. Please check your internet connection.";
    }
  }
  // Something else happened while setting up the request
  return "An unexpected error occurred. Please try again.";
}
