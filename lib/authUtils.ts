import { useAuthStore } from "@/store/authStore";

/**
 * Set the authentication token in the store
 * This can be called after login or when you have a token
 */
export function setAuthToken(token: string) {
  useAuthStore.getState().setToken(token);
  console.log("✅ [AUTH] Token stored in auth store");
}

/**
 * Clear the authentication token
 */
export function clearAuthToken() {
  useAuthStore.getState().clearToken();
  console.log("✅ [AUTH] Token cleared from auth store");
}

/**
 * Get the current authentication token
 */
export function getToken(): string | null {
  return useAuthStore.getState().token;
}

/**
 * Initialize token from localStorage if available
 * Call this on app startup
 */
export function initializeAuth() {
  if (typeof window === "undefined") return;

  // Check if token exists in localStorage (from previous session)
  const storedToken = localStorage.getItem("auth-storage");
  if (storedToken) {
    try {
      const parsed = JSON.parse(storedToken);
      if (parsed.state?.token) {
        console.log("✅ [AUTH] Token initialized from storage");
        return;
      }
    } catch (error) {
      console.error("❌ [AUTH] Failed to parse stored token", error);
    }
  }

  // Also check for token in a simple localStorage key as fallback
  const simpleToken = localStorage.getItem("accessToken");
  if (simpleToken) {
    setAuthToken(simpleToken);
    console.log("✅ [AUTH] Token initialized from localStorage accessToken");
  }
}

/**
 * Set token manually (useful for testing or when you have a token)
 * You can call this from browser console: window.setAuthToken('your-token-here')
 */
if (typeof window !== "undefined") {
  (window as any).setAuthToken = setAuthToken;
  (window as any).getAuthToken = getToken;
  (window as any).clearAuthToken = clearAuthToken;
  console.log("🔧 [AUTH] Utility functions available on window object:");
  console.log("   - window.setAuthToken(token)");
  console.log("   - window.getAuthToken()");
  console.log("   - window.clearAuthToken()");
}

