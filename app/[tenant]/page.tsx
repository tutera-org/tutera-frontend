"use client";
import TuteraLoading from "@/components/Reuse/Loader";
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

export default function TenantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [customizationData, setCustomizationData] =
    useState<CustomizationData | null>(null);
  const [tenantSlug, setTenantSlug] = useState<string>("");
  const [tenantName, setTenantName] = useState("School");

  // Extract slug from URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      console.log("Full hostname:", hostname);

      // Extract slug from subdomain
      const slug = hostname.split(".")[0];

      console.log("Extracted slug:", slug);
      setTenantSlug(slug);

      const storedTenantName = localStorage.getItem("tenant_name") || "School";
      setTenantName(storedTenantName);
    }
  }, []);

  useEffect(() => {
    if (!tenantSlug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching data for tenant slug:", tenantSlug);

        const response = await fetch(
          `https://tutera-backend.onrender.com/api/v1/public/landing-page/${tenantSlug}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Parse JSON once and store it
        const responseData: CustomizationResponse = await response.json();

        if (!response.ok) {
          throw new Error(
            responseData.message || `HTTP error! status: ${response.status}`
          );
        }

        // Store the customization data from the response
        if (responseData.success && responseData.data) {
          setCustomizationData(responseData.data);
          console.log("Customization data set:", responseData.data);
        }
      } catch (error: any) {
        console.error("Error in fetchData:", {
          error: error.message,
        });
        toast.error(error.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tenantSlug]);

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
          <div className="w-8 h-8 md:w-10 md:h-10 shrink-0">
            <img
              src={customizationData.logo}
              className="w-full h-full rounded-full object-cover"
              alt="Logo image"
            />
          </div>
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
        {/* Section 1 - Hero Image */}
        {customizationData?.sections?.section1?.image && (
          <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
            <img
              src={customizationData.sections.section1.image}
              alt="Hero Image"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Section 2 - Why Learn Here */}
        {customizationData?.sections?.section2?.description && (
          <section className="flex flex-col gap-3 sm:gap-4 md:gap-5 mt-10 md:mt-16 lg:mt-20">
            <h1 className="text-center font-semibold text-2xl sm:text-3xl md:text-4xl text-neutral-900">
              Why Learn Here
            </h1>
            <p className="text-center text-neutral-800 text-base sm:text-lg md:text-xl px-2 sm:px-4">
              {customizationData.sections.section2.description}
            </p>
            {customizationData.sections.section2.image && (
              <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] overflow-hidden rounded-2xl">
                <img
                  className="w-full h-full object-cover"
                  src={customizationData.sections.section2.image}
                  alt="Learners image"
                />
              </div>
            )}
            <button
              onClick={() => router.push("/signUp")}
              className="px-6 sm:px-8 py-1.5 rounded-lg bg-orange-300 block mx-auto text-sm sm:text-base text-white font-bold mt-2 sm:mt-3"
            >
              Enroll Now
            </button>
          </section>
        )}

        {/* Section 3 - What We Offer */}
        {customizationData?.sections?.section3?.description && (
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
              <div className="w-full md:basis-[40%] lg:basis-[30%] h-[200px] sm:h-[250px] md:h-[300px] overflow-hidden rounded-lg shrink-0">
                <img
                  src={customizationData.sections.section3.image}
                  className="w-full h-full object-cover"
                  alt="School logo"
                />
              </div>
            )}
          </section>
        )}

        {/* Section 4 */}
        {customizationData?.sections?.section4?.description && (
          <section className="mt-10 md:mt-16 lg:mt-20 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
            {customizationData.sections.section4.image && (
              <div className="w-full md:basis-[40%] lg:basis-[30%] h-[200px] sm:h-[250px] md:h-[300px] overflow-hidden rounded-lg shrink-0 md:order-first">
                <img
                  src={customizationData.sections.section4.image}
                  alt="Section 4 image"
                  className="w-full h-full object-cover"
                />
              </div>
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

        {/* Section 5 - Testimonials */}
        {customizationData?.sections?.section5?.testimonials &&
          customizationData.sections.section5.testimonials.length > 0 && (
            <section className="mt-10 md:mt-16 lg:mt-20 mb-10 md:mb-16">
              <h3 className="text-center font-semibold text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-8 sm:mb-12 md:mb-20">
                Quotes From Past Students
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                {customizationData.sections.section5.testimonials.map(
                  (testimonial, index) => (
                    <aside
                      key={`${testimonial.name}-${index}`}
                      className="flex flex-col items-center gap-2 sm:gap-3"
                    >
                      {testimonial.image && (
                        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 overflow-hidden rounded-full shrink-0">
                          <img
                            src={testimonial.image}
                            alt="Student Photo"
                            className="w-full h-full object-cover"
                          />
                        </div>
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
          )}
      </div>

      {/* Footer */}
      <section className="mt-10 md:mt-16 lg:mt-20 bg-orange-300 min-h-[200px] md:h-[263.17px] px-4 sm:px-8 md:px-16 lg:px-24 py-6 md:py-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8">
        <aside className="flex flex-col gap-3">
          {customizationData?.logo ? (
            <div className="w-8 h-8 md:w-10 md:h-10 shrink-0">
              <img
                src={customizationData.logo}
                className="w-full h-full rounded-full object-cover"
                alt="Logo image"
              />
            </div>
          ) : (
            <h1 className="text-white font-bold text-lg sm:text-xl md:text-2xl capitalize">
              {customizationData?.brandName || tenantName}
            </h1>
          )}

          {/* Social media handles */}
          <div className="flex flex-col gap-2 sm:gap-3">
            {customizationData?.socialLinks?.twitter && (
              <Link
                target="_blank"
                className="text-white underline hover:text-gray-300 font-semibold text-base sm:text-lg md:text-xl"
                href={customizationData.socialLinks.twitter}
              >
                Twitter
              </Link>
            )}

            {customizationData?.socialLinks?.linkedin && (
              <Link
                target="_blank"
                className="text-white underline hover:text-gray-300 font-semibold text-base sm:text-lg md:text-xl"
                href={customizationData.socialLinks.linkedin}
              >
                linkedIn
              </Link>
            )}

            {customizationData?.socialLinks?.youtube && (
              <Link
                target="_blank"
                className="text-white underline hover:text-gray-300 font-semibold text-base sm:text-lg md:text-xl"
                href={customizationData.socialLinks.youtube}
              >
                YouTube
              </Link>
            )}

            {customizationData?.socialLinks?.instagram && (
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
          <div className="w-32 sm:w-36 md:w-40 h-auto">
            <img src="/logo.svg" alt="Tutera logo" className="w-full h-auto" />
          </div>
        </aside>
      </section>
    </>
  );
}
