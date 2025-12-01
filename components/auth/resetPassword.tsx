"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordInput } from "../ui/PasswordInput";

export default function ResetPasswordForm() {
  const router = useRouter();

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/resetSuccess");
  };
  return (
    <form onSubmit={handleClick} className="flex py-8 flex-col gap-10">
      {/* New Password */}

      <PasswordInput
        placeholder="New Password"
        className="focus:ring-1 focus:ring-[#4977E6]"
      />

      {/* Confirm Password */}

      <PasswordInput
        placeholder="Confirm Password"
        className="focus:ring-1 focus:ring-[#4977E6]"
      />

      {/* Reset Button */}
      <button className="bg-primary-400 rounded-lg py-3 px-6 font-bold leading-[120%] text-base hover:bg-blue-600 text-neutral-100">
        Reset Password
      </button>

      <p className="text-xs sm:text-sm font-normal text-main-primary text-center">
        Return to{" "}
        <Link href="/signIn" className="text-accent-600 cursor-pointer">
          Sign-In
        </Link>{" "}
        page
      </p>
    </form>
  );
}
