/**
 * Get the base URL for API calls, ensuring it doesn't include tenant subdomain
 * This ensures API routes work correctly regardless of tenant subdomain
 */
export function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    // Server-side: use environment variable or default
    return process.env.NEXT_PUBLIC_BACKEND_API_URL || "";
  }

  // Client-side: get base URL without tenant subdomain
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : "";

  // Check if we're on a tenant subdomain (e.g., clauxy.localhost)
  if (hostname.includes("localhost")) {
    const parts = hostname.split(".");
    // If it's a tenant subdomain like "clauxy.localhost", use just "localhost"
    if (parts.length >= 2 && parts[0] !== "localhost") {
      // It's a tenant subdomain, strip it
      const baseHostname = parts.slice(1).join("."); // Get "localhost" from "clauxy.localhost"
      return `${protocol}//${baseHostname}${port}`;
    }
  } else {
    // Production: check if it's a tenant subdomain
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    if (rootDomain && hostname.endsWith(`.${rootDomain}`)) {
      // It's a tenant subdomain, use root domain
      return `${protocol}//${rootDomain}${port}`;
    }
  }

  // Default: use current origin
  return `${protocol}//${hostname}${port}`;
}

