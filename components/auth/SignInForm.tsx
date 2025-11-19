"use client";

import { api } from "@/lib/axiosClientInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TuteraLoading from "../Reuse/Loader";

// Define validation rules for the signin form
const formSchema = z.object({
  // Email validation
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase()
    .trim(),

  // Password validation - just require it exists during signin
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof formSchema>;

// SearchParams prop interface
interface SignInFormProps {
  prefilledEmail?: string;
  showSuccessMessage?: boolean;
}

export default function SignInForm({
  prefilledEmail,
  showSuccessMessage,
}: SignInFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: prefilledEmail || "",
      password: "",
    },
  });

  // Track loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Show success message when user comes from signup page
  useEffect(() => {
    if (showSuccessMessage) {
      toast.success("Account created successfully! Please sign in.");
    }
  }, [showSuccessMessage]);

  const creatorSignIn = async (formData: FormData) => {
    // Clear any previous errors
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Call Next.js API route which forwards to backend
      const response = await api.post("/api/signIn", {
        email: formData.email,
        password: formData.password,
      });

      // Get tenant subdomain in the backend response
      const { tenant } = response.data;

      // Redirect to tenant subdomain dashboard
      const protocol = window.location.protocol;
      const baseDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000";
      window.location.href = `${protocol}//${tenant}.${baseDomain}/dashboard`;
    } catch (error: any) {
      // Handle errors from the API
      const message =
        error.response?.data?.error || "Sign in failed. Please try again.";
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  // Show loading spinner during form submission
  if (isLoading) {
    return <TuteraLoading />;
  }

  return (
    <form
      onSubmit={handleSubmit(creatorSignIn)}
      className="flex py-8 flex-col gap-6"
    >
      {/* Display error message if signin fails */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      {/* ==================== EMAIL INPUT ==================== */}
      <label className="flex flex-col gap-2.5 text-xs sm:text-sm font-semibold leading-[120%] text-neutral-900">
        Email
        <input
          type="email"
          {...register("email")}
          placeholder="Enter email..."
          className={`border text-base p-2.5 w-full rounded-lg ${
            errors.email ? "border-red-500" : "border-black-400"
          }`}
        />
        {/* Show validation error if exists */}
        {errors.email && (
          <span className="text-red-500 text-xs font-normal">
            {errors.email.message}
          </span>
        )}
      </label>

      {/* ==================== PASSWORD INPUT ==================== */}
      <label className="flex flex-col gap-2.5 text-xs sm:text-sm font-semibold leading-[120%] text-neutral-900">
        Password
        <input
          type="password"
          {...register("password")}
          placeholder="Enter password..."
          className={`border text-base p-2.5 w-full rounded-lg ${
            errors.password ? "border-red-500" : "border-black-400"
          }`}
        />
        {/* Show validation error if exists */}
        {errors.password && (
          <span className="text-red-500 text-xs font-normal">
            {errors.password.message}
          </span>
        )}
      </label>

      {/* ==================== FORGOT PASSWORD LINK ==================== */}
      <Link
        href="/forgotPassword"
        className="leading-5 text-neutral-900 text-center hover:text-blue-900 text-xs sm:text-sm hover:underline"
      >
        Forgot Password?
      </Link>

      {/* ==================== SUBMIT BUTTON ==================== */}
      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className={`bg-primary-400 rounded-lg py-1.5 px-6 font-bold leading-[120%] text-base text-neutral-100 ${
          isSubmitting || isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitting || isLoading ? "Signing in..." : "Sign In"}
      </button>

      {/* ==================== SIGN UP LINK ==================== */}
      <p className="text-xs sm:text-sm font-normal text-main-primary text-center">
        Don't have an account?{" "}
        <Link href="/signUp" className="text-red-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
