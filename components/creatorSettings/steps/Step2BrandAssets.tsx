"use client";

import Button from "@/components/Reuse/Button";
import { CustomizationFormData } from "../types";
import Image from "next/image";

interface Step2BrandAssetsProps {
  formData: CustomizationFormData;
  onChange: (data: Partial<CustomizationFormData>) => void;
}

export default function Step2BrandAssets({
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
        <h2 className="text-xl font-bold text-[#101A33] bg-gray-50 md:border border-[#C3C3C3] md:bg-transparent rounded-xl  px-4 py-2 mb-4">Brand upload</h2>
        <div className="space-y-6 bg-gray-50 md:border border-[#C3C3C3] md:bg-transparent rounded-2xl px-4 md:px-4 py-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-[#101A33] mb-3">
              Add your brand logo
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  {formData.logo ? (
                    <Image
                      width={100}
                      height={100}
                      src={formData.logo}
                      alt="Logo"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-400"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleFileUpload("logo", e.target.files?.[0] || null)
                  }
                />
              </label>
            </div>
          </div>

          {/* Cover Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-[#101A33] mb-3">
              Add cover page
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
                  id="cover-photo-input"
                  className="hidden"
                  onChange={(e) =>
                    handleFileUpload("coverPhoto", e.target.files?.[0] || null)
                  }
                />
              </label>
              {!formData.coverPhoto && (
                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("cover-photo-input")?.click();
                  }}
                >
                  Upload image
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Image Section */}
      <div >
        <h2 className="text-xl font-bold text-[#101A33] bg-gray-50 md:border border-[#C3C3C3] md:bg-transparent px-4 md:px-4 py-2 rounded-xl mb-4">Brand image</h2>
        <div className="bg-gray-50 md:border border-[#C3C3C3] md:bg-transparent  px-4 md:px-4 py-6 rounded-2xl">
          <label className="block text-sm font-medium text-[#101A33] mb-3">
            Add brand image
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((num) => {
              const field = num === 1 ? "brandImage1" : "brandImage2";
              return (
                <label key={num} className="cursor-pointer block">
                  <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    {formData[field] ? (
                      <Image
                        width={100}
                        height={100}
                        src={formData[field] as string}
                        alt={`Brand ${num}`}
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
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(
                        field as "brandImage1" | "brandImage2",
                        e.target.files?.[0] || null
                      )
                    }
                  />
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

