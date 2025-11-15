"use client";
import { useState } from "react";

export default function TransactionHistory() {
  const [selectedPeriod, setSelectedPeriod] = useState("Today");

  const transactions = [
    {
      date: "Nov 10, 2025",
      description: "Course sales - Complete Web Development",
      type: "earning",
      status: "completed",
      amount: "+₦45,000",
    },
    {
      date: "Nov 8, 2025",
      description: "Withdrawal to Bank Account",
      type: "withdrawal",
      status: "completed",
      amount: "-₦30,000",
    },
    {
      date: "Nov 5, 2025",
      description: "Withdrawal to Bank Account",
      type: "withdrawal",
      status: "processing",
      amount: "-₦18,500",
    },
    {
      date: "Nov 3, 2025",
      description: "Course sales - Digital Marketing",
      type: "earning",
      status: "completed",
      amount: "+₦22,000",
    },
    {
      date: "Nov 2, 2025",
      description: "Course sales - Graphic Design",
      type: "earning",
      status: "completed",
      amount: "+₦15,000",
    },
  ];

  return (
    <section className="my-6 sm:my-10 md:my-15 bg-neutral-100 shadow-md rounded-2xl p-5 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-neutral-900">
          Transaction History
        </h2>

        {/* Period Selector */}
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm sm:text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer"
        >
          <option value="Today">Today</option>
          <option value="This week">This week</option>
          <option value="Last week">Last week</option>
          <option value="This month">This month</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto h-80 sm:h-96 rounded-lg">
        <table className="w-full min-w-[800px]">
          <thead className="sticky top-0 z-10">
            <tr
              style={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
              className="border-b border-neutral-300"
            >
              <th
                className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm lg:text-base font-semibold"
                style={{ color: "rgba(16, 24, 40, 1)" }}
              >
                Date
              </th>
              <th
                className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm lg:text-base font-semibold"
                style={{ color: "rgba(16, 24, 40, 1)" }}
              >
                Description
              </th>
              <th
                className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm lg:text-base font-semibold"
                style={{ color: "rgba(16, 24, 40, 1)" }}
              >
                Type
              </th>
              <th
                className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm lg:text-base font-semibold"
                style={{ color: "rgba(16, 24, 40, 1)" }}
              >
                Status
              </th>
              <th
                className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm lg:text-base font-semibold"
                style={{ color: "rgba(16, 24, 40, 1)" }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={index}
                className="hover:bg-neutral-200 transition-colors"
              >
                <td
                  className="py-4 px-2 sm:px-4 text-xs sm:text-sm lg:text-base whitespace-nowrap"
                  style={{ color: "rgba(16, 24, 40, 1)" }}
                >
                  {transaction.date}
                </td>
                <td
                  className="py-4 px-2 sm:px-4 text-xs sm:text-sm lg:text-base"
                  style={{ color: "rgba(16, 24, 40, 1)" }}
                >
                  {transaction.description}
                </td>
                <td
                  className="py-4 px-2 sm:px-4 text-xs sm:text-sm lg:text-base capitalize"
                  style={{ color: "rgba(16, 24, 40, 1)" }}
                >
                  {transaction.type}
                </td>
                <td className="py-4 px-2 sm:px-4">
                  <span
                    className={`text-xs sm:text-sm lg:text-base capitalize ${
                      transaction.status === "completed"
                        ? "text-success-400"
                        : "text-accent-400"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td
                  className={`py-4 px-2 sm:px-4 text-right text-xs sm:text-sm lg:text-base font-semibold whitespace-nowrap ${
                    transaction.amount.startsWith("+")
                      ? "text-success-400"
                      : "text-accent-400"
                  }`}
                >
                  {transaction.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
