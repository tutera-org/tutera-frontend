"use client";
import AuthFormHeader from "@/components/Home/auth/AuthHeader";
import AuthModal from "@/components/Home/auth/AuthModal";
import CountDown from "@/components/Home/auth/Countdown";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { FaEnvelope } from "react-icons/fa";

export default function VerifyOtp() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
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

  const handleOtp = () => {
    console.log("Sending otp to backend", otp);
    router.push("/resetPassword");
  };

  return (
    <AuthModal>
      <div className="flex flex-col items-center gap-9 py-10 mx-4">
        <FaEnvelope className="text-4xl text-primary-400" />
        <AuthFormHeader
          header="We have Emailed you a code"
          text={`To verify your account, enter code sent to \n ${email}`}
        />

        <CountDown />

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

        <button
          onClick={handleOtp}
          className="bg-primary-400 rounded-lg py-2 px-6 font-bold text-base text-neutral-100 w-[70%] md:w-[50%]"
        >
          Send Otp
        </button>

        <button className="text-primary-400 rounded-lg px-6 font-semibold lg:text-base text-[0.5rem] hover:text-blue-600 w-full">
          Resend Otp
        </button>

        <p className="text-[0.5rem] lg:text-base font-normal text-main-primary text-center">
          Return to{" "}
          <Link href="/signIn" className="text-red-500">
            Sign-In
          </Link>{" "}
          page
        </p>
      </div>
    </AuthModal>
  );
}
