import { backendApi } from "@/lib/axiosZustandInstance";
import { create } from "zustand";

interface UserStore {
  role: "INSTITUTION" | "STUDENT" | null;
  isLoading: boolean;
  isFetched: boolean;
  fetchRole: () => Promise<void>;
  setRole: (role: "INSTITUTION" | "STUDENT") => void;
  clearRole: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  role: null,
  isLoading: false,
  isFetched: false,

  fetchRole: async () => {
    const state = get();
    if (state.isFetched || state.isLoading) {
      return;
    }

    set({ isLoading: true });

    try {
      const response = await backendApi.get("/v1/auth/me");
      const role = response.data.data.role;

      set({ role, isLoading: false, isFetched: true });
    } catch (error: any) {
      set({ role: null, isLoading: false, isFetched: true });

      // IMPORTANT: Only redirect if NOT already on sign in page
      if (error.response?.status === 401) {
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          // Prevent redirect loop - only redirect if not already on sign in
          if (!currentPath.startsWith("/signIn")) {
            window.location.href = "/signIn";
          }
        }
      }
    }
  },

  setRole: (role) => {
    set({ role, isLoading: false, isFetched: true });
  },

  clearRole: () => {
    set({ role: null, isLoading: false, isFetched: false });
  },
}));
