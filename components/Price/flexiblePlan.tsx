import Button from "../Reuse/Button";
import Image from "next/image";

const plans = [
  {
    name: "Basic",
    price: "₦1,000",
    period: "Per Month",
    features: [
      "Full access to course management tools",
      "Seamless course builder",
      "Default brand customization template",
      "Limited access to marketing tools",
    ],
  },
  {
    name: "Creator Pro",
    price: "₦15,000",
    period: "Per Month",
    features: [
      "Full access to course management tools",
      "Seamless course builder",
      "Basic personlized brand customization",
      "Limited access to marketing toolkit templates",
      "Creator plus",
    ],
  },
  {
    name: "Creator Plus",
    price: "₦50,000",
    period: "Per Month",
    features: [
      "Unlimited course hosting",
      "Advanced personalized brand customization",
      "Full access to marketing tools",
      "Access to all marketing toolkit templates",
      "Student progress tracking and analytics",
    ],
  },
];

const FlexiblePlan = () => {
  return (
    <section className="w-full bg-[#F0F4FF] md:pt-16 pt-4 md:pb-30 pb-10">
      <div className="w-[90%] lg:max-w-[1240px] mx-auto">
        <div className="text-center md:mb-24 mb-8 md:w-[70%] w-[90%] mx-auto">
          <h2 className="text-[1.5rem] md:text-[3.75rem] font-bold mb-4 md:leading-[72px]">
            <span className="text-[#E8C56B] text-shadow-sm">
              Flexible Plans
            </span>{" "}
            <span className="text-[#1A202C]">
              for Every Stage of Your Teaching Journey
            </span>
          </h2>
          <p className="text-[1rem] md:text-[1.25rem] font-semibold text-[#4B4B4B] max-w-3xl mx-auto">
            Whether you&apos;re launching your first course or managing a full
            academy, Tutera helps you own your brand, audience, and income on
            your terms.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="group flex-1 max-w-md rounded-[24px] shadow-lg p-6 flex flex-col bg-white hover:bg-[#4977E6] hover:text-white transition-all duration-300 transform hover:scale-105 cursor-pointer  font-medium"
            >
              <div className="flex items-start justify-between pb-4 border-b border-[#D1D1D1] hover:border-[#F6F6F6]">
                <div>
                  <h3 className="text-[1.75rem] md:text-[2rem] font-bold mb-1 group-hover:text-[#ffffff]">
                    {plan.name}
                  </h3>
                  <p className="text-[0.875rem] md:text-[1rem] opacity- group-hover:text-[#ffffff] font-semibold">
                    {plan.period}
                  </p>
                </div>
                <div className="px-4 py-2 rounded-lg bg-[#DBE4FA] text-[#0F182E] group-hover:text-[#0F182E] group-hover:bg-[#FFFFFF] transition-colors">
                  <span className="text-[1.25rem] font-semibold">
                    {plan.price}
                  </span>
                </div>
              </div>

              <ul className="flex-1 space-y-3 md:mb-32 md:mt-10 mt-10 text-[#080E10] group-hover:text-[#ffffff]">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="relative mt-0.5 shrink-0">
                      <Image
                        src="/tick1.svg"
                        alt="checkmark"
                        width={20}
                        height={20}
                        className="opacity-100 group-hover:opacity-0 transition-opacity"
                      />
                      <Image
                        src="/tick2.svg"
                        alt="checkmark"
                        width={20}
                        height={20}
                        className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <span className="text-[1rem] font-semibold">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant="primary"
                className="w-full py-3 mt-30 mb-6 text-center group-hover:bg-white group-hover:text-[#4977E6] transition-colors shadow-sm hover:bg-[#ffffffef] active:w-[95%] active:py-[10px] "
              >
                Purchase Plan
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlexiblePlan;
