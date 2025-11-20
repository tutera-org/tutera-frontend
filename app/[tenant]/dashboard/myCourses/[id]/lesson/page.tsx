"use client";

import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import StudentButton from "@/components/students/Button";
import Image from "next/image";

export default function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  // Mock data - in real app, fetch based on params
  const course = {
    id: 1,
    title: "Foundation of Web",
    description:
      "This course is designed to help you start your journey in Frontend development from the ground up. You'll learn how to build beautiful, responsive websites and web apps using modern technologies while understanding the principles of great design and user experience. Step by step, you'll gain hands-on experience with real-world projects that prepare you for freelance work, collaborations, or launching your own tech venture. By the end of the course, you'll not only have the skills to build functional web interfaces but also the confidence to turn your creativity into a sustainable online business.",
    currentLesson: {
      id: 1,
      number: 1,
      title: "Introduction to HTML",
      videoDuration: "30:00",
      currentTime: "30:00",
    },
    curriculum: [
      {
        id: 1,
        sectionTitle: "Foundation of Web",
        items: [
          { id: 1, title: "Introduction to HTML", completed: true },
          { id: 2, title: "Forms and Input", completed: true },
          { id: 3, title: "HTML Element and Structure", completed: true },
        ],
      },
      {
        id: 2,
        sectionTitle: "Styling with CSS",
        items: [
          { id: 1, title: "CSS Selectors and Properties", completed: false },
          { id: 2, title: "Flexbox Mastery", completed: false },
          { id: 3, title: "CSS Grid Layouts", completed: false },
        ],
      },
    ],
    progress: 40,
  };

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
            <h1 className="text-2xl  md:text-[2.5rem] font-bold text-[#101A33] mb-2">
              {course.title}
            </h1>
            <p className="text-base font-semibold  text-[#101A33]">
              {course.currentLesson.number} {course.currentLesson.title}
            </p>
          </div>

          {/* Video Player Image */}
          <div className="mb-6">
            <div className="w-full aspect-video rounded-lg overflow-hidden">
              <Image
                src="/video.png"
                width={1000}
                height={1000}
                alt="Lesson video content"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Course Description */}
          <div className="  p-6">
            <p className="text-base md:text-[20px] text-[#101A33] font-semibold leading-relaxed">
              {course.description}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 xl:w-96 shrink-0">
          <div className=" sticky top-6">
            {/* Course Curriculum */}
            <div className="mb-6">
              {course.curriculum.map((section) => (
                <div key={section.id} className="mb-6">
                  <h3 className="text-[24px] font-semibold text-neutral-900 mb-4">
                    {section.sectionTitle}:
                  </h3>
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          item.id === course.currentLesson.id && item.completed
                            ? "bg-[#F6F6F6] "
                            : item.completed
                            ? "bg-orange-50 border border-orange-200"
                            : "bg-[#E6EAF5]"
                        }`}
                      >
                        <div
                          className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                            item.completed
                              ? "bg-orange-300"
                              : "bg-[rgba(133,32,9,1)]"
                          }`}
                        >
                          {item.completed ? (
                            <FaCheck className="text-xs" />
                          ) : (
                            item.id
                          )}
                        </div>
                        <span
                          className={`text-[16px] flex-1 ${
                            item.id === course.currentLesson.id
                              ? "font-semibold text-[#101A33]"
                              : "font-medium text-neutral-900"
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>
                    ))}
                    {/* Take Quiz Button */}
                    {
                      <StudentButton
                        className={"w-full mt-4 disabled:bg-gray-500"}
                        onClick={() =>
                          router.push(`/dashboard/myCourses/${course.id}/quiz`)
                        }
                        disabled={
                          !section.items.every((item) => item.completed)
                        }
                      >
                        Take Quiz
                      </StudentButton>
                    }
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
                  className=" bg-orange-300 h-3 rounded-full transition-all"
                  style={{ width: `${course.progress}%` }}
                ></div>
                <span className="absolute -top-7 right-0 text-sm font-semibold text-[#101A33]">
                  {course.progress}%
                </span>
              </div>

              {/* Mark Course as Completed Button */}
              <StudentButton
                variant="secondary"
                className="w-full text-[1rem] font-semibold"
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
