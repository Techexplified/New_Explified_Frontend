import React from "react";
import { ChevronDown, User, LogOut } from "lucide-react";

export default function Header({ currentPage, setCurrentPage, profileDropdown, setProfileDropdown }) {
  return (
    <header className="flex items-center justify-between p-4 bg-black border-b border-gray-800">
      <div className="flex items-center space-x-8">
        
        <nav className="flex space-x-20">
          <button 
            onClick={() => setCurrentPage("home")}
            className={`text-xl font-semibold ${currentPage === "home" ? "text-white" : "text-gray-400"}`}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentPage("history")}
            className={`text-xl font-semibold ${currentPage === "history" ? "text-white" : "text-gray-400"}`}
          >
            History
          </button>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdown(!profileDropdown)}
            className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <User size={20} color="white" />
            <ChevronDown size={16} color="white" />
          </button>
          {profileDropdown && (
            <div className="absolute right-0 top-12 bg-black rounded-xl border border-white text-center text-white w-64 z-50">
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
      </div>
    </header>
  );
}