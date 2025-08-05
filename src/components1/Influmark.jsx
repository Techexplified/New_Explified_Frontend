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
  Award,
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
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        {/* Influmark Body */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {/* Header with enhanced styling */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold bg-[#20acc7] bg-clip-text text-transparent mb-2">
              Influmark
            </h1>
            {/* <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto rounded-full"></div> */}
            {/* <p className="text-gray-400 mt-4 text-lg">
              Discover and connect with top influencers
            </p> */}
          </div>

          {/* Enhanced Search Section */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="relative w-full max-w-2xl group">
              <input
                type="text"
                placeholder="Search by name, category, or expertise..."
                className="w-full py-4 pl-6 pr-14 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-lg shadow-xl"
              />
              <Search className="absolute right-4 top-4 w-6 h-6 text-gray-400 group-focus-within:text-cyan-400 transition-colors duration-300" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/10 to-purple-600/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <button className="p-4 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white hover:bg-cyan-400/20 hover:border-cyan-400 transition-all duration-300 shadow-xl group">
              <Sliders
                size={24}
                className=" transition-transform duration-300"
              />
            </button>
          </div>

          {/* Enhanced Filters */}
          <div className="flex justify-center gap-6 mb-12">
            {["Content", "Price", "Platform"].map((filter, index) => (
              <button
                key={filter}
                className="group relative px-8 py-3 rounded-full border border-gray-600 hover:border-transparent transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-[#20acc7] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0.5 bg-gray-900 rounded-full group-hover:bg-transparent transition-all duration-300"></div>
                <span className="relative z-10 font-medium group-hover:text-white transition-colors duration-300">
                  {filter}
                </span>
              </button>
            ))}
          </div>

          {/* Enhanced Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              {/* <TrendingUp className="w-6 h-6 text-cyan-400" /> */}
              <h2 className="text-2xl font-bold text-white">Overall</h2>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-5 h-5" />
              <span className="text-sm">
                Showing {dummyCards.length} results
              </span>
            </div>
          </div>

          {/* Enhanced Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {dummyCards.map((card, i) => (
              <div
                key={i}
                onClick={() =>
                  navigate(`/influmark/${encodeURIComponent(card.name)}`)
                }
                className="group relative bg-gray-800/30 backdrop-blur-sm p-6 rounded-3xl border border-gray-700 cursor-pointer hover:border-cyan-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/10 overflow-hidden"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Card background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content and Price Header */}
                <div className="relative z-10 flex justify-between items-start mb-4">
                  <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-sm font-medium border border-cyan-400/30">
                    {card.content}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400 font-bold">
                    <span>{card.price}</span>
                    <Award className="w-4 h-4" />
                  </div>
                </div>

                {/* Enhanced Avatar Section */}
                <div className="relative z-10 flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-400/20 transition-all duration-300">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {card.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="relative z-10 text-center mb-4">
                  <div className="flex items-center justify-center gap-2 text-gray-300 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-lg font-bold text-white">
                      {card.followers}
                    </span>
                    <span className="text-sm">followers</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-3"></div>
                </div>

                {/* Name */}
                <div className="relative z-10 text-center">
                  <h3 className="font-bold text-xl text-white group-hover:text-cyan-300 transition-colors duration-300">
                    {card.name}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Content Creator</p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {/* <div className="flex justify-center mt-12">
            <button className="group relative px-8 py-4 rounded-full bg-[#20acc7] text-white font-medium hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 transform hover:scale-105">
              <span className="relative z-10">Load More Influencers</span>
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
