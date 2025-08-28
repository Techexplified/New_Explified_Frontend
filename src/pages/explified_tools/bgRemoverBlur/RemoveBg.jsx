import React, { useState, useRef } from "react";
import {
  Upload,
  Download,
  X,
  Loader2,
  Image as ImageIcon,
  Trash2,
  RotateCcw,
  Zap,
} from "lucide-react";

// Replace this with your real API key
const REMOVE_BG_API_KEY = "8uMp7opx1W9MCANRL5uCYAdq";

const RemoveBackground = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [limitExceeded, setLimitExceeded] = useState(false);
  const fileInputRef = useRef(null);

  // Handle File Selection
  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setError(null);
    setLimitExceeded(false);
    setSelectedFile(file);
    setProcessedImage(null);
    setPreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => handleFileSelect(e.target.files?.[0]);

  // Drag & Drop Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  // Upload & Remove Background (remove.bg API)
  const handleUpload = async () => {
    if (!selectedFile) return;

    if (!REMOVE_BG_API_KEY) {
      setError("API key not configured. Please set REMOVE_BG_API_KEY.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("size", "auto");
      formData.append("image_file", selectedFile);

      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": REMOVE_BG_API_KEY },
        body: formData,
      });

      if (!response.ok) {
        let messageText = await response.text();
        try {
          const json = JSON.parse(messageText);
          if (json?.errors?.length) {
            messageText = json.errors
              .map((e) => e.title || e.detail)
              .filter(Boolean)
              .join(", ");
          }
        } catch (_) {}
        let friendlyMessage = messageText || response.statusText;
        if (response.status === 402) {
          friendlyMessage =
            "API credits exhausted for remove.bg. Please top up your credits and try again.";
          setLimitExceeded(true);
        } else if (response.status === 429) {
          friendlyMessage = "Rate limit reached. Please retry later.";
        } else if (response.status === 401 || response.status === 403) {
          friendlyMessage = "Invalid or unauthorized API key.";
        }
        throw new Error(friendlyMessage);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (err) {
      setError(err.message || "Failed to remove background.");
    } finally {
      setLoading(false);
    }
  };

  // Download Processed Image
  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `no-bg-${selectedFile?.name?.replace(/\.[^/.]+$/, "")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset
  const resetAll = () => {
    setSelectedFile(null);
    setPreview(null);
    setProcessedImage(null);
    setError(null);
    setLoading(false);
    setLimitExceeded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-black py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="bg-black border border-neutral-800 rounded-2xl px-6 py-4 shadow">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-[#23b5b5] to-cyan-400 rounded-full mb-3">
              <Zap className="w-7 h-7 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              AI Background <span className="text-[#23b5b5]">Remover</span>
            </h1>
            <p className="text-neutral-400 text-base max-w-2xl mx-auto">
              Upload an image and remove its background using the remove.bg API.
              Output is a high-quality PNG with transparency.
            </p>
          </div>
        </div>

        {/* File Upload Area */}
        <div className="bg-black border border-neutral-800 rounded-2xl p-6 mb-8 backdrop-blur">
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
              dragActive
                ? "border-[#23b5b5] bg-[#23b5b5]/10"
                : selectedFile
                ? "border-[#23b5b5]/40 bg-[#23b5b5]/5"
                : "border-neutral-700 hover:border-[#23b5b5]/50 hover:bg-[#23b5b5]/5"
            }`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-6">
                <div className="w-20 h-20 mx-auto bg-[#23b5b5]/20 border border-[#23b5b5]/30 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-[#23b5b5]" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-white mb-1">
                    {selectedFile.name}
                  </p>
                  <p className="text-neutral-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetAll();
                  }}
                  className="inline-flex items-center px-4 py-2 text-red-300 hover:text-red-200 hover:bg-red-400/10 rounded-full border border-red-400/30 transition-all"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove File
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-20 h-20 mx-auto bg-neutral-900 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-neutral-500" />
                </div>
                <p className="text-2xl font-semibold text-white mb-2">
                  Drag & drop your image here
                </p>
                <p className="text-neutral-400 text-lg mb-5">
                  or click to browse files
                </p>
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#23b5b5] to-cyan-400 text-black font-medium rounded-full hover:from-[#23b5b5]/90 hover:to-cyan-400/90 transition-all">
                  <Upload className="w-5 h-5 mr-2" />
                  Choose File
                </div>
                <p className="text-neutral-500 text-sm mt-4">
                  Supports: JPEG, PNG, WebP • Max size: 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error / Limit Exceeded */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <X className="w-5 h-5 text-red-400 mr-3" />
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}
        {limitExceeded && (
          <div className="mb-4 text-sm text-amber-300 bg-amber-900/20 border border-amber-900/40 rounded-md px-3 py-2">
            You have exhausted the remove.bg API credits. Please top up and try
            again.
          </div>
        )}

        {/* Process Button */}
        {selectedFile && !processedImage && (
          <div className="text-center mb-8">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="inline-flex items-center px-10 py-3 bg-gradient-to-r from-[#23b5b5] to-cyan-400 text-black font-semibold text-base rounded-full hover:from-[#23b5b5]/90 hover:to-cyan-400/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-[#23b5b5]/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Remove Background
                </>
              )}
            </button>
          </div>
        )}

        {/* Image Comparison */}
        {preview && (
          <div className="bg-black border border-neutral-800 rounded-2xl p-6 backdrop-blur">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <h3 className="text-base font-semibold text-white bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
                    Original Image
                  </h3>
                </div>
                <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                  <img
                    src={preview}
                    alt="Original"
                    className="w-full h-auto max-h-96 object-contain mx-auto rounded-lg"
                  />
                </div>
              </div>

              {/* Processed Image */}
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <h3 className="text-base font-semibold bg-gradient-to-r from-[#23b5b5] to-cyan-400 bg-clip-text text-transparent bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
                    <span className="text-[#23b5b5]">Background Removed</span>
                  </h3>
                </div>
                <div className="bg-neutral-900 rounded-xl border border-neutral-800">
                  {processedImage ? (
                    <div className="p-4">
                      <div className="checkered-bg rounded-lg p-6">
                        <img
                          src={processedImage}
                          alt="Processed"
                          className="w-full h-auto max-h-96 object-contain mx-auto"
                        />
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={downloadImage}
                          className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#23b5b5] to-cyan-400 text-black font-semibold rounded-full transition-all"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download PNG
                        </button>
                        <button
                          onClick={resetAll}
                          className="px-6 py-3 bg-neutral-900 text-white rounded-full border border-neutral-700 hover:bg-neutral-800 transition-all"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-neutral-500">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                          <ImageIcon className="w-8 h-8 text-neutral-500" />
                        </div>
                        <p className="text-lg">
                          Processed image will appear here
                        </p>
                        <p className="text-sm text-neutral-600 mt-2">
                          Upload and process to see the magic
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .checkered-bg {
          background-image: linear-gradient(45deg, #000 25%, transparent 25%),
            linear-gradient(-45deg, #000 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #000 75%),
            linear-gradient(-45deg, transparent 75%, #000 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          background-color: #000;
        }
      `}</style>
    </div>
  );
};

export default RemoveBackground;
