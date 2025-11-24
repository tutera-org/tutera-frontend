"use client";

import { useEffect, useState, useRef } from "react";
import { SingleAvatar } from "../Reuse/Avatar";
import { FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { api, handleClientApiError } from "@/lib/axiosClientInstance";
import { toast } from "sonner";

export default function StudentsNavbar() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("User");
  const [tenantName, setTenantName] = useState("School");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ✅ Get user data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFirstName = localStorage.getItem("user_firstName") || "";
      const storedLastName = localStorage.getItem("user_lastName") || "";
      const storedTenantName =
        localStorage.getItem("tenant_name") || "School";

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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log("🚪 Starting logout...");

      const response = await api.post("/auth/logout");

      if (response.data.success) {
        console.log("✅ Logout successful");
        toast.success(response.data.message || "Logged out successfully");

        // Clear localStorage
        if (typeof window !== "undefined") {
          localStorage.clear();
        }

        // Redirect to login page
        router.push("/login");
      }
    } catch (error) {
      console.error("❌ Logout error:", error);
      const errorMessage = handleClientApiError(error);
      toast.error(errorMessage);

      // Clear localStorage and redirect anyway for security
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

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

      {/* Avatar with Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <aside
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-neutral-100 hover:bg-neutral-200 flex items-center rounded-2xl px-2 sm:px-3 py-2 sm:py-2.5 text-xs text-neutral-900 gap-2 sm:gap-3 min-h-10 sm:min-h-11 cursor-pointer transition-colors"
        >
          <SingleAvatar name={fullName} />

          <div className="md:flex hidden flex-col">
            <p className="font-bold text-sm">{fullName}</p>
            <p className="text-neutral-700 text-xs">Learner</p>
          </div>
        </aside>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
            {/* Show name on mobile when dropdown is open */}
            <div className="md:hidden px-4 py-2 border-b border-neutral-200 mb-2">
              <p className="font-bold text-sm text-neutral-900">{fullName}</p>
              <p className="text-neutral-700 text-xs">Learner</p>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-900 hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSignOutAlt className="text-base" />
              <span className="font-medium">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
