"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaymentPage from "@/components/Payment/PaymentPage";

interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
}

// Helper function to get plan from sessionStorage
const getPlanFromStorage = (): Plan | null => {
  if (typeof window === "undefined") return null;

  const planData = sessionStorage.getItem("selectedPlan");
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
  const [selectedPlan] = useState<Plan | null>(() => getPlanFromStorage());

  useEffect(() => {
    if (!selectedPlan) {
      router.push("/Pricing");
    }
  }, [selectedPlan, router]);

  if (!selectedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4977E6]"></div>
      </div>
    );
  }

  return <PaymentPage selectedPlan={selectedPlan} />;
};

export default PaymentRoute;
