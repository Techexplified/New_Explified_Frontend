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
  Ellipsis,
} from "lucide-react";
import { useState } from "react";
import Existing from "./workflows/Existing";
import Unfinished from "./workflows/Unfinished";
import Recommended from "./workflows/Recommended";
import MostPopular from "./workflows/MostPopular";
import { useNavigate } from "react-router-dom";

const WorkflowEngine = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      {/* Main Container */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 md:p-6 lg:p-8 shadow-2xl flex flex-col md:flex-row gap-6">
        {/* Create Workflow Button Card */}
        <div
          onClick={() => navigate("/workflows/create")}
          className="mb-6 md:mb-0 w-full h-full md:w-1/3 flex-shrink-0 flex flex-col items-center justify-center"
        >
          {/* Card content reduced in size */}
          <div className="group h-[370px] flex items-center justify-center relative bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-4 md:p-6 border-2 border-dashed border-cyan-500/50 hover:border-cyan-400 transition-all duration-300 hover:transform hover:scale-[1.02] cursor-pointer w-full">
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

        {/* most popular workflows */}
        <MostPopular />
      </div>
      {/* Recommended For You */}
      <Recommended />
      {/* unfinished and existing workflows */}
      <div className="w-full bg-gray-900 rounded-2xl border border-gray-800 flex">
        {/* unfinished workflows */}
        <Unfinished />

        {/* existing workflows */}
        <Existing />
      </div>
    </div>
  );
};

export default WorkflowEngine;
