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
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-xl font-bold text-[#101A33] mb-6">Brand write up</h2>
      <div className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-[#101A33] mb-2">
            Brand name
          </label>
          <input
            type="text"
            placeholder="Name"
            value={formData.brandName || ""}
            onChange={(e) => onChange({ brandName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#101A33] mb-2">
            Bio
          </label>
          <input
            type="text"
            placeholder="About Yourself"
            value={formData.bio || ""}
            onChange={(e) => onChange({ bio: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#101A33] mb-2">
            Headline
          </label>
          <input
            type="text"
            placeholder="Headline"
            value={formData.headline || ""}
            onChange={(e) => onChange({ headline: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#101A33] mb-2">
            What you learn
          </label>
          <input
            type="text"
            placeholder="Add text"
            value={formData.whatYouLearn || ""}
            onChange={(e) => onChange({ whatYouLearn: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#101A33] mb-2">
            What you gain
          </label>
          <input
            type="text"
            placeholder="Add text"
            value={formData.whatYouGain || ""}
            onChange={(e) => onChange({ whatYouGain: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6] focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}

