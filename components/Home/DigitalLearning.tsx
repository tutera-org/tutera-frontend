import Button from "../Reuse/Button";
import Image from "next/image";

const DigitalLearning = () => {
  return (
    <section className="w-full bg-[#F0F4FF] py-4 md:py-24 ">
      <div className="w-[90%] lg:max-w-[1240px] mx-auto relative">
       
        <div className="absolute md:top-[-23%] top-[-12%] md:right-[25%] right-[10%]  rounded-lg flex items-center justify-center z-10">
          <Image
            src="/icon2.svg"
            alt="Upload icon"
            width={32}
            height={32}
            className="w-[30px] h-[30px] md:w-[52px] md:h-[52px]"
          />
        </div>

       
        <div className="absolute md:top-[58%] top-[50%] md:right-[12%] right-[-5%] -translate-y-1/2  rounded-lg flex items-center justify-center z-10">
          <Image
            src="/icon3.svg"
            alt="Building icon"
            width={32}
            height={32}
            className="w-[30px] h-[30px] md:w-[52px] md:h-[52px]"
          />
        </div>

       
        <div className="absolute md:bottom-0 bottom-[10%] md:left-[15%] left-[1%]  rounded-lg flex items-center justify-center z-10">
          <Image
            src="/icon1.svg"
            alt="Monitor icon"
            width={32}
            height={32}
            className="w-[30px] h-[30px] md:w-[52px] md:h-[52px]"
          />
        </div>

        {/* Main Content */}
        <div className="max-w-[813.16px] mx-auto text-center z-0">
          <p className="text-[1.2rem] md:text-[2rem] font-semibold text-[#101A33] mb-8 md:leading-[40px]">
            In today&apos;s digital learning space, speed and ownership defines
            success. Tutera simplifies online teaching, reduces setup friction,
            and empowers instructors with branding and monetization tools that
            helps Educators delivers maximum results in minimal time.
          </p>

          <Button variant="primary" className=" w-[48%] md:w-[24%] py-[10px] text-[1rem] rounded-[8px] shadow-lg">
            Explore Plans
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DigitalLearning;
