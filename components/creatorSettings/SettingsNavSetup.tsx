"use client";
import { useState } from "react";
import EditPricing from "./EditPricing";
import Account from "./Account";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Edit Profile");
  const tabs = ["Edit Profile", "Customization", "Account"];

  return (
    <section className="rounded-2xl py-5 sm:py-7 md:py-9 px-4 sm:px-6 md:px-10 bg-neutral-100">
      {/* NavBar */}
      <div className="w-full">
        <div className="flex items-center border-b border-secondary-400 gap-1 sm:gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base md:text-lg lg:text-xl font-semibold transition-colors relative text-neutral-900 whitespace-nowrap hover:text-primary-400 cursor-pointer`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Edit Profile section */}
      {activeTab == "Edit Profile" && <EditPricing />}

      {/* Account section */}
      {activeTab == "Account" && <Account />}
    </section>
  );
}
