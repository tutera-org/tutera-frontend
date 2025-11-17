import StudentButton from "@/components/students/Button";
import CourseCurriculum from "@/components/students/CourseCurriculum";

export default async function BuyCourseId({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = {
    id: 1,
    title: "Ansah omitted Title",
    img: "/marketPlace.svg",
    desc: "Learn how to build the part of a website or app that works behind the scenes. You'll understand how to connect apps to databases, make them run faster, keep them secure, and handle many users at once.",
    stars: 3,
    amt: "2000",
    curriculum: [
      {
        id: 1,
        sectionTitle: "Foundation of Web",
        items: [
          { id: 1, title: "Introduction to HTML", completed: false },
          { id: 2, title: "Forms and Input", completed: false },
          { id: 3, title: "HTML Element and Structure", completed: false },
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
      {
        id: 3,
        sectionTitle: "Take Quiz",
        items: [],
      },
    ],
  };

  return (
    <section className="mt-6 sm:mt-8 lg:mt-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-4">
        <aside className="font-semibold w-full lg:basis-[50%] text-neutral-900">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {course.title}
          </h3>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mt-3 sm:mt-4">
            {course.desc}
          </p>
        </aside>
        <aside className="w-full lg:basis-[45%]">
          <img
            className="w-full h-auto rounded-lg"
            src={course.img}
            alt={`${course.title} image`}
          />
        </aside>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mt-10 sm:mt-12 lg:mt-15">
        <p className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-900">
          Learn at your own pace with structured modules and lessons
        </p>
        <StudentButton className="w-full sm:w-auto">Start Lesson</StudentButton>
      </div>

      {/* Course Curriculum Section */}
      <div className="mt-10 sm:mt-12 lg:mt-16">
        <CourseCurriculum sections={course.curriculum} />
      </div>
    </section>
  );
}
