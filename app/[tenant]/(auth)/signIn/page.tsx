import PopUpModal from "@/components/Reuse/PopUpModal";
import SignInForm from "@/components/students/SignInForm";
import StudentsFormHeader from "@/components/students/StudentsFormHeader";

export default function SignIn() {
  return (
    <PopUpModal>
      <StudentsFormHeader header="Sign-In" />

      <SignInForm />
    </PopUpModal>
  );
}
