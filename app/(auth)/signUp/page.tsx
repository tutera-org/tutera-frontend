import AuthFormHeader from "@/components/auth/AuthHeader";
import AuthModal from "@/components/auth/AuthModal";
import SignUpForm from "@/components/auth/SignUpForm";

function SignUpPage() {
  return (
    <AuthModal>
      <div className="mx-4">
        <AuthFormHeader
          header="Create your account and scale your education program"
          text="Build a better brand through education"
        />

        {/* Form */}
        <SignUpForm />
      </div>
    </AuthModal>
  );
}

export default SignUpPage;
