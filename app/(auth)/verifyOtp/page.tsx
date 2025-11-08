"use client";
import AuthFormHeader from "@/components/auth/AuthHeader";
import AuthModal from "@/components/auth/AuthModal";
import CountDown from "@/components/auth/Countdown";
import VerifyOtpForm from "@/components/auth/verifyOtpForm";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaEnvelope } from "react-icons/fa";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <AuthModal>
      <div className="flex flex-col items-center gap-9 py-10 mx-4">
        <FaEnvelope className="text-4xl text-primary-400" />
        <AuthFormHeader
          header="We have Emailed you a code"
          text={`To verify your account, enter code sent to \n ${email}`}
        />

        <CountDown />

        <VerifyOtpForm />

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
