import React, { useState } from "react";
import {
  Search,
  Sliders,
  ChevronDown,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Influmark() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const dummyCards = Array(6).fill({
    name: "Ankit Bisht",
    content: "Tech",
    price: "1500",
    followers: "2M",
  });

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`relative z-30 bg-black border-r border-b border-gray-800 flex-shrink-0 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <img
            src="/Explified_logo.png"
            alt="Logo"
            className="w-10 h-10 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {sidebarOpen && (
          <nav className="flex-1 overflow-y-auto p-4 space-y-3">
            <button
              onClick={() => navigate("/tools")}
              className="w-full flex justify-between items-center p-2 rounded hover:bg-gray-800 border border-gray-600"
            >
              <span>Tools</span>
              <ChevronDown size={16} />
            </button>
            <button
              onClick={() => navigate("/socials")}
              className="w-full text-left p-2 rounded hover:bg-gray-800 border border-gray-600"
            >
              Socials
            </button>
            <button
              onClick={() => navigate("/favorites")}
              className="w-full text-left p-2 rounded hover:bg-gray-800 border border-gray-600"
            >
              Favorites
            </button>

            <div className="p-4 border-t border-gray-800">
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
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                  <div
                    className="bg-teal-400 h-1.5 rounded-full"
                    style={{ width: "100%" }}
                  ></div>
                </div>
                <button className="w-full bg-[#23b5b5] text-black py-2 rounded-md hover:bg-black hover:text-white border border-gray-600 transition-all">
                  Upgrade
                </button>
              </div>
            </div>
          </nav>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navbar */}
        <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-black z-10">
          <div className="flex items-center gap-4 ml-4 space-x-4">
            <img
              src="/Explified_logo.png"
              alt="Logo"
              className="ml-4 w-10 h-10 md:hidden"
              onClick={() => navigate("/")}
            />
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
            <button
              onClick={() => navigate("/integrations")}
              className="text-lg font-semibold hidden md:block"
            >
              Integrations
            </button>
            <button
              onClick={() => navigate("/influmark")}
              className="text-lg font-semibold hidden md:block"
            >
              Influmark
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
                  <p className="font-medium">Guest</p>
                  <p className="text-sm text-gray-300">guest@example.com</p>
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

        {/* Influmark Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-black">
          <h1 className="text-2xl font-semibold mb-6 text-center">Influmark</h1>

          {/* Search */}
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="Search by name"
                className="w-full py-2 pl-4 pr-10 rounded bg-[#333] text-white focus:outline-none"
              />
              <Search className="absolute right-2 top-2.5 w-5 h-5 text-gray-300" />
            </div>
            <button className="p-2 rounded bg-[#444] text-white">
              <Sliders size={18} />
            </button>
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-4 mb-8">
            <button className="px-4 py-2 rounded border border-gray-400 hover:bg-[#23b5b5] hover:text-black transition-all">
              Content
            </button>
            <button className="px-4 py-2 rounded border border-gray-400 hover:bg-[#23b5b5] hover:text-black transition-all">
              Price
            </button>
            <button className="px-4 py-2 rounded border border-gray-400 hover:bg-[#23b5b5] hover:text-black transition-all">
              Platform
            </button>
          </div>

          {/* Cards */}
          <h2 className="text-xl font-light mb-4">Overall</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {dummyCards.map((card, i) => (
              <div
                key={i}
                onClick={() =>
                  navigate(`/influmark/${encodeURIComponent(card.name)}`)
                }
                className="bg-[#444] p-4 rounded text-center border border-gray-600 cursor-pointer hover:border-[#23b5b5] transition"
              >
                <div className="flex justify-between text-sm mb-2">
                  <span>{card.content}</span>
                  <span>{card.price}©</span>
                </div>
                <div className="w-full h-24 bg-gray-600 rounded mb-2 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gray-400"></div>
                </div>
                <div className="text-sm mb-1">📀 {card.followers}</div>
                <div className="font-medium text-white">{card.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
