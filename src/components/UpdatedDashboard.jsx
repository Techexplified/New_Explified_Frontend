import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

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
  Plus,
  SectionIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logos/explified_logo.png";
import UserModal from "./UserModal";
import { BsLayoutSidebar } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { MdAttachMoney, MdOutlineCardTravel } from "react-icons/md";
import { IoBookOutline } from "react-icons/io5";

const UpdatedDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const [selectedTool, setSelectedTool] = useState(null);
  const [showContent, setShowContent] = useState(true);
  // Navbar show/hide on scroll
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showUserModal, setShowUserModal] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

function PlusClick() {
  const newIsDrawerOpen = !isDrawerOpen;
  setIsDrawerOpen(newIsDrawerOpen);

  // Pass updated drawer state via navigation state
  navigate("/lurphchat", {
    state: {
      isDrawerOpen: newIsDrawerOpen,
      firstClick: true,
      key: Date.now(), // force rerender of component
    },
  });
}




  const navigate = useNavigate();
  const location = useLocation();

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

  // Set selectedTool based on URL
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
      // For other routes, don't set any tool as selected
      setSelectedTool(null);
    }
  }, [location.pathname]);

  // Set activeNav based on URL ending with "/itemname"
  useEffect(() => {
    const pathname = location.pathname;

    // Check if URL ends with "/itemname" pattern
    const navItems = ["Lurph"]; // Add more items here if needed

    for (const item of navItems) {
      const itemPath = `/${item.toLowerCase()}`;
      if (pathname.endsWith(itemPath)) {
        setActiveNav(item);
        return;
      }
    }

    // If no match found, clear activeNav
    setActiveNav("");
  }, [location.pathname]);

  // const navItems = [{ name: "Lurph", icon: BotMessageSquare }];

  const tools = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      description: "Shows key metrics",
    },
    // {
    //   name: "Socials",
    //   icon: BoomBox,
    //   description: "Connects your social accounts",
    // },
    {
      name: "Workflows",
      icon: Workflow,
      description: "Automates task sequences",
    },
  ];

  const aiTools = [
    {
      name: "Integrations",
      icon: Zap,
      route: "/integrations",
    },
    {
      name: "Socials",
      icon: BoomBox,
      route: "/socials",
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
      route: "/video-meme-generator",
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
          name: "Integrations",
          icon: Zap,
          route: "/integrations",
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
          route: "/video-meme-generator",
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
const [recentQueries, setRecentQueries] = useState(() => {
  const stored = localStorage.getItem("recentPrompts");
  return stored ? [stored] : [];
});

  return (
    <div className="min-h-screen bg-gradient-to-br from-minimal-background via-minimal-dark-100 to-minimal-dark-200 flex flex-col overflow-hidden">
      <UserModal
        showUserModal={showUserModal}
        setShowUserModal={setShowUserModal}
      />
      {/* Top Navigation Bar */}
      <header
        className={`bg-minimal-dark-100/50 h-[70px] backdrop-blur-sm border-b border-minimal-border/50 px-8 py-4 transition-transform duration-300 z-50 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        } fixed top-0 left-0 w-full`}
      >
        <div className="flex items-center justify-between">
          {/* logo */}
          <div className="logo flex items-center justify-center gap-1">
            <Link to="https://explified.com/">
              <img className="w-6" src={logo} alt="Explified" />
            </Link>
            <h2 className="text-xl font-bold text-minimal-white">
              <Link to="https://explified.com/" className="cursor-pointer">
                Explified
              </Link>
            </h2>
            {/* sidebar toggle */}
            <span
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="px-2 cursor-pointer group relative"
            >
              {/* Enhanced background glow */}
              <div className="absolute inset-0 bg-cyan-400/30 rounded-lg scale-100 transition-transform duration-300 ease-out shadow-lg shadow-cyan-400/40"></div>

              {/* Pulsing ring effect - more prominent */}
              <div className="absolute inset-0 rounded-lg border-2 border-cyan-400/50 opacity-100 transition-opacity duration-700 animate-ping"></div>

              {/* Main icon - brighter */}
              <BsLayoutSidebar
                size={20}
                className={`text-cyan-300 transition-all duration-300 ease-out relative z-10 ${
                  sidebarOpen ? "rotate-180" : "rotate-0"
                }`}
              />

              {/* Enhanced glow effect */}
              <div className="absolute inset-0 bg-cyan-400/20 rounded-lg opacity-100 transition-opacity duration-300 blur-sm"></div>

              {/* Energy waves - more visible */}
              <div
                className="absolute inset-0 rounded-lg border-2 border-cyan-400/40 opacity-100 transition-opacity duration-1000 animate-ping"
                style={{ animationDuration: "2s" }}
              ></div>

              {/* Additional pulsing ring for extra visibility */}
              <div
                className="absolute inset-0 rounded-lg border border-cyan-400/70 opacity-100 transition-opacity duration-1500 animate-ping"
                style={{ animationDuration: "1.5s" }}
              ></div>
            </span>
          </div>

          {/* user profile */}
          <div className=" flex items-center justify-center gap-2">
            {/* {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveNav(item.name);
                    navigate(`/${item.name.toLowerCase()}`);
                  }}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeNav === item.name
                      ? "bg-minimal-primary/20 text-minimal-primary border border-minimal-primary/30"
                      : "text-minimal-white hover:text-minimal-primary hover:bg-minimal-cardHover border-none"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })} */}
            <CircleUserRound
              onClick={() => setShowUserModal(true)}
              className="hover:scale-105 transition-all duration-200 cursor-pointer text-minimal-white hover:text-minimal-primary"
            />
          </div>
        </div>
      </header>
      {/* Main Content with Sidebar */}
      <div className="flex-1 flex ">
        {/* Sidebar */}
        <div
          className={`z-[99999] flex-shrink-0 sidebar-transition transition-all duration-300 ease-in-out ${
            sidebarOpen ? "w-80" : "w-0"
          } fixed left-0 ${
            showNavbar ? "h-[calc(100vh-70px)] top-[70px]" : "h-screen top-0"
          } ${sidebarOpen ? "" : "overflow-hidden"}`}
        >
          <div className="h-full bg-minimal-dark-100/50 backdrop-blur-lg border-r border-minimal-border/50 p-4 flex flex-col">
            {/* Tools */}
            <div className="flex-1">
              {sidebarOpen && (
                <div
                  onClick={PlusClick}
                  className="flex font-thin justify-center px-2 py-3 rounded-xl cursor-pointer hover:text-cyan-400 hover:border hover:border-cyan-500/30"
                >
                  <Plus />
                </div>
              )}

              {sidebarOpen && (
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
                        className={`w-full flex items-center justify-start px-4 py-3 rounded-xl transition-all duration-200 ${
                          selectedTool === tool.name
                            ? "bg-minimal-primary/20 text-minimal-primary border border-minimal-primary/30"
                            : "text-minimal-white hover:text-minimal-primary hover:bg-minimal-cardHover border-none"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {showContent && (
                          <div className="ml-3 text-left opacity-0 animate-fade-in">
                            <div className="font-medium text-sm">
                              {tool.name}
                            </div>
                            <div className="text-xs text-minimal-white opacity-70">
                              {tool.description}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Accordions */}
              {sidebarOpen && (
                <div className="mb-5">
                  {accordionSections.map((section) => {
                    const SectionIcon = section.icon;
                    // const isExpanded = expandedAccordions[section.id];

                    return (
                      <div key={section.id}>
                        {/* Accordion Header */}
                        <button
                          onClick={ToolsClick}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-minimal-white hover:text-minimal-primary hover:bg-minimal-cardHover"
                        >
                          <div className="flex items-center">
                            <SectionIcon className="w-5 h-5" />
                            <span className="ml-3 font-medium text-sm">
                              {section.title}
                            </span>
                          </div>
                          {/* {sidebarOpen && (
                             <ChevronDown
                               className={`w-4 h-4 transition-transform duration-200 ${
                                 isExpanded ? "rotate-180" : ""
                               }`}
                             />
                           )} */}
                        </button>

                        {/* Accordion Content */}
                        {/* {sidebarOpen && (
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
                                     className="w-full flex items-center justify-start px-3 py-2 rounded-lg transition-all duration-200 text-minimal-white hover:text-minimal-primary hover:bg-minimal-cardHover"
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
                       )} */}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {sidebarOpen && (
              <div className="mt-auto pt-4 border-t border-minimal-border/50">
                <div className="mb-3">
                  <button
                    onClick={() => {
                      setSelectedTool(
                        selectedTool === "Favorites" ? null : "Favorites"
                      );
                      navigate("/favorites");
                    }}
                    className={`w-full flex items-center justify-start px-4 py-3 rounded-xl transition-all duration-200 ${
                      selectedTool === "Favorites"
                        ? "bg-minimal-primary/20 text-minimal-primary border border-minimal-primary/30"
                        : "text-minimal-white hover:text-minimal-primary hover:bg-minimal-cardHover border-none"
                    }`}
                  >
                    <Star className="w-5 h-5" />
                    {showContent && (
                      <div className="ml-3 text-left opacity-0 animate-fade-in">
                        <div className="font-medium text-sm">Favorites</div>
                        <div className="text-xs text-minimal-white opacity-70">
                          Your favorite tools
                        </div>
                      </div>
                    )}
                  </button>
                </div>
                {/* Credits Section */}
                <div className={`${sidebarOpen ? "block" : "hidden"}`}>
                  <div className="bg-minimal-card rounded-lg p-3 border border-minimal-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-minimal-white text-sm font-medium">
                          {userCredits.plan}
                        </span>
                      </div>
                      <span className="text-minimal-white text-sm font-semibold">
                        {userCredits.remaining}
                      </span>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-minimal-muted mb-1">
                        <span>Credits left</span>
                        <span>
                          {userCredits.remaining}/{userCredits.total}
                        </span>
                      </div>
                      <div className="w-full bg-minimal-gray-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            creditsPercentage > 50
                              ? "bg-gradient-to-r from-minimal-gray-400 to-minimal-gray-300"
                              : creditsPercentage > 20
                              ? "bg-gradient-to-r from-minimal-gray-500 to-minimal-gray-400"
                              : "bg-gradient-to-r from-minimal-gray-600 to-minimal-gray-500"
                          }`}
                          style={{ width: `${creditsPercentage}%` }}
                        />
                      </div>
                    </div>
                    <button className="w-full text-xs text-minimal-primary hover:text-minimal-primary/80 transition-colors duration-200">
                      Upgrade Plan
                    </button>
                  </div>
                </div>
                <div
                  className={`${
                    sidebarOpen && showContent ? "block" : "hidden"
                  } text-center opacity-0 animate-fade-in mt-2`}
                >
                  <div className="text-minimal-muted text-xs">
                    Explified.com
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {isDrawerOpen && (
  <div
    className={`w-60 z-[9999] absolute h-full top-[70px] ${
      sidebarOpen ? "ml-80" : "ml-20"
    } bg-gray-900 text-white p-4 space-y-6 transition-all duration-300`}
  >
    {/* Home Section */}

    {/* Divider */}

    {/* Recent & Other Chats */}
   <div className="space-y-3">
  <div className="bg-gray-600 rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-gray-500">
    Recent
  </div>

  {recentQueries.length > 0 &&
    [...new Map(
      JSON.parse(recentQueries[0]).map(q => [q.toLowerCase(), q])
    ).values()].map((query, index) => (
      <div
        key={index}
        className="bg-gray-600 rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-gray-500"
      >
        {query}
      </div>
    ))}
</div>

  </div>
)}


        {/* Main Content Area */}
        <div
          className={`${
            sidebarOpen ? "ml-80" : "ml-0"
          } w-full transition-all duration-300`}
          style={{ marginTop: "70px" }}
        >
          <Outlet />
        </div>
      </div>

      {/* Drawer Component */}
    </div>
  );
};

export default UpdatedDashboard;
