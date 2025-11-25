import { IoAnalyticsSharp } from "react-icons/io5";

interface Course {
  _id: string;
  title: string;
  price: number;
  studentCount: number;
  status: string;
}

interface AnalysisData {
  [key: string]: any;
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

interface CardAnalyticsProps {
  data: ApiResponse | null;
}

export default function CardAnalytics({ data }: CardAnalyticsProps) {
  const cards = [
    {
      title: "Total Users",
      number: data?.data?.totalEnrolledLearners?.toString() ?? "0",
    },
    {
      title: "Courses",
      number: data?.data?.courses?.length?.toString() ?? "0",
    },
    {
      title: "Earnings",
      number: data?.data?.totalEarnings?.toLocaleString() ?? "0",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 mt-5 gap-4">
      {cards.map((card, index) => (
        <div
          className="bg-neutral-100 rounded-xl md:p-8 p-5 border border-[#C3C3C3]"
          key={index}
        >
          <aside className="flex justify-between items-start">
            <h3 className="font-semibold text-sm sm:text-base lg:text-lg leading-5 text-neutral-900">
              {card.title}
            </h3>
            <div className="bg-secondary-400 w-8 h-6 flex items-center justify-center rounded-[30px]">
              <IoAnalyticsSharp className="text-white text-sm sm:text-base" />
            </div>
          </aside>
          <aside className="mt-4 md:mt-8">
            <p className="font-semibold text-xl sm:text-2xl lg:text-3xl leading-7 text-black-500">
              {card.number}
            </p>
          </aside>
        </div>
      ))}
    </section>
  );
}
