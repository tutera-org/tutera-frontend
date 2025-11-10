"use client";

import Image from "next/image";
import Button from "../Reuse/Button";
import {useRouter} from "next/navigation"

const HeroSection = () => {

  const handleSignUp = () => {
    router.push("/signUp");
  };

  const handleExplorePlans = () => {
    router.push("/pricing");
  };
  const router = useRouter();
  return (
    <section className="w-full bg-[#F0F4FF]">
      <div className="w-[90%] lg:max-w-[1240px] mx-auto md:pt-10 pb-24">
        <div className=" xl:w-[70%] mx-auto flex flex-col items-center justify-center space-y-6 text-center">
          <h3 className="text-[1.5rem] md:text-[3rem] lg:text-[3.75rem] text-center text-[#101A33] lg:leading-[72px] font-semibold">
            Own Your Earning. Own your Audience.{" "}
            <span className="text-[#E8C56B] text-shadow-sm">
              Own Your Brand.
            </span>
          </h3>
          <p className="text-[#4B4B4B] text-[1rem] md:text-[1.5rem] font-semibold">
            Tutera is the LMS built to empowering educators across africa to
            teach, own, and earn on their own terms all in one simple platform.
          </p>
          <div className="flex flex-col md:flex-row  gap-4 text-[1rem] pb-10 lg:pb-24">
            <Button
              variant="primary"
              className="rounded-[8px] py-3 px-[48px] text-[#DBE4FA]"
                onClick={handleSignUp}
            >
              Launch Now
            </Button>
            <Button
              variant="secondary"
              className="border-2 py-3 px-[48px] rounded-[8px]"
              onClick={handleExplorePlans}
            >
              Explore Plans
            </Button>
          </div>
        </div>
        <div className="relative flex flex-col gap-4 xl:flex-row items-center xl:justify-between">
         <div className="relative">
         <Image
            src="/heroImage1.svg"
            alt="hero-image1"
            width={403}
            height={344}
          
          />
          <p  className=" xl:hidden block absolute bg-[#ffffff] font-bold text-[18px] text-[#101A33] py-[8px] rounded-[8px] px-[24px] text-center top-[40%] left-[-1%]   ">Tutera makes that your reality</p>
          
         </div>
          <div className="relative">
          <Image
            src="/HeroImage2.svg"
            alt="hero-image2"
            width={403}
            height={434}
          
          />
          <p  className=" xl:hidden block absolute bg-[#ffffff] font-bold text-[18px] text-[#101A33] py-[8px] rounded-[8px] px-[24px] text-center bottom-[12%] right-[-1%]   ">Focus on what you do best</p>
          </div>
          <div className="relative">
          <Image
            src="/HeroImage3.svg"
            alt="hero-image3"
            width={403}
            height={344}
           
          />
          <p  className=" xl:hidden block absolute bg-[#ffffff] font-bold text-[18px] text-[#101A33] py-[8px] rounded-[8px] px-[24px] text-center bottom-[12%] left-[-1%]   ">We handle the tech</p>
          </div>


         
            <p className="hidden xl:block absolute bg-[#ffffff] font-bold text-[18px] text-[#101A33] py-[8px] rounded-[8px] px-[24px] text-center top-[12%] left-0 xl:top-[20%] xl:left-[20%]  ">Tutera makes that your reality</p>
       
            <p className="hidden xl:block absolute bg-[#ffffff] font-bold text-[18px] text-[#101A33] py-[8px] rounded-[8px] px-[24px] text-center  bottom-[20%] left-[25%] ">We handle the tech</p>
          
          
            <p className="hidden xl:block absolute bg-[#ffffff] font-bold text-[18px] text-[#101A33] py-[8px] rounded-[8px] px-[24px] text-center bottom-[37%] right-[22%]">Focus on what you do best</p>
         
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
