"use client";

import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchRole = useUserStore((state) => state.fetchRole);
  const pathname = usePathname();

  useEffect(() => {
    // Public routes that don't need role fetching
    const publicRoutes = [
      "/signIn",
      "/signUp",
      "/forgotPassword",
      "/resetPassword",
      "/resetSuccess",
      "/verifyOtp",
    ];

    // Check if current route is public
    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!isPublicRoute) {
      fetchRole();
    }
  }, []); // Run once on mount

  return <>{children}</>;
}
