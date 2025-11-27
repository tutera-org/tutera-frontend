"use client";
import { api } from "@/lib/axiosClientInstance";
import CardAnalytics from "./CardAnalytics";
import ChartDashboard from "./Chart";
import CourseOverview from "./CourseOverview";
import GettingStarted from "./GettingStarted";
import Welcome from "./Welcome";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import TuteraLoading from "../Reuse/Loader";
import Button from "../Reuse/Button";
import { useRouter } from "next/navigation";

// Type definitions
interface Course {
  _id: string;
  title: string;
  price: number;
  studentCount: number;
  status: string;
}

interface AnalysisData {
  [key: string]: unknown;
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

export default function CreatorPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [ownsLessons, setOwnsLessons] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ success: boolean; data: ApiResponse }>(
        "/v1/dashboard"
      );
      const fetchedData = response.data.data;
      console.log(fetchedData);
      setData(fetchedData);

      // Update ownsLessons based on courses length
      const hasLessons = (fetchedData?.data?.courses?.length ?? 0) > 0;
      setOwnsLessons(hasLessons);
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Fetching dashboard failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <TuteraLoading />;
  }

  return (
    <div>
      {/* welcome area */}
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10">
        {ownsLessons ? (
          <>
            <h1 className="text-[1.5rem] md:text-[2.5rem] font-bold text-[#101A33] mb-6 ">
              Welcome Back
            </h1>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => router.push("/courseManagement")}
                className="px-9 md:px-8 md:py-4 py-3 bg-white"
              >
                View Product
              </Button>
            </div>
          </>
        ) : (
          <Welcome />
        )}
      </section>

      {/* Card Analytics */}
      <CardAnalytics data={data} />

      {ownsLessons ? (
        <>
          {/* Charts and notifications */}
          <ChartDashboard data={data} />

          {/* Course overview */}
          <CourseOverview courses={data?.data?.courses} />
        </>
      ) : (
        <GettingStarted />
      )}
    </div>
  );
}
