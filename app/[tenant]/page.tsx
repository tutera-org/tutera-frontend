"use client";
import TuteraLoading from "@/components/Reuse/Loader";
import { api } from "@/lib/axiosClientInstance";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SocialLinks {
  twitter: string;
  linkedin: string;
  youtube: string;
  instagram: string;
}

interface Section1 {
  image: string;
}

interface Section2 {
  description: string;
  image: string;
}

interface Section3 {
  description: string;
  image: string;
}

interface Section4 {
  title: string;
  description: string;
  image: string;
}

interface Testimonial {
  image: string;
  name: string;
  jobTitle: string;
  remark: string;
}

interface Section5 {
  testimonials: Testimonial[];
}

interface Sections {
  section1: Section1;
  section2: Section2;
  section3: Section3;
  section4: Section4;
  section5: Section5;
}

interface CustomizationData {
  _id: string;
  tenantId: string;
  logo: string;
  brandName: string;
  socialLinks: SocialLinks;
  sections: Sections;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CustomizationResponse {
  success: boolean;
  message: string;
  data: CustomizationData;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: CustomizationData;
}

export default function TenantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [customizationData, setCustomizationData] =
    useState<CustomizationData | null>(null);
  const [tenantName, setTenantName] = useState("School");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTenantName = localStorage.getItem("tenant_name") || "School";
      setTenantName(storedTenantName);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching data from /v1/customization...");

        const response = await api.get("/v1/customization");
        console.log("Raw API response:", response);

        if (response.data?.success && response.data.data?.data) {
          console.log("Data received:", response.data.data.data);
          setCustomizationData(response.data.data.data);
        } else {
          throw new Error(
            response.data?.message || "No data received from server"
          );
        }
      } catch (error: any) {
        console.error("Error in fetchData:", {
          error: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        const message =
          error.response?.data?.error ||
          error.message ||
          "Failed to load customization data";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (customizationData?.sections) {
      console.log("Sections in customizationData:", customizationData.sections);
      console.log("Section 2 exists:", !!customizationData.sections.section2);
      console.log("Section 2 content:", customizationData.sections.section2);
    }
  }, [customizationData]);

  if (loading) {
    return <TuteraLoading />;
  }

  return (
    <>
      <section className="flex items-center justify-between bg-orange-300 -mt-5 px-4 sm:px-8 md:px-16 lg:px-24 py-4 md:py-6">
        {customizationData?.logo ? (
          <img
            src={customizationData.logo}
            className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover object-center"
            alt="Logo image"
          />
        ) : (
          <h1 className="text-white font-bold text-lg sm:text-xl md:text-2xl capitalize">
            {customizationData?.brandName || tenantName}
          </h1>
        )}
        <button
          onClick={() => router.push("/signIn")}
          className="bg-orange-200 py-1.5 px-4 sm:px-6 md:px-8 rounded-lg text-sm md:text-base text-white hover:bg-orange-300 hover:font-bold cursor-pointer"
        >
          Sign In
        </button>
      </section>

      <div className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto">
        {/* Section 1 */}
        {customizationData?.sections.section1.image && (
          <img
            src={customizationData.sections.section1.image}
            alt="Hero Image"
            className="w-full h-auto max-h-[400px] md:max-h-[500px] lg:max-h-[600px] object-cover"
          />
        )}

        {/* Section 2 */}
        {customizationData?.sections?.section2?.description && (
          <section className="flex flex-col gap-3 sm:gap-4 md:gap-5 mt-10 md:mt-16 lg:mt-20">
            <h1 className="text-center font-semibold text-2xl sm:text-3xl md:text-4xl text-neutral-900">
              Why Learn Here
            </h1>
            <p className="text-center text-neutral-800 text-base sm:text-lg md:text-xl px-2 sm:px-4">
              {customizationData.sections.section2.description}
            </p>
            {customizationData.sections.section2.image && (
              <img
                className="rounded-2xl w-full h-auto max-h-[300px] sm:max-h-[400px] md:max-h-[500px] object-cover"
                src={customizationData.sections.section2.image}
                alt="Learners image"
              />
            )}
            <button
              onClick={() => router.push("/signUp")}
              className="px-6 sm:px-8 py-1.5 rounded-lg bg-orange-300 block mx-auto text-sm sm:text-base text-white font-bold mt-2 sm:mt-3"
            >
              Enroll Now
            </button>
          </section>
        )}

        {/* Section 3 */}
        {customizationData?.sections.section3.description && (
          <section className="mt-10 md:mt-16 lg:mt-20 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
            <aside className="flex flex-col w-full md:basis-[50%] gap-3 sm:gap-4 md:gap-5">
              <h1 className="text-center font-semibold text-2xl sm:text-3xl md:text-4xl text-neutral-900">
                What We Offer
              </h1>
              <p className="text-center text-neutral-800 text-base sm:text-lg md:text-xl px-2 sm:px-4 md:px-0">
                {customizationData.sections.section3.description}
              </p>
            </aside>

            {customizationData.sections.section3.image && (
              <img
                src={customizationData.sections.section3.image}
                className="w-full md:basis-[40%] lg:basis-[30%] h-auto max-h-[250px] sm:max-h-[300px] md:max-h-[350px] object-cover rounded-lg"
                alt="School logo"
              />
            )}
          </section>
        )}

        {/* Section 4 */}
        {customizationData?.sections.section4.description && (
          <section className="mt-10 md:mt-16 lg:mt-20 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
            {customizationData.sections.section4.image && (
              <img
                src={customizationData.sections.section4.image}
                alt="Section 4 image"
                className="w-full md:basis-[40%] lg:basis-[30%] h-auto max-h-[250px] sm:max-h-[300px] md:max-h-[350px] object-cover rounded-lg md:order-first"
              />
            )}

            <aside className="flex flex-col w-full md:basis-[50%] gap-3 sm:gap-4 md:gap-5">
              <h1 className="text-center font-semibold text-2xl sm:text-3xl md:text-4xl text-neutral-900">
                {customizationData.sections.section4.title}
              </h1>
              <p className="text-center text-neutral-800 text-base sm:text-lg md:text-xl px-2 sm:px-4 md:px-0">
                {customizationData.sections.section4.description}
              </p>
            </aside>
          </section>
        )}

        <section className="mt-10 md:mt-16 lg:mt-20 mb-10 md:mb-16">
          <h3 className="text-center font-semibold text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-8 sm:mb-12 md:mb-20">
            Quotes From Past Students
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {customizationData?.sections.section5.testimonials.map(
              (testimonial) => (
                <aside
                  key={testimonial.name}
                  className="flex flex-col items-center gap-2 sm:gap-3"
                >
                  {testimonial.image && (
                    <img
                      src={testimonial.image}
                      alt="Student Photo"
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-full"
                    />
                  )}
                  <h3 className="font-semibold text-base sm:text-lg">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-600">
                    {testimonial.jobTitle}
                  </p>
                  <p className="text-center text-sm sm:text-base text-neutral-700 px-2">
                    {testimonial.remark}
                  </p>
                </aside>
              )
            )}
          </div>
        </section>
      </div>
      <section className="mt-10 md:mt-16 lg:mt-20 bg-orange-300 min-h-[200px] md:h-[263.17px] px-4 sm:px-8 md:px-16 lg:px-24 py-6 md:py-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8">
        <aside className="flex flex-col gap-3">
          {customizationData?.logo ? (
            <img
              src={customizationData.logo}
              className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover object-center"
              alt="Logo image"
            />
          ) : (
            <h1 className="text-white font-bold text-lg sm:text-xl md:text-2xl capitalize">
              {customizationData?.brandName || tenantName}
            </h1>
          )}

          {/* Social media handles */}
          <div className="flex flex-col gap-2 sm:gap-3">
            {/* Twitter */}
            {customizationData?.socialLinks.twitter && (
              <Link
                target="_blank"
                className="text-white underline hover:text-gray-300 font-semibold text-base sm:text-lg md:text-xl"
                href={customizationData.socialLinks.twitter}
              >
                Twitter
              </Link>
            )}

            {/* LinkedIn */}
            {customizationData?.socialLinks.linkedin && (
              <Link
                target="_blank"
                className="text-white underline hover:text-gray-300 font-semibold text-base sm:text-lg md:text-xl"
                href={customizationData.socialLinks.linkedin}
              >
                linkedIn
              </Link>
            )}

            {/* Youtube */}
            {customizationData?.socialLinks.youtube && (
              <Link
                target="_blank"
                className="text-white underline hover:text-gray-300 font-semibold text-base sm:text-lg md:text-xl"
                href={customizationData.socialLinks.youtube}
              >
                YouTube
              </Link>
            )}

            {/* Instagram */}
            {customizationData?.socialLinks.instagram && (
              <Link
                target="_blank"
                className="text-white underline hover:text-gray-300 font-semibold text-base sm:text-lg md:text-xl"
                href={customizationData.socialLinks.instagram}
              >
                Instagram
              </Link>
            )}
          </div>
        </aside>
        <aside className="flex flex-col gap-3 sm:gap-4 text-base sm:text-lg md:text-xl font-semibold text-white">
          <p>Teach and earn online with</p>
          <img
            src="/logo.svg"
            alt="Tutera logo"
            className="w-32 sm:w-36 md:w-40 h-auto"
          />
        </aside>
      </section>
    </>
  );
}
