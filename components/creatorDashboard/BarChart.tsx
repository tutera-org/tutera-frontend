"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { IoChevronDown } from "react-icons/io5";

// Type definitions - must match the parent component types
interface AnalysisData {
  [key: string]: unknown;
  label?: string;
  date?: string;
  coursesSold?: number;
  revenue?: number;
  studentsEnrolled?: number;
  completionRate?: number;
}

interface OverallAnalysis {
  daily: AnalysisData[];
  weekly: AnalysisData[];
  monthly: AnalysisData[];
}

interface WeeklyActivityProps {
  overallAnalysis?: OverallAnalysis;
}

type Timeframe = "monthly" | "weekly" | "daily";
type MetricKey =
  | "coursesSold"
  | "revenue"
  | "studentsEnrolled"
  | "completionRate";

interface MetricOption {
  label: string;
  key: MetricKey;
  color: string;
}

interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
}

interface ChartDataPoint {
  name: string;
  value: number;
  fullData: AnalysisData;
}

const WeeklyActivity: React.FC<WeeklyActivityProps> = ({ overallAnalysis }) => {
  const [selectedMetric, setSelectedMetric] =
    useState<MetricKey>("studentsEnrolled");
  const [timeframe, setTimeframe] = useState<Timeframe>("weekly");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const metrics: MetricOption[] = [
    { label: "Students Enrolled", key: "studentsEnrolled", color: "#4F7DF3" },
    { label: "Courses Sold", key: "coursesSold", color: "#10B981" },
    { label: "Revenue", key: "revenue", color: "#F59E0B" },
    { label: "Completion Rate", key: "completionRate", color: "#8B5CF6" },
  ];

  const getCurrentMetric = () =>
    metrics.find((m) => m.key === selectedMetric) || metrics[0];

  const getCurrentData = (): ChartDataPoint[] => {
    // Guard clause: Check if overallAnalysis exists and has data
    if (!overallAnalysis || !overallAnalysis[timeframe]) {
      return [];
    }

    const data = overallAnalysis[timeframe];

    // Map the actual API data structure to chart data
    return data.map((item: AnalysisData, index: number) => {
      let label = "";

      if (timeframe === "daily") {
        // For daily view, show labels at 2-hour intervals (0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22)
        // This gives us 12 labels across the 24 hours
        if (index % 2 === 0) {
          label = item.label || `Hour ${index + 1}`;
        } else {
          label = ""; // Empty label for non-2hr intervals
        }
      } else if (timeframe === "weekly") {
        // For weekly view, use day labels from API (e.g., "Fri, Nov 21", "Sat, Nov 22")
        // Extract just the day name or use full label
        if (item.label) {
          // Extract day name from "Fri, Nov 21" format
          const dayName = item.label.split(",")[0];
          label = dayName || item.label;
        } else {
          label = `Day ${index + 1}`;
        }
      } else if (timeframe === "monthly") {
        // For monthly view, use week labels from API (e.g., "Week 1 (Oct 31 - Nov 6)")
        if (item.label) {
          // Extract just "Week 1", "Week 2", etc. from the full label
          const weekMatch = item.label.match(/Week (\d+)/);
          label = weekMatch ? `Week ${weekMatch[1]}` : item.label;
        } else {
          label = `Week ${index + 1}`;
        }
      }

      // Safely access the metric value with fallback to 0
      const metricValue =
        typeof item[selectedMetric] === "number" ? item[selectedMetric] : 0;

      return {
        name: label,
        value: metricValue,
        fullData: item,
      };
    });
  };

  const CustomBar: React.FC<CustomBarProps> = (props) => {
    const { x = 0, y = 0, width = 0, height = 0, fill = "#4F7DF3" } = props;
    const radius = 8;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          rx={radius}
          ry={radius}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const currentMetric = getCurrentMetric();

      let displayValue: string | number = data.value;

      // Format based on metric type
      if (currentMetric.key === "revenue") {
        displayValue = new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        }).format(data.value);
      } else if (currentMetric.key === "completionRate") {
        displayValue = `${data.value}%`;
      }

      // Get the full label from the original data
      const fullLabel = data.fullData?.label || data.name;

      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {fullLabel}
          </p>
          <p className="text-sm text-gray-600">
            <span
              className="font-medium"
              style={{ color: currentMetric.color }}
            >
              {currentMetric.label}:
            </span>{" "}
            {displayValue}
          </p>
        </div>
      );
    }
    return null;
  };

  const chartData = getCurrentData();
  const maxValue = Math.max(...chartData.map((d) => d.value), 10);
  const currentMetric = getCurrentMetric();

  // Adjust bar size based on timeframe
  const getBarSize = () => {
    if (timeframe === "daily") return 12; // 24 hours - smaller bars
    if (timeframe === "weekly") return 40; // 7 days - medium bars
    return 40; // 4 weeks - medium bars
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white font-semibold">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
          Over-all Analysis
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
        {/* Metric Dropdown */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentMetric.color }}
              />
              <span className="text-gray-700">{currentMetric.label}</span>
            </div>
            <IoChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full sm:w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {metrics.map((m) => (
                <button
                  key={m.key}
                  onClick={() => {
                    setSelectedMetric(m.key);
                    setDropdownOpen(false);
                  }}
                  className="w-full px-3 sm:px-4 py-2 text-left text-sm sm:text-base text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors flex items-center gap-2"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: m.color }}
                  />
                  {m.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Timeframe Radio Buttons */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full sm:w-auto">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="timeframe"
              value="monthly"
              checked={timeframe === "monthly"}
              onChange={(e) => setTimeframe(e.target.value as Timeframe)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm sm:text-base text-gray-700">Monthly</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="timeframe"
              value="weekly"
              checked={timeframe === "weekly"}
              onChange={(e) => setTimeframe(e.target.value as Timeframe)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm sm:text-base text-gray-700">Weekly</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="timeframe"
              value="daily"
              checked={timeframe === "daily"}
              onChange={(e) => setTimeframe(e.target.value as Timeframe)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm sm:text-base text-gray-700">Daily</span>
          </label>
        </div>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            barSize={getBarSize()}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F3F4F6"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              dy={10}
              interval={0}
              angle={timeframe === "daily" ? -45 : 0}
              textAnchor={timeframe === "daily" ? "end" : "middle"}
              height={timeframe === "daily" ? 70 : 30}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              domain={[0, maxValue]}
              tickFormatter={(value) => {
                if (selectedMetric === "revenue") {
                  return `₦${
                    value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
                  }`;
                }
                return value;
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(79, 125, 243, 0.1)" }}
            />
            <Bar
              dataKey="value"
              fill={currentMetric.color}
              shape={<CustomBar />}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
          <svg
            className="w-16 h-16 mb-4 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-base font-medium">No data available</p>
          <p className="text-sm text-gray-400 mt-1">
            Start adding courses to see analytics
          </p>
        </div>
      )}
    </div>
  );
};

export default WeeklyActivity;
