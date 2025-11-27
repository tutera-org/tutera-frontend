"use client";
import { useEffect, useState } from "react";
import { BigSingleAvatar } from "../Reuse/Avatar";
import EditForm from "./EditForm";

export default function EditPricing() {
  // Store name in state
  const [tenantName, setTenantName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Get name from state
  useEffect(() => {
    setMounted(true);
    const storedTenantName =
      localStorage.getItem("tenant_name") || "Institution";
    setTenantName(storedTenantName);

    console.log("🏢 Creator Header - Institution:", storedTenantName);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="mt-6 sm:mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        <aside className="lg:col-span-1 flex justify-center lg:justify-start">
          <BigSingleAvatar name="Institution" />
        </aside>
        <EditForm />
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
      <aside className="lg:col-span-1 flex justify-center lg:justify-start">
        {/* Image and icon */}
        <BigSingleAvatar name={tenantName || "Institution"} />
      </aside>

      <EditForm />
    </div>
  );
}
