"use client";
import Link from "next/link";
import StudentButton from "./Button";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="flex py-8 flex-col gap-6">
      {/* Email */}
      <label className="flex flex-col gap-2.5 text-xs sm:text-sm font-semibold leading-[120%] text-neutral-900">
        Email
        <input
          type="email"
          placeholder="Email"
          className="border  text-base  p-2.5 border-black-400 w-full rounded-lg"
        />
      </label>

      {/* Password */}
      <label className="flex flex-col gap-2.5 text-xs sm:text-sm  font-semibold leading-[120%] text-neutral-900">
        Password
        <input
          type="password"
          placeholder="Password"
          className="border  text-base  p-2.5 border-black-400 w-full rounded-lg"
        />
      </label>

      {/* Terms and policy agreement */}
      <Link
        href={"/forgotPassword"}
        className="leading-5 text-neutral-900 text-center space-x-4 cursor-pointer hover:text-blue-900 text-xs sm:text-sm"
      >
        Forgot Password?
      </Link>

      {/* Sign In Button */}
      <StudentButton type="submit">Sign In</StudentButton>

      <p className="text-xs sm:text-sm font-normal text-main-primary text-center">
        Already have an account?{" "}
        <Link href="/signUp" className="text-accent-600 cursor-pointer">
          Sign-Up
        </Link>
      </p>
    </form>
  );
}
