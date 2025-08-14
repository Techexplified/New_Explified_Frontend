import { Pin, PinOff } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function SidebarOnHover({ link, toolName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  return (
    <>
      {" "}
      <div
        className="absolute left-0 top-0 h-full w-6 z-30"
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      />
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-black/95 backdrop-blur-xl border-r border-minimal-primary/20 
  flex flex-col justify-between transition-all duration-300 z-50
  ${sidebarOpen ? "w-56 px-6" : "w-0 px-0 overflow-hidden"}`}
        onMouseEnter={() => !sidebarPinned && setSidebarOpen(true)}
        onMouseLeave={() => !sidebarPinned && setSidebarOpen(false)}
      >
        {/* Top section */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => {
                setSidebarPinned(!sidebarPinned);
                setSidebarOpen(true); // Ensure open when pinned
              }}
            >
              {sidebarPinned ? <PinOff size={20} /> : <Pin size={20} />}
            </button>
            <p className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white to-minimal-primary bg-clip-text text-transparent">
              {toolName}
            </p>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mb-8">
          <Link to={link}>
            <button className="w-full bg-gradient-to-r from-minimal-primary to-minimal-primary/80 hover:from-minimal-primary/80 hover:to-minimal-primary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-minimal-primary/25">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default SidebarOnHover;
