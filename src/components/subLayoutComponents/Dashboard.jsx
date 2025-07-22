import { useState, useRef, useEffect } from "react";
import { Youtube } from "lucide-react";
import WorkflowEngine from "./WorkflowEngine";
import InstagramAnalytics from "./InstagramAnalytics";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const gridRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("500px");
  const tools = [
    {
      title: "Youtube Summarizer",
      description:
        "A YouTube Summarizer quickly turns long videos into short, easy-to-read summaries. ",
      icon: Youtube,
      color: "from-cyan-400 to-yellow-500",
    },
    {
      title: "API Gateway",
      description:
        "Centralized API management with rate limiting, authentication, load balancing, and documentation.",
      icon: Youtube,
      color: "from-cyan-500 to-purple-500",
    },
    {
      title: "Terminal Pro",
      description:
        "Enhanced terminal with custom themes, session management, and integrated development tools.",
      icon: Youtube,
      color: "from-cyan-600 to-gray-500",
    },
    {
      title: "System Monitor",
      description:
        "Comprehensive system monitoring with resource tracking, process management, and health diagnostics.",
      icon: Youtube,
      color: "from-cyan-500 to-red-500",
    },
    {
      title: "Document Studio",
      description:
        "Advanced document editor with collaborative editing, version control, and export capabilities.",
      icon: Youtube,
      color: "from-cyan-400 to-orange-500",
    },
    {
      title: "Terminal Pro",
      description:
        "Enhanced terminal with custom themes, session management, and integrated development tools.",
      icon: Youtube,
      color: "from-cyan-600 to-gray-500",
    },
    {
      title: "System Monitor",
      description:
        "Comprehensive system monitoring with resource tracking, process management, and health diagnostics.",
      icon: Youtube,
      color: "from-cyan-500 to-red-500",
    },
    {
      title: "Document Studio",
      description:
        "Advanced document editor with collaborative editing, version control, and export capabilities.",
      icon: Youtube,
      color: "from-cyan-400 to-orange-500",
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
        <div className="heading  py-10 flex items-center justify-center">
          <h1 className="text-3xl text-gray-400 font-thin tracking-tighter">
            Simplify{" "}
            <span className="text-5xl font-semibold text-cyan-200 animate-pulse tracking-normal">
              Everything
            </span>{" "}
            , Automate{" "}
            <span className=" text-5xl font-semibold text-cyan-200 animate-pulse tracking-normal">
              Anything
            </span>
            .
          </h1>
        </div>

        <div className=" flex gap-4">
          <div className="bg-gray-900  rounded-2xl border border-gray-800 h-fit p-4 shadow-2xl">
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
                      className="group relative bg-gray-800 rounded-xl px-4 pt-4 pb-2 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer h-32 min-h-0"
                    >
                      {/* Gradient background on hover */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Content */}
                      <div className="relative z-10 flex flex-col justify-between h-full">
                        {/* Icon */}
                        <div className="tool_description flex gap-3 items-start">
                          <div
                            className={` h-8 w-8 flex items-center p-2 rounded-lg bg-gradient-to-r ${tool.color} mb-2 group-hover:scale-110 transition-transform duration-300`}
                          >
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            {/* Title */}
                            <h3 className="text-base font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300">
                              {tool.title}
                            </h3>
                            {/* Description */}
                            <p className="text-gray-400 text-xs leading-snug group-hover:text-gray-300 transition-colors duration-300">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                        {/* Action indicator */}
                        <div className="mt-1 flex items-center text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
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
            <div className="flex justify-center ">
              <button
                className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                {isOpen ? "Show Less" : `Show More (${tools.length - 3})`}
              </button>
            </div>
          </div>
          <InstagramAnalytics />
        </div>

        <WorkflowEngine />
      </div>
    </>
  );
};

export default Dashboard;
