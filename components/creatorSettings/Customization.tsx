import Link from "next/link";
import Button from "../Reuse/Button";
import { toast } from "sonner";

export default function Customization() {
  const todo = [
    {
      title: "Profile and Bio",
      desc: "Share who you are what you teach",
    },
    {
      title: "Brand Assets",
      desc: "Update your logo, cover photo and image",
    },
    {
      title: "Visual Identity",
      desc: "Choose colors",
    },
    {
      title: "Connect Socials",
      desc: "Link your social media profiles",
    },
  ];

  return (
    <section className="mt-4 sm:mt-6 md:mt-8 lg:mt-10">
      <div className="flex flex-col gap-8 sm:gap-10 lg:gap-12">
        <div className="bg-[#F9F0DA] rounded-2xl py-4 sm:py-5 md:py-6 px-6 sm:px-8 md:px-10 flex flex-col gap-2">
          <h1 className="font-semibold text-lg sm:text-xl md:text-2xl lg:text-[1.5rem] text-neutral-900">
            Unlock Full Customization
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-[1.2rem] text-primary-400 font-semibold">
            Upgrade to Pro to access custom domains, customize brand, and more
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg md:text-xl lg:text-[2rem] text-[rgba(0, 0, 0, 1)]">
            What you will set up
          </h3>
          <p className="lg:text-xl text-xs sm:text-sm md:text-[0.8rem] font-semibold text-[rgba(0, 0, 0, 1)]">
            Each step is quick and easy to complete{" "}
          </p>
        </div>

        {todo.map((todo, index) => (
          <div
            className="px-3 sm:px-4 flex flex-col gap-2 text-[rgba(0, 0, 0, 1)]"
            key={index}
          >
            <h3 className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl">
              {todo.title}
            </h3>
            <p className="lg:text-base text-xs sm:text-sm md:text-base">
              {todo.desc}
            </p>
          </div>
        ))}

        <div className="flex justify-start lg:justify-end">
          <Link
            href={"/customization"}
            className="w-full lg:w-auto text-center bg-primary-400 mt-4 text-white hover:bg-white hover:border hover:border-primary-400 hover:text-primary-400 rounded-lg py-3 px-10 font-bold cursor-pointer text-sm sm:text-base transition-colors"
          >
            Customize
          </Link>
        </div>
      </div>
    </section>
  );
}
