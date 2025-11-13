export default function CourseOverview() {
  const courses = [
    {
      id: 1,
      name: "UI/UX Design Masterclass",
      pricing: "15,000",
      studentCount: 110,
      studentAvatars: [
        "Ansah Chikeh",
        "Ansah Chikeh",
        "Ansah Chikeh",
        "Ansah Chikeh",
      ],
    },
    {
      id: 2,
      name: "Back-End Advance",
      pricing: "10,000",
      studentCount: 4,
      studentAvatars: [
        "Ansah Chikeh",
        "Ansah Chikeh",
        "Ansah Chikeh",
        "Ansah Chikeh",
      ],
    },
    {
      id: 3,
      name: "Front-End Fundamentals",
      pricing: "5,000",
      studentCount: 2,
      studentAvatars: [
        "Ansah Chikeh",
        "Ansah Chikeh0",
        "Ansah Chikeh1",
        "Ansah Chikeh2",
      ],
    },
  ];
  return (
    <section className="mt-10 py-2.5 rounded-xl p-5 bg-neutral-100 flex flex-col gap-10">
      <aside className="flex justify-between ">
        {/* Tittle */}
        <h3 className="font-semibold text-2xl leading-8 text-neutral-900">
          Course Overview
        </h3>
        <button className="text-primary-400 font-semibold leading-5 text-base hover:underline cursor-pointer">
          More Details
        </button>
      </aside>

      <aside>
        {/* Course pricing students summary */}

        <div className="grid grid-cols-4">
          <aside className="col-span-2">
            <h3 className="font-semibold text-[24px] text-">Courses</h3>
          </aside>
          <aside>
            <h3>Pricing</h3>
          </aside>
          <aside>
            <h3>Students</h3>
          </aside>
        </div>
      </aside>
    </section>
  );
}
