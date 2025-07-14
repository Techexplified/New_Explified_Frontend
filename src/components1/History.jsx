import { useState } from "react";
import {
  Search,
  ExternalLink,
  Play,
  Presentation,
  Video,
  HelpCircle,
  Grip,
  Instagram,
  FileText,
  Linkedin,
  Palette,
  ChevronDownIcon,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RecentActionsPage() {
    const [isOpen,setIsOpen ] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toolsDropdown, setToolsDropdown] = useState(false);
  const navigate = useNavigate();

  const iconMap = {
    Instagram,
    FileText,
    Linkedin,
    Video,
    Palette,
  };
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

  const recentItems = [
    {
      id: 1,
      icon: <Play className="w-5 h-5" />,
      type: "Youtube Summarizer",
      title: "Video: How to use Figma",
      category: "video",
    },
    {
      id: 2,
      icon: <Presentation className="w-5 h-5" />,
      type: "Slideshow Maker",
      title: "Product Management: Case Competition",
      category: "slideshow",
    },
    {
      id: 3,
      icon: <Video className="w-5 h-5" />,
      type: "Video Generator",
      title: "Product Management",
      category: "video",
    },
  ];

  const filteredItems = recentItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
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
      <div className="flex items-center justify-center text-3xl font-semibold">
        Recent Actions
      </div>

      <div className="relative px-6 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <span className="text-white">Recents</span>
          <ChevronDown size={16} color="white" className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
        {/* Grid Menu Icon can go here */}
      </div>

      {isOpen && (
        <div className="absolute left-6 mt-2 w-48 bg-black border border-gray-700 rounded-md shadow-lg z-10">
          <ul className="text-white divide-y divide-gray-700">
            <li className="px-4 py-2 hover:bg-[#23b5b5] hover:text-black cursor-pointer">Most Active Tools</li>
            <li className="px-4 py-2 hover:bg-[#23b5b5] hover:text-black cursor-pointer">Last Accessed Extensions</li>
            <li className="px-4 py-2 hover:bg-[#23b5b5] hover:text-black cursor-pointer">Tool Activity Timeline</li>
            <li className="px-4 py-2 hover:bg-[#23b5b5] hover:text-black cursor-pointer">Quick Launch Tools</li>
          </ul>
        </div>
      )}
    </div>

      {/* Search Bar */}
      <div className="p-6 flex justify-center w-full">
        <div className="relative w-full max-w-xl border border-gray-700 rounded-md">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black text-white pl-4 pr-10 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Recent Items */}
      <div className="px-6 space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className=" rounded-lg px-4 py-6 border border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer group hover:border hover:border-[#23b5b5]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className=" p-2 rounded-md">{item.icon}</div>
                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-2">{item.type}</div>
                  <div className="text-white font-medium">{item.title}</div>
                </div>
              </div>
              <div className="flex items-center ">
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Help Button */}
    </div>
  );
}
