"use client";

import { useUserStore } from "@/store/useUserStore";
import CreatorPage from "./CreatorPage";
import StudentPage from "./StudentPage";
import TuteraLoading from "../Reuse/Loader";

export default function DashboardPage() {
  const { role, isLoading } = useUserStore();

  if (isLoading) return <TuteraLoading />;

  // Render appropriate dashboard based on user role
  return (
    <div className="mt-10 md:mt-14 w-full">
      {role === "INSTITUTION" && <CreatorPage />}
      {role === "STUDENT" && <StudentPage />}
    </div>
  );
}
