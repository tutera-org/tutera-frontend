"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import PopUpModal from "../Reuse/PopUpModal";
import AuthFormHeader from "../auth/AuthHeader";

interface AccountFormData {
  accountName: string;
  accountNumber: string;
  bank: string;
}

export default function EditAccount({
  closeButton,
}: {
  closeButton: () => void;
}) {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AccountFormData>();

  const formData = watch();

  const onSubmit = (data: AccountFormData) => {
    console.log("Form submitted:", data);
    toast.success("Dear Customer, Complete your kyc first");
    closeButton();
  };

  const goToPreview = () => {
    setStep(2);
  };

  const goBackToForm = () => {
    setStep(1);
  };

  return (
    <PopUpModal>
      {/* Cancel button */}
      <button
        onClick={closeButton}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
        aria-label="Close modal"
      >
        <FaTimes className="text-lg sm:text-xl" />
      </button>

      {/* Step 1: Form */}
      {step === 1 && (
        <form className="flex py-5 sm:py-6 md:py-8 flex-col gap-5 sm:gap-6 md:gap-8">
          <AuthFormHeader header="Update Your Account Details" />

          <div className="flex flex-col gap-1.5 sm:gap-2">
            {/* Account Name */}
            <label
              htmlFor="accountName"
              className="text-neutral-900 text-xs sm:text-sm md:text-base font-semibold"
            >
              Account Name *
            </label>

            <input
              {...register("accountName", {
                required: "Account name is required",
              })}
              type="text"
              id="accountName"
              className="border text-sm sm:text-base p-3 sm:p-3.5 border-black-400 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Enter account name"
            />
            {errors.accountName && (
              <span className="text-red-500 text-xs sm:text-sm">
                {errors.accountName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5 sm:gap-2">
            {/* Account Number */}
            <label
              htmlFor="accountNumber"
              className="text-neutral-900 text-xs sm:text-sm md:text-base font-semibold"
            >
              Account Number *
            </label>

            <input
              {...register("accountNumber", {
                required: "Account number is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Account number must be digits only",
                },
              })}
              id="accountNumber"
              type="text"
              className="border text-sm sm:text-base p-3 sm:p-3.5 border-black-400 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Enter account number"
            />
            {errors.accountNumber && (
              <span className="text-red-500 text-xs sm:text-sm">
                {errors.accountNumber.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5 sm:gap-2">
            {/* Bank */}
            <label
              htmlFor="bank"
              className="text-neutral-900 text-xs sm:text-sm md:text-base font-semibold"
            >
              Bank *
            </label>
            <input
              {...register("bank", { required: "Bank name is required" })}
              id="bank"
              type="text"
              className="border text-sm sm:text-base p-3 sm:p-3.5 border-black-400 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Enter bank name"
            />
            {errors.bank && (
              <span className="text-red-500 text-xs sm:text-sm">
                {errors.bank.message}
              </span>
            )}
          </div>

          {/* Preview Button */}
          <button
            type="button"
            onClick={goToPreview}
            className="bg-primary-400 rounded-lg py-3 sm:py-3.5 md:py-4 px-6 font-bold text-xs sm:text-sm md:text-base hover:bg-blue-600 text-neutral-100 transition-colors"
          >
            Preview Changes
          </button>
        </form>
      )}

      {/* Step 2: Preview */}
      {step === 2 && (
        <div className="flex flex-col gap-5 sm:gap-6 md:gap-8 py-5 sm:py-6 md:py-8">
          <AuthFormHeader header="Account Details" />

          <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 flex flex-col gap-4 sm:gap-5">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
                Account Name
              </p>
              <p className="text-sm sm:text-base md:text-lg text-neutral-900 font-semibold">
                {formData.accountName || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
                Account Number
              </p>
              <p className="text-sm sm:text-base md:text-lg text-neutral-900 font-semibold">
                {formData.accountNumber || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
                Bank
              </p>
              <p className="text-sm sm:text-base md:text-lg text-neutral-900 font-semibold">
                {formData.bank || "Not provided"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={goBackToForm}
              className="border border-primary-400 bg-neutral-100 text-primary-400 hover:bg-primary-400 hover:text-white rounded-lg py-3 sm:py-3.5 md:py-4 px-6 sm:px-8 font-bold text-xs sm:text-sm md:text-base transition-colors"
            >
              Back to Edit
            </button>
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="bg-primary-400 hover:bg-transparent hover:text-primary-400 hover:border hover:border-primary-400 text-white rounded-lg py-3 sm:py-3.5 md:py-4 px-6 sm:px-8 font-bold text-xs sm:text-sm md:text-base transition-colors"
            >
              Confirm & Submit
            </button>
          </div>
        </div>
      )}
    </PopUpModal>
  );
}
