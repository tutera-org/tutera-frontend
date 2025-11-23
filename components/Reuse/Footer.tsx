"use client";

import Image from "next/image";
import Button from "./Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Footer = () => {
  const handleSignUp = () => {
    router.push("/signUp");
  };
  const router = useRouter();
  return (
    <section className="w-full ">
      <div className="relative bg-[#4977E6] pt-50 pb-20 text-white text-[1rem] ">
        <div className="w-[90%]  mx-auto flex flex-col md:flex-row items-top justify-between gap-10">
          <div className="flex flex-col  gap-6">
            <Image
              src="/logo2.svg"
              alt="logo"
              width={80.45}
              height={26}
              loading="lazy"
            />
            <p className="w-full md:w-[45%]">
              A digital learning management system designed to help independent
              instructors and creators build, brand, and scale their online
              academies.{" "}
            </p>
            <nav className="flex items-center gap-4">
              <Link
                href="https://www.linkedin.com/in/tutera-tutera-782824395"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/SocialIcons1.svg"
                  alt="LinkedIn icon"
                  width={16}
                  height={16}
                />
              </Link>
              <Link
                href="https://x.com/tuteraafrica"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/SocialIcons2.svg"
                  alt="X (Twitter) icon"
                  width={16}
                  height={16}
                />
              </Link>
              <Link
                href="https://www.tiktok.com/@tuteraafrica?lang=en"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/titok-white.svg"
                  alt="TikTok icon"
                  width={16}
                  height={16}
                />
              </Link>
              <Link
                href="mailto:tuteralms@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/SocialIcons4.svg"
                  alt="Email icon"
                  width={16}
                  height={16}
                />
              </Link>
            </nav>
          </div>

          <div className="flex items-top gap-10 ">
            <div className="flex flex-col gap-2">
              <p className="text-[1.25rem]">Navigations</p>
              <p>Features</p>
              <p>
                <Link href="/Pricing" className="scale-105  transition-all duration-300">Pricing</Link>
              </p>
              <p>
                <Link href="/contact" className="scale-105 transition-all duration-300">Contact Us</Link>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[1.25rem]">Contact Us</p>
              <p>Features</p>
              <p>tuteralms@gmail.com</p>
            </div>
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-anchor-placement="top-center"
          data-aos-duration="1000"
          data-aos-delay="200"
          data-aos-once="false"
          className="absolute bg-white w-[90%] border border-[#C3C3C3] lg:w-[60%] top-[-45%] left-[50%] translate-x-[-50%]  rounded-[24px] py-14"
        >
          <div className=" w-[90%] lg:w-[80%] mx-auto flex flex-col  lg:flex-row item-center gap-6">
            <Image
              src="/footerImg.svg"
              alt="footer-bg"
              width={400}
              height={189}
            />

            <div className=" flex flex-col gap-6 justify-center items-center md:items-start ">
              <p className="text-[1rem] md:text-[1.25rem] font-medium text-[#101A33]">
                Join the next generation of African knowledge entrepreneurs
                scaling their income.
              </p>
              <Button
                variant="primary"
                className="w-[75%] md:w-[57%] py-3 rounded-[8px] text-[0.875rem] md:text-[1rem] font-bold"
                onClick={handleSignUp}
                data-aos="zoom-in"
                data-aos-duration="1000"
                data-aos-delay="1000"
                data-aos-once="false"
              >
                Start Your Academy Today
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#ffffff]">
        <div className="w-[90%] lg:max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between py-8 text-[#1A1A1A]">
          <p className="text-[1.25rem]">
            {" "}
            © {new Date().getFullYear()} Tutera. All Rights Reserved.
          </p>
          <div>
            <ul className="flex items-center gap-4 text-[0.75rem] font-semibold">
              <li>Privacy Policy</li>
              <li>Terma Use</li>
              <li>Legal</li>
              <li>Site map</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
