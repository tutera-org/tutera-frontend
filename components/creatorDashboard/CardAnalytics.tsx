import Image from "next/image";

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
    <section className="grid grid-cols-3 mt-5">
      {cards.map((card, index) => (
        <div className="bg-neutral-100" key={index}>
          <aside>
            <h3>{card.title}</h3>
            <p>{card.number}</p>
          </aside>
          <aside>
            <Image
              src={"/public/cardAnalyticsIcon.svg"}
              alt="Analytics image"
              width={23.94}
              height={23.94}
            />
          </aside>
        </div>
      ))}
    </section>
  );
}
