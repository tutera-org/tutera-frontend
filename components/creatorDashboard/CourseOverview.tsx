import { MultiAvatar } from "../Reuse/Avatar";

interface Course {
  _id: string;
  title: string;
  price: number;
  studentCount: number;
  status: string;
}

interface CourseOverviewProps {
  courses?: Course[];
}

export default function CourseOverview({ courses }: CourseOverviewProps) {
  // If no data, show empty state
  if (!courses || courses.length === 0) {
    return (
      <section className="mt-10 py-2.5 rounded-xl p-5 bg-neutral-100 border-2 border-[#F0F0F0]">
        <aside className="flex justify-between mb-6">
          <h3 className="font-semibold text-lg sm:text-2xl leading-8 text-neutral-900">
            Course Overview
          </h3>
        </aside>
        <div className="flex items-center justify-center h-40 text-gray-500">
          No courses available
        </div>
      </section>
    );
  }

  // Generate dummy student names for avatars (you can enhance this with real student data if available)
  const generateStudentAvatars = (count: number) => {
    return Array.from(
      { length: Math.min(count, 4) },
      (_, i) => `Student ${i + 1}`
    );
  };

  return (
    <section className="mt-10 py-2.5 rounded-xl p-5 bg-neutral-100 border-2 border-[#F0F0F0] flex flex-col gap-10">
      {/* Header */}
      <aside className="flex justify-between">
        <h3 className="font-semibold text-lg sm:text-2xl leading-8 text-neutral-900">
          Course Overview
        </h3>
        <button className="text-primary-400 font-semibold leading-5 text-sm sm:text-base hover:underline cursor-pointer">
          More Details
        </button>
      </aside>

      {/* Course Content with Horizontal Scroll */}
      <aside className="overflow-x-auto">
        <div className="min-w-[500px] grid grid-cols-4 gap-4">
          {/* Courses Column */}
          <aside className="col-span-2">
            <h3 className="font-semibold text-base sm:text-xl leading-6 text-black-600">
              Courses
            </h3>
            <div className="flex flex-col mt-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="py-4 min-h-[60px] flex items-center"
                >
                  <p className="font-semibold text-xs sm:text-base leading-5 text-black-500">
                    {course.title}
                  </p>
                </div>
              ))}
            </div>
          </aside>

          {/* Pricing Column */}
          <aside>
            <h3 className="font-semibold text-base sm:text-xl leading-6 text-black-600">
              Pricing
            </h3>
            <div className="flex flex-col mt-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="py-4 min-h-[60px] flex items-center"
                >
                  <p className="font-semibold text-xs sm:text-base leading-5 text-black-500">
                    {course.price === 0
                      ? "Free"
                      : `₦${course.price.toLocaleString()}`}
                  </p>
                </div>
              ))}
            </div>
          </aside>

          {/* Students Column */}
          <aside>
            <h3 className="font-semibold text-base sm:text-xl leading-6 text-black-600">
              Students
            </h3>
            <div className="flex flex-col mt-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="py-4 min-h-[60px] flex items-center gap-2"
                >
                  {course.studentCount > 0 ? (
                    <>
                      <MultiAvatar
                        name={generateStudentAvatars(course.studentCount)}
                      />
                      <span className="font-semibold text-xs sm:text-base leading-5 text-black-500">
                        +{course.studentCount}
                      </span>
                    </>
                  ) : (
                    <span className="font-semibold text-xs sm:text-base leading-5 text-gray-400">
                      No students yet
                    </span>
                  )}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </aside>
    </section>
  );
}
