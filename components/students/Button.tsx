import React from "react";

type ButtonProps = {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const StudentButton: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all duration-150 cursor-pointer active:scale-95";

  const variantStyles = {
    primary:
      "bg-orange-300 hover:border hover:border-orange-300 text-white hover:text-orange-300 hover:bg-transparent ",
    secondary:
      "bg-neutral-100 text-orange-300 hover:bg-orange-300 border border-orange-300 hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default StudentButton;
