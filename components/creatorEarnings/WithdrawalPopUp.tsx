import { FaTimes } from "react-icons/fa";
import PopUpModal from "../Reuse/PopUpModal";
import { toast } from "sonner";
import { useRouter } from "next/router";

export default function WithdrawalPopUp({
  closeButton,
}: {
  closeButton: () => void;
}) {
  const formatAmount = (amount: string) => {
    // add naira and , where neccessary
    const number = parseFloat(amount.replace(/,/g, ""));
    return `₦${number.toLocaleString("en-NG")}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Withdrawal Application Sent");
  };
  return (
    <PopUpModal>
      {/* Header / title */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-b-gray-500">
        <h3 className="font-semibold text-lg sm:text-xl md:text-2xl text-neutral-900">
          Withdraw Funds
        </h3>
        <button
          onClick={closeButton}
          className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
          aria-label="Close modal"
        >
          <FaTimes className="text-lg sm:text-xl" />
        </button>
      </div>

      <div className="bg-black-100 rounded-lg px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-1.5 mt-3 sm:mt-4 text-neutral-900">
        {/* Available balance */}
        <p className="text-sm sm:text-base font-semibold">Available Balance</p>
        <p className="text-lg sm:text-xl font-semibold">
          {formatAmount("70000")}
        </p>
      </div>

      <form className="mt-5 sm:mt-7 gap-5 sm:gap-6 flex flex-col">
        {/* withdrawal form */}
        <div className="flex flex-col gap-2">
          <label
            className="text-sm sm:text-base text-gray-700"
            htmlFor="amount"
          >
            Withdrawal Amount
          </label>
          <input
            className="rounded-lg border p-3 sm:p-3.5 border-black-400 text-sm sm:text-base"
            type="text"
            name=""
            id="amount"
            placeholder="Amount"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="text-sm sm:text-base text-gray-700"
            htmlFor="payment"
          >
            Payment Method
          </label>
          <select
            className="rounded-lg border p-3 sm:p-3.5 border-black-400 text-sm sm:text-base"
            id="payment"
          >
            <option value="">--SELECT--</option>
            <option value="card">Card</option>
            <option value="">Zamani, wey the rest?</option>
          </select>
        </div>

        <div className="bg-primary-100 rounded-lg px-3 sm:px-4 py-3 sm:py-4">
          <p className="font-semibold text-neutral-900 text-xs sm:text-sm md:text-base">
            Note: Withdrawals typically take 2-5 business days to process.
            Platform fees may apply.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="rounded-lg py-3 sm:py-4 px-4 bg-primary-400 hover:bg-transparent hover:text-primary-400 hover:border hover:border-primary-400 text-white cursor-pointer font-bold text-xs sm:text-sm md:text-base transition-colors"
        >
          Withdraw
        </button>
      </form>
    </PopUpModal>
  );
}
