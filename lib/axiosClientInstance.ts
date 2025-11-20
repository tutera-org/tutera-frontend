import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

// Create client-side axios instance
// This instance is used in the browser to call Next.js API routes (not the backend directly)
export const api = axios.create({
  baseURL: "/api", // Changed: Now points to Next.js API routes instead of backend
  withCredentials: true, // Important: Allows cookies to be sent with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - runs before every request is sent
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Enhanced logging with timestamp and full URL
    if (process.env.NODE_ENV === "development") {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`🚀 [CLIENT REQUEST] ${new Date().toISOString()}`);
      console.log(`   Method: ${config.method?.toUpperCase()}`);
      console.log(`   URL: ${config.baseURL}${config.url}`);
      console.log(`   Headers:`, config.headers);
      if (config.data) {
        console.log(`   Body:`, config.data);
      }
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    //TODO: Discuss with Backend team and Add any custom headers here
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
    // Enhanced logging for successful responses
    if (process.env.NODE_ENV === "development") {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`✅ [CLIENT RESPONSE] ${new Date().toISOString()}`);
      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   URL: ${response.config.url}`);
      console.log(`   Data:`, response.data);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    return response;
  },
  async (error: AxiosError) => {
    // Handle error responses (non-2xx status codes)
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Enhanced error logging in development mode
    if (process.env.NODE_ENV === "development") {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.error(`❌ [CLIENT ERROR] ${new Date().toISOString()}`);
      console.error(`   Status: ${error.response?.status}`);
      console.error(`   URL: ${originalRequest?.url}`);
      console.error(`   Error Message:`, error.message);
      console.error(`   Response Data:`, error.response?.data);
      console.error(`   Full Error:`, error);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Mark this request as retried to prevent infinite loops
      originalRequest._retry = true;

      try {
        console.log("🔄 [TOKEN REFRESH] Attempting to refresh token...");

        // Attempt to refresh the authentication token
        // This calls your Next.js API route at /api/auth/refresh
        // which then calls the backend to refresh the token
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

// Manually logout the user - clears session and redirects to login
export async function logout(): Promise<void> {
  try {
    console.log("🚪 [LOGOUT] Logging out user...");

    // Call Next.js API route which will call backend logout endpoint to clear the auth cookie
    await api.post("/auth/logout");

    console.log("✅ [LOGOUT] Logged out successfully");
  } catch (error) {
    // Log error but continue with logout process
    console.error("❌ [LOGOUT ERROR]", error);
  } finally {
    // TODO: Remember to clear anything stored in localStorage or sessionStorage

    // Redirect to login page
    if (typeof window !== "undefined") {
      console.log("↪️ [LOGOUT] Redirecting to sign in page...");
      window.location.href = "/signIn";
    }
  }
}
