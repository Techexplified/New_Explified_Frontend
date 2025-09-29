import { useState, useRef, useEffect } from "react";
import {
  Youtube,
  FileText,
  Projector,
  ImagePlay,
  Images,
  FileVideo2,
  Plus,
  Play,
  ScreenShare,
  Image,
  Laugh,
  PenOff,
  BoomBox,
  Zap,
  Database,
  Search,
  MessageCircleMore,
  Users,
  Pin,
  PinOff,
  Check,
  ExternalLink,
  Copy,
  Edit3,
  Settings,
  Trash2,
  MoreHorizontal,
  Sparkles,
  ChevronRight,
  Star,
  TrendingUp,
  Clock,
  Activity,
  Grid3X3,
  List,
  Filter,
  SortDesc,
  Bookmark,
  Heart,
  Share2,
  Download,
  Eye,
  BarChart3,
  Target,
  Rocket,
  Lightbulb,
  Cpu,
  Globe,
  Shield,
  Bell,
  Mail,
  Calendar,
  User,
  MousePointer2,
  ArrowUp,
  ArrowDown,
  ArrowRight,
} from "lucide-react";

const navItems = [
  { name: "Recent", icon: Clock, active: false, badge: null },
  { name: "Start", icon: Rocket, active: false, badge: null },
  { name: "All Apps", icon: Grid3X3, active: false, badge: null },
  { name: "Workflows", icon: Activity, active: false, badge: null },
  { name: "Integrations", icon: Globe, active: false, badge: null },
  { name: "Search", icon: Search, active: true, badge: null },
];

const sampleWorkflows = [
  {
    id: "workflow-1",
    title: "Email Marketing Campaign",
    description:
      "Automate personalized email sequences with advanced analytics and A/B testing capabilities.",
    tools: [
      {
        name: "Gmail",
        icon: Mail,
        bgColor: "from-red-500/20 to-red-600/30",
        color: "text-red-400",
      },
      {
        name: "Analytics",
        icon: BarChart3,
        bgColor: "from-blue-500/20 to-blue-600/30",
        color: "text-blue-400",
      },
    ],
    category: "Marketing",
    progress: 85,
    users: 234,
    performance: "+12%",
    recommended: true,
  },
  {
    id: "workflow-2",
    title: "Data Pipeline Automation",
    description:
      "Streamline your data processing with intelligent ETL workflows and real-time monitoring.",
    tools: [
      {
        name: "Database",
        icon: Database,
        bgColor: "from-green-500/20 to-green-600/30",
        color: "text-green-400",
      },
      {
        name: "Processing",
        icon: Cpu,
        bgColor: "from-purple-500/20 to-purple-600/30",
        color: "text-purple-400",
      },
    ],
    category: "Analytics",
    progress: 92,
    users: 156,
    performance: "+18%",
    recommended: true,
  },
  {
    id: "workflow-3",
    title: "Customer Support Hub",
    description:
      "Centralize customer inquiries with AI-powered responses and team collaboration tools.",
    tools: [
      {
        name: "Support",
        icon: MessageCircleMore,
        bgColor: "from-cyan-500/20 to-cyan-600/30",
        color: "text-cyan-400",
      },
      {
        name: "Team",
        icon: Users,
        bgColor: "from-orange-500/20 to-orange-600/30",
        color: "text-orange-400",
      },
    ],
    category: "Support",
    progress: 76,
    users: 89,
    performance: "+8%",
    recommended: false,
  },
];

const allTools = [
  {
    title: "AI Video Generator",
    description:
      "Transform your ideas into stunning videos with advanced AI technology and professional templates.",
    icon: FileVideo2,
    color: "from-purple-500/20 to-purple-600/30",
    route: "/video-generator",
    category: "AI Tools",
    rating: 4.8,
    usage: "12k+",
    trending: true,
  },
  {
    title: "Smart Analytics",
    description:
      "Get deep insights from your data with machine learning powered analytics and beautiful visualizations.",
    icon: BarChart3,
    color: "from-blue-500/20 to-blue-600/30",
    route: "/analytics",
    category: "Analytics",
    rating: 4.9,
    usage: "8.5k+",
    trending: true,
  },
  {
    title: "Content Studio",
    description:
      "Create, edit and optimize content across all platforms with our comprehensive content management suite.",
    icon: FileText,
    color: "from-green-500/20 to-green-600/30",
    route: "/content-studio",
    category: "Content",
    rating: 4.7,
    usage: "15k+",
    trending: false,
  },
  {
    title: "Design Toolkit",
    description:
      "Professional design tools powered by AI to create stunning visuals, logos, and marketing materials.",
    icon: Lightbulb,
    color: "from-yellow-500/20 to-yellow-600/30",
    route: "/design-toolkit",
    category: "Design",
    rating: 4.6,
    usage: "9.2k+",
    trending: true,
  },
  {
    title: "Automation Hub",
    description:
      "Build powerful workflows and automations without code. Connect your favorite apps seamlessly.",
    icon: Zap,
    color: "from-orange-500/20 to-orange-600/30",
    route: "/automation-hub",
    category: "Automation",
    rating: 4.8,
    usage: "6.8k+",
    trending: false,
  },
  {
    title: "Security Center",
    description:
      "Comprehensive security monitoring and threat detection with real-time alerts and reporting.",
    icon: Shield,
    color: "from-red-500/20 to-red-600/30",
    route: "/security-center",
    category: "Security",
    rating: 4.9,
    usage: "3.4k+",
    trending: false,
  },
];

const TestMain = () => {
  const [selectedTool, setSelectedTool] = useState("Recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("popular"); // popular, recent, rating
  const [filterCategory, setFilterCategory] = useState("all");
  const [recentTools, setRecentTools] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = allTools.filter(
      (tool) =>
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query)
    );

    setSearchResults(results);
  };

  const handleNavClick = (navName) => {
    setSelectedTool(navName);
    setSearchQuery("");
    setSearchResults([]);
  };

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6 hover:border-gray-700/80 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div
          className={`flex items-center text-sm ${
            change.startsWith("+") ? "text-green-400" : "text-red-400"
          }`}
        >
          {change.startsWith("+") ? (
            <ArrowUp className="w-4 h-4 mr-1" />
          ) : (
            <ArrowDown className="w-4 h-4 mr-1" />
          )}
          {change}
        </div>
      </div>
      <h3 className="text-gray-300 text-sm mb-1">{title}</h3>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );

  const ToolCard = ({ tool, index, compact = false }) => (
    <div
      className={`group relative bg-gray-900/40 backdrop-blur-sm border border-gray-800/60 rounded-2xl overflow-hidden hover:border-gray-700/80 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 cursor-pointer ${
        compact ? "p-4" : "p-6"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Trending Badge */}
      {tool.trending && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
          <TrendingUp className="w-3 h-3" />
          Trending
        </div>
      )}

      <div className="relative z-10">
        {/* Icon and Category */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-4 rounded-2xl bg-gradient-to-br ${tool.color} group-hover:scale-110 transition-all duration-300 shadow-lg`}
          >
            <tool.icon className="w-8 h-8 text-white drop-shadow-sm" />
          </div>
          <div className="text-right">
            <div className="bg-gray-800/60 px-3 py-1 rounded-full text-xs text-gray-300 mb-2">
              {tool.category}
            </div>
            {!compact && (
              <div className="flex items-center text-yellow-400 text-sm">
                <Star className="w-4 h-4 mr-1 fill-current" />
                {tool.rating}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-300 transition-colors duration-300">
          {tool.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {tool.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm">
            <Eye className="w-4 h-4 mr-1" />
            {tool.usage}
          </div>
          <div className="flex items-center text-cyan-400 font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            Launch
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );

  const WorkflowCard = ({ workflow }) => (
    <div className="group relative bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6 hover:border-gray-700/80 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 cursor-pointer overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Recommended Badge */}
      {workflow.recommended && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Recommended
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex -space-x-2">
            {workflow.tools.map((tool, index) => (
              <div
                key={index}
                className={`w-12 h-12 bg-gradient-to-br ${tool.bgColor} backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-gray-800 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                style={{ zIndex: workflow.tools.length - index }}
              >
                <tool.icon className={`w-6 h-6 ${tool.color}`} />
              </div>
            ))}
          </div>
          <button
            onClick={(e) => toggleMenu(workflow.id, e)}
            className="p-2 rounded-lg hover:bg-gray-800/60 transition-colors duration-200 opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Category and Performance */}
        <div className="flex items-center justify-between mb-3">
          <span className="bg-gray-800/60 px-3 py-1 rounded-full text-xs text-gray-300">
            {workflow.category}
          </span>
          <div className="flex items-center text-green-400 text-sm font-medium">
            <TrendingUp className="w-4 h-4 mr-1" />
            {workflow.performance}
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-300 transition-colors duration-300">
          {workflow.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {workflow.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Completion</span>
            <span className="text-white font-medium">{workflow.progress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${workflow.progress}%` }}
            />
          </div>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm">
            <Users className="w-4 h-4 mr-1" />
            {workflow.users} users
          </div>
          <div className="flex items-center text-cyan-400 font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            Open Workflow
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full bg-gray-950/95 backdrop-blur-xl border-r border-gray-800/60 flex flex-col justify-between transition-all duration-500 ease-in-out z-50 ${
            sidebarOpen ? "w-72 px-6 opacity-100" : "w-0 px-0 opacity-0"
          }`}
          onMouseEnter={() => !sidebarPinned && setSidebarOpen(true)}
          onMouseLeave={() => !sidebarPinned && setSidebarOpen(false)}
        >
          {sidebarOpen && (
            <>
              <div className="pt-8 animate-slideInLeft">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Explified
                  </h2>
                  <button
                    onClick={() => setSidebarPinned(!sidebarPinned)}
                    className="p-2 rounded-lg hover:bg-gray-800/60 transition-colors duration-200"
                  >
                    {sidebarPinned ? <PinOff size={20} /> : <Pin size={20} />}
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4 mb-8">
                  <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">
                        Active Projects
                      </span>
                      <Activity className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-white text-xl font-bold">12</span>
                  </div>
                  <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Automations</span>
                      <Zap className="w-4 h-4 text-yellow-400" />
                    </div>
                    <span className="text-white text-xl font-bold">24</span>
                  </div>
                </div>
              </div>

              <div className="pb-8">
                <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25">
                  Upgrade to Pro
                </button>
              </div>
            </>
          )}
        </div>

        {/* Sidebar Trigger */}
        <div
          className="fixed left-0 top-0 w-6 h-full z-30 cursor-pointer"
          onMouseEnter={() => setSidebarOpen(true)}
        />

        {/* Main Content */}
        <div
          className={`transition-all duration-500 ${
            sidebarOpen && !sidebarPinned
              ? "ml-72"
              : sidebarPinned
              ? "ml-72"
              : "ml-0"
          } p-8`}
        >
          {/* Header */}
          <div className="max-w-7xl mx-auto mb-12">
            <div className="text-center mb-12">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 animate-slideDown">
                Explified
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto animate-fadeInUp delay-200">
                Transform your workflow with AI-powered tools and seamless
                automation
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8 animate-fadeInUp delay-300">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search tools, workflows, and integrations..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl pl-16 pr-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 hover:border-gray-700/80"
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-center mb-8 animate-fadeInUp delay-400">
              <div className="flex gap-2 bg-gray-900/40 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-2">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.name)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedTool === item.name
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="max-w-7xl mx-auto">
            {/* Recent Section */}
            {selectedTool === "Recent" && (
              <div className="space-y-8 animate-fadeInUp">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white">
                    Recently Used
                  </h2>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        setViewMode(viewMode === "grid" ? "list" : "grid")
                      }
                      className="p-2 rounded-lg bg-gray-900/60 border border-gray-800/60 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {viewMode === "grid" ? (
                        <List className="w-5 h-5" />
                      ) : (
                        <Grid3X3 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    icon={Target}
                    title="Projects Active"
                    value="12"
                    change="+3"
                    color="from-cyan-500/20 to-cyan-600/30"
                  />
                  <StatCard
                    icon={Zap}
                    title="Automations"
                    value="24"
                    change="+7"
                    color="from-yellow-500/20 to-yellow-600/30"
                  />
                  <StatCard
                    icon={Users}
                    title="Team Members"
                    value="8"
                    change="+2"
                    color="from-green-500/20 to-green-600/30"
                  />
                  <StatCard
                    icon={BarChart3}
                    title="Efficiency"
                    value="94%"
                    change="+12%"
                    color="from-purple-500/20 to-purple-600/30"
                  />
                </div>

                {/* Recent Tools */}
                <div
                  className={`grid ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  } gap-6`}
                >
                  {allTools.slice(0, 3).map((tool, index) => (
                    <ToolCard
                      key={index}
                      tool={tool}
                      index={index}
                      compact={viewMode === "list"}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Apps Section */}
            {selectedTool === "All Apps" && (
              <div className="space-y-8 animate-fadeInUp">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white">
                    All Applications
                  </h2>
                  <div className="flex items-center gap-4">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="bg-gray-900/60 border border-gray-800/60 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500/60"
                    >
                      <option value="all">All Categories</option>
                      <option value="AI Tools">AI Tools</option>
                      <option value="Analytics">Analytics</option>
                      <option value="Design">Design</option>
                    </select>
                    <button
                      onClick={() =>
                        setViewMode(viewMode === "grid" ? "list" : "grid")
                      }
                      className="p-2 rounded-lg bg-gray-900/60 border border-gray-800/60 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {viewMode === "grid" ? (
                        <List className="w-5 h-5" />
                      ) : (
                        <Grid3X3 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div
                  className={`grid ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  } gap-6`}
                >
                  {allTools.map((tool, index) => (
                    <ToolCard
                      key={index}
                      tool={tool}
                      index={index}
                      compact={viewMode === "list"}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Workflows Section */}
            {selectedTool === "Workflows" && (
              <div className="space-y-8 animate-fadeInUp">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white">Workflows</h2>
                  <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105">
                    <Plus className="w-4 h-4" />
                    Create Workflow
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sampleWorkflows.map((workflow, index) => (
                    <WorkflowCard key={workflow.id} workflow={workflow} />
                  ))}
                </div>
              </div>
            )}

            {/* Start Section */}
            {selectedTool === "Start" && (
              <div className="space-y-8 animate-fadeInUp">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Get Started
                  </h2>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Begin your journey with our most popular tools and workflows
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <div className="group bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6 hover:border-cyan-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-600/30 rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Rocket className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-white font-semibold text-center mb-2">
                      Quick Setup
                    </h3>
                    <p className="text-gray-400 text-sm text-center">
                      Start with our guided setup wizard
                    </p>
                  </div>

                  <div className="group bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6 hover:border-green-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 cursor-pointer">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-white font-semibold text-center mb-2">
                      Templates
                    </h3>
                    <p className="text-gray-400 text-sm text-center">
                      Browse pre-built workflow templates
                    </p>
                  </div>

                  <div className="group bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Lightbulb className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-white font-semibold text-center mb-2">
                      Tutorial
                    </h3>
                    <p className="text-gray-400 text-sm text-center">
                      Learn with interactive tutorials
                    </p>
                  </div>

                  <div className="group bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6 hover:border-orange-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-600/30 rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-8 h-8 text-orange-400" />
                    </div>
                    <h3 className="text-white font-semibold text-center mb-2">
                      Community
                    </h3>
                    <p className="text-gray-400 text-sm text-center">
                      Join our community of creators
                    </p>
                  </div>
                </div>

                {/* Featured Tools */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Featured Tools
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allTools.slice(0, 6).map((tool, index) => (
                      <ToolCard key={index} tool={tool} index={index} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Section */}
            {selectedTool === "Integrations" && (
              <div className="space-y-8 animate-fadeInUp">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white">
                    Integrations
                  </h2>
                  <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105">
                    <Plus className="w-4 h-4" />
                    Add Integration
                  </button>
                </div>

                {/* Integration Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6 text-center hover:border-gray-700/80 transition-all duration-300">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-xl mb-4 mx-auto">
                      <Globe className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">
                      Web Services
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Connect with popular web APIs and services
                    </p>
                    <span className="text-blue-400 text-sm font-medium">
                      24 Available
                    </span>
                  </div>

                  <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6 text-center hover:border-gray-700/80 transition-all duration-300">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-xl mb-4 mx-auto">
                      <Database className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Databases</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Sync with your existing database systems
                    </p>
                    <span className="text-purple-400 text-sm font-medium">
                      12 Available
                    </span>
                  </div>

                  <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6 text-center hover:border-gray-700/80 transition-all duration-300">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-xl mb-4 mx-auto">
                      <Zap className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">
                      Automation
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Automate workflows across platforms
                    </p>
                    <span className="text-green-400 text-sm font-medium">
                      18 Available
                    </span>
                  </div>
                </div>

                {/* Connected Integrations */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Connected Services
                  </h3>
                  <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
                    <div className="flex items-center justify-between p-4 border border-green-500/20 bg-green-500/5 rounded-xl mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/30 rounded-xl flex items-center justify-center">
                          <Youtube className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">
                            YouTube API
                          </h4>
                          <p className="text-gray-400 text-sm">
                            Video processing and analytics
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm">
                          Connected
                        </span>
                      </div>
                    </div>

                    <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-xl">
                      <Globe className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">
                        No other integrations connected yet
                      </p>
                      <button className="text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors duration-200">
                        Browse Available Integrations
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchQuery && searchResults.length > 0 && (
              <div className="space-y-8 animate-fadeInUp">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white">
                    Search Results for "{searchQuery}"
                  </h2>
                  <span className="text-gray-400">
                    {searchResults.length} results found
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((tool, index) => (
                    <ToolCard key={index} tool={tool} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty Search State */}
            {searchQuery && searchResults.length === 0 && (
              <div className="text-center py-16 animate-fadeInUp">
                <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No results found
                </h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search terms or browse our categories
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-slideDown {
          animation: slideDown 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default TestMain;
