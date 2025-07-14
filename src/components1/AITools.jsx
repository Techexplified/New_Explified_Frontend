import {
  Play,
  FileText,
  ScreenShare,
  Link,
  Image,
  Images,
  Laugh,
  PenOff,
} from "lucide-react";
import { PiSubtitles } from "react-icons/pi";
import {
  MdOutlineGifBox,
  MdFaceRetouchingNatural,
  MdElderlyWoman,
} from "react-icons/md";

import { useNavigate } from "react-router-dom";

const toolCategories = [
  {
    title: "AI Video Studio",
    tools: [
      {
        name: "AI Video Generator",
        route: "/ai-video-generator",
        icon: Play,
      },
      {
        name: "Link To Video AI",
        route: "/link-to-video-ai",
        icon: Link,
      },
      {
        name: "Text To Video AI",
        route: "/text-to-video-ai",
        icon: FileText,
      },
      {
        name: "Image To Video AI",
        route: "/image-to-video-ai",
        icon: Image,
      },
      {
        name: "Ageing Video Maker AI",
        route: "/ageing-video-maker-ai",
        icon: MdElderlyWoman,
      },
    ],
  },
  {
    title: "AI Media Lab",
    tools: [
      {
        name: "Video Meme Generator AI",
        route: "/video-meme-generator-ai",
        icon: Laugh,
      },
      {
        name: "SlideShow maker AI",
        route: "/slideshow-maker-ai",
        icon: ScreenShare,
      },
      {
        name: "Background Remover AI",
        route: "/background-remover-ai",
        icon: Images,
      },
      {
        name: "AI Tattoo Art Generator",
        route: "/ai-tattoo-art-generator",
        icon: PenOff,
      },
    ],
  },
  {
    title: "AI Content Studio",
    tools: [
      {
        name: "AI GIF Generator",
        route: "/ai-gif-generator",
        icon: MdOutlineGifBox,
      },
      {
        name: "AI Subtitler Tool",
        route: "/ai-subtitler-tool",
        icon: PiSubtitles,
      },
      {
        name: "AI Image Styler",
        route: "/ai-image-styler",
        icon: MdFaceRetouchingNatural,
      },
      {
        name: "AI Hugging Video Maker",
        route: "/ai-hugging-video-maker",
        icon: ScreenShare,
      },
    ],
  },
];

function AITools() {
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl mt-[-5px] mx-auto text-white">
      <h1 className="text-4xl font-bold text-center mb-12">
        <span className="text-[#23b5b5]">AI</span> Tools
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
  );
}

export default AITools;
