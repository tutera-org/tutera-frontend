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

export default function Testimonials({
  formData,
  onChange,
  onUploadStart,
  onUploadEnd,
}: Step1BrandWriteupProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const testimonials = formData.sections.section5.testimonials || [];

  const handleImageUpload = async (file: File | null, index: number) => {
    if (!file) return;

    try {
      setUploadingIndex(index);
      onUploadStart?.();
      const response = await uploadImage(file, "section5", index);
      const updatedTestimonials = [...testimonials];
      updatedTestimonials[index] = {
        ...updatedTestimonials[index],
        image: response.url,
      };
      onChange({
        sections: {
          ...formData.sections,
          section5: {
            testimonials: updatedTestimonials,
          },
        },
      });
      toast.success("Testimonial image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading testimonial image:", error);
      toast.error(handleBackendApiError(error));
    } finally {
      setUploadingIndex(null);
      onUploadEnd?.();
    }
  };

  const addTestimonial = () => {
    const updatedTestimonials = [
      ...testimonials,
      {
        image: "",
        name: "",
        jobTitle: "",
        remark: "",
      },
    ];
    onChange({
      sections: {
        ...formData.sections,
        section5: {
          testimonials: updatedTestimonials,
        },
      },
    });
  };

  const removeTestimonial = (index: number) => {
    const updatedTestimonials = testimonials.filter((_, i) => i !== index);
    onChange({
      sections: {
        ...formData.sections,
        section5: {
          testimonials: updatedTestimonials,
        },
      },
    });
  };

  const updateTestimonial = (
    index: number,
    field: "name" | "jobTitle" | "remark",
    value: string
  ) => {
    const updatedTestimonials = [...testimonials];
    updatedTestimonials[index] = {
      ...updatedTestimonials[index],
      [field]: value,
    };
    onChange({
      sections: {
        ...formData.sections,
        section5: {
          testimonials: updatedTestimonials,
        },
      },
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-gray-50 md:border border-[#C3C3C3] md:bg-transparent px-4 py-6 rounded-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="md:text-[20px] text-[16px] font-semibold text-[#101A33]">
                Testimonial {index + 1}
              </h3>
              {testimonials.length > 1 && (
                <button
                  onClick={() => removeTestimonial(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block md:text-[16px] text-[14px] font-semibold text-[#101A33] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={testimonial.name || ""}
                  onChange={(e) =>
                    updateTestimonial(index, "name", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-[#878787] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4977E6] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block md:text-[16px] text-[14px] font-semibold text-[#101A33] mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="Enter Job Title"
                  value={testimonial.jobTitle || ""}
                  onChange={(e) =>
                    updateTestimonial(index, "jobTitle", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-[#878787] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4977E6] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block md:text-[16px] text-[14px] font-semibold text-[#101A33] mb-2">
                  Remark
                </label>
                <textarea
                  placeholder="Enter Remark"
                  value={testimonial.remark || ""}
                  onChange={(e) =>
                    updateTestimonial(index, "remark", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-[#878787] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4977E6] focus:border-transparent min-h-[80px]"
                  rows={3}
                />
              </div>

              <div>
                <label className="block md:text-[16px] text-[14px] font-semibold text-[#101A33] mb-2">
                  Add Image
                </label>
                <label className="cursor-pointer block">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
                    {uploadingIndex === index ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4977E6] mb-2"></div>
                        <span className="text-gray-500 text-xs">Uploading...</span>
                      </div>
                    ) : testimonial.image ? (
                      <Image
                        src={testimonial.image}
                        width={128}
                        height={128}
                        alt="Testimonial"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-gray-400 mb-1"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span className="text-gray-500 text-xs">Choose file</span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file, index);
                      }
                    }}
                    disabled={uploadingIndex === index}
                  />
                </label>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addTestimonial}
          className="bg-[#4977E6] text-white px-6 py-3 rounded-lg hover:bg-[#3d66d4] transition-colors font-semibold"
        >
          + Add Testimonial
        </button>
      </div>
    </div>
  );
}
