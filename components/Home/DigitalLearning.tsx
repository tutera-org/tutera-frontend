"use client";

import { useRouter } from "next/navigation";
import Button from "../Reuse/Button";
import Image from "next/image";


const DigitalLearning = () => {
  
  const handleExplorePlans = () => {
    router.push("/Pricing");
  };
  const router = useRouter();
  return (
    <section className="w-full bg-[#FFFFFF] py-4 lg:py-24 ">
      <div className="w-[90%] md:w-[70%] lg:max-w-[1440px] mx-auto relative">
       
        <div className="absolute md:top-[-23%] top-[-12%] md:right-[25%] right-[10%]  rounded-lg flex items-center justify-center z-10">
          <Image
            src="/icon2.svg"
            alt="Upload icon"
            width={32}
            height={32}
            className="w-[30px] h-[30px] md:w-[52px] md:h-[52px]"
             data-aos="zoom-in"
             data-aos-delay="300"
             data-aos-once="false"
          />
        </div>

       
        <div className="absolute md:bottom-[1%] lg:bottom-[20%] bottom-[45%] md:right-[12%] right-[-5%] -translate-y-1/2  rounded-lg flex items-center justify-center z-10">
          <Image
            src="/icon3.svg"
            alt="Building icon"
            width={32}
            height={32}
            className="w-[30px] h-[30px] md:w-[52px] md:h-[52px]"
             data-aos="zoom-in"
             data-aos-delay="300"
             data-aos-once="false"
          />
        </div>

       
        <div className="absolute md:bottom-0 bottom-[10%] md:left-[15%] left-[1%]  rounded-lg flex items-center justify-center z-10">
          <Image
            src="/icon1.svg"
            alt="Monitor icon"
            width={32}
            height={32}
            className="w-[30px] h-[30px] md:w-[52px] md:h-[52px]"
             data-aos="zoom-in"
             data-aos-delay="300"
             data-aos-once="false"
          />
        </div>

        {/* Main Content */}
        <div className="max-w-[813.16px] mx-auto text-center z-0">
          <p className=" text-[1.2rem] md:text-[1.5rem] lg:text-[2rem] font-medium text-[#101A33] mb-14 md:leading-[40px]">
            In today&apos;s digital learning space, speed and ownership defines
            success. Tutera simplifies online teaching, reduces setup friction,
            and empowers instructors with branding and monetization tools that
            helps Educators delivers maximum results in minimal time.
          </p>

          <Button 
          variant="primary" 
          className=" w-[50%] md:w-[24%] py-[10px] text-[1rem] rounded-[8px] shadow-md"
          onClick={handleExplorePlans}
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
          data-aos-once="false"
          >
            Explore Plans
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DigitalLearning;
