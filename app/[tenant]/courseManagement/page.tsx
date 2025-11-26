"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCourse,
  Course,
} from "@/components/Course Management/CourseContext";
import EmptyState from "@/components/Course Management/EmptyState";
import BasicInfo from "@/components/Course Management/BasicInfo";
import Content from "@/components/Course Management/Content";
import SetUp from "@/components/Course Management/SetUp";
import CourseCard from "@/components/Course Management/CourseCard";
import ProgressStepper from "@/components/Course Management/ProgressStepper";
import Button from "@/components/Reuse/Button";

export default function CourseManagementPage() {
  const router = useRouter();
  const {
    courses,
    currentStep,
    setCurrentStep,
    deleteCourse,
    updateCurrentCourse,
    currentCourse,
    showPreview,
    setShowPreview,
    showQuiz,
    updateCourseStatus,
    resetCurrentCourse,
  } = useCourse();
  const [viewingDrafts, setViewingDrafts] = useState(false);

  const handleCreateModule = () => {
    // Reset current course completely to start fresh
    resetCurrentCourse();
    // Initialize with empty values for new course
    updateCurrentCourse({
      title: "",
      description: "",
      thumbnail: "",
      thumbnailMediaId: undefined, // Clear mediaId to prevent loading previous course's image
    });
    setCurrentStep(1);
  };

  const handleEditCourse = (course: Course) => {
    // Load the full course data into currentCourse for editing
    // This will trigger all form components to reload with the course data
    updateCurrentCourse({ ...course });
    setCurrentStep(1);
  };

  const handleDeleteCourse = async (courseId: string) => {
    // Delete is handled by CourseCard with custom modal
    await deleteCourse(courseId);
  };

  const handleTogglePublish = (course: Course) => {
    const newStatus = course.status === "published" ? "draft" : "published";
    updateCourseStatus(course.id, newStatus);
  };

  // Show empty state if no courses and not in creation flow
  if (courses.length === 0 && currentStep === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className=" mx-auto">
          <div className="mb-6"></div>
          <h1 className="text-3xl font-bold text-[#101A33] mb-8">
            Course Management
          </h1>
          <EmptyState onCreateModule={handleCreateModule} />
        </div>
      </div>
    );
  }

  // Show course creation steps
  if (currentStep > 0) {
    return (
      <div className="min-h-screen pb-6">
        <div>
          <div className="mb-6 mt-8"></div>

          {currentStep === 2 && !showPreview && !showQuiz && (
            <div className="flex justify-end md:hidden mb-4 ">
              <Button
                variant="primary"
                onClick={() => setShowPreview(true)}
                className="px-2 py-2  text-[0.7rem]"
              >
                Preview
              </Button>
            </div>
          )}

          {!showPreview && !showQuiz && (
            <>
              <div className="flex flex-col-reverse md:flex-row justify-between items-start md:mb-5 mb-2  mx-auto">
                <h1 className="text-[1rem] md:text-[2rem] font-semibold text-[#101A33] ">
                  {currentStep === 2 && currentCourse?.title
                    ? currentCourse.title
                    : "Fill in the details to create an engaging course for your students"}
                </h1>
                {currentStep === 2 && !showQuiz && !showPreview && (
                  <Button
                    variant="primary"
                    onClick={() => setShowPreview(true)}
                    className="px-6 py-2 md:block hidden "
                  >
                    Preview
                  </Button>
                )}
              </div>
              <Button
                variant="secondary"
                onClick={() => setCurrentStep(0)}
                className=" border-none bg-transparent text-black font-semibold md:text-[1.25rem] text-[1rem] mb-4 hover:text-primary-400 focus:text-primary-400 hover:border-none hover:bg-transparent"
              >
                &lt; Back
              </Button>
              <ProgressStepper currentStep={currentStep} />
            </>
          )}
          {currentStep === 1 && <BasicInfo />}
          {currentStep === 2 && <Content />}
          {currentStep === 3 && <SetUp />}
        </div>
      </div>
    );
  }

  // Filter drafts if viewing drafts - only show courses explicitly marked as "draft"
  const draftCourses = courses.filter((course) => course.status === "draft");
  const displayedCourses = viewingDrafts ? draftCourses : courses;

  // Show course list or draft view
  return (
    <div className="min-h-screen py-8">
      <div>
        <div className="flex flex-col md:flex-row justify-between md:items-center  mt-6 mb-12">
          <h1 className="text-[1.5rem] md:text-[2.5rem] font-bold text-[#101A33] mb-6 ">
            {viewingDrafts ? "Draft Courses" : "Course Management"}
          </h1>
          {!viewingDrafts && (
            <div className="flex justify-between md:gap-4 text-[0.95rem]">
              <Button
                variant="secondary"
                onClick={() => router.push("/courseManagement/analytics")}
                className="px-9 md:px-8 md:py-4 py-3 bg-white"
              >
                View Analytics
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateModule}
                className="px-9 md:px-8 md:py-4 py-3"
              >
                Create Course
              </Button>
            </div>
          )}
        </div>

        {viewingDrafts && (
          <div className="mb-6">
            <Button
              variant="secondary"
              onClick={() => setViewingDrafts(false)}
              className="px-4 py-2"
            >
              ← Back to All Courses
            </Button>
          </div>
        )}

        {viewingDrafts && draftCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-dashed border-gray-400 rounded-full"></div>
              <div className="relative z-10">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-600"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <path d="M8 7h8" />
                  <path d="M8 11h8" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#101A33]">
              No draft found
            </h2>
            <p className="text-gray-500 text-center max-w-md">
              You don&apos;t have any draft courses at the moment
            </p>
            <Button
              variant="primary"
              onClick={() => setViewingDrafts(false)}
              className="px-6 py-3 rounded-lg text-base font-semibold"
            >
              Back to Course List
            </Button>
          </div>
        ) : (
          <div className="w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
                onTogglePublish={handleTogglePublish}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
