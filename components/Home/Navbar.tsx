"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NavBar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCreatorLogin = () => {
    // TODO: Navigate to creator login page
  };

  const handleStartNow = () => {
  // TODO: Navigate to registration page
  };

  return (
    <nav className="w-full bg-[#F0F4FF] py-8">
      <div className="max-w-[1240px] mx-auto">
        <div className="bg-[#ffffff] rounded-[16px] shadow-lg px-5 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/logo.svg"
                alt="tutera logo"
                width={70}
                height={40}
                priority
              />
            </div>

            <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
              <Link
                href="/"
                className={`text-[16px] font-semibold ${
                  pathname === "/"
                    ? "text-[#101A33] border-b-2 border-blue-600"
                    : "text-[#101A33]"
                }`}
              >
                Home
              </Link>

              <Link
                href="/Pricing"
                className={`text-[16px] font-semibold ${
                  pathname === "/Pricing"
                    ? "text-[#101A33] border-b-2 border-blue-600"
                    : "text-[#101A33]"
                }`}
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className={`text-[16px] font-semibold ${
                  pathname === "/contact"
                    ? "text-[#101A33] border-b-2 border-blue-600"
                    : "text-[#101A33]"
                }`}
              >
                Contact Us
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <button
                type="button"
                onClick={handleCreatorLogin}
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                Creator Login
              </button>
              <button
                type="button"
                onClick={handleStartNow}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Start Now
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex flex-col space-y-1"
            >
              <span className="w-6 h-0.5 bg-gray-700"></span>
              <span className="w-6 h-0.5 bg-gray-700"></span>
              <span className="w-6 h-0.5 bg-gray-700"></span>
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-[16px] font-semibold ${
                    pathname === "/"
                      ? "text-[#101A33] border-b-2 border-blue-600 pb-1"
                      : "text-[#101A33]"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/Pricing"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-[16px] font-semibold ${
                    pathname === "/Pricing"
                      ? "text-[#101A33] border-b-2 border-blue-600 pb-1"
                      : "text-[#101A33]"
                  }`}
                >
                  Pricing
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-[16px] font-semibold ${
                    pathname === "/contact"
                      ? "text-[#101A33] border-b-2 border-blue-600 pb-1"
                      : "text-[#101A33]"
                  }`}
                >
                  Contact Us
                </Link>
                <div className="flex flex-col space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleStartNow}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Start Now
                  </button>
                  <button
                    type="button"
                    onClick={handleCreatorLogin}
                    className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    Creator Login
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
