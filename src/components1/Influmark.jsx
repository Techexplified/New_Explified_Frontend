import React, { useState } from "react";
import {
  Search,
  Sliders,
  Users,
  Star,
  TrendingUp,
  Filter,
  Grid,
  List,
  Heart,
  Share2,
  Eye,
  DollarSign,
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
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
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
