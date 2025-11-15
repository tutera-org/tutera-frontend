import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import ChangePassword from "./ChangePassword";

export default function EditForm() {
  // show toast
  const handleSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Changes saved successfully");
  };

  //   handle popup
  const [changePasswordPopUp, showChangePasswordPopup] =
    useState<boolean>(false);

  const handleChangePasswordPopUp = () => {
    showChangePasswordPopup((prevState) => !prevState);
  };
  return (
    <>
      <form
        onSubmit={handleSubscription}
        className="lg:col-span-3 flex flex-col gap-6 sm:gap-8 md:gap-10"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 justify-between">
          <aside className="flex flex-col w-full md:basis-[50%] gap-1">
            {/* Name */}
            <label
              className="text-base sm:text-lg md:text-xl text-unnamed-100 font-semibold"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="border p-3 sm:p-3.5 border-black-400 rounded-lg text-sm sm:text-base"
              type="text"
              name=""
              id="name"
            />
          </aside>

          <aside className="flex flex-col w-full md:basis-[50%] gap-1">
            {/* Email */}
            <label
              className="text-base sm:text-lg md:text-xl text-unnamed-100 font-semibold"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="border p-3 sm:p-3.5 border-black-400 rounded-lg text-sm sm:text-base"
              type="email"
              name=""
              id="email"
            />
          </aside>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 justify-between">
          <aside className="flex flex-col w-full md:basis-[50%] gap-1">
            {/* Name */}
            <label
              className="text-base sm:text-lg md:text-xl text-unnamed-100 font-semibold"
              htmlFor="plan"
            >
              Upgrade Plan
            </label>
            <select
              className="border p-3 sm:p-3.5 border-black-400 rounded-lg text-sm sm:text-base"
              name=""
              id="plan"
            >
              <option value=""></option>
              <option value="premium">Premium</option>
              <option value="">Wetin go dey here Zamani</option>
            </select>
          </aside>

          <aside className="flex flex-col w-full md:basis-[50%] gap-1">
            <label
              className="text-base sm:text-lg md:text-xl text-unnamed-100 font-semibold"
              htmlFor="cancel"
            >
              Subscription
            </label>

            {/* Cancel Subscription */}
            <button
              type="button"
              onClick={() => toast.warning("Na one chance you enter")}
              className="border p-3 sm:p-3.5 border-primary-400 bg-neutral-100 text-primary-400 rounded-lg flex justify-center items-center gap-3 font-bold hover:bg-primary-400 hover:text-white text-xs sm:text-sm md:text-base transition-colors"
              id="cancel"
            >
              <FaTimes /> Cancel Subscription
            </button>
          </aside>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 justify-between">
          <aside className="flex flex-col w-full md:basis-[50%] gap-1">
            {/* Password */}
            <label
              className="text-base sm:text-lg md:text-xl text-unnamed-100 font-semibold"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="border p-3 sm:p-3.5 border-black-400 rounded-lg text-sm sm:text-base"
              type="password"
              name=""
              id="password"
            />
          </aside>

          <aside className="flex flex-col w-full md:basis-[50%] gap-1">
            {/* Chanhe password */}
            <label
              className="text-base sm:text-lg md:text-xl text-unnamed-100 font-semibold"
              htmlFor="change-password"
            >
              Change Password
            </label>
            <button
              type="button"
              onClick={handleChangePasswordPopUp}
              className="border p-3 sm:p-3.5 border-primary-400 bg-neutral-100 text-primary-400 rounded-lg flex justify-center items-center gap-3 font-bold hover:bg-primary-400 hover:text-white text-xs sm:text-sm md:text-base transition-colors"
              id="change-password"
            >
              Change Password
            </button>
          </aside>
        </div>

        <div className="flex justify-center lg:justify-end">
          <button
            className="border p-3 sm:p-3.5 hover:border-primary-400 hover:bg-neutral-100 hover:text-primary-400 rounded-lg font-bold bg-primary-400 text-white text-xs sm:text-sm md:text-base transition-colors px-6 sm:px-8"
            type="submit"
          >
            Save Changes
          </button>
        </div>
      </form>

      {changePasswordPopUp && (
        <ChangePassword closeButton={handleChangePasswordPopUp} />
      )}
    </>
  );
}
