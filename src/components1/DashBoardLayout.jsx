import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ChevronDown, User, LogOut } from "lucide-react";
import HelpButton from "./HelpButton";

function DashBoardLayout() {
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden flex justify-between items-center p-4 bg-black border-b border-gray-800">
        <img className="w-10 h-10" src="/Explified_logo.png" alt="logo" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`md:block ${
          sidebarOpen ? "block" : "hidden"
        } w-full md:w-48 bg-black border-r border-gray-800 p-4`}
      >
        <div className="w-full flex justify-center mb-6" onClick={() => navigate("/")}>
          <img
            className="w-10 h-10 hidden md:block"
            src="/Explified_logo.png"
            alt=""
          />
        </div>
        <nav className="space-y-4 mt-8">
          {["/", "/favorites", "/socials"].map((path, i) => {
            const labels = ["Tools", "Favorites", "Socials"];
            return (
              <button
                key={path}
                onClick={() => {
                  navigate(path);
                  setSidebarOpen(false); // close on mobile
                }}
                className="flex items-center justify-between w-full text-left hover:bg-gray-800 p-2 rounded text-white"
              >
                <span>{labels[i]}</span>
                <ChevronDown size={16} />
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-black text-white">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
          <nav className="flex space-x-12">
            <button className="text-lg font-semibold" onClick={() => navigate("/")}>Home</button>
            <button className="text-lg font-semibold">History</button>
          </nav>
          <div className="relative">
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg"
            >
              <User size={20} />
              <ChevronDown size={16} />
            </button>
            {profileDropdown && (
              <div className="absolute right-0 mt-2 bg-black border border-white rounded-xl w-64 z-50">
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

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>

        <HelpButton />
      </div>
    </div>
  );
}

export default DashBoardLayout;
