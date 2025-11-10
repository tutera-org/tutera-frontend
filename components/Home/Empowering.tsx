"use client";

import EmpoweringPrompt from "../Reuse/EmpoweringPrompt";
import { useState, useRef, useEffect } from "react";

const features = [
  {
    image: "/EmpowerImg/your-brand.svg",
    imageAlt: "Brand identity on laptop",
    title: "Your Brand, Your Rule",
    description:
      "Instantly launch your own dedicated academy: Yourname.tutera.com. You control the look, the feel, and the customer experience, cementing your brand as the trusted authority.",
    imageWidth: 371,
    imageHeight: 404,
  },
  {
    image: "/EmpowerImg/world-class.svg",
    imageAlt: "People collaborating around laptop",
    title: "World-Class Delivery",
    description:
      "Provide your learners with a professional and seamless experience. Deploy your curriculum with structured modules, robust video, and official certification.",
    imageWidth: 371,
    imageHeight: 423,
  },
  {
    image: "/EmpowerImg/marketing.svg",
    imageAlt: "Person using tablet for marketing",
    title: "Marketing Made Easy",
    description:
      "Stop staring at a blank screen. Access pre-made templates and copy ideas to promote your new storefront instantly.",
    imageWidth: 371,
    imageHeight: 218,
  },
  {
    image: "/EmpowerImg/zero-tech.svg",
    imageAlt: "Person in video recording setup",
    title: "Zero Tech Stress",
    description:
      "Instructor dashboard makes running the business easy. Easily/simply upload content, set prices, and track every sale, no friction, just consistent growth.",
    imageWidth: 371,
    imageHeight: 218,
  },
  {
    image: "/EmpowerImg/Audience.svg",
    imageAlt: "Hands writing with data charts on laptop",
    title: "Own Your Audience Data",
    description:
      "Access detailed analytics on enrollments, revenue, and content performance to make data-driven decisions and scale effectively.",
    imageWidth: 371,
    imageHeight: 218,
  },
  {
    image: "/EmpowerImg/control-pricing.svg",
    imageAlt: "Voucher cards and gift boxes",
    title: "Control Your Pricing & Offers",
    description:
      "Set your own price points, run custom promotions, and create bundles without platform interference.",
    imageWidth: 371,
    imageHeight: 382,
  },
  {
    image: "/EmpowerImg/built.svg",
    imageAlt: "Design tools illustration",
    title: "Built For Conversion",
    description:
      "Seamless, conversion-optimized purchase flows mean less friction and more sign-ups for your courses.",
    imageWidth: 371,
    imageHeight: 422,
  },
];

const Empowering = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = 310 + 16; // 310px card width + 16px gap (gap-4 = 1rem = 16px)
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardWidth = 310 + 16; // 310px card width + 16px gap
    container.scrollTo({ left: index * cardWidth, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-[#F0F4FF] md:py-24 py-10">
      <div className="w-[90%] lg:max-w-[1240px] mx-auto">
        <h2 className="lg:w-[50%] mx-auto md:text-[2.5rem] text-[1.5rem] font-semibold text-center mb-4 text-[#101A33] lg:leading-[48px]">
        Empowering Africa’s Educators and Learners to Thrive Together.
        </h2>
        <p className="lg:w-[65%] mx-auto md:text-[1.25rem] text-[1rem] font-semibold text-center md:mb-18 mb-8 text-[#4B4B4B]">Tutera is more than an LMS it’s where independent instructors, passionate learners, and creative professionals connect, grow, and succeed without limitations.</p>

        {/* Desktop: 3-column layout */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-6">
            {features.slice(0, 2).map((feature, index) => (
              <EmpoweringPrompt
                key={index}
                image={feature.image}
                imageAlt={feature.imageAlt}
                title={feature.title}
                description={feature.description}
                imageWidth={feature.imageWidth}
                imageHeight={feature.imageHeight}
              />
            ))}
          </div>
          <div className="flex flex-col gap-6">
            {features.slice(2, 5).map((feature, index) => (
              <EmpoweringPrompt
                key={index + 2}
                image={feature.image}
                imageAlt={feature.imageAlt}
                title={feature.title}
                description={feature.description}
                imageWidth={feature.imageWidth}
                imageHeight={feature.imageHeight}
              />
            ))}
          </div>
          <div className="flex flex-col gap-6">
            {features.slice(5, 7).map((feature, index) => (
              <EmpoweringPrompt
                key={index + 5}
                image={feature.image}
                imageAlt={feature.imageAlt}
                title={feature.title}
                description={feature.description}
                imageWidth={feature.imageWidth}
                imageHeight={feature.imageHeight}
              />
            ))}
          </div>
        </div>

        {/* Mobile: Horizontal scroll */}
        <div className="lg:hidden">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar"
          >
            {features.map((feature, index) => (
              <div key={index} className="w-[310px] shrink-0 snap-start">
                <EmpoweringPrompt
                  image={feature.image}
                  imageAlt={feature.imageAlt}
                  title={feature.title}
                  description={feature.description}
                  imageWidth={feature.imageWidth}
                  imageHeight={feature.imageHeight}
                />
              </div>
            ))}
          </div>

          {/* Scroll indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToCard(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeIndex === index
                    ? "bg-[#4977E6] w-8"
                    : "bg-[#4977E6] opacity-30"
                }`}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Empowering;
