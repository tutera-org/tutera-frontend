// import ChartDashboard from "@/components/creatorDashboard/Chart";

import CardAnalytics from "@/components/creatorDashboard/CardAnalytics";
import CourseOverview from "@/components/creatorDashboard/CourseOverview";

export default function DashboardPage() {
  return (
    <div className="mt-10 w-full">
      {/* welcome area */}
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between ">
        <h1 className="font-semibold lg:text-[2.5rem] leading-12 text-neutral-900 text-base">
          Welcome back
        </h1>
        <div className="flex gap-3">
          <button className="text-primary-400 text-base font-bold leading-[120%] border border-primary-400 py-1.5 px-6 rounded-lg  hover:bg-primary-400 cursor-pointer hover:text-neutral-100">
            View product
          </button>
          <button className="font-bold rounded-lg py-1.5 px-6 bg-primary-400 hover:border hover:border-primary-400 hover:bg-neutral-100 hover:text-primary-400 cursor-pointer text-neutral-100 text-base leading-[120%]">
            Create Module
          </button>
        </div>
      </section>

      {/* Card Analytics */}
      <CardAnalytics />

      {/* Charts */}
      {/* <ChartDashboard /> */}

      {/* Course overview */}
      <CourseOverview />
    </div>
  );
}
