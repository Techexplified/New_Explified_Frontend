import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Instagram, Linkedin, Youtube } from "lucide-react";
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
        <div className="text-xs sm:text-sm text-gray-400">{label}</div>
        <div className="text-sm sm:text-base font-semibold text-white">
          {value}
        </div>
      </div>
    </div>
  );
};

const MiniChart = ({ data, title, percentage, color = "#23b5b5" }) => (
  <div className="bg-black p-4 sm:p-6 rounded-lg">
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
const InstagramAnalytics = () => {
  
  const [analyzeComments, setAnalyzeComments] = useState(false);

  const metrics = [
    {
      title: "Likes",
      followers: 43,
      nonFollowers: 98,
      firstTimeViewers: 20,
      chartColor: "from-cyan-400 to-blue-500",
    },
    {
      title: "Comments",
      followers: 43,
      nonFollowers: 98,
      firstTimeViewers: 20,
      chartColor: "from-cyan-400 to-blue-500",
    },
    {
      title: "Shares",
      followers: 43,
      nonFollowers: 98,
      firstTimeViewers: 20,
      chartColor: "from-cyan-400 to-blue-500",
    },
    {
      title: "Saves",
      followers: 43,
      nonFollowers: 98,
      firstTimeViewers: 20,
      chartColor: "from-cyan-400 to-blue-500",
    },
  ];

  const miniChartData = [
    { value: 20 },
    { value: 35 },
    { value: 25 },
    { value: 45 },
    { value: 38 },
    { value: 52 },
  ];

  return (
    <div className="bg-black text-white min-h-screen p-6">
      {/* Header Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
        <span>Socials</span>
        <span>&gt;</span>
        <span>Instagram</span>
        <span>&gt;</span>
        <span>Posts</span>
        <span>&gt;</span>
        <span className="text-white">Recent</span>
      </div>

      <div className="flex flex-col gap-8">
        {/* Left Column - Post Preview */}
        <div className="flex flex-col md:flex-row justify-between gap-10 lg:gap-40 w-full p-4">
          {/* Left Column */}
          <div className="space-y-6 w-full md:max-w-md">
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center space-x-2 bg-gray-800 border border-gray-600 rounded px-4 py-2 text-sm text-white">
                  <span>Filters</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Post Preview */}
            <div className="bg-gray-400 rounded-lg aspect-square xs:w-sm md:w-full" />

            {/* Follower Buttons */}
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 rounded text-sm border bg-transparent border-gray-600 text-gray-400">
                100 Followers
              </button>
              <button className="px-4 py-2 rounded text-sm border bg-transparent border-gray-600 text-gray-400">
                50 Non-Followers
              </button>
            </div>
          </div>

          {/* Right Column - Post Details */}
          <div className="flex flex-col justify-start items-start md:mt-10 w-full space-y-6 text-center">
            {/* Caption Section */}
            <div className="w-full ">
              <label className="block text-xl sm:text-2xl font-medium mb-2 text-white ">
                Caption
              </label>
              <div className="flex flex-col space-y-2 text-gray-300">
                <div>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Facere, est.
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Facere, est.
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Facere, est.
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Facere, est.
                </div>
              </div>
            </div>

            {/* Collaborations */}
            <div className="w-full">
              <label className="block text-xl font-medium mb-2 text-white">
                Collaborations :
              </label>
              <div className="text-gray-300">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere,
                est.
              </div>
            </div>

            <div className="w-full flex items-center justify-center space-x-3">
              <button
                onClick={() => setAnalyzeComments(!analyzeComments)}
                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                  analyzeComments
                    ? "bg-cyan-400 border-cyan-400"
                    : "border-gray-600 bg-transparent"
                }`}
              >
                {analyzeComments && (
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                )}
              </button>
              <span className="text-sm text-white">Analyze Comments</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>

            {analyzeComments && (
              <div className="w-full text-center flex flex-col space-y-4 p-4 rounded-xl shadow-md ">
                <h2 className="text-xl font-semibold text-[#23b5b5]">
                  Insights:
                </h2>

                <div className="flex flex-row gap-3 items-start justify-between ">
                  {/* Left column */}
                  <div className="flex flex-col space-y-2">
                    <div className=" p-2 rounded-md shadow-sm">
                      Lorem, ipsum dolor. 3.......
                      <span className="text-[#23b5b5] text-xs">
                        view comments
                      </span>
                    </div>
                    <div className=" p-2 rounded-md shadow-sm">
                      Lorem, ipsum dolor. 3.......
                      <span className="text-[#23b5b5] text-xs">
                        view comments
                      </span>
                    </div>
                  </div>

                  {/* Vertical divider */}
                  <div className="w-0.5 bg-gray-600 self-stretch"></div>

                  {/* Right column */}
                  <div className="flex flex-col space-y-2">
                    <div className=" p-2 rounded-md shadow-sm">
                      Lorem, ipsum dolor. 3.......
                      <span className="text-[#23b5b5] text-xs">
                        view comments
                      </span>
                    </div>
                    <div className=" p-2 rounded-md shadow-sm">
                      Lorem, ipsum dolor. 3.......
                      <span className="text-[#23b5b5] text-xs">
                        view comments
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Analytics */}
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8 ">
            <div className="bg-black p-6 sm:p-8 rounded-lg text-center border border-gray-600">
              <div className="text-base sm:text-lg text-gray-400 mb-4">
                Comments
              </div>
              <CircularProgress
                percentage={75}
                label="Followers - 43"
                value="Non-followers - 98"
              />
              <div className="text-sm sm:text-base text-gray-500 mt-3">
                First time viewers - 20
              </div>
            </div>

            <div className="bg-black p-6 sm:p-8 rounded-lg text-center border border-gray-600">
              <div className="text-base sm:text-lg text-gray-400 mb-4">
                Shares
              </div>
              <CircularProgress
                percentage={65}
                label="Followers - 43"
                value="Non-followers - 98"
              />
              <div className="text-sm sm:text-base text-gray-500 mt-3">
                First time viewers - 20
              </div>
            </div>

            <div className="bg-black p-6 sm:p-8 rounded-lg text-center border border-gray-600">
              <div className="text-base sm:text-lg text-gray-400 mb-4">
                Saves
              </div>
              <CircularProgress
                percentage={85}
                label="Followers - 43"
                value="Non-followers - 98"
              />
              <div className="text-sm sm:text-base text-gray-500 mt-3">
                First time viewers - 20
              </div>
            </div>

            <div className="bg-black p-6 sm:p-8 rounded-lg text-center border border-gray-600">
              <div className="text-base sm:text-lg text-gray-400 mb-4">
                Likes
              </div>
              <CircularProgress
                percentage={90}
                label="Followers - 43"
                value="Non-followers - 98"
              />
              <div className="text-sm sm:text-base text-gray-500 mt-3">
                First time viewers - 20
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gray-800 rounded text-sm border border-gray-600">
              Last Week
            </button>
            <button className="px-4 py-2 bg-transparent rounded text-sm border border-gray-600 text-gray-400">
              This Week
            </button>
          </div>

          {/* Bottom Mini Charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8 ">
            <div className="border border-gray-600 rounded-lg">
              <MiniChart
                data={miniChartData}
                title="Key Difference From Last Week"
                percentage="5.2"
                color="#23b5b5"
              />
              <div className="p-4 text-gray-400 sm:p-6 text-sm sm:text-base mt-[-2rem]">
                <div>Positives :</div>
                <div>Negatives :</div>
              </div>
            </div>
            <div className="border border-gray-600 rounded-lg">
              <MiniChart
                data={miniChartData}
                title="Key Difference From Last Week"
                percentage="3.8"
                color="#10b981"
              />
              <div className="p-4 text-gray-400 sm:p-6 text-sm sm:text-base mt-[-2rem]">
                <div>Positives :</div>
                <div>Negatives :</div>
              </div>
            </div>
            <div className="border border-gray-600 rounded-lg">
              <MiniChart
                data={miniChartData}
                title="Key Difference From Last Week"
                percentage="7.1"
                color="#f59e0b"
              />
              <div className="p-4 text-gray-400 sm:p-6 text-sm sm:text-base mt-[-2rem]">
                <div>Positives :</div>
                <div>Negatives :</div>
              </div>
            </div>
            <div className="border border-gray-600 rounded-lg">
              <MiniChart
                data={miniChartData}
                title="Key Difference From Last Week"
                percentage="2.9"
                color="#ef4444"
              />
              <div className="p-4 text-gray-400 sm:p-6 text-sm sm:text-base mt-[-2rem]">
                <div>Positives :</div>
                <div>Negatives :</div>
              </div>
            </div>
          </div>

          {/* Ask Questions Input */}
          <div className="bg-black p-3 border border-gray-600 rounded-4xl">
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
    </div>
  );
};

export default InstagramAnalytics;
