"use client";

import { api } from "@/lib/axiosClientInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TuteraLoading from "../Reuse/Loader";
import StudentButton from "./Button";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof formSchema>;

interface SignInFormProps {
  prefilledEmail?: string;
  showSuccessMessage?: boolean;
}

export default function SignInForm({
  prefilledEmail,
  showSuccessMessage,
}: SignInFormProps) {
  const router = useRouter();

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

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (showSuccessMessage) {
      toast.success("Account created successfully! Please sign in.");
    }
  }, [showSuccessMessage]);

  const creatorSignIn = async (formData: FormData) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await api.post("/v1/signIn", {
        email: formData.email,
        password: formData.password,
      });

      // Successful login - redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Sign in failed. Please try again.";

      setErrorMessage(message);
      setIsLoading(false);
      toast.error(message);
    }
  };

  if (isLoading) {
    return <TuteraLoading />;
  }

  return (
    <form
      onSubmit={handleSubmit(creatorSignIn)}
      className="flex py-8 flex-col gap-6"
    >
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

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
        {errors.email && (
          <span className="text-red-500 text-xs font-normal">
            {errors.email.message}
          </span>
        )}
      </label>

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

      <Link
        href="/forgotPassword"
        className="leading-5 text-neutral-900 text-center hover:text-blue-900 text-xs sm:text-sm hover:underline"
      >
        Forgot Password?
      </Link>

      <StudentButton
        type="submit"
        disabled={isSubmitting || isLoading}
        className={`rounded-lg py-1.5 px-6 font-bold leading-[120%] text-base text-neutral-100 ${
          isSubmitting || isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitting || isLoading ? "Signing in..." : "Sign In"}
      </StudentButton>

      <p className="text-xs sm:text-sm font-normal text-main-primary text-center">
        Don't have an account?{" "}
        <Link href="/signUp" className="text-red-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
