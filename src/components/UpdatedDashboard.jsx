import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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

import UserModal from "./UserModal";
// import { useSelector } from "react-redux";
import MainSidebar from "./MainSidebar";
import ProfileSettingsModal from "./subLayoutComponents/ProfileSettingsModal";
import { useAuth } from "../context/AuthContext";

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
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState("");
  const [showContent, setShowContent] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  // const user = useSelector((state) => state.user);
  const { auth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!auth) {
      navigate("/login");
    }
  }, [auth]);

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

  // ---------------- JSX ----------------
  return (
    <div className="min-h-screen bg-black flex flex-col overflow-hidden">
      {/* Header / Navbar */}

      {/* CONTENT */}
      <div>
        <MainSidebar
          isProfileSettingsOpen={isProfileSettingsOpen}
          setIsProfileSettingsOpen={setIsProfileSettingsOpen}
        />
        {/* MAIN CONTENT SLOT */}
        <Outlet />
      </div>

      {/* Render the ProfileSettingsModal at top-level so it centers correctly */}
      <ProfileSettingsModal
        isOpen={isProfileSettingsOpen}
        onClose={() => setIsProfileSettingsOpen(false)}
      />
    </div>
  );
};

export default UpdatedDashboard;
