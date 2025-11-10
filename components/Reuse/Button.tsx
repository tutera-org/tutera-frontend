import React from "react";

type ButtonProps = {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  onClick,
  type = "button",
  className = "",
}) => {
  const baseStyles =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ";

  const variantStyles = {
    primary: "bg-[#4977E6] text-white hover:bg-[#3d66d4] ",
    secondary: "bg-[#F0F4FF] text-[#4977E6] hover:bg-[#e0e8ff] border-2 border-[#4977E6]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
