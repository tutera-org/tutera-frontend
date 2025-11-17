// Client-side component for displaying populated student dashboard with courses and calendar reminders
"use client";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Interface for lesson progress tracking (completed vs total lessons)
interface Lesson {
  completed: number;
  total: number;
}

// Base course interface with essential course information
interface Course {
  id: number;
  title: string;
  img: string;
  desc: string;
  percentage: number;
  lessons: Lesson | number;
  bgColor: string;
}

// Interface for courses still in progress (has lesson progress details)
interface ContinueLearningCourse extends Omit<Course, "lessons"> {
  lessons: Lesson;
}

// Interface for completed courses (lessons is just a count)
interface CompletedCourse extends Omit<Course, "lessons"> {
  lessons: number;
}

// Main component for student dashboard displaying courses and reminder calendar
export default function PopulatedStudentPage() {
  const router = useRouter();
  // State for tracking selected dates on calendar
  const [selectedDates, setSelectedDates] = useState<number[]>([6, 15]);
  // State for current month view in calendar
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 5)); // June 2025
  // State for course name input in reminder form
  const [courseName, setCourseName] = useState<string>("");

  // Sample data for courses still in progress
  const continueLearningCourses: ContinueLearningCourse[] = [
    {
      id: 1,
      title: "Machine Learning Master Class",
      img: "/marketPlace.svg",
      desc: "intelligence demonstrated by machines.",
      percentage: 40,
      lessons: { completed: 3, total: 5 },
      bgColor: "bg-blue-900",
    },
    {
      id: 2,
      title: "Read about how Marketing Works",
      img: "/marketPlace.svg",
      desc: "Best Solution and grow your business easier than ever",
      percentage: 80,
      lessons: { completed: 5, total: 5 },
      bgColor: "bg-gradient-to-br from-purple-400 to-purple-600",
    },
  ];

  // Sample data for fully completed courses
  const completedCourses: CompletedCourse[] = [
    {
      id: 3,
      title: "Front-End Fundamentals",
      img: "/marketPlace.svg",
      desc: "Explore the fundamental concepts that power every great website and web app",
      percentage: 100,
      lessons: 5,
      bgColor: "bg-gradient-to-br from-purple-900 to-blue-900",
    },
    {
      id: 4,
      title: "Product Design",
      img: "/marketPlace.svg",
      desc: "Read and Learn how to design digital products that solve real user problems",
      percentage: 100,
      lessons: 5,
      bgColor: "bg-gradient-to-br from-blue-400 to-cyan-300",
    },
  ];

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

  // Navigate to previous month in calendar
  const prevMonth = (): void => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  // Navigate to next month in calendar
  const nextMonth = (): void => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  // Toggle date selection - add or remove date from selectedDates array
  const toggleDate = (day: number): void => {
    setSelectedDates((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Handle setting reminder for selected course and dates
  const handleSetDate = (): void => {
    console.log(
      "Setting reminder for:",
      courseName,
      "on dates:",
      selectedDates
    );
    //TODO: Add  date setting logic
    toast.warning(
      "If you never buy like 100 courses, no press this button again"
    );
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
          <section className="mb-12">
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Continue Learning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {continueLearningCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-2xl bg-white shadow-sm overflow-hidden"
                >
                  {/* Course thumbnail/background image */}
                  <div
                    className={`relative h-48 ${course.bgColor} flex items-center justify-center`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={course.img}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Course content section with title, description, and actions */}
                  <div className="p-4 sm:p-5">
                    <h3 className="font-bold text-base xs:text-lg sm:text-xl md:text-2xl text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-xs xs:text-sm md:text-base mb-4">
                      {course.desc}
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
                        {course.lessons.completed}/{course.lessons.total}{" "}
                        lessons
                      </span>
                    </div>

                    {/* Action section: Continue button and progress percentage circle */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/myCourses/${course.id}`)
                        }
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-xs xs:text-sm sm:text-base"
                      >
                        Continue Learning
                      </button>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-gray-200 flex items-center justify-center font-bold text-gray-700 text-xs xs:text-sm sm:text-base">
                        {course.percentage}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Completed Courses Section - courses fully finished by student */}
          <section>
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Completed Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-2xl bg-white shadow-sm overflow-hidden"
                >
                  {/* Course thumbnail/background image */}
                  <div
                    className={`relative h-48 ${course.bgColor} flex items-center justify-center`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={course.img}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Course content section with title, description, and actions */}
                  <div className="p-4 sm:p-5">
                    <h3 className="font-bold text-base xs:text-lg sm:text-xl md:text-2xl text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-xs xs:text-sm md:text-base mb-4">
                      {course.desc}
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
                        {course.lessons} lessons
                      </span>
                    </div>

                    {/* Action section: Certificate request button and completion percentage */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          toast.warning("Creator Notified on your request")
                        }
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-xs xs:text-sm sm:text-base"
                      >
                        Request Certificate
                      </button>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-gray-900 flex items-center justify-center font-bold text-gray-900 text-xs xs:text-sm sm:text-base">
                        {course.percentage}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Calendar Sidebar - reminder/date setting panel */}
        <aside className="lg:w-96">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 sticky top-6">
            {/* Sidebar title */}
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Set Reminder
            </h2>

            {/* Course name input field */}
            <input
              type="text"
              placeholder="Enter Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 bg-gray-100 rounded-lg mb-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs xs:text-sm md:text-base"
            />

            {/* Calendar widget for selecting reminder dates */}
            <div className="mb-6">
              {/* Month navigation controls */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                  return (
                    <button
                      key={day}
                      onClick={() => toggleDate(day)}
                      className={`aspect-square rounded-lg flex items-center justify-center text-xs xs:text-sm font-medium transition-colors ${
                        isSelected
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
