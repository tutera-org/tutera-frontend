"use client";
import { useEffect } from "react";
import ConditionalNavbar from "@/components/Course Management/ConditionalNavbar";
import { initializeAuth } from "@/lib/authUtils";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize auth token from storage on mount
    initializeAuth();
  }, []);

  return (
    <div className="bg-neutral-100 pb-10 min-h-screen">
      <div className="w-[90%] max-w-[1240px] mx-auto pt-5">
        <ConditionalNavbar />

        {children}
      </div>
    </div>
  );
}
