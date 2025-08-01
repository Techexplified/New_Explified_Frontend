import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

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
  ChevronDown,
  BrainCircuit,
  Youtube,
  Captions,
  Linkedin,
  Video,
  ImagePlay,
  SquarePercent,
  BotMessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logos/explified_logo.png";
import UserModal from "./UserModal";

const UpdatedDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");
  const [selectedTool, setSelectedTool] = useState(null);
  const [showContent, setShowContent] = useState(true);
  // Navbar show/hide on scroll
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showUserModal, setShowUserModal] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState({});

  const navigate = useNavigate();

  const userCredits = {
    remaining: 245,
    total: 500,
    plan: "Pro Plan",
  };

  const creditsPercentage = (userCredits.remaining / userCredits.total) * 100;

  useEffect(() => {
    if (sidebarOpen) {
      // Delay content appearance until sidebar opens
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } else {
      // Hide content immediately when closing
      setShowContent(false);
    }
  }, [sidebarOpen]);

  // Navbar hide/show logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false); // scrolling down, hide navbar
      } else {
        setShowNavbar(true); // scrolling up, show navbar
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { name: "Home", icon: Home },
    { name: "History", icon: History },
    { name: "Integrations", icon: Zap },
    { name: "Lurph", icon: BotMessageSquare },
  ];

  const tools = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      description: "Shows key metrics",
    },
    {
      name: "Socials",
      icon: BoomBox,
      description: "Connects your social accounts",
    },
    {
      name: "Workflows",
      icon: Workflow,
      description: "Automates task sequences",
    },
    
  ];

  const accordionSections = [
    {
      id: "Tools",
      title: "Tools",
      icon: PencilRuler,
      items: [
        {
          name: "AI Tools",
          icon: BrainCircuit,
          route: "/aitools",
        },
        {
          name: "Youtube Summarizer",
          icon: Youtube,
          route: "/youtube-summarizer",
        },
        {
          name: "AI Subtitler",
          icon: Captions,
          route: "/ai-subtitler",
        },
        {
          name: "Linkedin Extension",
          icon: Linkedin,
          route: "/linkedin",
        },
        {
          name: "Meme Generator",
          icon: Video,
          route: "/meme",
        },
        {
          name: "Bg Remover",
          icon: ImagePlay,
          route: "/bg-remover",
        },
        {
          name: "Influmark",
          icon: SquarePercent,
          route: "/influmark",
        },
        {
      name: "Chats",
      icon: SquarePercent,
      description: "Lets you chat with others",
    },
      ],
    },
  ];

  const toggleAccordion = (accordionId) => {
    if (!sidebarOpen) return;
    setExpandedAccordions((prev) => ({
      ...prev,
      [accordionId]: !prev[accordionId],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col overflow-hidden">
      <UserModal
        showUserModal={showUserModal}
        setShowUserModal={setShowUserModal}
      />
      {/* Top Navigation Bar */}
      <header
        className={`bg-gray-800/50 h-[70px] backdrop-blur-sm border-b border-gray-700/50 px-8 py-4 transition-transform duration-300 z-50 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        } fixed top-0 left-0 w-full`}
      >
        <div className="flex items-center justify-between">
          <div className="logo flex items-center justify-center gap-1">
  <img className="w-6" src={logo} alt="Explified" />
  <a className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent cursor-pointer" href="https://explified.com/">
    Explified
  </a>
</div>

          {/* Navigation Items */}
          <div className="flex gap-3 space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveNav(item.name);
                    {
                      if (
                        item.name === "Home"
                          ? navigate("/")
                          : navigate(`/${item.name.toLowerCase()}`)
                      );
                    }
                  }}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeNav === item.name
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-gray-400 hover:text-cyan-400 hover:bg-gray-700/30 border-none"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
          {/* user profile */}
          <div
            onClick={() => setShowUserModal(true)}
            className="hover:scale-105 transition-all duration-200 cursor-pointer text-cyan-500"
          >
            <CircleUserRound />
          </div>
        </div>
      </header>
      {/* Main Content with Sidebar */}
      <div className="flex-1 flex ">
        {/* Sidebar */}
        <div
          className={`z-[99999] flex-shrink-0 sidebar-transition transition-all duration-300 ease-in-out ${
            sidebarOpen ? "w-80" : "w-20"
          } fixed left-0 ${
            showNavbar ? "h-[calc(100vh-70px)] top-[70px]" : "h-screen top-0"
          }`}
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
        >
          <div className="h-full bg-gray-800/50 backdrop-blur-lg border-r border-gray-700/50 p-4 flex flex-col">
            {/* Tools */}
            <div className="flex-1">
              <div className="space-y-2">
                {tools.map((tool, idx) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.name}
                      onClick={() => {
                        setSelectedTool(
                          selectedTool === tool.name ? null : tool.name
                        );
                        if (idx === 0) {
                          navigate("/");
                        } else {
                          navigate(`/${tool.name.toLowerCase()}`);
                        }
                      }}
                      className={`w-full flex items-center ${
                        sidebarOpen
                          ? "justify-start px-4"
                          : "justify-center px-2"
                      } py-3 rounded-xl transition-all duration-200 ${
                        selectedTool === tool.name
                          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30"
                          : "text-gray-400 hover:text-cyan-400 hover:bg-gray-700/30 border-none"
                      }`}
                      title={!sidebarOpen ? tool.name : undefined}
                    >
                      <Icon className="w-5 h-5" />
                      {sidebarOpen && showContent && (
                        <div className="ml-3 text-left opacity-0 animate-fade-in">
                          <div className="font-medium text-sm">{tool.name}</div>
                          <div className="text-xs opacity-60">
                            {tool.description}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {/* Accordions */}
              <div className="mb-5">
                {accordionSections.map((section) => {
                  const SectionIcon = section.icon;
                  const isExpanded = expandedAccordions[section.id];

                  return (
                    <div key={section.id}>
                      {/* Accordion Header */}
                      <button
                        onClick={() => toggleAccordion(section.id)}
                        className={`w-full flex items-center ${
                          sidebarOpen
                            ? "justify-between px-4"
                            : "justify-center px-2"
                        } py-3 rounded-xl transition-all duration-200 text-gray-400 hover:text-cyan-400 hover:bg-gray-700/30`}
                        title={!sidebarOpen ? section.title : undefined}
                      >
                        <div className="flex items-center">
                          <SectionIcon className="w-5 h-5" />
                          {sidebarOpen && (
                            <span className="ml-3 font-medium text-sm">
                              {section.title}
                            </span>
                          )}
                        </div>
                        {sidebarOpen && (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      {/* Accordion Content */}
                      {sidebarOpen && (
                        <div
                          className={`overflow-hidden transition-all duration-200 ${
                            isExpanded
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="ml-6 mt-2 space-y-1">
                            {section.items.map((item) => {
                              const ItemIcon = item.icon;
                              return (
                                <button
                                  onClick={() => navigate(item.route)}
                                  key={item.name}
                                  className="w-full flex items-center justify-start px-3 py-2 rounded-lg transition-all duration-200 text-gray-400 hover:text-cyan-400 hover:bg-gray-700/30"
                                >
                                  <ItemIcon className="w-4 h-4" />
                                  <div className="ml-3 text-left">
                                    <div className="font-medium text-xs">
                                      {item.name}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-gray-700/50">
              <div className="mb-3">
                <button
                  onClick={() => {
                    setSelectedTool(
                      selectedTool === "Favorites" ? null : "Favorites"
                    );
                    navigate("/favorites");
                  }}
                  className={`w-full flex items-center ${
                    sidebarOpen ? "justify-start px-4" : "justify-center px-2"
                  } py-3 rounded-xl transition-all duration-200 ${
                    selectedTool === "Favorites"
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-gray-400 hover:text-cyan-400 hover:bg-gray-700/30 border-none"
                  }`}
                  title={!sidebarOpen ? "Favorites" : undefined}
                >
                  <Star className="w-5 h-5" />
                  {sidebarOpen && showContent && (
                    <div className="ml-3 text-left opacity-0 animate-fade-in">
                      <div className="font-medium text-sm">Favorites</div>
                      <div className="text-xs opacity-60">
                        Your favorite tools
                      </div>
                    </div>
                  )}
                </button>
              </div>
              {/* Credits Section */}
              <div className={`${sidebarOpen ? "block" : "hidden"}`}>
                <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {/* <CreditCard className="w-4 h-4 text-cyan-400" /> */}
                      <span className="text-white text-sm font-medium">
                        {userCredits.plan}
                      </span>
                    </div>
                    <span className="text-cyan-400 text-sm font-semibold">
                      {userCredits.remaining}
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Credits left</span>
                      <span>
                        {userCredits.remaining}/{userCredits.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-600/50 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          creditsPercentage > 50
                            ? "bg-gradient-to-r from-green-500 to-cyan-500"
                            : creditsPercentage > 20
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                            : "bg-gradient-to-r from-red-500 to-pink-500"
                        }`}
                        style={{ width: `${creditsPercentage}%` }}
                      />
                    </div>
                  </div>
                  <button className="w-full text-xs text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
                    Upgrade Plan
                  </button>
                </div>
              </div>
              <div
                className={`${
                  sidebarOpen && showContent ? "block" : "hidden"
                } text-center opacity-0 animate-fade-in mt-2`}
              >
                <div className="text-gray-400 text-xs">Explified.com</div>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content Area */}
        <div className={`ml-20 w-full`} style={{ marginTop: "70px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UpdatedDashboard;
