"use client";
// Client-side component for displaying populated student dashboard with courses and calendar reminders
import { useState } from "react";
import MediaImage from "@/components/Reuse/MediaImage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EnrolledCourse } from "./StudentCourses";

// Interface for component props
interface PopulatedStudentPageProps {
  data: EnrolledCourse[];
}

// Main component for student dashboard displaying courses and reminder calendar
export default function PopulatedStudentPage({
  data,
}: PopulatedStudentPageProps) {
  const router = useRouter();
  // State for tracking selected dates on calendar
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  // State for current month view in calendar
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  // State for course name input in reminder form
  const [courseName, setCourseName] = useState<string>("");

  // Separate courses into "Continue Learning" (not completed) and "Completed" based on progress
  const continueLearningCourses = data.filter(
    (course) => course.progress.percent < 100
  );
  const completedCourses = data.filter(
    (course) => course.progress.percent === 100
  );

  // Helper function to check if a date is in the past
  const isDateInPast = (day: number): boolean => {
    const today = new Date();
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    // Set both dates to midnight for accurate comparison
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate < today;
  };

  // Helper function to check if month/year is in the past
  const isMonthInPast = (): boolean => {
    const today = new Date();
    const currentYear = currentMonth.getFullYear();
    const currentMonthNum = currentMonth.getMonth();

    return (
      currentYear < today.getFullYear() ||
      (currentYear === today.getFullYear() &&
        currentMonthNum < today.getMonth())
    );
  };

  // Helper function to validate if course title exists in enrolled courses
  const isValidCourseTitle = (title: string): boolean => {
    return data.some(
      (course) => course.title.toLowerCase() === title.toLowerCase()
    );
  };

  // Helper function to calculate the first day of month and total days in month
  const getDaysInMonth = (
    date: Date
  ): { firstDay: number; daysInMonth: number } => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  // Get current month's day information
  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

  // Array of month names for calendar display
  const monthNames: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Navigate to previous month in calendar (prevent going to past months)
  const prevMonth = (): void => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1
    );
    const today = new Date();

    // Don't allow navigation to months before current month
    if (
      newMonth.getFullYear() < today.getFullYear() ||
      (newMonth.getFullYear() === today.getFullYear() &&
        newMonth.getMonth() < today.getMonth())
    ) {
      toast.warning("Cannot select dates in the past");
      return;
    }

    setCurrentMonth(newMonth);
  };

  // Navigate to next month in calendar
  const nextMonth = (): void => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  // Toggle date selection - add or remove date from selectedDates array
  const toggleDate = (day: number): void => {
    if (isDateInPast(day)) {
      toast.warning("Cannot select dates in the past");
      return;
    }

    setSelectedDates((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Handle setting reminder for selected course and dates
  const handleSetDate = (): void => {
    if (!courseName.trim()) {
      toast.error("Please enter a course name");
      return;
    }

    if (!isValidCourseTitle(courseName.trim())) {
      toast.error(
        "Please enter a valid course title from your enrolled courses"
      );
      return;
    }

    if (selectedDates.length === 0) {
      toast.error("Please select at least one date");
      return;
    }

    console.log(
      "Setting reminder for:",
      courseName,
      "on dates:",
      selectedDates
    );
    toast.success("Reminder set successfully!");
    handleCancel();
  };

  // Reset form fields to initial state
  const handleCancel = (): void => {
    setCourseName("");
    setSelectedDates([]);
  };

  return (
    <div className="min-h-screen">
      {/* Main layout: Main content and sidebar - reverse on mobile, flex on desktop */}
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-8">
        {/* Main Content - courses section */}
        <div className="flex-1">
          {/* Continue Learning Section - courses in progress */}
          {continueLearningCourses.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Continue Learning
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {continueLearningCourses.map((course) => (
                  <div
                    key={course.courseId}
                    className="rounded-2xl bg-white shadow-sm overflow-hidden"
                  >
                    {/* Course thumbnail/background image  */}
                    <div className="relative h-48 bg-linear-to-br from-blue-900 to-purple-900 flex items-center justify-center overflow-hidden">
                      {course.coverImage && (
                        <MediaImage
                          mediaId={course.coverImage}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Course content section with title, description, and actions */}
                    <div className="p-4 sm:p-5">
                      <h3 className="font-bold text-base xs:text-lg sm:text-xl md:text-2xl text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-xs xs:text-sm md:text-base mb-4 line-clamp-1">
                        {course.description}
                      </p>

                      {/* Lesson progress indicator with icon */}
                      <div className="flex items-center gap-2 mb-4 text-gray-700">
                        <svg
                          className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        <span className="text-xs xs:text-sm md:text-base">
                          {course.progress.completedLessons}/
                          {course.progress.totalLessons} lessons
                        </span>
                      </div>

                      {/* Action section: Continue button and progress percentage circle */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/myCourses/${course.courseId}`
                            )
                          }
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-xs xs:text-sm sm:text-base"
                        >
                          Continue Learning
                        </button>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-gray-200 flex items-center justify-center font-bold text-gray-700 text-xs xs:text-sm sm:text-base">
                          {course.progress.percent}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Completed Courses Section - courses fully finished by student */}
          {completedCourses.length > 0 && (
            <section>
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Completed Courses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedCourses.map((course) => (
                  <div
                    key={course.courseId}
                    className="rounded-2xl bg-white shadow-sm overflow-hidden"
                  >
                    {/* Course thumbnail/background image */}
                    <div className="relative h-48 bg-linear-to-br from-purple-900 to-blue-900 flex items-center justify-center overflow-hidden">
                      {course.coverImage && (
                        <MediaImage
                          mediaId={course.coverImage}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Course content section with title, description, and actions */}
                    <div className="p-4 sm:p-5">
                      <h3 className="font-bold text-base xs:text-lg sm:text-xl md:text-2xl text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-xs xs:text-sm md:text-base mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Lesson count indicator with icon */}
                      <div className="flex items-center gap-2 mb-4 text-gray-700">
                        <svg
                          className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        <span className="text-xs xs:text-sm md:text-base">
                          {course.progress.totalLessons} lessons
                        </span>
                      </div>

                      {/* Action section: Certificate request button and completion percentage */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            toast.success("Creator notified of your request")
                          }
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-xs xs:text-sm sm:text-base"
                        >
                          Request Certificate
                        </button>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-gray-900 flex items-center justify-center font-bold text-gray-900 text-xs xs:text-sm sm:text-base">
                          {course.progress.percent}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Show message if no courses at all */}
          {continueLearningCourses.length === 0 &&
            completedCourses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No courses found. Start learning today!
                </p>
              </div>
            )}
        </div>

        {/* Calendar Sidebar - reminder/date setting panel */}
        <aside className="lg:w-96">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 sticky top-6">
            {/* Sidebar title */}
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Set Reminder
            </h2>

            {/* Course name input field with helper text */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Enter Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full px-4 py-2 sm:py-3 bg-gray-100 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs xs:text-sm md:text-base"
              />
              <p className="text-xs text-gray-500 mt-1 px-1">
                Enter exact course title from your enrolled courses
              </p>
            </div>

            {/* Calendar widget for selecting reminder dates */}
            <div className="mb-6">
              {/* Month navigation controls */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  disabled={isMonthInPast()}
                  className={`p-2 rounded-lg transition-colors ${
                    isMonthInPast()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                  aria-label="Previous month"
                >
                  <svg
                    className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                {/* Current month and year display */}
                <h3 className="font-semibold text-gray-900 text-xs xs:text-sm sm:text-base md:text-lg">
                  {monthNames[currentMonth.getMonth()]}{" "}
                  {currentMonth.getFullYear()}
                </h3>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Next month"
                >
                  <svg
                    className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Weekday header row */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs xs:text-sm font-medium text-gray-600 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid with selectable dates */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {/* Date buttons for all days in month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isSelected = selectedDates.includes(day);
                  const isPast = isDateInPast(day);

                  return (
                    <button
                      key={day}
                      onClick={() => toggleDate(day)}
                      disabled={isPast}
                      className={`aspect-square rounded-lg flex items-center justify-center text-xs xs:text-sm font-medium transition-colors ${
                        isPast
                          ? "text-gray-300 cursor-not-allowed"
                          : isSelected
                          ? "bg-gray-900 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                      aria-label={`Select ${day}`}
                      aria-pressed={isSelected}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action buttons for form submission and cancellation */}
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-2 sm:py-3 px-4 sm:px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors text-xs xs:text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSetDate}
                className="flex-1 py-2 sm:py-3 px-4 sm:px-6 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-xs xs:text-sm md:text-base"
              >
                <svg
                  className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Set date
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
