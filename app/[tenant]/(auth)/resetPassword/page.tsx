import PopUpModal from "@/components/Reuse/PopUpModal";
import ResetPasswordForm from "@/components/students/ResetPassword";
import StudentsFormHeader from "@/components/students/StudentsFormHeader";

export default function ResetPassword() {
  return (
    <PopUpModal>
      <div className="py-10 mx-4">
        <StudentsFormHeader header="Reset Password" />

        <ResetPasswordForm />
      </div>
    </PopUpModal>
  );
}
