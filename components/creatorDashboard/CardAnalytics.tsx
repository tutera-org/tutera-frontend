import { IoAnalyticsSharp } from "react-icons/io5";

export default function CardAnalytics() {
  const cards = [
    {
      title: "Total Users",
      number: "5,000",
    },
    {
      title: "Courses",
      number: "6",
    },
    {
      title: "Earnings",
      number: "670,000",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 mt-5 gap-4">
      {cards.map((card, index) => (
        <div className="bg-neutral-100 rounded-xl p-4 sm:p-5" key={index}>
          <aside className="flex justify-between items-start">
            <h3 className="font-semibold text-sm sm:text-base lg:text-lg leading-5 text-neutral-900">
              {card.title}
            </h3>
            <div className="bg-secondary-400 p-2 rounded-full">
              <IoAnalyticsSharp className="text-white text-sm sm:text-base" />
            </div>
          </aside>
          <aside className="mt-4">
            <p className="font-semibold text-xl sm:text-2xl lg:text-3xl leading-7 text-black-500">
              {card.number}
            </p>
          </aside>
        </div>
      ))}
    </section>
  );
}
