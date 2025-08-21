import React from "react";
import { KushalImgWithFrame } from "../../assets";

const LandingPageAboutUs = () => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row xl:flex-row justify-center p-7 lg:p-20 xl:p-20 items-center gap-28 lg:gap-5 xl:gap-5 w-full bg-black">
        <div className="h-[25rem] w-[25rem] lg:w-[50%] xl:w-[50%] lg:h-full xl:h-full flex items-center">
          <img
            src={KushalImgWithFrame}
            className="w-full object-cover scale-80 object-bottom -rotate-[2deg]"
          />
        </div>
        <div className="w-full h-full flex flex-col justify-center">
          <div className="flex flex-row text-start font-bold text-2xl lg:text-4xl xl:text-4xl ml-[4px] lg:ml-[6px] xl:ml-[6px] text-[#23b5b5] font-poppins">
            Founder
          </div>
          <div className="flex flex-row mb-8 text-start font-semibold text-6xl lg:text-8xl xl:text-8xl font-unica capitalize">
            KUSHAL
          </div>
          <div className="flex flex-row text-start font-extralight text-medium lg:text-lg xl:text-lg ml-[5px] font-maven text-gray-400">
            Kushal is a creative entrepreneur and experienced product manager
            with a passion for innovation and delivering exceptional results for
            clients. A graduate of BITS Pilani, he brings over nine years of
            expertise across technology, product management, and media
            production. Having worked internationally and collaborated with
            diverse teams, Kushal blends a global perspective with a creative
            mindset. His journey as a musician and media creator has fueled his
            dedication to storytelling and design excellence, helping brands
            achieve impactful growth and memorable engagement.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageAboutUs;
