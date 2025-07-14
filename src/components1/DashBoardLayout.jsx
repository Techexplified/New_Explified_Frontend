import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ChevronDown, User, LogOut, Menu, X } from "lucide-react";
import HelpButton from "./HelpButton";
import Breadcrumbs from "./Breadcrumbs";

const quickToolsDropdown = [
  { name: "Youtube Summarizer", route: "/summarizer" },
  { name: "AI Subtitler", route: "/subtitler" },
  { name: "Linkedin Extension", route: "/linkedin" },
  { name: "Video Generator", route: "/video-generator" },
  { name: "BG Remover", route: "/bg-remover" },
];

function GlobalStyle() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      html, body, #root { height: 100%; }
      body { margin: 0; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style); // cleanup on hot‑reload
  }, []);
  return null; // nothing visible
}

export default function DashBoardLayout() {
  const navigate = useNavigate();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toolsDropdown, setToolsDropdown] = useState(false);
  const [showWorkDropdown, setShowWorkDropdown] = useState(false);
  return (
    <>
      <GlobalStyle />
      <div className="flex h-screen bg-black text-white overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed z-30 md:static w-64 bg-black border-r border-b border-gray-800 flex-shrink-0 flex flex-col transition-transform duration-300 ${
            sidebarOpen
              ? "translate-x-0 "
              : "-translate-x-full md:translate-x-0 "
          }`}
        >
          {/* Logo */}
          <div
            className="flex justify-center p-4 "
            onClick={() => navigate("/")}
          >
            <img src="/Explified_logo.png" alt="Logo" className="w-10 h-10" />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-3">
            <div>
              <button
                onClick={() => setToolsDropdown(!toolsDropdown)}
                className="w-full flex justify-between items-center p-2 rounded hover:bg-gray-800 border border-gray-600"
              >
                <span>Tools</span>
                <ChevronDown size={16} />
              </button>
              {toolsDropdown && (
                <div className="mt-2 p-2 space-y-1 border border-gray-600 rounded">
                  {quickToolsDropdown.map((tool, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        navigate(tool.route);
                        setSidebarOpen(false);
                      }}
                      className="block w-full text-left px-2 py-1 rounded hover:bg-[#23b5b5] hover:text-black"
                    >
                      {tool.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                navigate("/socials");
                setSidebarOpen(false);
              }}
              className="w-full text-left p-2 rounded hover:bg-gray-800 border border-gray-600"
            >
              Socials
            </button>
            <div className="flex border border-gray-600 rounded">
              <button
                onClick={() => {
                  navigate("/workflows");
                  setSidebarOpen(false);
                }}
                className="w-full text-left p-2 rounded  flex items-center justify-between"
              >
                Workflows
              </button>
              <div
                className="p-2"
                onClick={() => setShowWorkDropdown(!showWorkDropdown)}
              >
                <ChevronDown size={16} />
              </div>
            </div>
            {showWorkDropdown && (
              <div className="z-50 mt-2 p-2 space-y-1 border border-gray-600 rounded">
                <button
                  onClick={() => {
                    navigate("/workflows");
                    setSidebarOpen(false);
                  }}
                  className="block w-full text-left px-2 py-1 rounded hover:bg-[#23b5b5] hover:text-black"
                >
                  Workflows 1
                </button>
                <button
                  onClick={() => {
                    navigate("/templates");
                    setSidebarOpen(false);
                  }}
                  className="block w-full text-left px-2 py-1 rounded hover:bg-[#23b5b5] hover:text-black"
                >
                  Workflows 2
                </button>
              </div>
            )}
            <button
              onClick={() => {
                navigate("/aitools");
                setSidebarOpen(false);
              }}
              className="w-full text-left p-2 rounded hover:bg-gray-800 border border-gray-600"
            >
              AI Tools
            </button>
          </nav>

          {/* Favorites + Credits Section */}
          <div className="px-4 pb-4 space-y-3">
            {/* Favorites moved here */}
            <button
              onClick={() => {
                navigate("/favorites");
                setSidebarOpen(false);
              }}
              className="w-full text-left p-2 rounded hover:bg-gray-800 border border-gray-600"
            >
              Favorites
            </button>

            {/* Credits/Upgrade */}
            <div className="w-full p-4 rounded-md shadow border border-gray-600">
              <div className="text-sm text-gray-100 flex items-center justify-between mb-2">
                <span>Credits remaining</span>
                <span className="flex items-center gap-1 text-gray-400 font-medium">
                  <svg
                    className="w-4 h-4 text-gray-100"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zM8 15l-5-5 1.4-1.4L8 12.2l7.6-7.6L17 6l-9 9z" />
                  </svg>
                  400 / 400
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                <div
                  className="bg-teal-400 h-1.5 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>

              {/* Upgrade Button */}
              <button className="w-full bg-[#23b5b5] text-black py-2 rounded-md hover:bg-black hover:text-white border border-gray-600 transition-all">
                Upgrade
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-black z-10">
            <div className="flex items-center gap-4 ml-4 space-x-4">
              <img
                src="/Explified_logo.png"
                alt="Logo"
                className="ml-4 w-10 h-10 md:hidden"
                onClick={() => navigate("/")}
              />

              {/* Logo visible always */}

              <button
                className="text-lg font-semibold hidden md:block"
                onClick={() => navigate("/")}
              >
                Home
              </button>
              <button
                onClick={() => navigate("/history")}
                className="text-lg font-semibold hidden md:block"
              >
                History
              </button>
            </div>

            <div className="relative flex items-center gap-4">
              <button
                className="md:hidden text-white"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center space-x-2 p-2 rounded hover:text-[#23b5b5] transition-colors"
              >
                <User size={20} />
                <ChevronDown size={16} />
              </button>

              {profileDropdown && (
                <div className="absolute right-0 top-12 mt-2 bg-black border border-white rounded-xl w-64 z-50">
                  <div className="flex flex-col items-center py-4">
                    <User size={24} className="mb-2" />
                    <p className="font-medium">Srijan Ranjan</p>
                    <p className="text-sm text-gray-300">
                      srijanranjan@gmail.com
                    </p>
                  </div>
                  <div className="border-t border-white my-2" />
                  <button className="w-full py-2 flex justify-center items-center space-x-2">
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                  <div className="border-t border-white my-2" />
                  <div className="grid grid-cols-2 divide-x divide-white">
                    <button className="py-2 text-sm">Contact us</button>
                    <button className="py-2 text-sm">Feedback</button>
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Scrollable Main Content */}
          <main className="flex-1 -m-5 overflow-y-auto p-4 sm:p-6 md:p-8 bg-black">
            <Breadcrumbs />
            <Outlet />
          </main>

          <HelpButton />
        </div>
      </div>
    </>
  );
}
