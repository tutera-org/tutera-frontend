"use client";

interface CustomizationProgressStepperProps {
  currentStep: number;
}

export default function CustomizationProgressStepper({
  currentStep,
}: CustomizationProgressStepperProps) {
  const steps = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="flex flex-col mb-8 w-full px-4">
      <div className="flex items-center justify-between md:justify-center mb-4 w-full overflow-x-auto">
        {steps.map((step, index) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="flex items-center shrink-0">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center font-semibold transition-colors text-sm sm:text-base md:text-lg lg:text-xl ${
                  isCompleted
                    ? "bg-[#EED390] text-[#101A33]"
                    : isCurrent
                    ? "bg-[#EED390] text-[#101A33]"
                    : "bg-gray-200 text-[#101A33]"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-4 sm:w-8 md:w-16 lg:w-24 h-0.5 mx-1 sm:mx-2 md:mx-4 transition-colors shrink-0 ${
                    isCompleted ? "bg-[#EED390]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
