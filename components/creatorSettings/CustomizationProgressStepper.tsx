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
    <div className="flex flex-col items-center mb-8">
      <div className="flex items-center justify-center mb-4">
        {steps.map((step, index) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  isCompleted
                    ? "bg-[#0EB137] text-white"
                    : isCurrent
                    ? "bg-[#EED390] text-[#101A33]"
                    : "bg-[#E1E1E1] text-[#101A33]"
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
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 transition-colors ${
                    isCompleted ? "bg-[#EED390]" : "bg-[#E1E1E1]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[#4977E6] text-sm font-medium">
        {stepDescriptions[currentStep - 1]}
      </p>
    </div>
  );
}

