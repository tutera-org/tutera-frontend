"use client";

import { useCourse } from "@/components/Course Management/CourseContext";
import CourseAnalytics from "@/components/Course Management/CourseAnalytics";

export default function CourseAnalyticsPage() {
  const { courses } = useCourse();

  return (
    <div className="min-h-screen bg-[#F0F4FF] py-8">
      <div className="w-[99%]  mx-auto">
        <CourseAnalytics courses={courses} />
      </div>
    </div>
  );
}
