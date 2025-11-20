"use client";

import Image from "next/image";
import Button from "../Reuse/Button";
import { Module } from "./CourseContext";

interface CoursePreviewProps {
  courseTitle?: string;
  courseDescription?: string;
  courseThumbnail?: string;
  modules: Module[];
  onBack: () => void;
  onNext: () => void;
  onLessonClick: (moduleIndex: number, lessonIndex: number) => void;
}

export default function CoursePreview({
  courseTitle,
  courseDescription,
  courseThumbnail,
  modules,
  onBack,
  onNext,
  onLessonClick,
}: CoursePreviewProps) {
  return (
    <div className="w-full mx-auto">
      <div className="p-2 md:p-8">
        <h3 className="text-[1.25rem] md:text-[1.75rem] font-semibold text-[#101A33]">
          Preview
        </h3>
        <div className="flex justify-between items-center mb-6 text-[#101A33]">
          <Button
            variant="secondary"
            onClick={onBack}
            className="border-none md:text-[1.25rem] text-[0.8rem] text-black font-semibold"
          >
            &lt; Back
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className=" flex flex-col md:flex-row md:items-start gap-8">
              <div  className="flex-1">
               <h2 className="text-[1.25rem] md:text-[3rem] font-bold text-[#101A33] mb-4">
              {courseTitle || "Course Title"}
                </h2>
                 <p className="text-[#101A33] md:text-[1.5rem] text-[0.9rem] mb-2">
              {courseDescription || "Course description"}
                 </p>
           
              </div>
  
               <div className="flex-1">
                     {courseThumbnail ? (
                  <div className="w-full h-40 md:h-86 relative rounded-lg overflow-hidden">
                <Image
                  src={courseThumbnail}
                  alt="Course Cover"
                  fill
                  className="object-contain "
                />
                </div>
               ) : (
               <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Course Illustration</span>
                </div>
               )}
              </div>

            
         </div>

         

         <p className="text-[#101A33] font-semibold mb-2 text-[1rem] md:text-[1.5rem] ">
              Learn at your own pace with structured modules and lessons
            </p>

          <div className="space-y-4">
              {modules.map((module, moduleIdx) => (
                <div key={module.id} className="border-b border-gray-200 pb-4">
                  <h3 className="text-[24px] font-semibold text-[#101A33] mb-3">
                    {module.name || `Module ${moduleIdx + 1}`}
                  </h3>
                  <div className="space-y-2">
                    {module.lessons.map((lesson, lessonIdx) => (
                      <div
                        key={lesson.id}
                        onClick={() => onLessonClick(moduleIdx, lessonIdx)}
                        className="flex items-center gap-3 text-gray-700 cursor-pointer bg-gray-50 p-2 rounded transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#4977E6] text-white flex items-center justify-center text-sm md:text-base font-semibold">
                          {lessonIdx + 1}
                        </div>
                        <span className="flex">
                          {lesson.name || `Lesson ${lessonIdx + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

         
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="primary" onClick={onNext} className="px-6 py-2">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
