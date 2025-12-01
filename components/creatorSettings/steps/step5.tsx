"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { CustomizationFormData } from "../types";
import { uploadImage } from "@/lib/api/landingPage";
import { handleBackendApiError } from "@/lib/axiosZustandInstance";

interface Step1BrandWriteupProps {
  formData: CustomizationFormData;
  onChange: (data: Partial<CustomizationFormData>) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}

export default function MeetYourInstructor({
  formData,
  onChange,
  onUploadStart,
  onUploadEnd,
}: Step1BrandWriteupProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;

    try {
      setIsUploading(true);
      onUploadStart?.();
      // Note: This step updates section2 (About us) based on API structure
      // If it should be section3, change "section2" to "section3"
      const response = await uploadImage(file, "section2");
      onChange({
        sections: {
          ...formData.sections,
          section2: {
            ...formData.sections.section2,
            image: response.url,
          },
        },
      });
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(handleBackendApiError(error));
    } finally {
      setIsUploading(false);
      onUploadEnd?.();
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-15 bg-gray-50 md:border border-[#C3C3C3] md:bg-transparent px-4 py-6 rounded-2xl">
        <div>
          <label className="block md:text-[20px] text-[16px] font-semibold text-[#101A33] mb-2">
            Description
          </label>
          <textarea
            placeholder="Enter description about your instructor"
            value={formData.sections.section2.description || ""}
            onChange={(e) =>
              onChange({
                sections: {
                  ...formData.sections,
                  section2: {
                    ...formData.sections.section2,
                    description: e.target.value,
                  },
                },
              })
            }
            className="w-full px-4 py-3 border border-[#878787] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4977E6] focus:border-transparent min-h-[100px]"
            rows={4}
          />
        </div>

        <div>
          <label className="block md:text-[20px] text-[16px] font-semibold text-[#101A33] mb-6">
            Add Image
          </label>
          <label className="cursor-pointer block">
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4977E6] mb-2"></div>
                  <span className="text-gray-500 text-sm">Uploading...</span>
                </div>
              ) : formData.sections.section2.image ? (
                <Image
                  src={formData.sections.section2.image}
                  width={800}
                  height={200}
                  alt="Meet Your Instructor"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-400 mb-2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-gray-500 text-sm">Choose file</span>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              id="section2-image-input"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload(file);
                }
              }}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
