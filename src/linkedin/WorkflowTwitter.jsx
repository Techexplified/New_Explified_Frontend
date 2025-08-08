import React, { useState, useEffect } from "react";
import { ChevronLeft, Plus, Check } from "lucide-react";

const WorkflowTwitter = () => {
  const [eventType, setEventType] = useState("Posting");
  const [watchPreview, setWatchPreview] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowNavbar(scrollY < 70);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddStep = () => {
    alert("Add new step functionality would be implemented here");
  };

  const dotGrid = {
    backgroundImage: "radial-gradient(#ffffff 1.2px, transparent 1.2px)",
    backgroundSize: "48px 48px",
  };

  return (
    <div
      style={dotGrid}
      className="min-h-screen text-white overflow-hidden relative"
    >
      <div className="flex min-h-screen relative z-10">
        {/* Main Panel */}
        <div className="flex-1 p-8 flex flex-col items-center relative">
          {/* Back Button */}
          <button className="absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold bg-white bg-clip-text text-transparent tracking-tight leading-tight mb-4 mt-12">
            Prompt to Post - Twitter
          </h1>

          {/* Workflow Container */}
          <div className="flex flex-col items-center gap-8 mt-2 mb-4">
            {/* Status Indicator */}
            {/* <div className="border-2 border-[#1da3a3] bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full px-8 py-3 text-lg font-medium tracking-wide ">
              <div className="flex items-center gap-2">Zeno Active</div>
            </div> */}

            {/* Trigger Step */}
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 border border-white/20 rounded-xl p-6 min-w-[200px] text-center hover:bg-blue-600/40 hover:border-white/30 hover:-translate-y-1 transition-all duration-300">
              <div className="text-xs text-white/60 uppercase tracking-widest mb-2">
                Trigger
              </div>
              <div className="text-lg font-medium">Auto - captionist</div>
            </div>

            {/* Connector */}
            <div className="relative">
              <div className="w-1 h-16 bg-green-400"></div>
              {/* <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-white/40"></div> */}
            </div>

            {/* Action Step */}
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500  border border-white/20 rounded-xl p-6 min-w-[200px] text-center hover:bg-cyan-600/40 hover:border-white/30 hover:-translate-y-1 transition-all duration-300">
              <div className="text-xs text-white/60 uppercase tracking-widest mb-2">
                Action
              </div>
              <div className="text-lg font-medium">Twitter</div>
            </div>

            {/* Connector */}
            <div className="relative">
              <div className="w-1 h-16 bg-green-400"></div>
              {/* <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-white/40"></div> */}
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddStep}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-dashed border-white/30 flex items-center justify-center text-white/50 hover:bg-white/20 hover:border-white/50 hover:text-white hover:scale-110 transition-all duration-300"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* Sidebar - Dynamic height based on scroll */}
        <div
          className={`w-80 fixed right-0 bg-slate-800/90 transition-all duration-300 backdrop-blur-xl border-l border-white/10 p-8 flex flex-col ${
            showNavbar ? "h-[calc(100vh-70px)] top-[70px]" : "h-screen top-0"
          }`}
        >
          <h2 className="text-xl font-medium mb-8 text-center">Twitter</h2>

          {/* Link Account */}
          <div className="mb-6">
            <label className="block text-sm text-white/80 mb-2">
              Link account :
            </label>
            <input
              type="email"
              value="explified@gmail.com"
              readOnly
              className="w-full px-3 py-2 bg-slate-700/80 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-400 focus:bg-slate-700"
            />
          </div>

          {/* Event Dropdown */}
          <div className="mb-6">
            <label className="block text-sm text-white/80 mb-2">Event :</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/80 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              <option value="Posting">Posting A Tweet</option>
              <option value="Comment">Comment</option>
              <option value="Share">Share</option>
            </select>
          </div>

          {/* Watch Preview Checkbox */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => setWatchPreview(!watchPreview)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                watchPreview
                  ? "bg-blue-500 border-blue-500"
                  : "bg-slate-700/80 border-white/30 hover:border-white/50"
              }`}
            >
              {watchPreview && <Check size={12} className="text-white" />}
            </button>
            <label
              className="text-sm text-white/80 cursor-pointer"
              onClick={() => setWatchPreview(!watchPreview)}
            >
              Watch Preview
            </label>
          </div>

          {/* Continue Button */}
          <button className="mt-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/25 tracking-wide">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowTwitter;
