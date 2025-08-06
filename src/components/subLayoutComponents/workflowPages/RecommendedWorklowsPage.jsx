import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  GitBranch,
  Mail,
  Database,
  Cloud,
  FileText,
  Zap,
  Users,
  Calendar,
  Shield,
  BarChart3,
  MoreHorizontal,
  Heart,
  Trash2,
  Copy,
  Edit3,
  Clock,
  Briefcase,
  Code,
  Megaphone,
  PenTool,
  Activity,
} from "lucide-react";

const RecommendedWorkflowsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openAccordions, setOpenAccordions] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const workflowCategories = [
    {
      id: "marketing",
      name: "Marketing & Campaigns",
      icon: Megaphone,
      color: "from-minimal-primary to-minimal-gray-600",
      description: "Boost your marketing efforts with AI-powered campaigns",
      workflows: [
        {
          title: "Neural Email Sequences",
          description: "AI-powered email automation with behavioral triggers",
          icon: Mail,
          color: "from-minimal-primary to-minimal-gray-600",
          steps: 8,
          category: "Marketing",
          users: "2.4K",
          rating: 4.9,
        },
        {
          title: "Social Media Orchestrator",
          description: "Multi-platform content scheduling and engagement",
          icon: Users,
          color: "from-minimal-primary to-minimal-gray-600",
          steps: 6,
          category: "Marketing",
          users: "1.8K",
          rating: 4.7,
        },
        {
          title: "Lead Qualification Matrix",
          description: "Intelligent lead scoring and nurturing pipeline",
          icon: BarChart3,
          color: "from-minimal-primary to-minimal-gray-600",
          steps: 10,
          category: "Marketing",
          users: "3.2K",
          rating: 4.8,
        },
        {
          title: "Campaign Analytics Engine",
          description: "Real-time marketing performance analysis",
          icon: Activity,
          color: "from-minimal-primary to-minimal-gray-600",
          steps: 7,
          category: "Marketing",
          users: "1.5K",
          rating: 4.6,
        },
      ],
    },
    {
      id: "content",
      name: "Content Creation",
      icon: PenTool,
      color: "from-minimal-primary to-minimal-gray-600",
      description: "Streamline content production with creative workflows",
      workflows: [
        {
          title: "AI Content Generator",
          description: "Automated blog posts and article creation",
          icon: FileText,
          color: "from-minimal-primary to-minimal-gray-600",
          steps: 5,
          category: "Content",
          users: "4.1K",
          rating: 4.9,
        },
        {
          title: "Video Production Pipeline",
          description: "End-to-end video creation and editing workflow",
          icon: Calendar,
          color: "from-minimal-primary to-minimal-gray-600",
          steps: 12,
          category: "Content",
          users: "2.7K",
          rating: 4.8,
        },
        {
          title: "Content Review Matrix",
          description: "Multi-stakeholder approval and revision system",
          icon: Shield,
          color: "from-minimal-primary to-minimal-gray-600",
          steps: 6,
          category: "Content",
          users: "1.9K",
          rating: 4.5,
        },
        {
          title: "SEO Optimization Engine",
          description: "Automated keyword research and content optimization",
          icon: BarChart3,
          color: "from-minimal-primary to-minimal-gray-600",
          steps: 8,
          category: "Content",
          users: "3.3K",
          rating: 4.7,
        },
      ],
    },
    {
      id: "development",
      name: "Development & IT",
      icon: Code,
      color: "from-minimal-primary to-minimal-gray-600",
      description: "Accelerate development with automated IT workflows",
      workflows: [
        {
          title: "Quantum CI/CD Pipeline",
          description: "Next-gen build, test, and deployment automation",
          icon: GitBranch,
          color: "from-minimal-primary to-minimal-gray-600",
          steps: 9,
          category: "Development",
          users: "5.2K",
          rating: 4.9,
        },
        {
          title: "Cloud Infrastructure Manager",
          description: "Auto-scaling cloud resource provisioning",
          icon: Cloud,
          color: "from-minimal-primary to-minimal-gray-600",
          steps: 7,
          category: "Development",
          users: "3.8K",
          rating: 4.8,
        },
        {
          title: "API Integration Hub",
          description: "Seamless third-party service connections",
          icon: Zap,
          color: "from-minimal-primary to-minimal-gray-600",
          steps: 6,
          category: "Development",
          users: "2.9K",
          rating: 4.7,
        },
        {
          title: "Security Audit Scanner",
          description: "Automated vulnerability detection and patching",
          icon: Shield,
          color: "from-minimal-primary to-minimal-gray-600",
          steps: 11,
          category: "Development",
          users: "2.1K",
          rating: 4.6,
        },
      ],
    },
  ];

  const toggleAccordion = (categoryId) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleMenuAction = (action, workflowTitle) => {
    console.log(`${action} action triggered for: ${workflowTitle}`);
    setOpenMenuId(null);
  };

  const toggleMenu = (workflowId, event) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === workflowId ? null : workflowId);
  };

  const filteredCategories = workflowCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.workflows.some(
        (workflow) =>
          workflow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const menuOptions = [
    {
      icon: Heart,
      label: "Add to Favorites",
      action: "favorite",
      className: "text-minimal-primary hover:text-minimal-white",
    },
    {
      icon: Copy,
      label: "Duplicate",
      action: "duplicate",
      className: "text-minimal-primary hover:text-minimal-white",
    },
    {
      icon: Edit3,
      label: "Edit Workflow",
      action: "edit",
      className: "text-minimal-primary hover:text-minimal-white",
    },
    {
      icon: Clock,
      label: "View History",
      action: "history",
      className: "text-minimal-primary hover:text-minimal-white",
    },
    {
      icon: Trash2,
      label: "Delete",
      action: "delete",
      className: "text-minimal-primary hover:text-minimal-white",
    },
  ];

  return (
    <div className="min-h-screen bg-minimal-background relative overflow-hidden">
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-minimal-white mb-4">
              Recommended Workflows
            </h1>
            <p className="text-minimal-muted text-lg">
              Discover AI-powered workflows tailored to your needs
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-12 max-w-2xl mx-auto">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-minimal-primary/20 to-minimal-gray-600/20 blur-sm"></div>
            <div className="relative bg-minimal-card/80 backdrop-blur-xl rounded-xl border border-minimal-border p-1">
              <div className="flex items-center">
                <div className="pl-4">
                  <Search className="w-5 h-5 text-minimal-muted" />
                </div>
                <input
                  type="text"
                  placeholder="Search workflows, categories, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-minimal-white placeholder-minimal-muted px-4 py-4 outline-none text-lg"
                />
              </div>
            </div>
          </div>

          {/* Category Accordions */}
          <div className="space-y-6">
            {filteredCategories.map((category) => {
              const CategoryIcon = category.icon;
              const isOpen = openAccordions[category.id];

              return (
                <div key={category.id} className="relative group">
                  {/* Holographic border effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-minimal-primary/10 to-minimal-gray-600/10 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>

                  <div className="relative bg-minimal-card/80 backdrop-blur-xl rounded-xl border border-minimal-border group-hover:border-minimal-primary/30 transition-all duration-500 overflow-hidden">
                    {/* Category Header */}
                    <button
                      onClick={() => toggleAccordion(category.id)}
                      className="w-full p-6 flex items-center justify-between hover:bg-minimal-cardHover/50 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${category.color} shadow-lg`}
                        >
                          <CategoryIcon className="w-6 h-6 text-minimal-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-xl font-semibold text-minimal-white mb-1">
                            {category.name}
                          </h3>
                          <p className="text-minimal-muted text-sm">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-minimal-primary text-sm font-medium">
                            {category.workflows.length} Workflows
                          </div>
                          <div className="text-xs text-minimal-muted">
                            {isOpen ? "Click to collapse" : "Click to expand"}
                          </div>
                        </div>
                        <div
                          className={`p-2 rounded-lg bg-minimal-cardHover text-minimal-primary transition-transform duration-300 ${
                            isOpen ? "rotate-180" : "rotate-0"
                          }`}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </button>

                    {/* Category Content */}
                    {isOpen && (
                      <div className="border-t border-minimal-border/50 p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                          {/* Create New Workflow Button */}
                          <div className="lg:col-span-1">
                            <div className="group/create relative cursor-pointer h-full min-h-[200px]">
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-minimal-primary/20 to-minimal-gray-600/20 opacity-0 group-hover/create:opacity-100 transition-all duration-500 blur-sm"></div>
                              <div className="relative bg-minimal-dark-100/60 rounded-xl border-2 border-dashed border-minimal-border group-hover/create:border-minimal-primary/50 p-6 flex flex-col items-center justify-center text-center h-full transition-all duration-300">
                                <div className="w-16 h-16 bg-gradient-to-br from-minimal-cardHover to-minimal-dark-100 rounded-xl flex items-center justify-center mb-4 group-hover/create:from-minimal-primary/50 group-hover/create:to-minimal-gray-600/50 transition-all duration-500">
                                  <Plus className="w-8 h-8 text-minimal-muted group-hover/create:text-minimal-primary transition-colors duration-300" />
                                </div>
                                <h4 className="text-minimal-white font-semibold mb-2 group-hover/create:text-minimal-primary transition-colors duration-300">
                                  Create New
                                </h4>
                                <p className="text-minimal-muted text-sm group-hover/create:text-minimal-white transition-colors duration-300">
                                  Build a custom {category.name.toLowerCase()}{" "}
                                  workflow
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Workflow Cards */}
                          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {category.workflows.map((workflow, index) => {
                              const IconComponent = workflow.icon;
                              const workflowId = `${category.id}-${index}`;
                              const isMenuOpen = openMenuId === workflowId;

                              return (
                                <div
                                  key={index}
                                  className="group/card relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                                >
                                  {/* Card glow effect */}
                                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-minimal-primary/20 to-minimal-gray-600/20 opacity-0 group-hover/card:opacity-100 transition-all duration-500 blur-sm"></div>

                                  <div className="relative bg-minimal-card/80 backdrop-blur-xl rounded-xl border border-minimal-border p-4 group-hover/card:border-minimal-primary/50 transition-all duration-500 h-full">
                                    <div className="flex items-start justify-between mb-3">
                                      <div
                                        className={`p-2 rounded-lg bg-gradient-to-r ${workflow.color} group-hover/card:scale-110 transition-transform duration-300`}
                                      >
                                        <IconComponent className="w-4 h-4 text-minimal-white" />
                                      </div>

                                      {/* Menu Button */}
                                      <div className="relative">
                                        <button
                                          onClick={(e) =>
                                            toggleMenu(workflowId, e)
                                          }
                                          className="p-1 rounded-lg hover:bg-minimal-cardHover transition-colors duration-200 opacity-0 group-hover/card:opacity-100"
                                        >
                                          <MoreHorizontal className="w-4 h-4 text-minimal-muted hover:text-minimal-primary" />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isMenuOpen && (
                                          <div className="absolute right-0 top-8 w-48 bg-minimal-card/95 backdrop-blur-sm rounded-lg border border-minimal-border shadow-2xl z-50 overflow-hidden">
                                            <div className="py-2">
                                              {menuOptions.map(
                                                (option, optionIndex) => {
                                                  const OptionIcon =
                                                    option.icon;
                                                  return (
                                                    <button
                                                      key={optionIndex}
                                                      onClick={() =>
                                                        handleMenuAction(
                                                          option.action,
                                                          workflow.title
                                                        )
                                                      }
                                                      className={`w-full flex items-center px-4 py-2 text-sm hover:bg-minimal-cardHover/50 transition-all duration-200 ${option.className}`}
                                                    >
                                                      <OptionIcon className="w-4 h-4 mr-3" />
                                                      <span>
                                                        {option.label}
                                                      </span>
                                                    </button>
                                                  );
                                                }
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <h4 className="text-minimal-white font-semibold text-sm mb-2 group-hover/card:text-minimal-primary transition-colors duration-300">
                                      {workflow.title}
                                    </h4>
                                    <p className="text-minimal-muted text-xs leading-relaxed mb-4 group-hover/card:text-minimal-white transition-colors duration-300">
                                      {workflow.description}
                                    </p>

                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between text-xs"></div>
                                      <div className="text-xs text-minimal-muted">
                                        {workflow.users} users
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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

export default RecommendedWorkflowsPage;
