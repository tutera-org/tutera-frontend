"use client";
import Image from "next/image";
import NavLink from "../creatorDashboard/NavBar";
import { FaBell, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { SingleAvatar } from "./Avatar";

export default function CreatorHeader() {
  // TODO: Fix responsiveness and mobile screen

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = {
    name: "Ansah Chikeh",
    role: "Creator",
  };
  return (
    <>
      <header className="flex items-center justify-between">
        <Image
          src={"/pngteturalogo.png"}
          alt="Tetura logo"
          width={104}
          height={31}
        />

        {/* Nav bar  */}
        <nav className="bg-neutral-100 font-semibold text-base leading-[120%] rounded-2xl gap-4 px-2.5 py-3 hidden lg:flex items-center">
          <NavLink href="/dashboard" linkText="Dashboard" />
          <NavLink href="/courseManagement" linkText="Course Management" />
          <NavLink href="/earnings" linkText="Earnings" />
          <NavLink href="/settings" linkText="Settings" />
        </nav>

        <div className="flex items-center justify-center gap-10">
          {/* icons */}

          <FaBell className="text-base hover:text-primary-400 cursor-pointer" />

          <aside className="md:bg-neutral-100 bg-transparent flex item-center rounded-2xl px-2 text-xs items-center text-neutral-900 gap-4 py-2 min-h-10">
            {/* creator */}

            <SingleAvatar name="Ansah Chikeh" />

            <div className="md:flex hidden flex-col">
              <p>{user.name}</p>
              <p>{user.role}</p>
            </div>
          </aside>

          {/* Mobile Menu Button - Only below medium */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden px-4 py-4 min-h-10 rounded-2xl cursor-pointer hover:text-primary-400 text-darkblue transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaTimes className="text-base" />
            ) : (
              <FaBars className="text-base" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden right-0 left-0 top-20 pt-4 bg-neutral-100 shadow-2xl fixed flex h-screen flex-col rounded-lg">
            <div
              className="flex items-center border-b-2 border-gray-500 py-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <NavLink href="/dashboard" linkText="Dashboard" />
            </div>
            <div
              className="flex items-center border-b-2 border-gray-500 py-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <NavLink href="/courseManagement" linkText="Course Management" />
            </div>
            <div
              className="flex items-center border-b-2 border-gray-500 py-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <NavLink href="/earnings" linkText="Earnings" />
            </div>
            <div
              className="flex items-center border-b-2 border-gray-500 py-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <NavLink href="/settings" linkText="Settings" />
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
