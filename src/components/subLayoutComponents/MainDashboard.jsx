import React, { useState, useEffect } from "react";
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
  LayoutDashboard,
  Layers,
  Workflow,
  PlugZap,
  ChevronRight,
  ChevronLeft,
  CircleUserRound,
  Grip,
  LogOut,
  TrendingUp,
  Star,
  Link,
} from "lucide-react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { MdElderlyWoman, MdOutlineGifBox } from "react-icons/md";
import { SiGmail, SiGooglesheets } from "react-icons/si";
import { PiSubtitles } from "react-icons/pi";
import { MdFaceRetouchingNatural } from "react-icons/md";
import MostPopular from "./workflows/MostPopular";
import InstagramAnalytics from "./InstagramAnalytics";
import MainWorkflowPage from "./workflowPages/MainWorkflowPage";
import IntegrationsPage from "../../components1/Integrations";
import {
  addRecentTool,
  getRecentTools,
  removeRecentTool,
} from "../../utils/recentTools.js";
import {
  SiGoogledrive,
  SiGooglecalendar,
  SiZoom,
  SiSlack,
  SiTrello,
  SiNotion,
  SiDropbox,
  SiWhatsapp,
  SiGoogleanalytics,
} from "react-icons/si";
import { MdBusiness } from "react-icons/md";
import { useSelector } from "react-redux";
import notes from "../../../public/images/notes-image.png";
import expli from "../../../public/images/expli-image.png";
const navItems = [
  { name: "Recent", icon: FileText, active: false, badge: null },
  { name: "Start", icon: Play, active: false, badge: null },
  { name: "All Apps", icon: Database, active: false, badge: null },
  { name: "Workflows", icon: Zap, active: false, badge: null },
  { name: "Integrations", icon: Plus, active: false, badge: null },
  { name: "Search", icon: Search, active: true, badge: null },
];
import AllPages from "../../pages/about_pages/AllApps.jsx";

import {
  FaYoutube,
  FaFileAlt,
  FaVideo,
  FaProjectDiagram,
  FaImage,
  FaImages,
  FaBolt,
  FaLaughSquint,
  FaPlug,
  FaLink,
  FaDatabase,
  FaSearch,
  FaPlay,
} from "react-icons/fa";
import { AiOutlineFileImage } from "react-icons/ai";
import { MdEdit } from "react-icons/md";

// Sidebar menu config
const menuItems = [
  {
    path: "/",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    path: "/all-apps",
    label: "All Apps",
    icon: <Layers className="w-5 h-5" />,
  },
  {
    path: "/workflows",
    label: "Workflows",
    icon: <Workflow className="w-5 h-5" />,
  },
  {
    path: "/integrations",
    label: "Integrations",
    icon: <PlugZap className="w-5 h-5" />,
  },
];

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

const sampleWorkflows = [
  {
    id: "GoogleSheets-Gmail",
    title: "Email Drip Campaigns",
    description:
      "Send personalized and automated follow-up emails directly from Google Sheets using Gmail to manage outreach campaigns efficiently.",
    tools: [
      {
        name: "Google Sheets",
        icon: <SiGooglesheets />,
        bgColor: "bg-green-500/30",
      },
      { name: "Gmail", icon: <SiGmail />, bgColor: "bg-red-500/30" },
    ],
    category: "Marketing",
    recommended: true,
  },
  {
    id: "Zoom-GoogleDrive",
    title: "Data Cleaning Pipelines",
    description:
      "Automatically store Zoom recordings in Google Drive, where files can be cleaned, processed, and organized for analytics.",
    tools: [
      { name: "Zoom", icon: <SiZoom />, bgColor: "bg-blue-500/30" },
      {
        name: "Google Drive",
        icon: <SiGoogledrive />,
        bgColor: "bg-yellow-500/30",
      },
    ],
    category: "Productivity",
    recommended: true,
  },
  {
    id: "Slack-GoogleCalendar",
    title: "Google Ads Spend Monitor",
    description:
      "Monitor Google Ads spending and instantly notify your team on Slack while scheduling reviews in Google Calendar.",
    tools: [
      { name: "Slack", icon: <SiSlack />, bgColor: "bg-purple-500/30" },
      {
        name: "Google Calendar",
        icon: <SiGooglecalendar />,
        bgColor: "bg-blue-400/30",
      },
    ],
    category: "Marketing",
    recommended: true,
  },
  {
    id: "Trello-WhatsApp",
    title: "Daily/Weekly Summary Emails on WhatsApp",
    description:
      "Generate automated task summaries from Trello and send them as digest messages via WhatsApp for quick team updates.",
    tools: [
      { name: "Trello", icon: <SiTrello />, bgColor: "bg-cyan-600/30" },
      { name: "WhatsApp", icon: <SiWhatsapp />, bgColor: "bg-green-600/30" },
    ],
    category: "Project Management",
    recommended: false,
  },
  {
    id: "Notion-Slack",
    title: "Customer Onboarding",
    description:
      "Track and document customer onboarding steps in Notion while sending real-time Slack updates to the team.",
    tools: [
      { name: "Notion", icon: <SiNotion />, bgColor: "bg-black" },
      { name: "Slack", icon: <SiSlack />, bgColor: "bg-purple-500/30" },
    ],
    category: "Collaboration",
    recommended: true,
  },
  {
    id: "GoogleAnalytics-WhatsApp",
    title: "Google Analytics (GA4) report on WhatsApp and Gmail",
    description:
      "Automate Google Analytics GA4 reports and deliver them via Gmail and WhatsApp for accessible, real-time insights.",
    tools: [
      {
        name: "Google Analytics",
        icon: <SiGoogleanalytics />,
        bgColor: "bg-orange-500/30",
      },
      { name: "WhatsApp", icon: <SiWhatsapp />, bgColor: "bg-green-600/30" },
      { name: "Gmail", icon: <SiGmail />, bgColor: "bg-red-500/30" },
    ],
    category: "Analytics",
    recommended: true,
  },
  {
    id: "GoogleAnalytics-Slack",
    title: "Google Ads Spend",
    description:
      "Track Google Ads spending using Google Analytics and push instant notifications to Slack channels for budget awareness.",
    tools: [
      {
        name: "Google Analytics",
        icon: <SiGoogleanalytics />,
        bgColor: "bg-orange-500/30",
      },
      { name: "Slack", icon: <SiSlack />, bgColor: "bg-purple-500/30" },
    ],
    category: "Marketing",
    recommended: false,
  },
  {
    id: "Dropbox-PowerBI",
    title: "Power BI Dashboard Auto-Refresh",
    description:
      "Sync Dropbox files with Power BI to ensure dashboards are refreshed automatically with the latest data.",
    tools: [
      { name: "Dropbox", icon: <SiDropbox />, bgColor: "bg-blue-700/30" },
      { name: "Power BI", icon: <MdBusiness />, bgColor: "bg-yellow-600/30" },
    ],
    category: "Analytics",
    recommended: true,
  },
  {
    id: "Dropbox-Trello",
    title: "Doc to Task Manager",
    description:
      "Convert documents uploaded to Dropbox into actionable Trello tasks automatically.",
    tools: [
      { name: "Dropbox", icon: <SiDropbox />, bgColor: "bg-blue-700/30" },
      { name: "Trello", icon: <SiTrello />, bgColor: "bg-cyan-600/30" },
    ],
    category: "Productivity",
    recommended: true,
  },
  {
    id: "GoogleSheets-Gmail",
    title: "CRM Automation",
    description:
      "Use Google Sheets as a lightweight CRM and automate customer communication through Gmail.",
    tools: [
      {
        name: "Google Sheets",
        icon: <SiGooglesheets />,
        bgColor: "bg-green-500/30",
      },
      { name: "Gmail", icon: <SiGmail />, bgColor: "bg-red-500/30" },
    ],
    category: "Sales",
    recommended: true,
  },
  {
    id: "Dropbox-Gmail",
    title: "Marketing Automation",
    description:
      "Automate the flow of marketing content by connecting Dropbox storage with Gmail campaigns.",
    tools: [
      { name: "Dropbox", icon: <SiDropbox />, bgColor: "bg-blue-700/30" },
      { name: "Gmail", icon: <SiGmail />, bgColor: "bg-red-500/30" },
    ],
    category: "Marketing",
    recommended: true,
  },
  {
    id: "Slack-Dropbox",
    title: "Customer Support Automation",
    description:
      "Forward Dropbox support files and documents directly to Slack to notify your support team instantly.",
    tools: [
      { name: "Slack", icon: <SiSlack />, bgColor: "bg-purple-500/30" },
      { name: "Dropbox", icon: <SiDropbox />, bgColor: "bg-blue-700/30" },
    ],
    category: "Support",
    recommended: true,
  },
  {
    id: "Slack-GoogleDrive",
    title: "Internal Team Workflows",
    description:
      "Simplify internal collaboration by syncing Google Drive files and sending updates to Slack channels.",
    tools: [
      { name: "Slack", icon: <SiSlack />, bgColor: "bg-purple-500/30" },
      {
        name: "Google Drive",
        icon: <SiGoogledrive />,
        bgColor: "bg-yellow-500/30",
      },
    ],
    category: "Collaboration",
    recommended: true,
  },
];

const allTools = [
  {
    title: "Youtube Summarizer",
    description: "A YouTube Summarizer quickly turns long videos into short.",
    icon: <FaYoutube />,
    color: "from-teal-500 to-teal-700",
    route: "/youtube-summarizer",
  },
  {
    title: "AI Subtitler",
    description: "Centralized AI Subtitler for your videos",
    icon: <FaFileAlt />,
    color: "from-teal-500 to-teal-700",
    route: "/ai-subtitler",
  },
  {
    title: "Text To Video Generator",
    description: "Generate videos using prompts.",
    icon: <FaVideo />,
    route: "/text-to-video",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Slideshow Maker",
    description: "Create stunning slideshows.",
    icon: <FaProjectDiagram />,
    route: "/presentation",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Bg Remover",
    description: "Remove background from images.",
    icon: <AiOutlineFileImage />,
    route: "/bg-remover",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Image Styler",
    description: "Style your images.",
    icon: <FaImages />,
    route: "/image-styler",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Video Meme Generator AI",
    description: "Turn any clip into a share-worthy meme in seconds with AI.",
    icon: <FaLaughSquint />,
    route: "/video-meme-generator",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Integrations",
    description: "Instantly share across your socials.",
    icon: <FaPlug />,
    route: "/integrations",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Socials",
    description: "One click, everywhere.",
    icon: <FaBolt />,
    route: "/socials",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "AI GIF Generator",
    description: "Viral GIFs, AI-powered in seconds.",
    icon: <MdOutlineGifBox />,
    route: "/ai-gif-generator",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "AI Hugging Video Maker",
    description: "Bring warm hugs to life with AI-powered videos.",
    icon: <FaPlay />,
    route: "/ai-hugging-video-maker",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Ageing Video Maker AI",
    description: "See yourself age in seconds with AI-powered videos.",
    icon: <MdElderlyWoman />,
    route: "/ageing-video-maker-ai",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "AI Tattoo Art Generator",
    description: "Design unique tattoo art instantly with AI.",
    icon: <MdEdit />,
    route: "/ai-tattoo-art-generator",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Image To Video AI",
    description: "Transform any image into a stunning video with AI.",
    icon: <FaImage />,
    route: "/image-to-video-ai",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Link To Video AI",
    description: "Turn any link into an engaging video with AI.",
    icon: <FaLink />,
    route: "/link-to-video-ai",
    color: "from-teal-500 to-teal-700",
  },
];

const MainDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [closeSidebar, setCloseSidebar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showAllApps, setShowAllApps] = useState(false);
  const [showAllWorkflows, setShowAllWorkflows] = useState(false);

  // Carousel states
  const [currentSlide, setCurrentSlide] = useState(0);

  // Search/filter state
  const [searchText, setSearchText] = useState("");

  // Use your own or generated HD images URLs here
  const expliImageUrl = expli;
  const notesImageUrl = notes;

  const carouselItems = [
    {
      id: 1,
      title: "Expli",
      description: "Advanced AI assistant for complex tasks and analysis",
      route: "/expli",
      image: expliImageUrl,
    },
    {
      id: 2,
      title: "Notes",
      description: "Create and manage your personal notes and documentation",
      route: "/tasks",
      image: notesImageUrl,
    },
  ];

  // Most popular apps
  // Most popular apps - selected from allTools
  const popularApps = [
    {
      id: 1,
      name: "Image Styler",
      icon: <Images className="w-8 h-8" />,
      color: "from-purple-500 to-pink-600",
      route: "/image-styler",
    },
    {
      id: 2,
      name: "Image To Video AI",
      icon: <FaImage className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-600",
      route: "/image-to-video-ai",
    },
    {
      id: 3,
      name: "Slideshow Maker",
      icon: <Projector className="w-8 h-8" />,
      color: "from-orange-500 to-red-600",
      route: "/presentation",
    },
    {
      id: 4,
      name: "AI GIF Generator",
      icon: <MdOutlineGifBox className="w-8 h-8" />,
      color: "from-green-500 to-teal-600",
      route: "/ai-gif-generator",
    },
  ].filter((app) =>
    searchText.trim().length === 0
      ? true
      : app.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Stats
  const allAppsCount = 1240;
  const workflowsCount = 89;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 2300);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  // Profile dropdown handlers
  let profileTimeoutId;
  const handleProfileEnter = () => {
    clearTimeout(profileTimeoutId);
    setIsProfileOpen(true);
  };
  const handleProfileLeave = () => {
    profileTimeoutId = setTimeout(() => setIsProfileOpen(false), 200);
  };

  // Carousel controls
  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + carouselItems.length) % carouselItems.length
    );

  // Limit items when not expanded
  const displayedApps = showAllApps ? allTools : allTools.slice(0, 8);
  const displayedWorkflows = showAllWorkflows
    ? sampleWorkflows
    : sampleWorkflows.slice(0, 6);

  // AppsGrid component (for inside All Apps card)
  function AppsGrid() {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 mt-4 flex-1 overflow-y-auto">
          {(showAllApps ? allTools : allTools.slice(0, 2)).map((tool) => {
            const IconComponent =
              iconMap[tool.icon?.displayName] ||
              iconMap[tool.icon?.name] ||
              Images;
            return (
              <div
                key={tool.title}
                className="flex items-center gap-2 bg-gradient-to-br from-gray-800/60 to-black/40 hover:from-[#23b5b5]/20 hover:to-cyan-800/20 p-3 rounded-lg transition group cursor-pointer"
                onClick={() => navigate(tool.route)}
              >
                <span
                  className={`rounded-md flex items-center justify-center text-xl text-white`}
                >
                  {typeof tool.icon === "string" ? (
                    tool.icon
                  ) : tool.icon?.type ? (
                    <tool.icon.type className="w-6 h-6" />
                  ) : (
                    <Images className="w-6 h-6" />
                  )}
                </span>
                <div>
                  <h4 className="font-semibold text-white text-sm">
                    {tool.title}
                  </h4>
                  <span className="block text-xs text-gray-400 line-clamp-1">
                    {tool.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <button
          className="mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#23b5b5] to-cyan-600 text-white font-bold"
          onClick={() => setShowAllApps((v) => !v)}
        >
          {showAllApps ? "Show Less" : "Expand All"}
        </button>
      </>
    );
  }

  // WorkflowsGrid component (for inside Workflows card)
  function WorkflowsGrid() {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 mt-4 flex-1 overflow-y-auto">
          {(showAllWorkflows
            ? sampleWorkflows
            : sampleWorkflows.slice(0, 2)
          ).map((flow) => (
            <div
              key={flow.id}
              className="bg-gradient-to-br from-gray-800/60 to-black/40 hover:from-cyan-700/20 hover:to-teal-700/20 p-3 rounded-lg flex flex-col transition group cursor-pointer"
              onClick={() => navigate("/workflows")}
            >
              <h4 className="font-semibold text-white text-sm mb-0.5">
                {flow.title}
              </h4>
              <span className="block text-xs text-gray-400 line-clamp-2">
                {flow.description}
              </span>
            </div>
          ))}
        </div>
        <button
          className="mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-[#23b5b5] text-white font-bold"
          onClick={() => setShowAllWorkflows((v) => !v)}
        >
          {showAllWorkflows ? "Show Less" : "Explore Workflows"}
        </button>
      </>
    );
  }

  return (
    <>
      <div className="w-full relative min-h-screen flex bg-black">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>
        {/* Sidebar Trigger Area */}
        <div
          className="fixed left-0 top-0 h-full w-6 z-30 hover-zone"
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
        />
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full bg-minimal-dark-200 backdrop-blur-xl border-r border-minimal-primary/20 flex flex-col justify-between transition-all duration-300 ease-in-out z-50 ${
            sidebarOpen ? "w-60 px-4" : "w-20 px-3"
          }`}
        >
          {/* Collapse/Expand Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setSidebarOpen((s) => !s)}
              className="p-2 rounded-md bg-minimal-cardHover hover:bg-minimal-cardHover/70 text-minimal-primary transition-all"
            >
              {sidebarOpen ? (
                <ChevronLeft size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {/* Navigation */}
          <div className="flex-1 mt-6">
            <nav className="space-y-2">
              {menuItems.map(({ path, label, icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `relative block transition-all duration-300 ease-in-out`
                  }
                >
                  {({ isActive }) => (
                    <div
                      className={`flex items-center font-medium px-3 py-2.5 rounded-lg transition-all duration-300 group relative
              ${
                isActive
                  ? "bg-minimal-cardHover text-[#23b5b5] shadow-sm shadow-[#23b5b5]/10"
                  : "text-gray-300 hover:text-[#23b5b5] hover:bg-minimal-cardHover/70"
              }`}
                    >
                      {/* 🔹 Left line indicator */}
                      <span
                        className={`absolute left-0 top-0 h-full w-[3px] rounded-r-md transition-all duration-300 ${
                          isActive
                            ? "bg-[#23b5b5] opacity-100"
                            : "bg-transparent opacity-0 group-hover:opacity-50 group-hover:bg-[#23b5b5]/50"
                        }`}
                      ></span>

                      {/* 🔹 Icon */}
                      <div
                        className={`p-2 rounded-md transition-all duration-300 flex-shrink-0 ${
                          collapsed ? "mx-auto" : ""
                        } ${
                          isActive
                            ? "text-[#23b5b5] scale-110 drop-shadow-[0_0_8px_#23b5b5]"
                            : "text-gray-300 group-hover:text-[#23b5b5] group-hover:scale-105"
                        }`}
                        title={!sidebarOpen ? label : ""}
                      >
                        {icon}
                      </div>

                      {/* 🔹 Label (collapse animation) */}
                      <span
                        className={`whitespace-nowrap text-sm overflow-hidden transition-all duration-300 ease-in-out ${
                          collapsed
                            ? "opacity-0 w-0"
                            : "opacity-100 w-auto ml-2"
                        } ${
                          isActive
                            ? "text-[#23b5b5]"
                            : "text-gray-300 group-hover:text-[#23b5b5]"
                        }`}
                      >
                        {label}
                      </span>

                      {/* 🔹 Tooltip (only when collapsed) */}
                      {collapsed && (
                        <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded-md py-1 px-2 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg border border-gray-700">
                          {label}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Profile */}
          <div
            onMouseEnter={handleProfileEnter}
            onMouseLeave={handleProfileLeave}
            className="relative flex flex-col items-center justify-center mt-auto mb-4 group"
          >
            {/* Profile Button */}
            <button
              onClick={() => navigate?.("/profile")}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl w-full transition-all duration-200 transform relative
      ${
        location.pathname === "/profile"
          ? "scale-105 text-[#23b5b5] bg-minimal-primary/20 border border-[#23b5b5]/40"
          : "text-minimal-white hover:text-[#23b5b5] hover:bg-minimal-cardHover"
      }`}
            >
              {/* Left Accent Strip (Active State) */}
              {location.pathname === "/profile" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#23b5b5] rounded-r-sm transition-all duration-200" />
              )}

              <CircleUserRound className="w-5 h-5 flex-shrink-0" />

              {/* Label visible only when expanded */}
              {sidebarOpen && (
                <span className="text-sm font-medium text-white whitespace-nowrap">
                  Profile
                </span>
              )}
            </button>

            {/* Tooltip for collapsed state */}
            {!sidebarOpen && (
              <span className="absolute left-full ml-3 bottom-2 bg-gray-900 text-white text-xs rounded-md py-1 px-2 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-40 shadow-lg border border-gray-700">
                Profile
              </span>
            )}

            {/* Dropdown (adjusted position to prevent overlap) */}
            {isProfileOpen && (
              <div
                className="absolute bottom-14 left-0 min-w-[220px]
      bg-gradient-to-br from-[#0d1418] to-[#111c20]
      backdrop-blur-xl border border-[#23b5b5]/40 rounded-xl shadow-lg
      p-4 flex flex-col items-center z-50
      transform transition-all duration-300 ease-out
      animate-in fade-in-20 scale-in-95"
              >
                {/* For Enterprises */}
                <a
                  className="w-full h-9 mb-3 rounded-lg border border-[#23b5b5]/40 text-sm font-medium text-white
          bg-transparent hover:bg-[#23b5b5]/15 hover:border-[#23b5b5]
          hover:shadow-md hover:shadow-cyan-500/20 transition-all duration-200 flex items-center justify-center"
                  href="https://explified.com/explified-labs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  For Enterprises
                </a>

                {/* Quick Tools */}
                <div className="flex gap-2 w-full mb-3">
                  {[
                    { icon: Plus, to: "/expli" },
                    { icon: FileText, to: "/tasks" },
                  ].map(({ icon: Icon, to }, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        navigate?.(to);
                        setIsProfileOpen(false);
                      }}
                      className="flex-1 h-9 flex items-center justify-center rounded-lg border border-[#23b5b5]/40 bg-transparent
                hover:bg-[#23b5b5]/15 hover:border-[#23b5b5] hover:shadow-sm hover:shadow-cyan-500/20
                text-white transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 w-full mb-3">
                  {[{ icon: Search, to: "/discover" }].map(
                    ({ icon: Icon, to }, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          navigate?.(to);
                          setIsProfileOpen(false);
                        }}
                        className="flex-1 h-9 flex items-center justify-center rounded-lg border border-[#23b5b5]/40 bg-transparent
              hover:bg-[#23b5b5]/15 hover:border-[#23b5b5] hover:shadow-sm hover:shadow-cyan-500/20
              text-white transition-all duration-200"
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    )
                  )}
                </div>

                {/* Workflows */}
                <div className="mb-3 w-full">
                  <h3 className="text-white text-xs font-semibold opacity-80 mb-2">
                    Workflows
                  </h3>
                  <div className="flex gap-2 w-full">
                    {[
                      { icon: Workflow, to: "/workflows" },
                      { icon: Zap, to: "/integrations" },
                    ].map(({ icon: Icon, to }, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          navigate?.(to);
                          setIsProfileOpen(false);
                        }}
                        className="flex-1 h-9 flex items-center justify-center rounded-lg border border-[#23b5b5]/40 bg-transparent
                  hover:bg-[#23b5b5]/15 hover:border-[#23b5b5] hover:shadow-sm hover:shadow-cyan-500/20
                  text-white transition-all duration-200"
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* All Tools */}
                <div className="w-full mb-1">
                  <h3 className="text-white text-xs font-semibold opacity-80 mb-2">
                    All Tools
                  </h3>
                  <button
                    onClick={() => {
                      navigate?.("/alltools");
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center justify-center w-12 h-12 mx-auto rounded-lg border border-[#23b5b5]/40 
            text-white bg-transparent hover:bg-[#23b5b5]/15 hover:border-[#23b5b5]
            hover:shadow-md hover:shadow-cyan-500/20 transition-all duration-200"
                  >
                    <Grip className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-20 relative z-10">
          <div className="w-full min-h-screen bg-black pt-10 pb-20">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div className="mx-auto">
                {/* Top Title, Subtitle, Filter Bar */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                  <div>
                    <h1
                      className="text-5xl font-extrabold leading-tight bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 text-transparent bg-clip-text animate-gradientText"
                      style={{
                        backgroundSize: "200% 200%",
                        backgroundPosition: "left center",
                        WebkitTextStroke: "1px #0ff6ef22",
                      }}
                    >
                      Explified
                    </h1>
                    <p className="text-lg text-gray-400 mt-3 font-medium">
                      Transform your workflow with AI-powered tools and seamless
                      automation
                    </p>
                  </div>
                  <div className="flex-1 flex items-end justify-end">
                    <div className="relative w-full max-w-md">
                      {/* Search Icon */}
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#23b5b5] pointer-events-none"
                        size={20}
                      />

                      {/* Search Input */}
                      <input
                        type="text"
                        className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-900 text-white border border-[#23b5b5]/30 placeholder:text-gray-400 focus:outline-none focus:border-[#23b5b5] transition-all"
                        placeholder="Search apps..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />

                      {/* Dropdown Filter Results */}
                      {searchText && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-gray-800 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto border border-[#23b5b5]/30">
                          {allTools
                            .filter((app) =>
                              app.title
                                .toLowerCase()
                                .includes(searchText.toLowerCase())
                            )
                            .map((app) => (
                              <div
                                key={app.title}
                                onClick={() => navigate(app.route)}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-[#23b5b5]/20 cursor-pointer transition-colors"
                              >
                                {/* App Icon */}
                                <span
                                  className={`w-8 h-8 flex items-center justify-center rounded-md text-lg bg-gradient-to-br ${
                                    app.color ?? "from-[#23b5b5] to-cyan-600"
                                  }`}
                                >
                                  {app.icon}
                                </span>

                                {/* App Title */}
                                <span className="text-white">{app.title}</span>
                              </div>
                            ))}

                          {/* No results message */}
                          {allTools.filter((app) =>
                            app.title
                              .toLowerCase()
                              .includes(searchText.toLowerCase())
                          ).length === 0 && (
                            <div className="px-4 py-2 text-gray-400">
                              No apps found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Top Section: Carousel & Apps, 2 columns - equal width */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Carousel: left half */}
                  <div className="flex flex-col gap-4 h-full">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden group">
                      {carouselItems.map((item, index) => (
                        <div
                          key={item.id}
                          onClick={() => navigate(item.route)} // 👈 Makes the whole slide clickable
                          className={`absolute inset-0 transition-all duration-700 ease-in-out cursor-pointer ${
                            index === currentSlide
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-95 pointer-events-none"
                          }`}
                        >
                          <div
                            className="w-full h-full p-6 flex flex-col justify-end rounded-2xl relative overflow-hidden bg-cover bg-center"
                            style={{ backgroundImage: `url(${item.image})` }}
                          >
                            {/* Gradient overlay for depth */}
                            {/* Gradient overlay with teal accent */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#0f2027]/90 via-[#23b5b5]/40 to-transparent z-0"></div>

                            {/* Glow effects */}
                            <div className="absolute inset-0 opacity-20 z-0">
                              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl" />
                            </div>

                          </div>
                        </div>
                      ))}

                      {/* Carousel Controls */}
                      <button
                        onClick={prevSlide}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-[#23b5b5]/60 transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-[#23b5b5]/30"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-[#23b5b5]/60 transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-[#23b5b5]/30"
                      >
                        <ChevronRight size={20} />
                      </button>

                      {/* Dots Indicator */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                        {carouselItems.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                              index === currentSlide
                                ? "w-6 bg-[#23b5b5]"
                                : "w-2 bg-white/40 hover:bg-white/60"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Most Popular Apps: right half */}
                  <div className="flex flex-col gap-3 mb-4">
                    {/* Most Popular Apps Heading */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                          Most Popular Apps
                        </h2>
                        
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#23b5b5]/10 to-transparent border border-[#23b5b5]/30">
                        <Star
                          size={14}
                          className="text-[#23b5b5] flex-shrink-0"
                        />
                        <span className="text-xs font-semibold text-[#23b5b5] whitespace-nowrap">
                          Trending
                        </span>
                      </div>
                    </div>

                    {/* Most Popular Apps Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
                      {popularApps.map((app) => (
                        <div
                          key={app.id}
                          onClick={() => navigate(app.route)}
                          className="group relative overflow-hidden rounded-xl border border-gray-700 hover:border-[#23b5b5]/50 bg-gradient-to-br from-gray-900/50 to-black/50 p-4 backdrop-blur-sm transition-all duration-300 hover:from-gray-900/80 hover:to-black/80 cursor-pointer hover:shadow-lg hover:shadow-[#23b5b5]/20 flex flex-col justify-between min-h-32 sm:min-h-40"
                        >
                          <div
                            className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${app.color}`}
                          />
                          <div className="relative z-10">
                            <div className="text-3xl sm:text-4xl mb-2 flex items-center justify-center">
                              {typeof app.icon === "string"
                                ? app.icon
                                : app.icon}
                            </div>
                            <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-1 text-center">
                              {app.name}
                            </h3>
                            <div className="flex items-center gap-1 mt-2 justify-center">
                              <Star
                                size={12}
                                className="text-yellow-400 fill-yellow-400 flex-shrink-0"
                              />
                              <span className="text-xs text-gray-400">4.8</span>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-[#23b5b5]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end p-3">
                            <button className="w-full text-xs font-semibold text-white bg-[#23b5b5] hover:bg-[#1a9393] rounded-lg py-2 transition-all duration-200 shadow-lg">
                              Explore
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Bottom Section: All Apps & Workflows statistic cards */}
                <div className="flex flex-col md:flex-row gap-6 min-h-[320px]">
                  {/* All Apps Card */}
                  <div className="flex-1 flex flex-col group overflow-hidden rounded-2xl border border-gray-700 hover:border-[#23b5b5]/50 bg-gradient-to-br from-gray-900/30 to-black/30 p-6 sm:p-8 backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#23b5b5] to-cyan-600 flex items-center justify-center">
                          <Database size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-white text-xl font-bold">
                            All Apps
                          </h3>
                          <p className="text-gray-400 text-sm">
                            Explore our complete collection
                          </p>
                        </div>
                      </div>
                      
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                      {displayedApps.map((app) => (
                        <div
                          key={app.title}
                          onClick={() => navigate(app.route)}
                          className="relative bg-[#13161a] rounded-xl p-5 cursor-pointer hover:shadow-xl hover:border-[#23b5b5] border border-transparent transition-all group flex flex-col"
                        >
                          {/* Header: Icon + Title side by side */}
                          <div className="flex items-center gap-3 mb-2">
                            {app.icon && (
                              <span
                                className={`w-9 h-9 flex items-center justify-center rounded-md text-xl bg-gradient-to-br ${
                                  app.color ?? "from-[#23b5b5] to-cyan-600"
                                }`}
                              >
                                {typeof app.icon === "string"
                                  ? app.icon
                                  : app.icon}
                              </span>
                            )}
                            <h3 className="font-semibold text-lg text-white">
                              {app.title}
                            </h3>
                          </div>

                          {/* Category badge below title */}
                          {app.category && (
                            <span className="text-[11px] px-2 py-1 rounded bg-[#24282c] text-teal-400 font-bold mb-2 w-max block uppercase">
                              {app.category}
                            </span>
                          )}

                          {/* Description */}
                          <p className="text-gray-400 text-[13px] mb-5 flex-1">
                            {app.description}
                          </p>

                          {/* CTA / Recommendation row */}
                          <div className="flex items-center text-[#23b5b5] text-xs font-medium">
                            <span className="mr-1">Launch Tool</span>
                            <span className="inline-block">&rarr;</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Expand Button */}
                    {allTools.length > 8 && (
                      <button
                        onClick={() => navigate("/all-apps")}
                        className="mt-4 py-2 rounded-lg bg-gradient-to-r from-[#23b5b5] to-cyan-600 text-white font-semibold hover:from-cyan-600 hover:to-[#23b5b5] transition-colors"
                      >
                        Expand All
                      </button>
                    )}
                  </div>

                  {/* Workflows Card */}
                  <div className="flex-1 flex flex-col group overflow-hidden rounded-2xl border border-gray-700 hover:border-[#23b5b5]/50 bg-gradient-to-br from-gray-900/30 to-black/30 p-6 sm:p-8 backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-600 to-[#23b5b5] flex items-center justify-center">
                          <Workflow size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-white text-xl font-bold">
                            Workflows
                          </h3>
                          <p className="text-gray-400 text-sm">
                            Pre-built automation templates
                          </p>
                        </div>
                      </div>
                      
                    </div>

                    {/* Workflows Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                      {displayedWorkflows.map((wf) => (
                        <div
                          key={wf.id}
                          onClick={() => navigate("/locked")}
                          className="relative bg-[#13161a] rounded-xl p-5 cursor-pointer hover:shadow-xl hover:border-[#23b5b5] border border-transparent transition-all group flex flex-col"
                        >
                          {/* Integrations/Icons Top Row */}
                          <div className="flex items-center gap-2 mb-3">
                            {wf.tools &&
                              wf.tools.map((tool, idx) => (
                                <span
                                  key={idx}
                                  className={`w-8 h-8 flex items-center justify-center rounded-md text-lg bg-gradient-to-br ${tool.bgColor}`}
                                >
                                  {tool.icon}
                                </span>
                              ))}
                            {wf.category && (
                              <span className="text-[11px] px-2 py-1 rounded bg-[#24282c] text-teal-400 font-bold ml-2 uppercase">
                                {wf.category}
                              </span>
                            )}
                          </div>
                          {/* Title */}
                          <h3 className="font-semibold text-lg text-white mb-0.5">
                            {wf.title}
                          </h3>
                          {/* Description */}
                          <p className="text-gray-400 text-[13px] mb-5 flex-1">
                            {wf.description}
                          </p>
                          {/* Recommendation/CTA */}
                          <div className="text-[#23b5b5] text-xs font-medium flex items-center">
                            <span className="mr-1">Recommended for you</span>
                            <span className="inline-block">&#9733;</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Expand Button */}
                    {sampleWorkflows.length > 2 && (
                      <button
                        onClick={() => navigate("/workflows")}
                        className="mt-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-[#23b5b5] text-white font-semibold hover:from-[#23b5b5] hover:to-cyan-600 transition-colors"
                      >
                        {showAllWorkflows ? "Show Less" : "Explore Workflows"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
        .hover-zone {
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default MainDashboard;
