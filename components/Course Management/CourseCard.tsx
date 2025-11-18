"use client";

import Image from "next/image";
import Button from "../Reuse/Button";
import { Course } from "./CourseContext";

interface CourseCardProps {
  course: Course;
  onView: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

export default function CourseCard({
  course,
  onView,
  onDelete,
}: CourseCardProps) {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={i < fullStars ? "#FBBF24" : "none"}
            stroke="#FBBF24"
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-400"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-[#101A33] mb-2">
          {course.title}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          {renderStars(4.8)}
          <span className="text-sm text-gray-600">4.8 (2,450)</span>
        </div>

        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>90,230 students</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            {course.isPaid ? "Paid" : "Free"} Course
          </span>
          {course.isPaid && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#101A33]">
                ₦{course.price.toLocaleString()}
              </span>
              {course.price < 20000 && (
                <span className="text-sm text-gray-400 line-through">
                  ₦20,000
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => onDelete(course.id)}
            className="flex-1"
          >
            Delete
          </Button>
          <Button
            variant="primary"
            onClick={() => onView(course)}
            className="flex-1"
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
