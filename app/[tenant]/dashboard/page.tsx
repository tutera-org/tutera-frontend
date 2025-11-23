"use client";

import { useEffect, useState } from "react";
import CreatorPage from "@/components/creatorDashboard/CreatorPage";
import StudentPage from "@/components/creatorDashboard/StudentPage";
import TuteraLoading from "@/components/Reuse/Loader";

type UserRole = "institution" | "student" | null;

export default function DashboardPage() {
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Get role from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = sessionStorage.getItem("user_role") as UserRole;
      setRole(storedRole);
      setIsLoading(false);
      console.log("📋 Dashboard - Retrieved role:", storedRole);
    }
  }, []);

  if (isLoading) return <TuteraLoading />;

  return (
    <div className="mt-10 md:mt-14 w-full">
      {role === "institution" && <CreatorPage />}
      {role === "student" && <StudentPage />}
    </div>
  );
}
