"use client";
import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
import StudentButton from "./Button";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";

export default function Marketplace() {
  const router = useRouter();
  const handleViewCourseDetail = () => {
    // Route to view more details
    router.push("/dashboard/1");
  };

  const courses = [
    {
      id: 1,
      title: "Ansah omitted Title",
      img: "/marketPlace.svg",
      desc: "Learn how to build the part of a website or app that works behind the scenes. You'll understand how to connect apps to databases, make them run faster, keep them secure, and handle many users at once.",
      stars: 3,
      amt: "2000",
    },
    {
      id: 2,
      title: "UI/UX Design Masterclass",
      img: "/marketPlace.svg",
      desc: "Learn how to design beautiful and easy-to-use apps and websites. This course teaches you how to understand users, create wireframes and prototypes, and turn ideas into designs people will love to use.",
      stars: 4,
      amt: "1000",
    },
    {
      id: 3,
      title: "Front-End Fundamentals",
      img: "/marketPlace.svg",
      desc: "Learn the basics of building websites and web apps that users see and interact with. This course covers HTML, CSS, and JavaScript to help you create responsive, attractive, and functional web pages.",
      stars: 4,
      amt: "25000",
    },
    {
      id: 4,
      title: "Web3 Mastery",
      img: "/marketPlace.svg",
      desc: "Explore the future of the internet through blockchain technology. Learn how to build decentralized apps (dApps), understand smart contracts, and discover how Web3 is changing finance, ownership, and online communities.",
      stars: 3,
      amt: "20000",
    },
    {
      id: 5,
      title: "Marketing Masterclass",
      img: "/marketPlace.svg",
      desc: "Learn how to attract, engage, and grow your audience using effective marketing strategies. This course covers branding, social media, content creation, and digital campaigns to help you promote any product or business successfully.",
      stars: 3,
      amt: "10000",
    },
    {
      id: 6,
      title: "Machine Learning Fundamentals",
      img: "/marketPlace.svg",
      desc: "Learn how computers can make predictions and decisions without being directly programmed. This course introduces you to data analysis, model training, and real-world applications of AI that power smart technologies.",
      stars: 3,
      amt: "25900",
    },
  ];

  const formatAmount = (amount: string) => {
    // add naira and , where neccessary
    const number = parseFloat(amount.replace(/,/g, ""));
    return `₦${number.toLocaleString("en-NG")}`;
  };

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
      <section className="mt-10 sm:mt-12 lg:mt-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 sm:gap-x-7 gap-y-8 sm:gap-y-11">
        {courses.map((course) => (
          <div
            className="py-3 sm:py-4 px-3 sm:px-4 bg-white flex-col flex gap-3 sm:gap-4 rounded-2xl"
            key={course.id}
          >
            <div className="relative w-full aspect-326/149 max-w-[326px] mx-auto">
              {/* Image */}
              <Image
                src={course.img}
                fill
                alt={course.title}
                className="object-cover rounded-lg"
              />
            </div>

            {/* title */}
            <h3 className="font-semibold text-lg sm:text-xl text-neutral-900">
              {course.title}
            </h3>

            {/* description */}
            <p className="font-semibold text-xs sm:text-sm text-neutral-900">
              {course.desc}
            </p>

            {/* Stars */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <AiFillStar
                  key={star}
                  className={
                    star <= course.stars
                      ? "text-[rgba(133,32,9,1)]"
                      : "text-transparent stroke-[rgba(133,32,9,1)]"
                  }
                  style={
                    star > course.stars ? { strokeWidth: "40px" } : undefined
                  }
                  size={20}
                />
              ))}
            </div>

            {/* Amount */}
            <p className="font-semibold text-lg sm:text-xl">
              {formatAmount(course.amt)}
            </p>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-2">
              <StudentButton className="w-full sm:w-auto">
                Buy Now
              </StudentButton>
              <StudentButton
                onClick={handleViewCourseDetail}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Course Details
              </StudentButton>
            </div>
          </div>
        ))}
      </section>{" "}
    </>
  );
}
