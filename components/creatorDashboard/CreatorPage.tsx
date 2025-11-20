import CardAnalytics from "./CardAnalytics";
import ChartDashboard from "./Chart";
import CourseOverview from "./CourseOverview";
import GettingStarted from "./GettingStarted";
import Welcome from "./Welcome";
import Link from "next/link";


export default function CreatorPage() {
  // check if creator has a lesson
  const ownsLessons = true;
  return (
    <div className="">
      {/* welcome area */}
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10">
        {ownsLessons ? (
          <>
            <h1 className="font-semibold lg:text-[2.5rem] leading-12 text-neutral-900 text-base">
              Welcome back
            </h1>
            <div className="flex gap-3">
              <Link href="/courseManagement" className="text-primary-400 text-base font-bold leading-[120%] border border-primary-400 py-3 px-4 rounded-lg  hover:bg-primary-400 cursor-pointer hover:text-neutral-100">
                View product
              </Link>
             
              
              <Link href="/courseManagement" 
              className="font-bold rounded-lg py-3 px-6 bg-primary-400 hover:border hover:border-primary-400 hover:bg-neutral-100 hover:text-primary-400 cursor-pointer text-neutral-100 text-base leading-[120%]">
                Add Course
                </Link>
            </div>
          </>
        ) : (
          <Welcome />
        )}
      </section>

      {/* Card Analytics */}
      <CardAnalytics />

      {ownsLessons ? (
        <>
          {/* Charts and notifications */}
          <ChartDashboard />
          {/* Course overview */}
          <CourseOverview />
        </>
      ) : (
        <GettingStarted />
      )}
    </div>
  );
}
