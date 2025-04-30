import React from "react";
import { motion } from "framer-motion";
import Lightning from "../../reusable_components/animated_components/Lightning";

const HeroSection = () => {
  return (
    <div className="relative w-full h-svh flex items-center justify-center px-4 text-center">
      {/* Particle Background */}

      {/* <div className="absolute inset-0 bg-black w-full h-full">
            <Particles
              particleColors={["#ffffff", "#ffffff"]}
              particleCount={200}
              particleSpread={10}
              speed={0.1}
              particleBaseSize={100}
              moveParticlesOnHover={true}
              alphaParticles={false}
              disableRotation={false}
              particleHoverFactor={0.3}
            />
          </div> */}
      <div className="absolute inset-0 w-full h-full">
        <Lightning hue={220} xOffset={0} speed={1} intensity={1} size={1} />
      </div>

      {/* Text Content */}
      <div className="relative z-20 flex flex-col justify-center items-center">
        <motion.div
          className="text-transparent bg-gradient-to-r bg-clip-text from-teal-500 to-violet-700 font-bold font-unica unselectable pointer-events-none"
          style={{
            fontSize: "clamp(3rem, 10vw, 10rem)", // Responsive font size
          }}
          animate={{
            y: [-5, 5, -5], // Moves up and down
          }}
          transition={{
            duration: 3, // Adjust speed of floating
            repeat: Infinity, // Continuous animation
            repeatType: "mirror", // Smooth back and forth
            ease: "easeInOut",
          }}
        >
          EXPLIFIED
        </motion.div>

        <div className="text-gray-600 text-lg md:text-xl font-mono unselectable pointer-events-none">
          Design and Tech Services for Brands
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
