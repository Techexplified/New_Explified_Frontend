import { useState, useRef, useEffect } from "react";
import {
  Youtube,
  FileText,
  Projector,
  ImagePlay,
  Images,
  FileVideo2,
  Plus,
} from "lucide-react";
import MostPopular from "./workflows/MostPopular";
import InstagramAnalytics from "./InstagramAnalytics";
import { useNavigate } from "react-router-dom";

const MainDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const gridRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("500px");
  const navigate = useNavigate();

  const handleToolClick = (route) => {
    navigate(route);
  };

  const tools = [
    {
      title: "Youtube Summarizer",
      description: "A YouTube Summarizer quickly turns long videos into short.",
      icon: Youtube,
      color: "from-minimal-primary to-minimal-gray-400",
      route: "/youtube-summarizer",
    },

    {
      title: "AI Subtitler",
      description: "Centralized AI Subtitler for your videos",
      icon: FileText,
      color: "from-minimal-primary to-minimal-gray-500",
      route: "/ai-subtitler",
    },
    {
      title: "Text To Video Generator",
      description: "Generate videos using prompts.",
      icon: FileVideo2,
      route: "/text-to-video",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    {
      title: "Slideshow Maker",
      description: "Create stunning slideshows.",
      icon: Projector,
      route: "/presentation",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    {
      title: "Bg Remover",
      description: "Remove background from images.",
      icon: ImagePlay,
      route: "/bg-remover",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    {
      title: "Image Styler",
      description: "Style your images.",
      icon: Images,
      route: "/image-styler",
      color: "from-minimal-primary to-minimal-gray-600",
    },
  ];

  useEffect(() => {
    if (isOpen && gridRef.current) {
      setMaxHeight(gridRef.current.scrollHeight + "px");
    } else {
      setMaxHeight("500px");
    }
  }, [isOpen, tools.length]);

  return (
    <>
      <div className=" w-full h-full px-5 mb-10 flex flex-col items-center">
        {/* heading */}
        <div className="heading  py-10 flex items-center justify-center">
          <h1 className="text-3xl text-minimal-white font-thin tracking-tighter">
            Simplify{" "}
            <span className="text-5xl font-semibold text-minimal-primary animate-pulse tracking-normal">
              Everything
            </span>{" "}
            , Automate{" "}
            <span className=" text-5xl font-semibold text-minimal-primary animate-pulse tracking-normal">
              Anything
            </span>
            .
          </h1>
        </div>
        {/* main dashboard */}
        <div className=" flex gap-4">
          <div className="bg-minimal-card rounded-2xl border border-minimal-border h-fit p-4 shadow-2xl">
            {/* Tools Grid with Accordion Transition */}
            <div
              style={{
                maxHeight,
                transition: "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                overflow: "hidden",
              }}
            >
              <div
                ref={gridRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
              >
                {(isOpen ? tools : tools.slice(0, 6)).map((tool, index) => {
                  const IconComponent = tool.icon;
                  return (
                    <div
                      key={index}
                      className="group relative bg-minimal-dark-100 rounded-xl px-4 pt-4 pb-2 border border-minimal-border hover:border-minimal-primary/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-minimal-primary/20 cursor-pointer h-32 min-h-0"
                      onClick={() => handleToolClick(tool.route)}
                    >
                      {/* Gradient background on hover */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-minimal-primary/10 to-minimal-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Content */}
                      <div className="relative z-10 flex flex-col justify-between h-full">
                        {/* Icon */}
                        <div className="tool_description flex gap-3 items-start">
                          <div
                            className={` h-8 w-8 flex items-center p-2 rounded-lg bg-gradient-to-r ${tool.color} mb-2 group-hover:scale-110 transition-transform duration-300`}
                          >
                            <IconComponent className="w-5 h-5 text-minimal-white" />
                          </div>
                          <div>
                            {/* Title */}
                            <h3 className="text-base font-semibold text-minimal-white mb-1 group-hover:text-minimal-primary transition-colors duration-300">
                              {tool.title}
                            </h3>
                            {/* Description */}
                            <p className="text-minimal-muted text-xs leading-snug group-hover:text-minimal-gray-300 transition-colors duration-300">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                        {/* Action indicator */}
                        <div className="mt-1 flex items-center text-minimal-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                          <span className="text-xs font-medium">
                            Launch Tool
                          </span>
                          <svg
                            className="w-3 h-3 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accordion Toggle Button */}
            {tools.length > 6 && (
              <div className="flex justify-center ">
                <button
                  className="px-4 py-2 bg-minimal-primary text-minimal-white rounded-lg hover:bg-minimal-primary/80 transition-colors duration-200"
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  {isOpen ? "Show Less" : `Show More `}
                </button>
              </div>
            )}
          </div>
          <InstagramAnalytics />
        </div>
        {/* workflow Engine */}
        <div>
          <h1 className="text-4xl font-bold text-minimal-primary px-10 py-5 mt-5">
            Workflow Engine
          </h1>
          <div className="bg-minimal-card rounded-2xl border border-minimal-border p-4 md:p-6 lg:p-8 shadow-2xl flex flex-col md:flex-row gap-6">
            {/* Create Workflow Button Card */}
            <div
              onClick={() => navigate("/workflows/create")}
              className="mb-6 md:mb-0 w-full h-full md:w-1/3 flex-shrink-0 flex flex-col items-center justify-center"
            >
              {/* Card content reduced in size */}
              <div className="group h-[370px] flex items-center justify-center relative bg-gradient-to-br from-minimal-primary/60 to-minimal-gray-600/20 rounded-xl p-4 md:p-6 border-2 border-dashed border-minimal-primary/50 hover:border-minimal-primary transition-all duration-300 hover:transform hover:scale-[1.02] cursor-pointer w-full">
                <div className="text-center">
                  <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-minimal-primary to-minimal-gray-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Plus className="w-7 h-7 text-minimal-white" />
                  </div>
                  <h3 className="text-xl font-bold text-minimal-white mb-1 group-hover:text-minimal-primary transition-colors duration-300">
                    Create Custom Workflow
                  </h3>
                  <p className="text-minimal-muted text-base group-hover:text-minimal-gray-300 transition-colors duration-300">
                    Build your own automated workflow from scratch with our
                    visual drag-and-drop editor
                  </p>
                  <div className="mt-4">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-minimal-primary to-minimal-gray-600 rounded-lg text-minimal-white font-semibold hover:from-minimal-primary/80 hover:to-minimal-gray-500 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-minimal-primary/25 text-sm">
                      <span>Get Started</span>
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* most popular workflows */}
            <MostPopular />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainDashboard;
