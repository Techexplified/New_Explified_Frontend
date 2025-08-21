import React, { useRef, useState, useEffect } from "react";
import {
  ChevronDown,
  ExternalLink,
  Maximize2,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  CirclePlus,
  Plus,
  Video,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

export default function SocialCard({
  platform,
  data,
  icon: IconComponent,
  username,
  email,
  platformColor,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Weekly");
  const dropdownRef = useRef(null);
  const [showScheduleComponent, setShowScheduleComponent] = useState(false);
  const navigate = useNavigate();

  const options = ["Weekly", "Monthly", "Last Post", "Overall"];
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };
  return (
    <div className="bg-black border border-gray-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <IconComponent size={20} className={platformColor} />
          <span className="text-white font-medium capitalize">{platform}</span>
        </div>
        <div className="flex space-x-2">
          <button className="p-1 hover:bg-gray-700 rounded">
            <ExternalLink size={14} className="text-gray-400" />
          </button>
          <button
            className="p-1 hover:bg-gray-700 rounded"
            onClick={() =>
              navigate(`/socials/${platform.toLowerCase()}`, {
                state: { platform, data, iconName: platform.toLowerCase(), username, email, platformColor },
              })
              
            }
          >
            <Maximize2 size={14} className="text-gray-400" />
          </button>
          <button className="p-1 hover:bg-gray-700 rounded">
            <MoreHorizontal size={14} className="text-gray-400" />
          </button>
        </div>
      </div>
      <div className="w-full h-0.5 bg-gray-700 mb-4"></div>
      {/* User Info */}
      <div className="flex flex-col xl:flex-row xl:justify-between gap-2 mb-4">
        <div className="text-white font-medium">Srijan Ranjan</div>
        <div className="text-gray-400 text-sm">{username || email}</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-gray-400 text-sm">
            {platform === "instagram"
              ? "Followers"
              : platform === "linkedin"
              ? "Connections"
              : "Subscribers"}
          </div>
          <div className="text-white font-medium">
            {platform === "instagram"
              ? data.followers
              : platform === "linkedin"
              ? data.connections
              : data.subscribers}
          </div>
        </div>
        <div>
          <div className="text-gray-400 text-sm">
            {platform === "instagram"
              ? "Following"
              : platform === "linkedin"
              ? "Profile visits"
              : "Members"}
          </div>
          <div className="text-white font-medium">
            {platform === "instagram"
              ? data.following
              : platform === "linkedin"
              ? data.profileVisits
              : data.members}
          </div>
        </div>
      </div>

      {/* Time Filter */}
      <div className="mb-4 relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-800 text-white px-3 py-1 rounded text-sm flex items-center"
        >
          {selected} <ChevronDown size={14} className="ml-1" />
        </button>

        {isOpen && (
          <ul className="absolute z-10 mt-1 bg-black text-sm rounded text-white shadow w-40">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 bg-black border border-gray-700 text-white cursor-pointer hover:bg-[#23b5b5] hover:text-white"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chart */}
      <div className="h-32 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.chartData}>
            <Line
              type="monotone"
              dataKey="views"
              stroke="#23b5b5"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Metrics */}
      <div className="space-y-2 mb-6">
        {platform === "instagram" && (
          <>
            <div className="flex items-center text-sm">
              <TrendingUp size={14} className="text-green-400 mr-2" />
              <span className="text-green-400">{data.viewsIncrease}%</span>
              <span className="text-gray-400 ml-2">
                Views increase from last week
              </span>
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp size={14} className="text-green-400 mr-2" />
              <span className="text-green-400">{data.followersIncrease}%</span>
              <span className="text-gray-400 ml-2">
                Followers increase from last week
              </span>
            </div>
          </>
        )}
        {platform === "linkedin" && (
          <>
            <div className="flex items-center text-sm">
              <TrendingUp size={14} className="text-green-400 mr-2" />
              <span className="text-green-400">
                {data.profileViewsIncrease}%
              </span>
              <span className="text-gray-400 ml-2">
                Profile views increase from last week
              </span>
            </div>
            <div className="flex items-center text-sm">
              <TrendingDown size={14} className="text-red-400 mr-2" />
              <span className="text-red-400">
                {Math.abs(data.likesDecrease)}%
              </span>
              <span className="text-gray-400 ml-2">
                Likes decreased from last week
              </span>
            </div>
          </>
        )}
        {platform === "youtube" && (
          <>
            <div className="flex items-center text-sm">
              <TrendingDown size={14} className="text-red-400 mr-2" />
              <span className="text-red-400">
                {Math.abs(data.subscribersLost)}%
              </span>
              <span className="text-gray-400 ml-2">
                Subscribers lost from last week
              </span>
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp size={14} className="text-green-400 mr-2" />
              <span className="text-green-400">{data.viewsIncrease}%</span>
              <span className="text-gray-400 ml-2">
                Views increase from last week
              </span>
            </div>
          </>
        )}
      </div>

      {/* Parameters */}
      <div className="mb-6">
        <button className="bg-gray-800 text-white px-3 py-1 rounded text-sm flex items-center">
          Parameters <ChevronDown size={14} className="ml-1" />
        </button>
      </div>

      {/* Bottom Stats */}
      <div className="flex flex-row flex-wrap xl:flex-nowrap justify-between gap-2 mb-6">
        <div>
          <span className="text-gray-400">Reach:</span>
          <span className="text-green-400 ml-2">▲ {data.reach}%</span>
        </div>
        <div>
          <span className="text-gray-400">Views:</span>
          <span className="text-green-400 ml-2">▲ {data.views}%</span>
        </div>
        <div>
          <span className="text-gray-400">Likes:</span>
          <span className="text-red-400 ml-2">▼ {Math.abs(data.likes)}%</span>
        </div>
      </div>

      {/* Action Buttons */}
      {/* Action Buttons */}
      <div className="flex flex-row justify-between gap-2 mb-4">
        <button
          className={`border px-3 py-2 rounded text-sm ${
            showScheduleComponent
              ? "bg-white text-black border-white"
              : "bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
          }`}
          onClick={() => setShowScheduleComponent(!showScheduleComponent)}
        >
          Schedule Post
        </button>
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm">
          Last Post
        </button>
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm">
          Draft Post
        </button>
      </div>

      {/* Schedule Component UI */}
      {showScheduleComponent && (
        <div className=" rounded-lg p-4 bg-black mb-1 space-y-3">
          {/* Schedule Rows */}
          <div className="flex items-center justify-between border border-cyan-700 rounded-2xl px-2 py-1">
            <div className="flex items-center gap-2 text-white">
              <span className=" ml-1 text-lg font-bold">
                <CirclePlus size={16} />
              </span>
              <hr className="flex-1 border-t border-gray-500" />
            </div>
            <span className="text-gray-400 text-sm">Caption</span>
            <span className="text-gray-400 text-sm">28-09-25</span>
          </div>
          <div className="flex items-center justify-between border border-cyan-700 rounded-2xl px-2 py-1">
            <div className="flex items-center gap-2 text-white">
              <span className=" ml-1 text-lg font-bold">
                <Video size={16} />
              </span>
              <hr className="flex-1 border-t border-gray-500" />
            </div>
            <span className="text-gray-400 text-sm">Caption</span>
            <span className="text-gray-400 text-sm">03-11-25</span>
          </div>

          {/* New Post Button */}
          <button className="bg-black border border-cyan-700 text-white px-3 py-1 rounded-2xl text-sm flex items-center gap-1 hover:bg-cyan-800 hover:text-white transition">
            New Post{" "}
            <span className=" ml-1 text-lg font-bold">
              <Plus size={16} />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
