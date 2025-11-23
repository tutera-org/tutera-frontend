"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Reuse/Button";
import CustomizationProgressStepper from "./CustomizationProgressStepper";
import Step1BrandWriteup from "./steps/Step1BrandWriteup";
import Step2BrandAssets from "./steps/Step2BrandAssets";
import Step3ColorTheme from "./steps/Step3ColorTheme";
import Step4SocialMedia from "./steps/Step4SocialMedia";
import { CustomizationFormData } from "./types";

export default function CustomizationForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CustomizationFormData>({});

  // Store step in localStorage to hide navbar
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tutera_customization_step", currentStep.toString());
    }
  }, [currentStep]);

  // Clear customization step when component unmounts (user leaves customization)
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("tutera_customization_step");
      }
    };
  }, []);

  const stepTitles = [
    "Lets start with your profile",
    "Brand assets",
    "Choose your color theme",
    "Connect your socials",
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle form submission
      console.log("Form submitted:", formData);
      // You can add API call here to save the data
      alert("Customization saved successfully!");
      // Clear customization step to show navbar again
      if (typeof window !== "undefined") {
        localStorage.removeItem("tutera_customization_step");
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleFormDataChange = (data: Partial<CustomizationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="min-h-screen py-4">
      <div className="md:w-[80%]  mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="md:text-[32px] text-[20px] font-bold text-[#101A33]  mb-2">
            {stepTitles[currentStep - 1]}
          </h1>
          <button
            onClick={handleBack}
            className="text-[#101A33] hover:text-[#4977E6] md:text-[20px] text-[16px] font-Bold "
          >
            &lt; Back
          </button>
        </div>

        {/* Progress Stepper */}
        <CustomizationProgressStepper currentStep={currentStep} />

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && (
            <Step1BrandWriteup
              formData={formData}
              onChange={handleFormDataChange}
            />
          )}
          {currentStep === 2 && (
            <Step2BrandAssets
              formData={formData}
              onChange={handleFormDataChange}
            />
          )}
          {currentStep === 3 && (
            <Step3ColorTheme
              formData={formData}
              onChange={handleFormDataChange}
            />
          )}
          {currentStep === 4 && (
            <Step4SocialMedia
              formData={formData}
              onChange={handleFormDataChange}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center md:justify-end gap-4">
          {currentStep > 1 && (
            <Button
              variant="secondary"
              onClick={handlePrevious}
              className="px-8"
            >
              Previous
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleNext}
            className="px-12 py-2.5"
          >
            {currentStep === 4 ? "Done" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Export the type for use in other components if needed
export type { CustomizationFormData };
