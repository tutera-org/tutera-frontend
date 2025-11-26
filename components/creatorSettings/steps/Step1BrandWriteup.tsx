"use client";

import Image from "next/image";
import { CustomizationFormData } from "../types";

interface Step1BrandWriteupProps {
  formData: CustomizationFormData;
  onChange: (data: Partial<CustomizationFormData>) => void;
}

export default function BrandSetUp({
  formData,
  onChange,
}: Step1BrandWriteupProps) {
  return (
    <div>
      <div className="flex flex-col gap-15 bg-gray-50 md:border border-[#C3C3C3] md:bg-transparent  px-4  py-6 rounded-2xl">
        <div>
          <label className="block md:text-[20px] text-[16px] font-semibold text-[#101A33] mb-2">
            Brand name
          </label>
          <input
            type="text"
            placeholder="Name"
            value={formData.brandName || ""}
            onChange={(e) => onChange({ brandName: e.target.value })}
            className="w-full px-4 py-3 border border-[#878787] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4977E6] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block md:text-[20px] text-[16px] font-semibold text-[#101A33] mb-2">
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
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
