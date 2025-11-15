"use client";

import { useState } from "react";
import { toast } from "sonner";
import EditAccount from "./EditAccount";

export default function Account() {
  const userDetails = [
    {
      title: "Account name",
      text: "Ansah Chikeh",
    },
    {
      title: "Account number",
      text: "null",
    },
    {
      title: "Bank name",
      text: "null",
    },
  ];

  const [showEditPopUp, setShowEditPopup] = useState<boolean>(false);
  const handleSetShowEditPopup = () => {
    setShowEditPopup((prevState) => !prevState);
  };

  const handleDeleteAccount = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.warning("Dear Customer, Wait for KYC");
  };
  return (
    <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col gap-4 sm:gap-5 md:gap-6">
      <h3 className="font-semibold text-lg sm:text-xl md:text-2xl text-primary-400">
        Account Details
      </h3>

      {userDetails.map((details, index) => (
        <div
          className="font-semibold text-neutral-900 flex flex-col gap-1.5 sm:gap-2"
          key={index}
        >
          <h5 className="text-base sm:text-lg md:text-xl">{details.title}</h5>
          <p className="text-xs sm:text-sm md:text-base text-gray-500">
            {details.text}
          </p>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 lg:justify-end mt-5 sm:mt-6 md:mt-7">
        <button
          onClick={handleDeleteAccount}
          className="border p-3 sm:p-3.5 bg-neutral-100 text-primary-400 rounded-lg font-bold hover:bg-red-500 cursor-pointer hover:text-white text-xs sm:text-sm md:text-base transition-colors px-6 sm:px-8"
          type="button"
        >
          Delete
        </button>
        <button
          onClick={handleSetShowEditPopup}
          className="border p-3 sm:p-3.5 hover:border-primary-400 hover:bg-neutral-100 hover:text-primary-400 rounded-lg font-bold cursor-pointer bg-primary-400 text-white text-xs sm:text-sm md:text-base transition-colors px-6 sm:px-8"
          type="button"
        >
          Edit
        </button>
      </div>

      {showEditPopUp && <EditAccount closeButton={handleSetShowEditPopup} />}
    </div>
  );
}
