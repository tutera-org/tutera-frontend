"use client";
import { toast } from "sonner";

export default function EarningHero() {
  const handleToast = () => {
    toast.info("Upgrade to Pro to use this feature");
  };
  return (
    <section className="flex mt-10 items-center justify-between mb-10">
      {/* Earning title and button */}
      <h1 className="font-semibold lg:text-[2.5rem] leading-12 text-neutral-900 text-base">
        Earnings
      </h1>
      <button
        onClick={handleToast}
        className="font-bold rounded-lg py-3 px-6 bg-primary-400 hover:border hover:border-primary-400 hover:bg-neutral-100 hover:text-primary-400 cursor-pointer text-neutral-100 text-xs md:text-base leading-[120%]"
      >
        Add Account
      </button>
    </section>
  );
}
