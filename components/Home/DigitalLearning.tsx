import Button from "../Reuse/Button";
import Image from "next/image";

const DigitalLearning = () => {
  return (
    <section className="w-full bg-[#F0F4FF] py-24 ">
      <div className="w-[90%] lg:max-w-[1240px] mx-auto relative">
       
        <div className="absolute top-[-23%] right-[25%]  rounded-lg flex items-center justify-center z-10">
          <Image
            src="/icon2.svg"
            alt="Upload icon"
            width={52}
            height={52}
            
          />
        </div>

       
        <div className="absolute top-[58%] right-[12%] -translate-y-1/2  rounded-lg flex items-center justify-center z-10">
          <Image
            src="/icon3.svg"
            alt="Building icon"
            width={52}
            height={52}
            
          />
        </div>

       
        <div className="absolute bottom-0 left-[15%]  rounded-lg flex items-center justify-center z-10">
          <Image
            src="/icon1.svg"
            alt="Monitor icon"
            width={52}
            height={52}
            
          />
        </div>

        {/* Main Content */}
        <div className="max-w-[813.16px] mx-auto text-center z-0">
          <p className="text-[1rem] md:text-[2rem] font-semibold text-[#101A33] mb-8 leading-[40px]">
            In today&apos;s digital learning space, speed and ownership defines
            success. Tutera simplifies online teaching, reduces setup friction,
            and empowers instructors with branding and monetization tools that
            helps Educators delivers maximum results in minimal time.
          </p>

          <Button variant="primary" className="w-[24%] py-[10px] text-[1rem] rounded-[8px] shadow-lg">
            Explore Plans
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DigitalLearning;
