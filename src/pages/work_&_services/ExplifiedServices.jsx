import React from "react";
import Footer from "../../reusable_components/Footer";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";


// Text variants with new patterns
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Floating animation for accents
const floatingVariants = {
  animate: {
    y: [-10, 10],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

// Container variants with new patterns
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

// Image variants
const imageVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const ServiceContainer = ({ title, description, img }) => {
  return (
    <div className="flex flex-col items-center cursor-pointer rounded-3xl bg-zinc-900 h-96 w-80 m-5 transform transition-transform duration-300 hover:bg-gradient-to-tl from-[#23b5b534] to-zinc-900 animate-gradient hover:scale-105 hover:shadow-lg hover:shadow-black hover:border-2  border-[#23b5b5]">
      <div className="flex flex-row items-center justify-center h-44 w-44 rounded-full border-4 bg-[#23b5b5] m-6">
        <img className="h-24 w-24 object-contain invert" src={img} />
      </div>
      <div className="text-xl font-bold my-3 text-center mx-2">{title}</div>
      <Divider />
      <div className="text-sm my-3 text-left m-3">{description}</div>
    </div>
  );
};

// Background accent component
const BackgroundAccent = ({ className }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
    animate={{
      scale: [1, 1.2, 1],
      rotate: [0, 90, 0],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

const ExplifiedServices = () => {
  const targetRef = useRef(null);
  const isInView = useInView(targetRef, { once: false, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });

  return (
    <div>
      <NavBarMain />
      <div className="flex flex-col justify-center items-center overflow-hidden">
        {/* Hero */}
        <motion.div
          ref={targetRef}
          className="relative w-full h-screen flex flex-row-reverse mx-24 justify-center items-center"
          style={{
            backgroundImage: `url(${solution_page_bg_img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "multiply",
            backgroundColor: "#2f2f2f",
          }}
        >
          {/* Animated background accents */}
          <BackgroundAccent className="bg-[#23b5b5] w-96 h-96 -right-48 top-20" />
          <BackgroundAccent className="bg-blue-600 w-72 h-72 left-20 bottom-20" />

          <motion.div
            className="flex flex-col mx-6 w-2/4"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ opacity: springOpacity, scale: springScale }}
          >
            <motion.div
              className="text-4xl font-semibold text-left mt-48 mb-8"
              variants={textVariants}
            >
              <motion.span
                variants={floatingVariants}
                animate="animate"
                className="inline-block"
              >
                Achieve Your Brand Goals with <br />
              </motion.span>
              <motion.span
                className="text-6xl font-bold mb-8"
                variants={textVariants}
              >
                Tailored <br />
              </motion.span>
              <motion.span
                className="mb-7 mt-10 inline-block text-[8.2rem] font-extrabold relative"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "2px #23b5b5",
                }}
                variants={textVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
              >
                DIGITAL
                <motion.span
                  className="absolute -inset-1 opacity-50 blur-lg"
                  style={{
                    color: "#23b5b5",
                    WebkitTextStroke: "0px",
                  }}
                  animate={{
                    opacity: [0.4, 0.6, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  DIGITAL
                </motion.span>
              </motion.span>
              <motion.span
                className="mt-5 inline-block text-[5.5rem] font-extrabold relative"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "2px #23b5b5",
                }}
                variants={textVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
              >
                MARKETING
                <motion.span
                  className="absolute -inset-1 opacity-50 blur-lg"
                  style={{
                    color: "#23b5b5",
                    WebkitTextStroke: "0px",
                  }}
                  animate={{
                    opacity: [0.4, 0.6, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  MARKETING
                </motion.span>
              </motion.span>
            </motion.div>

            <motion.div
              className="text-lg font-light text-left mb-48 text-gray-300"
              variants={textVariants}
              whileInView={{
                opacity: [0, 1],
                y: [20, 0],
              }}
              viewport={{ once: false, margin: "-100px" }}
            >
              We bring your vision to life with personalized strategies that
              create impact, boost engagement, and deliver results.
            </motion.div>
          </motion.div>

          <motion.img
            className="h-full w-2/4 object-cover rounded-r-3xl mx-6 inverse"
            src={solution_page_hero_img_2}
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              scale: 1.03,
              transition: { duration: 0.3 },
            }}
            style={{
              opacity: springOpacity,
              scale: springScale,
            }}
          />

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <motion.div
                className="w-1 h-2 bg-white rounded-full mt-2"
                animate={{
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* 360° */}
        <div className="flex flex-col items-center mt-20">
          <div className="text-4xl font-extrabold mb-10">
            360°{" "}
            <span className="text-[#23b5b5]">
              {" "}
              Digital Marketing Solutions{" "}
            </span>{" "}
            Tailored for Every Business Need
          </div>
          <div className="flex flex-row items-center">
            <ServiceContainer
              title={"Content Marketing"}
              description={"Articles, blogs, and AD copy"}
              img={content_icons}
            />
            <ServiceContainer
              title={"Video Editing"}
              description={"Editing services for creators and businesses."}
              img={video_icons}
            />
            <ServiceContainer
              title={"Market Research & Analysis"}
              description={"AI-driven insights for informed decisions."}
              img={market_r_icons}
            />
          </div>
          <div className="flex flex-row items-center">
            <ServiceContainer
              title={"SEO & Social Media Optimization"}
              description={"Strategies for better online visibility."}
              img={seo_icons}
            />
            <ServiceContainer
              title={"Custom Solutions"}
              description={
                "Tailored marketing campaigns or reviews of brand communications."
              }
              img={solution_icons}
            />
            <ServiceContainer
              title={"YouTube Channel Management"}
              description={
                "optimizes content, engagement, and growth strategies to enhance visibility and maximize a channel's reach and performance"
              }
              img={yt_icons}
            />
          </div>
        </div>

        {/* <div className="flex flex-col w-full h-96 my-20 bg-[#23b5b5] items-center">
            <div className="text-4xl font-extrabold text-center my-16">
              Let's discuss how we can help your brand grow.
              <br />
              Partner with us for expert content creation, strategic SEO, and
              data-driven market research.
            </div>
            <Button
              className="text-xl text-black px-16 font-bold bg-transparent h-16 border-4 border-black hover:border-white hover:bg-black hover:text-white"
              radius="full"
              size="lg"
            >
              Get Consultancy
            </Button>
          </div> */}

        {/* Let's discuss */}
        <div className="flex flex-row-reverse py-20 pl-20 justify-center items-center w-full">
          <img
            className="h-full w-[50%] object-cover rounded-l-3xl mx-6"
            src={solution_page_img_2}
          />
          <div className="flex flex-col mx-6 w-[60%]">
            <div className="text-5xl font-bold text-left mt-48 mb-8">
              <span className="text-3xl font-semibold">Let's discuss</span>
              <br />
              How we can help your
              <br />
              <span className="text-[#23b5b5] text-8xl font-extrabold">
                {" "}
                Brand Grow
              </span>
            </div>
            <div className="text-lg font-extralight text-left mb-48 text-gray-300">
              Partner with us for expert content creation, strategic SEO, and
              data-driven market research.
            </div>
          </div>
        </div>

        {/* <div className="flex flex-col">
            <div className="text-3xl font-extrabold mb-10">
              How We Work With You Every Step of The Way !
            </div>
            <div className="text-lg flex flex-row items-center hover:text-[#23b5b5] cursor-pointer">
              <span className="text-5xl pb-2 mr-3">&#8226;</span>
              Understanding Your Business Goals
            </div>
            <div className="text-lg flex flex-row items-center hover:text-[#23b5b5] cursor-pointer">
              <span className="text-5xl pb-2 mr-3">&#8226;</span>
              Market and Competitor Research
            </div>
            <div className="text-lg flex flex-row items-center hover:text-[#23b5b5] cursor-pointer">
              <span className="text-5xl pb-2 mr-3">&#8226;</span>
              Strategic Planning
            </div>
            <div className="text-lg flex flex-row items-center hover:text-[#23b5b5] cursor-pointer">
              <span className="text-5xl pb-2 mr-3">&#8226;</span>
              Keyword and Content Research
            </div>
            <div className="text-lg flex flex-row items-center hover:text-[#23b5b5] cursor-pointer">
              <span className="text-5xl pb-2 mr-3">&#8226;</span>
              Platform Optimization
            </div>
            <div className="text-lg flex flex-row items-center hover:text-[#23b5b5] cursor-pointer">
              <span className="text-5xl pb-2 mr-3">&#8226;</span>
              Campaign Execution
            </div>
            <div className="text-lg flex flex-row items-center hover:text-[#23b5b5] cursor-pointer">
              <span className="text-5xl pb-2 mr-3">&#8226;</span>
              Content Creation and Promotion
            </div>
            <div className="text-lg flex flex-row items-center hover:text-[#23b5b5] cursor-pointer">
              <span className="text-5xl pb-2 mr-3">&#8226;</span>
              Performance Monitoring and Analytics
            </div>
            <div className="text-lg flex flex-row items-center hover:text-[#23b5b5] cursor-pointer">
              <span className="text-5xl pb-2 mr-3">&#8226;</span>
              Iterate and Improve
            </div>
          </div> */}

        {/* How We Work */}
        <div className="w-screen h-fit flex flex-col justify-center items-center mt-44">
          <div className="text-center text-6xl my-10 font-bold">
            How We Work With You Every Step of The Way !
          </div>

          {/* <div className="w-8 h-8 z-10 rounded-full bg-[#23b5b5] my-10" /> */}

          <div className="flex flex-row justify-center items-center my-10">
            <div className="w-96 h-60 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
              <img
                src={step_1_img}
                className="w-full object-cover object-center"
              />
            </div>
            <div className="w-8 h-8 z-10 rounded-full bg-[#23b5b5] mx-20 text-white text-center font-extrabold text-xl">
              1
            </div>
            <div className="w-96 h-60 rounded-3xl flex flex-col justify-center text-3xl">
              <div>Understanding Your Business Goals</div>
            </div>
          </div>

          <div className="flex flex-row justify-center items-center my-10">
            <div className="w-96 h-56 rounded-3xl flex flex-col justify-center text-3xl text-right">
              <div>Market and Competitor Research</div>
            </div>
            <div className="w-8 h-8 z-10 rounded-full bg-[#23b5b5] mx-20 text-white text-center font-extrabold text-xl">
              2
            </div>
            <div className="w-96 h-56 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
              <img src={step_2_img} className="w-full object-cover" />
            </div>
          </div>

          <div className="flex flex-row justify-center items-center my-10">
            <div className="w-96 h-56 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
              <img
                src={step_3_img}
                className="w-full object-cover object-center"
              />
            </div>
            <div className="w-8 h-8 z-10 rounded-full bg-[#23b5b5] mx-20 text-white text-center font-extrabold text-xl">
              3
            </div>
            <div className="w-96 h-56 rounded-3xl flex flex-col justify-center text-3xl">
              <div>Strategic Planning</div>
            </div>
          </div>

          <div className="flex flex-row justify-center items-center my-10">
            <div className="w-96 h-60 rounded-3xl flex flex-col justify-center text-3xl text-right">
              <div>Keyword and Content Research</div>
            </div>
            <div className="w-8 h-8 z-10 rounded-full bg-[#23b5b5] mx-20 text-white text-center font-extrabold text-xl">
              4
            </div>
            <div className="w-96 h-60 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
              <img
                src={step_4_img}
                className="w-full object-cover object-center"
              />
            </div>
          </div>

          <div className="flex flex-row justify-center items-center my-10">
            <div className="w-96 h-56 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
              <img
                src={step_5_img}
                className="w-full object-cover object-center"
              />
            </div>
            <div className="w-8 h-8 z-10 rounded-full bg-[#23b5b5] mx-20 text-white text-center font-extrabold text-xl">
              5
            </div>
            <div className="w-96 h-56 rounded-3xl flex flex-col justify-center text-3xl">
              <div>Platform Optimization</div>
            </div>
          </div>

          <div className="flex flex-row justify-center items-center my-10">
            <div className="w-96 h-56 rounded-3xl flex flex-col justify-center text-3xl text-right">
              <div>Campaign Execution</div>
            </div>
            <div className="w-8 h-8 z-10 rounded-full bg-[#23b5b5] mx-20 text-white text-center font-extrabold text-xl">
              6
            </div>
            <div className="w-96 h-56 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
              <img src={step_6_img} className="w-full object-cover" />
            </div>
          </div>

          <div className="flex flex-row justify-center items-center my-10">
            <div className="w-96 h-60 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
              <img
                src={step_7_img}
                className="w-full object-cover object-center"
              />
            </div>
            <div className="w-8 h-8 z-10 rounded-full bg-[#23b5b5] mx-20 text-white text-center font-extrabold text-xl">
              7
            </div>
            <div className="w-96 h-60 rounded-3xl flex flex-col justify-center text-3xl">
              <div>Content Creation and Promotion</div>
            </div>
          </div>

          <div className="flex flex-row justify-center items-center my-10">
            <div className="w-96 h-56 rounded-3xl flex flex-col justify-center text-3xl text-right">
              <div>Performance Monitoring and Analytics</div>
            </div>
            <div className="w-8 h-8 z-10 rounded-full bg-[#23b5b5] mx-20 text-white text-center font-extrabold text-xl">
              8
            </div>
            <div className="w-96 h-56 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
              <img src={step_8_img} className="w-full object-cover" />
            </div>
          </div>

          <div className="flex flex-row justify-center items-center my-10">
            <div className="w-96 h-56 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
              <img
                src={step_9_img}
                className="w-full object-cover object-center"
              />
            </div>
            <div className="w-8 h-8 z-10 rounded-full bg-[#23b5b5] mx-20 text-white text-center font-extrabold text-xl">
              9
            </div>
            <div className="w-96 h-56 rounded-3xl flex flex-col justify-center text-3xl">
              <div>Iterate and Improve</div>
            </div>
          </div>

          {/* Line */}
          <div className="absolute h-[155rem] mt-40 z-0 border-1 border-dashed border-zinc-500" />
        </div>

        <GetInTouchForm />
      </div>
      <Footer />
    </div>
  );
};

export default ExplifiedServices;
