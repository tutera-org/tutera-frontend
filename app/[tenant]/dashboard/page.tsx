import ChartDashboard from "@/components/creatorDashboard/Chart";
import CardAnalytics from "@/components/creatorDashboard/CardAnalytics";
import CourseOverview from "@/components/creatorDashboard/CourseOverview";
import Welcome from "@/components/creatorDashboard/Welcome";
import GettingStarted from "@/components/creatorDashboard/GettingStarted";
import CreatorPage from "@/components/creatorDashboard/CreatorPage";
import StudentPage from "@/components/creatorDashboard/StudentPage";

export default function DashboardPage() {
  let role = "student";
  return (
    <div className="mt-10 md:mt-14 w-full">
      {role === "student" ? <CreatorPage /> : <StudentPage />}
    </div>
  );
}
