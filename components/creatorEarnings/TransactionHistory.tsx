"use client";
import { useState } from "react";

export default function TransactionHistory() {
  const [selectedPeriod, setSelectedPeriod] = useState("Today");

  const transactions: any[] = [];

  return (
    <section className="my-6 sm:my-10 md:my-15 bg-neutral-100 border border-[#C3C3C3] rounded-2xl p-5 sm:p-6 md:p-8">
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
      <div className="overflow-x-auto overflow-y-auto h-80 sm:h-96 rounded-lg border border-neutral-300">
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
          <tbody className="bg-white">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 px-4">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-neutral-400"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <p className="text-base sm:text-lg font-semibold text-neutral-900">
                      No Transactions Found
                    </p>
                    <p className="text-sm text-neutral-500">
                      Your transaction history will appear here
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((transaction, index) => (
                <tr
                  key={index}
                  className="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50"
                >
                  <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-neutral-700">
                    {transaction.date}
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-neutral-900 font-medium">
                    {transaction.description}
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        transaction.type === "earning"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        transaction.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-right">
                    <span
                      className={
                        transaction.amount.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {transaction.amount}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
