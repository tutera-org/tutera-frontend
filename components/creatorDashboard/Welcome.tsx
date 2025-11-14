export default function Welcome() {
  return (
    <div className="mb-5">
      <h1 className="font-semibold text-2xl sm:text-3xl lg:text-[2.5rem] leading-8 sm:leading-10 lg:leading-12 text-neutral-900">
        Welcome to Tutera
      </h1>
      <p className="text-base sm:text-lg lg:text-2xl text-primary-400 font-semibold mt-2 sm:mt-3 lg:mt-4 leading-6 sm:leading-7 lg:leading-8">
        Ready to share your knowledge with the world? Let's create your first
        course!
      </p>
      <button className="font-bold mt-4 sm:mt-5 lg:mt-6 rounded-lg py-2 sm:py-2.5 lg:py-1.5 px-6 bg-primary-400 hover:border hover:border-primary-400 hover:bg-neutral-100 hover:text-primary-400 cursor-pointer text-neutral-100 text-sm sm:text-base leading-[120%] transition-all duration-200">
        Create Module
      </button>
    </div>
  );
}
