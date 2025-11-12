import React, { useState, useRef } from "react";
import {
  Upload,
  Play,
  Download,
  Loader,
  Image,
  Video,
  Sparkles,
  X,
  RefreshCw,
} from "lucide-react";

const ImageToVideo = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [processingStep, setProcessingStep] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(5);
  const [style, setStyle] = useState("realistic");
  const fileInputRef = useRef(null);

  const processingSteps = [
    "Analyzing image...",
    "Generating motion vectors...",
    "Creating video frames...",
    "Rendering final video...",
  ];

  const styleOptions = [
    { value: "realistic", label: "Realistic", icon: "📸" },
    { value: "cinematic", label: "Cinematic", icon: "🎬" },
    { value: "animated", label: "Animated", icon: "🎨" },
    { value: "artistic", label: "Artistic", icon: "🖼️" },
  ];

  const durationOptions = [3, 5, 10, 15];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setGeneratedVideo(null); // Reset previous video
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setGeneratedVideo(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const generateVideo = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setProcessingStep(0);

    // Simulate AI processing steps
    for (let i = 0; i < processingSteps.length; i++) {
      setProcessingStep(i);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    // Simulate video generation (in a real app, this would be an API call)
    setTimeout(() => {
      // For demo purposes, we'll create a placeholder video URL
      // In a real implementation, this would be the URL returned from your AI video generation API
      const mockVideoUrl =
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      setGeneratedVideo(mockVideoUrl);
      setIsProcessing(false);
    }, 1000);
  };

  const downloadVideo = () => {
    if (generatedVideo) {
      const link = document.createElement("a");
      link.href = generatedVideo;
      link.download = `generated-video-${Date.now()}.mp4`;
      link.click();
    }
  };

  const resetComponent = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setGeneratedVideo(null);
    setIsProcessing(false);
    setProcessingStep(0);
    setPrompt("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(#23b5b5 1px, transparent 1px),
              linear-gradient(90deg, #23b5b5 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#23b5b5] rounded-full animate-pulse opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-[#23b5b5]/20 rounded-xl">
              <Video className="text-[#23b5b5]" size={32} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-[#23b5b5] bg-clip-text text-transparent">
              Image to Video AI
            </h1>
            <div className="p-3 bg-[#23b5b5]/20 rounded-xl">
              <Sparkles className="text-[#23b5b5]" size={32} />
            </div>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Transform your static images into dynamic videos using advanced AI
            technology. Upload an image and watch it come to life with realistic
            motion and effects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-[#23b5b5]/30 p-6 shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Image className="text-[#23b5b5]" size={20} />
                Upload Image
              </h3>

              {!imagePreview ? (
                <div
                  className="border-2 border-dashed border-[#23b5b5]/30 rounded-xl p-12 text-center cursor-pointer hover:border-[#23b5b5] hover:bg-[#23b5b5]/5 transition-all duration-300 group"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload
                    className="mx-auto text-[#23b5b5] group-hover:text-white mb-4 transition-colors duration-300"
                    size={48}
                  />
                  <p className="text-white font-medium mb-2">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-gray-400 text-sm">
                    Supports JPG, PNG, WEBP (Max 10MB)
                  </p>
                </div>
              ) : (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Uploaded preview"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#23b5b5] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1a9999] transition-colors duration-300"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Settings */}
            {imagePreview && (
              <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-[#23b5b5]/30 p-6 shadow-2xl">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="text-[#23b5b5]" size={20} />
                  Generation Settings
                </h3>

                <div className="space-y-4">
                  {/* Motion Prompt */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Motion Description (Optional)
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the motion you want to see (e.g., 'gentle wind blowing through leaves', 'camera slowly zooming in')"
                      className="w-full p-3 bg-gray-900/50 border border-[#23b5b5]/20 rounded-xl text-white placeholder-gray-400 focus:border-[#23b5b5] focus:outline-none transition-colors duration-300 resize-none"
                      rows="3"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Duration (seconds)
                    </label>
                    <div className="flex gap-2">
                      {durationOptions.map((dur) => (
                        <button
                          key={dur}
                          onClick={() => setDuration(dur)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                            duration === dur
                              ? "bg-[#23b5b5] text-white"
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                          }`}
                        >
                          {dur}s
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {styleOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setStyle(option.value)}
                          className={`p-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                            style === option.value
                              ? "bg-[#23b5b5] text-white"
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                          }`}
                        >
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={generateVideo}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-[#23b5b5] to-[#1a9999] text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#23b5b5]/30 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader className="animate-spin" size={20} />
                        <span>{processingSteps[processingStep]}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Play size={20} />
                        <span>Generate Video</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {/* Video Preview */}
            <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-[#23b5b5]/30 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Video className="text-[#23b5b5]" size={20} />
                  Generated Video
                </h3>
                {(generatedVideo || imagePreview) && (
                  <button
                    onClick={resetComponent}
                    className="p-2 text-gray-400 hover:text-white hover:bg-[#23b5b5]/10 rounded-lg transition-all duration-300"
                    title="Reset"
                  >
                    <RefreshCw size={18} />
                  </button>
                )}
              </div>

              {!imagePreview ? (
                <div className="h-56 border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Video className="mx-auto text-gray-600 mb-2" size={48} />
                    <p className="text-gray-500">
                      Upload an image to generate video
                    </p>
                  </div>
                </div>
              ) : isProcessing ? (
                <div className="h-64 bg-gray-900 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative mb-4">
                      <Loader
                        className="animate-spin text-[#23b5b5] mx-auto"
                        size={48}
                      />
                      <div className="absolute inset-0 bg-[#23b5b5] rounded-full blur-xl opacity-20 animate-pulse" />
                    </div>
                    <p className="text-white font-medium mb-2">
                      {processingSteps[processingStep]}
                    </p>
                    <div className="w-64 bg-gray-700 rounded-full h-2 mx-auto">
                      <div
                        className="bg-gradient-to-r from-[#23b5b5] to-[#1a9999] h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            ((processingStep + 1) / processingSteps.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : generatedVideo ? (
                <div className="space-y-4">
                  <video
                    src={generatedVideo}
                    controls
                    className="w-full h-64 bg-gray-900 rounded-xl"
                    poster={imagePreview}
                  >
                    Your browser does not support the video tag.
                  </video>
                  <div className="flex gap-3">
                    <button
                      onClick={downloadVideo}
                      className="flex-1 bg-[#23b5b5] text-white py-3 rounded-xl font-medium hover:bg-[#1a9999] transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Download Video
                    </button>
                    <button
                      onClick={generateVideo}
                      className="px-6 bg-gray-800 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors duration-300 flex items-center gap-2"
                    >
                      <RefreshCw size={18} />
                      Regenerate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-64 bg-gray-900 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles
                      className="mx-auto text-gray-600 mb-2"
                      size={48}
                    />
                    <p className="text-gray-500">
                      Click generate to create your video
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageToVideo;
