import { useState, useEffect } from "react";

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
} from "lucide-react";

import logo from "../assets/logos/explified_logo.png";

const UpdatedDashboard = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");
  const [selectedTool, setSelectedTool] = useState(null);
  const [showContent, setShowContent] = useState(true);
  // Navbar show/hide on scroll
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

    { name: "Integration", icon: Zap },
  ];

  const tools = [
    {
      name: "Dashboard",

      icon: LayoutDashboard,

      description: "Shows key metrics",
    },

    {
      name: "Tools",

      icon: PencilRuler,

      description: "Provides helpful utilities",
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

    {
      name: "Chats",

      icon: MessageSquareQuote,

      description: "Facilitates live conversations",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header
        className={`bg-gray-800/50 h-[70px] backdrop-blur-sm border-b border-gray-700/50 px-8 py-4 transition-transform duration-300 z-50 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        } fixed top-0 left-0 w-full`}
      >
        <div className="flex items-center justify-between">
          <div className="logo flex items-center justify-center gap-1">
            <img className="w-6" src={logo} alt="Explified" />
            <h2 className="text-xl pb- font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Explified
            </h2>
          </div>
          {/* Navigation Items */}
          <div className="flex gap-3 space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveNav(item.name)}
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
          {/* Removed menu button for sidebar toggle */}
          <div className="hover:scale-105 transition-all duration-200 cursor-pointer text-cyan-500">
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
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.name}
                      onClick={() =>
                        setSelectedTool(
                          selectedTool === tool.name ? null : tool.name
                        )
                      }
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
            </div>
            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-gray-700/50">
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
                } text-center opacity-0 animate-fade-in`}
              >
                <div className="text-gray-400 text-xs">Explified.com</div>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content Area */}
        <div className={`ml-20 w-full`} style={{ marginTop: "70px" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default UpdatedDashboard;
