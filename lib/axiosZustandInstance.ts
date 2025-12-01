// For client-side API calls with request deduplication
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponseHeaders,
  AxiosHeaders,
  AxiosResponse,
} from "axios";
import { toast } from "sonner";
import { getAuthToken } from "@/store/authStore";

// Cache for ongoing requests
const pendingRequests = new Map<string, Promise<AxiosResponse>>();

// Cache for completed requests
interface CachedResponse {
  data: unknown;
  headers: AxiosResponseHeaders | Partial<AxiosHeaders>;
  timestamp: number;
}
const responseCache = new Map<string, CachedResponse>();
const CACHE_DURATION = 5000; // 5 seconds - adjust as needed

// Generate unique key for each request
function getRequestKey(config: InternalAxiosRequestConfig): string {
  return `${config.method}:${config.url}:${JSON.stringify(
    config.params
  )}:${JSON.stringify(config.data)}`;
}

// AXIOS INSTANCE

export const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  withCredentials: true,
  // Don't set default Content-Type - let axios set it based on request type
  // For JSON: application/json
  // For FormData: multipart/form-data with boundary (auto-set by axios)
});

// REQUEST INTERCEPTOR - Deduplication & Authentication

backendApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add Authorization header with Bearer token if available
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (process.env.NODE_ENV === "development") {
        console.log("🔑 [AUTH] Bearer token added to request");
      }
    }

    // Set Content-Type for JSON requests (but not for FormData)
    if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    const requestKey = getRequestKey(config);

    // Check if there's a cached response
    const cached = responseCache.get(requestKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          `💾 [CACHE HIT] ${config.method?.toUpperCase()} ${config.url}`
        );
      }

      // Return cached response
      config.adapter = () => {
        return Promise.resolve({
          data: cached.data,
          status: 200,
          statusText: "OK (cached)",
          headers: cached.headers,
          config,
        } as AxiosResponse);
      };
      return config;
    }

    // Check if there's already a pending request
    if (pendingRequests.has(requestKey)) {
      if (process.env.NODE_ENV === "development") {
        console.log(`🔄 [DEDUP] ${config.method?.toUpperCase()} ${config.url}`);
      }

      // Return the existing promise
      config.adapter = () => pendingRequests.get(requestKey)!;
      return config;
    }

    // Log outgoing request
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🚀 [BACKEND API] ${config.method?.toUpperCase()} ${config.baseURL}${
          config.url
        }`
      );
    }

    // Store request metadata for later use
    (config as any).requestKey = requestKey;

    return config;
  },
  (error: AxiosError) => {
    if (process.env.NODE_ENV === "development") {
      console.error("[BACKEND API ERROR]", error);
    }
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR - Caching & Error Handling

backendApi.interceptors.response.use(
  (response) => {
    const requestKey = (response.config as any).requestKey;

    if (requestKey) {
      // Cache the response
      responseCache.set(requestKey, {
        data: response.data,
        headers: response.headers,
        timestamp: Date.now(),
      });

      // Clean up pending request
      pendingRequests.delete(requestKey);
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`✅ [BACKEND API] ${response.status} ${response.config.url}`);
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      requestKey?: string;
    };

    // Clean up pending request on error
    if (originalRequest?.requestKey) {
      pendingRequests.delete(originalRequest.requestKey);
    }

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

        await backendApi.post(
          "/v1/refreshToken",
          {},
          { withCredentials: true }
        );

        console.log("✅ [TOKEN REFRESH] Token refreshed successfully");

        // Retry original request
        return backendApi(originalRequest);
      } catch (refreshError) {
        console.error("❌ [TOKEN REFRESH FAILED]", refreshError);

        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          if (currentPath !== "/signIn") {
            localStorage.setItem("redirectAfterLogin", currentPath);
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

// HELPER FUNCTIONS

// Extract error messages
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

// Clear all caches (useful for logout or manual refresh)
export function clearApiCache() {
  responseCache.clear();
  pendingRequests.clear();
  if (process.env.NODE_ENV === "development") {
    console.log("🧹 [CACHE CLEARED] All API caches cleared");
  }
}
