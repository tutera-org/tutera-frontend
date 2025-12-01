"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/Reuse/Button";
import CustomizationProgressStepper from "./CustomizationProgressStepper";
import BrandSetUp from "./steps/Step1BrandWriteup";
import HeroImage from "./steps/Step2BrandAssets";
import Step4SocialMedia from "./steps/Step4SocialMedia";
import { CustomizationFormData } from "./types";
import LearnHereSection from "./steps/Step3ColorTheme";
import WhatYouWillLearn from "./steps/Step4";
import MeetYourInstructor from "./steps/step5";
import Testimonials from "./steps/step6";
import { getLandingPage, patchLandingPage } from "@/lib/api/landingPage";
import { handleBackendApiError } from "@/lib/axiosZustandInstance";
import { getAuthToken } from "@/store/authStore";

export default function CustomizationForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [formData, setFormData] = useState<CustomizationFormData>({
    logo: "",
    brandName: "",
    socialLinks: {
      twitter: "",
      linkedin: "",
      youtube: "",
      instagram: "",
    },
    sections: {
      section1: {
        image: "",
      },
      section2: {
        description: "",
        image: "",
      },
      section3: {
        description: "",
        image: "",
      },
      section4: {
        title: "",
        description: "",
        image: "",
      },
      section5: {
        testimonials: [],
      },
    },
  });

  // Load existing landing page data on mount
  useEffect(() => {
    const loadLandingPage = async () => {
      // Wait a bit for Zustand to hydrate from localStorage
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check if token exists before making API call
      const token = getAuthToken();
      console.log("🔍 [AUTH CHECK] Token exists:", !!token);

      if (!token) {
        console.error("❌ [AUTH] No token found. Checking localStorage...");

        // Double-check localStorage directly
        const stored = localStorage.getItem("auth-storage");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.state?.token) {
              console.log(
                "✅ [AUTH] Token found in localStorage, but not in store. This is a hydration issue."
              );
              // Wait a bit more and try again
              await new Promise((resolve) => setTimeout(resolve, 200));
              const tokenAfterWait = getAuthToken();
              if (!tokenAfterWait) {
                console.error(
                  "❌ [AUTH] Token still not available after wait. Redirecting..."
                );
                toast.error("Please log in to access customization");
                router.push("/signIn");
                return;
              }
            } else {
              console.error(
                "❌ [AUTH] No token in localStorage. Redirecting..."
              );
              toast.error("Please log in to access customization");
              router.push("/signIn");
              return;
            }
          } catch (e) {
            console.error("❌ [AUTH] Error parsing localStorage:", e);
            toast.error("Please log in to access customization");
            router.push("/signIn");
            return;
          }
        } else {
          console.error(
            "❌ [AUTH] No auth-storage in localStorage. Redirecting..."
          );
          toast.error("Please log in to access customization");
          router.push("/signIn");
          return;
        }
      }

      try {
        setIsLoading(true);
        const data = await getLandingPage();

        // Map API response to form data
        setFormData({
          logo: data.logo || "",
          brandName: data.brandName || "",
          socialLinks: {
            twitter: data.socialLinks?.twitter || "",
            linkedin: data.socialLinks?.linkedin || "",
            youtube: data.socialLinks?.youtube || "",
            instagram: data.socialLinks?.instagram || "",
          },
          sections: {
            section1: {
              image: data.sections?.section1?.image || "",
            },
            section2: {
              description: data.sections?.section2?.description || "",
              image: data.sections?.section2?.image || "",
            },
            section3: {
              description: data.sections?.section3?.description || "",
              image: data.sections?.section3?.image || "",
            },
            section4: {
              title: data.sections?.section4?.title || "",
              description: data.sections?.section4?.description || "",
              image: data.sections?.section4?.image || "",
            },
            section5: {
              testimonials: data.sections?.section5?.testimonials || [],
            },
          },
        });
      } catch (error: unknown) {
        console.error("Error loading landing page:", error);

        // Check if it's an axios error
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as { response?: { status?: number } };

          // If it's a 401, the interceptor will handle redirect
          // Don't show duplicate error message
          if (axiosError.response?.status !== 401) {
            toast.error(handleBackendApiError(error));
          }

          // If 401, don't set loading to false - let the redirect happen
          if (axiosError.response?.status === 401) {
            return;
          }
        } else {
          toast.error(handleBackendApiError(error));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadLandingPage();
  }, [router]);

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
    "Brand Setup",
    "Hero Section",
    "Why Learn Here",
    "What You'll Learn Here",
    "Meet Your Instructor",
    "Testimonials From Students",
    "Social Media Links",
  ];

  const saveCurrentStep = async () => {
    try {
      setIsSaving(true);

      // Prepare data to save based on current step
      let dataToSave: Partial<CustomizationFormData> = {};

      if (currentStep === 1) {
        // Save logo and brandName
        dataToSave = {
          logo: formData.logo,
          brandName: formData.brandName,
        };
      } else if (currentStep === 2) {
        // Save section1 (Hero)
        dataToSave = {
          sections: {
            section1: formData.sections.section1,
          },
        } as Parameters<typeof patchLandingPage>[0];
      } else if (currentStep === 3) {
        // Save section3 (Why Learn Here)
        dataToSave = {
          sections: {
            section3: formData.sections.section3,
          },
        } as Parameters<typeof patchLandingPage>[0];
      } else if (currentStep === 4) {
        // Save section4 (What You'll Learn)
        dataToSave = {
          sections: {
            section4: formData.sections.section4,
          },
        } as Parameters<typeof patchLandingPage>[0];
      } else if (currentStep === 5) {
        // Save section2 (Meet Instructor / About us)
        dataToSave = {
          sections: {
            section2: formData.sections.section2,
          },
        } as Parameters<typeof patchLandingPage>[0];
      } else if (currentStep === 6) {
        // Save section5 (Testimonials)
        dataToSave = {
          sections: {
            section5: formData.sections.section5,
          },
        } as Parameters<typeof patchLandingPage>[0];
      } else if (currentStep === 7) {
        // Save socialLinks
        dataToSave = {
          socialLinks: formData.socialLinks,
        };
      }

      // Remove empty fields before sending to prevent validation errors
      const cleanedData = removeEmptyFields(dataToSave);

      // Only send if there's actual data to update (must be an object, not array or primitive)
      if (
        cleanedData &&
        typeof cleanedData === "object" &&
        !Array.isArray(cleanedData) &&
        Object.keys(cleanedData).length > 0
      ) {
        await patchLandingPage(
          cleanedData as Parameters<typeof patchLandingPage>[0]
        );
      } else {
        console.log("No data to save - all fields are empty");
        // Don't throw error, just skip the API call
      }
    } catch (error) {
      console.error("Error saving landing page:", error);
      toast.error(handleBackendApiError(error));
      throw error; // Re-throw to prevent navigation on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < 7) {
      try {
        // Save current step before moving to next
        await saveCurrentStep();
        setCurrentStep(currentStep + 1);
        // Auto-scroll to top when moving to next step
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch {
        // Error already handled in saveCurrentStep
        // Don't navigate if save failed
      }
    } else {
      // Final step - save and complete
      try {
        await saveCurrentStep();
        toast.success("Customization saved successfully!");
        // Clear customization step to show navbar again
        if (typeof window !== "undefined") {
          localStorage.removeItem("tutera_customization_step");
        }
        // Optionally redirect or show success message
        router.back();
      } catch {
        // Error already handled in saveCurrentStep
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Auto-scroll to top when moving to previous step
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleFormDataChange = (data: Partial<CustomizationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleUploadStart = () => {
    setIsImageUploading(true);
  };

  const handleUploadEnd = () => {
    setIsImageUploading(false);
  };

  /**
   * Remove empty fields from the payload before sending to backend
   * This prevents validation errors for empty required fields
   * Only affects PATCH requests - GET requests are unaffected
   */
  const removeEmptyFields = (
    obj: unknown
  ):
    | Record<string, unknown>
    | unknown[]
    | string
    | number
    | boolean
    | undefined => {
    if (obj === null || obj === undefined) {
      return undefined;
    }

    // Handle arrays - clean items but preserve array structure
    if (Array.isArray(obj)) {
      const cleanedArray = obj
        .map((item) => removeEmptyFields(item))
        .filter((item) => item !== undefined);
      // Return array if it has items, undefined if empty
      return cleanedArray.length > 0 ? cleanedArray : undefined;
    }

    // Handle objects
    if (typeof obj === "object") {
      const cleaned: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        // Skip empty strings
        if (value === "") {
          continue;
        }
        // Skip null/undefined
        if (value === null || value === undefined) {
          continue;
        }
        // Recursively clean nested objects
        const cleanedValue = removeEmptyFields(value);
        // Only include if cleaned value is not undefined
        if (cleanedValue !== undefined) {
          cleaned[key] = cleanedValue;
        }
      }
      // Return undefined if object is empty after cleaning
      return Object.keys(cleaned).length > 0 ? cleaned : undefined;
    }

    // Return primitive values as-is (for strings, numbers, booleans)
    // At this point, obj must be a primitive since we've handled objects and arrays
    if (
      typeof obj === "string" ||
      typeof obj === "number" ||
      typeof obj === "boolean"
    ) {
      return obj;
    }
    // Fallback for any other type
    return undefined;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4977E6] mx-auto mb-4"></div>
          <p className="text-[#101A33]">Loading customization data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4">
      <div className="md:w-[80%]  mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="md:text-[32px] text-[20px] font-bold text-[#101A33] mb-2">
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
            <BrandSetUp
              formData={formData}
              onChange={handleFormDataChange}
              onUploadStart={handleUploadStart}
              onUploadEnd={handleUploadEnd}
            />
          )}
          {currentStep === 2 && (
            <HeroImage
              formData={formData}
              onChange={handleFormDataChange}
              onUploadStart={handleUploadStart}
              onUploadEnd={handleUploadEnd}
            />
          )}
          {currentStep === 3 && (
            <LearnHereSection
              formData={formData}
              onChange={handleFormDataChange}
              onUploadStart={handleUploadStart}
              onUploadEnd={handleUploadEnd}
            />
          )}
          {currentStep === 4 && (
            <WhatYouWillLearn
              formData={formData}
              onChange={handleFormDataChange}
              onUploadStart={handleUploadStart}
              onUploadEnd={handleUploadEnd}
            />
          )}
          {currentStep === 5 && (
            <MeetYourInstructor
              formData={formData}
              onChange={handleFormDataChange}
              onUploadStart={handleUploadStart}
              onUploadEnd={handleUploadEnd}
            />
          )}
          {currentStep === 6 && (
            <Testimonials
              formData={formData}
              onChange={handleFormDataChange}
              onUploadStart={handleUploadStart}
              onUploadEnd={handleUploadEnd}
            />
          )}
          {currentStep === 7 && (
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
            className={`px-12 py-2.5 transition-all ${
              isImageUploading || isSaving
                ? "opacity-60 blur-[1px] cursor-not-allowed"
                : ""
            }`}
            disabled={isImageUploading || isSaving}
          >
            {isSaving ? "Saving..." : currentStep === 7 ? "Done" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Export the type for use in other components if needed
export type { CustomizationFormData };
