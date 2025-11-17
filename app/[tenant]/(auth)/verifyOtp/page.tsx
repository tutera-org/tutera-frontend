import CountdownTimer from "@/components/auth/Countdown";
import PopUpModal from "@/components/Reuse/PopUpModal";
import StudentsFormHeader from "@/components/students/StudentsFormHeader";
import VerifyOtpForm from "@/components/students/VerifyOtpForm";
import Link from "next/link";
import { FaEnvelope } from "react-icons/fa";

export default function VerifyOtp() {
  return (
    <PopUpModal>
      <div className="flex flex-col items-center gap-6 py-5 mx-4">
        <FaEnvelope className="text-4xl text-orange-300" />
        <StudentsFormHeader
          header="Forgot Password"
          text="To verify your account, enter code sent to you"
        />

        <CountdownTimer />

        <VerifyOtpForm />

        <p className="text-sm sm:text-base font-normal text-main-primary text-center">
          Return to{" "}
          <Link href="/signIn" className="text-red-500">
            Sign-In
          </Link>{" "}
          page
        </p>
      </div>
    </PopUpModal>
  );
}
