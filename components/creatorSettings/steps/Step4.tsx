"use client";

import Image from "next/image";
import { CustomizationFormData } from "../types";

interface Step1BrandWriteupProps {
  formData: CustomizationFormData;
  onChange: (data: Partial<CustomizationFormData>) => void;
}

export default function WhatYouWillLearn({
  formData,
  onChange,
}: Step1BrandWriteupProps) {
  return (
    <div>
      <div className="flex flex-col gap-15 bg-gray-50 md:border border-[#C3C3C3] md:bg-transparent px-4 py-6 rounded-2xl">
        <div>
          <label className="block md:text-[20px] text-[16px] font-semibold text-[#101A33] mb-2">
            Description
          </label>
          <input
            type="text"
            placeholder="Name"
            // value={formData.brandName || ""}
            // onChange={(e) => onChange({ brandName: e.target.value })}
            className="w-full px-4 py-3 border border-[#878787] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4977E6] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block md:text-[20px] text-[16px] font-semibold text-[#101A33] mb-6">
            Add Image
          </label>
          <label className="cursor-pointer block">
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"></div>
            <input
              type="file"
              accept="image/*"
              id="cover-photo-input"
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
