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
  Code,
  Megaphone,
  PenTool,
  Activity,
} from "lucide-react";

const RecommendedWorkflowsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openAccordions, setOpenAccordions] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);

  // Scroll on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --------------------------
  // WORKFLOW CATEGORIES
  // --------------------------

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

  // --------------------------
  // FILTER & MENU HELPERS
  // --------------------------

  const toggleAccordion = (categoryId) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const toggleMenu = (workflowId, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === workflowId ? null : workflowId);
  };

  const filteredCategories = workflowCategories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.workflows.some((wf) =>
        wf.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const menuOptions = [
    { icon: Heart, label: "Add to Favorites", action: "fav" },
    { icon: Copy, label: "Duplicate", action: "dup" },
    { icon: Edit3, label: "Edit Workflow", action: "edit" },
    { icon: Clock, label: "View History", action: "his" },
    { icon: Trash2, label: "Delete", action: "del" },
  ];

  // --------------------------
  // RESPONSIVE PAGE LAYOUT
  // --------------------------

  return (
    <div className="min-h-screen bg-minimal-background overflow-x-hidden ml-16 md:ml-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
        {/* ---- HEADER ---- */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Recommended Workflows
          </h1>
          <p className="text-minimal-muted text-sm sm:text-lg mt-2">
            Discover AI-powered workflows tailored to your needs
          </p>
        </div>

        {/* ---- SEARCH BAR ---- */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="bg-minimal-card/80 border border-minimal-border rounded-xl backdrop-blur-xl p-2">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-minimal-muted ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workflows, categories, or descriptions..."
                className="w-full bg-transparent outline-none py-3 pr-4 text-base sm:text-lg text-white placeholder-minimal-muted"
              />
            </div>
          </div>
        </div>

        {/* ---- ACCORDIONS ---- */}
        <div className="space-y-6">
          {filteredCategories.map((category) => {
            const CategoryIcon = category.icon;
            const isOpen = openAccordions[category.id];

            return (
              <div
                key={category.id}
                className="bg-minimal-card/70 border border-minimal-border rounded-xl backdrop-blur-xl overflow-hidden"
              >
                {/* ---- ACCORDION HEADER ---- */}
                <button
                  onClick={() => toggleAccordion(category.id)}
                  className="w-full p-5 flex items-center justify-between hover:bg-minimal-cardHover transition"
                >
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${category.color}`}
                    >
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>

                    <div className="text-left">
                      <h3 className="text-lg sm:text-xl text-white font-semibold">
                        {category.name}
                      </h3>
                      <p className="text-minimal-muted text-xs sm:text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT SIDE (RESTORED UI BLOCK) */}
                  <div className="flex items-center gap-4">
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

                {/* ---- ACCORDION CONTENT ---- */}
                {isOpen && (
                  <div className="border-t border-minimal-border/40 p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                      {/* ---- CREATE NEW ---- */}
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

                      {/* ---- WORKFLOW CARDS ---- */}
                      <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {category.workflows.map((workflow, i) => {
                          const IconComponent = workflow.icon;
                          const wid = `${category.id}-${i}`;
                          const isMenuOpen = openMenuId === wid;

                          return (
                            <div key={i} className="relative">
                              {/* Card */}
                              <div className="bg-minimal-card/80 backdrop-blur-xl border border-minimal-border rounded-xl p-4 hover:border-minimal-primary transition h-full">
                                <div className="flex justify-between items-start">
                                  <div
                                    className={`p-2 rounded-lg bg-gradient-to-r ${workflow.color}`}
                                  >
                                    <IconComponent className="w-4 h-4 text-white" />
                                  </div>

                                  {/* Menu Button */}
                                  <button
                                    onClick={(e) => toggleMenu(wid, e)}
                                    className="p-1 rounded-md hover:bg-minimal-cardHover"
                                  >
                                    <MoreHorizontal className="w-4 h-4 text-minimal-muted" />
                                  </button>

                                  {/* Dropdown */}
                                  {isMenuOpen && (
                                    <div className="absolute right-0 top-8 w-40 bg-minimal-card border border-minimal-border rounded-lg shadow-xl z-50 p-1">
                                      {menuOptions.map((opt, idx) => {
                                        const OptIcon = opt.icon;
                                        return (
                                          <button
                                            key={idx}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-minimal-cardHover text-white"
                                          >
                                            <OptIcon className="w-4 h-4" />
                                            {opt.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>

                                <h4 className="text-white text-sm font-semibold mt-3">
                                  {workflow.title}
                                </h4>
                                <p className="text-minimal-muted text-xs mt-1">
                                  {workflow.description}
                                </p>

                                <p className="text-minimal-muted text-xs mt-3">
                                  {workflow.users} users
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecommendedWorkflowsPage;
