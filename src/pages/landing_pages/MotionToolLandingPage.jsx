import React from "react";
import { Link } from "react-router-dom";
import MagnetLines from "../../reusable_components/animated_components/MagnetLines";
import GradientText from "../../reusable_components/animated_components/GradientText";
import SplashCursor from "../../reusable_components/animated_components/SplashCursor";
import Footer from "../../reusable_components/Footer";
import { Button } from "@heroui/react";

const MotionToolLandingPage = () => {
  return (
    <div>
      <SplashCursor className="-z-10" />
      <MagnetLines
        containerSize="100%"
        baseAngle={0}
        columns={12}
        row={7}
        lineWidth="0.25rem"
        lineHeight="4rem"
        lineColor="#2f2f2f"
        className="mb-2 mt-2 absolute -z-10"
      />
      <div className="w-full h-screen flex flex-row justify-center items-center">
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={10}
          showBorder={false}
          className="custom-class text-[10rem] font-extrabold font-teko"
        >
          MOTION
        </GradientText>
      </div>
      <div className="w-full h-screen flex flex-col justify-center items-center text-left">
        <div className="text-8xl font-bold m-4 font-bungee">
          Welcome to Motion
        </div>
        <div className="text-4xl m-4 font-unica bg-gradient-to-r from-blue-600 via-[#2af7f7] to-pink-400 text-transparent bg-clip-text">
          The Ultimate video editing experience.
        </div>
        <Link to="/vision" className="m-4 w-[60%] h-12">
          <Button
            variant="ghost"
            className="hover:text-black font-bungee font-extrabold w-full text-lg bg-transparent hover:bg-gradient-to-r from-blue-600/70 via-[#2af7f7]/70 to-pink-400/70 transition-all duration-300"
          >
            Explore
          </Button>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default MotionToolLandingPage;
