import AuthFormHeader from "@/components/auth/AuthHeader";
import AuthModal from "@/components/auth/AuthModal";
import ForgotPasswordForm from "@/components/auth/forgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthModal>
      <div className="py-12 mx-4">
        <AuthFormHeader header="Forgot Password" />

        <ForgotPasswordForm />
      </div>
    </AuthModal>
  );
}
