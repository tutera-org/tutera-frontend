"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaymentPage from "@/components/Payment/PaymentPage";
import PaymentHeader from "@/components/Payment/PaymentHeader";

interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
}

// Helper function to get plan from localStorage
const getPlanFromStorage = (): Plan | null => {
  if (typeof window === "undefined") return null;

  const planData = localStorage.getItem("selectedPlan");
  if (!planData) return null;

  try {
    return JSON.parse(planData) as Plan;
  } catch (error) {
    console.error("Error parsing plan data:", error);
    return null;
  }
};

const PaymentRoute = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load plan from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const plan = getPlanFromStorage();
    setSelectedPlan(plan);
    setIsHydrated(true);
    
    if (!plan) {
      router.push("/Pricing");
    }
  }, [router]);

  // Show loading state until hydrated
  if (!isHydrated || !selectedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4977E6]"></div>
      </div>
    );
  }

  return (
    <>
      <PaymentHeader />
      <PaymentPage selectedPlan={selectedPlan} />
    </>
  );
};

export default PaymentRoute;
