import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  Zap,
  LayoutDashboard,
  PencilRuler,
  Workflow,
  CircleUserRound,
  Plus,
  Grip,
  File,
  FileText,
  Search,
  LucideClipboardPen,
} from "lucide-react";
import { LuClipboardPen } from "react-icons/lu";
import Trone from "../components1/Trone";
import ExpliIntegration from "./ExpliIntegration";

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
const ExpliDashboard = () => {
  const [selectedTool, setSelectedTool] = useState("");
  const [showNavbar, setShowNavbar] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [providerKeys, setProviderKeys] = useState(() => {
    try {
      const raw = localStorage.getItem("provider_keys");
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.log(e);
      return {};
    }
  });

  const navigate = useNavigate();
  const location = useLocation();

  // ---------------- Handlers ----------------

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

  // ---------------- JSX ----------------
  return (
    <div className="min-h-screen bg-red-400 flex flex-col overflow-hidden">
      {/* Header / Navbar */}
      <header
        className={`fixed border-minimal-border/50 px-6 transition-transform duration-300 z-50 top-0 left-0 w-full
          ${showNavbar ? "translate-y-0" : "-translate-y-full"}
        `}
        style={{ minHeight: "56px", background: "transparent" }}
      >
        <div className="flex items-center justify-between w-full">
          <div
            className={`flex items-center justify-between gap-2 pt-1 transition-all duration-300 ${
              isSidebarOpen || sidebarPinned ? "ml-60" : "ml-12 sm:ml-0"
            }`}
          >
            <ExpliIntegration
              setShowIntegrationsModal={setShowIntegrationsModal}
              isSidebarOpen={isSidebarOpen}
              sidebarPinned={sidebarPinned}
            />
          </div>
          <div className="flex items-center gap-2 pt-1 ">
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
                  className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 transform
                  ${
                    location.pathname === `/${tool.name.toLowerCase()}`
                      ? "w-10 h-10 scale-110 text-[#23b5b5] bg-minimal-primary/20 border border-[#23b5b5]/30"
                      : "w-10 h-10 text-minimal-white hover:text-[#23b5b5] hover:bg-minimal-cardHover"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </button>
              );
            })()}

            {/* Plus Icon */}
            <div className="relative">
              <button
                onClick={() => navigate("/expli")}
                className={`flex items-center justify-center rounded-xl transition-all duration-200 transform
                  ${
                    location.pathname === "/expli"
                      ? "w-12 h-12 scale-110 text-[#23b5b5] bg-minimal-primary/20 border border-[#23b5b5]/30"
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

            {/* Notes Icon */}
            <div className="relative sm:hidden">
              <button
                onClick={() => navigate("/notes")}
                className={`flex items-center justify-center rounded-xl transition-all duration-200 transform
                  ${
                    location.pathname === "/notes"
                      ? "w-12 h-12 scale-110 text-[#23b5b5] bg-minimal-primary/20 border border-[#23b5b5]/30"
                      : "w-10 h-10 text-minimal-white hover:text-[#23b5b5] hover:bg-minimal-cardHover"
                  }`}
              >
                <LucideClipboardPen className="w-6 h-6" />
              </button>
            </div>

            {/* Profile Dropdown */}
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative hidden sm:inline-block"
            >
              <button
                onClick={() => navigate("/profile")}
                className={`flex items-center justify-center 
              w-10 h-10 rounded-xl transition-all duration-200 transform
              ${
                location.pathname === "/profile"
                  ? "scale-110 text-[#23b5b5] bg-minimal-primary/20 border border-[#23b5b5]/40"
                  : "text-minimal-white hover:text-[#23b5b5] hover:bg-minimal-cardHover"
              }`}
              >
                <CircleUserRound className="w-6 h-6" />
              </button>

              {isOpen && (
                <div
                  className="absolute right-0 top-12 min-w-[220px]
                 bg-gradient-to-br from-[#0d1418] to-[#111c20] 
                 backdrop-blur-xl border border-[#23b5b5]/40 rounded-xl shadow-lg
                 p-4 flex flex-col items-center z-50
                 transform transition-all duration-300 ease-out
                 animate-in fade-in-20 scale-in-95"
                >
                  <Link
                    className="w-full h-9 mb-3 rounded-lg border border-[#23b5b5]/40 text-sm font-medium text-white
                   bg-transparent hover:bg-[#23b5b5]/15 hover:border-[#23b5b5] 
                   hover:shadow-md hover:shadow-cyan-500/20 transition-all duration-200 flex items-center justify-center"
                    to="https://explified.com/explified-labs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    For Enterprises
                  </Link>

                  <div className="flex gap-2 w-full mb-3">
                    {[
                      { icon: Plus, to: "/expli" },
                      { icon: FileText, to: "/tasks" },
                    ].map(({ icon: Icon, to }, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          navigate(to);
                          setIsOpen(false);
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
                            navigate(to);
                            setIsOpen(false);
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
                            navigate(to);
                            setIsOpen(false);
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

                  <div className="w-full mb-1">
                    <h3 className="text-white text-xs font-semibold opacity-80 mb-2">
                      All Tools
                    </h3>
                    <button
                      onClick={() => navigate("/alltools")}
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
        </div>
      </header>

      {/* CONTENT */}
      <div className={` w-full transition-all duration-300`}>
        {/* FILTER BAR */}

        {/* MAIN CONTENT SLOT */}

        <Trone
          providerKeys={providerKeys}
          setProviderKeys={setProviderKeys}
          showIntegrationsModal={showIntegrationsModal}
          setShowIntegrationsModal={setShowIntegrationsModal}
          isSidebarOpen={isSidebarOpen}
          sidebarPinned={sidebarPinned}
          setIsSidebarOpen={setIsSidebarOpen}
          setSidebarPinned={setSidebarPinned}
        />
      </div>
    </div>
  );
};

export default ExpliDashboard;
