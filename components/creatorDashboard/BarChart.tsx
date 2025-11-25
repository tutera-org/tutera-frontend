"use client";
import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { IoChevronDown } from "react-icons/io5";

interface ChartData {
  day: string;
  value: number;
}

interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

interface AnalysisData {
  [key: string]: any;
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

const WeeklyActivity: React.FC<WeeklyActivityProps> = ({ overallAnalysis }) => {
  const [metric, setMetric] = useState<string>("Courses Sold");
  const [timeframe, setTimeframe] = useState<Timeframe>("weekly");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const getCurrentData = (): ChartData[] => {
    if (!overallAnalysis) {
      return [];
    }

    const data = overallAnalysis[timeframe] || [];

    // Transform API data to chart format
    return data.map((item: any, index: number) => {
      let dayLabel = "";

      if (timeframe === "daily") {
        // For daily, you might get timestamps or hours
        dayLabel = item.day || item.hour || `Hour ${index}`;
      } else if (timeframe === "weekly") {
        // For weekly, you might get day names
        dayLabel = item.day || `Day ${index + 1}`;
      } else if (timeframe === "monthly") {
        // For monthly, you might get week numbers or dates
        dayLabel = item.week || item.month || `Week ${index + 1}`;
      }

      return {
        day: dayLabel,
        value: item.value || item.count || 0,
      };
    });
  };

  const metrics: string[] = [
    "Courses Sold",
    "Revenue",
    "Students Enrolled",
    "Completion Rate",
  ];

  const CustomBar: React.FC<CustomBarProps> = (props) => {
    const { x = 0, y = 0, width = 0, height = 0 } = props;
    const radius = 8;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="#4F7DF3"
          rx={radius}
          ry={radius}
        />
      </g>
    );
  };

  const chartData = getCurrentData();
  const maxValue = Math.max(...chartData.map((d) => d.value), 25);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white font-semibold">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
          Over-all Analysis
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            <span className="text-gray-700">{metric}</span>
            <IoChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {metrics.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMetric(m);
                    setDropdownOpen(false);
                  }}
                  className="w-full px-3 sm:px-4 py-2 text-left text-sm sm:text-base text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>

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
            barSize={60}
          >
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 14 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 14 }}
              domain={[0, maxValue]}
            />
            <Bar dataKey="value" shape={<CustomBar />} radius={[8, 8, 8, 8]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
};

export default WeeklyActivity;
