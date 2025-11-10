import Image from "next/image";

const CreatorsTestimony = () => {
    return (
      <section className="w-full bg-[#F0F4FF] md:h-screen">
      <div className="w-[90%] lg:max-w-[1240px] mx-auto  flex flex-col pt-6 pb-5 space-y-5 md:space-y-8 items-center font-semibold text-center">
        <h2 className="text-[1.5rem] md:text-[3rem] w-[90%] md:w-[50%] mx-auto  lg:leading-[52px] text-[#1A1A1A]">
          Creators Who Chose Tutera and Never Looked Back.
        </h2>
        <p className="text-[1rem] md:text-[1.25rem] w-[90%] md:w-[53%] mx-auto text-[#4B4B4B] ">
          Educators across africa shares how tutera helped them teach, grow, and
          own their success.
        </p>
        <Image
          src="/Creators.png"
          alt="Creators testimony"
          width={754}
          height={490}
        />
      </div>
    </section>
  );
};
export default CreatorsTestimony;
