export default function Enrol() {
  // New student enrollment
  const newStudents = [
    {
      img: "",
      name: "Favour Ani",
      course: "Marketing",
    },
    {
      img: "",
      name: "Randy Press",
      course: "Web 3",
    },
    {
      img: "",
      name: "Udoka John",
      course: "Designer",
    },
  ];

  //   Recently enrolled classes
  const newClasses = ["mastering Ui Design", "Frontend Fundamentals"];

  return (
    <section className="mt-10 grid grid-cols-2 gap-8">
      {/* StudentEnrol side */}
      <aside className="bg-neutral-100 p-10 rounded-xl">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-xl leading-6 text-darkBlack">
            New Students Enrollment
          </h4>
          <button className="text-xs text-primary-400 leading-4 hover:underline hover:font-bold cursor-pointer">
            View All
          </button>
        </div>

        {/* looping through enrolled students */}
        <div>
          {newStudents.map((students, index) => (
            <div className="grid grid-cols-4 gap-4" key={index}>
              <p>{students.name}</p>
              <p>{students.course}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* class Enrol side */}
      <aside className="bg-neutral-100 p-10 rounded-xl">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-xl leading-6 text-darkBlack">
            Recently Enrolled Classes
          </h4>
          <button className="text-xs text-primary-400 leading-4 hover:underline hover:font-bold cursor-pointer">
            View All
          </button>
        </div>

        <div>
          {/* Looping through the enrolled classes */}
          {newClasses.map((item, index) => (
            <p
              className="w-full px-3.5 py-5 text-base rounded-lg shadow-lg"
              key={index}
            >
              {item}
            </p>
          ))}
        </div>
      </aside>
    </section>
  );
}
