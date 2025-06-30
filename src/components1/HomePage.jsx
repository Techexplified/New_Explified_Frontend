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
} from "lucide-react";

export default function HomePage() {
  const [toolsDropdown, setToolsDropdown] = useState(false);

  const quickToolsDropdown = [
    { name: "Youtube Summarizer", icon: "Play" },
    { name: "AI Subtitler", icon: "FileText" },
    { name: "Linkedin Extension", icon: "Linkedin" },
    { name: "Video Generator", icon: "Video" },
    { name: "BG Remover", icon: "Palette" },
  ];

  const toolCategories = [
    {
      title: "Research & Summarization Tools",
      tools: [
        { name: "Youtube Summarizer", icon: Play },
        { name: "AI Subtitler", icon: FileText },
        { name: "Perplexity Extension", icon: Puzzle },
      ],
    },
    {
      title: "Productivity & Content Tools",
      tools: [
        { name: "Linkedin Extension", icon: Linkedin },
        { name: "Awesome Screenshot", icon: ScreenShare },
        { name: "Slideshow Maker", icon: Presentation },
        { name: "Video Generator", icon: Video },
      ],
    },
    {
      title: "Design & Visual Tools",
      tools: [
        { name: "BG Remover", icon: Palette },
        { name: "Link To Video", icon: Link },
        { name: "Keyword Extractor", icon: Type },
      ],
    },
  ];

  const iconMap = {
    Play,
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
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Grip size={20} color="white" />
        </button>
        {toolsDropdown && (
          <div className="absolute right-0 top-12 bg-black rounded-lg shadow-xl border border-white p-3 w-16 z-50 flex flex-col items-center space-y-4">
            {quickToolsDropdown.map((tool, index) => {
              const IconComponent = iconMap[tool.icon];
              return (
                <button
                  key={index}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition"
                  title={tool.name}
                >
                  <IconComponent size={18} color="#ccc" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto text-white">
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
                      key={toolIndex}
                      className="bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg p-6 transition-all duration-200 hover:scale-105 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 rounded-lg pointer-events-none shadow-[inset_0_0_15px_white]   transition-opacity duration-300" />

                      <div className="flex flex-col items-center space-y-3 relative z-10">
                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-[#23b5b5] transition-colors">
                          <IconComponent
                            size={24}
                            className="text-white group-hover:text-white"
                          />
                        </div>
                        <span className="text-sm font-medium text-center">
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
