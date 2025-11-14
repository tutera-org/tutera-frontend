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
    <section className="mt-7 sm:mt-10 bg-neutral-100 rounded-xl p-4 sm:p-5">
      <h3 className="text-2xl sm:text-[2rem] font-semibold leading-8 sm:leading-10 text-neutral-900">
        Getting Started
      </h3>
      <p className="mt-2 text-lg sm:text-2xl leading-8 sm:leading-8 text-neutral-900">
        Complete these steps to launch your teaching journey
      </p>

      <ul className="mt-4 sm:mt-7 flex flex-col gap-2 sm:gap-4">
        {steps.map((step, index) => (
          <li
            key={index}
            className="bg-neutral-200 rounded-xl flex flex-col gap-5 py-5 sm:py-5 px-8 sm:px-8"
          >
            {/* Step items */}
            <span className="text-neutral-900 font-semibold text-lg sm:text-2xl leading-6 sm:leading-8">
              {step.title}
            </span>
            <span className="text-neutral-700 text-base sm:text-xl leading-5 sm:leading-6 mt-1 sm:mt-2">
              {step.text}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
