"use client";
import { FaTimes } from "react-icons/fa";
import PopUpModal from "../Reuse/PopUpModal";
import AuthFormHeader from "../auth/AuthHeader";
import Link from "next/link";
import { toast } from "sonner";

export default function ChangePassword({
  closeButton,
}: {
  closeButton: () => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password Reset Successful");
    closeButton();
  };
  return (
    <PopUpModal>
      {/* Cancel button */}
      <button
        className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
        aria-label="Close modal"
        onClick={closeButton}
      >
        <FaTimes className="text-lg sm:text-xl" />
      </button>

      <AuthFormHeader header="Create New Password" />

      <form
        onSubmit={handleSubmit}
        className="flex py-5 sm:py-6 md:py-8 flex-col gap-5 sm:gap-6 md:gap-8"
      >
        <div className="flex flex-col gap-1.5 sm:gap-2">
          {/* Current Password */}
          <label
            htmlFor="current"
            className="text-neutral-900 text-xs sm:text-sm md:text-base font-semibold"
          >
            Current Password
          </label>

          <input
            id="current"
            type="password"
            className="border text-sm sm:text-base p-3 sm:p-3.5 border-black-400 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:gap-2">
          {/* New Password */}
          <label
            htmlFor="new"
            className="text-neutral-900 text-xs sm:text-sm md:text-base font-semibold"
          >
            New Password
          </label>

          <input
            id="new"
            type="password"
            className="border text-sm sm:text-base p-3 sm:p-3.5 border-black-400 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:gap-2">
          {/* Confirm Password */}
          <label
            htmlFor="confirm"
            className="text-neutral-900 text-xs sm:text-sm md:text-base font-semibold"
          >
            Confirm Password
          </label>
          <input
            id="confirm"
            type="password"
            className="border text-sm sm:text-base p-3 sm:p-3.5 border-black-400 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>

        {/* Sign up Button */}
        <button className="bg-primary-400 rounded-lg py-3 sm:py-3.5 md:py-4 px-6 font-bold text-xs sm:text-sm md:text-base hover:bg-blue-600 text-neutral-100 transition-colors">
          Reset Password
        </button>
      </form>
    </PopUpModal>
  );
}
