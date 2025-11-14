"use client";

import Button from "../Reuse/Button";
import Image from "next/image";

interface EmptyStateProps {
  onCreateModule: () => void;
}

export default function EmptyState({ onCreateModule }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className=" flex items-center justify-center">
      
        
         <Image src="/book.svg" alt="Empty State" width={225} height={190} />
  
      </div>
      <h2 className="text-2xl md:text-4xl font-semibold text-[#101A33]">
        No courses yet
      </h2>
      <p className="text-[#101A33] text-center max-w-md">
        Your courses will appear here once you create them
      </p>
      <Button
        variant="primary"
        onClick={onCreateModule}
        className="md:w-[25%] w-[80%] rounded-lg text-base font-semibold"
      >
        Create Module
      </Button>
    </div>
  );
}

