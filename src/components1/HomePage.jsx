import React from "react";
import { useState } from "react";
import {
  Grip,
  Play,
  FileText,
  Puzzle,
  Linkedin,
  ScreenShare,
  Presentation,
  Video,
  Palette,
  Link,
  Type,
  Instagram,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [toolsDropdown, setToolsDropdown] = useState(false);
  const navigate = useNavigate();

  const quickToolsDropdown = [
    {
      name: "Youtube Summarizer",
      icon: "Instagram",
      route: "/socials/instagram",
    },
    { name: "AI Subtitler", icon: "FileText", route: "/socials" },
    {
      name: "Linkedin Extension",
      icon: "Linkedin",
      route: "/socials/linkedin",
    },
    { name: "Video Generator", icon: "Video", route: "/socials" },
    { name: "BG Remover", icon: "Palette", route: "/socials" },
  ];

  const toolCategories = [
    {
      title: "Research & Summarization Tools",
      tools: [
        {
          name: "Youtube Summarizer",
          icon: Play,
          route: "/youtube-summarizer",
        },
        { name: "AI Subtitler", icon: FileText, route: "/ai-subtitler" },
        { name: "Perplexity Extension", icon: Puzzle, route: "/" },
      ],
    },
    {
      title: "Productivity & Content Tools",
      tools: [
        { name: "Linkedin Extension", icon: Linkedin, route: "/" },
        { name: "Awesome Screenshot", icon: ScreenShare, route: "/" },
        { name: "Slideshow Maker", icon: Presentation, route: "/" },
        { name: "Video Generator", icon: Video, route: "/" },
      ],
    },
    {
      title: "Design & Visual Tools",
      tools: [
        { name: "BG Remover", icon: Palette, route: "/" },
        { name: "Link To Video", icon: Link, route: "/" },
        { name: "Keyword Extractor", icon: Type, route: "/" },
      ],
    },
  ];

  const iconMap = {
    Instagram,
    FileText,
    Linkedin,
    Video,
    Palette,
  };

  return (
    <>
      {/* Tools Grid Button */}
      <div className="w-full relative mt-2 flex items-center justify-end">
        <button
          onClick={() => setToolsDropdown(!toolsDropdown)}
          className="p-2 mt-[-10px]  rounded-lg transition-colors"
        >
          <Grip size={24} color="white" />
        </button>
        {toolsDropdown && (
          <div className="absolute right-[-6px] top-12 bg-black rounded-lg shadow-xl border border-white p-3 w-16 z-50 flex flex-col items-center space-y-4">
            {quickToolsDropdown.map((tool, index) => {
              const IconComponent = iconMap[tool.icon];
              return (
                <button
                  key={index}
                  onClick={() =>
                    navigate(tool.route, {
                      state: { iconName: tool.icon.toLowerCase() },
                    })
                  }
                  className="w-10 h-10 rounded-full  hover:border  flex items-center justify-center transition"
                  title={tool.name}
                >
                  <IconComponent size={18} color="#ccc" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="max-w-6xl mt-[-5px] mx-auto text-white">
        <h1 className="text-4xl font-bold text-center mb-12">
          Your Toolkit for <span className="text-[#23b5b5]">Smarter</span>{" "}
          Workflows
        </h1>

        <div className="space-y-12 text-white">
          {toolCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-semibold mb-6 text-white">
                {category.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.tools.map((tool, toolIndex) => {
                  const IconComponent = tool.icon;
                  return (
                    <button
                      onClick={() => navigate(tool.route)}
                      key={toolIndex}
                      className="bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg p-4 
             transition-all duration-200 hover:scale-105 group relative overflow-hidden w-50"
                    >
                      {/* Enhanced white glow layer */}
                      <div
                        className="absolute inset-0 rounded-lg pointer-events-none
               shadow-[inset_0_0_25px_5px_rgba(255,255,255,0.6),inset_0_0_10px_2px_rgba(255,255,255,0.8)]
               opacity-50 group-hover:opacity-90
               transition-opacity duration-300"
                      />

                      <div className="flex flex-col items-center space-y-2 relative z-10">
                        <div className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center group-hover:bg-[#23b5b5] transition-colors">
                          <IconComponent
                            size={20}
                            className="text-white group-hover:text-white"
                          />
                        </div>
                        <span className="text-sm font-medium text-center text-white">
                          {tool.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
