"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "../Reuse/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PaymentSuccessModal from "./PaymentSuccessModal";

interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
}

interface PaymentPageProps {
  selectedPlan: Plan;
}

const PaymentPage = ({ selectedPlan }: PaymentPageProps) => {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expirationDate: "",
    securityCode: "",
    country: "Nigeria",
    postalCode: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    setFormData((prev) => ({
      ...prev,
      cardNumber: formatted,
    }));
  };

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setFormData((prev) => ({
      ...prev,
      expirationDate: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // TODO: Replace with actual API endpoint when provided
      // const response = await fetch('/api/payment/process', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     ...formData,
      //     plan: selectedPlan,
      //   }),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Payment failed');
      // }
      //
      // const data = await response.json();
      // if (data.success) {
      //   setShowSuccessModal(true);
      // }

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success modal after successful payment
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Payment error:", error);
      // TODO: Show error message to user
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateAccount = () => {
    router.push("/signUp");
  };

  const handleBack = () => {
    router.push("/Pricing");
  };

  return (
    <>
      <div
        className={`min-h-screen bg-[#F0F4FF] ${
          showSuccessModal ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="w-[90%] max-w-[1240px] mx-auto py-6 ">
            <Link href="/">
              <Image src="/logo.svg" alt="logo" width={120} height={36} />
            </Link>
          </div>
        </div>

        <div className="w-[90%] max-w-[1240px] mx-auto  py-8">
          <h1 className="text-[2rem] md:text-[3rem] font-bold text-[#101A33] mb-8">
            Payment method
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Payment Form */}
            <div className="flex-1  rounded-lg p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Number */}
                <div>
                  <label
                    htmlFor="cardNumber"
                    className="block text-[#1A1A1A] font-semibold mb-2"
                  >
                    Card number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 1234 1234 1234"
                      maxLength={19}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#4977E6] focus:outline-none"
                      required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-400">
                        VISA
                      </span>
                      <span className="text-xs font-semibold text-gray-400">
                        Verve
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expiration Date and Security Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="expirationDate"
                      className="block text-[#1A1A1A] font-semibold mb-2"
                    >
                      Expiration date
                    </label>
                    <input
                      type="text"
                      id="expirationDate"
                      name="expirationDate"
                      value={formData.expirationDate}
                      onChange={handleExpirationChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#4977E6] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="securityCode"
                      className="block text-[#1A1A1A] font-semibold mb-2"
                    >
                      Security code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="securityCode"
                        name="securityCode"
                        value={formData.securityCode}
                        onChange={handleChange}
                        placeholder="CVC"
                        maxLength={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#4977E6] focus:outline-none"
                        required
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="2"
                            y="4"
                            width="20"
                            height="14"
                            rx="2"
                            stroke="#9CA3AF"
                            strokeWidth="1.5"
                          />
                          <rect
                            x="18"
                            y="12"
                            width="2"
                            height="4"
                            fill="#9CA3AF"
                          />
                          <line
                            x1="6"
                            y1="8"
                            x2="12"
                            y2="8"
                            stroke="#9CA3AF"
                            strokeWidth="1.5"
                          />
                          <line
                            x1="6"
                            y1="10"
                            x2="10"
                            y2="10"
                            stroke="#9CA3AF"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label
                    htmlFor="country"
                    className="block text-[#1A1A1A] font-semibold mb-2"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#4977E6] focus:outline-none appearance-none bg-white"
                    required
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                    <option value="South Africa">South Africa</option>
                  </select>
                </div>

                {/* Postal Code */}
                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-[#1A1A1A] font-semibold mb-2"
                  >
                    Postal code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="12345"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#4977E6] focus:outline-none"
                    required
                  />
                </div>

                {/* Purchase Plan Button */}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isProcessing}
                  className="w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Purchase Plan"
                  )}
                </Button>

                {/* Terms and Info */}
                <div className="space-y-3 text-sm text-[#4B4B4B]">
                  <p>All transaction are secure and encrypted</p>
                  <p>
                    By purchasing this plan, you agree that you are purchasing a
                    subscription that is charged on a reoccurring monthly basis.
                    Your plan will automatically renew until you cancel.
                  </p>
                  <p>
                    By purchasing this plan you agree to Tutera&apos;s{" "}
                    <Link href="#" className="text-[#4977E6] underline">
                      Terms of Use
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-[#4977E6] underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </form>
            </div>

            {/* Right Side - Plan Summary (Hidden on Mobile) */}
            <div className="hidden lg:block flex-1">
              <div className="bg-white rounded-[24px] shadow-lg overflow-hidden">
                {/* Summary Header */}
                <div className="bg-[#4977E6] text-white px-6 py-4">
                  <h2 className="text-xl font-bold">Summary</h2>
                </div>

                {/* Plan Details */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6">
                    {selectedPlan.name} plan
                  </h3>

                  {/* Features List */}
                  <ul className="space-y-4 mb-6">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Image
                          src="/tick1.svg"
                          alt="checkmark"
                          width={20}
                          height={20}
                          className="mt-0.5 shrink-0"
                        />
                        <span className="text-[#1A1A1A] font-semibold">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-6"></div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#1A1A1A] font-semibold text-lg">
                      {selectedPlan.period}
                    </span>
                    <span className="text-[#1A1A1A] font-bold text-2xl">
                      {selectedPlan.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Success Modal */}
      {showSuccessModal && (
        <PaymentSuccessModal
          onClose={() => setShowSuccessModal(false)}
          onCreateAccount={handleCreateAccount}
          onBack={handleBack}
        />
      )}
    </>
  );
};

export default PaymentPage;
