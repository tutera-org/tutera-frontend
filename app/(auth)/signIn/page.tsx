import AuthFormHeader from "@/components/auth/AuthHeader";
import AuthModal from "@/components/auth/AuthModal";
import SignInForm from "@/components/auth/SignInForm";

export default async function SignInModal({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; registered?: string }>;
}) {
  const params = await searchParams;
  return (
    <AuthModal>
      <div className="py-12 mx-4">
        <AuthFormHeader header="Sign-In" />

        {/* Sign in form */}
        <SignInForm
          prefilledEmail={params.email}
          showSuccessMessage={params.registered === "true"}
        />
      </div>
    </AuthModal>
  );
}
