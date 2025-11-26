"use client";

import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import StudentButton from "@/components/students/Button";
import { use, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axiosClientInstance";
import TuteraLoading from "@/components/Reuse/Loader";

// TypeScript interfaces
interface ContentId {
  _id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  url?: string;
}

interface Lesson {
  _id: string;
  title: string;
  description: string;
  contentId: ContentId;
  duration: number;
  isCompleted: boolean;
  isPreview: boolean;
  order: number;
  type: string;
}

interface Quiz {
  _id: string;
  moduleId: string;
  questions: Array<{
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
    _id: string;
  }>;
  isPublished: boolean;
  attempt: any;
}

interface Module {
  _id: string;
  title: string;
  courseId: string;
  order: number;
  lessons: Lesson[];
  quiz: Quiz;
}

interface CourseData {
  _id: string;
  title: string;
  description: string;
  slug: string;
  coverImage: string;
  modules: Module[];
  enrolledAt: string;
  status: string;
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);

  // Fetch courses
  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await api.get(`/v1/studentCourseDetails/${id}`);
      console.log("Course Data:", response.data);
      const data = response.data.data;
      setCourseData(data);

      // Set the first incomplete lesson as current, or the first lesson if all complete
      const firstIncompleteLesson = data.modules
        .flatMap((module: Module) => module.lessons)
        .find((lesson: Lesson) => !lesson.isCompleted);

      if (firstIncompleteLesson) {
        setCurrentLessonId(firstIncompleteLesson._id);
      } else if (
        data.modules.length > 0 &&
        data.modules[0].lessons.length > 0
      ) {
        setCurrentLessonId(data.modules[0].lessons[0]._id);
      }
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

  if (!courseData) {
    return (
      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-neutral-900">Course not found</p>
      </div>
    );
  }

  // Calculate progress
  const totalLessons = courseData.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );
  const completedLessons = courseData.modules.reduce(
    (acc, module) =>
      acc + module.lessons.filter((lesson) => lesson.isCompleted).length,
    0
  );
  const progress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Find current lesson
  const currentLesson = courseData.modules
    .flatMap((module) => module.lessons)
    .find((lesson) => lesson._id === currentLessonId);

  // Get video URL - using contentId._id to fetch from S3
  const videoContentId = currentLesson?.contentId?._id;

  return (
    <div className="mt-6 sm:mt-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="text-neutral-900 hover:text-orange-300 font-bold text-[16px] md:text-[20px] mb-6 transition-colors flex items-center gap-2"
      >
        <span className="text-[16px] md:text-[20px]">←</span> Back
      </button>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-14">
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Course Title and Lesson Info */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-[2.5rem] font-bold text-[#101A33] mb-2">
              {courseData.title}
            </h1>
            {currentLesson && (
              <p className="text-base font-semibold text-[#101A33]">
                {currentLesson.order} {currentLesson.title}
              </p>
            )}
          </div>

          {/* Video Player */}
          <div className="mb-6">
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
              {currentLesson && videoContentId ? (
                <video
                  key={videoContentId}
                  src={`/api/v1/content/${videoContentId}`}
                  controls
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  No video available
                </div>
              )}
            </div>
          </div>

          {/* Course Description */}
          <div className="p-6">
            <p className="text-base md:text-[20px] text-[#101A33] font-semibold leading-relaxed">
              {courseData.description}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 xl:w-96 shrink-0">
          <div className="sticky top-6">
            {/* Course Curriculum */}
            <div className="mb-6">
              {courseData.modules.map((module) => (
                <div key={module._id} className="mb-6">
                  <h3 className="text-[24px] font-semibold text-neutral-900 mb-4">
                    {module.title}:
                  </h3>
                  <div className="space-y-2">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson._id}
                        onClick={() => setCurrentLessonId(lesson._id)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                          lesson._id === currentLessonId && lesson.isCompleted
                            ? "bg-[#F6F6F6]"
                            : lesson._id === currentLessonId
                            ? "bg-orange-100 border border-orange-300"
                            : lesson.isCompleted
                            ? "bg-orange-50 border border-orange-200"
                            : "bg-[#E6EAF5]"
                        }`}
                      >
                        <div
                          className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                            lesson.isCompleted
                              ? "bg-orange-300"
                              : "bg-[rgba(133,32,9,1)]"
                          }`}
                        >
                          {lesson.isCompleted ? (
                            <FaCheck className="text-xs" />
                          ) : (
                            lesson.order
                          )}
                        </div>
                        <span
                          className={`text-[16px] flex-1 ${
                            lesson._id === currentLessonId
                              ? "font-semibold text-[#101A33]"
                              : "font-medium text-neutral-900"
                          }`}
                        >
                          {lesson.title}
                        </span>
                      </div>
                    ))}
                    {/* Take Quiz Button */}
                    {module.quiz && module.quiz.isPublished && (
                      <StudentButton
                        className={"w-full mt-4 disabled:bg-gray-500"}
                        onClick={() =>
                          router.push(
                            `/dashboard/myCourses/${courseData._id}/quiz`
                          )
                        }
                        disabled={
                          !module.lessons.every((lesson) => lesson.isCompleted)
                        }
                      >
                        Take Quiz
                      </StudentButton>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Course Progress */}
            <div className="pb-18 bg-[#E6EAF5] p-6 rounded-lg">
              <div className="flex items-center justify-between mb-10">
                <span className="text-sm font-semibold text-neutral-900">
                  Course Progress
                </span>
              </div>
              <div className="relative w-full bg-neutral-200 rounded-full h-3 mb-8">
                <div
                  className="bg-orange-300 h-3 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
                <span className="absolute -top-7 right-0 text-sm font-semibold text-[#101A33]">
                  {progress}%
                </span>
              </div>

              {/* Mark Course as Completed Button */}
              <StudentButton
                variant="secondary"
                className="w-full text-[1rem] font-semibold"
                disabled={progress < 100}
              >
                Mark Course as Completed
              </StudentButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
