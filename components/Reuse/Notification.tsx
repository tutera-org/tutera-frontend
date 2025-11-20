export default function Notification() {
  const notify = [
    {
      message: "John Doe just enrolled in your course 'UI Design'",
      day: "Wednesday",
      time: "9:42 AM",
    },
    {
      message: "Sandra rated 'UI Design Basics'",
      day: "Wednesday",
      time: "9:42 AM",
    },
    {
      message: "John Doe just completed Front End fundamentals",
      day: "Wednesday",
      time: "9:42 AM",
    },
  ];

  return (
    <div className="">
      {notify.map((item, index) => (
        <div
          key={index}
          className="flex gap-2 sm:gap-2.5 items-center group mb-4 sm:mb-6 cursor-pointer  rounded-lg"
        >
          <aside className="border-2 h-5 w-1 py-3 sm:py-4 border-pale-sky-200 bg-[#c3c3c3] transition-colors duration-200">
            {/* This is the line for the notification */}
          </aside>
          <aside className="flex flex-col gap-1.5 sm:gap-2">
            <h5 className="text-base text-neutral-900 group-hover:text-[#4977E6] transition-colors duration-200 wrap-break-word group-hover:underline">
              {item.message.substring(0, 70)}...
            </h5>
            <p className="text-[#C3C3C3] text-xs font-semibold  ">
              {item.day} at {item.time}
            </p>
          </aside>
        </div>
      ))}
    </div>
  );
}
