import React, { useEffect, useState } from "react";
import Footer from "../../../reusable_components/Footer";
import { Accordion, AccordionItem, Button } from "@heroui/react";
import NavBar from "../../../reusable_components/NavBar";
import { Link } from "react-router-dom";
import {
  SiAdobeaftereffects,
  SiAdobeillustrator,
  SiAdobephotoshop,
  SiAdobepremierepro,
  SiCanva,
  SiFigma,
  SiGoogleanalytics,
  SiGoogledatastudio,
  SiGooglesearchconsole,
  SiGrammarly,
  SiHubspot,
  SiMatomo,
  SiSemrush,
  SiTableau,
  SiTrello,
  SiYoast,
} from "react-icons/si";
import {
  AnalyticsReportingImg,
  ContentCreationImg,
  ContentDistributionImg,
  ContentMarketingPageDiscoveryImg,
  ContentMarketingServiceImg,
  ContentOptimizationImg,
  ContentStrategyImg,
} from "../../../assets";
import GetInTouchForm from "../../../reusable_components/design_components/GetInTouchForm";

const icons = [
  SiGrammarly,
  SiCanva,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiAdobepremierepro,
  SiAdobeaftereffects,
  SiTrello,
  SiFigma,
  SiGooglesearchconsole,
  SiSemrush,
  SiYoast,
  SiGoogleanalytics,
  SiGoogledatastudio,
  SiHubspot,
  SiMatomo,
  SiTableau,
];

const ContentMarketingServicePage = () => {
  const [backgroundImage, setBackgroundImage] = useState(ContentStrategyImg);

  const backgrounds = {
    strategy: ContentStrategyImg,
    creation: ContentCreationImg,
    distribution: ContentDistributionImg,
    optimization: ContentOptimizationImg,
    analytics: AnalyticsReportingImg,
  };

  const bulletPoints = [
    "High-quality HD/4K output.",
    "Audio syncing and sound design.",
    "Color grading and enhancement.",
    "Subtitles and captions.",
    "Motion graphics and animations.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % bulletPoints.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [bulletPoints.length]);

  return (
    <div>
      <NavBar />

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center w-full px-6 lg:px-20 py-14">
        <div className="flex flex-col w-full p-5">
          <h1 className="w-full mb-4 capitalize text-[2rem] lg:text-[3.5rem] text-left font-bold tracking-tight leading-none">
            Boost Your Brand with Powerful Content Marketing.
          </h1>
          <p className="w-full my-6 lg:my-10 font-light text-gray-400 text-left text-lg lg:text-xl">
            Strategic content creation, distribution, and optimization to drive
            results and build lasting relationships with your audience.
          </p>
          <Button
            radius="sm"
            className="text-md lg:text-lg font-bold w-fit h-12 bg-[#23b5b5] text-zinc-900 px-8 lg:px-16"
          >
            <Link to="/contact-us">Get Started</Link>
          </Button>
        </div>
        <div className="flex justify-center items-center object-cover object-right w-full lg:w-[75%]">
          <img
            src={ContentMarketingServiceImg}
            className="w-full h-auto"
            alt="Social Platform"
          ></img>
        </div>
      </div>

      {/* Section 2 */}
      <div
        className="relative flex flex-row w-full h-screen my-36 border-y-5"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

        {/* Services Section */}
        <div className="w-full relative text-3xl text-right font-bold m-20 flex flex-col gap-6 self-center items-end">
          <div
            className="hover:underline cursor-pointer w-fit"
            onClick={() => setBackgroundImage(backgrounds.strategy)}
          >
            Content Strategy Development
          </div>
          <div
            className="hover:underline cursor-pointer w-fit"
            onClick={() => setBackgroundImage(backgrounds.creation)}
          >
            Content Creation
          </div>
          <div
            className="hover:underline cursor-pointer w-fit"
            onClick={() => setBackgroundImage(backgrounds.distribution)}
          >
            Content Distribution
          </div>
          <div
            className="hover:underline cursor-pointer w-fit"
            onClick={() => setBackgroundImage(backgrounds.optimization)}
          >
            Content Optimization & SEO
          </div>
          <div
            className="hover:underline cursor-pointer w-fit"
            onClick={() => setBackgroundImage(backgrounds.analytics)}
          >
            Analytics & Reporting
          </div>
        </div>
        <style>{`
          @keyframes zoom {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
            }
          }
          .animate-zoom {
            animation: zoom 2s infinite;
          }
        `}</style>
      </div>

      {/* Tools Section */}
      <div className="relative w-full h-40 overflow-hidden bg-[#23b5b5] my-48 bg-opacity-65">
        <div
          className="absolute flex whitespace-nowrap"
          style={{
            animation: "scroll 100s linear infinite",
          }}
        >
          {/* Duplicate the icon list for smooth looping */}
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex gap-14">
              {icons.map((Icon, index) => (
                <div
                  key={`${idx}-${index}`}
                  className="flex items-center justify-center w-40 h-40 text-5xl text-white"
                >
                  <Icon className="w-20 h-20" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <style>
          {`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-100%);
              }
            }
          `}
        </style>
      </div>

      {/* Process */}
      <div className="w-full h-fit flex flex-col justify-center items-center mt-20 mb-40 px-4">
        <div className="text-center text-4xl md:text-6xl lg:text-8xl my-10 font-bold">
          Our Process
        </div>

        <div className="flex flex-row justify-center items-center my-10">
          <div className="w-full lg:w-96 h-[50%] lg:h-60 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
            <img
              src={ContentMarketingPageDiscoveryImg}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="flex flex-row justify-center items-center w-16 h-[1.70rem] lg:w-8 lg:h-8 z-10 rounded-full bg-[#23b5b5] mx-5 lg:mx-20 text-white text-center font-bold text-sm lg:text-xl my-6 lg:my-0">
            1
          </div>
          <div className="w-full lg:w-96 h-fit rounded-3xl flex flex-col justify-center text-xl md:text-2xl lg:text-3xl">
            <div>Discovery</div>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center my-10">
          <div className="w-full lg:w-96 h-fit rounded-3xl flex flex-col justify-center text-xl md:text-2xl lg:text-3xl">
            <div>Strategy Creation</div>
          </div>
          <div className="flex flex-row justify-center items-center w-16 h-[1.70rem] lg:w-8 lg:h-8 z-10 rounded-full bg-[#23b5b5] mx-5 lg:mx-20 text-white text-center font-bold text-sm lg:text-xl my-6 lg:my-0">
            2
          </div>
          <div className="w-full lg:w-96 h-[50%] lg:h-60 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
            <img src={ContentStrategyImg} className="w-full object-cover" />
          </div>
        </div>

        <div className="flex flex-row justify-center items-center my-10">
          <div className="w-full lg:w-96 h-[50%] lg:h-60 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
            <img
              src={ContentCreationImg}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="flex flex-row justify-center items-center w-16 h-[1.70rem] lg:w-8 lg:h-8 z-10 rounded-full bg-[#23b5b5] mx-5 lg:mx-20 text-white text-center font-bold text-sm lg:text-xl my-6 lg:my-0">
            3
          </div>
          <div className="w-full lg:w-96 h-fit rounded-3xl flex flex-col justify-center text-xl md:text-2xl lg:text-3xl">
            <div>Content Development</div>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center my-10">
          <div className="w-full lg:w-96 h-fit rounded-3xl flex flex-col justify-center text-xl md:text-2xl lg:text-3xl">
            <div>Optimization</div>
          </div>
          <div className="flex flex-row justify-center items-center w-16 h-[1.70rem] lg:w-8 lg:h-8 z-10 rounded-full bg-[#23b5b5] mx-5 lg:mx-20 text-white text-center font-bold text-sm lg:text-xl my-6 lg:my-0">
            4
          </div>
          <div className="w-full lg:w-96 h-[50%] lg:h-60 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
            <img
              src={ContentOptimizationImg}
              className="w-full object-cover object-center"
            />
          </div>
        </div>

        <div className="flex flex-row justify-center items-center my-10">
          <div className="w-full lg:w-96 h-[50%] lg:h-60 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
            <img
              src={ContentDistributionImg}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="flex flex-row justify-center items-center w-16 h-[1.70rem] lg:w-8 lg:h-8 z-10 rounded-full bg-[#23b5b5] mx-5 lg:mx-20 text-white text-center font-bold text-sm lg:text-xl my-6 lg:my-0">
            5
          </div>
          <div className="w-full lg:w-96 h-fit rounded-3xl flex flex-col justify-center text-xl md:text-2xl lg:text-3xl">
            <div>Distribution</div>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center my-10">
          <div className="w-full lg:w-96 h-fit rounded-3xl flex flex-col justify-center text-xl md:text-2xl lg:text-3xl">
            <div>Analytics & Reporting:</div>
          </div>
          <div className="flex flex-row justify-center items-center w-16 h-[1.70rem] lg:w-8 lg:h-8 z-10 rounded-full bg-[#23b5b5] mx-5 lg:mx-20 text-white text-center font-bold text-sm lg:text-xl my-6 lg:my-0">
            6
          </div>
          <div className="w-full lg:w-96 h-[50%] lg:h-60 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
            <img
              src={AnalyticsReportingImg}
              className="w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Line */}
        <div className="absolute lg:h-[225vh] h-[45%] md:h-[105%] mt-32 lg:mt-40 z-0 border-1 border-zinc-500" />
      </div>

      {/* Section FaQ */}
      <div className="px-20 mt-24">
        <div className="text-5xl font-bold mb-10 capitalize">
          frequently asked questions{" "}
          <span className="text-[#23b5b5]">( FAQ )</span>
        </div>
        <Accordion>
          <AccordionItem
            key="1"
            aria-label="Accordion 1"
            title="How long does it take to see results from content marketing?"
            className="font-semibold"
          >
            <span className="font-normal">
              Content marketing is a long-term investment, and results typically
              take time to materialize. While some early signs, like increased
              website traffic or engagement, can start appearing within three to
              six months, meaningful outcomes such as improved search engine
              rankings, consistent lead generation, and brand authority often
              take six to twelve months or more. This is because content
              marketing focuses on building trust, improving SEO, and nurturing
              relationships, all of which require consistency and quality over
              time.
            </span>
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Accordion 2"
            title="Do I need to provide content ideas, or do you handle that?"
            className="font-semibold"
          >
            <span className="font-normal">
              You don’t have to worry about coming up with content ideas because
              I take care of that for you. By understanding your business goals,
              audience needs, and industry trends, I create content strategies
              tailored to your objectives. I use tools and research to identify
              relevant topics, trending discussions, and SEO opportunities to
              ensure the content resonates with your audience. However, if you
              have specific topics or ideas in mind, I’m always happy to
              incorporate them to align with your vision and priorities.
            </span>
          </AccordionItem>
          <AccordionItem
            key="3"
            aria-label="Accordion 3"
            title="What’s the difference between content marketing and traditional advertising?"
            className="font-semibold"
          >
            <span className="font-normal">
              The primary difference between content marketing and traditional
              advertising lies in their approach and purpose. Traditional
              advertising is focused on direct promotion, often using mediums
              like TV commercials, print ads, or billboards to deliver a message
              quickly and push for immediate action. In contrast, content
              marketing takes a more subtle approach by providing valuable,
              relevant, and engaging information to the audience. It aims to
              build trust, educate, or entertain rather than just sell. While
              traditional advertising delivers short-term results and can be
              expensive, content marketing focuses on long-term growth, creating
              a lasting connection with the audience through consistent and
              meaningful interactions.
            </span>
          </AccordionItem>
          <AccordionItem
            key="4"
            aria-label="Accordion 4"
            title="How do you measure the success of a content marketing campaign?"
            className="font-semibold"
          >
            <span className="font-normal">
              The success of a content marketing campaign is measured through
              various metrics that reflect its impact and effectiveness. Key
              indicators include the growth in website traffic, engagement
              levels like time spent on a page or social media interactions, and
              improvements in search engine rankings. Lead generation and
              conversion rates are also essential as they show how well the
              content is driving tangible business results. Beyond this,
              analyzing revenue generated and overall return on investment (ROI)
              helps determine the financial success of a campaign. I use tools
              like Google Analytics, SEO platforms, and behavior tracking tools
              to gather insights, monitor progress, and provide clear reports on
              performance.
            </span>
          </AccordionItem>
        </Accordion>
      </div>

      <GetInTouchForm />
      <Footer />
    </div>
  );
};

export default ContentMarketingServicePage;
