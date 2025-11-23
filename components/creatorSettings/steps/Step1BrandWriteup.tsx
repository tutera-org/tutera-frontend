"use client";

import { CustomizationFormData } from "../types";

interface Step1BrandWriteupProps {
  formData: CustomizationFormData;
  onChange: (data: Partial<CustomizationFormData>) => void;
}

export default function Step1BrandWriteup({
  formData,
  onChange,
}: Step1BrandWriteupProps) {
  return (
    <div  >
      <h2 className="text-xl font-bold text-[#101A33] bg-gray-50 md:border border-[#C3C3C3] md:bg-transparent  px-4  py-2 rounded-xl mb-4">Brand write up</h2>
      <div className="flex flex-col gap-6 bg-gray-50 md:border border-[#C3C3C3] md:bg-transparent  px-4  py-6 rounded-2xl">
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
            Bio
          </label>
          <input
            type="text"
            placeholder="About Yourself"
            value={formData.bio || ""}
            onChange={(e) => onChange({ bio: e.target.value })}
            className="w-full px-4 py-3 border border-[#878787] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4977E6] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block md:text-[20px] text-[16px] font-semibold text-[#101A33] mb-2">
            Headline
          </label>
          <input
            type="text"
            placeholder="Headline"
            value={formData.headline || ""}
            onChange={(e) => onChange({ headline: e.target.value })}
            className="w-full px-4 py-3 border border-[#878787] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4977E6] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block md:text-[20px] text-[16px] font-semibold text-[#101A33] mb-2">
            What you learn
          </label>
          <input
            type="text"
            placeholder="Add text"
            value={formData.whatYouLearn || ""}
            onChange={(e) => onChange({ whatYouLearn: e.target.value })}
            className="w-full px-4 py-3 border border-[#878787] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4977E6] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block md:text-[20px] text-[16px] font-semibold text-[#101A33] mb-2">
            What you gain
          </label>
          <input
            type="text"
            placeholder="Add text"
            value={formData.whatYouGain || ""}
            onChange={(e) => onChange({ whatYouGain: e.target.value })}
            className="w-full px-4 py-3 border border-[#878787] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4977E6] focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}

