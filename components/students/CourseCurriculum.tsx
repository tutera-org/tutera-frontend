import { FaCheck } from "react-icons/fa";

interface CurriculumItem {
  id: number;
  title: string;
  completed: boolean;
}

interface CurriculumSection {
  id: number;
  sectionTitle: string;
  items: CurriculumItem[];
}

interface CourseCurriculumProps {
  sections: CurriculumSection[];
}

export default function CourseCurriculum({ sections }: CourseCurriculumProps) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.id}>
          {/* Section Title */}
          <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 mb-4">
            {section.sectionTitle}
          </h2>

          {/* Section Items */}
          <div className="space-y-3">
            {section.items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-colors ${
                  item.completed
                    ? "bg-orange-50 border border-orange-200"
                    : "bg-neutral-100 border border-neutral-200"
                }`}
              >
                {/* Left side - Number and Title */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base ${
                      item.completed ? "bg-orange-300" : "bg-[rgba(133,32,9,1)]"
                    }`}
                  >
                    {item.id}
                  </div>
                  <span className="text-sm sm:text-base font-medium text-neutral-900">
                    {item.title}
                  </span>
                </div>

                {/* Right side - Check icon */}
                <div
                  className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                    item.completed ? "bg-orange-300" : "bg-orange-100"
                  }`}
                >
                  {item.completed && (
                    <FaCheck className="text-white text-sm sm:text-base" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
