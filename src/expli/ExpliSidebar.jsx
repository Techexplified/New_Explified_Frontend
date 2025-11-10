// Sidebar.jsx
import React, { useState } from "react";
import SidebarItem from "../ai-fiesta/SidebarItem";
import ChatHistoryPopover from "./ChatHistoryPopover";
import ToolsPopover from "../ai-fiesta/ToolsPopover";
import {
  FaPlus,
  FaRegCommentDots,
  FaRegFileAlt,
  FaTools,
} from "react-icons/fa";
import ExpliIntegration from "./ExpliIntegration";
import { useNavigate } from "react-router-dom";
import SettingsModal from "./SettingsModal";
import { ExpliLogo } from "../assets";
import SettingsPortal from "./SettingsPortal";
import { CircleUserRound, LayoutDashboard } from "lucide-react";
import ProfileSettingsModal from "../components/subLayoutComponents/ProfileSettingsModal";
import { useExpli } from "../context/ExpliContext";

export default function ExpliSidebar({
  activeSection,
  setActiveSection,
  isMobileOpen,
  setIsMobileOpen,
}) {
  const { newChat } = useExpli();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const sidebarItems = [
    // {
    //   icon: LayoutDashboard,
    //   label: "Dashboard",
    //   section: "dashboard",
    //   url: "/",
    // },
    {
      icon: FaRegFileAlt,
      label: "Discover",
      section: "discover",
      url: "discover",
    },
  ];

  const [showHistory, setShowHistory] = React.useState(false);
  const [showTools, setShowTools] = React.useState(false);

  return (
    <>
      {/* Overlay (mobile only) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 h-full
          z-50
          w-16 lg:w-16
          flex flex-col justify-between py-2
          bg-black text-white border-r border-gray-900 shadow-inner
          transition-transform duration-300
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="flex flex-col items-center gap-3">
          <button
            className="lg:hidden  text-gray-300 text-xl"
            onClick={() => setIsMobileOpen(false)}
          >
            ✕
          </button>
          {/* Logo */}
          <img className="h-14 " alt="Logo" src={ExpliLogo} />

          {/* New Chat + history */}
          {/* New Chat and Chat History buttons */}
          <div className="flex flex-col items-center gap-2 relative">
            {/* ➕ New Chat button */}
            <button
              onClick={() => {
                navigate("/expli");
                newChat();
              }}
              className="w-10 h-10 mb-2 rounded-full flex items-center justify-center bg-[#1b1b1b] text-gray-200 hover:text-white border border-gray-800 hover:border-[#23b5b5]/30 shadow"
              title="New Chat"
            >
              <FaPlus size={18} />
            </button>

            {/* 💬 Chat History modal trigger */}
            <button
              onClick={() => setShowHistory(true)}
              className="flex flex-col items-center w-full py-2 hover:bg-[#1a1a1a] rounded-xl 
      transition relative group
       hover:text-[#23b5b5] text-gray-400"
              title="Chat History"
            >
              <FaRegCommentDots size={20} />
              <span
                className={`text-[11px] mt-1 font-semibold text-[#23b5b5]"
                    : "text-gray-500 group-hover:text-[#23b5b5]`}
              >
                Chats
              </span>
            </button>
          </div>

          {/* main nav */}
          <div className="space-y-2 ">
            {sidebarItems.map((it) => (
              <SidebarItem
                key={it.section}
                icon={it.icon}
                label={it.label}
                active={activeSection === it.section}
                onClick={() => {
                  navigate(it.url);
                  setIsMobileOpen(false); // auto close on navigation (optional)
                }}
              />
            ))}

            <ExpliIntegration />
          </div>

          {/* tools popover */}
          <div
            className="relative mt-3"
            onMouseEnter={() => setShowTools(true)}
            onMouseLeave={() => setShowTools(false)}
          >
            <div className="group">
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#141414] to-[#1b1b1b] text-gray-200 border border-[#222] hover:text-white shadow">
                <FaTools size={18} />
              </button>
              <span className="sr-only">Tools</span>
            </div>

            <ToolsPopover visible={showTools} />
          </div>
        </div>

        {/* account */}
        <div>
          {/* <div className="flex flex-col items-center gap-4 mb-2">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1b1b1b] border border-gray-700 text-gray-300 hover:text-white"
              onClick={() => setSettingsOpen(true)}
            >
              <span className="font-bold text-lg">G</span>
            </button>
            <span className="text-[11px] text-gray-400">Account</span>

            <SettingsPortal
              open={settingsOpen}
              onClose={() => setSettingsOpen(false)}
            />
          </div> */}

          <div className="flex flex-col items-center pb-4">
            <button
              onClick={() => setIsProfileSettingsOpen(true)}
              className="flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-gray-300 hover:text-[#23b5b5] hover:bg-minimal-cardHover/50 transition-all"
            >
              <CircleUserRound className="w-5 h-5" />
              <span className="text-[11px] font-medium">Profile</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 🪟 Chat History Modal */}
      <ChatHistoryPopover
        visible={showHistory}
        onClose={() => setShowHistory(false)}
      />

      <ProfileSettingsModal
        isOpen={isProfileSettingsOpen}
        onClose={() => setIsProfileSettingsOpen(false)}
      />
    </>
  );
}
