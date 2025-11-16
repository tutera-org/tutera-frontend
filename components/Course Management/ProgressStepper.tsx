"use client";

import Image from "next/image";

interface ProgressStepperProps {
  currentStep: number;
}

export default function ProgressStepper({ currentStep }: ProgressStepperProps) {
  const steps = [
    { number: 1, label: "Basic Info", icon: "/document.svg" },
    { number: 2, label: "Content", icon: "/video.svg" },
    { number: 3, label: "Set Up", icon: "/setting.svg" },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isCurrent = step.number === currentStep;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${
                  isCompleted
                    ? "bg-[#0EB137] text-black"
                    : isCurrent
                    ? "bg-[#EED390] border-none"
                    : "bg-[#E1E1E1] border-none"
                }`}
              >
                {isCompleted ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <Image
                    src={step.icon}
                    alt={step.label}
                    width={30}
                    height={30}
                    className="object-contain"
                  />
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  isCurrent
                    ? "text-[#4977E6]"
                    : isCompleted
                    ? "text-[#0EB137]"
                    : "text-[#000000]"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-40 h-1 mx-10 transition-colors ${
                  isCompleted ? "bg-[#0EB137]" : "bg-[#5D5D5D]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
