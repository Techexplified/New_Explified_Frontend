import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Link,
  Play,
  Download,
  Loader2,
  Sparkles,
  FileVideo,
  Camera,
  X,
  Settings,
  Zap,
  Clock,
  Palette,
} from "lucide-react";

const LinkToVideoGenerator = () => {
  const [mediaUrl, setMediaUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState([]);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [settings, setSettings] = useState({
    duration: "5",
    quality: "medium",
    style: "cinematic",
    fps: "24",
    aspectRatio: "16:9",
  });
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef(null);

  // Load saved videos from localStorage alternative (using state)
  useEffect(() => {
    // In a real app, you'd load from a database or API
    const savedVideos = [
      {
        id: 1,
        title: "Mountain Landscape Animation",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail: "https://i.imgur.com/placeholder1.jpg",
        duration: "8s",
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        prompt: "Animated mountain landscape with flowing clouds",
      },
      {
        id: 2,
        title: "Ocean Waves Motion",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnail: "https://i.imgur.com/placeholder2.jpg",
        duration: "12s",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        prompt: "Ocean waves with sunset reflection",
      },
    ];
    setGeneratedVideos(savedVideos);
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        setError("File size must be less than 100MB");
        return;
      }

      // Validate file type
      const validTypes = ["image/", "video/"];
      if (!validTypes.some((type) => file.type.startsWith(type))) {
        setError("Please upload an image or video file");
        return;
      }

      const url = URL.createObjectURL(file);
      setUploadedFile(file);
      setPreviewUrl(url);
      setMediaUrl(""); // Clear URL input
      setError("");
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (url) => {
    setMediaUrl(url);
    if (url && validateUrl(url)) {
      setPreviewUrl(url);
      setUploadedFile(null);
    } else {
      setPreviewUrl("");
    }
    setError("");
  };

  const clearMedia = () => {
    setMediaUrl("");
    setUploadedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Enhanced video generation with realistic API structure
  const generateVideo = async () => {
    setIsGenerating(true);
    setError("");
    setProgress(0);

    try {
      let mediaData = null;

      // Handle file upload to server
      if (uploadedFile) {
        const formData = new FormData();
        formData.append("file", uploadedFile);

        // Simulate file upload
        for (let i = 0; i <= 30; i += 5) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setProgress(i);
        }

        // In real implementation:
        // const uploadResponse = await fetch('/api/upload', {
        //   method: 'POST',
        //   body: formData
        // });
        // const uploadData = await uploadResponse.json();
        // mediaData = uploadData.fileUrl;

        mediaData = previewUrl; // Mock data
      } else if (mediaUrl) {
        mediaData = mediaUrl;
      }

      // Prepare generation request
      const requestData = {
        mediaUrl: mediaData,
        prompt: prompt,
        settings: settings,
        timestamp: Date.now(),
      };

      // Simulate API call to video generation service
      // In real implementation, this would be:
      // const response = await fetch('/api/generate-video', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(requestData)
      // });

      // Simulate processing stages
      const stages = [
        { name: "Uploading media...", duration: 1000 },
        { name: "Analyzing content...", duration: 1500 },
        { name: "Generating frames...", duration: 3000 },
        { name: "Processing motion...", duration: 2000 },
        { name: "Rendering video...", duration: 2500 },
        { name: "Finalizing...", duration: 1000 },
      ];

      let currentProgress = 30;
      for (const stage of stages) {
        const stageProgress = 70 / stages.length;
        for (let i = 0; i < stageProgress; i += 2) {
          await new Promise((resolve) =>
            setTimeout(resolve, stage.duration / (stageProgress / 2))
          );
          currentProgress += 2;
          setProgress(Math.min(currentProgress, 100));
        }
      }

      // Create new generated video
      const newVideo = {
        id: Date.now(),
        title: `Generated Video ${generatedVideos.length + 1}`,
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail: previewUrl || "https://via.placeholder.com/400x225",
        duration: `${settings.duration}s`,
        createdAt: new Date(),
        prompt: prompt,
        settings: { ...settings },
      };

      setGeneratedVideos((prev) => [newVideo, ...prev]);

      // Clear inputs
      setPrompt("");
      clearMedia();
    } catch (err) {
      console.error("Generation error:", err);
      setError("Failed to generate video. Please try again.");
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleGenerate = async () => {
    // Validation
    if (!mediaUrl && !uploadedFile && !prompt) {
      setError("Please provide either media (URL/file) or a text prompt");
      return;
    }

    if (mediaUrl && !validateUrl(mediaUrl)) {
      setError("Please provide a valid URL");
      return;
    }

    if (prompt && prompt.length < 10) {
      setError("Prompt should be at least 10 characters long");
      return;
    }

    await generateVideo();
  };

  const handleDownload = async (video) => {
    try {
      // In real implementation, you'd fetch from your server
      const response = await fetch(video.url);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${video.title.replace(/\s+/g, "_")}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      setError("Failed to download video");
    }
  };

  const deleteVideo = (videoId) => {
    setGeneratedVideos((prev) => prev.filter((v) => v.id !== videoId));
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-[#23b5b5] rounded-full shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              AI Link to Video Generator
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform images, videos, and text prompts into stunning
            AI-generated videos with advanced customization options
          </p>
        </div>

        <div className="">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Media Input Card */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#424242] shadow-xl">
              {/* URL Input */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    placeholder="Paste image/video URL here..."
                    value={mediaUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-black border border-[#424242] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#23b5b5] focus:border-transparent transition-all"
                  />
                  {mediaUrl && (
                    <button
                      onClick={() => setMediaUrl("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* File Upload */}

                {/* Media Preview */}
                {previewUrl && (
                  <div className="relative mt-4 p-4 bg-black rounded-lg border border-[#424242]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {uploadedFile?.type?.startsWith("image/") ||
                        previewUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <>
                            <Camera className="w-5 h-5 text-green-400" />
                            <div>
                              <p className="text-white font-medium">
                                Image loaded
                              </p>
                              <p className="text-gray-400 text-sm">
                                {uploadedFile
                                  ? `${(
                                      uploadedFile.size /
                                      1024 /
                                      1024
                                    ).toFixed(2)} MB`
                                  : "External URL"}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <FileVideo className="w-5 h-5 text-blue-400" />
                            <div>
                              <p className="text-white font-medium">
                                Video loaded
                              </p>
                              <p className="text-gray-400 text-sm">
                                {uploadedFile
                                  ? `${(
                                      uploadedFile.size /
                                      1024 /
                                      1024
                                    ).toFixed(2)} MB`
                                  : "External URL"}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      <button
                        onClick={clearMedia}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Prompt Input Card */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#424242] shadow-xl">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Palette className="w-6 h-6" />
                Generation Prompt
              </h2>

              <textarea
                placeholder="Describe how you want to transform the media or what video you want to create (e.g., 'Transform this landscape into a magical fantasy scene with flying creatures and glowing elements', 'Create a cinematic video of ocean waves at sunset')..."
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setError("");
                }}
                rows={6}
                className="w-full px-4 py-3 bg-black border border-[#424242] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#23b5b5] focus:border-transparent resize-none transition-all"
              />
              <div className="flex justify-between items-center mt-3">
                <div className="text-sm text-gray-400">
                  {prompt.length}/1000 characters
                </div>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 px-3 py-1 bg-black hover:bg-[#424242] border border-[#424242] rounded-lg text-gray-300 hover:text-white transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Advanced Settings
                </button>
              </div>

              {/* Advanced Settings */}
              {showSettings && (
                <div className="mt-6 p-4 bg-black rounded-lg border border-[#424242] space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Duration
                      </label>
                      <select
                        value={settings.duration}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            duration: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-black border border-[#424242] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#23b5b5]"
                      >
                        <option value="3">3 seconds</option>
                        <option value="5">5 seconds</option>
                        <option value="8">8 seconds</option>
                        <option value="10">10 seconds</option>
                        <option value="15">15 seconds</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Aspect Ratio
                      </label>
                      <select
                        value={settings.aspectRatio}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            aspectRatio: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-black border border-[#424242] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#23b5b5]"
                      >
                        <option value="16:9">16:9 (Landscape)</option>
                        <option value="9:16">9:16 (Portrait)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full mt-6 py-4 px-6 bg-[#23b5b5] hover:bg-[#1a8a8a] disabled:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating... {progress}%
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate Video
                  </>
                )}
              </button>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="mt-4">
                  <div className="bg-black rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-[#23b5b5] h-3 rounded-full transition-all duration-500 relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-center text-gray-300 text-sm mt-2">
                    This may take a few minutes depending on settings
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                  <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-200 font-medium">Generation Error</p>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Generated Videos Section */}
          {/* <div className="space-y-6">
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#424242] shadow-xl">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Play className="w-6 h-6" />
                Generated Videos ({generatedVideos.length})
              </h2>

              {generatedVideos.length === 0 ? (
                <div className="text-center py-12">
                  <FileVideo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">No videos generated yet</p>
                  <p className="text-gray-500 text-sm">
                    Your generated videos will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {generatedVideos.map((video) => (
                    <div
                      key={video.id}
                      className="bg-black rounded-lg p-4 border border-[#424242] hover:bg-[#1A1A1A] transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-20 h-12 bg-gray-800 rounded overflow-hidden">
                            <div className="w-full h-full bg-[#23b5b5] opacity-20"></div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate">
                            {video.title}
                          </h3>
                          <p className="text-gray-400 text-sm truncate">
                            {video.prompt}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {video.duration}
                            </span>
                            <span>{video.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDownload(video)}
                            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-all"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteVideo(video.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                            title="Delete"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <video
                        controls
                        className="w-full h-32 bg-black rounded mt-3 object-cover"
                        poster={video.thumbnail}
                      >
                        <source src={video.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
                </div>
              )}
            </div>

           
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#424242] shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Videos</span>
                  <span className="text-white font-medium">
                    {generatedVideos.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Storage Used</span>
                  <span className="text-white font-medium">
                    {(generatedVideos.length * 12.5).toFixed(1)} MB
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Generation Time</span>
                  <span className="text-white font-medium">~2-5 min</span>
                </div>
              </div>
            </div>
          </div> */}

          {/* Dummy prompts */}
        </div>
      </div>
    </div>
  );
};

export default LinkToVideoGenerator;

// tavus api
