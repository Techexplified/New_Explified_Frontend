import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Square,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Settings,
  GitBranch,
  Mail,
  Database,
  Cloud,
  FileText,
  Zap,
  BarChart3,
  Shield,
  Code,
  Megaphone,
  PenTool,
  DollarSign,
  Headphones,
  Briefcase,
  Heart,
  Copy,
  Edit3,
  Trash2,
  Eye,
  Archive,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ExistingWorkflowsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setGlowPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fixedWorkflows = [
    {
      id: "fw-1",
      title: "Neural Email Sequences",
      description: "AI-powered email automation with behavioral triggers",
      icon: Mail,
      color: "from-pink-500 to-purple-500",
      status: "active",
      lastRun: "2 hours ago",
      nextRun: "in 4 hours",
      successRate: 98.5,
      totalRuns: 1247,
      category: "Marketing",
      history: [
        {
          date: "2025-07-30",
          status: "success",
          duration: "2.3s",
          triggers: 245,
        },
        {
          date: "2025-07-29",
          status: "success",
          duration: "1.8s",
          triggers: 198,
        },
        {
          date: "2025-07-28",
          status: "failed",
          duration: "5.1s",
          triggers: 0,
          error: "API timeout",
        },
        {
          date: "2025-07-27",
          status: "success",
          duration: "2.1s",
          triggers: 287,
        },
      ],
    },
    {
      id: "fw-2",
      title: "Quantum CI/CD Pipeline",
      description: "Next-gen build, test, and deployment automation",
      icon: GitBranch,
      color: "from-cyan-500 to-blue-500",
      status: "active",
      lastRun: "15 minutes ago",
      nextRun: "in 45 minutes",
      successRate: 94.2,
      totalRuns: 892,
      category: "Development",
      history: [
        {
          date: "2025-07-30",
          status: "success",
          duration: "12.4s",
          triggers: 8,
        },
        {
          date: "2025-07-30",
          status: "success",
          duration: "11.2s",
          triggers: 6,
        },
        {
          date: "2025-07-29",
          status: "warning",
          duration: "18.7s",
          triggers: 5,
          warning: "Slow tests",
        },
        {
          date: "2025-07-29",
          status: "success",
          duration: "10.8s",
          triggers: 7,
        },
      ],
    },
    {
      id: "fw-3",
      title: "Invoice Processing Bot",
      description: "Automated invoice generation and payment tracking",
      icon: DollarSign,
      color: "from-emerald-500 to-green-500",
      status: "paused",
      lastRun: "1 day ago",
      nextRun: "paused",
      successRate: 99.1,
      totalRuns: 2156,
      category: "Business",
      history: [
        {
          date: "2025-07-29",
          status: "success",
          duration: "4.2s",
          triggers: 156,
        },
        {
          date: "2025-07-28",
          status: "success",
          duration: "3.8s",
          triggers: 142,
        },
        {
          date: "2025-07-27",
          status: "success",
          duration: "4.1s",
          triggers: 189,
        },
        {
          date: "2025-07-26",
          status: "success",
          duration: "3.9s",
          triggers: 167,
        },
      ],
    },
    {
      id: "fw-4",
      title: "Data Lake Constructor",
      description: "Automated data ingestion and lake management",
      icon: Database,
      color: "from-blue-500 to-indigo-500",
      status: "active",
      lastRun: "30 minutes ago",
      nextRun: "in 30 minutes",
      successRate: 96.8,
      totalRuns: 3421,
      category: "Data",
      history: [
        {
          date: "2025-07-30",
          status: "success",
          duration: "45.2s",
          triggers: 1247,
        },
        {
          date: "2025-07-30",
          status: "success",
          duration: "42.1s",
          triggers: 1189,
        },
        {
          date: "2025-07-29",
          status: "success",
          duration: "48.7s",
          triggers: 1356,
        },
        {
          date: "2025-07-29",
          status: "warning",
          duration: "62.3s",
          triggers: 1421,
          warning: "High load",
        },
      ],
    },
    {
      id: "fw-5",
      title: "AI Chatbot Assistant",
      description: "Intelligent customer query resolution",
      icon: Users,
      color: "from-orange-500 to-red-500",
      status: "active",
      lastRun: "5 minutes ago",
      nextRun: "continuous",
      successRate: 97.3,
      totalRuns: 8765,
      category: "Support",
      history: [
        {
          date: "2025-07-30",
          status: "success",
          duration: "0.8s",
          triggers: 2847,
        },
        {
          date: "2025-07-29",
          status: "success",
          duration: "0.9s",
          triggers: 2634,
        },
        {
          date: "2025-07-28",
          status: "success",
          duration: "0.7s",
          triggers: 2756,
        },
        {
          date: "2025-07-27",
          status: "success",
          duration: "0.8s",
          triggers: 2891,
        },
      ],
    },
    {
      id: "fw-6",
      title: "AI Content Generator",
      description: "Automated blog posts and article creation",
      icon: FileText,
      color: "from-purple-500 to-pink-500",
      status: "error",
      lastRun: "3 hours ago",
      nextRun: "retry in 1 hour",
      successRate: 89.4,
      totalRuns: 567,
      category: "Content",
      history: [
        {
          date: "2025-07-30",
          status: "failed",
          duration: "timeout",
          triggers: 0,
          error: "OpenAI API limit",
        },
        {
          date: "2025-07-29",
          status: "success",
          duration: "15.6s",
          triggers: 23,
        },
        {
          date: "2025-07-28",
          status: "success",
          duration: "14.2s",
          triggers: 31,
        },
        {
          date: "2025-07-27",
          status: "success",
          duration: "16.8s",
          triggers: 28,
        },
      ],
    },
  ];

  const templateWorkflows = {
    thisWeek: [
      {
        id: "tw-1",
        title: "Social Media Orchestrator",
        icon: Megaphone,
        color: "from-purple-500 to-blue-500",
        triggers: 1247,
        trend: 12.5,
        category: "Marketing",
      },
      {
        id: "tw-2",
        title: "Security Audit Scanner",
        icon: Shield,
        color: "from-pink-500 to-red-500",
        triggers: 89,
        trend: -5.2,
        category: "Development",
      },
      {
        id: "tw-3",
        title: "Meeting Schedule Optimizer",
        icon: Calendar,
        color: "from-blue-500 to-purple-500",
        triggers: 456,
        trend: 8.9,
        category: "Business",
      },
      {
        id: "tw-4",
        title: "Real-time Analytics Engine",
        icon: BarChart3,
        color: "from-indigo-500 to-purple-500",
        triggers: 2341,
        trend: 23.1,
        category: "Data",
      },
      {
        id: "tw-5",
        title: "Feedback Analysis Bot",
        icon: Activity,
        color: "from-pink-500 to-purple-500",
        triggers: 678,
        trend: 15.7,
        category: "Support",
      },
    ],
    lastMonth: [
      {
        id: "lm-1",
        title: "Lead Qualification Matrix",
        icon: BarChart3,
        color: "from-blue-500 to-cyan-500",
        triggers: 3421,
        trend: 18.3,
        category: "Marketing",
      },
      {
        id: "lm-2",
        title: "Cloud Infrastructure Manager",
        icon: Cloud,
        color: "from-blue-500 to-purple-500",
        triggers: 234,
        trend: -12.1,
        category: "Development",
      },
      {
        id: "lm-3",
        title: "Employee Onboarding Matrix",
        icon: Users,
        color: "from-teal-500 to-cyan-500",
        triggers: 67,
        trend: 145.2,
        category: "Business",
      },
      {
        id: "lm-4",
        title: "ML Model Pipeline",
        icon: Activity,
        color: "from-purple-500 to-pink-500",
        triggers: 156,
        trend: 34.7,
        category: "Data",
      },
      {
        id: "lm-5",
        title: "Ticket Routing Engine",
        icon: Settings,
        color: "from-red-500 to-pink-500",
        triggers: 1823,
        trend: 7.4,
        category: "Support",
      },
    ],
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "paused":
        return <Pause className="w-4 h-4 text-yellow-400" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-900/20 border-green-500/30";
      case "paused":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-500/30";
      case "error":
        return "text-red-400 bg-red-900/20 border-red-500/30";
      default:
        return "text-gray-400 bg-gray-900/20 border-gray-500/30";
    }
  };

  const toggleMenu = (workflowId, event) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === workflowId ? null : workflowId);
  };

  const handleMenuAction = (action, workflowTitle) => {
    console.log(`${action} action triggered for: ${workflowTitle}`);
    setOpenMenuId(null);
  };

  const filteredWorkflows = fixedWorkflows.filter(
    (workflow) =>
      workflow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menuOptions = [
    {
      icon: Play,
      label: "Run Now",
      action: "run",
      className: "text-cyan-400 hover:text-cyan-300",
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
      className: "text-cyan-400 hover:text-cyan-300",
    },
    {
      icon: Copy,
      label: "Duplicate",
      action: "duplicate",
      className: "text-cyan-400 hover:text-cyan-300",
    },
    {
      icon: Trash2,
      label: "Delete",
      action: "delete",
      className: "text-cyan-400 hover:text-cyan-300",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl pb-1 font-bold text-cyan-400 mb-4">
              Existing Workflows
            </h1>
            <p className="text-slate-400 text-lg">
              Monitor and manage your active workflow automations
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
                  placeholder="Search workflows, categories, or status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-slate-400 px-4 py-4 outline-none text-lg"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Fixed Workflows - Left Side (2/3 width) */}
            <div className="lg:col-span-2">
              <div className="relative group mb-6">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>

                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/50 group-hover:border-cyan-500/30 transition-all duration-500">
                  <div className="p-6 border-b border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
                          <Settings className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">
                          Fixed Workflows
                        </h2>
                      </div>
                      <div className="text-sm text-slate-400">
                        {filteredWorkflows.length} workflows
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* filtered left worflows map */}
                    {filteredWorkflows.map((workflow) => {
                      const IconComponent = workflow.icon;
                      const isMenuOpen = openMenuId === workflow.id;

                      return (
                        <div key={workflow.id} className="group/card relative">
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover/card:opacity-100 transition-all duration-300 blur-sm"></div>

                          <div className="relative bg-slate-800/60 rounded-xl border border-slate-700/50 p-4 group-hover/card:border-cyan-500/30 transition-all duration-300">
                            {/* Main workflow info */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start space-x-4 flex-1">
                                <div
                                  className={`p-2 rounded-lg bg-gradient-to-r ${workflow.color} flex-shrink-0`}
                                >
                                  <IconComponent className="w-5 h-5 text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="text-white font-semibold text-sm truncate">
                                      {workflow.title}
                                    </h3>
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
                                  <p className="text-slate-400 text-xs mb-2 line-clamp-1">
                                    {workflow.description}
                                  </p>

                                  <div className="flex items-center justify-between text-xs">
                                    <div>
                                      <span className="text-slate-500">
                                        Last run:
                                      </span>
                                      <span className="text-slate-300 ml-1">
                                        {workflow.lastRun}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">
                                        Next run:
                                      </span>
                                      <span className="text-slate-300 ml-1">
                                        {workflow.nextRun}
                                      </span>
                                    </div>

                                    <div>
                                      <span className="text-slate-500">
                                        Total runs:
                                      </span>
                                      <span className="text-cyan-400 ml-1">
                                        {workflow.totalRuns.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="relative flex-shrink-0">
                                <button
                                  onClick={(e) => toggleMenu(workflow.id, e)}
                                  className="p-1 rounded-lg hover:bg-slate-700 transition-colors duration-200 opacity-0 group-hover/card:opacity-100"
                                >
                                  <MoreHorizontal className="w-4 h-4 text-slate-400 hover:text-cyan-400" />
                                </button>

                                {isMenuOpen && (
                                  <div className="absolute right-0 top-8 w-48 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-700 shadow-2xl z-50 overflow-hidden">
                                    <div className="py-2">
                                      {menuOptions.map(
                                        (option, optionIndex) => {
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
                                        }
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* History */}
                            <div className="border-t border-slate-700/30 pt-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <Clock className="w-3 h-3 text-slate-500" />
                                <span className="text-xs text-slate-500">
                                  Recent History
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Template Workflows - Right Side (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>

                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/50 group-hover:border-purple-500/30 transition-all duration-500">
                  <div className="p-6 border-b border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                          <Activity className="w-5 h-5 text-purple-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">
                          Template Workflows
                        </h2>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedTimeframe("week")}
                        className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 ${
                          selectedTimeframe === "week"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "text-slate-400 hover:text-purple-300"
                        }`}
                      >
                        This Week
                      </button>
                      <button
                        onClick={() => setSelectedTimeframe("month")}
                        className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 ${
                          selectedTimeframe === "month"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "text-slate-400 hover:text-purple-300"
                        }`}
                      >
                        Last Month
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-3">
                      {/* right side template workflows map */}
                      {(selectedTimeframe === "week"
                        ? templateWorkflows.thisWeek
                        : templateWorkflows.lastMonth
                      ).map((workflow) => {
                        const IconComponent = workflow.icon;
                        const isPositiveTrend = workflow.trend > 0;

                        return (
                          <div
                            key={workflow.id}
                            className="group/template relative"
                          >
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover/template:opacity-100 transition-all duration-300 blur-sm"></div>

                            <div className="relative bg-slate-800/40 rounded-lg border border-slate-700/30 p-3 group-hover/template:border-purple-500/30 transition-all duration-300">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                  <div
                                    className={`p-1.5 rounded-lg bg-gradient-to-r ${workflow.color} flex-shrink-0`}
                                  >
                                    <IconComponent className="w-3 h-3 text-white" />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-white text-sm font-medium truncate">
                                      {workflow.title}
                                    </h4>
                                    <p className="text-xs text-slate-400">
                                      {workflow.category}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right flex-shrink-0">
                                  <div className="text-cyan-400 text-sm font-mono">
                                    {workflow.triggers.toLocaleString()}
                                  </div>
                                  <div
                                    className={`flex items-center text-xs ${
                                      isPositiveTrend
                                        ? "text-green-400"
                                        : "text-red-400"
                                    }`}
                                  >
                                    {isPositiveTrend ? (
                                      <TrendingUp className="w-3 h-3 mr-1" />
                                    ) : (
                                      <TrendingDown className="w-3 h-3 mr-1" />
                                    )}
                                    {Math.abs(workflow.trend)}%
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default ExistingWorkflowsPage;
