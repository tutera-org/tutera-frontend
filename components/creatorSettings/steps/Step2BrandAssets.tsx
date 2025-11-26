"use client";

import Button from "@/components/Reuse/Button";
import { CustomizationFormData } from "../types";
import Image from "next/image";

interface Step2BrandAssetsProps {
  formData: CustomizationFormData;
  onChange: (data: Partial<CustomizationFormData>) => void;
}

export default function HeroImage({
  formData,
  onChange,
}: Step2BrandAssetsProps) {
  const handleFileUpload = (
    field: "logo" | "coverPhoto" | "brandImage1" | "brandImage2",
    file: File | null
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-10">
      {/* Brand Upload Section */}
      <div className="">
        <div className="space-y-6 bg-gray-50 md:border border-[#C3C3C3] md:bg-transparent rounded-2xl px-4 md:px-4 py-6">
          {/* Logo Upload */}
          <div>
            {/* Cover Photo Upload */}
            <div>
              <label className="block md:text-[20px] text-[16px] font-semibold text-[#101A33] mb-6">
                Add Hero Image
              </label>
              <div>
                <label className="cursor-pointer block">
                  <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    {formData.coverPhoto ? (
                      <Image
                        src={formData.coverPhoto}
                        width={100}
                        height={100}
                        alt="Cover"
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
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span className="text-gray-500 text-sm">
                          Choose file
                        </span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    id="cover-photo-input"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(
                        "coverPhoto",
                        e.target.files?.[0] || null
                      )
                    }
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
