import React, { useState, useRef } from "react";
import {
  MoreHorizontal,
  Trash2,
  Copy,
  Edit3,
  ExternalLink,
  Settings,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Recommended = () => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();

  const menuRef = useRef(null);

  // Sample workflow data with tool icons
  const sampleWorkflows = [
    {
      id: "crm-email-follow",
      title: "CRM Contact to Email Follow-up Automation",
      description:
        "Automatically send personalized follow-up emails when new contacts are added to your CRM. Perfect for nurturing leads and maintaining customer relationships.",
      tools: [
        { name: "CRM", icon: "�", bgColor: "bg-blue-600" },
        { name: "Email", icon: "�", bgColor: "bg-green-600" },
      ],
      category: "Sales",
      recommended: true,
    },
    {
      id: "expense-approval",
      title: "Expense Report Approval Workflow",
      description:
        "Streamline expense approvals with automated routing to managers and integration with accounting systems. Reduce processing time and improve compliance.",
      tools: [
        { name: "Expenses", icon: "�", bgColor: "bg-purple-600" },
        { name: "Approval", icon: "✅", bgColor: "bg-orange-600" },
      ],
      category: "Finance",
      recommended: true,
    },
    {
      id: "inventory-reorder",
      title: "Inventory Low Stock Alert & Reorder",
      description:
        "Monitor inventory levels and automatically create purchase orders when stock runs low. Prevent stockouts and optimize inventory management.",
      tools: [
        { name: "Inventory", icon: "�", bgColor: "bg-red-600" },
        { name: "Orders", icon: "�", bgColor: "bg-yellow-600" },
      ],
      category: "Operations",
      recommended: true,
    },
    {
      id: "customer-onboarding",
      title: "Customer Onboarding Sequence",
      description:
        "Welcome new customers with automated email sequences, account setup tasks, and training material delivery. Ensure consistent onboarding experience.",
      tools: [
        { name: "Customer", icon: "🎯", bgColor: "bg-indigo-600" },
        { name: "Email", icon: "�", bgColor: "bg-teal-600" },
      ],
      category: "Customer Success",
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
    <div className="bg-transparent">
      <div className="w-full pt-5 pb-10 px-5">
        {/* heading */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl w-fit font-bold text-white">
            Recommended Workflows
          </h2>
          <button
            onClick={() => navigate("/workflows/recommended")}
            className="text-sm font-semibold text-[#23b5b5] hover:text-white transition-colors duration-200"
          >
            Show All
          </button>
        </div>

        {/* workflows grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleWorkflows.map((workflow) => {
            const isMenuOpen = openMenuId === workflow.id;

            return (
              <div
                key={workflow.id}
                onClick={() => navigate("/locked")}
                className="w-[220px] group relative bg-gradient-to-br from-[#0d1418] to-[#111c20] border border-[#23b5b5]/40 rounded-xl p-5 
                       hover:bg-[#23b5b5]/15 hover:border-[#23b5b5] transition-all duration-300 transform hover:-translate-y-2 
                       hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer flex flex-col h-64"
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#23b5b5]/10 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

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
                                   text-white text-lg shadow-lg border-2 border-[#23b5b5]/30 
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
                        className="w-6 h-6 text-gray-300 group-hover:text-[#23b5b5] transition-colors duration-300"
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
                        <MoreHorizontal className="w-5 h-5 text-gray-300 hover:text-[#23b5b5] transition-colors duration-200" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-10 w-48 bg-[#1a1a1a] rounded-lg border border-[#23b5b5] shadow-2xl z-30 overflow-hidden">
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
                  <div className="flex-1">
                    <div className="inline-block px-2 py-1 bg-black/40 rounded-md text-xs text-[#23b5b5] mb-3">
                      {workflow.category}
                    </div>

                    <h3 className="text-base font-semibold line-clamp-3 text-white group-hover:text-[#23b5b5] transition-colors duration-300 leading-tight">
                      {workflow.title}
                    </h3>
                  </div>

                  {/* Footer - Recommended Badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                    {workflow.recommended && (
                      <div className="flex items-center text-[#23b5b5]">
                        <Sparkles className="w-4 h-4 mr-2" />
                        <span className="text-xs font-medium">
                          Recommended for you
                        </span>
                      </div>
                    )}

                    <div className="flex items-center text-[#23b5b5] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1 ml-auto">
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

export default Recommended;
