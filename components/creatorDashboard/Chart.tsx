import Notification from "../Reuse/Notification";
import WeeklyActivity from "./BarChart";
import { MdArrowRight } from "react-icons/md";

interface AnalysisData {
  [key: string]: unknown;
  day?: string;
  hour?: string;
  week?: string;
  month?: string;
  value?: number;
}

interface OverallAnalysis {
  daily: AnalysisData[];
  weekly: AnalysisData[];
  monthly: AnalysisData[];
}

interface RecentActivity {
  type: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface Course {
  _id: string;
  title: string;
  price: number;
  studentCount: number;
  status: string;
}

interface DashboardData {
  courseOverview: Course[];
  courses: Course[];
  overallAnalysis: OverallAnalysis;
  recentActivity: RecentActivity[];
  totalEarnings: number;
  totalEnrolledLearners: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

interface ChartDashboardProps {
  data: ApiResponse | null;
}

export default function ChartDashboard({ data }: ChartDashboardProps) {
  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts*/}
        <div className="bg-white rounded-2xl border-2 border-[#F0F0F0] p-6 lg:col-span-2">
          <WeeklyActivity overallAnalysis={data?.data?.overallAnalysis} />
        </div>

        {/* Notifications*/}
        <div className="bg-white rounded-2xl border-2 border-[#F0F0F0] p-6 lg:col-span-1">
          <div className="flex justify-between items-center mb-7">
            {/* Title */}
            <p className="text-[#101A33] text-2xl font-semibold">
              Recent Activity
            </p>
            <MdArrowRight className="text-2xl text-darkblue hover:text-primary-400 transition-colors cursor-pointer" />
          </div>

          {/* Notifications go here */}
          <Notification recentActivity={data?.data?.recentActivity} />
        </div>
      </div>
    </div>
  );
}
