"use client";

import Button from "@/components/Reuse/Button";
import { CustomizationFormData } from "../types";

interface Step3ColorThemeProps {
  formData: CustomizationFormData;
  onChange: (data: Partial<CustomizationFormData>) => void;
}

const colorThemes = [
  {
    name: "Professional Blue",
    colors: ["#1E3A8A", "#3B82F6", "#93C5FD"],
  },
  {
    name: "Modern orange",
    colors: ["#C2410C", "#F97316", "#FED7AA"],
  },
  {
    name: "Modern yellow",
    colors: ["#A16207", "#EAB308", "#FEF08A"],
  },
  {
    name: "Creative green",
    colors: ["#14532D", "#22C55E", "#86EFAC"],
  },
];

export default function Step3ColorTheme({
  formData,
  onChange,
}: Step3ColorThemeProps) {
  return (
    <div>
      <h2 className="text-sm md:text-xl font-bold text-[#101A33] bg-gray-50 md:border border-[#C3C3C3] rounded-xl md:bg-transparent px-4 py-2 mb-6">
        Choose best colour for your brand
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 md:border border-[#C3C3C3] md:bg-transparent px-4 py-6 rounded-[16px] ">
        {colorThemes.map((theme) => (
          <div
            key={theme.name}
            className="bg-white rounded-lg shadow-md p-6 border-2 border-transparent hover:border-[#4977E6] transition-colors"
          >
            <h3 className=" text-lg font-semibold text-[#101A33] mb-4">
              {theme.name}
            </h3>
            <div className="flex gap-3 mb-4">
              {theme.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-16 h-16 rounded-lg"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <Button
              variant={formData.colorTheme === theme.name ? "primary" : "secondary"}
              className="w-full"
              onClick={() => onChange({ colorTheme: theme.name })}
            >
              {formData.colorTheme === theme.name ? "Selected" : "Select"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

