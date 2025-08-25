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
  TvMinimalPlay,
  Users,
} from "lucide-react";

import logo from "../assets/logos/explified_logo.png";
import UserModal from "./UserModal";

// ---------------- FILTER ITEMS ----------------
const navItems = [
  { name: "Search", icon: Search, active: true, badge: null },
  { name: "Recent", icon: null, active: false, badge: null },
  { name: "Start", icon: null, active: false, badge: null },
  { name: "All Apps", icon: null, active: false, badge: null },
  { name: "Workflows", icon: null, active: false, badge: null },
  { name: "Integrations", icon: null, active: false, badge: null },
];

// ---------------- FILTER BAR ----------------
const NavBarSection = ({ selectedTool, onNavClick }) => (
  <div className="flex gap-4 items-center flex-nowrap w-auto py-2 px-6 bg-transparent">
    {navItems.map((item) => (
      <div key={item.name} className="flex flex-col items-center relative">
        <button
          type="button"
          onClick={() => onNavClick(item.name)}
          className={
            selectedTool === item.name || item.active
              ? "flex items-center justify-center bg-[#23b5b5] text-white min-w-[100px] h-8 px-4 rounded-[22px] border border-[#7ce4de] text-base font-semibold"
              : "flex items-center justify-center bg-transparent text-white min-w-[100px] h-8 px-4 rounded-[22px] border border-[#7ce4de] text-base hover:bg-[#7c8e91]/60"
          }
        >
          {item.name === "Search" && item.icon ? (
            <Search className="w-5 h-5" />
          ) : (
            <span>{item.name}</span>
          )}
        </button>
      </div>
    ))}
  </div>
);

// ---------------- DASHBOARD ----------------
const UpdatedDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const [selectedTool, setSelectedTool] = useState("");
  const [showContent, setShowContent] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  // const [lastScrollY, setLastScrollY] = useState(0);
  // const [showUserModal, setShowUserModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPlusOpen, setIsPlusOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const tools = [
    { name: "", icon: LayoutDashboard, description: "Shows key metrics" },
    {
      name: "Workflows",
      icon: Workflow,
      description: "Automates task sequences",
    },
  ];

  const plusTools = [{ name: "Files", icon: File, path: "/task-manager" }];

  const aiTools = [
    { name: "Integrations", icon: Zap, path: "/integrations" },
    { name: "Workflows", icon: Workflow, path: "/workflows" },
    { name: "Ai tools", icon: PencilRuler, path: "/aitools" },
  ];

  // ---------------- Handlers ----------------
  function PlusClick() {
    setIsDrawerOpen((prev) => !prev);
    navigate("/expli");
  }

  function ToolsClick(e) {
    e.stopPropagation();
    setIsToolsOpen((prev) => !prev);
  }

  // ---------------- Effects ----------------
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
    if (pathname === "/") setSelectedTool("Dashboard");
    else if (pathname === "/workflows") setSelectedTool("Workflows");
    else if (pathname === "/socials") setSelectedTool("Socials");
    else if (pathname === "/favorites") setSelectedTool("Favorites");
    else if (pathname === "/search") setSelectedTool("Search");
    else if (pathname === "/recent") setSelectedTool("Recent");
    else if (pathname === "/start") setSelectedTool("Start");
    else if (pathname === "/all-apps") setSelectedTool("All Apps");
    else if (pathname === "/integrations") setSelectedTool("Integrations");
    else setSelectedTool("");
  }, [location.pathname]);

  // ---------------- Navbar Hover ----------------
  let timeoutId;
  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setIsOpen(false), 200);
  };

  // ---------------- NavBarClick ----------------
  const handleNavBarClick = (navName) => {
    setSelectedTool(navName);
    if (navName === "Start") navigate("/");
    else if (navName === "Search") navigate("/");
    else if (navName === "Recent") navigate("/");
    else if (navName === "All Apps") navigate("/");
    else if (navName === "Workflows") navigate("/workflows");
    else if (navName === "Integrations") navigate("/integrations");
  };

  // ---------------- JSX ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-minimal-background via-minimal-dark-100 to-minimal-dark-200 flex flex-col overflow-hidden">
      {/* Header / Navbar */}
      <header
        className={`fixed border-minimal-border/50 px-6 transition-transform duration-300 z-50 top-0 left-0 w-full
          ${showNavbar ? "translate-y-0" : "-translate-y-full"}
        `}
        style={{ minHeight: "56px", background: "transparent" }}
      >
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center gap-2 pt-1 ml-auto">
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
                    location.pathname === "/expli"
                      ? "w-14 h-14 scale-110 text-[#23b5b5] bg-minimal-primary/20 border border-[#23b5b5]/30"
                      : "w-10 h-10 text-minimal-white hover:text-[#23b5b5] hover:bg-minimal-cardHover"
                  }`}
              >
                <Plus
                  className={
                    location.pathname === "/expli" ? "w-6 h-6" : "w-5 h-5"
                  }
                />
              </button>
            </div>

            {/* Profile Dropdown */}
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
                  {/* Dropdown content */}
                  <div className="mb-4">
                    <Link
                      className="text-white text-sm font-semibold mb-2 border border-gray-700 rounded-lg px-4 py-2 hover:text-[#23b5b5]"
                      to={"https://explified.com/explified-labs"}
                    >
                      For Enterprises
                    </Link>

                    {/* Tools Quick Buttons */}
                    <div className="flex gap-3 mt-2 flex-col">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            navigate("/expli");
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

                  {/* Workflows Section */}
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
                  </div>

                  {/* All Tools Section */}
                  <div className="mb-2 flex-col items-center justify-center">
                    <h3 className="text-white text-sm font-semibold mb-2">
                      All Tools
                    </h3>
                    <button
                      type="button"
                      className="flex items-center justify-center w-14 h-14 rounded-xl text-white hover:bg-minimal-primary"
                      onClick={() => navigate("/alltools")}
                    >
                      <Grip className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div
        className={`${
          sidebarOpen ? "ml-80" : "ml-0"
        } w-full transition-all duration-300`}
      >
        {/* FILTER BAR */}

        {/* MAIN CONTENT SLOT */}

        <Outlet />
      </div>
    </div>
  );
};

export default UpdatedDashboard;