import PopUpModal from "@/components/Reuse/PopUpModal";
import SignUpForm from "@/components/students/SignUpForm";
import StudentsFormHeader from "@/components/students/StudentsFormHeader";

export default function SignUp() {
  return (
    <PopUpModal>
      <div className="mx-4">
        <StudentsFormHeader header="Sign-Up" />

        <SignUpForm />
      </div>
    </PopUpModal>
  );
}
