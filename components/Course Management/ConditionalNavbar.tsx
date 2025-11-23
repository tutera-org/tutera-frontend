"use client";

import { useEffect, useState } from "react";
import CreatorHeader from "@/components/Reuse/CreatorHeader";
import StudentsNavbar from "@/components/students/Navbar";

export default function ConditionalNavbar() {
  const role = "creator" as "creator" | "student";
  const [showNavbar, setShowNavbar] = useState(true);

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
    // Check periodically in case step changes
    const interval = setInterval(checkStep, 100);
    return () => clearInterval(interval);
  }, []);

  if (!showNavbar) return null;

  return role === "student" ? <StudentsNavbar /> : <CreatorHeader />;
}

