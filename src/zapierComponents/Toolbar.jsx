import React, { useState } from "react";
import { Square, MoveUpRight } from "lucide-react";

const Toolbar = () => {
  const [selectedTool, setSelectedTool] = useState("square");

  const tools = [
    { id: "square", icon: <Square />, name: "Rectangle" },
    { id: "arrow", icon: <MoveUpRight />, name: "Arrow" },
  ];

  return (
    <div className="">
      {/* Floating Toolbar */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/5 z-50">
        <div className="bg-slate-800/90 backdrop-blur-xl border border-cyan-400/50 rounded-2xl p-2 flex items-center gap-2 shadow-2xl shadow-cyan-500/20 relative">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`
                relative  rounded-xl font-medium text-sm transition-all duration-300 ease-out w-12 h-12
                flex items-center justify-center gap-2 group overflow-hidden
                ${
                  selectedTool === tool.id
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-105"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }
              `}
            >
              <span className="text-4xl relative z-10 p-1">{tool.icon}</span>

              {/* Active indicator */}
              {selectedTool === tool.id && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Additional outer glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur-3xl -z-30 animate-pulse" />
      </div>
    </div>
  );
};

export default Toolbar;
