import React, { useState } from "react";
import { Upload, Play, Zap, CheckCircle, Trash2 } from "lucide-react";

export default function VideoGeneratorUI() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoLink, setVideoLink] = useState("");
  const [previewURL, setPreviewURL] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setVideoFile(file);
      setPreviewURL(url);
      setIsComplete(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleVideoLinkChange = (e) => {
    const link = e.target.value;
    setVideoLink(link);
    if (link) {
      setPreviewURL(link);
      setIsComplete(false);
    }
  };

  const handleGenerate = async () => {
    if (!previewURL) return;
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsGenerating(false);
    setIsComplete(true);
  };

  const clearAll = () => {
    setVideoFile(null);
    setVideoLink("");
    setPreviewURL("");
    setIsComplete(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: "#23b5b5" }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: "#23b5b5" }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <div
              className="p-3 rounded-2xl"
              style={{ backgroundColor: "#23b5b5" }}
            >
              <Zap className="w-8 h-8 text-black" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-2" style={{ color: "#23b5b5" }}>
            Video Generator
          </h1>
          <p className="text-gray-400 text-lg">
            Transform your videos with AI-powered generation
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-8">
          {/* File Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative group cursor-pointer transition-all duration-300 ${
              dragActive ? "scale-105" : ""
            }`}
          >
            <div
              className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
                dragActive
                  ? "border-cyan-400 bg-cyan-400 bg-opacity-10"
                  : "border-slate-700 bg-slate-800 bg-opacity-50 hover:border-cyan-400 hover:bg-cyan-400 hover:bg-opacity-5"
              }`}
            >
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload
                  className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform"
                  style={{ color: "#23b5b5" }}
                />
                <span className="text-lg font-semibold mb-1">
                  Upload Video File
                </span>
                <span className="text-sm text-gray-400">
                  or drag and drop your video here
                </span>
                <span className="text-xs text-gray-500 mt-2">
                  MP4, WebM, MOV up to 2GB
                </span>
              </label>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            <span className="text-slate-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
          </div>

          {/* Video Link Input */}
          <div className="relative group">
            <label className="block mb-3 text-sm font-semibold text-slate-300">
              Paste Video Link
            </label>
            <input
              type="text"
              value={videoLink}
              onChange={handleVideoLinkChange}
              placeholder="https://example.com/video.mp4"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border-2 border-slate-700 focus:border-cyan-400 focus:outline-none transition-all text-white placeholder-slate-500"
            />
          </div>

          {/* Video Preview */}
          {previewURL && (
            <div className="relative rounded-xl overflow-hidden border-2 border-slate-700 bg-black shadow-2xl group">
              <div className="relative aspect-video bg-black">
                <video
                  src={previewURL}
                  controls
                  className="w-full h-full"
                  onError={() => setPreviewURL("")}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Play className="w-16 h-16 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          )}

          {/* Generate Button & Status */}
          <div className="flex flex-col gap-4">
            {isComplete && (
              <div className="p-4 rounded-lg bg-emerald-500 bg-opacity-20 border border-emerald-500 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-emerald-200">
                  Video generated successfully!
                </span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!previewURL || isGenerating}
              className="w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  !previewURL || isGenerating
                    ? "linear-gradient(135deg, #1e293b, #0f172a)"
                    : isComplete
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "linear-gradient(135deg, #06b6d4, #0284c7)",
              }}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </div>
              ) : isComplete ? (
                "Generated Successfully ✓"
              ) : (
                "Generate Video"
              )}
            </button>

            {previewURL && (
              <button
                onClick={clearAll}
                className="w-full py-2 px-6 rounded-lg font-medium transition-all duration-300 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-400 hover:bg-slate-800 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
