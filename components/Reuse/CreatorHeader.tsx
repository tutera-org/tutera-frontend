"use client";
import Image from "next/image";
import NavLink from "../creatorDashboard/NavBar";
import { FaBell, FaBars, FaTimes, FaSignOutAlt, FaCopy } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { SingleAvatar } from "./Avatar";
import { useRouter } from "next/navigation";
import { api, handleClientApiError } from "@/lib/axiosClientInstance";
import { toast } from "sonner";

export default function CreatorHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tenantName, setTenantName] = useState("Institution");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ✅ Get tenant name from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTenantName =
        localStorage.getItem("tenant_name") || "Institution";
      setTenantName(storedTenantName);

      console.log("🏢 Creator Header - Institution:", storedTenantName);
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

  const handleCopyUrl = async () => {
    try {
      if (typeof window !== "undefined") {
        const currentUrl = window.location.href;
        await navigator.clipboard.writeText(currentUrl);
        toast.success("URL copied to clipboard!");
        setIsDropdownOpen(false);
      }
    } catch (error) {
      console.error("Failed to copy URL:", error);
      toast.error("Failed to copy URL");
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log("🚪 Starting logout...");

      const response = await api.post("/v1/tenantLogout");

      console.log("✅ Logout successful");
      toast.success(response.data.message || "Logged out successfully");

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.clear();
      }

      // Redirect to login page
      router.push("/signIn");
    } catch (error) {
      console.error("❌ Logout error:", error);
      const errorMessage = handleClientApiError(error);
      toast.error(errorMessage);

      // Clear localStorage and redirect anyway for security
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      router.push("/signIn");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const user = {
    name: tenantName,
    role: "Creator",
  };

  return (
    <>
      <header className="flex items-center justify-between">
        <Image
          src="/logo.svg"
          alt="tutera logo"
          width={80.45}
          height={26}
          priority
        />

        {/* Nav bar */}
        <nav className="bg-neutral-100 font-semibold text-base leading-[120%] rounded-2xl gap-2 px-3 py-3 hidden lg:flex items-center">
          <NavLink href="/dashboard" linkText="Dashboard" />
          <NavLink href="/courseManagement" linkText="Course Management" />
          <NavLink href="/earnings" linkText="Earnings" />
          <NavLink href="/settings" linkText="Settings" />
        </nav>

        <div className="flex items-center justify-center gap-6 sm:gap-8 lg:gap-10">
          {/* icons */}
          <FaBell className="text-lg hover:text-primary-400 cursor-pointer transition-colors" />

          {/* Avatar with Dropdown - Hidden on small screens, shown on md and up */}
          <div className="relative hidden sm:block" ref={dropdownRef}>
            <aside
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="md:bg-neutral-100 bg-transparent flex items-center rounded-2xl px-3 py-2.5 text-xs text-neutral-900 gap-3 min-h-11 cursor-pointer hover:bg-neutral-200 transition-colors"
            >
              <SingleAvatar name={tenantName} />

              <div className="md:flex hidden flex-col">
                <p className="font-medium">{user.name}</p>
                <p className="text-neutral-700">{user.role}</p>
              </div>
            </aside>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
                {/* Copy URL Button */}
                <button
                  onClick={handleCopyUrl}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  <FaCopy className="text-base" />
                  <span className="font-medium">Copy URL</span>
                </button>

                {/* Divider */}
                <div className="border-t border-neutral-200 my-1"></div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSignOutAlt className="text-base" />
                  <span className="font-medium">
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Only below large screens */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 rounded-2xl cursor-pointer hover:text-primary-400 text-darkblue transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaTimes className="text-lg" />
            ) : (
              <FaBars className="text-lg" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar - Slides from top */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="p-8">
          {/* Close button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2.5 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <FaTimes className="text-xl text-darkblue" />
            </button>
          </div>

          {/* User Profile - Only visible on small screens in mobile menu */}
          <div className="sm:hidden flex items-center bg-neutral-100 rounded-2xl px-4 py-3 gap-3 mb-6 pb-6 border-b border-neutral-700/20">
            <SingleAvatar name={user.name} />
            <div className="flex flex-col">
              <p className="font-medium text-sm text-neutral-900">
                {user.name}
              </p>
              <p className="text-xs text-neutral-700">{user.role}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="bg-neutral-100 font-semibold text-base rounded-2xl p-4 flex flex-col items-start gap-7 mb-6">
            <div onClick={() => setIsMenuOpen(false)}>
              <NavLink href="/dashboard" linkText="Dashboard" />
            </div>
            <div onClick={() => setIsMenuOpen(false)}>
              <NavLink href="/courseManagement" linkText="Course Management" />
            </div>
            <div onClick={() => setIsMenuOpen(false)}>
              <NavLink href="/earnings" linkText="Earnings" />
            </div>
            <div onClick={() => setIsMenuOpen(false)}>
              <NavLink href="/settings" linkText="Settings" />
            </div>
          </nav>

          {/* Mobile Copy URL Button */}
          <button
            onClick={handleCopyUrl}
            className="w-full flex items-center justify-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-3 px-4 rounded-xl transition-colors mb-3"
          >
            <FaCopy className="text-base" />
            <span>Copy URL</span>
          </button>

          {/* Mobile Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSignOutAlt className="text-base" />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
