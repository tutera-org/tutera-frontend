"use client";
import AuthFormHeader from "@/components/Home/auth/AuthHeader";
import AuthModal from "@/components/Home/auth/AuthModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ResetPassword() {
  const router = useRouter();

  const handleClick = () => {
    toast.success("Your Password has been reset successfully");
    router.push("/");
  };
  return (
    <AuthModal>
      <div className="py-20 mx-4">
        <AuthFormHeader header="Reset Password" />

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

          <p className="text-[0.5rem] lg:text-base font-normal text-main-primary text-center">
            Return to{" "}
            <Link href="/signIn" className="text-accent-600 cursor-pointer">
              Sign-In
            </Link>{" "}
            page
          </p>
        </form>
      </div>
    </AuthModal>
  );
}
