import { IoAnalyticsSharp } from "react-icons/io5";

export default function CardAnalytics() {
  const cards = [
    {
      title: "Total Users",
      number: "5000",
    },
    {
      title: "Courses",
      number: "6",
    },
    {
      title: "Earnings",
      number: "670000",
    },
  ];
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 mt-5 gap-y-4 gap-x-8">
      {cards.map((card, index) => (
        <div className="bg-neutral-100 rounded-xl p-5" key={index}>
          <aside className="flex justify-between items-start">
            <h3 className="font-semibold text-xs lg:text-2xl leading-4 md:leading-8 text-neutrals-900">
              {card.title}
            </h3>
            <div className="bg-secondary-400 p-0.5 px-3.5 rounded-full">
              <IoAnalyticsSharp className="text-white text-base" />
            </div>
          </aside>
          <aside className="mt-5 lg:text-base text-xs leading-3 md:leading-5 text-Black">
            <p>{card.number}</p>
          </aside>
        </div>
      ))}
    </section>
  );
}
