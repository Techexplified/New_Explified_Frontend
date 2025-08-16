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
  FileText,
  ArrowDownUp,
  Search,
  MessageCircleMore,
  Database,
  TvMinimalPlay
} from "lucide-react";
import logo from "../assets/logos/explified_logo.png";
import UserModal from "./UserModal";

const navItems = [
  { name: "Search", icon: Search, active: true, badge: null },
  { name: "Recent", icon: null, active: false, badge: null },
  { name: "Start", icon: null, active: false, badge: null },
  { name: "All Apps", icon: null, active: false, badge: null },
  { name: "Workflows", icon: null, active: false, badge: null },
  { name: "Integrations", icon: null, active: false, badge: null }
];

const NavBarSection = ({ selectedTool, onNavClick }) => (
  <div className="flex gap-4 items-center flex-nowrap w-auto pt-4 pb-2">
    {navItems.map((item) => (
      <div key={item.name} className="flex flex-col items-center relative">
        <button
          type="button"
          onClick={() => onNavClick(item.name)}
          className={
            selectedTool === item.name || item.active
              ? "flex items-center justify-center bg-[#7c8e91] text-white min-w-[100px] h-9 px-4 rounded-[22px] border border-[#7ce4de] text-base font-semibold"
              : "flex items-center justify-center bg-transparent text-white min-w-[100px] h-9 px-4 rounded-[22px] border border-[#7ce4de] text-base hover:bg-[#7c8e91]/60"
          }
        >
          {item.name === "Search" && item.icon ? (
            <Search className="w-6 h-6" />
          ) : (
            <span>{item.name}</span>
          )}
        </button>
        {item.badge && (
          <span className="bg-[#7ce4de] text-[#263238] px-4 py-2 rounded-md text-base font-semibold mt-2 absolute top-[38px] left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            {item.badge}
          </span>
        )}
      </div>
    ))}
  </div>
);

const UpdatedDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const [selectedTool, setSelectedTool] = useState("");
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

  const tools = [
    { name: "", icon: LayoutDashboard, description: "Shows key metrics" },
    { name: "Workflows", icon: Workflow, description: "Automates task sequences" },
  ];
  const plusTools = [{ name: "Files", icon: File, path: "/task-manager" }];
  const aiTools = [
    { name: "Integrations", icon: Zap, path: "/integrations" },
    { name: "Workflows", icon: Workflow, path: "/workflows" },
    { name: "Ai tools", icon: PencilRuler, path: "/aitools" },
  ];

  function PlusClick() {
    setIsDrawerOpen((prev) => !prev);
    navigate("/chat");
  }
  function ToolsClick(e) {
    e.stopPropagation();
    setIsToolsOpen((prev) => !prev);
  }

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

  useEffect(() => {
    if (sidebarOpen) {
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [sidebarOpen]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientY <= 450) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
    } else if (pathname === "/search") {
      setSelectedTool("Search");
    } else if (pathname === "/recent") {
      setSelectedTool("Recent");
    } else if (pathname === "/start") {
      setSelectedTool("Start");
    } else if (pathname === "/all-apps") {
      setSelectedTool("All Apps");
    } else if (pathname === "/integrations") {
      setSelectedTool("Integrations");
    } else {
      setSelectedTool("");
    }
  }, [location.pathname]);

  let timeoutId;
  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setIsOpen(false), 200);
  };

  const handleNavBarClick = (navName) => {
    setSelectedTool(navName);
    if (navName === "Start") navigate("/start");
    else if (navName === "Search") navigate("/search");
    else if (navName === "Recent") navigate("/recent");
    else if (navName === "All Apps") navigate("/all-apps");
    else if (navName === "Workflows") navigate("/workflows");
    else if (navName === "Integrations") navigate("/integrations");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-minimal-background via-minimal-dark-100 to-minimal-dark-200 flex flex-col overflow-hidden">
      <header
        className={`fixed bg-trnsparent border-minimal-border/50 px-6 transition-transform duration-300 z-50 top-0 left-0 w-full
          ${showNavbar ? "translate-y-0" : "-translate-y-full"}
        `}
        style={{ minHeight: "82px" }}
      >
        <div className="flex items-start justify-between w-full">
          {/* Navbar left */}
          <NavBarSection selectedTool={selectedTool} onNavClick={handleNavBarClick} />
          {/* Action buttons right (original styling preserved) */}
          <div className="flex items-center gap-2 pt-1">
            {/* Grid Icon */}
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
            {/* Plus Icon */}
            <div
              className="relative"
              onMouseEnter={() => setIsPlusOpen(true)}
              onMouseLeave={() => setIsPlusOpen(false)}
            >
              <button
                onClick={PlusClick}
                className={`flex items-center justify-center rounded-xl transition-all duration-200 transform
                  ${
                    location.pathname === "/chat"
                      ? "w-14 h-14 scale-110 text-[#23b5b5] bg-minimal-primary/20 border border-[#23b5b5]/30"
                      : "w-10 h-10 text-minimal-white hover:text-[#23b5b5] hover:bg-minimal-cardHover"
                  }`}
              >
                <Plus
                  className={
                    location.pathname === "/chat" ? "w-6 h-6" : "w-5 h-5"
                  }
                />
              </button>
            </div>
            {/* Profile */}
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative inline-block"
            >
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 text-minimal-white hover:text-minimal-primary hover:bg-minimal-cardHover"
              >
                <CircleUserRound className="w-5 h-5" />
              </button>
              {isOpen && (
                <div className="absolute left-[-130px] top-14 bg-minimal-card p-4 rounded-xl shadow-lg border border-gray-700 z-5000000 min-w-[200px] flex flex-col items-center">
                  {/* Dropdown content unchanged */}
                  <div className="mb-4">
                    <button
                      className="text-white text-sm font-semibold mb-2 border border-gray-700 rounded-lg px-4 py-2 hover:text-[#23b5b5]"
                      onClick={() => navigate("/profile")}
                    >
                      View My Profile
                    </button>
                    <div className="flex gap-3 flex-col">
                      {/* More profile controls */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            navigate("/chat");
                            setIsOpen(false);
                          }}
                          className="w-10 h-10 bg-minimal-dark-100 rounded-md flex items-center justify-center hover:bg-minimal-primary transition-colors"
                        >
                          <Plus className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => {
                            navigate("/tasks");
                            setIsOpen(false);
                          }}
                          className="w-10 h-10 bg-minimal-dark-100 rounded-md flex items-center justify-center hover:bg-minimal-primary transition-colors"
                        >
                          <FileText className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => {
                            navigate("/integrations");
                            setIsOpen(false);
                          }}
                          className="w-10 h-10 bg-minimal-dark-100 rounded-md flex items-center justify-center hover:bg-minimal-primary transition-colors"
                        >
                          <Zap className="w-5 h-5 text-white" />
                        </button>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            navigate("/memory");
                            setIsOpen(false);
                          }}
                          className="w-10 h-10 bg-minimal-dark-100 rounded-md flex items-center justify-center hover:bg-minimal-primary transition-colors"
                        >
                          <Database className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => {
                            navigate("/socials");
                            setIsOpen(false);
                          }}
                          className="w-10 h-10 bg-minimal-dark-100 rounded-md flex items-center justify-center hover:bg-minimal-primary transition-colors"
                        >
                          <TvMinimalPlay className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => {
                            navigate("/discover");
                            setIsOpen(false);
                          }}
                          className="w-10 h-10 bg-minimal-dark-100 rounded-md flex items-center justify-center hover:bg-minimal-primary transition-colors"
                        >
                          <Search className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4 flex flex-col justify-center items-center">
                    <h3 className="text-white text-sm font-semibold mb-2">
                      Workflows
                    </h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          navigate("/workflows");
                          setIsOpen(false);
                        }}
                        className="w-10 h-10 bg-minimal-dark-100 rounded-md flex items-center justify-center hover:bg-minimal-primary transition-colors"
                      >
                        <Workflow className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="mb-2 flex-col items-center justify-center">
                    <h3 className="text-white text-sm font-semibold mb-2">
                      All Tools
                    </h3>
                    <button
                      type="button"
                      className="flex items-center justify-center w-14 h-14 rounded-xl text-white hover:bg-minimal-primary"
                      onClick={() => navigate("/aitools")}
                    >
                      <Grip className="w-6 h-6" />
                    </button>
                  </div>
                  <Link
                    to="https://explified.com/"
                    className="text-white text-sm font-semibold mb-2 hover:text-[#23b5b5]"
                  >
                    To explified.com
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <div
        className={`${
          sidebarOpen ? "ml-80" : "ml-0"
        } w-full transition-all duration-300`}
        style={{ marginTop: "115px" }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default UpdatedDashboard;
