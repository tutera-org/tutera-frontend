"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/axiosClientInstance";
import TuteraLoading from "../Reuse/Loader";
import { useRouter } from "next/navigation";

// Define validation rules for the signup form using Zod schema
const formSchema = z.object({
  // Brand name (tenant/subdomain) - will be used as subdomain identifier
  tenant: z
    .string()
    .min(1, "Brand name cannot be empty")
    .max(20, "Brand name must be 20 characters or less")
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
      "Brand name must contain only lowercase letters, numbers, and hyphens. Cannot start or end with a hyphen."
    )
    .refine(
      (val) =>
        ![
          "www",
          "api",
          "admin",
          "app",
          "mail",
          "ftp",
          "smtp",
          "support",
          "help",
          "blog",
          "dev",
          "staging",
          "test",
        ].includes(val),
      { message: "This subdomain is reserved and cannot be used" }
    ),

  // Email validation - must be valid email format
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase()
    .trim(),

  // Password validation - enforces strong password requirements
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  // Terms and conditions acceptance - must be checked to proceed
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

// Infer TypeScript type from Zod schema
type FormData = z.infer<typeof formSchema>;

export default function SignUpForm() {
  const router = useRouter();

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenant: "",
      email: "",
      password: "",
      termsAccepted: false,
    },
  });

  // Track loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Handle form submission and call the signup API
   * Flow:
   * 1. Validate form data (handled by react-hook-form + Zod)
   * 2. Call POST /api/v1/signUp (Next.js API route)
   * 3. Next.js route forwards to backend: POST /v1/auth/registration/institution
   * 4. On success: redirect to sign in page with pre-filled email
   * 5. On error: display error message
   */
  const signUpCreator = async (formData: FormData) => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📝 [SIGNUP FORM] Form submitted");
    console.log("   Tenant:", formData.tenant);
    console.log("   Email:", formData.email);
    console.log("   Password: [REDACTED]");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Clear any previous errors
    setErrorMessage(null);
    setIsLoading(true);

    try {
      console.log("🚀 [SIGNUP] Calling API endpoint: POST /v1/signUp");

      // Call Next.js API route (not the backend directly)
      // This calls: /api/v1/signUp which forwards to the backend
      const response = await api.post("/v1/signUp", {
        tenantName: formData.tenant,
        email: formData.email,
        password: formData.password,
        role: "INSTITUTION", // User role for institution signup
      });

      console.log("✅ [SIGNUP SUCCESS] Registration successful!");
      console.log("   Response:", response.data);
      console.log("   Redirecting to sign in page...");

      // On successful registration, redirect to sign in page
      // Pass email as query param to pre-fill the login form
      // Pass registered=true flag to show success message
      router.push(
        `/signIn?email=${encodeURIComponent(formData.email)}&registered=true`
      );
    } catch (error: any) {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.error("❌ [SIGNUP ERROR] Registration failed");
      console.error("   Error:", error);
      console.error("   Response:", error.response?.data);
      console.error("   Status:", error.response?.status);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // Handle errors from the API
      // Extract error message from response or use default message
      const message =
        error.response?.data?.error || "Sign up failed. Please try again.";

      console.log("📝 [ERROR MESSAGE] Displaying to user:", message);

      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  // Show loading spinner during form submission
  if (isLoading) {
    console.log("⏳ [LOADING] Showing loading spinner...");
    return <TuteraLoading />;
  }

  return (
    <form
      onSubmit={handleSubmit(signUpCreator)}
      className="flex py-8 flex-col gap-6"
    >
      {/* Display error message banner if signup fails */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      {/* ==================== BRAND NAME INPUT ==================== */}
      <label className="flex flex-col mt-3 gap-2.5 text-xs sm:text-sm font-semibold leading-[120%] text-neutral-900">
        Brand Name
        <input
          type="text"
          {...register("tenant")}
          placeholder="Enter brand name..."
          className={`border text-base p-2.5 w-full rounded-lg ${
            errors.tenant ? "border-red-500" : "border-black-400"
          }`}
        />
        {/* Show validation error if exists */}
        {errors.tenant && (
          <span className="text-red-500 text-xs font-normal">
            {errors.tenant.message}
          </span>
        )}
      </label>

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

      {/* ==================== TERMS CHECKBOX ==================== */}
      <label className="leading-5 text-neutral-900 mt-6 text-center flex items-center justify-center space-x-4 text-xs sm:text-sm">
        <input
          type="checkbox"
          {...register("termsAccepted")}
          className="mr-3"
        />
        By signing up, I agree to the terms of use and privacy policy
      </label>
      {/* Show validation error if checkbox not checked */}
      {errors.termsAccepted && (
        <span className="text-red-500 text-xs font-normal text-center -mt-4">
          {errors.termsAccepted.message}
        </span>
      )}

      {/* ==================== SUBMIT BUTTON ==================== */}
      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className={`bg-primary-400 rounded-lg py-1.5 px-6 font-bold leading-[120%] text-base text-neutral-100 ${
          isSubmitting || isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitting || isLoading ? "Creating account..." : "Sign Up"}
      </button>

      {/* ==================== SIGN IN LINK ==================== */}
      <p className="text-xs sm:text-sm font-normal text-main-primary text-center">
        Already have an account?{" "}
        <Link href="/signIn" className="text-red-500 hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}
