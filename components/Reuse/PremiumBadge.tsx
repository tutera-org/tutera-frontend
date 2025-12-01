import React from "react";

interface PremiumBadgeProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gold" | "gradient";
  showIcon?: boolean;
  className?: string;
}

export default function PremiumBadge({
  size = "md",
  variant = "default",
  showIcon = true,
  className = "",
}: PremiumBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const variantClasses = {
    default: "bg-yellow-500 text-white",
    gold: "bg-gradient-to-r from-yellow-600 to-yellow-400 text-white",
    gradient:
      "bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 text-white",
  };

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 
        rounded-full font-semibold
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {showIcon && (
        <svg
          className={iconSizes[size]}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      <span>Premium</span>
    </div>
  );
}

// Usage Examples:
// <PremiumBadge />
// <PremiumBadge size="sm" variant="gold" />
// <PremiumBadge size="lg" variant="gradient" showIcon={false} />
// <PremiumBadge className="shadow-lg" />
