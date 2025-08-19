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

const NavBarSection = ({ selectedTool, onNavClick }) => (
  <div className="flex justify-between w-full bg-transparent pt-[30px] px-6">
    {/* Left side buttons */}
    <div className="flex gap-4 items-center flex-nowrap">
      {navItems
        .filter((item) => item.name !== "Search")
        .map((item) => (
          <div key={item.name} className="flex flex-col items-center relative">
            <button
              type="button"
              onClick={() => onNavClick(item.name)}
              className={
                selectedTool === item.name
                  ? "flex items-center justify-center bg-[#23b5b5] text-white min-w-[100px] h-8 px-4 rounded-[22px] border border-[#7ce4de] text-base font-semibold"
                  : "flex items-center justify-center bg-transparent text-white min-w-[100px] h-8 px-4 rounded-[22px] border border-[#7ce4de] text-base hover:bg-[#7c8e91]/60"
              }
            >
              <span>{item.name}</span>
            </button>
          </div>
        ))}
    </div>

    {/* Search input at rightmost */}
    <div className="flex flex-col items-center">
      {navItems
        .filter((item) => item.name === "Search")
        .map((item) => (
          <div
            key={item.name}
            className="flex justify-between items-center w-full px-6"
          >
            {/* Other buttons/groups here on the left */}

            <input
              type="text"
              placeholder="Search..."
              // onFocus={() => onNavClick(item.name)}
              className={`absolute top-[60px] right-[20px] flex items-center justify-center bg-transparent text-white min-w-[100px] h-8 px-4 rounded-[22px] border border-[#7ce4de] text-base  focus:outline-none ${
                selectedTool === item.name ? "bg-[#23b5b5] font-semibold" : ""
              }`}
            />
          </div>
        ))}
    </div>
  </div>
);

const MainDashboard = () => {
  const [isOpenTools, setIsOpenTools] = useState(false);
  const [isOpenAllTools, setIsOpenAllTools] = useState(false);
  // Holds all selected filters; 'Recent' always included internally
  const [selectedTools, setSelectedTools] = useState("Recent");
  const [openMenuId, setOpenMenuId] = useState(null);

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

  const [toolsGridMaxHeight, setToolsGridMaxHeight] = useState("500px");
  const [allToolsGridMaxHeight, setAllToolsGridMaxHeight] = useState("500px");

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

  useEffect(() => {
    if (isOpenTools && toolsGridRef.current) {
      setToolsGridMaxHeight(toolsGridRef.current.scrollHeight + "px");
    } else {
      setToolsGridMaxHeight("500px");
    }
  }, [isOpenTools, tools.length]);

  useEffect(() => {
    if (isOpenAllTools && allToolsGridRef.current) {
      setAllToolsGridMaxHeight(allToolsGridRef.current.scrollHeight + "px");
    } else {
      setAllToolsGridMaxHeight("500px");
    }
  }, [isOpenAllTools, allTools.length]);

  return (
    <>
      <div className="w-full h-full px-5 mb-10 flex flex-col items-center">
        <div>
          <div
            className="absolute left-0 top-0 h-full w-6 z-30"
            onMouseEnter={() => setSidebarOpen(true)}
            onMouseLeave={() => setSidebarOpen(false)}
          />
          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full bg-black/95 backdrop-blur-xl border-r border-minimal-primary/20 flex flex-col justify-between transition-all duration-300 z-50 ${
              sidebarOpen ? "w-56 px-6" : "w-0 px-0 overflow-hidden"
            }`}
            onMouseEnter={() => !sidebarPinned && setSidebarOpen(true)}
            onMouseLeave={() => !sidebarPinned && setSidebarOpen(false)}
          >
            {/* Top section */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white to-minimal-primary bg-clip-text text-transparent">
                  {toolName}
                </h2>
                <button
                  onClick={() => {
                    setSidebarPinned(!sidebarPinned);
                    setSidebarOpen(true); // Ensure open when pinned
                  }}
                >
                  {sidebarPinned ? <PinOff size={20} /> : <Pin size={20} />}
                </button>
              </div>
            </div>
            {/* Bottom section */}
            <div className="mb-8">
              <Link to={link}>
                <button className="w-full bg-gradient-to-r from-minimal-primary to-minimal-primary/80 hover:from-minimal-primary/80 hover:to-minimal-primary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-minimal-primary/25">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-transparent pt-[30px]">
          <NavBarSection
            selectedTools={selectedTools}
            selectedTool={selectedTool}
            onNavClick={onToggleTool}
          />
        </div>

        {/* Start Section */}
        {selectedTools === "Start" && (
          <div className="max-w-[1480px]  w-full" ref={startRef}>
            <p className="p-4 w-full text-2xl text-minimal-white tracking-tighter">
              Start
            </p>
            <div className="border-t border-gray-600 w-full mb-6"></div>

            {/* main dashboard */}
            <div
              className="flex flex-wrap gap-6 justify-start"
              ref={toolsGridRef}
            >
              <div className="tool-card" onClick={() => navigate("/tasks")}>
                <h1 className="text-2xl font-bold text-minimal-white group-hover:text-minimal-primary transition-colors duration-300">
                  Notes
                </h1>
              </div>
              <div className="tool-card" onClick={() => navigate("/memory")}>
                <h1 className="text-2xl font-bold text-minimal-white group-hover:text-minimal-primary transition-colors duration-300">
                  Memory
                </h1>
              </div>
              <div className="tool-card" onClick={() => navigate("/search")}>
                <h1 className="text-2xl font-bold text-minimal-white group-hover:text-minimal-primary transition-colors duration-300">
                  Search
                </h1>
              </div>
            </div>
          </div>
        )}

        {selectedTools === "Recent" && (
          <div className="max-w-[1480px]  w-full" ref={recentRef}>
            <p className="p-4 w-full text-2xl text-minimal-white tracking-tighter">
              Recent
            </p>
            <div className="border-t border-gray-600 w-full mb-6"></div>

            {/* main dashboard */}
            <div className="flex flex-wrap gap-6 justify-start">
              <div className="tool-card" onClick={() => navigate("/expli")}>
                <Plus className="w-8 h-8 text-white group-hover:text-minimal-primary transition-colors duration-300" />
              </div>
              <div className="tool-card" onClick={() => navigate("/tasks")}>
                <h1 className="text-2xl font-bold text-minimal-white group-hover:text-minimal-primary transition-colors duration-300">
                  Notes
                </h1>
              </div>
              {tools.map((tool, i) => {
                const IconComponent = tool.icon; // ✅ Insert here
                return (
                  <div
                    key={i}
                    className="tool-card"
                    onClick={() => navigate(tool.route)}
                  >
                    {/* <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-minimal-primary/10 to-minimal-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div className="tool_description flex gap-3 items-start">
                        <div
                          className={`h-8 w-8 flex items-center p-2 rounded-lg bg-gradient-to-r ${tool.color} mb-2 group-hover:scale-110 transition-transform duration-300`}
                        >
                          {/* ✅ Render the icon here */}
                          <IconComponent className="w-5 h-5 text-minimal-white" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-minimal-white mb-1 group-hover:text-minimal-primary transition-colors duration-300">
                            {tool.title}
                          </h3>
                          <p className="text-minimal-muted text-xs leading-snug group-hover:text-minimal-gray-300 transition-colors duration-300">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center text-minimal-primary opacity-100  transition-all duration-300 transform translate-x-2">
                        <span className="text-xs font-medium">Launch Tool</span>
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
        )}

        {/* All Tools Section */}
        {selectedTools === "All Apps" && (
          <div className="max-w-[1480px] w-full" ref={allToolsRef}>
            <p className="p-4 w-full text-2xl text-minimal-white tracking-tighter">
              All Apps
            </p>
            <div className="border-t border-gray-600 w-full mb-6"></div>

            <div className="flex gap-4 w-full">
              <div className="bg-minimal-card rounded-2xl border border-minimal-border h-fit p-4 shadow-2xl w-full">
                <div
                  style={{
                    maxHeight: allToolsGridMaxHeight,
                    transition: "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    ref={allToolsGridRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 w-full"
                  >
                    {(isOpenAllTools ? allTools : allTools.slice(0, 3)).map(
                      (tool, index) => {
                        const IconComponent = tool.icon;
                        return (
                          <div
                            key={index}
                            className="tool-card"
                            onClick={() => navigate(tool.route)}
                          >
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-minimal-primary/10 to-minimal-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10 flex flex-col justify-between h-full">
                              <div className="tool_description flex gap-3 items-start">
                                <div
                                  className={`h-8 w-8 flex items-center p-2 rounded-lg bg-gradient-to-r ${tool.color} mb-2 group-hover:scale-110 transition-transform duration-300`}
                                >
                                  <IconComponent className="w-5 h-5 text-minimal-white" />
                                </div>
                                <div>
                                  <h3 className="text-base font-semibold text-minimal-white mb-1 group-hover:text-minimal-primary transition-colors duration-300">
                                    {tool.title}
                                  </h3>
                                  <p className="text-minimal-muted text-xs leading-snug group-hover:text-minimal-gray-300 transition-colors duration-300">
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
                      }
                    )}
                  </div>
                </div>
                {allTools.length > 6 && (
                  <div className="flex justify-center ">
                    <button
                      className="px-4 py-2 bg-minimal-primary text-minimal-white rounded-lg hover:bg-minimal-primary/80 transition-colors duration-200"
                      onClick={() => setIsOpenAllTools((prev) => !prev)}
                    >
                      {isOpenAllTools ? "Show Less" : "Show More"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Workflows Section */}
        {selectedTools === "Workflows" && (
          <div ref={workflowsRef}>
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
                    className="group relative bg-minimal-dark-100 rounded-xl p-4 border border-minimal-border hover:border-minimal-primary/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-minimal-primary/20 cursor-pointer flex flex-col h-64"
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
                                className={`w-10 h-10 ${tool.bgColor} rounded-lg flex items-center justify-center text-minimal-white text-lg shadow-lg border-2 border-minimal-border group-hover:scale-110 transition-transform duration-300`}
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
                            className="w-6 h-6 text-minimal-muted group-hover:text-minimal-primary transition-colors duration-300"
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
                            <div className="absolute right-0 top-10 w-48 bg-minimal-dark-100 rounded-lg border border-minimal-border shadow-2xl z-30 overflow-hidden">
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

                        <h3 className="text-base font-semibold line-clamp-3 text-minimal-white group-hover:text-minimal-primary transition-colors duration-300 leading-tight">
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
          <div className="max-w-[1480px]  w-full" ref={integrationsRef}>
            <RenderMyIntegrations />
          </div>
        )}
      </div>
    </>
  );
};

export default MainDashboard;
