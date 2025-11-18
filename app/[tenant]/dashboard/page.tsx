
import CreatorPage from "@/components/creatorDashboard/CreatorPage";
import StudentPage from "@/components/creatorDashboard/StudentPage";

export default function DashboardPage() {
  const role = "creator" as "creator" | "student";
  return (
    <div className="mt-10 md:mt-14 w-full">
      {role === "creator" ? <CreatorPage /> : <StudentPage />}
    </div>
  );
}
