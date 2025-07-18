import React, { useState } from "react";
import { User, ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  FaSlack, FaGoogle, FaMicrosoft, FaWhatsapp, FaDiscord, FaTelegram, FaInstagram,
  FaRobot, FaGem, FaSearch, FaBrain, FaFeatherAlt, FaComments, FaFacebook,
  FaTwitter, FaLinkedin, FaYoutube, FaGithub, FaChrome
} from "react-icons/fa";

const categorizedTools = {
  "Messaging": [
    { name: "WhatsApp by Twilio", icon: <FaWhatsapp />, description: "Customer support via WhatsApp.", rating: 21, reviews: 6 },
    { name: "Discord", icon: <FaDiscord />, description: "Community and voice chat app.", rating: 410, reviews: 120 },
    { name: "Telegram", icon: <FaTelegram />, description: "Secure cloud messaging.", rating: 380, reviews: 98 },
    { name: "Dealbot for Slack", icon: <FaSlack />, description: "Slack bot for deals.", rating: 337, reviews: 63 },
  ],
  "AI Tools": [
    { name: "ChatGPT", icon: <FaRobot />, description: "AI chatbot by OpenAI.", rating: 490, reviews: 200 },
    { name: "Gemini", icon: <FaGem />, description: "Google's AI assistant.", rating: 420, reviews: 170 },
    { name: "DeepSeek", icon: <FaSearch />, description: "AI search and summarizer.", rating: 300, reviews: 90 },
    { name: "Perplexity AI", icon: <FaBrain />, description: "Answer engine with citations.", rating: 360, reviews: 100 },
    { name: "Notion AI", icon: <FaFeatherAlt />, description: "AI writing assistant in Notion.", rating: 400, reviews: 140 },
    { name: "Slack GPT", icon: <FaSlack />, description: "Slack AI features.", rating: 390, reviews: 110 },
    { name: "Bing AI", icon: <FaMicrosoft />, description: "Microsoft's AI search assistant.", rating: 280, reviews: 75 },
    { name: "Facebook AI", icon: <FaFacebook />, description: "AI tools from Meta.", rating: 350, reviews: 85 },
    { name: "Twitter AI", icon: <FaTwitter />, description: "Content generation via X.", rating: 220, reviews: 40 },
    { name: "GitHub Copilot", icon: <FaGithub />, description: "Code assistant by GitHub.", rating: 470, reviews: 180 },
  ],
  "Video Conferencing": [
    { name: "Google Meet", icon: <FaGoogle />, description: "Video calls with Google.", rating: 247, reviews: 30 },
    { name: "Microsoft Teams", icon: <FaMicrosoft />, description: "Team collaboration by Microsoft.", rating: 235, reviews: 59 },
    { name: "Zoom Meetings", icon: <FaComments />, description: "Video meetings with Zoom.", rating: 268, reviews: 79 },
  ],
  "Social Media": [
    { name: "Instagram", icon: <FaInstagram />, description: "Social media sharing app.", rating: 500, reviews: 150 },
    { name: "LinkedIn Tools", icon: <FaLinkedin />, description: "Professional content tools.", rating: 310, reviews: 70 },
    { name: "YouTube AI", icon: <FaYoutube />, description: "AI tools for creators.", rating: 430, reviews: 115 },
  ],
  "Automation": [
    { name: "Zapier", icon: <FaFeatherAlt />, description: "Automation between apps.", rating: 430, reviews: 89 },
  ],
  "Browser Extensions": [
    { name: "Chrome Extensions", icon: <FaChrome />, description: "Powerful AI Chrome extensions.", rating: 295, reviews: 67 },
  ],
};

export default function IntegrationsPage() {
  const navigate = useNavigate();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = Object.keys(categorizedTools);

  const renderTools = (category) => {
    const toolsToRender = category === "All" ? categories.flatMap(cat => categorizedTools[cat]) : categorizedTools[category] || [];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {toolsToRender.map((tool, index) => (
          <div key={index} className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-[#23b5b5] text-xl">{tool.icon}</div>
              <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
            </div>
            <p className="text-gray-300 text-sm mb-3">{tool.description}</p>
            <div className="flex justify-between text-sm text-gray-400">
              <span>⭐⭐⭐⭐ {tool.rating}</span>
              <span>{tool.reviews} reviews</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="w-full bg-black text-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-800 gap-2">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <img
            src="/Explified_logo.png"
            alt="Logo"
            className="ml-4 w-10 h-10"
            onClick={() => navigate("/")}
          />
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => navigate("/")} className="px-4 py-1 rounded hover:bg-gray-700">Home</button>
            <button onClick={() => navigate("/history")} className="px-4 py-1 rounded hover:bg-gray-700">History</button>
            <button onClick={() => navigate("/integrations")} className="px-4 py-1 rounded bg-gray-800 border border-white">Integrations</button>
          </div>
        </div>
        <div className="relative">
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
                <p className="font-medium">Srijan Ranjan</p>
                <p className="text-sm text-gray-300">srijanranjan@gmail.com</p>
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

      <div className="flex flex-col lg:flex-row">
        <aside className="w-full lg:w-64 p-6 border-b lg:border-b-0 lg:border-r border-gray-800 bg-black space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-[#23b5b5]">Categories</h2>
            <ul className="space-y-2">
              <li
                onClick={() => setSelectedCategory("All")}
                className={`cursor-pointer hover:text-[#23b5b5] ${selectedCategory === "All" ? "text-[#23b5b5]" : ""}`}
              >
                All
              </li>
              {categories.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => setSelectedCategory(item)}
                  className={`cursor-pointer hover:text-[#23b5b5] ${selectedCategory === item ? "text-[#23b5b5]" : ""}`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="flex-1 p-6 sm:p-8 md:p-10">
          <h1 className="text-2xl font-bold text-[#23b5b5] mb-6 text-center sm:text-left">
            {selectedCategory === "All" ? "All Categories" : selectedCategory}
          </h1>
          {renderTools(selectedCategory)}
        </main>
      </div>
    </div>
  );
}
