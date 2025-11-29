"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/axiosClientInstance";
import TuteraLoading from "../Reuse/Loader";

// API Response Interfaces
interface IStudentAnalytics {
  studentId: string;
  studentName: string;
  quizScore: number;
  progress: number;
  status: "COMPLETED" | "NOT_COMPLETED";
}

interface ICourseAnalyticsResponse {
  courseId: string;
  courseTitle: string;
  totalStudents: number;
  averageQuizScore: number;
  completionRate: number;
  students: IStudentAnalytics[];
}

// Component Interfaces
interface Student {
  id: string;
  name: string;
  quizScore: number;
  progress: number;
  status: "COMPLETED" | "NOT_COMPLETED";
}

interface Course {
  id: string;
  title: string;
}

export default function CourseAnalytics() {
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<
    ICourseAnalyticsResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch analytics data
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/v1/analytics");

      // Access the triple-nested data: response.data.data.data
      const coursesData = Array.isArray(response.data.data?.data)
        ? response.data.data.data
        : [];

      setAnalyticsData(coursesData);

      // Set first course as selected by default
      if (coursesData.length > 0 && !selectedCourseId) {
        setSelectedCourseId(coursesData[0].courseId);
      }
    } catch (error: any) {
      console.error("Fetch error:", error);
      const message =
        error.response?.data?.error || "Fetching Course Analytics failed";
      toast.error(message);
      setAnalyticsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get courses list from analytics data
  const courses: Course[] = useMemo(() => {
    if (!Array.isArray(analyticsData)) {
      return [];
    }
    return analyticsData.map((data) => ({
      id: data.courseId,
      title: data.courseTitle,
    }));
  }, [analyticsData]);

  // Get selected course analytics
  const selectedCourseAnalytics = useMemo(() => {
    return analyticsData.find((data) => data.courseId === selectedCourseId);
  }, [analyticsData, selectedCourseId]);

  // Get selected course info
  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  // Transform API students to component format
  const allStudents: Student[] = useMemo(() => {
    if (
      !selectedCourseAnalytics ||
      !Array.isArray(selectedCourseAnalytics.students)
    ) {
      return [];
    }
    return selectedCourseAnalytics.students.map((student) => ({
      id: student.studentId,
      name: student.studentName,
      quizScore: student.quizScore,
      progress: student.progress,
      status: student.status,
    }));
  }, [selectedCourseAnalytics]);

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return allStudents;
    const query = searchQuery.toLowerCase();
    return allStudents.filter((student) =>
      student.name.toLowerCase().includes(query)
    );
  }, [allStudents, searchQuery]);

  const handleBack = () => {
    router.back();
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsDropdownOpen(false);
    setSearchQuery("");
  };

  // Loading state
  if (loading) {
    return <TuteraLoading />;
  }

  // No courses state
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h2 className="text-2xl font-bold text-[#101A33]">
          No courses available
        </h2>
        <p className="text-gray-500">Create a course to view analytics</p>
        <button
          onClick={handleBack}
          className="px-6 py-2 bg-[#4977E6] text-white rounded-lg hover:bg-[#3d66d4] transition-colors"
        >
          Back to Course Management
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="text-[#101A33] hover:text-[#3d66d4] mb-4 text-[1rem] md:text-[1.25rem] flex items-center gap-2 transition-colors"
        >
          &lt; Back
        </button>
        <h1 className="text-[1.5rem] md:text-[2.5rem] font-bold text-[#101A33] mb-6">
          Course Analytics
        </h1>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        {/* Course Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-[#4977E6] transition-colors min-w-[200px]"
          >
            <span className="flex-1 text-left">
              {selectedCourse?.title || "Select Course"}
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-sm z-20 min-w-[200px]">
                {courses.map((course, index) => (
                  <button
                    key={course.id}
                    onClick={() => handleCourseSelect(course.id)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                      selectedCourseId === course.id
                        ? "bg-[#4977E6] text-white hover:bg-[#3d66d4]"
                        : ""
                    } ${index === 0 ? "rounded-t-lg" : ""} ${
                      index === courses.length - 1 ? "rounded-b-lg" : ""
                    }`}
                  >
                    {course.title}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search Student"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6] bg-white"
          />
        </div>
      </div>

      {/* Analytics Table */}
      <div className="bg-white rounded-lg border border-[#E1E1E1] h-160 overflow-y-scroll">
        <div className="">
          <table className="w-full">
            <thead className="border-b border-[#EAECF0]">
              <tr>
                <th className="px-2 md:px-6 py-4 text-left md:text-sm text-[0.5rem] font-semibold text-[#5D5D5D]">
                  Student Name
                </th>
                <th className="px-1 md:px-6 py-4 text-left md:text-sm text-[0.5rem] font-semibold text-[#5D5D5D]">
                  Quiz Score
                </th>
                <th className="px-1 md:px-6 py-4 text-left md:text-sm text-[0.5rem] font-semibold text-[#5D5D5D]">
                  Progress
                </th>
                <th className="px-3 md:px-6 py-4 text-center md:text-sm text-[0.5rem] font-semibold text-[#5D5D5D]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECF0]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-2 md:px-6 py-8 text-start text-gray-500"
                  >
                    {allStudents.length === 0
                      ? "No students enrolled in this course"
                      : "No students found"}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-2 w-25 md:px-6 py-4 md:text-[1rem] text-[0.75rem] font-semibold md:font-bold text-[#101A33] md:w-[20%]">
                      {student.name}
                    </td>
                    <td className="px-1 w-15 md:px-6 py-4 text-[12px] md:text-[1rem] text-gray-600 font-semibold md:w-[15%]">
                      {student.quizScore}%
                    </td>
                    <td className="md:px-6 px-1 py-4 w-[28%] md:w-[50%]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#4977E6] h-2 rounded-full transition-all"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-[12px] md:text-[1rem] font-semibold text-gray-600">
                          {student.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 w-[25%] md:w-[25%] md:text-center">
                      <span
                        className={`text-[8px] md:text-[0.75rem] font-semibold ${
                          student.status === "COMPLETED"
                            ? "text-[#0EB137]"
                            : "text-red-600"
                        }`}
                      >
                        {student.status === "COMPLETED"
                          ? "Completed"
                          : "Not Completed"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats - Using API data */}
      {selectedCourseAnalytics && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-[#E1E1E1] p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Total Students
            </h3>
            <p className="text-[1.5rem] md:text-[2rem] font-bold text-[#101A33]">
              {selectedCourseAnalytics.totalStudents}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-[#E1E1E1] p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Average Quiz Score
            </h3>
            <p className="text-[1.5rem] md:text-[2rem] font-bold text-[#101A33]">
              {Math.round(selectedCourseAnalytics.averageQuizScore)}%
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-[#E1E1E1] p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Completion Rate
            </h3>
            <p className="text-[1.5rem] md:text-[2rem] font-bold text-[#101A33]">
              {Math.round(selectedCourseAnalytics.completionRate)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
