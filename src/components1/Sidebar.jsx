import React from "react";
import { ChevronDown } from "lucide-react";

export default function Sidebar({ currentPage, setCurrentPage }) {
  const sidebarItems = ["Tools", "Favorites", "Socials"];

  return (
    <aside className="w-48 bg-black min-h-screen p-4 border-r border-gray-800">
      <nav className="space-y-2">
        {sidebarItems.map((item, index) => (
          <div className="py-2" key={index}>
            <button 
              onClick={() => {
                if (item === "Socials") {
                  setCurrentPage("socials");
                } else if (item === "Tools") {
                  setCurrentPage("home");
                }
                // Add more navigation logic here as needed
              }}
              className={`flex items-center justify-between w-full text-left hover:bg-gray-800 p-2 rounded ${
                (item === "Socials" && currentPage === "socials") ||
                (item === "Tools" && currentPage === "home") ? "bg-gray-800" : ""
              }`}
            >
              <span className="text-white">{item}</span>
              <ChevronDown size={16} color="white" />
            </button>
          </div>
        ))}
      </nav>
    </aside>
  );
}