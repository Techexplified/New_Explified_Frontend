import React, { useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Instagram,
  Linkedin,
  Youtube,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const iconMap = {
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

// Mock data for demonstration - replace with actual data
const mockChartData = [
  { time: "Jan", views: 2500, followers: 1200, engagement: 350 },
  { time: "Feb", views: 3200, followers: 1350, engagement: 420 },
  { time: "Mar", views: 2800, followers: 1500, engagement: 380 },
  { time: "Apr", views: 4100, followers: 1750, engagement: 520 },
  { time: "May", views: 3800, followers: 1900, engagement: 490 },
  { time: "Jun", views: 4500, followers: 2100, engagement: 580 },
];

const CircularProgress = ({ percentage, label, value, color = "#23b5b5" }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${
    (percentage / 100) * circumference
  } ${circumference}`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mb-3">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#374151"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm sm:text-base lg:text-lg font-semibold text-white">
            {percentage}%
          </span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm sm:text-base text-gray-400">{label}</div>
        <div className="text-sm sm:text-base text-gray-400">{value}</div>
      </div>
    </div>
  );
};

const MiniChart = ({ data, title, percentage, color = "#23b5b5" }) => (
  <div className=" bg-black p-4 sm:p-6 rounded-lg ">
    <div className="flex justify-between items-center mb-3">
      <span className="text-sm sm:text-base text-gray-400">{title}</span>
      <span className="text-sm sm:text-base text-green-400">
        +{percentage}%
      </span>
    </div>
    <div className="h-16 sm:h-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default function DetailedCard() {
  const navigate = useNavigate();
  const { platform } = useParams();
  const location = useLocation();
  const [week, setWeek] = useState("last");
  const {
    platform: platformName,
    data,
    iconName,
    username,
    email,
    platformColor,
  } = location.state || {};

  const IconComponent = iconMap[iconName] || Instagram;
  const [showPosts, setShowPosts] = React.useState(false);

  const miniChartData = [
    { value: 20 },
    { value: 35 },
    { value: 25 },
    { value: 45 },
    { value: 38 },
    { value: 52 },
  ];

  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* Header */}
      <div className="mt-[-30px] flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 lg:p-8 gap-4 sm:gap-0">
        <button
          className="p-2  rounded hover:text-[#23b5b5] hover:scale-130 transition-transform duration-200"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={24} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="mt-[-30px] flex flex-col items-center justify-center space-x-3 mb-6">
        <IconComponent
          size={24}
          className={`${platformColor} sm:w-12 sm:h-12`}
        />
        <span className="mt-2 text-xl sm:text-2xl lg:text-3xl font-semibold">
          sleepy_srijan
        </span>
      </div>

      <div className="flex justify-around items-center space-x-4 relative">
        <select className="bg-black text-white px-4 py-2 rounded text-base sm:text-lg border border-gray-600 hover:bg-gray-700 transition-transform duration-200">
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Daily</option>
        </select>
        <div className="relative">
          <button
            onClick={() => setShowPosts(!showPosts)}
            className="bg-black px-6 py-2 rounded text-base sm:text-lg border border-gray-600 hover:bg-gray-700 "
          >
            Posts
          </button>

          {/* Dropdown */}
          {showPosts && (
            <div className="absolute left-0 mt-2 w-48 bg-black border border-gray-600 rounded-lg shadow-lg z-20">
              <button
                className="w-full text-white text-left px-4 py-2 hover:bg-[#23b5b5] hover:text-black transition-colors"
                onClick={() => navigate("/socials/instagram/schedule")}
              >
                Schedule Post
              </button>
              <button
                onClick={() => navigate("/socials/instagram/lastPosts")}
                className="w-full text-white text-left px-4 py-2 hover:bg-[#23b5b5] hover:text-black transition-colors"
              >
                Last Post
              </button>
              <button
                onClick={() => navigate("/socials/instagram/draft")}
                className="w-full text-white text-left px-4 py-2 hover:bg-[#23b5b5] hover:text-black transition-colors"
              >
                Draft Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto mt-[-50px]">
        {/* Top Stats */}
        <div className="grid grid-cols-1 gap-6 lg:gap-8 mb-2 rounded">
          <div className="bg-black p-6 sm:p-8 rounded-lg">
            <div className="flex flex-col lg:flex-row justify-around gap-4">
              <div className="border border-gray-600 p-4 sm:p-6 rounded-lg">
                <div className="text-base sm:text-xl text-center text-green-400 mb-3">
                  Positives
                </div>
                <div className="text-center space-y-2">
                  <div>21% rise in comments</div>
                  <div>2% views increased</div>
                  <div>10% likes increased</div>
                  <div>4% saves increased</div>
                  <div>15% reach increased</div>
                </div>
              </div>
              <div className="bg-black flex flex-col items-center justify-center p-6 sm:p-8 rounded-lg border border-gray-600 text-center">
                <div className="text-base sm:text-lg text-gray-400 mb-2">
                  Total followers Increased
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                  5.2k
                </div>
                <div className="text-base sm:text-lg text-green-400">
                  Average views increased: +5.2%
                </div>
              </div>
              <div className="border border-gray-600 p-4 sm:p-6 rounded-lg">
                <div className="text-center text-base sm:text-xl text-red-400 mb-3">
                  Negatives
                </div>
                <div className="text-center space-y-2">
                  <div>21% less comments</div>
                  <div>2% views decreased</div>
                  <div>10% likes decreased</div>
                  <div>4% saves decreased</div>
                  <div>15% reach decreased</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-black p-6 sm:p-8 rounded-lg mb-2 mt-[-30px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
              Interactions
            </h3>
            <div className="text-base sm:text-lg text-gray-400">Time →</div>
          </div>
          <div className="h-64 sm:h-80 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={14} />
                <YAxis stroke="#9CA3AF" fontSize={14} />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#23b5b5"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex space-x-2 mb-4 ">
          <button
            className={`px-4 py-2 rounded text-sm border border-gray-600 ${
              week === "last" ? "bg-[#23b5b5] text-black" : "text-gray-400"
            }`}
            onClick={() => setWeek("last")}
          >
            Last Week
          </button>
          <button
            className={`px-4 py-2 rounded text-sm border border-gray-600 ${
              week === "this" ? "bg-[#23b5b5] text-black" : "text-gray-400"
            }`}
            onClick={() => setWeek("this")}
          >
            This Week
          </button>
        </div>

        {/* Circular Progress Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8 ">
          <div className="bg-black p-6 sm:p-8 rounded-lg border border-gray-600">
            <div className="text-base sm:text-lg text-gray-400 mb-4">
              Comments
            </div>
            <CircularProgress
              percentage={75}
              label="Followers - 43"
              value="Non-followers - 98"
            />
            <div className="mb-4 text-xs sm:text-sm text-gray-400 text-center">
              First time viewers - 20
            </div>

            <div className=" mt-2 border-t border-gray-600 rounded-lg">
              <MiniChart
                data={miniChartData}
                title="Key Difference From Last Week"
                percentage="5.2"
                color="#23b5b5"
              />
              <div className="p-4 text-gray-400 sm:p-6 text-sm sm:text-base mt-[-2rem] flex flex-col items-start">
                <div>
                  <span className="text-green-400">Positives</span> : 5.2%
                  increase
                </div>
                <div>
                  <span className="text-red-400">Negatives</span> : 5.2%
                  decrease
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black p-6 sm:p-8 rounded-lg border border-gray-600">
            <div className="text-base sm:text-lg text-gray-400 mb-4">
              Shares
            </div>
            <CircularProgress
              percentage={65}
              label="Followers - 43"
              value="Non-followers - 98"
            />
            <div className="mb-4 text-xs sm:text-sm text-gray-400 text-center">
              First time viewers - 20
            </div>
            <div className=" mt-2 border-t border-gray-600 rounded-lg">
              <MiniChart
                data={miniChartData}
                title="Key Difference From Last Week"
                percentage="5.2"
                color="#23b5b5"
              />
              <div className="p-4 text-gray-400 sm:p-6 text-sm sm:text-base mt-[-2rem] flex flex-col items-start">
                <div>
                  <span className="text-green-400">Positives</span> : 5.2%
                  increase
                </div>
                <div>
                  <span className="text-red-400">Negatives</span> : 5.2%
                  decrease
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black p-6 sm:p-8 rounded-lg border border-gray-600">
            <div className="text-base sm:text-lg text-gray-400 mb-4">Saves</div>
            <CircularProgress
              percentage={85}
              label="Followers - 43"
              value="Non-followers - 98"
            />
            <div className="mb-4 text-xs sm:text-sm text-gray-400 text-center">
              First time viewers - 20
            </div>
            <div className=" mt-2 border-t border-gray-600 rounded-lg">
              <MiniChart
                data={miniChartData}
                title="Key Difference From Last Week"
                percentage="5.2"
                color="#23b5b5"
              />
              <div className="p-4 text-gray-400 sm:p-6 text-sm sm:text-base mt-[-2rem] flex flex-col items-start">
                <div>
                  <span className="text-green-400">Positives</span> : 5.2%
                  increase
                </div>
                <div>
                  <span className="text-red-400">Negatives</span> : 5.2%
                  decrease
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black p-6 sm:p-8 rounded-lg  border border-gray-600">
            <div className="text-base sm:text-lg text-gray-400 mb-4">Likes</div>
            <CircularProgress
              percentage={90}
              label="Followers - 43"
              value="Non-followers - 98"
            />
            <div className="mb-4 text-xs sm:text-sm text-gray-400 text-center">
              First time viewers - 20
            </div>
            <div className=" mt-2 border-t border-gray-600 rounded-lg">
              <MiniChart
                data={miniChartData}
                title="Key Difference From Last Week"
                percentage="5.2"
                color="#23b5b5"
              />
              <div className="p-4 text-gray-400 sm:p-6 text-sm sm:text-base mt-[-2rem] flex flex-col items-start">
                <div>
                  <span className="text-green-400">Positives</span> : 5.2%
                  increase
                </div>
                <div>
                  <span className="text-red-400">Negatives</span> : 5.2%
                  decrease
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ask Questions Section */}
        <div className="w-3/4 mx-auto bg-black p-2 border border-gray-600 rounded-full">
          <div className="flex items-center justify-between gap-4 ">
            <input
              type="text"
              placeholder="Ask me questions"
              className="bg-transparent text-white placeholder-gray-400 flex-1 outline-none text-base sm:text-lg pl-4 py-2"
            />
            <button className="text-green-400 hover:text-green-300 p-2 transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="sm:w-6 sm:h-6"
              >
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
