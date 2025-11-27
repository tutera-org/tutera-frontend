"use client";
import { useState } from "react";
import StudentButton from "../students/Button";
import Marketplace from "../students/MarketPlace";
import MyCourses from "../students/StudentCourses";

export default function StudentPage() {
  const [marketPlace, setmarketPlace] = useState<boolean>(true);

  return (
    <div className="w-full min-h-screen pb-10">
      <section className="flex flex-col gap-4 sm:gap-6 max-w-7xl mx-auto">
        {/* Header */}
        {marketPlace && (
          <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl">
            Explore All Courses
          </h3>
        )}

        {/* Buttons - Responsive */}
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <button
            onClick={() => setmarketPlace(true)}
            type="button"
            className={
              marketPlace
                ? `bg-orange-300 hover:border hover:border-orange-300 text-white hover:text-orange-300 hover:bg-transparent px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all duration-150 cursor-pointer active:scale-95  flex-1 sm:flex-initial min-w-[120px] `
                : "bg-gray-400 hover:border hover:border-orange-300 text-white hover:text-orange-300 hover:bg-transparent px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all duration-150 cursor-pointer active:scale-95 flex-1 sm:flex-initial min-w-[120px]"
            }
          >
            Marketplace
          </button>
          <button
            onClick={() => setmarketPlace(false)}
            type="button"
            className={
              marketPlace
                ? `bg-gray-400 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all duration-150 cursor-pointer active:scale-95 hover:border hover:border-orange-300 text-white hover:text-orange-300 hover:bg-transparent  flex-1 sm:flex-initial min-w-[120px]`
                : "bg-orange-300 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-semibold transition-all duration-150 cursor-pointer active:scale-95 rounded-lg hover:border hover:border-orange-300 text-white hover:text-orange-300 hover:bg-transparent  flex-1 sm:flex-initial min-w-[120px]"
            }
          >
            My Courses
          </button>
        </div>

        {/* Courses Content - Responsive */}

        {marketPlace ? <Marketplace /> : <MyCourses />}
      </section>
    </div>
  );
}
