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
          <StudentButton
            onClick={() => setmarketPlace(true)}
            type="button"
            className="flex-1 sm:flex-initial min-w-[120px]"
          >
            Marketplace
          </StudentButton>
          <StudentButton
            onClick={() => setmarketPlace(false)}
            variant="secondary"
            type="button"
            className="flex-1 sm:flex-initial min-w-[120px]"
          >
            My Courses
          </StudentButton>
        </div>

        {/* Courses Content - Responsive */}

        {marketPlace ? <Marketplace /> : <MyCourses />}
      </section>
    </div>
  );
}
