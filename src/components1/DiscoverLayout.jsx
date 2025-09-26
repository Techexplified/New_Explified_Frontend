import React from "react";
import {
  Plus,
  Home,
  Globe,
  Layers,
  Bell,
  User,
  Zap,
  Download,
  Share,
  Sun,
  Cloud,
  CloudRain,
} from "lucide-react";
import discover from "../assets/discover.jpg";

export default function DiscoverLayout() {
  return (
    <div
      className="flex h-screen bg-gray-900 text-white relative"
      style={{
        backgroundImage: `url(${discover})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for opacity control */}
      <div className="absolute inset-0 bg-gray-900 opacity-85"></div>
      {/* Left Sidebar */}
      <div className="w-16 bg-gray-800 flex flex-col items-center py-4 justify-between relative z-10">
        <div>
          {/* Logo */}
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center mb-5">
            <div className="w-6 h-6 bg-gray-900 rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-xs"></div>
            </div>
          </div>

          {/* Add Button */}
          <button className="w-8 h-8 mb-5 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600 transition-colors">
            <Plus size={16} className="text-gray-300" />
          </button>

          {/* Navigation Icons */}
          <div className="flex flex-col space-y-4">
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded transition-colors">
              <Home size={16} className="text-gray-300" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded transition-colors">
              <Globe size={16} className="text-gray-300" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded transition-colors">
              <Layers size={16} className="text-gray-300" />
            </button>
          </div>
        </div>

        {/* bottom left-sidebar */}
        <div className="flex flex-col justify-center items-center gap-3">
          <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded transition-colors">
            <Bell size={16} className="text-gray-300" />
          </button>
          {/* Profile */}
          <div className="mt-auto flex flex-col items-center justify-center">
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">S</span>
            </div>
            <div className="text-xs text-gray-400 mt-1 text-center">
              Account
            </div>
          </div>

          {/* Bottom Icons */}
          <div className="flex flex-col space-y-4">
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded transition-colors">
              <Zap size={16} className="text-gray-300" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded transition-colors">
              <Download size={16} className="text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Top Navigation */}
        <div className="h-16 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center space-x-8">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              {/* <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <Globe size={20} className="text-gray-900" />
              </div> */}
              <h1 className="text-2xl font-bold">Discover</h1>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-6">
              <button className="px-3 py-2 text-teal-400 border-b-2 border-teal-400 font-medium">
                For You
              </button>
              <button className="px-3 py-2 text-gray-400 hover:text-white transition-colors">
                Top
              </button>
              <button className="px-3 py-2 text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                <Layers size={16} />
                <span>Topics</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded text-white font-medium flex items-center space-x-2 transition-colors">
              <Share size={16} />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Content Area with Right Sidebar */}
        <div className="flex-1 flex">
          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">
                Altman says new ChatGPT features will require premium
                subscriptions
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                📅 Published 21 hours ago
              </p>
              <p className="text-gray-300 leading-relaxed">
                The OpenAI CEO announces compute-intensive capabilities coming
                in weeks, with some limited to $200 monthly Pro subscribers and
                others requiring additional fees.
              </p>
              <div className="flex items-center mt-4 space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                </div>
                <span className="text-gray-400 text-sm">51 sources</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-gray-800 p-6 space-y-6">
            {/* Weather Widget */}
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">30°</span>
                <span className="text-gray-400">°C</span>
                <button className="text-gray-400 text-sm">Clear</button>
              </div>
              <p className="text-gray-400 text-sm mb-4">Chandni Chowk, Delhi</p>
              <p className="text-gray-500 text-xs mb-4">11:35° | >30°</p>

              <div className="flex justify-between">
                <div className="text-center">
                  <Sun size={16} className="text-yellow-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-400">35°</div>
                  <div className="text-xs text-gray-500">Tue</div>
                </div>
                <div className="text-center">
                  <Cloud size={16} className="text-gray-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-400">35°</div>
                  <div className="text-xs text-gray-500">Wed</div>
                </div>
                <div className="text-center">
                  <CloudRain size={16} className="text-blue-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-400">35°</div>
                  <div className="text-xs text-gray-500">Thu</div>
                </div>
                <div className="text-center">
                  <Cloud size={16} className="text-gray-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-400">36°</div>
                  <div className="text-xs text-gray-500">Fri</div>
                </div>
                <div className="text-center">
                  <Sun size={16} className="text-yellow-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-400">37°</div>
                  <div className="text-xs text-gray-500">Sat</div>
                </div>
              </div>
            </div>

            {/* Market Outlook */}
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold mb-4">Market Outlook</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">S&P 500</div>
                    <div className="text-xs text-gray-400">^SPX</div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-400">▼ 0.26%</div>
                    <div className="text-xs text-gray-400">-17.23</div>
                  </div>
                </div>
                <div className="text-2xl font-bold">6,676.51</div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">NASDAQ</div>
                    <div className="text-xs text-gray-400">^NMO</div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-400">▼ 0.41%</div>
                    <div className="text-xs text-gray-400">-92.53t</div>
                  </div>
                </div>
                <div className="text-2xl font-bold">22,696.443</div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">VIX</div>
                    <div className="text-xs text-gray-400">^VIX</div>
                  </div>
                  <div className="text-right">
                    <div className="text-teal-400">▲ 1.61%</div>
                    <div className="text-xs text-gray-400">+0.26</div>
                  </div>
                </div>
                <div className="text-xl font-bold">16.36</div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">Bitcoin</div>
                    <div className="text-xs text-gray-400">BTCUSD</div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-400">▼ 0.18%</div>
                    <div className="text-xs text-gray-400">-$199.78</div>
                  </div>
                </div>
                <div className="text-xl font-bold">$112,572.05</div>
              </div>
            </div>

            {/* Trending Companies */}
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold mb-4">Trending Companies</h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">N</span>
                  </div>
                  <div>
                    <div className="font-semibold">NVIDIA Corporation</div>
                    <div className="text-xs text-gray-400">NVDA</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">$179.47</div>
                  <div className="text-teal-400 text-xs">2.25%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
