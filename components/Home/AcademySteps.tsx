"use client";

import Image from "next/image";
import Button from "../Reuse/Button";
import { useRouter } from "next/navigation";
const steps = [
  {
    title: "Build Your Brand",
    description:
      "Select a plan and watch your (brandname.tutera.com) storefront instantly generate.",
  },
  {
    title: "Publish Your Course",
    description:
      "Use the easy builder to load your videos, quizzes, and files.",
  },
  {
    title: "Earn Your Worth",
    description:
      "Promote your brand-new digital school and keep all the revenue.",
  },
];

const AcademySteps = () => {

  const handleSignUp = () => {
    router.push("/signUp");
  };
  const router = useRouter();
  return (
    <section className="w-full bg-[#FFFFFF] text-center">
      <div className="w-[90%] lg:max-w-[1240px] mx-auto md:pb-16 pb-6 flex flex-col items-center justify-center">
        <h2 className=" md:text-[2.5rem] text-[1.5rem] font-semibold md:py-14 py-6 lg:w-[40%] w-[90%] mx-auto text-center">
          Build Your Academy in 3 Steps.
        </h2>
        <Image
          src="/AcademySteps.png"
          alt="Academy Steps"
          width={1091}
          height={238}
          className="hidden md:block"
        
          data-aos="zoom-in"
          data-aos-duration="1000"
          data-aos-delay="0"
          data-aos-once="false"
        />
        <Image
          src="/Academy-step-mobile.png"
          alt="Academy Steps"
          width={375}
          height={375}
          className="block md:hidden"
          data-aos="fade-in"
          data-aos-duration="1000"
          data-aos-delay="0"
          data-aos-once="false"
        />

        <div className="hidden md:flex flex-row items-center justify-evenly gap-10 text-center ">
          {steps.map((step) => (
            <div key={step.title} 
            data-aos="fade-right"
            data-aos-duration="2000"
            data-aos-delay="500"
            data-aos-once="false"
            className="lg:w-[25%] space-y-4">
              <h3 className="text-[2rem] font-semibold text-[#101A33]">
                {step.title}
              </h3>
              <p className="text-[1rem] text-[#4B4B4B">{step.description}</p>
            </div>
          ))}
        </div>
        <Button
          variant="primary"
          className="py-3 mt-10 md:w-[18%] w-[50%] shadow-lg text-[1rem] font-bold"
          onClick={handleSignUp}
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="500"
          data-aos-once="false"
        >
          start now
        </Button>
      </div>
    </section>
  );
};
export default AcademySteps;
