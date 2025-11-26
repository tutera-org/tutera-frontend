"use client";
import { useRouter } from "next/navigation";
import StudentButton from "@/components/students/Button";
import CourseCurriculum from "@/components/students/CourseCurriculum";
import Image from "next/image";
import { use, useCallback, useEffect, useState } from "react";
import TuteraLoading from "@/components/Reuse/Loader";
import { toast } from "sonner";
import { api } from "@/lib/axiosClientInstance";

// TypeScript Interfaces
export interface Lesson {
  _id: string;
  tenantId: string;
  moduleId: string;
  title: string;
  description: string;
  type: "VIDEO" | "ARTICLE" | "QUIZ";
  order: number;
  contentId: string | null;
  duration: number;
  isPreview: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Quiz {
  _id: string;
  // Add quiz properties if available
}

export interface Module {
  _id: string;
  tenantId: string;
  courseId: string;
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lessons: Lesson[];
  quiz?: Quiz;
}

interface CourseEnrollmentData {
  _id: string;
  tenantId: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  price: number;
  status: string;
  isActive: boolean;
  averageRating: number;
  rating: number | null;
  totalEnrollments: number;
  enrolledAt: string;
  modules: Module[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CourseEnrollmentResponse {
  message: string;
  data: CourseEnrollmentData;
}

export default function BuyCourseId({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseEnrollmentData | null>(null);

  // Fetch courses
  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await api.get<CourseEnrollmentResponse>(
        `/v1/studentCourseDetails/${id}`
      );
      console.log("Course Data:", response.data);
      setCourse(response.data.data);
    } catch (error: unknown) {
      console.error("Full Error:", error);
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Fetching Course failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <TuteraLoading />;
  }

  // Handle case where course data is not available
  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg text-neutral-600 mb-4">Course not found</p>
          <StudentButton onClick={() => router.push("/dashboard/myCourses")}>
            Back to My Courses
          </StudentButton>
        </div>
      </div>
    );
  }

  // Helper function to get image URL (adjust based on your setup)
  const getImageUrl = (imageId: string) => {
    // Update this logic based on how your images are served
    // Example: return `${process.env.NEXT_PUBLIC_API_URL}/images/${imageId}`;
    return imageId ? `/api/images/${imageId}` : "/marketPlace.svg";
  };

  // Calculate total lessons
  const totalLessons = course.modules.reduce(
    (acc, module) => acc + (module.lessons?.length || 0),
    0
  );

  return (
    <section className="mt-6 sm:mt-8 lg:mt-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-4">
        <aside className="font-semibold w-full lg:basis-[50%] text-neutral-900">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {course.title}
          </h3>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mt-3 sm:mt-4">
            {course.description}
          </p>

          {/* Course metadata */}
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            {course.averageRating > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm font-medium">
                  {course.averageRating.toFixed(1)}
                </span>
              </div>
            )}
            {course.price > 0 && (
              <span className="text-sm font-semibold text-neutral-700">
                ₦{course.price.toLocaleString()}
              </span>
            )}
            {course.totalEnrollments > 0 && (
              <span className="text-sm text-neutral-600">
                {course.totalEnrollments}{" "}
                {course.totalEnrollments === 1 ? "student" : "students"}
              </span>
            )}
            {totalLessons > 0 && (
              <span className="text-sm text-neutral-600">
                {totalLessons} {totalLessons === 1 ? "lesson" : "lessons"}
              </span>
            )}
          </div>
        </aside>
        <aside className="w-full lg:basis-[45%]">
          <Image
            width={600}
            height={400}
            className="w-full h-auto rounded-lg object-cover"
            src={getImageUrl(course.coverImage)}
            alt={`${course.title} image`}
            priority
          />
        </aside>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mt-10 sm:mt-12 lg:mt-15">
        <div>
          <p className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-900">
            Learn at your own pace with structured modules and lessons
          </p>
          <p className="text-sm text-neutral-600 mt-2">
            Enrolled on{" "}
            {new Date(course.enrolledAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <StudentButton
          className="w-full sm:w-auto"
          onClick={() => router.push(`/dashboard/myCourses/${id}/lesson`)}
        >
          Start Lesson
        </StudentButton>
      </div>

      {/* Course Curriculum Section */}
      {course.modules && course.modules.length > 0 && (
        <div className="mt-10 sm:mt-12 lg:mt-16">
          <h4 className="text-xl sm:text-2xl font-semibold text-neutral-900 mb-6">
            Course Curriculum
          </h4>
          <CourseCurriculum sections={course.modules} />
        </div>
      )}
    </section>
  );
}
