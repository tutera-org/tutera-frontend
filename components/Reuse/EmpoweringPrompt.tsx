import Image from "next/image";
import React from "react";

type FeatureCardProps = {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  imageWidth: number;
  imageHeight: number;
};

const EmpoweringPrompt: React.FC<FeatureCardProps> = ({
  image,
  imageAlt,
  title,
  description,
  imageWidth,
  imageHeight,
}) => {
  return (
    <div className="bg-white rounded-[16px] shadow-lg overflow-hidden p-0 lg:py-4 h-full ">
      

<div className="w-full mx-auto h-full flex flex-col px-4 py-4">

  <div className="lg:hidden w-full h-[150px] rounded-[16px] bg-white flex items-center justify-center overflow-hidden">
  <Image
    src={image}
    alt={imageAlt}
    width={1000}
    height={1000}
    className="w-full h-full object-cover rounded-[16px]"
  />
</div>

{/* </div> */}

{/* ✅ DESKTOP — UNTOUCHED */}
<div
  className="hidden lg:block"
  style={{ aspectRatio: `${imageWidth}/${imageHeight}` }}
>
  <Image
    src={image}
    alt={imageAlt}
    width={imageWidth}
    height={imageHeight}
    className="rounded-[16px] w-full h-full object-cover"
  />
</div>

{/* ✅ TEXT SECTION */}
<div className=" py-2 lg:py-0 flex flex-col justify-start overflow-hidden mt-1">
  <h3 className="text-[1.5rem] lg:text-[24px] md:text-[2rem] font-semibold text-[#101A33] mb-1 lg:mb-3 line-clamp-2">
    {title}
  </h3>
  <p className=" text-[1rem] font-semibold text-[#5D5D5D] leading-tight lg:leading-relaxed line-clamp-3 lg:line-clamp-none">
    {description}
  </p>
</div>
</div>
 


    </div>
  );
};

export default EmpoweringPrompt;
