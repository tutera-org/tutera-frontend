export default function GettingStarted() {
  const steps = [
    {
      title: "Complete your profile",
      text: "Add a bio, photo, and expertise areas",
    },
    {
      title: "Create your first course",
      text: "Upload video, add lessons, and structure content",
    },
    {
      title: "Set up your payment",
      text: "Configure pricing and payment methods",
    },
    {
      title: "Publish and share",
      text: "Launch your course and start enrolling students",
    },
  ];
  return (
    <section className="my-6 sm:my-10 md:my-15 bg-neutral-100 shadow-md rounded-2xl p-5 sm:p-6 md:p-8">
      <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight text-neutral-900">
        Getting Started
      </h3>
      <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg leading-relaxed text-neutral-700">
        Complete these steps to launch your teaching journey
      </p>

      <ul className="mt-5 sm:mt-6 md:mt-8 flex flex-col gap-3 sm:gap-4">
        {steps.map((step, index) => (
          <li
            key={index}
            className="bg-neutral-200 rounded-xl p-4 sm:p-5 md:p-6 transition-all hover:bg-neutral-300"
          >
            {/* Step items */}
            <h4 className="text-neutral-900 font-semibold text-base sm:text-lg md:text-xl leading-tight">
              {step.title}
            </h4>
            <p className="text-neutral-700 text-sm sm:text-base leading-relaxed mt-2">
              {step.text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
