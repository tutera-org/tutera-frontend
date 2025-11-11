"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/resetSuccess");
  };
  return (
    <form className="flex py-8 flex-col gap-10">
      {/* New Password */}

      <input
        type="password"
        placeholder="New Password"
        className="border font-semibold text-base placeholder:text-neutral-700 p-2.5 border-black-400 w-full rounded-lg"
      />

      {/* Password */}

      <input
        type="password"
        placeholder="Password"
        className="border font-semibold text-base placeholder:text-neutral-700 p-2.5 border-black-400 w-full rounded-lg"
      />

      {/* Sign up Button */}
      <button
        className="bg-primary-400 rounded-lg py-2 px-6 font-bold leading-[120%] text-base hover:bg-blue-600 text-neutral-100"
        onClick={handleClick}
      >
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
