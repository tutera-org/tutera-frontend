"use client";
import { AiFillStar } from "react-icons/ai";
import StudentButton from "./Button";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/axiosClientInstance";
import { toast } from "sonner";
import TuteraLoading from "../Reuse/Loader";
import MediaImage from "../Reuse/MediaImage";

// course interface
interface Courses {
  averageRating: number;
  coverImage: string;
  createdAt: string;
  description: string;
  isActive: boolean;
  price: number;
  slug: string;
  status: string;
  tenantId: string;
  title: string;
  totalEnrollments: number;
  updatedAt: number;
  __v: number;
  _id: number;
}

// No need for extended interface - MediaImage handles signed URLs internally

export default function Marketplace() {
  const router = useRouter();
  const handleViewCourseDetail = (courseId: number) => {
    // Route to view more details
    router.push(`/dashboard/${courseId}`);
  };

  // State to populate courses
  const [courses, setCourses] = useState<Courses[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch courses - MediaImage component handles signed URLs automatically
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/v1/marketPlace");
      const coursesData: Courses[] = response.data.data;
      setCourses(coursesData);
      console.log(coursesData);
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Fetching MarketPlace failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatAmount = (amount: number) => {
    const num = amount.toString();
    const number = parseFloat(num.replace(/,/g, ""));
    return `₦${number.toLocaleString("en-NG")}`;
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <TuteraLoading />;
  }

  return (
    <>
      <div className="flex gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-white items-center rounded-lg shadow-sm border border-gray-200">
        <CiSearch className="text-xl sm:text-2xl text-gray-400 shrink-0" />
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-1 text-sm sm:text-base search placeholder:text-gray-400"
        />
      </div>

      <section className="mt-10 sm:mt-12 lg:mt-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 sm:gap-x-7 gap-y-8 sm:gap-y-11">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No courses found
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div
              className="pb-4 sm:pb-6 bg-white flex-col flex gap-3 sm:gap-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              key={course._id}
            >
              <div className="relative w-full aspect-326/169 rounded-t-lg mx-auto  bg-gray-100  overflow-hidden">
                <MediaImage
                  mediaId={course.coverImage}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 space-y-3">
                {/* title */}
                <h3 className="font-semibold text-lg sm:text-xl text-neutral-900 line-clamp-2">
                  {course.title}
                </h3>

                {/* description */}
                <p className="font-normal text-xs sm:text-sm text-neutral-600 line-clamp-1">
                  {course.description}
                </p>

                {/* Stars and Rating */}
                {course.averageRating > 0 && (
                  <div className="flex gap-1 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <AiFillStar
                        key={star}
                        className={
                          star <= Math.round(course.averageRating)
                            ? "text-[rgba(133,32,9,1)]"
                            : "text-gray-300"
                        }
                        size={16}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      ({course.averageRating.toFixed(1)})
                    </span>
                  </div>
                )}

                {/* Amount */}
                <p className="font-semibold text-lg sm:text-xl text-neutral-900">
                  {formatAmount(course.price)}
                </p>

                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-2">
                  <StudentButton
                    onClick={async () => {
                      try {
                        if (!course?._id) return;
                        const response = await api.post("/v1/enrollment", {
                          courseId: course._id,
                        });
                        toast.success("Enrolled successfully!");
                      } catch (error: unknown) {
                        const message =
                          (
                            error as {
                              response?: { data?: { error?: string } };
                            }
                          )?.response?.data?.error || "Enrollment failed";
                        toast.error(message);
                      }
                    }}
                    className="w-full sm:w-auto"
                  >
                    Enroll
                  </StudentButton>
                  <StudentButton
                    onClick={() => handleViewCourseDetail(course._id)}
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    Course Details
                  </StudentButton>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}
