"use client";

interface CustomizationProgressStepperProps {
  currentStep: number;
}

export default function CustomizationProgressStepper({
  currentStep,
}: CustomizationProgressStepperProps) {
  const steps = [1, 2, 3, 4];
  const stepDescriptions = [
    "Tell us about yourself and brand",
    "Upload your logo, cover photo and images",
    "Select colors that match your brand",
    "Let students find you on social media",
  ];

  return (
    <div className="flex flex-col  mb-8">
      <div className="flex items-center justify-center mb-4 md:text-[30px] text-[20px] ">
        {steps.map((step, index) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="flex items-center">
              <div
                className={`w-6 h-10 md:w-8 md:h-13 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  isCompleted
                    ? "bg-[#EED390] text-[#101A33]"
                    : isCurrent
                    ? "bg-[#EED390]"
                    : " text-[#101A33]"
                }`}
              >
                {isCompleted ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="md:w-10 md:h-10"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 md:w-30 h-0.5 mx-2 md:mx-6 transition-colors ${
                    isCompleted ? "bg-[#EED390]" : "bg-[#EED390]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[#4977E6] text-[14px] md:text-[24px] font-medium text-start my-4">
        {stepDescriptions[currentStep - 1]}
      </p>
    </div>
  );
}

