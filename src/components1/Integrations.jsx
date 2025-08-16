import React, { useState } from "react";
import {
  MessageSquare,
  Chrome,
  Users,
  MessageCircle,
  Send,
  Instagram,
  Bot,
  Gem,
  Search,
  Brain,
  Feather,
  Video,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Github,
  Plus,
  Zap,
  Star,
  Check,
} from "lucide-react";
import { FaGoogleDrive, FaSearch } from "react-icons/fa";
import {
  SiGooglecalendar,
  SiGoogledocs,
  SiGooglemeet,
  SiGooglesheets,
} from "react-icons/si";

const categorizedTools = {
  Google: [
    {
      name: "Google Drive",
      icon: <FaGoogleDrive />,
      description: "Cloud storage service for files.",
      rating: 490,
      reviews: 200,
    },
    {
      name: "Google Docs",
      icon: <SiGoogledocs />,
      description: "Online word processor for documents.",
      rating: 420,
      reviews: 170,
    },
    {
      name: "Google Meet",
      icon: <SiGooglemeet />,
      description: "Video conferencing platform.",
      rating: 300,
      reviews: 90,
    },
    {
      name: "Google Sheets",
      icon: <SiGooglesheets />,
      description: "Online spreadsheet tool.",
      rating: 360,
      reviews: 100,
    },
    {
      name: "Google Calendar",
      icon: <SiGooglecalendar />,
      description: "Calendar app for scheduling events.",
      rating: 400,
      reviews: 140,
    },
  ],
  Messaging: [
    {
      name: "WhatsApp by Twilio",
      icon: <MessageSquare />,
      description: "Customer support via WhatsApp.",
      rating: 21,
      reviews: 6,
    },
    {
      name: "Discord",
      icon: <MessageCircle />,
      description: "Community and voice chat app.",
      rating: 410,
      reviews: 120,
    },
    {
      name: "Telegram",
      icon: <Send />,
      description: "Secure cloud messaging.",
      rating: 380,
      reviews: 98,
    },
    {
      name: "Dealbot for Slack",
      icon: <MessageSquare />,
      description: "Slack bot for deals.",
      rating: 337,
      reviews: 63,
    },
  ],
  "AI Tools": [
    {
      name: "ChatGPT",
      icon: <Bot />,
      description: "AI chatbot by OpenAI.",
      rating: 490,
      reviews: 200,
      byok: true,
    },
    {
      name: "Gemini",
      icon: <Gem />,
      description: "Google's AI assistant.",
      rating: 420,
      reviews: 170,
      byok: true,
    },
    {
      name: "DeepSeek",
      icon: <Search />,
      description: "AI search and summarizer.",
      rating: 300,
      reviews: 90,
      byok: true,
    },
    {
      name: "Perplexity AI",
      icon: <Brain />,
      description: "Answer engine with citations.",
      rating: 360,
      reviews: 100,
      byok: true,
    },
    {
      name: "Notion AI",
      icon: <Feather />,
      description: "AI writing assistant in Notion.",
      rating: 400,
      reviews: 140,
      byok: true,
    },
    {
      name: "Slack GPT",
      icon: <MessageSquare />,
      description: "Slack AI features.",
      rating: 390,
      reviews: 110,
      byok: true,
    },
    {
      name: "Bing AI",
      icon: <Search />,
      description: "Microsoft's AI search assistant.",
      rating: 280,
      reviews: 75,
    },
    {
      name: "Facebook AI",
      icon: <Facebook />,
      description: "AI tools from Meta.",
      rating: 350,
      reviews: 85,
    },
    {
      name: "Twitter AI",
      icon: <Twitter />,
      description: "Content generation via X.",
      rating: 220,
      reviews: 40,
    },
    {
      name: "GitHub Copilot",
      icon: <Github />,
      description: "Code assistant by GitHub.",
      rating: 470,
      reviews: 180,
    },
  ],
  "Video Conferencing": [
    {
      name: "Google Meet",
      icon: <Video />,
      description: "Video calls with Google.",
      rating: 247,
      reviews: 30,
    },
    {
      name: "Microsoft Teams",
      icon: <Users />,
      description: "Team collaboration by Microsoft.",
      rating: 235,
      reviews: 59,
    },
    {
      name: "Zoom Meetings",
      icon: <Video />,
      description: "Video meetings with Zoom.",
      rating: 268,
      reviews: 79,
    },
  ],
  "Social Media": [
    {
      name: "Instagram",
      icon: <Instagram />,
      description: "Social media sharing app.",
      rating: 500,
      reviews: 150,
    },
    {
      name: "LinkedIn Tools",
      icon: <Linkedin />,
      description: "Professional content tools.",
      rating: 310,
      reviews: 70,
    },
    {
      name: "YouTube AI",
      icon: <Youtube />,
      description: "AI tools for creators.",
      rating: 430,
      reviews: 115,
    },
  ],
  Automation: [
    {
      name: "Zapier",
      icon: <Zap />,
      description: "Automation between apps.",
      rating: 430,
      reviews: 89,
    },
  ],
  "Browser Extensions": [
    {
      name: "Chrome Extensions",
      icon: <Chrome />,
      description: "Powerful AI Chrome extensions.",
      rating: 295,
      reviews: 67,
    },
  ],
};

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("New Integrations");
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");

  const categories = Object.keys(categorizedTools);

  const handlePlusClick = () => {
    setShowModal(true);
  };

  const handleSubmitEmail = () => {
    console.log("User email:", email);
    setShowModal(false);
    setEmail("");
  };

  // Filter tools based on search query
  const filterTools = (tools) => {
    if (!searchQuery) return tools;
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // const renderStars = (rating) => {
  //   const stars = Math.min(5, Math.max(1, Math.floor(rating / 100)));
  //   return (
  //     <div className="flex items-center gap-1">
  //       {[...Array(5)].map((_, i) => (
  //         <Star
  //           key={i}
  //           className={`w-3 h-3 ${
  //             i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-500"
  //           }`}
  //         />
  //       ))}
  //       <span className="text-xs text-gray-400 ml-1">({rating})</span>
  //     </div>
  //   );
  // };

  const renderTools = (category) => {
    let toolsToRender = [];

    toolsToRender =
      category === "All"
        ? categories.flatMap((cat) => categorizedTools[cat])
        : categorizedTools[category];

    if (category === "BYOK") {
      toolsToRender = Object.values(categorizedTools)
        .flat()
        .filter((tool) => tool.byok === true);
    }

    console.log(toolsToRender);

    toolsToRender = filterTools(toolsToRender);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {toolsToRender.map((tool, index) => (
          <div
            key={index}
            className="bg-[#23b5b5] bg-opacity-20 border border-teal-400 rounded-xl p-5 hover:bg-opacity-40 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-500/30 relative group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                {tool.icon}
              </div>
              <button
                onClick={handlePlusClick}
                className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white transition-all duration-200 transform hover:scale-110 shadow-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-teal-300 transition-colors flex items-center gap-2">
              {tool.name}
              {tool.byok && (
                <span className="bg-black text-white text-[10px] px-2 py-[2px] rounded-md border border-gray-500">
                  BYOK
                </span>
              )}
            </h3>

            <p className="text-gray-300 text-xs leading-relaxed mb-3">
              {tool.description}
            </p>

            {/* <div className="flex items-center justify-between">
              {renderStars(tool.rating)}
              <span className="text-xs text-gray-400">
                {tool.reviews} reviews
              </span>
            </div> */}
          </div>
        ))}
      </div>
    );
  };

  // Enhanced "My Integrations" with connected status
  const renderMyIntegrations = () => {
    const myIntegrations = [
      {
        name: "YouTube",
        icon: <Youtube />,
        description: "A platform to share videos",
        connected: true,
        lastSync: "2 hours ago",
      },
      {
        name: "Google Docs",
        icon: <SiGoogledocs />,
        description: "AI chatbot by OpenAI",
        connected: false,
        lastSync: "5 minutes ago",
      },
      {
        name: "ChatGPT",
        icon: <Bot />,
        description: "AI chatbot by OpenAI",
        connected: true,
        lastSync: "5 minutes ago",
      },
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {myIntegrations.map((tool, index) => (
          <div
            key={index}
            className="bg-teal-800 bg-opacity-30 border border-teal-600 rounded-xl p-5 hover:bg-opacity-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/20 relative group"
          >
            {/* Connected status indicator */}
            <div className="absolute top-3 right-3 flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  tool.connected ? "bg-green-400" : "bg-red-400"
                } animate-pulse`}
              ></div>
              <span className="text-xs text-gray-400">
                {tool.connected ? "Connected" : "Disconnected"}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg flex items-center justify-center text-white">
                {tool.icon}
              </div>
              <h3 className="text-white font-semibold text-sm">{tool.name}</h3>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed mb-3">
              {tool.description}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Last sync: {tool.lastSync}</span>
              <div
                className={`flex items-center gap-1 ${
                  tool.connected ? "text-green-400" : "text-gray-400"
                } `}
              >
                <Check className="w-3 h-3" />
                <span>{tool.connected ? "Active" : "Inctive"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Get total count for display
  const getTotalCount = () => {
    let toolsToRender =
      selectedCategory === "All"
        ? categories.flatMap((cat) => categorizedTools[cat])
        : categorizedTools[selectedCategory] || [];

    return filterTools(toolsToRender).length;
  };

  // MODAL COMPONENT
  const EmailModal = ({ email, setEmail, onClose, onSubmit }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="bg-[#0f4c4c] border border-teal-500 rounded-2xl shadow-2xl p-6 w-96">
        <h2 className="text-lg font-semibold text-white mb-4">
          Enter your email
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:border-teal-400"
          autoFocus
        />
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-700 text-white hover:from-teal-400 hover:to-teal-600 shadow-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-minimal-background via-minimal-dark-100 to-minimal-dark-200 text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-400/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent mb-2">
            Integrations
          </h1>
          <p className="text-gray-400 text-lg">
            Connect your favorite tools and services
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20  transition-all duration-200"
            />
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex justify-center gap-4 mb-8">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedCategory === "All"
                  ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg transform scale-105"
                  : "bg-gray-800/50 border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory("BYOK")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedCategory === "BYOK"
                  ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg transform scale-105"
                  : "bg-gray-800/50 border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500"
              }`}
            >
              BYOK
            </button>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg transform scale-105"
                    : "bg-gray-800/50 border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex gap-1 bg-gray-800/30 rounded-xl p-1 w-fit mx-auto">
          <button
            onClick={() => setActiveTab("New Integrations")}
            className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === "New Integrations"
                ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
            }`}
          >
            New Integrations
          </button>
          <button
            onClick={() => setActiveTab("My Integrations")}
            className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === "My Integrations"
                ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
            }`}
          >
            My Integrations
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative px-6 pb-8">
        {/* Results Summary */}
        {searchQuery && (
          <div className="mb-6 text-center">
            <p className="text-gray-400">
              Found {getTotalCount()} results for "
              <span className="text-teal-400">{searchQuery}</span>"
            </p>
          </div>
        )}

        {activeTab === "New Integrations"
          ? renderTools(selectedCategory)
          : renderMyIntegrations()}

        {showModal && (
          <EmailModal
            email={email}
            setEmail={setEmail}
            onClose={() => setShowModal(false)}
            onSubmit={handleSubmitEmail}
          />
        )}

        {/* Empty State */}
        {((activeTab === "New Integrations" && getTotalCount() === 0) ||
          (activeTab === "My Integrations" && false)) && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No integrations found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
