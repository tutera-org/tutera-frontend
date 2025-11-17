"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StudentButton from "./Button";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending OTP to:", email);

    router.push("/verifyOtp");
  };

  return (
    <form onSubmit={handleSubmit} className="flex py-8 flex-col gap-7">
      <label className="flex flex-col gap-2.5 text-xs sm:text-sm font-semibold leading-[120%] text-neutral-900">
        Email
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmail}
          required
          className="border text-base p-2.5 border-black-400 w-full rounded-lg"
        />
      </label>

      {/* Button  */}
      <StudentButton
        type="submit"
        className={!email ? "opacity-50 cursor-not-allowed" : ""} //TODO: fix the opacity state
        disabled={!email}
      >
        Send Otp
      </StudentButton>

      <p className="text-xs sm:text-sm font-normal text-main-primary text-center">
        Return to{" "}
        <Link href="/signIn" className="text-accent-600">
          Sign-In
        </Link>{" "}
        Page
      </p>
    </form>
  );
}

export default ForgotPasswordForm;
