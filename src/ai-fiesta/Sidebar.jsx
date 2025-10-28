import React, { useState } from "react";
import SidebarItem from "./SidebarItem";
import ChatHistoryPopover from "./ChatHistoryPopover";
import ToolsPopover from "./ToolsPopover";
import {
  FaPlus,
  FaRegCommentDots,
  FaRegFileAlt,
  FaPuzzlePiece,
  FaTools,
  FaImage,
} from "react-icons/fa";

export default function Sidebar({
  setModalOpen,
  setSettingsOpen,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  chats,
}) {
  const [showHistory, setShowHistory] = useState(false);
  const [showTools, setShowTools] = useState(false);

  const sidebarItems = [
    { icon: FaRegCommentDots, label: "Chats", active: true },
    { icon: FaRegFileAlt, label: "Discover" },
  ];

  return (
    <aside className="relative w-16 flex flex-col justify-between py-4 bg-black text-white border-r border-gray-900 shadow-inner">
      {/* Top Section */}
      <div className="flex flex-col items-center gap-3">
        {/* 🖼️ Image Upload Icon */}
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1a1a1a] border border-gray-800 hover:border-[#23b5b5]/50 text-gray-300 hover:text-[#23b5b5] shadow-sm hover:shadow-[0_0_12px_#23b5b540] transition-all duration-300 hover:scale-105"
        >
          <FaImage size={18} />
        </button>

        {/* ➕ New Chat Button */}
        <div
          className="relative mt-7"
          onMouseEnter={() => setShowHistory(true)}
          onMouseLeave={() => setShowHistory(false)}
        >
          <button
            onClick={onNewChat}
            className="mb-2 w-10 h-10 rounded-full flex items-center justify-center bg-[#1f1f1f] hover:bg-[#2a2a2a] text-gray-300 hover:text-white border border-gray-800 hover:border-[#23b5b5]/40 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_#23b5b550]"
          >
            <FaPlus size={18} />
          </button>

          <ChatHistoryPopover
            visible={showHistory}
            chats={chats}
            onSelectChat={onSelectChat}
            onNewChat={onNewChat}
            onDeleteChat={onDeleteChat}
          />
        </div>

        {/* Sidebar Links */}
        {sidebarItems.map((item, i) => (
          <SidebarItem key={i} {...item} onClick={() => {}} />
        ))}

        {/* Integration Button */}
        <SidebarItem
          icon={FaPuzzlePiece}
          label="Integrate"
          onClick={() => setModalOpen(true)}
        />

        {/* 🛠️ Tools Section */}
        <div
          className="relative mt-3"
          onMouseEnter={() => setShowTools(true)}
          onMouseLeave={() => setShowTools(false)}
        >
          <div className="relative group flex flex-col items-center">
            <button
              className="relative w-10 h-10 flex items-center justify-center rounded-full 
              bg-gradient-to-br from-[#141414] to-[#1f1f1f] border border-[#23b5b5]/40 
              text-gray-200 shadow-md hover:text-white hover:shadow-[0_0_20px_#23b5b550] 
              transition-all duration-300 hover:scale-110"
            >
              <FaTools size={18} />
            </button>

            {/* Floating label */}
            <span
              className="absolute left-14 top-1/2 -translate-y-1/2 text-xs font-medium 
              bg-[#23b5b5]/10 text-[#23b5b5] px-2 py-0.5 rounded-md opacity-0 
              group-hover:opacity-100 transition duration-300 whitespace-nowrap"
            >
              Tools
            </span>
          </div>

          {/* Tools Popover */}
          <ToolsPopover visible={showTools} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-4 mb-2">
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center 
          bg-[#1f1f1f] border border-gray-700 hover:border-[#23b5b5]/40 text-gray-300 
          hover:text-white hover:shadow-[0_0_12px_#23b5b550] transition-all duration-300"
          onClick={() => setSettingsOpen(true)}
        >
          <span className="font-bold text-lg">G</span>
        </button>
        <span className="text-[11px] text-gray-400 mb-2">Account</span>
      </div>
    </aside>
  );
}
