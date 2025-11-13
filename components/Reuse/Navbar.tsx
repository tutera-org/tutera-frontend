"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "./Button";

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCreatorLogin = () => {
    router.push("/signIn");
    setIsMenuOpen(false);
  };

  const handleStartNow = () => {
    router.push("/signUp");
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#F0F4FF] py-8">
      <div className="w-[90%] lg:max-w-[1240px] mx-auto">
        <div className="bg-[#ffffff] rounded-[16px] shadow-md px-5 py-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/logo.svg"
                alt="tutera logo"
                width={80.45}
                height={26}
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

            <div className=" flex items-center space-x-3">
              <Button
                variant="secondary"
                onClick={handleCreatorLogin}
                className="whitespace-nowrap hidden md:block bg-[#ffffff]"
              >
                Creator Login
              </Button>

              <Button
                variant="primary"
                onClick={handleStartNow}
                className=" hidden md:block whitespace-nowrap "
              >
                Start Now
              </Button>

              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none "
                aria-label="Toggle menu"
              >
                <span
                  className={`w-6 h-0.5 bg-[#101A33] transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`w-6 h-0.5 bg-[#101A33] transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`w-6 h-0.5 bg-[#101A33] transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white rounded-[16px] shadow-lg px-5 py-4 border border-[#D1D1D1] z-50">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-[16px] font-semibold px-1 py-2 ${
                    pathname === "/" ? "text-[#FFFFFF] bg-[#ACBEE5] " : "text-[#101A33]"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/Pricing"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-[16px] font-semibold px-1 py-2 ${
                    pathname === "/Pricing"
                      ? "text-[#FFFFFF] bg-[#ACBEE5] "
                      : "text-[#101A33]"
                  }`}
                >
                  Pricing
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-[16px] font-semibold px-1 py-2 ${
                    pathname === "/contact"
                      ? "text-[#FFFFFF] bg-[#ACBEE5] "
                      : "text-[#101A33]"
                  }`}
                >
                  Contact Us
                </Link>
                <div className="flex flex-col space-y-3 pt-2">
                  <Button
                    variant="primary"
                    onClick={handleStartNow}
                    className="w-full"
                  >
                    Start Now
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCreatorLogin}
                    className="w-full"
                  >
                    Creator Login
                  </Button>
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
