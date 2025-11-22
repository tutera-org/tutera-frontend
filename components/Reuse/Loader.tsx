import Image from "next/image";

interface TuteraLoadingProps {
  logoSrc?: string;
}

export default function TuteraLoading({
  logoSrc = "/tutera-logo.png",
}: TuteraLoadingProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-8">
        {/* Logo image with pulse animation */}
        <div className="relative">
          {/* Outer pulse rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full rounded-lg bg-blue-500 opacity-20 animate-ping" />
          </div>

          {/* Logo image */}
          <Image
            src="/logo.svg"
            alt="tutera logo"
            width={80.45}
            height={26}
            priority
          />
        </div>

        {/* Loading spinner */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    </div>
  );
}
