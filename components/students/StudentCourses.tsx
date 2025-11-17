import { CiSearch } from "react-icons/ci";
import StudentButton from "./Button";
import Link from "next/link";
import EmptyStudentPage from "./EmptyStudent";
import PopulatedStudentPage from "./PopulatedStudentPage";

export default function MyCourses() {
  const hasBoughtCourses = true;
  return (
    <>
      <div className="flex gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-white items-center rounded-lg shadow-sm border border-gray-200">
        <CiSearch className="text-xl sm:text-2xl text-gray-400 shrink-0" />
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search courses..."
          className="w-full py-1 text-sm sm:text-base search placeholder:text-gray-400"
        />
      </div>

      <h3 className="font-bold text-neutral-900 text-xl sm:text-2xl md:text-3xl mt-4 sm:mt-6">
        My Courses
      </h3>

      {hasBoughtCourses ? <PopulatedStudentPage /> : <EmptyStudentPage />}
    </>
  );
}
