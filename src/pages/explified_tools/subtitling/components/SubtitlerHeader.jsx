import { Bot } from "lucide-react";
import React from "react";

function SubtitlerHeader() {
  return (
    <div className="bg-black/50 backdrop-blur-sm border-b border-gray-800/50">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-blue-500 rounded-xl flex items-center justify-center">
            <Bot className="text-white w-5 h-5" />
          </div>
          <div className="flex-1"></div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Subtitler Tool
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Generate and customize subtitles with AI
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700/50">
            <span className="text-lg font-semibold">5</span>
            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubtitlerHeader;
