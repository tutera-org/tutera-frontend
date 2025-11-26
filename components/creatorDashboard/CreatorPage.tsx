"use client";
import { api } from "@/lib/axiosClientInstance";
import CardAnalytics from "./CardAnalytics";
import ChartDashboard from "./Chart";
import CourseOverview from "./CourseOverview";
import GettingStarted from "./GettingStarted";
import Welcome from "./Welcome";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import TuteraLoading from "../Reuse/Loader";

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ success: boolean; data: ApiResponse }>(
        "/v1/dashboard"
      );
      const fetchedData = response.data.data;
      setData(fetchedData);

      // Update ownsLessons based on courses length
      const hasLessons = (fetchedData?.data?.courses?.length ?? 0) > 0;
      setOwnsLessons(hasLessons);
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response
          ?.data?.error || "Fetching dashboard failed";
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
            <h1 className="font-semibold lg:text-[2.5rem] leading-12 text-neutral-900 text-base">
              Welcome back
            </h1>
            <div className="flex gap-3">
              <Link
                href="/courseManagement"
                className="text-primary-400 text-base font-bold leading-[120%] border border-primary-400 py-3 px-4 rounded-lg hover:bg-primary-400 cursor-pointer hover:text-neutral-100"
              >
                View product
              </Link>

              <Link
                href="/courseManagement"
                className="font-bold rounded-lg py-3 px-6 bg-primary-400 hover:border hover:border-primary-400 hover:bg-neutral-100 hover:text-primary-400 cursor-pointer text-neutral-100 text-base leading-[120%]"
              >
                Add Course
              </Link>
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
          <CourseOverview />
        </>
      ) : (
        <GettingStarted />
      )}
    </div>
  );
}
