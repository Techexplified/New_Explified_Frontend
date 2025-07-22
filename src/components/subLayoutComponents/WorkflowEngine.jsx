import React from "react";
import {
  Plus,
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
  Settings,
} from "lucide-react";
import { useState } from "react";

const WorkflowEngine = () => {
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
    {
      title: "Data Processing Pipeline",
      description:
        "ETL workflow for data extraction, transformation, validation, and warehouse loading.",
      icon: Database,
      color: "from-cyan-600 to-indigo-500",
      steps: 6,
      category: "Data",
    },
    {
      title: "Cloud Resource Provisioning",
      description:
        "Infrastructure as code workflow with auto-scaling, monitoring, and cost optimization.",
      icon: Cloud,
      color: "from-cyan-500 to-emerald-500",
      steps: 4,
      category: "Infrastructure",
    },
    {
      title: "Document Approval Process",
      description:
        "Multi-stakeholder document review workflow with notifications and version control.",
      icon: FileText,
      color: "from-cyan-400 to-orange-500",
      steps: 8,
      category: "Business",
    },
    {
      title: "API Integration Workflow",
      description:
        "Seamless third-party API integration with error handling and data synchronization.",
      icon: Zap,
      color: "from-cyan-500 to-yellow-500",
      steps: 5,
      category: "Integration",
    },
    {
      title: "Employee Onboarding",
      description:
        "Complete new hire workflow including account setup, training, and compliance checks.",
      icon: Users,
      color: "from-cyan-600 to-pink-500",
      steps: 12,
      category: "HR",
    },
    {
      title: "Event Management",
      description:
        "End-to-end event planning workflow with scheduling, invitations, and follow-up tasks.",
      icon: Calendar,
      color: "from-cyan-400 to-teal-500",
      steps: 9,
      category: "Operations",
    },
    {
      title: "Security Incident Response",
      description:
        "Automated security workflow with threat detection, escalation, and remediation steps.",
      icon: Shield,
      color: "from-cyan-500 to-red-500",
      steps: 6,
      category: "Security",
    },
    {
      title: "Business Analytics Report",
      description:
        "Automated report generation with data collection, analysis, and stakeholder distribution.",
      icon: BarChart3,
      color: "from-cyan-600 to-violet-500",
      steps: 7,
      category: "Analytics",
    },
  ];

  const [accordionOpen, setAccordionOpen] = useState(false);

  return (
    <div className="mt-10 w-full">
      {/* Main Container */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 md:p-6 lg:p-8 shadow-2xl flex flex-col md:flex-row gap-6">
        {/* Create Workflow Button Card */}
        <div className="mb-6 md:mb-0 w-full h-full md:w-1/3 flex-shrink-0 flex flex-col items-center justify-center">
          {/* Card content reduced in size */}
          <div className="group mt-10  h-[325px] flex items-center justify-center relative bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-4 md:p-6 border-2 border-dashed border-cyan-500/50 hover:border-cyan-400 transition-all duration-300 hover:transform hover:scale-[1.02] cursor-pointer w-full">
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mb-3 group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300">
                Create Custom Workflow
              </h3>
              <p className="text-gray-400 text-base group-hover:text-gray-300 transition-colors duration-300">
                Build your own automated workflow from scratch with our visual
                drag-and-drop editor
              </p>
              <div className="mt-4">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25 text-sm">
                  <span>Get Started</span>
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prebuilt Workflows Grid as Accordion */}
        <div className="w-full md:w-2/3">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6">
            Pre-built Workflow Templates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {(accordionOpen
              ? prebuiltWorkflows
              : prebuiltWorkflows.slice(0, 6)
            ).map((workflow, index) => {
              const IconComponent = workflow.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-gray-800 rounded-xl p-3 md:p-4 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer flex-shrink-0 w-full h-32 md:h-36 flex flex-col justify-between"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="inline-block px-2 py-1 bg-gray-700 rounded-md text-xs text-cyan-300 mb-1 md:mb-2">
                      {workflow.category}
                    </div>
                    <div
                      className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${workflow.color} mb-2 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300">
                      {workflow.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-snug mb-1 md:mb-2 group-hover:text-gray-300 transition-colors duration-300 truncate overflow-hidden whitespace-nowrap">
                      {workflow.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500">
                        <Settings className="w-4 h-4 mr-1" />
                        <span className="text-xs">{workflow.steps} steps</span>
                      </div>
                      <div className="flex items-center text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                        <span className="text-xs font-medium">
                          Use Template
                        </span>
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
          {/* Accordion Toggle Button */}
          <div className="flex justify-center mt-3 md:mt-4">
            <button
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-md text-sm md:text-base"
              onClick={() => setAccordionOpen((open) => !open)}
            >
              {accordionOpen
                ? "Show Less"
                : `Show All (${prebuiltWorkflows.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowEngine;
