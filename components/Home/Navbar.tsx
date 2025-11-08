"use client";

import Link from "next/link";
import Image from "next/image";

const NavBar = () => {
  return (
    <nav className="w-full bg-[#F0F4FF]  py-8">
      <div className="max-w-[1240px] mx-auto ">
        <div className="bg-[#ffffff] rounded-2xl shadow-lg px-4.5 py-5.5">
          <div className="flex items-center justify-center">
            <div className="flex items-center ">
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
                className="text-gray-700 text-[16px] font-semibold relative pb-1"
              >
                Home
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
              </Link>
              <Link
                href="/pricing"
                className="text-gray-700 text-[16px] font-semibold "
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 text-[16px] font-semibold "
              >
                Contact Us
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Link
                href="/signUp"
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                Creator Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Start Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
