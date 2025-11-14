import { FaArrowLeft } from "react-icons/fa";
import Notification from "../Reuse/Notification";
import WeeklyActivity from "./BarChart";
import { MdArrowRight } from "react-icons/md";

export default function ChartDashboard() {
  return (
    <div className="mt-10 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts*/}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
          {/* <WeeklyActivity apiUrl="/api/courses-sold" / with api endpoint> */}

          <WeeklyActivity />
          {/* Backend should send something like this
[
  { "day": "Sat", "courses": 5 },
  { "day": "Sun", "courses": 8 },
  { "day": "Mon", "courses": 12 },
  { "day": "Tue", "courses": 18 },
  { "day": "Wed", "courses": 22 },
  { "day": "Thu", "courses": 15 },
  { "day": "Fri", "courses": 10 }
] */}
        </div>

        {/* Notifications*/}
        <div className="bg-white rounded-2xl shadow-lg p-6  lg:col-span-1">
          <div className="flex justify-between items-center mb-7">
            {/* Title */}
            <p className="text-neutral-900 text-2xl font-semibold">
              Recent Activity
            </p>
            <MdArrowRight className="text-2xl text-darkblue hover:text-primary-400 transition-colors cursor-pointer" />
          </div>

          {/* Notifications go here */}
          <Notification />
        </div>
      </div>
    </div>
  );
}
