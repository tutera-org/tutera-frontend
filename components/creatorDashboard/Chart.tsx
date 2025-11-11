import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ChartDashboard() {
  const weeklyData = [
    { day: "Sun", totalCourse: 450, totalUsers: 200, totalEarning: 300 },
    { day: "Mon", totalCourse: 250, totalUsers: 450, totalEarning: 100 },
    { day: "Tue", totalCourse: 100, totalUsers: 300, totalEarning: 400 },
    { day: "Wed", totalCourse: 500, totalUsers: 200, totalEarning: 400 },
    { day: "Thu", totalCourse: 400, totalUsers: 100, totalEarning: 350 },
    { day: "Fri", totalCourse: 450, totalUsers: 300, totalEarning: 400 },
  ];

  const courseData = [
    { name: "React and 30%", value: 30, color: "#6B8DE3" },
    { name: "React and 20%", value: 20, color: "#8BA3E8" },
    { name: "Front end 20%", value: 20, color: "#4A5568" },
    { name: "Marketing 10%", value: 10, color: "#A0AEC0" },
    { name: "UI/UX 15%", value: 15, color: "#CBD5E0" },
    { name: "Elementary 5%", value: 5, color: "#E2E8F0" },
  ];

  return (
    <div className="min-h-screen mt-10 bg-linear-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Activity Chart - Takes 2/3 on large screens */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Weekly Activity
          </h2>

          <div className="flex items-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">Total course</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span className="text-gray-600">Total users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-gray-600">Total earning</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={weeklyData} barGap={4} barCategoryGap="35%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                ticks={[0, 100, 200, 300, 400, 500]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="totalCourse"
                fill="#3B82F6"
                radius={[8, 8, 0, 0]}
                maxBarSize={35}
              />
              <Bar
                dataKey="totalUsers"
                fill="#FBBF24"
                radius={[8, 8, 0, 0]}
                maxBarSize={35}
              />
              <Bar
                dataKey="totalEarning"
                fill="#F87171"
                radius={[8, 8, 0, 0]}
                maxBarSize={35}
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">
              New students enrollment
            </h3>
          </div>
        </div>

        {/* Course Overview Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Course overview
          </h2>

          <div className="flex justify-center items-center">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={courseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={140}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {courseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 space-y-3">
            {courseData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
