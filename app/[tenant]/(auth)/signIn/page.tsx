import PopUpModal from "@/components/Reuse/PopUpModal";
import SignInForm from "@/components/students/SignInForm";
import StudentsFormHeader from "@/components/students/StudentsFormHeader";

export default function SignIn() {
  return (
    <PopUpModal>
      <div className="mx-4">
        <StudentsFormHeader header="Sign-In" />

        <SignInForm />
      </div>
    </PopUpModal>
  );
}
