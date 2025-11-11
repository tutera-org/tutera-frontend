"use client";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

export default function AuthModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-[700px] rounded-lg px-4 sm:px-6 md:px-10 pt-12 pb-6 relative max-h-[90vh] overflow-y-auto">
        {/* Cancel button */}
        <button
          onClick={() => router.back()}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
          aria-label="Close modal"
        >
          <FaTimes className="text-lg sm:text-xl" />
        </button>
        {children}
      </div>
    </div>
  );
}
