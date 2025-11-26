import { FaCheck } from "react-icons/fa";

// Interfaces
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

interface CourseCurriculumProps {
  sections: Module[];
}

export default function CourseCurriculum({ sections }: CourseCurriculumProps) {
  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      {sortedSections.map((section) => (
        <div key={section._id}>
          {/* Section Title */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900">
              {section.title}
            </h2>
            {section.lessons && section.lessons.length > 0 && (
              <span className="text-sm text-neutral-600">
                {section.lessons.length}{" "}
                {section.lessons.length === 1 ? "lesson" : "lessons"}
              </span>
            )}
          </div>

          {/* Section Lessons */}
          {section.lessons && section.lessons.length > 0 ? (
            <div className="space-y-3">
              {section.lessons
                .sort((a, b) => a.order - b.order)
                .map((lesson, index) => (
                  <div
                    key={lesson._id}
                    className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-colors ${
                      lesson.isPreview
                        ? "bg-orange-50 border border-orange-200"
                        : "bg-neutral-100 border border-neutral-200"
                    }`}
                  >
                    {/* Left side - Number and Title */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div
                        className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base ${
                          lesson.isPreview
                            ? "bg-orange-300"
                            : "bg-[rgba(133,32,9,1)]"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm sm:text-base font-medium text-neutral-900 block truncate">
                          {lesson.title}
                        </span>
                        {lesson.duration > 0 && (
                          <span className="text-xs text-neutral-600">
                            {Math.floor(lesson.duration / 60)} min
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right side - Type badge and Check icon */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      {/* Lesson type badge */}
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          lesson.type === "VIDEO"
                            ? "bg-blue-100 text-blue-700"
                            : lesson.type === "ARTICLE"
                            ? "bg-green-100 text-green-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {lesson.type}
                      </span>

                      {/* Preview/Completion indicator */}
                      <div
                        className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                          lesson.isPreview ? "bg-orange-300" : "bg-orange-100"
                        }`}
                      >
                        {lesson.isPreview && (
                          <FaCheck className="text-white text-sm sm:text-base" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500 italic">
              No lessons available yet
            </p>
          )}

          {/* Quiz indicator if available */}
          {section.quiz && (
            <div className="mt-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-purple-700 font-medium">
                  📝 Quiz Available
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
