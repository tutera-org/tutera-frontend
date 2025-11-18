"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "../Reuse/Button";
import { Course } from "./CourseContext";
import CourseDeleteModal from "./CourseDeleteModal";

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  onTogglePublish: (course: Course) => void;
}

export default function CourseCard({
  course,
  onEdit,
  onDelete,
  onTogglePublish,
}: CourseCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="bg-white rounded-[16px] shadow-md overflow-hidden hover:shadow-lg transition-shadow relative pb-6">
        {/* Course Image */}
        <div className="relative h-50 w-full">
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

        {/* Course Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2 relative">
            <h3 className="font-bold text-[1.25rem] text-[#101A33] line-clamp-1 flex-1">
              {course.title}
            </h3>
            <div className="relative shrink-0">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Options"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-600"
                >
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 w-24 bg-white shadow-sm rounded-lg  border border-gray-200 py-2 z-20">
                  <button
                    onClick={() => {
                      setShowDeleteModal(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-center px-3 text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-[0.75rem] text-[#101A33] mb-4 line-clamp-4 w-[90%] text-start">
            {course.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-[1.25rem] font-semibold text-[#101A33]">
              {course.isPaid ? `₦${course.price.toLocaleString()}` : "Free"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-8">
            <Button
              variant="primary"
              onClick={() => onEdit(course)}
              className="flex-1 text-base py-3"
            >
              Edit
            </Button>
            <Button
              variant={course.status === "published" ? "secondary" : "primary"}
              onClick={() => onTogglePublish(course)}
              className="flex-1 text-base py-3"
            >
              {course.status === "published" ? "Unpublish" : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <CourseDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setShowMenu(false);
        }}
        onConfirm={() => {
          // Delete the course - this will remove it from the courses array
          console.log("CourseCard onConfirm called, course.id:", course.id);
          onDelete(course.id);
          setShowDeleteModal(false);
          setShowMenu(false);
        }}
        courseTitle={course.title}
      />

      {/* Click outside to close menu */}
      {showMenu && !showDeleteModal && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
}
