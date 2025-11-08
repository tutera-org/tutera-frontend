"use client";

import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

export default function AuthModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/50">
      <div className="bg-white max-w-[700px] to w-[90%] rounded-lg px-10 pt-10 relative">
        {/* cancel button */}
        <FaTimes
          onClick={() => router.back()}
          className="absolute text-gray-500 top-4 right-4 text-xl cursor-pointer font-bold"
        />
        {children}
      </div>
    </div>
  );
}
