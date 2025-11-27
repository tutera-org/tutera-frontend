import Link from "next/link";

export default function Welcome() {
  return (
    <div className="mb-5">
      <h1 className="font-semibold text-2xl sm:text-3xl lg:text-[2.5rem] leading-8 sm:leading-10 lg:leading-12 text-neutral-900">
        Welcome to Tutera
      </h1>
      <p className="text-base mb-4 sm:mb-5 lg:mb-7 sm:text-lg lg:text-2xl text-primary-400 font-semibold mt-2 sm:mt-3 lg:mt-4 leading-6 sm:leading-7 lg:leading-8">
        Ready to share your knowledge with the world? Let&apos;s create your
        first course!
      </p>

      <Link
        href="/courseManagement"
        className="font-bold  rounded-lg py-2 sm:py-2.5 lg:py-3.5 px-8 bg-primary-400 hover:border hover:border-primary-400 hover:bg-neutral-100 hover:text-primary-400 cursor-pointer text-neutral-100 text-sm sm:text-base leading-[120%] transition-all duration-200"
      >
        Create Course
      </Link>
    </div>
  );
}
