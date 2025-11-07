import React, { useState } from "react";
import {
  Zap,
  Plus,
  Trash2,
  ExternalLink,
  ChevronDown,
  MessageSquare,
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
  Chrome,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogleDrive } from "react-icons/fa";
import {
  SiGooglecalendar,
  SiGoogledocs,
  SiGooglemeet,
  SiGooglesheets,
} from "react-icons/si";

const allIntegrations = {
  Google: [
    {
      id: "google-drive",
      name: "Google Drive",
      icon: "🗂️",
      description: "Cloud storage service for files.",
    },
    {
      id: "google-docs",
      name: "Google Docs",
      icon: "📄",
      description: "Online word processor for documents.",
    },
    {
      id: "google-meet",
      name: "Google Meet",
      icon: "📹",
      description: "Video conferencing platform.",
    },
    {
      id: "google-sheets",
      name: "Google Sheets",
      icon: "📊",
      description: "Online spreadsheet tool.",
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      icon: "📅",
      description: "Calendar app for scheduling events.",
    },
  ],
  Messaging: [
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: "💬",
      description: "Customer support via WhatsApp.",
    },
    {
      id: "discord",
      name: "Discord",
      icon: "🎮",
      description: "Community and voice chat app.",
    },
    {
      id: "telegram",
      name: "Telegram",
      icon: "✈️",
      description: "Secure cloud messaging.",
    },
    {
      id: "slack",
      name: "Slack",
      icon: "🎯",
      description: "Team messaging and collaboration.",
    },
    {
      id: "microsoft-teams",
      name: "Microsoft Teams",
      icon: "👥",
      description: "Enterprise chat and meetings.",
    },
    {
      id: "rocketchat",
      name: "Rocket.Chat",
      icon: "🚀",
      description: "Open source team chat.",
    },
  ],
  "AI Tools": [
    {
      id: "chatgpt",
      name: "ChatGPT",
      icon: "🤖",
      description: "AI chatbot by OpenAI.",
    },
    {
      id: "gemini",
      name: "Gemini",
      icon: "✨",
      description: "Google's AI assistant.",
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      icon: "🔍",
      description: "AI search and summarizer.",
    },
    {
      id: "perplexity",
      name: "Perplexity AI",
      icon: "🧠",
      description: "Answer engine with citations.",
    },
    {
      id: "notion-ai",
      name: "Notion AI",
      icon: "🪶",
      description: "AI writing assistant in Notion.",
    },
    {
      id: "copilot",
      name: "GitHub Copilot",
      icon: "⚙️",
      description: "Code assistant by GitHub.",
    },
    {
      id: "claude",
      name: "Claude AI",
      icon: "🎭",
      description: "Advanced AI assistant by Anthropic.",
    },
    {
      id: "llama",
      name: "Meta Llama",
      icon: "🦙",
      description: "Open source AI model.",
    },
  ],
  "Video Conferencing": [
    {
      id: "zoom",
      name: "Zoom",
      icon: "📞",
      description: "Video meetings and webinars.",
    },
    {
      id: "teams-video",
      name: "Teams Video",
      icon: "🎬",
      description: "Microsoft Teams meetings.",
    },
    {
      id: "google-meet",
      name: "Google Meet",
      icon: "📱",
      description: "Google video conferencing.",
    },
    {
      id: "jitsi",
      name: "Jitsi Meet",
      icon: "🌐",
      description: "Open source video conferencing.",
    },
  ],
  "Social Media": [
    {
      id: "instagram",
      name: "Instagram",
      icon: "📸",
      description: "Social media sharing app.",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "💼",
      description: "Professional network.",
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: "🎥",
      description: "Video platform integration.",
    },
    {
      id: "twitter",
      name: "Twitter/X",
      icon: "𝕏",
      description: "Social media posts.",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "👤",
      description: "Social media network.",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: "🎵",
      description: "Short form video platform.",
    },
  ],
  Automation: [
    {
      id: "zapier",
      name: "Zapier",
      icon: "⚡",
      description: "Automation between apps.",
    },
    {
      id: "ifttt",
      name: "IFTTT",
      icon: "🔗",
      description: "If This Then That automation.",
    },
    {
      id: "make",
      name: "Make (Integromat)",
      icon: "🏗️",
      description: "Visual workflow automation.",
    },
    {
      id: "pabbly",
      name: "Pabbly Connect",
      icon: "🔄",
      description: "Workflow automation platform.",
    },
  ],
  "Developer Tools": [
    {
      id: "github",
      name: "GitHub",
      icon: "🐙",
      description: "Version control and collaboration.",
    },
    {
      id: "gitlab",
      name: "GitLab",
      icon: "🦊",
      description: "DevOps platform.",
    },
    {
      id: "bitbucket",
      name: "Bitbucket",
      icon: "🪣",
      description: "Git repository management.",
    },
    {
      id: "jenkins",
      name: "Jenkins",
      icon: "🔧",
      description: "CI/CD automation server.",
    },
    {
      id: "vercel",
      name: "Vercel",
      icon: "▲",
      description: "Frontend deployment platform.",
    },
    {
      id: "heroku",
      name: "Heroku",
      icon: "🦄",
      description: "Cloud platform for apps.",
    },
  ],
  "Project Management": [
    {
      id: "asana",
      name: "Asana",
      icon: "✅",
      description: "Project management tool.",
    },
    {
      id: "trello",
      name: "Trello",
      icon: "🃏",
      description: "Kanban board tool.",
    },
    {
      id: "jira",
      name: "Jira",
      icon: "🎯",
      description: "Issue and project tracking.",
    },
    {
      id: "monday",
      name: "Monday.com",
      icon: "📋",
      description: "Work management platform.",
    },
    {
      id: "notion",
      name: "Notion",
      icon: "📑",
      description: "All-in-one workspace.",
    },
  ],
  Analytics: [
    {
      id: "google-analytics",
      name: "Google Analytics",
      icon: "📈",
      description: "Website analytics.",
    },
    {
      id: "mixpanel",
      name: "Mixpanel",
      icon: "📊",
      description: "Product analytics platform.",
    },
    {
      id: "amplitude",
      name: "Amplitude",
      icon: "📉",
      description: "User analytics tool.",
    },
    {
      id: "segment",
      name: "Segment",
      icon: "🎯",
      description: "Customer data platform.",
    },
  ],
};

const IntegrationsSection = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: "slack",
      name: "Slack",
      description: "Get notifications and updates directly in Slack",
      icon: "🎯",
      connected: true,
      connectedDate: "Nov 1, 2025",
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Connect with thousands of apps via Zapier",
      icon: "⚡",
      connected: false,
    },
    {
      id: "github",
      name: "GitHub",
      description: "Sync your GitHub repositories and workflows",
      icon: "🐙",
      connected: true,
      connectedDate: "Oct 15, 2025",
    },
  ]);

  const [showAllIntegrations, setShowAllIntegrations] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  const removeIntegration = (id) => {
    setIntegrations(
      integrations.map((i) =>
        i.id === id ? { ...i, connected: false } : i
      )
    );
  };

  const addIntegration = (integration) => {
    const exists = integrations.some((i) => i.id === integration.id);
    if (exists) {
      setIntegrations(
        integrations.map((i) =>
          i.id === integration.id
            ? {
                ...i,
                connected: true,
                connectedDate: new Date().toLocaleDateString(),
              }
            : i
        )
      );
    } else {
      setIntegrations([
        ...integrations,
        {
          ...integration,
          connected: true,
          connectedDate: new Date().toLocaleDateString(),
        },
      ]);
    }
  };

  const getAllAvailableIntegrations = () => {
    const allTools = Object.values(allIntegrations).flat();
    return allTools.filter((tool) => !integrations.some((i) => i.id === tool.id));
  };

  const availableIntegrations = getAllAvailableIntegrations();
  const categories = Object.keys(allIntegrations);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Integrations</h2>
        <p className="text-gray-400">
          Connect external services and tools to enhance your workflow
        </p>
      </div>

      {/* Connected Integrations */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-white mb-4">
          Connected Integrations ({integrations.filter((i) => i.connected).length})
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {integrations.filter((i) => i.connected).length > 0 ? (
            integrations
              .filter((i) => i.connected)
              .map((integration, index) => (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-gradient-to-br from-[#1a2530] to-[#0f1a20] border border-[#23b5b5]/20 rounded-xl p-5 flex items-center justify-between hover:border-[#23b5b5]/40 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{integration.icon}</div>
                    <div>
                      <p className="text-white font-medium">{integration.name}</p>
                      <p className="text-sm text-gray-400">
                        {integration.description}
                      </p>
                      {integration.connectedDate && (
                        <p className="text-xs text-[#23b5b5] mt-1">
                          Connected on {integration.connectedDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <motion.button
                    onClick={() => removeIntegration(integration.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/15 border border-red-500/40 text-red-400 rounded-lg hover:bg-red-500/25 transition-all duration-200 font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Disconnect
                  </motion.button>
                </motion.div>
              ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              No integrations connected yet
            </div>
          )}
        </div>
      </div>

      {/* View More / Collapse Button */}
      <motion.button
        onClick={() => setShowAllIntegrations(!showAllIntegrations)}
        className="w-full mb-8 px-4 py-3 rounded-lg bg-[#23b5b5]/15 border border-[#23b5b5]/40 text-[#23b5b5] font-medium hover:bg-[#23b5b5]/25 transition-all duration-200 flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          animate={{ rotate: showAllIntegrations ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
        {showAllIntegrations ? "Read Less" : "Read More"} (
        {availableIntegrations.length} available)
      </motion.button>

      {/* All Available Integrations by Category */}
      <AnimatePresence>
        {showAllIntegrations && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 mb-8 border-t border-[#23b5b5]/10 pt-8"
          >
            {categories.map((category, catIndex) => {
              const categoryTools = (allIntegrations[category] || []).filter(
                (tool) => !integrations.some((i) => i.id === tool.id)
              );

              if (categoryTools.length === 0) return null;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: catIndex * 0.05 }}
                >
                  {/* Category Header */}
                  <motion.button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#23b5b5]/10 to-[#23b5b5]/5 border border-[#23b5b5]/20 hover:border-[#23b5b5]/40 transition-all duration-200 mb-3 group"
                    whileHover={{ backgroundColor: "rgba(35, 181, 181, 0.15)" }}
                  >
                    <h4 className="text-lg font-semibold text-white group-hover:text-[#23b5b5] transition-colors">
                      {category} ({categoryTools.length})
                    </h4>
                    <motion.div
                      animate={{
                        rotate: expandedCategories[category] ? 180 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-[#23b5b5]" />
                    </motion.div>
                  </motion.button>

                  {/* Category Items */}
                  <AnimatePresence>
                    {expandedCategories[category] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6"
                      >
                        {categoryTools.map((tool, toolIndex) => (
                          <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.2,
                              delay: toolIndex * 0.03,
                            }}
                            className="bg-gradient-to-br from-[#1a2530] to-[#0f1a20] border border-[#23b5b5]/20 rounded-lg p-4 flex items-center justify-between hover:border-[#23b5b5]/40 transition-all duration-200 group"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="text-2xl flex-shrink-0">
                                {tool.icon}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-white font-medium text-sm truncate group-hover:text-[#23b5b5] transition-colors">
                                  {tool.name}
                                </p>
                                <p className="text-xs text-gray-400 line-clamp-1">
                                  {tool.description}
                                </p>
                              </div>
                            </div>

                            <motion.button
                              onClick={() => addIntegration(tool)}
                              className="flex items-center gap-2 px-3 py-2 bg-[#23b5b5]/15 border border-[#23b5b5]/40 text-[#23b5b5] rounded-lg hover:bg-[#23b5b5]/25 transition-all duration-200 font-medium text-xs ml-2 flex-shrink-0 whitespace-nowrap"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Plus className="w-3 h-3" />
                              Connect
                            </motion.button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pro Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="p-5 bg-[#23b5b5]/10 border border-[#23b5b5]/30 rounded-xl flex items-center gap-3"
      >
        <Zap className="w-5 h-5 text-[#23b5b5] flex-shrink-0" />
        <p className="text-[#23b5b5] text-sm">
          <span className="font-medium">Pro tip:</span> Integrations allow you
          to automate workflows and connect with your favorite tools seamlessly.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default IntegrationsSection;
