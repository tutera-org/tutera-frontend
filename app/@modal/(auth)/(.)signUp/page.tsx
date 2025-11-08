import AuthFormHeader from "@/components/Home/auth/AuthHeader";
import AuthModal from "@/components/Home/auth/AuthModal";
import Link from "next/link";

function page() {
  return (
    <AuthModal>
      <div className="mx-4">
        <AuthFormHeader
          header="Create your account and scale your education program"
          text="Build a better brand through education"
        />
        <form className="flex py-8 flex-col gap-6">
          {/* Brand Name */}
          <label className="flex flex-col mt-3 gap-2.5 text-[0.5rem] lg:text-sm font-semibold leading-[120%] text-neutral-900">
            Brand Name
            <input
              type="text"
              placeholder="Brand Name"
              className="border font-semibold text-base placeholder:text-neutral-700 p-2.5 border-black-400 w-full rounded-lg"
            />
          </label>

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
          <label className="leading-5 text-neutral-900 mt-6 text-center space-x-4 text-[0.5rem] lg:text-base">
            <input type="checkbox" className="mr-3" /> By signing in, I agree to
            the terms of use and privacy policy
          </label>

          {/* Sign up Button */}
          <button className="bg-primary-400 rounded-lg py-1.5 px-6 font-bold leading-[120%] text-base text-neutral-100">
            Sign Up
          </button>

          <p className="text-[0.5rem] lg:text-base font-normal text-main-primary text-center">
            Already have an account?{" "}
            <Link href="/signIn" className="text-red-500">
              Sign-In
            </Link>
          </p>
        </form>
      </div>
    </AuthModal>
  );
}

export default page;
