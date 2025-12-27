// Sidebar.jsx
import React, { useState } from "react";
import SidebarItem from "../ai-fiesta/SidebarItem";
import ChatHistoryPopover from "./ChatHistoryPopover";
import ToolsPopover from "../ai-fiesta/ToolsPopover";
import {
  FaPlus,
  FaRegCommentDots,
  FaRegFileAlt,
  FaPuzzlePiece,
  FaTools,
  FaTag,
} from "react-icons/fa";
import ExpliIntegration from "./ExpliIntegration";
import { useNavigate } from "react-router-dom";
import SettingsModal from "./SettingsModal";
import { ExpliLogo } from "../assets";

export default function ExpliSidebar({ activeSection, setActiveSection }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarItems = [
    { icon: FaRegCommentDots, label: "Home", section: "home", url: "/expli" },
    {
      icon: FaRegFileAlt,
      label: "Discover",
      section: "discover",
      url: "discover",
    },
  ];

  // small local state for popovers could be here (or keep in Sidebar component)
  const [showHistory, setShowHistory] = React.useState(false);
  const [showTools, setShowTools] = React.useState(false);

  return (
    <aside className="relative w-16 flex flex-col justify-between py-4 bg-black text-white border-r border-gray-900 shadow-inner">
      <div className="flex flex-col items-center gap-3">
        {/* Tag / Images icon */}
        <img className="h-10" alt="Logo" src={ExpliLogo} />

        {/* New Chat + history */}
        <div
          className="relative mt-2"
          onMouseEnter={() => setShowHistory(true)}
          onMouseLeave={() => setShowHistory(false)}
        >
          <button
            className="mb-2 w-10 h-10 rounded-full flex items-center justify-center bg-[#1b1b1b] text-gray-200 hover:text-white border border-gray-800 hover:border-[#23b5b5]/30 shadow"
            title="New Chat (Ctrl+T)"
          >
            <FaPlus size={18} />
          </button>

          <ChatHistoryPopover visible={showHistory} />
        </div>

        {/* main nav */}
        <div className="space-y-2 mt-2">
          {sidebarItems.map((it) => (
            <SidebarItem
              key={it.section}
              icon={it.icon}
              label={it.label}
              active={activeSection === it.section}
              onClick={() => navigate(it.url)}
            />
          ))}

          <ExpliIntegration />

          {/* <SidebarItem
            icon={FaPuzzlePiece}
            label="Integrate"
            onClick={() => setModalOpen(true)}
          /> */}
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
      <div>
        <div className="flex flex-col items-center gap-4 mb-2">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1b1b1b] border border-gray-700 text-gray-300 hover:text-white"
            onClick={() => setSettingsOpen(true)}
          >
            <span className="font-bold text-lg">G</span>
          </button>
          <span className="text-[11px] text-gray-400">Account</span>

          <SettingsModal
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
          />
        </div>
      </div>
    </aside>
  );
}
