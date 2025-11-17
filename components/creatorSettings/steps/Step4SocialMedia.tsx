"use client";

import { CustomizationFormData } from "../types";

interface Step4SocialMediaProps {
  formData: CustomizationFormData;
  onChange: (data: Partial<CustomizationFormData>) => void;
}

export default function Step4SocialMedia({
  formData,
  onChange,
}: Step4SocialMediaProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-xl font-bold text-[#101A33] mb-6">Social media links</h2>
      <div className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-[#101A33] mb-2">
            Twitter
          </label>
          <input
            type="url"
            placeholder="https://twitter.com/@username"
            value={formData.twitter || ""}
            onChange={(e) => onChange({ twitter: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#101A33] mb-2">
            LinkedIn
          </label>
          <input
            type="url"
            placeholder="https://linkedin.com/in/@username"
            value={formData.linkedin || ""}
            onChange={(e) => onChange({ linkedin: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#101A33] mb-2">
            Youtube
          </label>
          <input
            type="url"
            placeholder="https://youtube.com/in/@username"
            value={formData.youtube || ""}
            onChange={(e) => onChange({ youtube: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#101A33] mb-2">
            Instagram
          </label>
          <input
            type="url"
            placeholder="https://instagram.com/in/@username"
            value={formData.instagram || ""}
            onChange={(e) => onChange({ instagram: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6] focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}

