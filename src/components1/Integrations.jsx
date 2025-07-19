import React, { useState } from "react";
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
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-[#23b5b5] mb-4">Integrations</h1>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded border ${selectedCategory === "All" ? "bg-[#23b5b5] text-black" : "border-[#23b5b5] text-white hover:bg-[#23b5b5] hover:text-black"}`}
          >
            All
          </button>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded border ${selectedCategory === cat ? "bg-[#23b5b5] text-black" : "border-[#23b5b5] text-white hover:bg-[#23b5b5] hover:text-black"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {renderTools(selectedCategory)}
    </div>
  );
}