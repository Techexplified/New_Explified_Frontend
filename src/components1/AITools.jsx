import {
  FileText,
  ScreenShare,
  Link,
  Image,
  Images,
  Laugh,
  PenOff,
  BoomBox,
  Zap,
} from "lucide-react";
import { Youtube, Projector, ImagePlay, FileVideo2 } from "lucide-react";
import { MdOutlineGifBox, MdElderlyWoman } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import WorkflowDashboard from "./Workflows";
import MainWorkflowPage from "../components/subLayoutComponents/workflowPages/MainWorkflowPage";

function AITools() {
  const [isOpen, setIsOpen] = useState(false);
  const gridRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("500px");
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState("Apps");
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
    {
      title: "Video Meme Generator AI",
      description: "Style your images.",
      icon: Laugh,
      route: "/video-meme-generator",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    {
      title: "Integrations",
      description: "Style your images.",
      icon: Zap,
      route: "/integrations",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    {
      title: "Socials",
      description: "Style your images.",
      icon: BoomBox,
      route: "/socials",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    {
      title: "AI GIF Generator",
      description: "Style your images.",
      icon: MdOutlineGifBox,
      route: "/ai-gif-generator",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    {
      title: "AI Hugging Video Maker",
      description: "Style your images.",
      icon: ScreenShare,
      route: "/ai-hugging-video-maker",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    {
      title: "Ageing Video Maker AI",
      description: "Style your images.",
      icon: MdElderlyWoman,
      route: "/ageing-video-maker-ai",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    {
      title: "AI Tattoo Art Generator",
      description: "Style your images.",
      icon: PenOff,
      route: "/ai-tattoo-art-generator",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    {
      title: "Image To Video AI",
      description: "Style your images.",
      icon: Image,
      route: "/image-to-video-ai",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    {
      title: "Link To Video AI",
      description: "Style your images.",
      icon: Link,
      route: "/link-to-video-ai",
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
    <div className=" w-full h-full px-5 mb-10 flex flex-col items-center">
      {/* heading */}
      <div className="heading  py-10 flex items-center justify-center">
        <h1 className="text-3xl text-minimal-white font-thin tracking-tighter">
          <span className="text-5xl font-semibold text-minimal-primary animate-pulse tracking-normal">
            All Tools
          </span>
          .
        </h1>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setActiveTool("Apps")}
          className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 text-white border border-[#23b5b5] 
      ${activeTool === "Apps" ? "bg-[#23b5b5] shadow-md" : "bg-transparent  "}`}
        >
          Apps
        </button>

        <button
          onClick={() => setActiveTool("Workflows")}
          className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 text-white border border-[#23b5b5]  
      ${
        activeTool === "Workflows"
          ? "bg-[#23b5b5]  shadow-md"
          : "bg-transparent  "
      }`}
        >
          Workflows
        </button>
      </div>

      {/* main dashboard */}

      {activeTool == "Apps" ? (
        <div className=" flex gap-4 mt-20">
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
          {/* <InstagramAnalytics /> */}
        </div>
      ) : (
        <MainWorkflowPage />
      )}
    </div>
  );
}

export default AITools;
