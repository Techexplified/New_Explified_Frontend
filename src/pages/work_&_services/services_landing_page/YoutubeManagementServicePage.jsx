import React, { useState } from "react";
import Footer from "../../../reusable_components/Footer";
import { Accordion, AccordionItem, Button } from "@heroui/react";
import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import NavBar from "../../../reusable_components/NavBar";
import {
  AnalyticsReportingImg,
  ContentCreationImg,
  ContentDistributionImg,
  ContentMarketingPageDiscoveryImg,
  ContentOptimizationImg,
  ContentStrategyImg,
  ExplifiedLogo,
  YoutubeManagementServiceImg,
} from "../../../assets/index";
import GetInTouchForm from "../../../reusable_components/design_components/GetInTouchForm";

const YoutubeManagementServicePage = () => {
  const youtubeVideos = [
    {
      id: "dQw4w9WgXcQ",
      title: "Video 1",
      comments: [
        {
          name: "John Doe",
          text: "Awesome video! Loved it!",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
          name: "Jane Smith",
          text: "This is so informative, thanks!",
          avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        },
        {
          name: "Chris Johnson",
          text: "Great quality, keep it up!",
          avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        },
      ],
    },
    {
      id: "3JZ_D3ELwOQ",
      title: "Video 2",
      comments: [
        {
          name: "Alice Williams",
          text: "Really helpful, appreciate it!",
          avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        },
        {
          name: "Mark Brown",
          text: "Fantastic content, so clear!",
          avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        },
        {
          name: "Emily Davis",
          text: "Loved the explanation, well done!",
          avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        },
      ],
    },
    {
      id: "E7wJTI-1dvQ",
      title: "Video 3",
      comments: [
        {
          name: "Michael Lee",
          text: "This is amazing, thanks for sharing!",
          avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        },
        {
          name: "Samantha King",
          text: "Great tips, I will use these!",
          avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        },
        {
          name: "David Scott",
          text: "Incredible! Helped me a lot.",
          avatar: "https://randomuser.me/api/portraits/men/5.jpg",
        },
      ],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < youtubeVideos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(youtubeVideos.length - 1);
    }
  };

  const { id, title, comments } = youtubeVideos[currentIndex];

  return (
    <div>
      <NavBar />

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center w-full h-screen px-6 lg:px-20 py-14">
        <div className="flex flex-col w-full p-5">
          <h1 className="w-full mb-4 capitalize text-[2rem] lg:text-[3.5rem] text-left font-bold tracking-tight leading-none">
            Elevate Your Brand with Expert{" "}
            <span className="text-red-500">YouTube</span> Management
          </h1>
          <p className="w-full my-6 lg:my-10 font-light text-gray-400 text-left text-lg lg:text-xl">
            Tailored strategies for content creation, optimization, and audience
            engagement to grow your channel and amplify your online presence.
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
            src={YoutubeManagementServiceImg}
            className="w-full h-auto"
            alt="Social Platform"
          ></img>
        </div>
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
            <div>Audit and Goal Setting</div>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center my-10">
          <div className="w-full lg:w-96 h-fit rounded-3xl flex flex-col justify-center text-xl md:text-2xl lg:text-3xl">
            <div>Content Strategy and Planning</div>
          </div>
          <div className="flex flex-row justify-center items-center w-16 h-[1.70rem] lg:w-8 lg:h-8 z-10 rounded-full bg-[#23b5b5] mx-5 lg:mx-20 text-white text-center font-bold text-sm lg:text-xl my-6 lg:my-0">
            2
          </div>
          <div className="w-full lg:w-96 h-[50%] lg:h-60 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
            <img
              src={ContentStrategyImg}
              className="w-full object-cover"
            />
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
            <div>Content Creation</div>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center my-10">
          <div className="w-full lg:w-96 h-fit rounded-3xl flex flex-col justify-center text-xl md:text-2xl lg:text-3xl">
            <div>Optimization and Publishing</div>
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
            <div>Promotion and Engagement</div>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center my-10">
          <div className="w-full lg:w-96 h-fit rounded-3xl flex flex-col justify-center text-xl md:text-2xl lg:text-3xl">
            <div>Monitor and Improve</div>
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

      {/* Portfolio */}
      <div className="text-7xl font-extrabold text-center">
        Our Work Portfolio
      </div>
      <div className="w-full h-screen flex flex-row justify-around items-center relative">
        <IoIosArrowBack
          className="w-14 h-14 cursor-pointer"
          onClick={handlePrev}
        />
        <div className="relative w-[90%] h-[85%] bg-black rounded-3xl overflow-hidden">
          <div className="absolute flex flex-row items-center gap-3 m-10">
            <img src={ExplifiedLogo} className="h-12" alt="Explified Logo" />
            <h1 className="text-2xl md:text-3xl font-semibold text-white">
              Explified
            </h1>
          </div>
          <div className="absolute m-10 text-3xl font-bold z-10 bottom-0">
            {title}
          </div>
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${id}?controls=0`}
          />
        </div>
        <IoIosArrowForward
          className="w-14 h-14 cursor-pointer"
          onClick={handleNext}
        />

        <div className="absolute bottom-20 right-24 w-[25%] h-[50%] z-10 overflow-hidden flex flex-col gap-5 items-end justify-end">
          {comments.map((comment, index) => (
            <div
              key={index}
              className="rounded-xl bg-slate-700 h-fit w-fit flex flex-row py-2 px-5"
            >
              <div className="w-fit h-full py-1 px-1">
                <img
                  src={comment.avatar}
                  alt={comment.name}
                  className="w-[2.75rem] h-[2.75rem] rounded-full border-1"
                />
              </div>
              <div className="flex flex-col mx-1">
                <div className="text-lg font-bold">{comment.name}</div>
                <div className="text-xs font-normal">{comment.text}</div>
              </div>
            </div>
          ))}
        </div>
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
            title="What does a YouTube management service include?"
            className="font-semibold"
          >
            <span className="font-normal">
              YouTube management typically includes content planning, video
              optimization, channel branding, audience engagement, performance
              tracking, and strategic growth initiatives.
            </span>
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Accordion 2"
            title="How will you help grow my YouTube channel?"
            className="font-semibold"
          >
            <span className="font-normal">
              We use a tailored approach, focusing on SEO optimization, engaging
              content creation, audience interaction, and data-driven strategies
              to increase visibility, subscribers, and engagement.
            </span>
          </AccordionItem>
          <AccordionItem
            key="3"
            aria-label="Accordion 3"
            title="Can you help with video editing and thumbnail design?"
            className="font-semibold"
          >
            <span className="font-normal">
              Yes, we provide professional video editing, custom thumbnail
              creation, and design services to enhance your channel’s visual
              appeal and improve click-through rates.
            </span>
          </AccordionItem>
          <AccordionItem
            key="4"
            aria-label="Accordion 4"
            title="How do you measure the success of my channel?"
            className="font-semibold"
          >
            <span className="font-normal">
              We track key performance metrics such as views, watch time,
              audience retention, subscriber growth, and engagement rates to
              measure progress and adjust strategies.
            </span>
          </AccordionItem>
          <AccordionItem
            key="5"
            aria-label="Accordion 4"
            title="Do I need to provide content ideas, or do you handle that too?"
            className="font-semibold"
          >
            <span className="font-normal">
              We can work collaboratively or take full control. If you prefer,
              we research trends, analyze competitors, and develop content ideas
              aligned with your brand and audience preferences.
            </span>
          </AccordionItem>
        </Accordion>
      </div>

      <GetInTouchForm />
      <Footer />
    </div>
  );
};

export default YoutubeManagementServicePage;
