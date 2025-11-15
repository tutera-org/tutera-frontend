"use client";
import Image from "next/image";
import NavLink from "../creatorDashboard/NavBar";
import { FaBell, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { SingleAvatar } from "./Avatar";

export default function CreatorHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = {
    name: "Ansah Chikeh",
    role: "Creator",
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
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

          {/* Avatar - Hidden on small screens, shown on md and up */}
          <aside className="md:bg-neutral-100 bg-transparent hidden sm:flex items-center rounded-2xl px-3 py-2.5 text-xs text-neutral-900 gap-3 min-h-11">
            <SingleAvatar name="Ansah Chikeh" />

            <div className="md:flex hidden flex-col">
              <p className="font-medium">{user.name}</p>
              <p className="text-neutral-700">{user.role}</p>
            </div>
          </aside>

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
          <nav className="bg-neutral-100 font-semibold text-base rounded-2xl p-4 flex flex-col items-start gap-7">
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
        </div>
      </div>
    </>
  );
}
