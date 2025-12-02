import React from "react";
import { Plus } from "lucide-react";
import Existing from "./workflows/Existing";
import Unfinished from "./workflows/Unfinished";
import Recommended from "./workflows/Recommended";
import MostPopular from "./workflows/MostPopular";
import { useNavigate } from "react-router-dom";

const WorkflowEngine = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-transparent">
      {/* Unified Main Content Container */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 py-10 px-2 sm:px-0">
        <div className="w-full  border border-[#23b5b5]/50 rounded-2xl shadow-2xl p-8 flex flex-col gap-10">
          {/* Top Row: Create Workflow & Most Popular */}
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Create Workflow Button Card */}
            <div
              onClick={() => navigate("/workflows/create")}
              className=" w-[31%] cursor-pointer group flex flex-col justify-center"
            >
              <div className="min-h-[300px] bg-[#13161a] border border-[#23b5b5]/50 rounded-xl p-6 flex flex-col items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-[1.01] group-hover:shadow-cyan-700/30">
                <div className="inline-flex p-3 rounded-full bg-minimal-primary/90 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-7 h-7 text-cyan-200" />
                </div>
                <h3 className="text-2xl font-bold text-cyan-100 mb-1 group-hover:text-minimal-primary transition-colors duration-300">
                  Create Custom Workflow
                </h3>
                <p className="text-minimal-primary text-base text-center group-hover:text-cyan-200 transition-colors duration-300">
                  Build your own automated workflow from scratch with our visual
                  drag-and-drop editor
                </p>
                <div className="mt-4">
                  <div className="inline-flex items-center px-4 py-2 bg-minimal-primary/90 rounded-lg text-cyan-100 font-semibold hover:from-teal-600 hover:to-teal-800 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-700/25 text-sm">
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
            {/* Most Popular Workflows */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="border border-[#23b5b5]/50 rounded-xl p-6 shadow-md h-full flex flex-col justify-center">
                <MostPopular />
              </div>
            </div>
          </div>
          {/* Recommended For You */}
          <div className="w-full">
            <div className=" border border-[#23b5b5]/50 rounded-xl p-6 shadow-md">
              <Recommended />
            </div>
          </div>
          {/* Unfinished and Existing Workflows */}
          <div className="w-full flex flex-col md:flex-row gap-2">
            <div className="flex-1  border border-[#23b5b5]/50 rounded-xl p-6 shadow-md">
              <Unfinished />
            </div>
            <div className="flex-1 border border-[#23b5b5]/50 rounded-xl p-6 shadow-md">
              <Existing />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowEngine;
