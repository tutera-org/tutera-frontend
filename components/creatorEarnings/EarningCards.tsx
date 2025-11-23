"use client";

import { useState } from "react";
import WithdrawalPopUp from "./WithdrawalPopUp";

export default function EarningCards() {
  interface cardProps {
    icon: string;
    button?: string;
    title: string;
    amt: string;
  }

  const cards: cardProps[] = [
    {
      icon: "/dollarIcon.svg",
      button: "Withdraw",
      title: "Available Balance",
      amt: "70000",
    },
    {
      icon: "/pending.svg",
      title: "Pending",
      amt: "18500",
    },
    {
      icon: "/analysisTrend.svg",
      title: "Total Earnings",
      amt: "650000",
    },
    {
      icon: "/arrowPoint.svg",
      title: "This Month",
      amt: "85500",
    },
  ];

  const formatAmount = (amount: string) => {
    // add naira and , where neccessary
    const number = parseFloat(amount.replace(/,/g, ""));
    return `₦${number.toLocaleString("en-NG")}`;
  };

  const [popUp, setShowPopUp] = useState<boolean>(false);

  const handleShowPopUp = () => {
    setShowPopUp((prevState) => !prevState);
  };

  return (
    <section className="my-6 sm:my-10 md:my-15 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-10">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-neutral-100 border border-[#C3C3C3] p-4 sm:p-5 shadow-md rounded-2xl"
        >
          <aside className="flex items-center justify-between ">
            {/* Top section icon and button */}
            <img
              src={`${card.icon}`}
              className="w-8 h-8 sm:w-10 sm:h-10 "
              alt={card.title}
            />
            <button
              onClick={handleShowPopUp}
              className={
                index === 0
                  ? `bg-primary-400 hover:bg-transparent hover:border hover:border-primary-400 rounded-lg py-1.5 px-3 sm:py-2 sm:px-5 text-neutral-100 text-xs sm:text-sm font-semibold hover:text-primary-400 transition-colors whitespace-nowrap`
                  : "hidden"
              }
            >
              {card.button}
            </button>
          </aside>

          <aside className="mt-8 sm:mt-10 md:mt-13 flex flex-col gap-2 sm:gap-3 md:gap-3.5 text-sm sm:text-base text-neutral-900 leading-5">
            {/* Rest of the card - title and amount */}
            <p className="font-medium">{card.title}</p>
            <p className="text-lg sm:text-base md:text-xl font-semibold">
              {formatAmount(card.amt)}
            </p>
          </aside>
        </div>
      ))}

      {/* Withdrawal popup form */}
      {popUp && <WithdrawalPopUp closeButton={handleShowPopUp} />}
    </section>
  );
}
