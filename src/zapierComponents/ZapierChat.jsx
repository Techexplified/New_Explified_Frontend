import React, { useState } from "react";
import {
  Play,
  Sparkles,
  Zap,
  Video,
  Clock,
  ChevronDown,
  Check,
  Download,
} from "lucide-react";

const ZapierChat = () => {
  const [prompt, setPrompt] = useState("");
  const [videoType, setVideoType] = useState("normal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const videoTypes = [
    {
      value: "normal",
      label: "Normal Video",
      icon: Video,
      duration: "5-15 min",
    },
    {
      value: "short",
      label: "YouTube Short",
      icon: Clock,
      duration: "15-60 sec",
    },
  ];

  const selectedType = videoTypes.find((type) => type.value === videoType);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setShowSuccess(false);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 250);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Card with Glowing Border */}
      <div className="relative group">
        {/* Glowing Border Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse"></div>

        {/* Main Content */}
        <div className="relative border-2 border-cyan-700 bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 ">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-700 rounded-lg blur-sm opacity-60"></div>
              <div className="relative bg-gradient-to-r from-cyan-500 to-blue-400 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Workflow</h2>
              <p className="text-gray-400 text-xs">
                Create stunning videos with zeno
              </p>
            </div>
          </div>

          {/* Video Type Selector */}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Video Type
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-gray-800/60 border border-gray-600/60 rounded-lg px-3 py-2.5 text-left flex items-center justify-between transition-all duration-300 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/10 text-sm"
              >
                <div className="flex items-center space-x-2">
                  <selectedType.icon className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-white font-medium">
                      {selectedType.label}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {selectedType.duration}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800/95 backdrop-blur-xl border border-gray-600/60 rounded-lg overflow-hidden z-20 transform transition-all duration-300">
                  {videoTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setVideoType(type.value);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2.5 text-left flex items-center space-x-2 hover:bg-gray-700/50 transition-colors duration-200 text-sm"
                    >
                      <type.icon className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="text-white font-medium">
                          {type.label}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {type.duration}
                        </div>
                      </div>
                      {videoType === type.value && (
                        <Check className="w-4 h-4 text-cyan-400 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Video Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your video idea..."
              className="w-full bg-gray-800/60 border border-gray-600/60 rounded-lg px-3 py-2.5 text-white placeholder-gray-400 resize-none h-20 text-sm transition-all duration-300 focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/20 focus:outline-none hover:border-gray-500/60"
              rows={3}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 transform ${
              !prompt.trim() || isGenerating
                ? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-800 text-white hover:from-cyan-400 hover:to-blue-900 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98]"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Generate Video</span>
                </>
              )}
            </div>
          </button>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="mt-4 transform transition-all duration-500">
              <div className="flex justify-between text-xs text-gray-300 mb-2">
                <span>Processing...</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-500 ease-out rounded-full relative"
                  style={{ width: `${generationProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="mt-4 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg transform transition-all duration-500">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-green-500 rounded-full">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-green-400 font-medium text-sm">
                    Video Ready!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZapierChat;
