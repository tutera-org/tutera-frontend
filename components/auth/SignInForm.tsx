import Link from "next/link";

export default function SignInForm() {
  return (
    <form className="flex py-8 flex-col gap-6">
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

      {/* Sign up Button */}
      <button className="bg-primary-400 rounded-lg py-1.5 px-6 font-bold leading-[120%] text-base text-neutral-100">
        Sign In
      </button>

      <p className="text-xs sm:text-sm font-normal text-main-primary text-center">
        Already have an account?{" "}
        <Link href="/signUp" className="text-accent-600 cursor-pointer">
          Sign-Up
        </Link>
      </p>
    </form>
  );
}
