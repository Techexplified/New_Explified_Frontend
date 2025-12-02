import React, { useState, useEffect } from "react";
import {
  Search,
  MoreHorizontal,
  Play,
  Pause,
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
  FileText,
  DollarSign,
  Copy,
  Edit3,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ExistingWorkflowsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");

  // Scroll top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --------------------------
  // FIXED WORKFLOWS DATA
  // --------------------------

  const fixedWorkflows = [
    {
      id: "fw-1",
      title: "Neural Email Sequences",
      description: "AI-powered email automation with behavioral triggers",
      icon: Mail,
      color: "from-[#23b5b5] to-cyan-600",
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
      ],
    },
    {
      id: "fw-2",
      title: "Quantum CI/CD Pipeline",
      description: "Next-gen build, test, and deployment automation",
      icon: GitBranch,
      color: "from-[#23b5b5] to-cyan-600",
      status: "active",
      lastRun: "15 minutes ago",
      nextRun: "in 45 minutes",
      successRate: 94.2,
      totalRuns: 892,
      category: "Development",
      history: [],
    },
    {
      id: "fw-3",
      title: "Invoice Processing Bot",
      description: "Automated invoice generation and payment tracking",
      icon: DollarSign,
      color: "from-[#23b5b5] to-cyan-600",
      status: "paused",
      lastRun: "1 day ago",
      nextRun: "paused",
      successRate: 99.1,
      totalRuns: 2156,
      category: "Business",
      history: [],
    },
    {
      id: "fw-4",
      title: "Data Lake Constructor",
      description: "Automated data ingestion and lake management",
      icon: Database,
      color: "from-[#23b5b5] to-cyan-600",
      status: "active",
      lastRun: "30 minutes ago",
      nextRun: "in 30 minutes",
      successRate: 96.8,
      totalRuns: 3421,
      category: "Data",
      history: [],
    },
    {
      id: "fw-5",
      title: "AI Chatbot Assistant",
      description: "Intelligent customer query resolution",
      icon: Users,
      color: "from-[#23b5b5] to-cyan-600",
      status: "active",
      lastRun: "5 minutes ago",
      nextRun: "continuous",
      successRate: 97.3,
      totalRuns: 8765,
      category: "Support",
      history: [],
    },
    {
      id: "fw-6",
      title: "AI Content Generator",
      description: "Automated blog posts and article creation",
      icon: FileText,
      color: "from-[#23b5b5] to-cyan-600",
      status: "error",
      lastRun: "3 hours ago",
      nextRun: "retry in 1 hour",
      successRate: 89.4,
      totalRuns: 567,
      category: "Content",
      history: [],
    },
  ];

  // --------------------------
  // TEMPLATE WORKFLOWS
  // --------------------------

  const templateWorkflows = {
    thisWeek: [
      {
        id: "tw-1",
        title: "Social Media Orchestrator",
        icon: Activity,
        color: "from-[#23b5b5] to-cyan-600",
        triggers: 1247,
        trend: 12.5,
        category: "Marketing",
      },
      {
        id: "tw-2",
        title: "Security Audit Scanner",
        icon: Activity,
        color: "from-[#23b5b5] to-cyan-600",
        triggers: 89,
        trend: -5.2,
        category: "Development",
      },
    ],

    lastMonth: [
      {
        id: "lm-1",
        title: "Lead Qualification Matrix",
        icon: Activity,
        color: "from-[#23b5b5] to-cyan-600",
        triggers: 3421,
        trend: 18.3,
        category: "Marketing",
      },
      {
        id: "lm-2",
        title: "Cloud Infra Manager",
        icon: Activity,
        color: "from-[#23b5b5] to-cyan-600",
        triggers: 234,
        trend: -12.1,
        category: "Development",
      },
    ],
  };

  // --------------------------
  // HELPERS
  // --------------------------

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-minimal-primary" />;
      case "paused":
        return <Pause className="w-4 h-4 text-gray-400" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-minimal-primary bg-minimal-primary/10 border-minimal-primary/30";
      case "paused":
        return "text-gray-400 bg-gray-400/10 border-gray-400/30";
      case "error":
        return "text-red-400 bg-red-400/10 border-red-400/30";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/30";
    }
  };

  const toggleMenu = (workflowId, event) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === workflowId ? null : workflowId);
  };

  const menuOptions = [
    { icon: Play, label: "Run Now", action: "run" },
    { icon: Eye, label: "View Details", action: "view" },
    { icon: Edit3, label: "Edit Workflow", action: "edit" },
    { icon: Copy, label: "Duplicate", action: "duplicate" },
    { icon: Trash2, label: "Delete", action: "delete" },
  ];

  const filteredWorkflows = fixedWorkflows.filter(
    (w) =>
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // =====================================================
  // === FINAL RESPONSIVE LAYOUT RENDER BELOW ============
  // =====================================================

  return (
    <div className="min-h-screen bg-minimal-background overflow-x-hidden ml-16 md:ml-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
        {/* -------------------------------- HEADER -------------------------------- */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Existing Workflows
          </h1>
          <p className="text-minimal-muted text-sm sm:text-lg">
            Monitor and manage your active workflow automations
          </p>
        </div>

        {/* --------------------------- SEARCH BAR -------------------------- */}
        <div className="relative mb-10 max-w-3xl mx-auto">
          <div className="relative bg-minimal-card/80 backdrop-blur-xl rounded-xl border border-minimal-border p-1 shadow-lg">
            <div className="flex items-center">
              <div className="pl-4">
                <Search className="w-5 h-5 text-minimal-muted" />
              </div>
              <input
                type="text"
                placeholder="Search workflows, categories, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-minimal-muted px-4 py-4 outline-none text-base sm:text-lg"
              />
            </div>
          </div>
        </div>

        {/* -------------------------------- GRID -------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* -------------------------------- LEFT: FIXED WORKFLOWS -------------------------------- */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-minimal-card/60 backdrop-blur-xl border border-minimal-border rounded-xl overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-minimal-border/40 flex justify-between items-center flex-wrap gap-3">
                <div className="flex items-center space-x-3">
                  <Settings className="text-minimal-primary" />
                  <h2 className="text-lg sm:text-xl text-white font-semibold">
                    Fixed Workflows
                  </h2>
                </div>
                <div className="text-sm text-minimal-muted">
                  {filteredWorkflows.length} workflows
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {/* FIXED WORKFLOW CARDS */}
                {filteredWorkflows.map((workflow) => {
                  const IconComponent = workflow.icon;
                  const isMenuOpen = openMenuId === workflow.id;

                  return (
                    <div key={workflow.id} className="relative group">
                      {/* CARD */}
                      <div className="bg-minimal-dark-100/60 rounded-xl border border-minimal-border p-4 sm:p-5">
                        {/* TOP ROW */}
                        <div className="flex justify-between flex-wrap gap-4">
                          <div className="flex items-start space-x-4 flex-1 min-w-0">
                            <div
                              className={`p-2 rounded-lg bg-minimal-primary`}
                            >
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center flex-wrap gap-2 mb-1">
                                <h3 className="text-white text-sm font-semibold truncate">
                                  {workflow.title}
                                </h3>

                                <div
                                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(
                                    workflow.status
                                  )}`}
                                >
                                  {getStatusIcon(workflow.status)}
                                  <span>{workflow.status}</span>
                                </div>
                              </div>

                              <p className="text-minimal-muted text-xs sm:text-sm line-clamp-1">
                                {workflow.description}
                              </p>
                            </div>
                          </div>

                          {/* MENU */}
                          <div className="relative">
                            <button
                              onClick={(e) => toggleMenu(workflow.id, e)}
                              className="p-1 rounded-md hover:bg-minimal-cardHover"
                            >
                              <MoreHorizontal className="w-5 h-5 text-minimal-muted" />
                            </button>

                            {isMenuOpen && (
                              <div className="absolute right-0 top-8 w-44 bg-minimal-card/90 backdrop-blur-xl border border-minimal-border rounded-lg shadow-xl z-50">
                                {menuOptions.map((opt, idx) => {
                                  const OptionIcon = opt.icon;
                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => setOpenMenuId(null)}
                                      className="w-full flex items-center px-4 py-2 text-sm hover:bg-minimal-cardHover/50"
                                    >
                                      <OptionIcon className="w-4 h-4 mr-3" />
                                      {opt.label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* STATS */}
                        <div className="mt-3 border-t border-minimal-border/30 pt-3 flex flex-wrap justify-between text-xs sm:text-sm gap-3">
                          <div>
                            <span className="text-minimal-muted">
                              Last run:
                            </span>{" "}
                            <span className="text-white">
                              {workflow.lastRun}
                            </span>
                          </div>
                          <div>
                            <span className="text-minimal-muted">
                              Next run:
                            </span>{" "}
                            <span className="text-white">
                              {workflow.nextRun}
                            </span>
                          </div>
                          <div>
                            <span className="text-minimal-muted">
                              Total runs:
                            </span>{" "}
                            <span className="text-minimal-primary">
                              {workflow.totalRuns.toLocaleString()}
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

          {/* -------------------------------- RIGHT: TEMPLATE WORKFLOWS -------------------------------- */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-minimal-card/60 backdrop-blur-xl border border-minimal-border rounded-xl overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-minimal-border/40">
                <h2 className="text-white text-lg sm:text-xl font-semibold flex items-center space-x-2">
                  <Activity className="text-minimal-primary" />
                  <span>Template Workflows</span>
                </h2>

                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={() => setSelectedTimeframe("week")}
                    className={`px-3 py-1 rounded-lg text-xs sm:text-sm ${
                      selectedTimeframe === "week"
                        ? "bg-minimal-primary/20 text-minimal-primary border border-minimal-primary/40"
                        : "text-minimal-muted hover:text-minimal-primary"
                    }`}
                  >
                    This Week
                  </button>

                  <button
                    onClick={() => setSelectedTimeframe("month")}
                    className={`px-3 py-1 rounded-lg text-xs sm:text-sm ${
                      selectedTimeframe === "month"
                        ? "bg-minimal-primary/20 text-minimal-primary border border-minimal-primary/40"
                        : "text-minimal-muted hover:text-minimal-primary"
                    }`}
                  >
                    Last Month
                  </button>
                </div>
              </div>

              {/* TEMPLATE CARDS */}
              <div className="p-4 sm:p-6 space-y-3">
                {(selectedTimeframe === "week"
                  ? templateWorkflows.thisWeek
                  : templateWorkflows.lastMonth
                ).map((wf) => {
                  const IconComponent = wf.icon;
                  const isPositiveTrend = wf.trend > 0;

                  return (
                    <div
                      key={wf.id}
                      className="bg-minimal-dark-100/40 p-3 border rounded-lg"
                    >
                      <div className="flex justify-between items-center flex-wrap gap-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-minimal-primary`}>
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="text-white text-sm font-medium truncate">
                              {wf.title}
                            </h4>
                            <p className="text-xs text-minimal-muted">
                              {wf.category}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-minimal-primary font-mono">
                            {wf.triggers.toLocaleString()}
                          </div>

                          <div
                            className={`flex items-center text-xs ${
                              isPositiveTrend
                                ? "text-minimal-primary"
                                : "text-gray-400"
                            }`}
                          >
                            {isPositiveTrend ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {Math.abs(wf.trend)}%
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
  );
};

export default ExistingWorkflowsPage;
