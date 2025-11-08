import AuthFormHeader from "@/components/Home/auth/AuthHeader";
import AuthModal from "@/components/Home/auth/AuthModal";
import Link from "next/link";

export default function SignInModal() {
  return (
    <AuthModal>
      <div className="py-12 mx-4">
        <AuthFormHeader header="Sign-In" />

        <form className="flex py-8 flex-col gap-6">
          {/* Email */}
          <label className="flex flex-col gap-2.5 text-[0.5rem] lg:text-sm font-semibold leading-[120%] text-neutral-900">
            Email
            <input
              type="email"
              placeholder="Email"
              className="border font-semibold text-base placeholder:text-neutral-700 p-2.5 border-black-400 w-full rounded-lg"
            />
          </label>

          {/* Password */}
          <label className="flex flex-col gap-2.5 text-[0.5rem] lg:text-sm font-semibold leading-[120%] text-neutral-900">
            Password
            <input
              type="password"
              placeholder="Password"
              className="border font-semibold text-base placeholder:text-neutral-700 p-2.5 border-black-400 w-full rounded-lg"
            />
          </label>

          {/* Terms and policy agreement */}
          <Link
            href={"/forgotPassword"}
            className="leading-5 text-neutral-900 text-center space-x-4 cursor-pointer text-[0.5rem] hover:text-blue-900 lg:text-base"
          >
            Forgot Password?
          </Link>

          {/* Sign up Button */}
          <button className="bg-primary-400 rounded-lg py-1.5 px-6 font-bold leading-[120%] text-base text-neutral-100">
            Sign In
          </button>

          <p className="text-[0.5rem] lg:text-base font-normal text-main-primary text-center">
            Already have an account?{" "}
            <Link href="/signUp" className="text-accent-600 cursor-pointer">
              Sign-Up
            </Link>
          </p>
        </form>
      </div>
    </AuthModal>
  );
}
