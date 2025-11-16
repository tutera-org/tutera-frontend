import PopUpModal from "@/components/Reuse/PopUpModal";
import ForgotPasswordForm from "@/components/students/ForgotPassword";
import SignInForm from "@/components/students/SignInForm";
import StudentsFormHeader from "@/components/students/StudentsFormHeader";

export default function ForgotPassword() {
  return (
    <PopUpModal>
      <StudentsFormHeader header="Forgot Password" />

      <ForgotPasswordForm />
    </PopUpModal>
  );
}
