"use client";
import { CiSearch } from "react-icons/ci";
import EmptyStudentPage from "./EmptyStudent";
import PopulatedStudentPage from "./PopulatedStudentPage";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axiosClientInstance";
import TuteraLoading from "../Reuse/Loader";

// Interface for the course data
export interface CourseProgress {
  completedLessons: number;
  percent: number;
  quizAttempts: any[];
  totalLessons: number;
}

export interface EnrolledCourse {
  courseId: string;
  coverImage: string;
  description: string;
  enrolledAt: string;
  progress: CourseProgress;
  rating: number | null;
  title: string;
}

interface ApiResponse {
  message: string;
  data: EnrolledCourse[];
}

export default function MyCourses() {
  const [data, setData] = useState<EnrolledCourse[]>([]);
  const [filteredData, setFilteredData] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasBoughtCourses, setHasBoughtCourses] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse>("/v1/studentsCourses");

      // Extract the data array from the response
      const coursesData = response.data.data;
      setData(coursesData);
      setFilteredData(coursesData);

      // Update hasBoughtCourses based on whether courses exist
      setHasBoughtCourses(coursesData && coursesData.length > 0);
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Fetching dashboard failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Filter courses by title when search query changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      // If search is empty, show all courses
      setFilteredData(data);
    } else {
      // Filter courses by title (case-insensitive)
      const filtered = data.filter((course) =>
        course.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <TuteraLoading />;
  }

  return (
    <>
      <div className="flex gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-white items-center rounded-lg shadow-sm border border-gray-200">
        <CiSearch className="text-xl sm:text-2xl text-gray-400 shrink-0" />
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full py-1 text-sm sm:text-base search placeholder:text-gray-400"
        />
      </div>

      <h3 className="font-bold text-neutral-900 text-xl sm:text-2xl md:text-3xl mt-4 sm:mt-6">
        My Courses
      </h3>

      {/* Show message if search returns no results */}
      {hasBoughtCourses && filteredData.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No courses found matching "{searchQuery}"
          </p>
        </div>
      )}

      {/* Show courses or empty page based on data */}
      {hasBoughtCourses && filteredData.length > 0 ? (
        <PopulatedStudentPage data={filteredData} />
      ) : (
        !searchQuery && <EmptyStudentPage />
      )}
    </>
  );
}
