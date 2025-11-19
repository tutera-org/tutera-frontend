import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

// Create client-side axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    //TODO: Discuss with Backend team and Add any custom headers here
    return config;
  },
  (error: AxiosError) => {
    // Handle request errors (e.g., network issues before request is sent)
    if (process.env.NODE_ENV === "development") {
      console.error("[API Request Error]", error);
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }

    return response;
  },
  async (error: AxiosError) => {
    // Handle error responses (non-2xx status codes)
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Log errors in development mode only
    if (process.env.NODE_ENV === "development") {
      console.error(
        `[API Error] ${error.response?.status} ${originalRequest?.url}`,
        error.response?.data
      );
    }

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Mark this request as retried to prevent infinite loops
      originalRequest._retry = true;

      try {
        // Attempt to refresh the authentication token
        // The backend should set a new auth cookie in the response
        await api.post("/auth/refresh", {}, { withCredentials: true });

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // Token refresh failed - user needs to login again
        if (process.env.NODE_ENV === "development") {
          console.error("[Token Refresh Failed]", refreshError);
        }

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
      if (process.env.NODE_ENV === "development") {
        console.error("[Forbidden] User does not have permission");
      }

      // Show error notification
      if (typeof window !== "undefined") {
        toast.error("You don't have permission to access this resource");
      }
    }

    // Handle 404 Not Found - Resource doesn't exist
    if (error.response?.status === 404) {
      if (process.env.NODE_ENV === "development") {
        console.error("[Not Found] Resource not found");
      }

      toast.error("The requested resource was not found");
    }

    // Handle 500 Internal Server Error - Something went wrong on the server
    if (error.response?.status === 500) {
      if (process.env.NODE_ENV === "development") {
        console.error("[Server Error] Internal server error occurred");
      }

      toast.error("Something went wrong. Please try again later.");
    }

    // Handle 429 Too Many Requests - Rate limiting
    if (error.response?.status === 429) {
      if (process.env.NODE_ENV === "development") {
        console.error("[Rate Limited] Too many requests");
      }

      toast.error("Too many requests. Please wait a moment and try again.");
    }

    // Handle network errors
    if (!error.response) {
      if (process.env.NODE_ENV === "development") {
        console.error("[Network Error] No response received from server");
      }

      toast.error("Network error. Please check your internet connection.");
    }

    // Reject the promise so the calling code can handle the error
    return Promise.reject(error);
  }
);

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

// Manually logout the user
export async function logout(): Promise<void> {
  try {
    // Call backend logout endpoint to clear the auth cookie
    await api.post("/auth/logout");
  } catch (error) {
    // Log error but continue with logout process
    if (process.env.NODE_ENV === "development") {
      console.error("[Logout Error]", error);
    }
  } finally {
    // TODO: Remember to clear anything stored in localStorage or sessionStorage

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/signIn";
    }
  }
}
