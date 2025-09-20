import { useState, useRef, useEffect } from "react";
import {
  Youtube,
  FileText,
  Projector,
  ImagePlay,
  Images,
  FileVideo2,
  Plus,
  Play,
  ScreenShare,
  Image,
  Laugh,
  PenOff,
  BoomBox,
  Zap,
  Database,
  Search,
  MessageCircleMore,
  Users,
  Pin,
  PinOff,
  Check,
  ExternalLink,
  Copy,
  Edit3,
  Settings,
  Trash2,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { PiSubtitles } from "react-icons/pi";
import {
  MdOutlineGifBox,
  MdFaceRetouchingNatural,
  MdElderlyWoman,
} from "react-icons/md";
import MostPopular from "./workflows/MostPopular";
import InstagramAnalytics from "./InstagramAnalytics";
import { useNavigate, Link, useLocation } from "react-router-dom";
import MainWorkflowPage from "./workflowPages/MainWorkflowPage";
import IntegrationsPage from "../../components1/Integrations";
import {
  addRecentTool,
  getRecentTools,
  removeRecentTool,
} from "../../utils/recentTools.js";

const navItems = [
  { name: "Recent", icon: null, active: false, badge: null },
  { name: "Start", icon: null, active: false, badge: null },
  { name: "All Apps", icon: null, active: false, badge: null },
  { name: "Workflows", icon: null, active: false, badge: null },
  { name: "Integrations", icon: null, active: false, badge: null },
  { name: "Search", icon: Search, active: true, badge: null },
];
const sampleWorkflows = [
  {
    id: "zoom-gdrive",
    title:
      "Receive New Zoom Cloud Recordings Automatically Uploaded to Google Drive",
    description:
      "Automatically save your Zoom cloud recordings to Google Drive whenever a new recording is available. Perfect for keeping meeting records organized and accessible.",
    tools: [
      { name: "Zoom", icon: "🔵", bgColor: "bg-minimal-primary" }, // Zoom blue
      { name: "Google Drive", icon: "📁", bgColor: "bg-minimal-gray-600" }, // Google Drive green
    ],
    category: "Marketing",
    recommended: true,
  },
];

const menuOptions = [
  {
    icon: ExternalLink,
    label: "View Details",
    action: "view",
    className: "text-minimal-muted hover:text-minimal-primary",
  },
  {
    icon: Copy,
    label: "Duplicate",
    action: "duplicate",
    className: "text-minimal-muted hover:text-minimal-primary",
  },
  {
    icon: Edit3,
    label: "Edit",
    action: "edit",
    className: "text-minimal-muted hover:text-minimal-primary",
  },
  {
    icon: Settings,
    label: "Settings",
    action: "settings",
    className: "text-minimal-muted hover:text-minimal-primary",
  },
  {
    icon: Trash2,
    label: "Remove",
    action: "remove",
    className: "text-minimal-gray-500 hover:text-minimal-gray-400",
  },
];
const RenderMyIntegrations = () => {
  const myIntegrations = [
    {
      name: "Explified Engine",
      icon: <Youtube />,
      description: "A platform to share videos",
      connected: true,
      lastSync: "2 hours ago",
    },
  ];

  return (
    <>
      <p className="p-4 w-full text-2xl text-minimal-white tracking-tighter">
        Integrations
      </p>
      <div className="border-t border-gray-600 w-full mb-6"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {myIntegrations.map((tool, index) => (
          <div
            key={index}
            className="bg-teal-800 bg-opacity-30 border border-teal-600 rounded-xl p-5 hover:bg-opacity-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/20 relative group"
          >
            {/* Connected status indicator */}
            <div className="absolute top-3 right-3 flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  tool.connected ? "bg-green-400" : "bg-red-400"
                } animate-pulse`}
              ></div>
              <span className="text-xs text-gray-400">
                {tool.connected ? "Connected" : "Disconnected"}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg flex items-center justify-center text-white">
                {tool.icon}
              </div>
              <h3 className="text-white font-semibold text-sm">{tool.name}</h3>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed mb-3">
              {tool.description}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Last sync: {tool.lastSync}</span>
              <div
                className={`flex items-center gap-1 ${
                  tool.connected ? "text-green-400" : "text-gray-400"
                } `}
              >
                <Check className="w-3 h-3" />
                <span>{tool.connected ? "Active" : "Inctive"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const NavBarSection = ({
  selectedTool,
  onNavClick,
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  handleSearch,
  iconMap,
  setRecentTools,
  navigate,
  highlightMatch,
}) => (
  <>
    <div className="w-full pt-[30px] px-6 sm:px-12 lg:px-24 flex flex-col items-center gap-6 animate-fadeIn">
      <div className="w-full max-w-screen-lg mx-auto flex flex-col items-center gap-6">
        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent mb-2 drop-shadow-lg transition-transform duration-500 hover:scale-105 hover:tracking-wider text-center">
          Explified
        </h1>

        {/* Top Row - Search */}
        <div className="flex justify-center w-full px-2">
          {navItems
            .filter((item) => item.name === "Search")
            .map((item) => (
              <div
                key={item.name}
                className="relative w-full max-w-md sm:max-w-lg md:max-w-2xl animate-slideDown"
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-hover:text-teal-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className={`w-full bg-black/50 border border-gray-600 rounded-2xl pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-teal-500/10 ${
                    selectedTool === item.name
                      ? "bg-[#23b5b5] font-semibold"
                      : ""
                  }`}
                />
              </div>
            ))}
        </div>

        {/* Bottom Row - Nav buttons */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto flex-nowrap animate-fadeInUp delay-200 w-full px-2 sm:px-4 justify-center">
          {navItems
            .filter((item) => item.name !== "Search")
            .map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => onNavClick(item.name)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm md:text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 whitespace-nowrap ${
                  selectedTool === item.name
                    ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-500/20 border border-teal-500"
                    : "bg-black/20 border border-gray-600 text-gray-300 hover:bg-gray-700/60 hover:border-gray-500"
                }`}
              >
                <span>{item.name}</span>
              </button>
            ))}
        </div>
      </div>
    </div>

    <style jsx>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(15px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
      }
      .animate-fadeInUp {
        animation: fadeInUp 0.4s ease-out forwards;
      }
      .animate-slideDown {
        animation: slideDown 0.4s ease-out forwards;
      }
    `}</style>
  </>
);

const MainDashboard = () => {
  const [isOpenTools, setIsOpenTools] = useState(false);
  const [isOpenAllTools, setIsOpenAllTools] = useState(false);
  // Holds all selected filters; 'Recent' always included internally
  const [selectedTools, setSelectedTools] = useState("Recent");
  const [openMenuId, setOpenMenuId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Tools that match in title
    const titleMatches = allTools.filter((tool) =>
      tool.title.toLowerCase().includes(query)
    );

    // Tools that match in description but not already in titleMatches
    const descriptionMatches = allTools.filter(
      (tool) =>
        tool.description.toLowerCase().includes(query) &&
        !titleMatches.includes(tool)
    );

    // Combine results with title matches first
    const results = [...titleMatches, ...descriptionMatches];

    setSearchResults(results);
  };
  const highlightMatch = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="text-yellow-500 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // recent tools feature
  const [recentTools, setRecentTools] = useState([]);

  useEffect(() => {
    setRecentTools(getRecentTools());
  }, []);
  const handleRemove = (title) => {
    removeRecentTool(title);
    setRecentTools(getRecentTools()); // refresh list
  };

  const iconMap = {
    Youtube,
    FileText,
    Projector,
    ImagePlay,
    Images,
    FileVideo2,
    Laugh,
    Zap,
    BoomBox,
    MdOutlineGifBox,
    ScreenShare,
    MdElderlyWoman,
    PenOff,
    Image,
    Link,
  };

  const menuRef = useRef(null);
  const onToggleTool = (toolName) => {
    setSelectedTool(toolName);
    if (selectedTool === toolName) {
      setSelectedTools("Recent");
    } else {
      setSelectedTools(toolName);
    }
  };

  const toggleMenu = (workflowId, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === workflowId ? null : workflowId);
  };

  const handleMenuAction = (action, workflowTitle) => {
    console.log(`${action} action for: ${workflowTitle}`);
    setOpenMenuId(null);
  };

  // Separate refs for measuring height of different grids
  const toolsGridRef = useRef(null);
  const allToolsGridRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);

  const toolName = "Dashboard";
  const link = "https://explified.com/";

  const [selectedTool, setSelectedTool] = useState("Recent");

  // Refs for sections to scroll to
  const startRef = useRef(null);
  const recentRef = useRef(null);
  const allToolsRef = useRef(null);
  const workflowsRef = useRef(null);
  const integrationsRef = useRef(null);

  const handleNavBarClick = (navName) => {
    setSelectedTool(navName);
    switch (navName) {
      case "Start":
        startRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "Recent":
        recentRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "All Apps":
        allToolsRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "Workflows":
        workflowsRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "Integrations":
        integrationsRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "Search":
        allToolsRef.current?.scrollIntoView({ behavior: "smooth" }); // or wherever Search should go
        break;
      default:
        break;
    }
  };

  const allTools = [
    {
      title: "Youtube Summarizer",
      description: "A YouTube Summarizer quickly turns long videos into short.",
      icon: "Youtube",
      color: "from-teal-500 to-teal-700",
      route: "/youtube-summarizer",
    },
    {
      title: "AI Subtitler",
      description: "Centralized AI Subtitler for your videos",
      icon: "FileText",
      color: "from-teal-500 to-teal-700",
      route: "/ai-subtitler",
    },
    {
      title: "Text To Video Generator",
      description: "Generate videos using prompts.",
      icon: "FileVideo2",
      route: "/text-to-video",
      color: "from-teal-500 to-teal-700",
    },
    {
      title: "Slideshow Maker",
      description: "Create stunning slideshows.",
      icon: "Projector",
      route: "/presentation",
      color: "from-teal-500 to-teal-700",
    },
    {
      title: "Bg Remover",
      description: "Remove background from images.",
      icon: "ImagePlay",
      route: "/bg-remover",
      color: "from-teal-500 to-teal-700",
    },
    {
      title: "Image Styler",
      description: "Style your images.",
      icon: "Images",
      route: "/image-styler",
      color: "from-teal-500 to-teal-700",
    },
    {
      title: "Video Meme Generator AI",
      description: "Turn any clip into a share-worthy meme in seconds with AI.",
      icon: "Laugh",
      route: "/video-meme-generator",
      color: "from-teal-500 to-teal-700",
    },
    {
      title: "Integrations",
      description: "Instantly share across your socials.",
      icon: "Zap",
      route: "/integrations",
      color: "from-teal-500 to-teal-700",
    },
    {
      title: "Socials",
      description: "One click, everywhere.",
      icon: "BoomBox",
      route: "/socials",
      color: "from-teal-500 to-teal-700",
    },
    {
      title: "AI GIF Generator",
      description: "Viral GIFs, AI-powered in seconds.",
      icon: "MdOutlineGifBox",
      route: "/ai-gif-generator",
      color: "from-teal-500 to-teal-700",
    },
    {
      title: "AI Hugging Video Maker",
      description: "Bring warm hugs to life with AI-powered videos.",
      icon: "ScreenShare",
      route: "/ai-hugging-video-maker",
      color: "from-teal-500 to-teal-700",
    },
    {
      title: "Ageing Video Maker AI",
      description: "See yourself age in seconds with AI-powered videos.",
      icon: "MdElderlyWoman",
      route: "/ageing-video-maker-ai",
      color: "from-teal-500 to-teal-700",
    },
    {
      title: "AI Tattoo Art Generator",
      description: "Design unique tattoo art instantly with AI.",
      icon: "PenOff",
      route: "/ai-tattoo-art-generator",
      color: "from-teal-500 to-teal-700",
    },
    {
      title: "Image To Video AI",
      description: "Transform any image into a stunning video with AI.",
      icon: "Image",
      route: "/image-to-video-ai",
      color: "from-teal-500 to-teal-700",
    },
    {
      title: "Link To Video AI",
      description: "Turn any link into an engaging video with AI.",
      icon: "Link",
      route: "/link-to-video-ai",
      color: "from-teal-500 to-teal-700",
    },
  ];

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
  ];

  return (
    <>
      <div className="w-full relative px-5 min-h-screen flex flex-col items-center bg-black">
        <div className="absolute inset-0 rounded-xl opacity-30 pointer-events-none bg-gradient-to-br from-transparent via-cyan-500 to-transparent"></div>
        <div>
          <div
            className="absolute left-0 top-0 h-full w-6 z-30"
            onMouseEnter={() => setSidebarOpen(true)}
            onMouseLeave={() => setSidebarOpen(false)}
          />
          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full bg-minimal-dark-200 backdrop-blur-xl border-r border-minimal-primary/20 flex flex-col justify-between transition-transform duration-500 ease-in-out z-50 ${
              sidebarOpen
                ? "translate-x-0 opacity-100 w-64 px-6"
                : "-translate-x-full opacity-0 w-56 px-6"
            }`}
            onMouseEnter={() => !sidebarPinned && setSidebarOpen(true)}
            onMouseLeave={() => !sidebarPinned && setSidebarOpen(false)}
          >
            {/* Top section */}
            <div className="mt-8 animate-fadeUp will-change-[opacity,transform]">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white to-minimal-primary bg-clip-text text-transparent animate-gradientText will-change-[background-position]">
                  {toolName}
                </h2>
                <button
                  onClick={() => {
                    setSidebarPinned(!sidebarPinned);
                    setSidebarOpen(true); // Ensure open when pinned
                  }}
                  className="p-2 rounded-lg hover:bg-minimal-cardHover transition-colors duration-200"
                >
                  {sidebarPinned ? <PinOff size={20} /> : <Pin size={20} />}
                </button>
              </div>
            </div>
            {/* Bottom section */}
            <div className="mb-8">
              <Link to={"https://explified.com/explified-labs"}>
                <button className="w-full bg-gradient-to-r from-minimal-primary to-minimal-primary/80 hover:from-minimal-primary/80 hover:to-minimal-primary text-white font-semibold py-3 px-6 rounded-xl transition-transform duration-300 hover:scale-[1.04] hover:shadow-lg hover:shadow-minimal-primary/25 will-change-transform">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-transparent pt-[30px] max-w-[1480px] w-full animate-fadeUp will-change-[opacity,transform]">
          <NavBarSection
            selectedTools={selectedTools}
            selectedTool={selectedTool}
            onNavClick={onToggleTool}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            handleSearch={handleSearch}
            iconMap={iconMap}
            setRecentTools={setRecentTools}
            navigate={navigate}
            highlightMatch={highlightMatch}
          />
        </div>

        {/* Start Section */}
        {selectedTools === "Start" && (
          <div
            className="max-w-[1480px] w-full animate-fadeUp will-change-[opacity,transform]"
            ref={startRef}
          >
            <p className="p-4 w-full text-2xl text-minimal-white tracking-tighter">
              Start
            </p>
            <div className="border-t border-gray-600 w-full mb-6"></div>

            {/* main dashboard */}
            <div
              className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
              ref={toolsGridRef}
            >
              <div
                className="tool-card justify-center text-2xl font-bold text-minimal-white transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl hover:shadow-minimal-primary/20 will-change-transform"
                onClick={() => navigate("/expli")}
              >
                Expli(+)
              </div>
              <div
                className="tool-card justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl hover:shadow-minimal-primary/20 will-change-transform"
                onClick={() => navigate("/tasks")}
              >
                <h1 className="text-2xl font-bold text-minimal-white group-hover:text-minimal-primary transition-colors duration-300">
                  Notes
                </h1>
              </div>
              <div
                className="tool-card justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl hover:shadow-minimal-primary/20 will-change-transform"
                onClick={() => navigate("/memory")}
              >
                <h1 className="text-2xl font-bold text-minimal-white group-hover:text-minimal-primary transition-colors duration-300">
                  Memory
                </h1>
              </div>
              <div
                className="tool-card justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl hover:shadow-minimal-primary/20 will-change-transform"
                onClick={() => navigate("/search")}
              >
                <h1 className="text-2xl font-bold text-minimal-white group-hover:text-minimal-primary transition-colors duration-300">
                  Search
                </h1>
              </div>
            </div>
          </div>
        )}

        {selectedTool === "Recent" && (
          <div
            className="max-w-[1480px] w-full animate-fadeUp will-change-[opacity,transform]"
            ref={recentRef}
          >
            {/* Section Header */}
            <p className="p-4 w-full text-2xl text-minimal-white tracking-tighter">
              Recent
            </p>
            <div className="border-t border-gray-600 w-full mb-6"></div>

            {/* Grid of Recent Tools */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {/* Special Cards */}
              <div
                className="tool-card  justify-center text-2xl font-bold text-minimal-white transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl hover:shadow-minimal-primary/20 will-change-transform"
                onClick={() => navigate("/expli")}
              >
                {/* Background overlay */}
                {/* <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-br from-black/50 to-black/50"></div> */}
                <span className="relative z-10">Expli(+)</span>
              </div>

              <div
                className="tool-card justify-center text-2xl font-bold text-minimal-white transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl hover:shadow-minimal-primary/20 will-change-transform"
                onClick={() => navigate("/tasks")}
              >
                {/* <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-br from-black/50 to-black/50"></div> */}
                <span className="relative z-10">Notes</span>
              </div>

              {/* Dynamic Recent Tools */}
              {recentTools.length === 0 ? (
                <p className="text-gray-400 col-span-full text-center">
                  No recent tools yet.
                </p>
              ) : (
                recentTools
                  .slice()
                  .reverse()
                  .map((tool, i) => {
                    const IconComponent = iconMap[tool.icon] || FileText;
                    return (
                      <div
                        key={i}
                        className="tool-card cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl hover:shadow-minimal-primary/20 will-change-transform"
                        style={{ animationDelay: `${i * 50}ms` }}
                        onClick={() => {
                          addRecentTool(tool);
                          setRecentTools(getRecentTools());
                          navigate(tool.route);
                        }}
                      >
                        {/* Cross Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(tool.title);
                          }}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          ✕
                        </button>
                        <div className="flex flex-col items-start justify-between h-full">
                          {/* Icon */}
                          <div
                            className={`h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-r ${tool.color} mb-3 transition-transform duration-300`}
                          >
                            <IconComponent className="w-6 h-6 text-minimal-white" />
                          </div>

                          {/* Title + Description */}
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-minimal-white mb-1">
                              {tool.title}
                            </h3>
                            <p className="text-minimal-muted text-xs leading-snug">
                              {tool.description}
                            </p>
                          </div>

                          {/* CTA */}
                          <div className="mt-2 flex items-center text-minimal-primary">
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
                  })
              )}
            </div>
          </div>
        )}

        {/* All Tools Section */}
        {selectedTools === "All Apps" && (
          <div
            className="max-w-[1480px] w-full animate-fadeUp will-change-[opacity,transform]"
            ref={allToolsRef}
          >
            <p className="p-4 w-full text-2xl text-minimal-white tracking-tighter">
              All Apps
            </p>
            <div className="border-t border-gray-600 w-full mb-6"></div>

            <div className="flex gap-4 w-full">
              <div className="h-fit w-full">
                <div
                  style={{
                    transition: "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    ref={allToolsGridRef}
                    className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                  >
                    {allTools.map((tool, index) => {
                      const IconComponent = iconMap[tool.icon] || FileText;
                      return (
                        <div
                          key={index}
                          className="tool-card transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl hover:shadow-minimal-primary/20 will-change-transform"
                          onClick={() => {
                            addRecentTool({ ...tool, icon: tool.icon });
                            setRecentTools(getRecentTools());
                            navigate(tool.route);
                          }}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-minimal-primary/10 to-minimal-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="tool_description flex gap-3 items-start">
                              <div
                                className={`h-8 w-8 flex items-center p-2 rounded-lg bg-gradient-to-br ${tool.color} mb-2 transition-transform duration-300`}
                              >
                                <IconComponent className="w-5 h-5 text-minimal-white" />
                              </div>
                              <div>
                                <h3 className="text-base font-semibold text-minimal-white mb-1 transition-colors duration-300">
                                  {tool.title}
                                </h3>
                                <p className="text-minimal-muted text-xs leading-snug transition-colors duration-300">
                                  {tool.description}
                                </p>
                              </div>
                            </div>
                            <div className="mt-1 flex items-center text-minimal-primary opacity-100 transition-all duration-300 transform translate-x-2">
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
              </div>
            </div>
          </div>
        )}

        {/* Workflows Section */}
        {selectedTools === "Workflows" && (
          <div
            className="max-w-[1480px] w-full animate-fadeUp will-change-[opacity,transform]"
            ref={workflowsRef}
          >
            <p className="p-4 w-full text-2xl text-minimal-white tracking-tighter">
              Workflows
            </p>
            <div className="border-t border-gray-600 w-full mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sampleWorkflows.map((workflow) => {
                const isMenuOpen = openMenuId === workflow.id;

                return (
                  <div
                    key={workflow.id}
                    className="group relative bg-minimal-dark-100 rounded-xl p-4 border border-minimal-border hover:border-minimal-primary/50 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-minimal-primary/20 cursor-pointer flex flex-col h-64 will-change-transform"
                  >
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-minimal-primary/10 to-minimal-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Header - Tools Icons and Menu */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {/* Tool Icons */}
                          <div className="flex -space-x-2">
                            {workflow.tools.map((tool, index) => (
                              <div
                                key={index}
                                className={`w-10 h-10 ${tool.bgColor} rounded-lg flex items-center justify-center text-minimal-white text-lg shadow-lg border-2 border-minimal-border transition-transform duration-300`}
                                title={tool.name}
                                style={{
                                  zIndex: workflow.tools.length - index,
                                }}
                              >
                                {tool.icon}
                              </div>
                            ))}
                          </div>

                          {/* Arrow connector */}
                          <svg
                            className="w-6 h-6 text-minimal-muted transition-colors duration-300"
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

                        {/* Menu Button */}
                        <div className="relative" ref={menuRef}>
                          <button
                            onClick={(e) => toggleMenu(workflow.id, e)}
                            className="p-2 rounded-lg hover:bg-minimal-cardHover transition-colors duration-200 z-20 relative"
                          >
                            <MoreHorizontal className="w-5 h-5 text-minimal-muted hover:text-minimal-primary transition-colors duration-200" />
                          </button>

                          {/* Dropdown Menu */}
                          {isMenuOpen && (
                            <div className="absolute right-0 top-10 w-48 bg-minimal-dark-100 rounded-lg border border-minimal-border shadow-2xl z-30 overflow-hidden animate-fadeIn will-change-[opacity,transform]">
                              <div className="absolute inset-0 bg-minimal-dark-100/95 backdrop-blur-sm"></div>
                              <div className="relative z-10 py-2">
                                {menuOptions.map((option, optionIndex) => {
                                  const OptionIcon = option.icon;
                                  return (
                                    <button
                                      key={optionIndex}
                                      onClick={() =>
                                        handleMenuAction(
                                          option.action,
                                          workflow.title
                                        )
                                      }
                                      className={`w-full flex items-center px-4 py-2 text-sm hover:bg-minimal-cardHover/50 transition-all duration-200 ${option.className}`}
                                    >
                                      <OptionIcon className="w-4 h-4 mr-3" />
                                      <span>{option.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                              <div className="absolute inset-0 rounded-lg border border-minimal-primary/20 pointer-events-none"></div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content - Workflow Description */}
                      <div className="flex-1 ">
                        <div className="inline-block px-2 py-1 bg-minimal-gray-800 rounded-md text-xs text-minimal-primary mb-3">
                          {workflow.category}
                        </div>

                        <h3 className="text-base font-semibold line-clamp-3 text-minimal-white transition-colors duration-300 leading-tight">
                          {workflow.title}
                        </h3>
                      </div>

                      {/* Footer - Recommended Badge */}
                      <div className="flex items-center justify-between pt-2 border-t border-minimal-border/50">
                        {workflow.recommended && (
                          <div className="flex items-center text-minimal-primary">
                            <Sparkles className="w-4 h-4 mr-2" />
                            <span className="text-xs font-medium">
                              Recommended for you
                            </span>
                          </div>
                        )}

                        <div className="flex items-center text-minimal-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1 ml-auto">
                          <span className="text-xs font-medium">
                            Use Workflow
                          </span>
                          <svg
                            className="w-4 h-4 ml-1"
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
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Integrations Section */}
        {selectedTools === "Integrations" && (
          <div
            className="max-w-[1480px] w-full animate-fadeUp will-change-[opacity,transform]"
            ref={integrationsRef}
          >
            <RenderMyIntegrations />
          </div>
        )}
      </div>

      {/* Only animation helpers; no content changed */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeUp {
          animation: fadeUp 0.55s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes gradientText {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradientText {
          background-size: 200% 200%;
          animation: gradientText 6s linear infinite;
        }
        .animate-fadeIn {
          animation: fadeUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  );
};

export default MainDashboard;
