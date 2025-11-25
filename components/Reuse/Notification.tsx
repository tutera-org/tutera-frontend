interface RecentActivity {
  type: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface NotificationProps {
  recentActivity?: RecentActivity[];
}

export default function Notification({ recentActivity }: NotificationProps) {
  // Format timestamp to display day and time
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const day = days[date.getDay()];
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return { day, time };
  };

  // If no data, show empty state
  if (!recentActivity || recentActivity.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500">
        No recent activity
      </div>
    );
  }

  return (
    <div className="">
      {recentActivity.map((item, index) => {
        const { day, time } = formatTimestamp(item.timestamp);

        return (
          <div
            key={index}
            className="flex gap-2 sm:gap-2.5 items-center group mb-4 sm:mb-6 cursor-pointer rounded-lg"
          >
            <aside
              className={`border-2 h-5 w-1 py-3 sm:py-4 transition-colors duration-200 ${
                item.isRead
                  ? "border-[#c3c3c3] bg-[#c3c3c3]"
                  : "border-primary-400 bg-primary-400"
              }`}
            >
              {/* This is the line for the notification */}
            </aside>
            <aside className="flex flex-col gap-1.5 sm:gap-2">
              <h5 className="text-base text-neutral-900 group-hover:text-[#4977E6] transition-colors duration-200 wrap-break-word group-hover:underline">
                {item.message.length > 70
                  ? `${item.message.substring(0, 70)}...`
                  : item.message}
              </h5>
              <p className="text-[#C3C3C3] text-xs font-semibold">
                {day} at {time}
              </p>
            </aside>
          </div>
        );
      })}
    </div>
  );
}
