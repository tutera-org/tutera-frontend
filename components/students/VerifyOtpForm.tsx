"use client";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import StudentButton from "./Button";

export default function VerifyOtpForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleOtp = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form reload
    console.log("Sending otp to backend", otp);
    router.push("/resetPassword");
  };

  return (
    <form onSubmit={handleOtp} className="flex flex-col items-center gap-9">
      <div className="flex gap-3 justify-center">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              if (el) {
                otpInputs.current[index] = el;
              }
            }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 text-center text-xl font-bold border-2 border-main-primary rounded-lg focus:border-primary-400 focus:outline-none shadow-xs shadow-[rgba(10, 13, 18, 0.05)]"
          />
        ))}
      </div>

      {/* Button */}
      <StudentButton type="submit">Send Otp</StudentButton>
      <button
        type="button"
        className="text-black rounded-lg px-6 font-semibold lg:text-base text-xs sm:text-sm hover:underline cursor-pointer"
      >
        Resend Otp
      </button>
    </form>
  );
}
