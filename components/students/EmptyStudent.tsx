export default function EmptyStudentPage() {
  return (
    <div className="py-8 sm:py-10 md:py-16 flex items-center justify-center flex-col px-4">
      <img
        src="/emptyCourse.png"
        alt="Empty course icon"
        className="w-32 sm:w-40 md:w-auto max-w-full h-auto"
      />
      <h3 className="text-neutral-900 font-semibold mt-5 sm:mt-6 md:mt-7 text-2xl sm:text-3xl md:text-4xl text-center">
        No Courses Yet
      </h3>
      <p className="text-neutral-900 text-base sm:text-lg md:text-xl font-semibold mt-3 sm:mt-4 text-center max-w-md">
        Your courses will appear here once you buy them
      </p>

      {/* TODO: Make MarketPlace a global state in zustand and remove a tag */}
      <a
        className="bg-orange-300 mt-5 sm:mt-6 md:mt-7 text-white rounded-lg py-2.5 sm:py-3 px-12 sm:px-16 md:px-24 font-semibold text-sm sm:text-base w-full sm:w-auto text-center"
        href={"/dashboard"}
      >
        Buy Course
      </a>
    </div>
  );
}
