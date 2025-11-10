import Image from "next/image";

const CreatorsTestimony = () => {
  return (
    <section className="w-full bg-[#F0F4FF] h-screen">
      <div className="w-[90%] lg:max-w-[1240px] mx-auto  flex flex-col space-y-8 pt-6 items-center font-semibold text-center">
        <h2 className="text-[3rem] w-[50%] mx-auto  lg:leading-[52px] text-[#1A1A1A]">
          Creators Who Chose Tutera and Never Looked Back.
        </h2>
        <p className="text-[1.25rem] w-[53%] mx-auto text-[#4B4B4B] ">
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
