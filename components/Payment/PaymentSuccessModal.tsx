"use client";

import Button from "../Reuse/Button";

interface PaymentSuccessModalProps {
  onClose: () => void;
  onCreateAccount: () => void;
  onBack: () => void;
}

const PaymentSuccessModal = ({
  onClose,
  onCreateAccount,
  onBack,
}: PaymentSuccessModalProps) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[24px] p-8 max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] text-center mb-4">
          Payment Successful
        </h2>

        {/* Instruction Text */}
        <p className="text-[#4B4B4B] text-center mb-8">
          Click on create account to continue
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="secondary"
            onClick={onBack}
            className="flex-1 py-3 border-2 border-[#4977E6] text-[#4977E6]"
          >
            Back
          </Button>
          <Button
            variant="primary"
            onClick={onCreateAccount}
            className="flex-1 py-3"
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;

