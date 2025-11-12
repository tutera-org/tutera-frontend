"use client";

interface ProgressStepperProps {
  currentStep: number;
}

export default function ProgressStepper({ currentStep }: ProgressStepperProps) {
  const steps = [
    { number: 1, label: "Basic Info", icon: "📄" },
    { number: 2, label: "Content", icon: "🎥" },
    { number: 3, label: "Set Up", icon: "⚙️" },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        const isUpcoming = step.number > currentStep;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isCurrent
                    ? "bg-yellow-100 border-yellow-500 text-yellow-700"
                    : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="text-lg">{step.icon}</span>
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  isCurrent
                    ? "text-[#4977E6]"
                    : isCompleted
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-24 h-1 mx-4 transition-colors ${
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

