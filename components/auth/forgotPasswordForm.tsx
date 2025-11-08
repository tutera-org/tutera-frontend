"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending OTP to:", email);
    router.push(`/verifyOtp?email=${encodeURIComponent(email)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex py-8  flex-col gap-7">
      <label className="flex flex-col gap-2.5 text-[0.5rem] lg:text-sm font-semibold leading-[120%] text-neutral-900">
        Email
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmail}
          required
          className="border font-semibold text-base placeholder:text-neutral-700 p-2.5 border-black-400 w-full rounded-lg"
        />
      </label>

      <button
        type="submit"
        disabled={!email}
        className="bg-primary-400 rounded-lg py-2 px-6 font-bold leading-[120%] text-base text-neutral-100 cursor-pointer hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send OTP
      </button>

      <p className="text-[0.5rem] lg:text-base font-normal text-main-primary text-center">
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
