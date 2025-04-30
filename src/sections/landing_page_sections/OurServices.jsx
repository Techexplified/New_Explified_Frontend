import React from "react";
import { TiArrowForwardOutline } from "react-icons/ti";
import { BrandDesignImg, HeroImage, VideoEditorImg } from "../../assets";

const ServicesComponent = ({ image, title, description }) => {
  return (
    <div className="flex flex-col m-4 gap-5 hover:scale-95 transition-all duration-300 flex-1 text-ellipsis">
      <img
        loading="lazy"
        src={image}
        className="w-full h-48 object-cover rounded-md"
      />
      <div className="flex flex-row justify-between items-center">
        <div className="text-xl font-poppins font-semibold">{title}</div>
        <div className="border-1 border-white bg-transparent rounded-full p-[8px]">
          <TiArrowForwardOutline className="w-5 h-5" />
        </div>
      </div>
      <div className="w-full border-1 border-gray-400/25" />
      <div className="text-sm font-maven text-gray-400 text-left">
        {description}
      </div>
    </div>
  );
};

const OurServices = () => {
  return (
    <div className="flex flex-col justify-center items-center p-7 md:p-20 xl:p-20 text-center gap-10 my-20">
      <div className="w-full lg:w-[75%] xl:w-[75%] flex flex-col gap-6">
        <div className="text-6xl lg:text-7xl xl:text-7xl font-breakbrush">
          BASIC INFO ABOUT <br /> OUR{" "}
          <span className="text-[#f20e1d] ">SERVICES</span>
        </div>
        <div className="font-maven text-sm lg:text-medium xl:text-medium text-gray-400">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt quos
          optio vel excepturi doloribus asperiores delectus! Ducimus
          voluptatibus pariatur illum aut, adipisci at suscipit quod accusamus
          unde! Aliquam, recusandae iure?
        </div>
      </div>
      <div className="flex flex-col lg:flex-row xl:flex-row gap-10">
        <ServicesComponent
          title={"Video Editing & Motion Design"}
          description={
            "Professional video editing, animation, and motion graphics to elevate brand storytelling. Special focus on marketing videos, explainer videos, and YouTube content."
          }
          image={VideoEditorImg}
        />
        <ServicesComponent
          title={"Script Writing"}
          description={
            "Crafting clear, engaging scripts that speak directly to your audience. Writing scripts that highlight key points and drive action."
          }
          image={BrandDesignImg}
        />
        <ServicesComponent
          title={"Story Boarding"}
          description={
            "Bring your ideas to life with detailed storyboards that map out every scene. Ensure smooth production with a storyboard that outlines your vision step by step."
          }
          image={HeroImage}
        />
      </div>
    </div>
  );
};

export default OurServices;
