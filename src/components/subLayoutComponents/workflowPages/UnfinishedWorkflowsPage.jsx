import { useState, useEffect } from "react";
import {
  Search,
  MoreHorizontal,
  Play,
  Pause,
  Clock,
  AlertCircle,
  RefreshCw,
  Trash2,
  Edit3,
  Copy,
  Archive,
  Eye,
  RotateCcw,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";

const UnfinishedWorkflowsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toolIcons = {
    zoom: {
      icon: "📹",
      name: "Zoom",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    googledrive: {
      icon: "📁",
      name: "Google Drive",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    slack: {
      icon: "💬",
      name: "Slack",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    gmail: {
      icon: "✉️",
      name: "Gmail",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    notion: {
      icon: "📝",
      name: "Notion",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    trello: {
      icon: "📋",
      name: "Trello",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    dropbox: {
      icon: "📦",
      name: "Dropbox",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    spotify: {
      icon: "🎵",
      name: "Spotify",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    youtube: {
      icon: "🎥",
      name: "YouTube",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    twitter: {
      icon: "🐦",
      name: "Twitter",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    github: {
      icon: "🐙",
      name: "GitHub",
      color: "from-minimal-primary to-minimal-gray-600",
    },
    discord: {
      icon: "🎮",
      name: "Discord",
      color: "from-minimal-primary to-minimal-gray-600",
    },
  };

  const unfinishedWorkflows = [
    {
      id: "uf-1",
      title: "Receive Zoom recording and upload to Google Drive",
      tools: ["zoom", "googledrive"],
      progress: 67,
      currentStep: 2,
      totalSteps: 3,
      stepDescription: "Processing video file",
      status: "processing",
      startedAt: "2 hours ago",
      estimatedCompletion: "5 minutes",
      lastActivity: "1 minute ago",
      errorMessage: null,
      steps: [
        {
          id: 1,
          name: "Receive Zoom recording",
          status: "completed",
          duration: "2.3s",
        },
        {
          id: 2,
          name: "Process video file",
          status: "in-progress",
          duration: "ongoing",
        },
        {
          id: 3,
          name: "Upload to Google Drive",
          status: "pending",
          duration: "N/A",
        },
      ],
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return (
          <RefreshCw className="w-4 h-4 text-minimal-primary animate-spin" />
        );
      case "waiting":
        return <Clock className="w-4 h-4 text-minimal-gray-400" />;
      case "error":
        return <XCircle className="w-4 h-4 text-minimal-gray-400" />;
      case "paused":
        return <Pause className="w-4 h-4 text-minimal-gray-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-minimal-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "text-minimal-primary bg-minimal-primary/10 border-minimal-primary/30";
      default:
        return "text-minimal-gray-400 bg-minimal-gray-400/10 border-minimal-gray-400/30";
    }
  };

  const toggleMenu = (workflowId, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === workflowId ? null : workflowId);
  };

  const menuOptions = [
    { icon: Play, label: "Resume Workflow", action: "resume" },
    { icon: RotateCcw, label: "Restart from Beginning", action: "restart" },
    { icon: Pause, label: "Pause Workflow", action: "pause" },
    { icon: Eye, label: "View Details", action: "view" },
    { icon: Edit3, label: "Edit Workflow", action: "edit" },
    { icon: Copy, label: "Duplicate", action: "duplicate" },
    { icon: Archive, label: "Archive", action: "archive" },
    { icon: Trash2, label: "Cancel & Delete", action: "delete" },
  ];

  const filteredWorkflows = unfinishedWorkflows.filter(
    (wf) =>
      wf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wf.stepDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-minimal-background ml-16 md:ml-20 overflow-x-hidden">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Unfinished Workflows
          </h1>
          <p className="text-minimal-muted text-sm sm:text-lg mt-2">
            Monitor workflows that are still running or need your attention
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="bg-minimal-card/80 border border-minimal-border rounded-xl p-2 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Search className="ml-3 w-5 h-5 text-minimal-muted" />
              <input
                type="text"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search unfinished workflows..."
                className="w-full bg-transparent outline-none py-3 pr-4 text-white placeholder-minimal-muted"
              />
            </div>
          </div>
        </div>

        {/* Workflows List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredWorkflows.map((workflow) => {
            const isMenuOpen = openMenuId === workflow.id;

            return (
              <div
                key={workflow.id}
                className="relative bg-minimal-card/70 border border-minimal-border rounded-xl p-6 backdrop-blur-xl hover:border-minimal-primary transition"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Left side */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    {/* Tool Chain */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {workflow.tools.map((tool, index) => (
                        <div key={tool} className="flex items-center relative">
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-r ${toolIcons[tool].color} flex items-center justify-center shadow-lg text-sm`}
                          >
                            {toolIcons[tool].icon}
                          </div>

                          {index < workflow.tools.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-minimal-muted mx-1" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Status */}
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getStatusColor(
                        workflow.status
                      )}`}
                    >
                      {getStatusIcon(workflow.status)}
                      <span className="capitalize">{workflow.status}</span>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="relative self-start sm:self-center">
                    <button
                      onClick={(e) => toggleMenu(workflow.id, e)}
                      className="p-2 rounded-lg hover:bg-minimal-cardHover transition"
                    >
                      <MoreHorizontal className="w-5 h-5 text-minimal-muted" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-minimal-card border border-minimal-border rounded-xl shadow-2xl z-50 backdrop-blur-lg">
                        {menuOptions.map((opt, idx) => (
                          <button
                            key={idx}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-minimal-cardHover text-white"
                          >
                            <opt.icon className="w-4 h-4" />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-white font-semibold text-lg mt-4 leading-snug">
                  {workflow.title}
                </h3>

                {/* Step Description */}
                <p className="text-minimal-muted text-sm mt-2">
                  {workflow.stepDescription}
                </p>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredWorkflows.length === 0 && (
          <div className="text-center mt-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-minimal-card/60 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-minimal-muted" />
            </div>
            <h3 className="text-white text-xl font-semibold">
              No unfinished workflows found
            </h3>
            <p className="text-minimal-muted text-sm mt-2">
              {searchQuery.length
                ? "Try adjusting your search terms"
                : "Everything is completed!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnfinishedWorkflowsPage;
