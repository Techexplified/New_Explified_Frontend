import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";

import {
  Home,
  History,
  Zap,
  LayoutDashboard,
  BoomBox,
  PencilRuler,
  Workflow,
  CircleUserRound,
  MessageSquareQuote,
  Star,
  BrainCircuit,
  Youtube,
  Captions,
  Linkedin,
  Video,
  ImagePlay,
  SquarePercent,
  BotMessageSquare,
  Plus,
  SectionIcon,
  Grip,
  Settings,
  File,
} from "lucide-react";
import logo from "../assets/logos/explified_logo.png";
import UserModal from "./UserModal";

const UpdatedDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const [selectedTool, setSelectedTool] = useState(null);
  const [showContent, setShowContent] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userCredits = {
    remaining: 245,
    total: 500,
    plan: "Pro Plan",
  };
  const creditsPercentage = (userCredits.remaining / userCredits.total) * 100;

  // Tools & AI tools data
  const tools = [
    {
      name: "",
      icon: LayoutDashboard,
      description: "Shows key metrics",
    },
    {
      name: "Workflows",
      icon: Workflow,
      description: "Automates task sequences",
    },
  ];
  const plusTools = [
    {
      name: "Files",
      icon: File,
      path: "/file",
    },
  ];

  const aiTools = [
    { name: "Integrations", icon: Zap, path: "/integrations" },
    {
      name: "Workflows",
      icon: Workflow,
      path: "/workflows",
    },
    // { name: "Socials", icon: BoomBox, route: "/socials" },
    // { name: "Youtube Summarizer", icon: Youtube, route: "/youtube-summarizer" },
    // { name: "AI Subtitler", icon: Captions, route: "/ai-subtitler" },
    // { name: "Linkedin Extension", icon: Linkedin, route: "/linkedin" },
    // { name: "Meme Generator", icon: Video, route: "/video-meme-generator" },
    // { name: "Bg Remover", icon: ImagePlay, route: "/bg-remover" },
    // { name: "Influmark", icon: SquarePercent, route: "/influmark" },
    // {
    //   name: "Chats",
    //   icon: SquarePercent,
    //   description: "Lets you chat with others",
    // },
  ];

  // Handlers
  function PlusClick() {
    setIsDrawerOpen((prev) => !prev);
    navigate("/lurphchat");
  }
  function ToolsClick(e) {
    e.stopPropagation();
    setIsToolsOpen((prev) => !prev);
  }

  // Outside click close for tools menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".tools-dropdown") &&
        !e.target.closest(".tools-button")
      ) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Sidebar open/close animation
  useEffect(() => {
    if (sidebarOpen) {
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [sidebarOpen]);

  // Navbar hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY <= lastScrollY);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Set selectedTool based on route
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === "/") {
      setSelectedTool("Dashboard");
    } else if (pathname === "/workflows") {
      setSelectedTool("Workflows");
    } else if (pathname === "/socials") {
      setSelectedTool("Socials");
    } else if (pathname === "/favorites") {
      setSelectedTool("Favorites");
    } else {
      setSelectedTool(null);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-minimal-background via-minimal-dark-100 to-minimal-dark-200 flex flex-col overflow-hidden">
      <UserModal
        showUserModal={showUserModal}
        setShowUserModal={setShowUserModal}
      />

      {/* Header */}
      <header
        className={`relative bg-minimal-dark-100/50 h-[70px] backdrop-blur-sm border-b border-minimal-border/50 px-6 transition-transform duration-300 z-50 top-0 left-0 w-full ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link
              to="https://explified.com/"
              className="flex items-center gap-1"
            >
              <img className="w-7" src={logo} alt="Explified" />
              <h2 className="text-xl font-bold text-minimal-white">
                Explified
              </h2>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => {}}
              className="flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 text-minimal-white hover:text-minimal-primary hover:bg-minimal-cardHover"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* 1 Dashboard Button */}
            {(() => {
              const tool = {
                name: "",
                icon: LayoutDashboard,
                description: "Shows key metrics",
              };
              const Icon = tool.icon;
              const isActive = selectedTool === tool.name;
              return (
                <button
                  onClick={() => {
                    setSelectedTool(isActive ? null : tool.name);
                    navigate(`/${tool.name.toLowerCase()}`);
                  }}
                  className={`flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 transform
          ${
            location.pathname === `/${tool.name.toLowerCase()}`
              ? "w-14 h-14 scale-110 text-[#23b5b5] bg-minimal-primary/20 border border-[#23b5b5]/30"
              : "w-10 h-10 text-minimal-white hover:text-[#23b5b5] hover:bg-minimal-cardHover"
          }`}
                >
                  <Icon className="w-6 h-6" />
                </button>
              );
            })()}

            {/* 2 Plus */}
            {/* 2 Plus */}
            <div
              className="relative"
              onMouseEnter={() => setIsPlusOpen(true)}
              onMouseLeave={() => setIsPlusOpen(false)}
            >
              <button
                onClick={PlusClick}
                className={`flex items-center justify-center rounded-xl transition-all duration-200 transform
      ${
        location.pathname === "/lurphchat"
          ? "w-14 h-14 scale-110 text-[#23b5b5] bg-minimal-primary/20 border border-[#23b5b5]/30"
          : "w-10 h-10 text-minimal-white hover:text-[#23b5b5] hover:bg-minimal-cardHover"
      }`}
              >
                <Plus
                  className={
                    location.pathname === "/lurphchat" ? "w-6 h-6" : "w-5 h-5"
                  }
                />
              </button>

              {/* dropdown for plus */}
              {isPlusOpen && (
                <div className="absolute left-[-4px] mt-1 flex flex-col bg-minimal-card p-2 rounded-xl shadow-lg border border-gray-700 z-50">
                  {plusTools.map((tool) => {
                    const Icon = tool.icon;
                    const isActive = location.pathname === tool.path;
                    return (
                      <button
                        key={tool.name}
                        type="button"
                        onMouseDown={() => {
                          navigate(tool.path);
                          setIsPlusOpen(false);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-left transition-colors ${
                          isActive
                            ? "bg-[#23b5b5]/20 text-[#23b5b5]"
                            : "text-white hover:bg-minimal-cardHover hover:text-[#23b5b5]"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3 profile */}
            <button
              onClick={() => setShowUserModal(true)}
              className="flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 text-minimal-white hover:text-minimal-primary hover:bg-minimal-cardHover"
            >
              <CircleUserRound className="w-5 h-5" />
            </button>

            {/* 4 9 dots */}
            <div
              className="relative"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              {/* Nine-dots button */}
              <button
                type="button"
                className="flex items-center justify-center w-14 h-14 rounded-xl text-white hover:bg-minimal-cardHover"
                onClick={() => setIsOpen((s) => !s)} // optional: click to toggle
              >
                <Grip className="w-6 h-6" />
              </button>

              {/* Dropdown */}
              {isOpen && (
                <div className="absolute left-0 mt-1 flex flex-col bg-minimal-card p-2 rounded-xl shadow-lg border border-gray-700 z-50">
                  {/* Manually rendered buttons (you can still map if you prefer) */}
                  {aiTools.map((tool) => {
                    const Icon = tool.icon;
                    const isActive = location.pathname === tool.path;
                    return (
                      <button
                        key={tool.name}
                        type="button" // prevents form submit
                        onMouseDown={() => {
                          // fires before blur/unmount
                          console.log("navigating to", tool.path);
                          navigate(tool.path);
                          setIsOpen(false);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-left transition-colors ${
                          isActive
                            ? "bg-[#23b5b5]/20 text-[#23b5b5]"
                            : "text-white hover:bg-minimal-cardHover hover:text-[#23b5b5]"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* <button
              onClick={() => navigate("/aitools")}
              className={`flex items-center justify-center rounded-xl transition-all duration-200 transform
    ${
      location.pathname === "/aitools"
        ? "w-14 h-14 scale-110 text-[#23b5b5] bg-minimal-primary/20 border border-[#23b5b5]/30"
        : "w-10 h-10 text-minimal-white hover:text-[#23b5b5] hover:bg-minimal-cardHover"
    }`}
            >
              <BrainCircuit
                className={
                  location.pathname === "/aitools" ? "w-6 h-6" : "w-5 h-5"
                }
              />
            </button> */}

            {/* Tools */}
            {/* {tools.map((tool, idx) => {
              const Icon = tool.icon;
              const isActive = selectedTool === tool.name;
              return (
                <button
                  key={tool.name}
                  onClick={() => {
                    setSelectedTool(isActive ? null : tool.name);
                    navigate(`/${tool.name.toLowerCase()}`);
                  }}
                  className={`flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 transform
        ${
          location.pathname === `/${tool.name.toLowerCase()}`
            ? "w-14 h-14 scale-110 text-[#23b5b5] bg-minimal-primary/20 border border-[#23b5b5]/30"
            : "w-10 h-10 text-minimal-white hover:text-[#23b5b5] hover:bg-minimal-cardHover"
        }`}
                >
                  <Icon className="w-6 h-6" />
                </button>
              );
            })} */}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div
        className={`${
          sidebarOpen ? "ml-80" : "ml-0"
        } w-full transition-all duration-300`}
        style={{ marginTop: "0px" }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default UpdatedDashboard;
