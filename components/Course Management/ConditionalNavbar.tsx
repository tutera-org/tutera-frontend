"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import CreatorHeader from "@/components/Reuse/CreatorHeader";
import StudentsNavbar from "@/components/students/Navbar";
import TuteraLoading from "../Reuse/Loader";

type UserRole = "institution" | "student" | null;

export default function ConditionalNavbar() {
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const pathname = usePathname();

  // ✅ Get role from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("user_role") as UserRole;
      setRole(storedRole);
      setIsLoading(false);
    }
  }, []);

  // Monitor course creation flow - use storage event for real-time updates
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initial check
    const checkStep = () => {
      const savedStep = localStorage.getItem("tutera_current_step");
      const step = savedStep ? parseInt(savedStep) : 0;
      setCurrentStep(step);
    };

    checkStep();

    // Listen for storage changes (when step is updated in CourseContext)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "tutera_current_step") {
        const step = e.newValue ? parseInt(e.newValue) : 0;
        setCurrentStep(step);
      }
    };

    // Also listen to custom events (for same-tab updates)
    const handleCustomStorageChange = () => {
      checkStep();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("tutera-step-changed", handleCustomStorageChange);

    // Check periodically as fallback (but less frequently)
    const interval = setInterval(checkStep, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tutera-step-changed", handleCustomStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Determine if navbar should be shown
  // Hide navbar only when:
  // 1. We're in course creation flow (currentStep 1-3) AND
  // 2. We're on the courseManagement page
  const isCourseManagementPage = pathname?.includes("/courseManagement");
  const isInCreationFlow = currentStep >= 1 && currentStep <= 3;
  const showNavbar = !(isCourseManagementPage && isInCreationFlow);

  if (isLoading) return <TuteraLoading />;
  if (!showNavbar) return null;

  return (
    <div>
      {role === "institution" && <CreatorHeader />}
      {role === "student" && <StudentsNavbar />}
    </div>
  );
}
