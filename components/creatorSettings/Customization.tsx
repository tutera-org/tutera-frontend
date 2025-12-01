"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getLandingPage } from "@/lib/api/landingPage";

export default function Customization() {
  const [hasCustomization, setHasCustomization] = useState(false);
  const [completionStatus, setCompletionStatus] = useState({
    completed: 0,
    total: 7,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkCustomization = async () => {
      try {
        setIsLoading(true);
        const data = await getLandingPage();

        // Check if any customization data exists
        const hasData =
          data.logo ||
          data.brandName ||
          data.sections?.section1?.image ||
          data.sections?.section2?.description ||
          data.sections?.section2?.image ||
          data.sections?.section3?.description ||
          data.sections?.section3?.image ||
          data.sections?.section4?.title ||
          data.sections?.section4?.description ||
          data.sections?.section4?.image ||
          (data.sections?.section5?.testimonials &&
            data.sections.section5.testimonials.length > 0) ||
          data.socialLinks?.twitter ||
          data.socialLinks?.linkedin ||
          data.socialLinks?.youtube ||
          data.socialLinks?.instagram;

        setHasCustomization(!!hasData);

        // Calculate completion status
        let completed = 0;
        if (data.logo || data.brandName) completed++; // Step 1
        if (data.sections?.section1?.image) completed++; // Step 2
        if (
          data.sections?.section3?.description ||
          data.sections?.section3?.image
        )
          completed++; // Step 3
        if (
          data.sections?.section4?.title ||
          data.sections?.section4?.description ||
          data.sections?.section4?.image
        )
          completed++; // Step 4
        if (
          data.sections?.section2?.description ||
          data.sections?.section2?.image
        )
          completed++; // Step 5
        if (
          data.sections?.section5?.testimonials &&
          data.sections.section5.testimonials.length > 0
        )
          completed++; // Step 6
        if (
          data.socialLinks?.twitter ||
          data.socialLinks?.linkedin ||
          data.socialLinks?.youtube ||
          data.socialLinks?.instagram
        )
          completed++; // Step 7

        setCompletionStatus({ completed, total: 7 });
      } catch (error) {
        console.error("Error checking customization:", error);
        // Don't show error toast - just assume no customization exists
        setHasCustomization(false);
        setCompletionStatus({ completed: 0, total: 7 });
      } finally {
        setIsLoading(false);
      }
    };

    checkCustomization();
  }, []);
  const todo = [
    {
      title: "Profile and Bio",
      desc: "Share who you are what you teach",
    },
    {
      title: "Brand Assets",
      desc: "Update your logo, cover photo and image",
    },
    {
      title: "Visual Identity",
      desc: "Choose colors",
    },
    {
      title: "Connect Socials",
      desc: "Link your social media profiles",
    },
  ];

  return (
    <section className="mt-4 sm:mt-6 md:mt-8 lg:mt-10">
      <div className="flex flex-col gap-8 sm:gap-10 lg:gap-12">
        <div className="bg-[#F9F0DA] rounded-2xl py-4 sm:py-5 md:py-6 px-6 sm:px-8 md:px-10 flex flex-col gap-2">
          <h1 className="font-semibold text-lg sm:text-xl md:text-2xl lg:text-[1.5rem] text-neutral-900">
            Unlock Full Customization
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-[1.2rem] text-primary-400 font-semibold">
            Upgrade to Pro to access custom domains, customize brand, and more
          </p>
        </div>

        {!isLoading && hasCustomization && (
          <div className="flex items-center gap-2 md:text-[20px] text-[15px] font-semibold text-neutral-700">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Customized
            </span>
            <span className="text-neutral-600">
              {completionStatus.completed} of {completionStatus.total} steps
              completed
            </span>
          </div>
        )}

        <div>
          <h3 className="font-semibold text-lg md:text-xl lg:text-[2rem] text-[rgba(0, 0, 0, 1)]">
            What you will set up
          </h3>
          <p className="lg:text-xl text-xs sm:text-sm md:text-[0.8rem] font-semibold text-[rgba(0, 0, 0, 1)]">
            Each step is quick and easy to complete{" "}
          </p>
        </div>

        {todo.map((todo, index) => (
          <div
            className="px-3 sm:px-4 flex flex-col gap-2 text-[rgba(0, 0, 0, 1)]"
            key={index}
          >
            <h3 className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl">
              {todo.title}
            </h3>
            <p className="lg:text-base text-xs sm:text-sm md:text-base">
              {todo.desc}
            </p>
          </div>
        ))}

        <div className="flex  justify-center lg:justify-end">
          {/* Status Indicator */}

          <Link
            href={"/customization"}
            className="w-fit text-center  bg-primary-400 mt-4 text-white hover:bg-white hover:border hover:border-primary-400 hover:text-primary-400 rounded-lg py-3 px-5 font-bold cursor-pointer text-sm sm:text-base transition-colors"
          >
            {isLoading
              ? "Loading..."
              : hasCustomization
              ? "Edit Customization"
              : "Customize"}
          </Link>
        </div>
      </div>
    </section>
  );
}
