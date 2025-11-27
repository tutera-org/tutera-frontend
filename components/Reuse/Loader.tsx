"use client";
import Image from "next/image";

interface TuteraLoadingProps {
  logoSrc?: string;
}

export default function TuteraLoading({
  logoSrc = "/logo.svg",
}: TuteraLoadingProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        {/* Logo image with pulse animation - just the logo breathing */}
        <div className="animate-pulse-slow">
          <Image
            src={logoSrc}
            alt="tutera logo"
            width={300}
            height={52}
            priority
          />
        </div>
      </div>
    </div>
  );
}
