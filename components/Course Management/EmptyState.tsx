"use client";

import Button from "../Reuse/Button";
import Image from "next/image";

interface EmptyStateProps {
  onCreateModule: () => void;
}

export default function EmptyState({ onCreateModule }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-dashed border-gray-400 rounded-full"></div>
        <div className="relative z-10">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-600"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <path d="M8 7h8" />
            <path d="M8 11h8" />
          </svg>
        </div>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-[#101A33]">
        No courses yet
      </h2>
      <p className="text-gray-500 text-center max-w-md">
        Your courses will appear here once you create them
      </p>
      <Button
        variant="primary"
        onClick={onCreateModule}
        className="px-6 py-3 rounded-lg text-base font-semibold"
      >
        Create Module
      </Button>
    </div>
  );
}

