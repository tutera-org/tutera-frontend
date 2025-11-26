"use client";

import { api } from "@/lib/axiosClientInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TuteraLoading from "../Reuse/Loader";
import StudentButton from "./Button";

// Define validation rules for the tenant signup form
const formSchema = z.object({
  // Domain name validation - will be used as subdomain
  domainName: z
    .string()
    .min(1, "Domain name is required")
    .max(20, "Domain name must be 20 characters or less")
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
      "Domain name must contain only lowercase letters, numbers, and hyphens. Cannot start or end with a hyphen."
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

  // Name validation - must include both first and last name
  name: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Name must be 100 characters or less")
    .trim()
    .regex(
      /^[a-zA-Z]+(?:\s+[a-zA-Z]+)+$/,
      "Please enter both first name and last name (e.g., John Doe)"
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

export default function TenantSignUpForm() {
  const router = useRouter();

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domainName: "",
      name: "",
      email: "",
      password: "",
      termsAccepted: false,
    },
  });

  // Track loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper function to split full name into firstName and lastName
  const splitFullName = (
    fullName: string
  ): { firstName: string; lastName: string } => {
    const trimmedName = fullName.trim();
    const nameParts = trimmedName.split(/\s+/);

    if (nameParts.length === 1) {
      return { firstName: nameParts[0], lastName: "" };
    }

    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    return { firstName, lastName };
  };

  const handleTenantSignUp = async (formData: FormData) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Split full name into firstName and lastName
      const { firstName, lastName } = splitFullName(formData.name);

      // Call the Next.js API route at /api/v1/tenantSignUp
      const response = await api.post("/v1/tenantSignUp", {
        firstName: firstName,
        lastName: lastName,
        email: formData.email,
        password: formData.password,
        subdomain: formData.domainName, // Send domainName as subdomain to backend
      });

      // Redirect to sign in page on same subdomain
      window.location.href = `/signIn?email=${encodeURIComponent(
        formData.email
      )}&registered=true`;
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response
          ?.data?.error || "Sign up failed. Please try again.";

      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <TuteraLoading />;
  }

  return (
    <form
      onSubmit={handleSubmit(handleTenantSignUp)}
      className="flex py-8 flex-col gap-6"
    >
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      {/* ==================== DOMAIN NAME INPUT ==================== */}
      <label className="flex flex-col mt-3 gap-2.5 text-xs sm:text-sm font-semibold leading-[120%] text-neutral-900">
        Domain Name
        <input
          type="text"
          {...register("domainName")}
          placeholder="Enter subdomain (e.g., okpara for okpara.tutera.com)"
          className={`border text-base p-2.5 w-full rounded-lg ${
            errors.domainName ? "border-red-500" : "border-black-400"
          }`}
        />
        {errors.domainName && (
          <span className="text-red-500 text-xs font-normal">
            {errors.domainName.message}
          </span>
        )}
      </label>

      {/* ==================== NAME INPUT ==================== */}
      <label className="flex flex-col gap-2.5 text-xs sm:text-sm font-semibold leading-[120%] text-neutral-900">
        Full Name
        <input
          type="text"
          {...register("name")}
          placeholder="Enter your full name (e.g., John Doe)..."
          className={`border text-base p-2.5 w-full rounded-lg ${
            errors.name ? "border-red-500" : "border-black-400"
          }`}
        />
        {errors.name && (
          <span className="text-red-500 text-xs font-normal">
            {errors.name.message}
          </span>
        )}
      </label>

      {/* ==================== EMAIL INPUT ==================== */}
      <label className="flex flex-col gap-2.5 text-xs sm:text-sm font-semibold leading-[120%] text-neutral-900">
        Email
        <input
          type="email"
          {...register("email")}
          placeholder="Enter your email..."
          className={`border text-base p-2.5 w-full rounded-lg ${
            errors.email ? "border-red-500" : "border-black-400"
          }`}
        />
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
      {errors.termsAccepted && (
        <span className="text-red-500 text-xs font-normal text-center -mt-4">
          {errors.termsAccepted.message}
        </span>
      )}

      {/* ==================== SUBMIT BUTTON ==================== */}
      <StudentButton
        type="submit"
        disabled={isSubmitting || isLoading}
        className={`rounded-lg py-1.5 px-6 font-bold leading-[120%] text-base text-neutral-100 ${
          isSubmitting || isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitting || isLoading ? "Creating account..." : "Sign Up"}
      </StudentButton>

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
