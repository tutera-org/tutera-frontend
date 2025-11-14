import { MultiAvatar } from "../Reuse/Avatar";

export default function CourseOverview() {
  const courses = [
    {
      id: 1,
      name: "UI/UX Design Masterclass",
      pricing: "15,000",
      studentCount: 110,
      studentAvatars: [
        "Ansah Chikeh",
        "Ansah Chikeh",
        "Ansah Chikeh",
        "Ansah Chikeh",
      ],
    },
    {
      id: 2,
      name: "Back-End Advance",
      pricing: "10,000",
      studentCount: 4,
      studentAvatars: [
        "Ansah Chikeh",
        "Ansah Chikeh",
        "Ansah Chikeh",
        "Ansah Chikeh",
      ],
    },
    {
      id: 3,
      name: "Front-End Fundamentals",
      pricing: "5,000",
      studentCount: 2,
      studentAvatars: [
        "Ansah Chikeh",
        "Ansah Chikeh0",
        "Ansah Chikeh1",
        "Ansah Chikeh2",
      ],
    },
  ];

  return (
    <section className="mt-10 py-2.5 rounded-xl p-5 bg-neutral-100 flex flex-col gap-10">
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
                  key={course.id}
                  className="py-4 min-h-[60px] flex items-center"
                >
                  <p className="font-semibold text-xs sm:text-base leading-5 text-black-500">
                    {course.name}
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
                  key={course.id}
                  className="py-4 min-h-[60px] flex items-center"
                >
                  <p className="font-semibold text-xs sm:text-base leading-5 text-black-500">
                    {course.pricing}
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
                  key={course.id}
                  className="py-4 min-h-[60px] flex items-center gap-2"
                >
                  <MultiAvatar name={course.studentAvatars} />
                  <span className="font-semibold text-xs sm:text-base leading-5 text-black-500">
                    +{course.studentCount}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </aside>
    </section>
  );
}
