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
    setShowPreview,
    showQuiz,
    updateCourseStatus,
  } = useCourse();
  const [viewingDrafts, setViewingDrafts] = useState(false);

  const handleCreateModule = () => {
    // Initialize current course and start at step 1
    updateCurrentCourse({
      title: "",
      description: "",
      thumbnail: "",
    });
    setCurrentStep(1);
  };

  const handleViewCourse = (course: Course) => {
    // Navigate to course view page (to be implemented)
    console.log("View course:", course);
  };

  const handleEditCourse = (course: Course) => {
    // Load the full course data into currentCourse for editing
    // This will trigger all form components to reload with the course data
    updateCurrentCourse({ ...course });
    setCurrentStep(1);
  };

  const handleDeleteCourse = (courseId: string) => {
    // Delete is handled by CourseCard with custom modal
    console.log("handleDeleteCourse called with courseId:", courseId);
    deleteCourse(courseId);
  };

  const handleTogglePublish = (course: Course) => {
    const newStatus = course.status === "published" ? "draft" : "published";
    updateCourseStatus(course.id, newStatus);
  };

  // Show empty state if no courses and not in creation flow
  if (courses.length === 0 && currentStep === 0) {
    return (
      <div className="min-h-screen bg-[#F0F4FF] py-8">
        <div className="w-[99%] mx-auto">
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
      <div className="min-h-screen bg-[#F0F4FF] py-6">
        <div className="w-[99%] mx-auto">
          <div className="mb-6 mt-8"></div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-15  mx-auto">
            <h1 className="text-3xl font-semibold text-[#101A33] text-center">
              {currentStep === 2 && currentCourse?.title
                ? currentCourse.title
                : "Fill in the details to create an engaging course for your students"}
            </h1>
            {currentStep === 2 && !showQuiz && (
              <Button
                variant="primary"
                onClick={() => setShowPreview(true)}
                className="px-6 py-2"
              >
                Preview
              </Button>
            )}
          </div>
          <ProgressStepper currentStep={currentStep} />
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
    <div className="min-h-screen bg-[#F0F4FF] py-8">
      <div className="w-[99%]  mx-auto">
        <div className="flex justify-between items-center mt-6 mb-12">
          <h1 className="text-[40px] font-bold text-[#101A33]">
            {viewingDrafts ? "Draft Courses" : "Course Management"}
          </h1>
          {!viewingDrafts && (
            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={() => router.push("/courseManagement/analytics")}
                className="px-4 py-2"
              >
                View Analytics
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateModule}
                className="px-4 py-2"
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
