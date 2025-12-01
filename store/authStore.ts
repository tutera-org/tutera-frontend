import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: "auth-storage", // localStorage key
    }
  )
);

// Export a function to get token without hook (for use in interceptors)
// This function checks both the store and localStorage as a fallback
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  
  // First try to get from store
  const storeToken = useAuthStore.getState().token;
  if (storeToken) {
    return storeToken;
  }
  
  // If store doesn't have it yet (hydration issue), check localStorage directly
  try {
    const stored = localStorage.getItem("auth-storage");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.state?.token) {
        // Store is not hydrated yet, but token exists in localStorage
        // Return it directly for immediate use
        return parsed.state.token;
      }
    }
  } catch (e) {
    console.error("Error reading token from localStorage:", e);
  }
  
  return null;
};

