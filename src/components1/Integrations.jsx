import React, { useEffect, useState } from "react";
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
import { FiChevronDown } from "react-icons/fi";
import { FaGoogleDrive, FaSearch } from "react-icons/fa";
import {
  SiGooglecalendar,
  SiGoogledocs,
  SiGooglemeet,
  SiGooglesheets,
} from "react-icons/si";
import SidebarOnHover from "../reusable_components/SidebarOnHover";
import { useNavigate } from "react-router-dom";

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

  const [placeholderText, setPlaceholderText] = useState("");
  const fullText = "Search integrations...";
  useEffect(() => {
    let i = 0;
    let forward = true;

    const interval = setInterval(() => {
      if (forward) {
        setPlaceholderText(fullText.slice(0, i + 1));
        i++;
        if (i === fullText.length) forward = false;
      } else {
        setPlaceholderText(fullText.slice(0, i - 1));
        i--;
        if (i === 0) forward = true;
      }
    }, 120); // speed of typing

    return () => clearInterval(interval);
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [showProviderHelp, setShowProviderHelp] = useState(false);

  const categories = Object.keys(categorizedTools);
  const navigate = useNavigate();

  const handlePlusClick = () => {
    setShowModal(true);
  };

  const handleSubmitEmail = () => {
    console.log("User email:", email);
    setShowModal(false);
    setEmail("");
  };

  const handleApiKeySubmit = () => {
    console.log(`API Key for ${selectedService}:`, apiKey);
    setShowApiKeyModal(false);
    setSelectedService(null);
    setApiKey("");
    // Here you would typically save the API key to your backend/database
  };

  const handleCardClick = (tool) => {
    if (tool.name === "ChatGPT" || tool.name === "Gemini") {
      setSelectedService(tool.name);
      setShowApiKeyModal(true);
      setShowProviderHelp(false);
    } else {
      navigate("/locked");
    }
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

    toolsToRender = filterTools(toolsToRender);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {toolsToRender.map((tool, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(tool)}
            className="px-6 py-4 rounded-2xl bg-gradient-to-br from-gray-950/80 to-gray-900/60 bg-opacity-70 border border-gray-800/40 backdrop-blur-md shadow-lg transition-all duration-200 hover:bg-gray-900/80 hover:shadow-cyan-700/20 hover:scale-[1.02] cursor-pointer"
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
            onClick={() => navigate("/locked")}
            className="px-6 py-4 rounded-2xl bg-gradient-to-br from-gray-950/80 to-gray-900/60 bg-opacity-70 border border-gray-800/40 backdrop-blur-md shadow-lg transition-all duration-200 hover:bg-gray-900/80 hover:shadow-cyan-700/20 hover:scale-[1.02] cursor-pointer"
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

  // MODAL COMPONENTS
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

  const ApiKeyModal = ({
    serviceName,
    apiKey,
    setApiKey,
    onClose,
    onSubmit,
  }) => {
    // Get the icon for the service
    const getServiceIcon = () => {
      if (serviceName === "ChatGPT")
        return <Bot className="text-black/80" size={18} />;
      if (serviceName === "Gemini")
        return <Gem className="text-black/80" size={18} />;
      return null;
    };

    // Help steps for each service
    const getHelpSteps = () => {
      if (serviceName === "ChatGPT") {
        return [
          "Visit OpenAI's website at openai.com",
          "Sign up or log in to your account",
          "Go to API section in your dashboard",
          "Create a new API key",
          "Copy the key and paste it here",
        ];
      }
      if (serviceName === "Gemini") {
        return [
          "Visit Google AI Studio at aistudio.google.com",
          "Sign in with your Google account",
          "Click on 'Get API key'",
          "Create a new API key",
          "Copy the key and paste it here",
        ];
      }
      return [];
    };

    const getDocUrl = () => {
      if (serviceName === "ChatGPT")
        return "https://platform.openai.com/api-keys";
      if (serviceName === "Gemini")
        return "https://aistudio.google.com/app/apikey";
      return "#";
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        <div
          className={`relative w-full ${
            showProviderHelp ? "max-w-3xl" : "max-w-2xl"
          } mx-4 bg-[#111213] border border-[#0f8b8d]/50 rounded-xl shadow-2xl p-5`}
        >
          <div>
            <button
              className="text-xs text-gray-300 hover:text-white mb-4"
              onClick={onClose}
            >
              ← Back
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center"
                style={{ background: "#23b5b5" }}
              >
                {getServiceIcon()}
              </div>
              <h4 className="text-white text-base font-semibold">
                {serviceName}
              </h4>
            </div>

            <label className="block text-xs text-gray-400 mb-1">API Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`Enter ${serviceName} API key`}
              className="w-full bg-black/30 border border-[#2a2a2a] rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-600"
              autoFocus
            />

            <div className="mt-2 flex items-center justify-between">
              <button
                type="button"
                className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300"
                onClick={() => setShowProviderHelp((v) => !v)}
                aria-expanded={showProviderHelp}
              >
                <span>Don't have a key?</span>
                <FiChevronDown
                  className={`transition-transform ${
                    showProviderHelp ? "rotate-180" : "rotate-0"
                  }`}
                  size={14}
                />
              </button>
            </div>

            <div
              className={`mt-3 overflow-hidden transition-all duration-300 ease-in-out ${
                showProviderHelp
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
              aria-hidden={!showProviderHelp}
            >
              <div className="border border-[#2a2a2a] rounded-lg p-3 bg-black/20">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center"
                    style={{ background: "#23b5b5" }}
                  >
                    {getServiceIcon()}
                  </div>
                  <h5 className="text-white text-sm font-medium">
                    How to get a key for {serviceName}
                  </h5>
                </div>
                <ol className="list-decimal list-inside text-sm text-gray-200 space-y-2">
                  {getHelpSteps().map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
                <div className="mt-2">
                  <a
                    href={getDocUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-teal-400 hover:text-teal-300"
                  >
                    Open official docs →
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-3 py-2 rounded-lg bg-[#191a1c] border border-[#2a2a2a] text-gray-200 hover:bg-[#1f2023]"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white"
                onClick={onSubmit}
                disabled={!apiKey.trim()}
              >
                Save & Use
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-minimal-background via-minimal-dark-100 to-minimal-dark-200 text-white">
      <SidebarOnHover
        link={"https://explified.com/integrations/"}
        toolName={"Integrations"}
      />

      {/* Animated background elements */}
      <div
        className="fixed inset-0 min-h-screen w-full opacity-30 pointer-events-none 
  bg-gradient-to-br from-transparent via-cyan-500 to-transparent 
  animate-pulse brightness-75 duration-[20s]"
        style={{ zIndex: 0 }}
      ></div>

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
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
            <input
              type="text"
              placeholder={placeholderText}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0F0F] border border-gray-700/60 rounded-2xl 
      pl-12 pr-4 py-4 text-white placeholder-gray-500
      focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-700/20 
      transition-all duration-200 shadow-md"
            />
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex justify-center gap-4 mb-8">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2 bg-gradient-to-br from-gray-900/80 to-gray-800/60 p-3 rounded-2xl shadow-md">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedCategory === "All"
                  ? "bg-gradient-to-r from-gray-800 to-gray-900 text-cyan-200 shadow-lg transform scale-105"
                  : "text-white hover:bg-gray-800/80 hover:text-cyan-500"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory("BYOK")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedCategory === "BYOK"
                  ? "bg-gradient-to-r from-gray-800 to-gray-900 text-cyan-200 shadow-lg transform scale-105"
                  : "text-white hover:bg-gray-800/80 hover:text-cyan-500"
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
                    ? "bg-gradient-to-r from-gray-800 to-gray-900 text-cyan-200 shadow-lg transform scale-105"
                    : "text-white hover:bg-gray-800/80 hover:text-cyan-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex gap-1 bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-xl p-1 w-fit mx-auto shadow-md">
          <button
            onClick={() => setActiveTab("New Integrations")}
            className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === "New Integrations"
                ? "bg-gradient-to-r from-gray-800 to-gray-900 text-cyan-200 shadow-lg"
                : "text-cyan-300 hover:bg-gray-800/80 hover:text-white"
            }`}
          >
            New Integrations
          </button>
          <button
            onClick={() => setActiveTab("My Integrations")}
            className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === "My Integrations"
                ? "bg-gradient-to-r from-gray-800 to-gray-900 text-cyan-200 shadow-lg"
                : "text-cyan-300 hover:bg-gray-800/80 hover:text-white"
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

        {showApiKeyModal && (
          <ApiKeyModal
            serviceName={selectedService}
            apiKey={apiKey}
            setApiKey={setApiKey}
            onClose={() => {
              setShowApiKeyModal(false);
              setSelectedService(null);
              setApiKey("");
              setShowProviderHelp(false);
            }}
            onSubmit={handleApiKeySubmit}
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
