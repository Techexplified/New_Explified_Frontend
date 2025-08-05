import React, { useState } from "react";
import { SquareStack, Image as ImageIcon, Wand2 } from "lucide-react";
import RemoveBg from "./RemoveBg"; // Make sure these point to your new files
import BlurBg from "./BlurBg";
import Aibackground from "./Aibackground";
import FilterImage from "./FilterImage";
import ReplaceBg from "./ReplaceBg";

/**
 * Main shell that houses both RemoveBg and BlurBg tools with a slick sidebar.
 * Dark black + teal colour scheme, responsive, and fully keyboard navigable.
 */
export default function BgToolsApp() {
  const [activeTool, setActiveTool] = useState("remove");

  const navItem = (id, icon, label) => (
    <button
      key={id}
      onClick={() => setActiveTool(id)}
      className={`group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-teal-500 w-full
        ${
          activeTool === id
            ? "bg-teal-600 text-black"
            : "bg-black hover:bg-gray-900 text-teal-300"
        }`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );

  return (
    <div className="h-5/6 flex bg-black text-teal-300">
      {/* ── Sidebar ── */}
      <aside className="w-60 shrink-0 border-r border-teal-800 bg-black p-6 flex flex-col gap-6">
        <h1 className="flex items-center gap-2 text-xl font-semibold text-teal-400">
          <SquareStack className="w-5 h-5" />
          AI Image Tools
        </h1>
        <nav className="flex flex-col gap-2">
          {navItem(
            "remove",
            <Wand2 className="w-4 h-4 stroke-current" />,
            "Remove Background"
          )}
          {navItem(
            "blur",
            <ImageIcon className="w-4 h-4 stroke-current" />,
            "Blur Background"
          )}
          {navItem(
            "aiBg",
            <ImageIcon className="w-4 h-4 stroke-current" />,
            "Color Background"
          )}
          {navItem(
            "imgfilter",
            <ImageIcon className="w-4 h-4 stroke-current" />,
            "filter image"
          )}
          {navItem(
            "imgreplace",
            <ImageIcon className="w-4 h-4 stroke-current" />,
            "Replace BG"
          )}
        </nav>
        
      </aside>

      {/* ── Tool Panel ── */}
      <main className="flex-1 overflow-y-auto bg-black">
        {activeTool === "remove" ? <RemoveBg /> : activeTool === "blur" ? <BlurBg /> : activeTool === "aiBg" ? <Aibackground /> : activeTool === "imgfilter" ? <FilterImage /> : <ReplaceBg />}
      </main>
    </div>
  );
}