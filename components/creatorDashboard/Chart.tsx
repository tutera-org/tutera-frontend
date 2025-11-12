"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartDashboard() {
  const barChartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Total course",
        data: [450, 250, 100, 500, 400, 450],
        backgroundColor: "#3B82F6",
        borderRadius: 8,
        barThickness: 35,
      },
      {
        label: "Total users",
        data: [200, 450, 300, 200, 100, 300],
        backgroundColor: "#FBBF24",
        borderRadius: 8,
        barThickness: 35,
      },
      {
        label: "Total earning",
        data: [300, 100, 400, 400, 350, 400],
        backgroundColor: "#F87171",
        borderRadius: 8,
        barThickness: 35,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#374151",
        bodyColor: "#374151",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: "#F3F4F6",
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 12,
          },
          stepSize: 100,
        },
        min: 0,
        max: 500,
      },
    },
    categoryPercentage: 0.65,
    barPercentage: 0.9,
  };

  const doughnutData = {
    labels: [
      "React and 30%",
      "React and 20%",
      "Front end 20%",
      "Marketing 10%",
      "UI/UX 15%",
      "Elementary 5%",
    ],
    datasets: [
      {
        data: [30, 20, 20, 10, 15, 5],
        backgroundColor: [
          "#6B8DE3",
          "#8BA3E8",
          "#4A5568",
          "#A0AEC0",
          "#CBD5E0",
          "#E2E8F0",
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#374151",
        bodyColor: "#374151",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 12,
      },
    },
    cutout: "65%",
  };

  const courseColors = [
    "#6B8DE3",
    "#8BA3E8",
    "#4A5568",
    "#A0AEC0",
    "#CBD5E0",
    "#E2E8F0",
  ];

  return (
    <div className="min-h-screen mt-10 ">
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

          <div className="h-[350px]">
            <Bar data={barChartData} options={barChartOptions} />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">
              New students enrollment
            </h3>
          </div>
        </div>

        {/* Course Overview Chart - Takes 1/3 on large screens */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Course overview
          </h2>

          <div className="flex justify-center items-center h-[400px]">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>

          <div className="mt-6 space-y-3">
            {doughnutData.labels.map((label, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: courseColors[index] }}
                  ></div>
                  <span className="text-sm text-gray-700">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
