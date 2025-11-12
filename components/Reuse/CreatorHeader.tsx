"use client";
import Image from "next/image";
import NavLink from "../creatorDashboard/NavBar";
import { FaBell, FaCog, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

export default function CreatorHeader() {
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
          <NavLink href="dashboard" linkText="Dashboard" />
          <NavLink href="courseProgress" linkText="Course Progress" />
          <NavLink href="courseManagement" linkText="Course Management" />
          <NavLink href="customization" linkText="Customization" />
        </nav>

        <div className="flex items-center justify-center gap-2.5">
          {/* icons */}
          <aside className="rounded-[2xl flex gap-2 items-center justify-center bg-neutral-100 px-4 py-4 min-h-10 rounded-2xl">
            <FaBell className="text-base hover:text-primary-400 cursor-pointer" />
            <FaCog className="text-base hover:text-primary-400 cursor-pointer" />
          </aside>

          <aside className="md:bg-neutral-100 bg-transparent flex item-center justify- rounded-2xl px-4 text-xs items-center text-neutral-900 gap-4 py-4 min-h-10">
            {/* creator */}

            <FaUser className="text-base" />

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
              <NavLink href="/courseProgress" linkText="Course Progress" />
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
              <NavLink href="/customization" linkText="Customization" />
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
