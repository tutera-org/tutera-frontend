"use client";

import { useEffect, useState } from "react";
import { SingleAvatar } from "../Reuse/Avatar";

export default function StudentsNavbar() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("User");
  const [tenantName, setTenantName] = useState("School");

  // ✅ Get user data from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFirstName = sessionStorage.getItem("user_firstName") || "";
      const storedLastName = sessionStorage.getItem("user_lastName") || "";
      const storedTenantName =
        sessionStorage.getItem("tenant_name") || "School";

      setFirstName(storedFirstName);
      setLastName(storedLastName);
      setTenantName(storedTenantName);

      // Create full name (handle empty values)
      const full = `${storedFirstName} ${storedLastName}`.trim();
      setFullName(full || "User");

      console.log(
        "👤 Student Navbar - User:",
        full,
        "| School:",
        storedTenantName
      );
    }
  }, []);

  return (
    <header className="flex justify-between items-center">
      <aside className="flex gap-1 sm:gap-2 items-center">
        <div className="h-auto w-10 sm:w-12 md:w-[53px]">
          <img
            src="/creatorLogo.svg"
            alt="Creator logo"
            className="w-full h-auto"
          />
        </div>
        <h3 className="text-base sm:text-lg md:text-xl lg:text-[2rem] text-orange-300 font-semibold">
          {tenantName}
        </h3>
      </aside>
      <aside className="bg-neutral-100 flex items-center rounded-2xl px-2 sm:px-3 py-2 sm:py-2.5 text-xs text-neutral-900 gap-2 sm:gap-3 min-h-10 sm:min-h-11">
        <SingleAvatar name={fullName} />

        <div className="md:flex hidden flex-col">
          <p className="font-bold text-sm">{fullName}</p>
          <p className="text-neutral-700 text-xs">Learner</p>
        </div>
      </aside>
    </header>
  );
}
