"use client";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

export default function AuthModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="bg-white w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[700px] rounded-lg px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 relative max-h-[95vh] overflow-y-auto">
        {/* Cancel button */}
        <button
          onClick={() => router.back()}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Close modal"
        >
          <FaTimes className="text-xl sm:text-2xl" />
        </button>

        <div className="text-base sm:text-lg md:text-base space-y-4 sm:space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
