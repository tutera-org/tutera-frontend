"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PasswordInput } from "../ui/PasswordInput";
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

  // Email validation
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase()
    .trim(),

  // Password validation
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  // Terms and conditions acceptance
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

  const signUpCreator = async (formData: FormData) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await api.post("/v1/signUp", {
        tenantName: formData.tenant,
        email: formData.email,
        password: formData.password,
        role: "INSTITUTION",
      });

      // Extract tenant data from response
      const { tenant } = response.data.data;

      console.log("🏢 [TENANT DATA]", tenant);
      console.log(`   Website: ${tenant.website}`);
      console.log(`   Name: ${tenant.name}`);

      // Construct tenant subdomain sign-in URL
      // Construct subdomain URL for redirect

      const protocol = window.location.protocol;
      const rootDomain =
        process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
      const subdomainUrl = `${protocol}//${tenant.website}.${rootDomain}/`;
      // Hard redirect to subdomain (full page reload to change domain)
      window.location.href = subdomainUrl;
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Sign up failed. Please try again.";

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
        <PasswordInput
          {...register("password")}
          placeholder="Enter password..."
          error={!!errors.password}
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
        <span>
          By signing up, I agree to the{" "}
          <Link
            href="/legal"
            className="text-red-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            terms of use and privacy policy
          </Link>
        </span>
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
