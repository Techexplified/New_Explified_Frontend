import React from "react";
import { Button } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import { AuthorityIcon, Background1, ContentCreationIcon, DataDrivenIcon } from "../../assets";

const ChooseUsComponent = ({ image, title, description }) => {
  return (
    <div className="flex flex-col m-4 gap-5 flex-1 text-ellipsis">
      <img src={image} className="w-full h-20 object-contain" />
      <div className="text-xl font-poppins font-semibold text-center">
        {title}
      </div>
      <div className="text-sm font-maven text-gray-400 text-center">
        {description}
      </div>
    </div>
  );
};

const WhyChooseUsSection = () => {
  return (
    <div className="flex flex-col justify-center items-center p-7 md:p-40 xl:p-40 text-center gap-10">
      <div className="absolute w-full h-[90rem] lg:h-[58.5rem] xl:h-[58.5rem] -z-10 bg-black">
        <img src={Background1} className="object-cover w-full h-full blur-sm" />
      </div>
      <div className="w-full lg:w-[75%] xl:w-[75%] flex flex-col gap-6">
        <div className="text-6xl lg:text-7xl xl:text-7xl font-breakbrush">
          Why <span className="text-[#eabf1d]">Choose</span> Us
        </div>
        <div className="font-maven text-sm lg:text-medium xl:text-medium text-gray-400">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt quos
          optio vel excepturi doloribus asperiores delectus! Ducimus
          voluptatibus pariatur illum aut, adipisci at suscipit quod accusamus
          unde! Aliquam, recusandae iure?
        </div>
      </div>
      <div className="flex flex-col lg:flex-row xl:flex-row gap-10 lg:w-[75%] xl:w-[75%]">
        <ChooseUsComponent
          title={"Data Driven Inbound Lead Generation"}
          description={
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, dolorum, saepe ullam, voluptate recusandae suscipit officiis reiciendis porro facilis vero sed perspiciatis tempora? Modi repellat minima dicta nihil quisquam fuga?"
          }
          image={DataDrivenIcon}
        />
        <ChooseUsComponent
          title={"Conversion Focused Content Creation"}
          description={
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, dolorum, saepe ullam, voluptate recusandae suscipit officiis reiciendis porro facilis vero sed perspiciatis tempora? Modi repellat minima dicta nihil quisquam fuga?"
          }
          image={ContentCreationIcon}
        />
        <ChooseUsComponent
          title={"Be The Authority"}
          description={
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, dolorum, saepe ullam, voluptate recusandae suscipit officiis reiciendis porro facilis vero sed perspiciatis tempora? Modi repellat minima dicta nihil quisquam fuga?"
          }
          image={AuthorityIcon}
        />
      </div>
      <Button className="font-unica bg-white text-black rounded-md">
        <div className="flex flex-row justify-center items-center text-xl gap-2">
          <span>GET STARTED</span>
          <ArrowRight />
        </div>
      </Button>
    </div>
  );
};

export default WhyChooseUsSection;
