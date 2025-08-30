import React, { useState } from "react";
import {
  SquareStack,
  Image as ImageIcon,
  Wand2,
  Sidebar,
  Key,
} from "lucide-react";
import RemoveBg from "./RemoveBg"; // Make sure these point to your new files
import BlurBg from "./BlurBg";
import WorkFlowButton from "../../../reusable_components/WorkFlowButton";
import Aibackground from "./Aibackground";
import FilterImage from "./FilterImage";
import ReplaceBg from "./ReplaceBg";
import SidebarOnHover from "../../../reusable_components/SidebarOnHover";

/**
 * Main shell that houses both RemoveBg and BlurBg tools with a slick sidebar.
 * Dark black + teal colour scheme, responsive, and fully keyboard navigable.
 */
export default function BgToolsApp() {
  const [activeTool, setActiveTool] = useState("remove");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");

  const navItem = (id, icon, label) => (
    <button
      key={id}
      onClick={() => setActiveTool(id)}
      className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/40 border ${
        activeTool === id
          ? "bg-gradient-to-r from-[#23b5b5] to-cyan-400 text-black border-transparent shadow"
          : "bg-gray-900/60 text-gray-200 border-gray-700 hover:bg-black"
      }`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );

  return (
    <div className="h-full min-h-screen flex flex-col bg-black">
      <SidebarOnHover
        link={"https://explified.com/bg-remover/"}
        toolName={"RemoveBg"}
        id={"removebg"}
      />
      <WorkFlowButton />

      {/* ── Top Toolbar ── */}
      <header className="shrink-0 mt-20 px-4">
        <div className="w-fit mx-auto bg-black border border-[#000] rounded-3xl shadow-lg backdrop-blur">
          <div className="px-4 py-3 flex items-center justify-center">
            <nav className=" flex flex-wrap items-center justify-center gap-2">
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
              <button
                onClick={() => {
                  try {
                    const saved = localStorage.getItem("removebg_api_key");
                    setApiKeyInput(saved || "");
                  } catch (e) {}
                  setShowApiKeyModal(true);
                }}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/70 border bg-gray-900/60 text-gray-200 border-[#23b5b5] hover:bg-black shadow-[0_0_12px_rgba(35,181,181,0.55)] hover:shadow-[0_0_18px_rgba(35,181,181,0.75)]"
                title="Add Remove.bg API Key"
                aria-label="Add Remove.bg API Key"
              >
                <Key className="w-4 h-4" />
                <span className="truncate">Add Key</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* ── Tool Panel ── */}
      <main className="flex-1 overflow-y-auto bg-black">
        {activeTool === "remove" ? (
          <RemoveBg />
        ) : activeTool === "blur" ? (
          <BlurBg />
        ) : activeTool === "aiBg" ? (
          <Aibackground />
        ) : activeTool === "imgfilter" ? (
          <FilterImage />
        ) : (
          <ReplaceBg />
        )}
      </main>
      {/* <aside
  className="w-60 fixed top-0 right-0 h-full text-teal-300 border-l border-teal-800 bg-black p-6 flex flex-col gap-6"
  style={{ zIndex: 50 }} // Optional: keeps sidebar on top
>
  <h1 className="flex items-center gap-2 text-xl font-semibold text-teal-400">
    <SquareStack className="w-5 h-5" />
    AI Image Tools
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
</aside> */}
      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">
              Remove.bg API
            </div>
            <h3 className="text-xl font-semibold text-[#23b5b5] mb-2">
              API Key
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Enter your Remove.bg API key. It will be saved in your browser
              only.
              <br />
              <a
                href="https://www.remove.bg/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#23b5b5] hover:underline"
              >
                Get your API key from Remove.bg →
              </a>
            </p>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Enter your Remove.bg API key..."
              className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#23b5b5] focus:ring-2 focus:ring-[#23b5b5]/20 transition-all duration-300 mb-4"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="px-4 py-2 rounded-xl border border-neutral-700 text-gray-300 hover:text-white hover:border-neutral-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const trimmed = (apiKeyInput || "").trim();
                  if (trimmed) {
                    try {
                      localStorage.setItem("removebg_api_key", trimmed);
                    } catch (e) {}
                  }
                  setShowApiKeyModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#23b5b5] to-[#1a9999] text-white font-medium hover:from-[#1a9999] hover:to-[#23b5b5] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
