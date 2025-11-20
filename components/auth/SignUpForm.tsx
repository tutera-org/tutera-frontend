"use client";
import Link from "next/link";
import { useState } from "react";

export default function SignUpForm() {
  const [tenant, setTenant] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Fake auth token for testing
    document.cookie =
      "auth_token=fake_token_for_testing; path=/; domain=.localhost";

    // Redirect to tenant subdomain
    const protocol = window.location.protocol;
    const baseDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000";
    window.location.href = `${protocol}//${tenant}.${baseDomain}/dashboard`;
  };

  return (
    <form onSubmit={handleSubmit} className="flex py-8 flex-col gap-6">
      {/* Brand Name */}
      <label className="flex flex-col mt-3 gap-2.5 text-xs sm:text-sm font-semibold leading-[120%] text-neutral-900">
        Brand Name
        <input
          type="text"
          value={tenant}
          onChange={(e) => setTenant(e.target.value)}
          placeholder="Enter brand name..."
          required
          className="border text-base  p-2.5 focus:outline-none focus:ring-1 focus:ring-[#4977E6] border-black-400 w-full rounded-lg"
        />
      </label>

      {/* Email */}
      <label className="flex flex-col gap-2.5 text-xs sm:text-sm font-semibold leading-[120%] text-neutral-900">
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email..."
          required
          className="border text-base  p-2.5 focus:outline-none focus:ring-1 focus:ring-[#4977E6] border-black-400 w-full rounded-lg"
        />
      </label>

      {/* Password */}
      <label className="flex flex-col gap-2.5 text-xs sm:text-sm font-semibold leading-[120%] text-neutral-900">
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password..."
          required
          minLength={8}
          className="border text-base  p-3 focus:outline-none focus:ring-1 focus:ring-[#4977E6] border-black-400 w-full rounded-lg"
        />
      </label>

      {/* Terms and policy agreement */}
      <label className="leading-5 text-neutral-900 mt-6 text-center flex items-center justify-center space-x-4 text-xs sm:text-sm">
        <input type="checkbox" className="mr-3" required />
        By signing in, I agree to the terms of use and privacy policy
      </label>

      {/* Sign up Button */}
      <button
        type="submit"
        className="bg-primary-400 rounded-lg py-2.5 px-6 font-bold leading-[120%] text-base text-neutral-100"
      >
        Sign Up
      </button>

      <p className="text-xs sm:text-sm font-normal text-main-primary text-center">
        Already have an account?{" "}
        <Link href="/signIn" className="text-red-500">
          Sign-In
        </Link>
      </p>
    </form>
  );
}
