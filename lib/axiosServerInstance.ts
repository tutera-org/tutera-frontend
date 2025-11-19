import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

/**
 * Create a server-side axios instance with cookies
 * This function must only be called from Server Components, Server Actions, or Route Handlers
 */
export async function getApiWithCookies() {
  const cookieStore = await cookies();

  // Combine all cookies into a single Cookie header string
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  // Create a new axios instance with cookies attached
  const serverApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
  });

  serverApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Log server-side requests in development mode only
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[Server API Request] ${config.method?.toUpperCase()} ${config.url}`
        );
      }
      return config;
    },
    (error: AxiosError) => {
      if (process.env.NODE_ENV === "development") {
        console.error("[Server API Request Error]", error);
      }
      return Promise.reject(error);
    }
  );

  serverApi.interceptors.response.use(
    (response) => {
      // Log server-side responses in development mode only
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[Server API Response] ${response.status} ${response.config.url}`
        );
      }
      return response;
    },
    (error: AxiosError) => {
      // Log server-side errors in development mode only
      if (process.env.NODE_ENV === "development") {
        console.error(
          `[Server API Error] ${error.response?.status} ${error.config?.url}`,
          error.response?.data
        );
      }

      // Handle 401 Unauthorized on server-side
      if (error.response?.status === 401) {
        throw new Error("UNAUTHORIZED");
      }

      // Handle 403 Forbidden on server-side
      if (error.response?.status === 403) {
        throw new Error("FORBIDDEN");
      }

      // Handle 404 Not Found on server-side
      if (error.response?.status === 404) {
        throw new Error("NOT_FOUND");
      }

      // Handle 500 Internal Server Error on server-side
      if (error.response?.status === 500) {
        throw new Error("INTERNAL_SERVER_ERROR");
      }

      return Promise.reject(error);
    }
  );

  return serverApi;
}

// Error Helper function
export function handleServerApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Server responded with an error status (4xx, 5xx)
    if (error.response) {
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
