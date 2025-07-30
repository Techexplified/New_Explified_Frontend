import React, { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  Heart,
  Trash2,
  Copy,
  Edit3,
  Clock,
  GitBranch,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Unfinished = () => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const prebuiltWorkflows = [
    {
      title: "CI/CD Pipeline",
      description:
        "Automated build, test, and deployment workflow with quality gates and rollback capabilities.",
      icon: GitBranch,
      color: "from-cyan-500 to-blue-500",
      steps: 5,
      category: "Development",
    },
    {
      title: "Email Marketing Campaign",
      description:
        "Multi-step email automation with A/B testing, segmentation, and performance tracking.",
      icon: Mail,
      color: "from-cyan-400 to-purple-500",
      steps: 7,
      category: "Marketing",
    },
  ];

  const menuOptions = [
    {
      icon: Heart,
      label: "Add to Favorites",
      action: "favorite",
      className: "text-cyan-400 hover:text-cyan-300",
    },
    {
      icon: Copy,
      label: "Duplicate",
      action: "duplicate",
      className: "text-cyan-400 hover:text-cyan-300",
    },
    {
      icon: Edit3,
      label: "Edit Workflow",
      action: "edit",
      className: "text-cyan-400 hover:text-cyan-300",
    },
    {
      icon: Clock,
      label: "View History",
      action: "history",
      className: "text-cyan-400 hover:text-cyan-300",
    },
    {
      icon: Trash2,
      label: "Delete",
      action: "delete",
      className: "text-cyan-400 hover:text-cyan-300",
    },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuAction = (action, workflowTitle) => {
    console.log(`${action} action triggered for: ${workflowTitle}`);
    setOpenMenuId(null);

    // You can add specific logic for each action here
    switch (action) {
      case "favorite":
        // Add to favorites logic
        break;
      case "duplicate":
        // Duplicate workflow logic
        break;
      case "edit":
        // Edit workflow logic
        break;
      case "history":
        // View history logic
        break;
      case "delete":
        // Delete workflow logic
        break;
      default:
        break;
    }
  };

  const toggleMenu = (workflowId, event) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === workflowId ? null : workflowId);
  };

  return (
    <div className="w-full bg-gray-900 rounded-2xl border border-gray-800">
      <div className="w-full py-10 px-5">
        {/* heading */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl w-fit font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Unfinished Workflows
          </h2>
          <button
            onClick={() => navigate("/workflows/unfinished")}
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
          >
            Show All
          </button>
        </div>

        {/* workflows */}
        <div className="w-full flex flex-wrap gap-4">
          {prebuiltWorkflows.map((workflow, index) => {
            const IconComponent = workflow.icon;
            const workflowId = `workflow-${index}`;
            const isMenuOpen = openMenuId === workflowId;

            return (
              <div
                key={index}
                className="group relative w-[330px] bg-gray-800 rounded-xl p-3 md:p-4 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer flex-shrink-0 h-32 md:h-36 flex flex-col justify-between"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="inline-block px-2 py-1 bg-gray-700 rounded-md text-xs text-cyan-300 mb-1 md:mb-2">
                        {workflow.category}
                      </div>
                      <div
                        className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${workflow.color} mb-2 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Menu Button with Dropdown */}
                    <div className="relative" ref={menuRef}>
                      <button
                        onClick={(e) => toggleMenu(workflowId, e)}
                        className="p-1 rounded-lg hover:bg-gray-700 transition-colors duration-200 z-20 relative"
                      >
                        <MoreHorizontal className="w-5 h-5 text-gray-400 hover:text-cyan-400 transition-colors duration-200" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-8 w-48 bg-gray-800 rounded-lg border border-gray-700 shadow-2xl z-30 overflow-hidden">
                          {/* Menu backdrop blur effect */}
                          <div className="absolute inset-0 bg-gray-800/95 backdrop-blur-sm"></div>

                          <div className="relative z-10 py-2">
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
                                  className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-700/50 transition-all duration-200 ${option.className}`}
                                >
                                  <OptionIcon className="w-4 h-4 mr-3" />
                                  <span>{option.label}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Menu border glow effect */}
                          <div className="absolute inset-0 rounded-lg border border-cyan-500/20 pointer-events-none"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm md:text-base font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300">
                    {workflow.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-snug mb-1 md:mb-2 group-hover:text-gray-300 transition-colors duration-300 truncate overflow-hidden whitespace-nowrap">
                    {workflow.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                      <span className="text-xs font-medium">Use Workflow</span>
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Unfinished;
