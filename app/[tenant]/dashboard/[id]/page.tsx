"use client";
import TuteraLoading from "@/components/Reuse/Loader";
import StudentButton from "@/components/students/Button";
import CourseCurriculum from "@/components/students/CourseCurriculum";
import { api } from "@/lib/axiosClientInstance";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

// Interfaces
interface CourseResponse {
  success: boolean;
  message: string;
  data: Course;
}

interface Course {
  _id: string;
  tenantId: string;
  title: string;
  description: string;
  coverImage: string;
  price: number;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  totalEnrollments: number;
  averageRating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
  modules: Module[];
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
  quiz: Quiz;
}

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

interface Quiz {
  _id: string;
  moduleId: string;
  tenantId: string;
  questions: Question[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Question {
  _id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export default function BuyCourseId({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course>();

  // Fetch courses
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get<CourseResponse>(
        `/v1/coursesDetails/${id}`
      );
      console.log("Course Data:", response.data.data);
      setCourse(response.data.data);
    } catch (error: any) {
      console.error("Full Error:", error);
      const message = error.response?.data?.error || "Fetching Course failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return <TuteraLoading />;
  }

  return (
    <section className="mt-6 sm:mt-8 lg:mt-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-4">
        <aside className="font-semibold w-full lg:basis-[50%] text-neutral-900">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {course?.title}
          </h3>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mt-3 sm:mt-4">
            {course?.description}
          </p>
        </aside>
        <aside className="w-full lg:basis-[45%]">
          {course?.coverImage && (
            // <Image
            //   width={600}
            //   height={400}
            //   className="w-full h-auto rounded-lg"
            //   src={course.coverImage}
            //   alt={`${course.title} image`}
            // />
            <div>Image not found</div>
          )}
        </aside>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mt-10 sm:mt-12 lg:mt-15">
        <p className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-900">
          Learn at your own pace with structured modules and lessons
        </p>
        <StudentButton
          onClick={async () => {
            try {
              if (!course?._id) return;
              const response = await api.post("/v1/enrollment", {
                courseId: course._id,
              });
              toast.success("Enrolled successfully!");
              console.log("Enrollment response:", response.data);
            } catch (error: any) {
              const message =
                error.response?.data?.error || "Enrollment failed";
              toast.error(message);
            }
          }}
          className="w-full sm:w-auto"
        >
          Enroll Now (${course?.price})
        </StudentButton>
      </div>

      {/* Course Curriculum Section */}
      <div className="mt-10 sm:mt-12 lg:mt-16">
        {course?.modules && <CourseCurriculum sections={course.modules} />}
      </div>
    </section>
  );
}
