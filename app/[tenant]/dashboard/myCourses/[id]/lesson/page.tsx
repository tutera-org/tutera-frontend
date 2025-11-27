"use client";

import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import StudentButton from "@/components/students/Button";
import MediaVideo from "@/components/Reuse/MediaVideo";
import MediaPdf from "@/components/Reuse/MediaPdf";
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
  contentId: ContentId | string | null; // Can be object, string, or null
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
  const [completingLesson, setCompletingLesson] = useState<string | null>(null);

  // Fetch courses
  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await api.get(`/v1/studentCourseDetails/${id}`);
      const data = response.data.data;
      console.log(data);

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

  // Mark lesson as completed
  const markLessonComplete = async (lessonId: string) => {
    try {
      setCompletingLesson(lessonId);
      await api.patch(`/v1/lessons/complete`, {
        lessonId,
        courseId: courseData?._id,
      });
      toast.success("Lesson marked as completed!");
      // Refresh data to get updated completion status
      await fetchData();
    } catch (error: unknown) {
      console.error("Error completing lesson:", error);
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed to mark lesson as completed";
      toast.error(message);
    } finally {
      setCompletingLesson(null);
    }
  };

  // Calculate progress (before conditional returns to avoid hook order issues)
  const totalLessons =
    courseData?.modules.reduce(
      (acc, module) => acc + module.lessons.length,
      0
    ) || 0;
  const completedLessons =
    courseData?.modules.reduce(
      (acc, module) =>
        acc + module.lessons.filter((lesson) => lesson.isCompleted).length,
      0
    ) || 0;
  const progress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Find current lesson
  const currentLesson = courseData?.modules
    .flatMap((module) => module.lessons)
    .find((lesson) => lesson._id === currentLessonId);

  // Find which module the current lesson belongs to
  const currentModule = courseData?.modules.find((module) =>
    module.lessons.some((lesson) => lesson._id === currentLessonId)
  );

  // Calculate the correct lesson number within the current module
  const currentLessonNumber =
    currentModule && currentLessonId
      ? currentModule.lessons.findIndex(
          (lesson) => lesson._id === currentLessonId
        ) + 1
      : 1;

  // Get media ID - handle both cases: contentId as object or string
  // contentId can be an object with _id or just a string (mediaId)
  const mediaId = currentLesson?.contentId
    ? typeof currentLesson.contentId === "string"
      ? currentLesson.contentId
      : currentLesson.contentId._id
    : null;

  // Determine media type from contentId
  const isPdf =
    currentLesson?.contentId && typeof currentLesson.contentId === "object"
      ? currentLesson.contentId.mimeType?.includes("pdf") ||
        currentLesson.contentId.fileName?.toLowerCase().endsWith(".pdf") ||
        currentLesson.contentId.originalName?.toLowerCase().endsWith(".pdf")
      : false;

  const isVideo =
    currentLesson?.contentId && typeof currentLesson.contentId === "object"
      ? currentLesson.contentId.mimeType?.includes("video") ||
        currentLesson.contentId.mimeType?.includes("audio")
      : true; // Default to video if we can't determine (for backward compatibility)

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
                {currentModule?.title} - Lesson {currentLessonNumber}:{" "}
                {currentLesson.title}
              </p>
            )}
          </div>

          {/* Media Player (Video or PDF) */}
          <div className="mb-6">
            {currentLesson && mediaId ? (
              isPdf ? (
                <div className="w-full rounded-lg overflow-hidden bg-gray-100">
                  <MediaPdf
                    mediaId={mediaId}
                    className="w-full rounded-lg"
                    height="600px"
                    title={currentLesson.title}
                  />
                </div>
              ) : (
                <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
                  <MediaVideo
                    mediaId={mediaId}
                    className="w-full h-full object-contain"
                    controls
                  />
                </div>
              )
            ) : (
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center text-white">
                No media available
              </div>
            )}
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
                    {module.lessons.map((lesson, index) => (
                      <div
                        key={lesson._id}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
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
                          onClick={() => setCurrentLessonId(lesson._id)}
                          className="flex items-center gap-3 flex-1 cursor-pointer"
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
                              index + 1
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
                        {!lesson.isCompleted && (
                          <button
                            onClick={() => markLessonComplete(lesson._id)}
                            disabled={completingLesson === lesson._id}
                            className="shrink-0 px-3 py-1 text-xs font-semibold bg-orange-300 hover:bg-orange-400 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {completingLesson === lesson._id
                              ? "..."
                              : "Complete"}
                          </button>
                        )}
                      </div>
                    ))}
                    {/* Take Quiz Button */}
                    {module.quiz && module.quiz.isPublished && (
                      <StudentButton
                        className={"w-full mt-4 disabled:bg-gray-500"}
                        onClick={() =>
                          router.push(
                            `/dashboard/myCourses/${courseData._id}/quiz/${module.quiz._id}`
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
            <div className="pb-6 bg-[#E6EAF5] p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-neutral-900">
                  Course Progress
                </span>
              </div>
              <div className="relative w-full bg-neutral-200 rounded-full h-3">
                <div
                  className="bg-orange-300 h-3 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
                <span className="absolute -top-7 right-0 text-sm font-semibold text-[#101A33]">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
