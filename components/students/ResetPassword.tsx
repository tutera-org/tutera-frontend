"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StudentButton from "./Button";
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

      <PasswordInput placeholder="New Password" />

      {/* Confirm Password */}
      <PasswordInput placeholder="Confirm Password" />

      {/* Reset Button */}
      <StudentButton type="submit">Reset Password</StudentButton>

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
