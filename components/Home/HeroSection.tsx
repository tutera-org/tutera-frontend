import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="w-full bg-[#F0F4FF]">
     <div className="max-w-[1240px] mx-auto py-10">
     <div className=" w-[80%] mx-auto flex flex-col items-center justify-center space-y-6 text-center">
        <h3 className="text-[1.5rem] md:text-[3.75rem] text-center text-[#101A33] leading-[72px] font-semibold">
          Own Your Earning. Own your Audience. <span className="text-[#E8C56B]">Own Your Brand.</span>
        </h3>
        <p className="text-[#4B4B4B] text-[1.5rem]">
          Tutera is the LMS built to empowering educators across africa to
          teach, own, and earn on their own terms all in one simple platform.
        </p>
        <div>
          <button>Launch Now</button>
          <button>Explore Plans</button>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Image
          src="/heroImage1.svg"
          alt="hero-image1"
          width={403}
          height={344}
        />
        <Image
          src="/HeroImage2.svg"
          alt="hero-image2"
          width={403}
          height={434}
        />
        <Image
          src="/HeroImage3.svg"
          alt="hero-image3"
          width={403}
          height={344}
        />
      </div>
     </div>
    </div>
  );
};

export default HeroSection;
