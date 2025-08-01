import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Square,
  Clock,
  Calendar,
  AlertCircle,
  RefreshCw,
  Trash2,
  Edit3,
  Copy,
  Archive,
  Eye,
  RotateCcw,
  Zap,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";

const UnfinishedWorkflowsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Tool icons mapping
  const toolIcons = {
    zoom: {
      icon: "📹",
      name: "Zoom",
      color: "from-blue-500 to-blue-600",
    },
    googledrive: {
      icon: "📁",
      name: "Google Drive",
      color: "from-green-500 to-green-600",
    },
    slack: {
      icon: "💬",
      name: "Slack",
      color: "from-purple-500 to-purple-600",
    },
    gmail: {
      icon: "✉️",
      name: "Gmail",
      color: "from-red-500 to-red-600",
    },
    notion: {
      icon: "📝",
      name: "Notion",
      color: "from-gray-600 to-gray-700",
    },
    trello: {
      icon: "📋",
      name: "Trello",
      color: "from-blue-600 to-blue-700",
    },
    dropbox: {
      icon: "📦",
      name: "Dropbox",
      color: "from-blue-400 to-blue-500",
    },
    spotify: {
      icon: "🎵",
      name: "Spotify",
      color: "from-green-400 to-green-500",
    },
    youtube: {
      icon: "🎥",
      name: "YouTube",
      color: "from-red-600 to-red-700",
    },
    twitter: {
      icon: "🐦",
      name: "Twitter",
      color: "from-blue-400 to-blue-500",
    },
    github: {
      icon: "🐙",
      name: "GitHub",
      color: "from-gray-700 to-gray-800",
    },
    discord: {
      icon: "🎮",
      name: "Discord",
      color: "from-indigo-500 to-indigo-600",
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
    // {
    //   id: "uf-2",
    //   title: "Send Slack message when Trello card is moved",
    //   tools: ["trello", "slack"],
    //   progress: 33,
    //   currentStep: 1,
    //   totalSteps: 3,
    //   stepDescription: "Waiting for webhook trigger",
    //   status: "waiting",
    //   startedAt: "45 minutes ago",
    //   estimatedCompletion: "Waiting for trigger",
    //   lastActivity: "45 minutes ago",
    //   errorMessage: null,
    //   steps: [
    //     {
    //       id: 1,
    //       name: "Monitor Trello board",
    //       status: "in-progress",
    //       duration: "ongoing",
    //     },
    //     {
    //       id: 2,
    //       name: "Format message content",
    //       status: "pending",
    //       duration: "N/A",
    //     },
    //     {
    //       id: 3,
    //       name: "Send to Slack channel",
    //       status: "pending",
    //       duration: "N/A",
    //     },
    //   ],
    // },
    // {
    //   id: "uf-3",
    //   title: "Backup Gmail attachments to Dropbox weekly",
    //   tools: ["gmail", "dropbox"],
    //   progress: 85,
    //   currentStep: 3,
    //   totalSteps: 4,
    //   stepDescription: "Uploading files to Dropbox",
    //   status: "processing",
    //   startedAt: "30 minutes ago",
    //   estimatedCompletion: "2 minutes",
    //   lastActivity: "30 seconds ago",
    //   errorMessage: null,
    //   steps: [
    //     {
    //       id: 1,
    //       name: "Scan Gmail for attachments",
    //       status: "completed",
    //       duration: "12.4s",
    //     },
    //     {
    //       id: 2,
    //       name: "Filter and categorize files",
    //       status: "completed",
    //       duration: "8.7s",
    //     },
    //     {
    //       id: 3,
    //       name: "Upload to Dropbox",
    //       status: "in-progress",
    //       duration: "ongoing",
    //     },
    //     {
    //       id: 4,
    //       name: "Send completion report",
    //       status: "pending",
    //       duration: "N/A",
    //     },
    //   ],
    // },
    // {
    //   id: "uf-4",
    //   title: "Create Notion page from YouTube video transcript",
    //   tools: ["youtube", "notion"],
    //   progress: 12,
    //   currentStep: 1,
    //   totalSteps: 5,
    //   stepDescription: "Failed to fetch video transcript",
    //   status: "error",
    //   startedAt: "1 hour ago",
    //   estimatedCompletion: "Retry required",
    //   lastActivity: "45 minutes ago",
    //   errorMessage: "YouTube API rate limit exceeded",
    //   steps: [
    //     {
    //       id: 1,
    //       name: "Fetch video transcript",
    //       status: "failed",
    //       duration: "timeout",
    //     },
    //     {
    //       id: 2,
    //       name: "Process and format text",
    //       status: "pending",
    //       duration: "N/A",
    //     },
    //     { id: 3, name: "Generate summary", status: "pending", duration: "N/A" },
    //     {
    //       id: 4,
    //       name: "Create Notion page",
    //       status: "pending",
    //       duration: "N/A",
    //     },
    //     {
    //       id: 5,
    //       name: "Add tags and metadata",
    //       status: "pending",
    //       duration: "N/A",
    //     },
    //   ],
    // },
    // {
    //   id: "uf-5",
    //   title: "Post GitHub commits summary to Discord",
    //   tools: ["github", "discord"],
    //   progress: 45,
    //   currentStep: 2,
    //   totalSteps: 4,
    //   stepDescription: "Generating commit summary",
    //   status: "processing",
    //   startedAt: "15 minutes ago",
    //   estimatedCompletion: "3 minutes",
    //   lastActivity: "2 minutes ago",
    //   errorMessage: null,
    //   steps: [
    //     {
    //       id: 1,
    //       name: "Fetch recent commits",
    //       status: "completed",
    //       duration: "3.2s",
    //     },
    //     {
    //       id: 2,
    //       name: "Generate summary",
    //       status: "in-progress",
    //       duration: "ongoing",
    //     },
    //     {
    //       id: 3,
    //       name: "Format Discord message",
    //       status: "pending",
    //       duration: "N/A",
    //     },
    //     {
    //       id: 4,
    //       name: "Post to Discord channel",
    //       status: "pending",
    //       duration: "N/A",
    //     },
    //   ],
    // },
    // {
    //   id: "uf-6",
    //   title: "Save Spotify playlist to Google Drive as CSV",
    //   tools: ["spotify", "googledrive"],
    //   progress: 78,
    //   currentStep: 3,
    //   totalSteps: 4,
    //   stepDescription: "Formatting CSV file",
    //   status: "processing",
    //   startedAt: "8 minutes ago",
    //   estimatedCompletion: "1 minute",
    //   lastActivity: "10 seconds ago",
    //   errorMessage: null,
    //   steps: [
    //     {
    //       id: 1,
    //       name: "Connect to Spotify API",
    //       status: "completed",
    //       duration: "1.8s",
    //     },
    //     {
    //       id: 2,
    //       name: "Fetch playlist data",
    //       status: "completed",
    //       duration: "4.6s",
    //     },
    //     {
    //       id: 3,
    //       name: "Format CSV file",
    //       status: "in-progress",
    //       duration: "ongoing",
    //     },
    //     {
    //       id: 4,
    //       name: "Upload to Google Drive",
    //       status: "pending",
    //       duration: "N/A",
    //     },
    //   ],
    // },
    // {
    //   id: "uf-7",
    //   title: "Monitor Twitter mentions and create Notion database entries",
    //   tools: ["twitter", "notion"],
    //   progress: 25,
    //   currentStep: 1,
    //   totalSteps: 4,
    //   stepDescription: "Authentication failed",
    //   status: "error",
    //   startedAt: "3 hours ago",
    //   estimatedCompletion: "Manual intervention required",
    //   lastActivity: "2 hours ago",
    //   errorMessage: "Twitter API authentication expired",
    //   steps: [
    //     {
    //       id: 1,
    //       name: "Authenticate Twitter API",
    //       status: "failed",
    //       duration: "N/A",
    //     },
    //     {
    //       id: 2,
    //       name: "Search for mentions",
    //       status: "pending",
    //       duration: "N/A",
    //     },
    //     {
    //       id: 3,
    //       name: "Process mention data",
    //       status: "pending",
    //       duration: "N/A",
    //     },
    //     {
    //       id: 4,
    //       name: "Create Notion entries",
    //       status: "pending",
    //       duration: "N/A",
    //     },
    //   ],
    // },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
      case "waiting":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "paused":
        return <Pause className="w-4 h-4 text-orange-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "text-blue-400 bg-blue-900/20 border-blue-500/30";
      case "waiting":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-500/30";
      case "error":
        return "text-red-400 bg-red-900/20 border-red-500/30";
      case "paused":
        return "text-orange-400 bg-orange-900/20 border-orange-500/30";
      default:
        return "text-gray-400 bg-gray-900/20 border-gray-500/30";
    }
  };

  const getStepStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case "in-progress":
        return <RefreshCw className="w-3 h-3 text-blue-400 animate-spin" />;
      case "failed":
        return <XCircle className="w-3 h-3 text-red-400" />;
      default:
        return <Clock className="w-3 h-3 text-slate-500" />;
    }
  };

  const getProgressColor = (progress, status) => {
    if (status === "error") return "from-red-500 to-red-400";
    if (progress < 25) return "from-red-500 to-orange-500";
    if (progress < 50) return "from-orange-500 to-yellow-500";
    if (progress < 75) return "from-yellow-500 to-blue-500";
    return "from-blue-500 to-green-500";
  };

  const toggleMenu = (workflowId, event) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === workflowId ? null : workflowId);
  };

  const handleMenuAction = (action, workflowTitle) => {
    console.log(`${action} action triggered for: ${workflowTitle}`);
    setOpenMenuId(null);
  };

  const filteredWorkflows = unfinishedWorkflows.filter(
    (workflow) =>
      workflow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.stepDescription
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      workflow.tools.some((tool) =>
        toolIcons[tool]?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const menuOptions = [
    {
      icon: Play,
      label: "Resume Workflow",
      action: "resume",
      className: "text-green-400 hover:text-green-300",
    },
    {
      icon: RotateCcw,
      label: "Restart from Beginning",
      action: "restart",
      className: "text-blue-400 hover:text-blue-300",
    },
    {
      icon: Pause,
      label: "Pause Workflow",
      action: "pause",
      className: "text-yellow-400 hover:text-yellow-300",
    },
    {
      icon: Eye,
      label: "View Details",
      action: "view",
      className: "text-cyan-400 hover:text-cyan-300",
    },
    {
      icon: Edit3,
      label: "Edit Workflow",
      action: "edit",
      className: "text-purple-400 hover:text-purple-300",
    },
    {
      icon: Copy,
      label: "Duplicate",
      action: "duplicate",
      className: "text-indigo-400 hover:text-indigo-300",
    },
    {
      icon: Archive,
      label: "Archive",
      action: "archive",
      className: "text-orange-400 hover:text-orange-300",
    },
    {
      icon: Trash2,
      label: "Cancel & Delete",
      action: "delete",
      className: "text-red-400 hover:text-red-300",
    },
  ];

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, cyan 1px, transparent 0)`,
            backgroundSize: "50px 50px",
            animation: "gridMove 20s linear infinite",
          }}
        ></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-cyan-400 mb-4">
              Unfinished Workflows
            </h1>
            <p className="text-slate-400 text-lg">
              Monitor and manage workflows that are in progress or need
              attention
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-12 max-w-2xl mx-auto">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-sm"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/50 p-1">
              <div className="flex items-center">
                <div className="pl-4">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search unfinished workflows, tools, or status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-slate-400 px-4 py-4 outline-none text-lg"
                />
              </div>
            </div>
          </div>

          {/* Workflows Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredWorkflows.map((workflow) => {
              const isMenuOpen = openMenuId === workflow.id;
              const progressColor = getProgressColor(
                workflow.progress,
                workflow.status
              );

              return (
                <div key={workflow.id} className="group/card relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover/card:opacity-100 transition-all duration-500 blur-sm"></div>

                  <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/50 group-hover/card:border-cyan-500/30 transition-all duration-500 overflow-hidden">
                    {/* Scanning line effect
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transform -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000"></div> */}

                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            {/* Tool Icons */}
                            <div className="flex items-center space-x-1">
                              {workflow.tools.map((toolKey, index) => {
                                const tool = toolIcons[toolKey];
                                return (
                                  <div key={toolKey} className="relative">
                                    <div
                                      className={`w-8 h-8 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center text-sm shadow-lg`}
                                    >
                                      {tool.icon}
                                    </div>
                                    {index < workflow.tools.length - 1 && (
                                      <ArrowRight className="w-3 h-3 text-slate-500 absolute -right-2 top-2.5 z-10" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Status Badge */}
                            <div
                              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(
                                workflow.status
                              )}`}
                            >
                              {getStatusIcon(workflow.status)}
                              <span className="capitalize">
                                {workflow.status}
                              </span>
                            </div>
                          </div>

                          {/* <h3 className="text-white font-semibold text-lg mb-2 group-hover/card:text-cyan-300 transition-colors duration-300">
                            {workflow.title}
                          </h3> */}

                          {/* Progress Bar */}
                          {/* <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-slate-400">Progress</span>
                              <span className="text-white font-mono">
                                {workflow.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${progressColor} transition-all duration-500 relative`}
                                style={{ width: `${workflow.progress}%` }}
                              >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </div>
                            </div>
                          </div> */}

                          {/* Current Step */}
                          {/* <div className="bg-slate-800/60 rounded-lg p-3 mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-slate-400 text-sm">
                                Current Step
                              </span>
                              <span className="text-cyan-400 text-sm font-mono">
                                {workflow.currentStep}/{workflow.totalSteps}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStepStatusIcon(
                                workflow.steps[workflow.currentStep - 1]?.status
                              )}
                              <span className="text-white text-sm font-medium">
                                {workflow.stepDescription}
                              </span>
                            </div>
                            {workflow.errorMessage && (
                              <div className="mt-2 text-red-400 text-xs bg-red-900/20 rounded p-2 border border-red-500/30">
                                <AlertCircle className="w-3 h-3 inline mr-1" />
                                {workflow.errorMessage}
                              </div>
                            )}
                          </div> */}

                          {/* Workflow Details */}
                          {/* <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                            <div>
                              <span className="text-slate-500">Started:</span>
                              <span className="text-slate-300 ml-1">
                                {workflow.startedAt}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500">
                                Last activity:
                              </span>
                              <span className="text-slate-300 ml-1">
                                {workflow.lastActivity}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-slate-500">
                                Est. completion:
                              </span>
                              <span className="text-cyan-400 ml-1">
                                {workflow.estimatedCompletion}
                              </span>
                            </div>
                          </div> */}

                          {/* Steps Progress */}
                          {/* <div className="border-t border-slate-700/30 pt-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span className="text-xs text-slate-500">
                                Steps Progress
                              </span>
                            </div>
                            <div className="space-y-2">
                              {workflow.steps.map((step, index) => (
                                <div
                                  key={step.id}
                                  className="flex items-center justify-between text-xs"
                                >
                                  <div className="flex items-center space-x-2 flex-1">
                                    {getStepStatusIcon(step.status)}
                                    <span
                                      className={`${
                                        step.status === "completed"
                                          ? "text-green-400"
                                          : step.status === "in-progress"
                                          ? "text-blue-400"
                                          : step.status === "failed"
                                          ? "text-red-400"
                                          : "text-slate-500"
                                      }`}
                                    >
                                      {step.name}
                                    </span>
                                  </div>
                                  <span className="text-slate-500 text-xs">
                                    {step.duration}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div> */}
                        </div>

                        {/* Menu Button */}
                        <div className="relative flex-shrink-0 ml-4">
                          <button
                            onClick={(e) => toggleMenu(workflow.id, e)}
                            className="p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 opacity-0 group-hover/card:opacity-100"
                          >
                            <MoreHorizontal className="w-5 h-5 text-slate-400 hover:text-cyan-400" />
                          </button>

                          {isMenuOpen && (
                            <div className="absolute right-0 top-12 w-56 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-700 shadow-2xl z-50 overflow-hidden">
                              <div className="py-2">
                                {menuOptions.map((option, optionIndex) => {
                                  const OptionIcon = option.icon;
                                  return (
                                    <button
                                      key={optionIndex}
                                      onClick={() =>
                                        handleMenuAction(
                                          option.action,
                                          workflow.title
                                        )
                                      }
                                      className={`w-full flex items-center px-4 py-2 text-sm hover:bg-slate-700/50 transition-all duration-200 ${option.className}`}
                                    >
                                      <OptionIcon className="w-4 h-4 mr-3" />
                                      <span>{option.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredWorkflows.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-slate-800/60 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                No unfinished workflows found
              </h3>
              <p className="text-slate-500">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "All your workflows are completed!"}
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
      `}</style>
    </div>
  );
};

export default UnfinishedWorkflowsPage;
