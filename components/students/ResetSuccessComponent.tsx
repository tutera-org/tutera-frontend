import { FaTimes } from "react-icons/fa";
import Link from "next/link";
import StudentsFormHeader from "./StudentsFormHeader";

export default function ResetSuccessComponent() {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/50">
        <div className="bg-white max-w-[700px] to w-[90%] rounded-lg px-10 pt-10 relative">
          {/* cancel button */}
          <Link href={"/signIn"}>
            <FaTimes className="absolute text-gray-500 top-4 right-4 text-xl cursor-pointer font-bold" />
          </Link>
          <div className="py-20 mx-4">
            <StudentsFormHeader
              header="Request Successful"
              text="Your password has been reset successfully"
            />

            <div className="flex justify-center mt-[100px] py-[30px]">
              {/* Check icon */}
              <svg
                width="57.67"
                height="57.67"
                viewBox="0 0 57.67 57.67"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background circle  */}
                <rect
                  width="57.67"
                  height="57.67"
                  rx="62.69"
                  ry="62.69"
                  fill="rgba(223, 70, 35, 1)"
                  opacity="0"
                >
                  <animate
                    attributeName="opacity"
                    from="0"
                    to="1"
                    dur="0.3s"
                    fill="freeze"
                  />
                </rect>
                {/* Check mark (centered) */}
                <path
                  d="M 18.806 30.731 L 25.101 36.727 L 38.866 22.936"
                  stroke="rgba(255, 255, 255, 1)"
                  strokeWidth="2.51"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="1"
                  strokeDasharray="35"
                  strokeDashoffset="35"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="35"
                    to="0"
                    dur="0.4s"
                    begin="0.3s"
                    fill="freeze"
                  />
                </path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
