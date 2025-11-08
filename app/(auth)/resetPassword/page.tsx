"use client";
import AuthFormHeader from "@/components/auth/AuthHeader";
import AuthModal from "@/components/auth/AuthModal";
import ResetPasswordForm from "@/components/auth/resetPassword";

export default function ResetPasswordPage() {
  return (
    <AuthModal>
      <div className="py-20 mx-4">
        <AuthFormHeader header="Reset Password" />

        <ResetPasswordForm />
      </div>
    </AuthModal>
  );
}
