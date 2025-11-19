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

        {/* Loading bar */}
        <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-linear-gradient-to-r from-blue-500 via-blue-600 to-yellow-400 rounded-full animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}
