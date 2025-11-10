import AuthFormHeader from "@/components/auth/AuthHeader";
import AuthModal from "@/components/auth/AuthModal";
import SignInForm from "@/components/auth/SignInForm";

export default function SignInModal() {
  return (
    <AuthModal>
      <div className="py-12 mx-4">
        <AuthFormHeader header="Sign-In" />

        {/* Sign in form */}
        <SignInForm />
      </div>
    </AuthModal>
  );
}
