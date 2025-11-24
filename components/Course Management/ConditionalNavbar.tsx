"use client";

import { useEffect, useState } from "react";
import CreatorHeader from "@/components/Reuse/CreatorHeader";
import StudentsNavbar from "@/components/students/Navbar";
import TuteraLoading from "../Reuse/Loader";

type UserRole = "institution" | "student" | null;

export default function ConditionalNavbar() {
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);

  // ✅ Get role from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("user_role") as UserRole;
      setRole(storedRole);
      setIsLoading(false);
      console.log("📋 Retrieved role from localStorage:", storedRole);
    }
  }, []);

  // Monitor course creation flow
  useEffect(() => {
    // Check if we're in course creation flow or customization steps
    const checkStep = () => {
      if (typeof window !== "undefined") {
        const savedStep = localStorage.getItem("tutera_current_step");
        const customizationStep = localStorage.getItem("tutera_customization_step");
        const step = savedStep ? parseInt(savedStep) : 0;
        const customStep = customizationStep ? parseInt(customizationStep) : 0;
        // Hide navbar when in course creation steps (1-3) or customization steps (1-4)
        setShowNavbar(step === 0 && customStep === 0);
      }
    };

    checkStep();
    const interval = setInterval(checkStep, 100);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <TuteraLoading />;
  if (!showNavbar) return null;

  return (
    <div>
      {role === "institution" && <CreatorHeader />}
      {role === "student" && <StudentsNavbar />}
    </div>
  );
}
