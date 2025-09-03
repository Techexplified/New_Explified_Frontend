import React, { useState, useRef } from "react";
import {
  MoreHorizontal,
  Heart,
  Trash2,
  Copy,
  Edit3,
  ExternalLink,
  Settings,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Unfinished = () => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();

  const menuRef = useRef(null);

  // Sample workflow data with tool icons
  const sampleWorkflows = [
    {
      id: "zoom-gdrive",
      title:
        "Receive New Zoom Cloud Recordings Automatically Uploaded to Google Drive",
      description:
        "Automatically save your Zoom cloud recordings to Google Drive whenever a new recording is available. Perfect for keeping meeting records organized and accessible.",
      tools: [
        { name: "Zoom", icon: "🔵", bgColor: "bg-minimal-primary" }, // Zoom blue
        { name: "Google Drive", icon: "📁", bgColor: "bg-minimal-gray-600" }, // Google Drive green
      ],
      category: "Marketing",
      recommended: true,
    },
    {
      id: "slack-trello",
      title: "Create Trello Cards from Slack Messages",
      description:
        "Transform important Slack messages into actionable Trello cards instantly. Keep track of tasks and follow-ups without leaving your chat.",
      tools: [
        { name: "Slack", icon: "💬", bgColor: "bg-minimal-gray-700" },
        { name: "Trello", icon: "📋", bgColor: "bg-minimal-primary" },
      ],
      category: "Content",
      recommended: true,
    },
  ];

  const menuOptions = [
    {
      icon: ExternalLink,
      label: "View Details",
      action: "view",
      className: "text-minimal-muted hover:text-minimal-primary",
    },
    {
      icon: Copy,
      label: "Duplicate",
      action: "duplicate",
      className: "text-minimal-muted hover:text-minimal-primary",
    },
    {
      icon: Edit3,
      label: "Edit",
      action: "edit",
      className: "text-minimal-muted hover:text-minimal-primary",
    },
    {
      icon: Settings,
      label: "Settings",
      action: "settings",
      className: "text-minimal-muted hover:text-minimal-primary",
    },
    {
      icon: Trash2,
      label: "Remove",
      action: "remove",
      className: "text-minimal-gray-500 hover:text-minimal-gray-400",
    },
  ];

  const toggleMenu = (workflowId, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === workflowId ? null : workflowId);
  };

  const handleMenuAction = (action, workflowTitle) => {
    console.log(`${action} action for: ${workflowTitle}`);
    setOpenMenuId(null);
  };

  // Close menu when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (menuRef.current && !menuRef.current.contains(event.target)) {
  //       setOpenMenuId(null);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  return (
    <div className="bg-gradient-to-br from-cyan-1000 via-black to-cyan-950 ">
      <div className="w-full pt-5 pb-10 px-5">
        {/* heading */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl w-fit font-bold text-white">
            Unfinished Workflows
          </h2>
          <button
            onClick={() => navigate("/workflows/unfinished")}
            className="text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors duration-200"
          >
            Show All
          </button>
        </div>

        {/* workflows card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleWorkflows.map((workflow) => {
            const isMenuOpen = openMenuId === workflow.id;

            return (
              <div
                key={workflow.id}
                onClick={() => navigate("/locked")}
                className="w-[220px] group relative bg-gradient-to-br from-black via-cyan-950 to-cyan-900/80 border border-cyan-700 rounded-xl p-5 
                       hover:bg-[#23b5b5]/40 transition-all duration-300 transform hover:-translate-y-2 
                       hover:shadow-xl hover:shadow-teal-500/30 cursor-pointer flex flex-col h-64"
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-700/10 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Header - Tools Icons and Menu */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {/* Tool Icons */}
                      <div className="flex -space-x-2">
                        {workflow.tools.map((tool, index) => (
                          <div
                            key={index}
                            className={`w-10 h-10 ${tool.bgColor} rounded-lg flex items-center justify-center 
                                   text-white text-lg shadow-lg border-2 border-teal-500/30 
                                   group-hover:scale-110 transition-transform duration-300`}
                            title={tool.name}
                            style={{ zIndex: workflow.tools.length - index }}
                          >
                            {tool.icon}
                          </div>
                        ))}
                      </div>

                      {/* Arrow connector */}
                      <svg
                        className="w-6 h-6 text-gray-300 group-hover:text-teal-400 transition-colors duration-300"
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

                    {/* Menu Button */}
                    <div className="relative" ref={menuRef}>
                      <button
                        onClick={(e) => toggleMenu(workflow.id, e)}
                        className="p-2 rounded-lg hover:bg-black/20 transition-colors duration-200 z-20 relative"
                      >
                        <MoreHorizontal className="w-5 h-5 text-gray-300 hover:text-teal-400 transition-colors duration-200" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-10 w-48 bg-[#1a1a1a] rounded-lg border border-teal-400 shadow-2xl z-30 overflow-hidden">
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
                                  className={`w-full flex items-center px-4 py-2 text-sm hover:bg-black/40 transition-all duration-200 ${option.className}`}
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

                  {/* Content - Workflow Description */}
                  <div className="flex-1 ">
                    <div className="inline-block px-2 py-1 bg-black/40 rounded-md text-xs text-teal-400 mb-3">
                      {workflow.category}
                    </div>

                    <h3 className="text-base font-semibold line-clamp-3 text-white group-hover:text-teal-300 transition-colors duration-300 leading-tight">
                      {workflow.title}
                    </h3>
                  </div>

                  {/* Footer - Recommended Badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                    {workflow.recommended && (
                      <div className="flex items-center text-teal-400">
                        <Sparkles className="w-4 h-4 mr-2" />
                        <span className="text-xs font-medium">
                          Recommended for you
                        </span>
                      </div>
                    )}

                    <div className="flex items-center text-teal-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1 ml-auto">
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
