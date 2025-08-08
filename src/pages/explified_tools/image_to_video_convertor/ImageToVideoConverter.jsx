import React, { useState, useRef } from "react";
import {
  Upload,
  Play,
  Download,
  Zap,
  Settings,
  X,
  Image,
  Video,
} from "lucide-react";

export default function ImageToVideoConverter() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedVideo, setProcessedVideo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [settings, setSettings] = useState({
    duration: 3,
    fps: 24,
    style: "smooth",
    quality: "high",
  });
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage({
          url: e.target.result,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2),
        });
        setProcessedVideo(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessVideo = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    setProgress(0);

    // Simulate processing with progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setProcessedVideo({
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            name: uploadedImage.name.replace(/\.[^/.]+$/, "") + "_video.mp4",
          });
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setProcessedVideo(null);
    setProgress(0);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl">
              <Zap className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-teal-300 bg-clip-text text-transparent">
              AI Image to Video
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Transform your static images into dynamic videos with AI magic
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden">
          {/* Settings Bar */}
          <div className="border-b border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
                  <Settings className="w-4 h-4 text-teal-400" />
                  <span className="text-gray-300">Settings</span>
                </button>
                {uploadedImage && (
                  <button
                    onClick={resetUpload}
                    className="flex items-center gap-2 px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-xl transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Expandable Settings Panel */}

            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Duration (seconds)
                  </label>
                  <select
                    value={settings.duration}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        duration: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-teal-500"
                  >
                    <option value={2}>2s</option>
                    <option value={3}>3s</option>
                    <option value={5}>5s</option>
                    <option value={10}>10s</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Frame Rate
                  </label>
                  <select
                    value={settings.fps}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        fps: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-teal-500"
                  >
                    <option value={24}>24 FPS</option>
                    <option value={30}>30 FPS</option>
                    <option value={60}>60 FPS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Animation Style
                  </label>
                  <select
                    value={settings.style}
                    onChange={(e) =>
                      setSettings({ ...settings, style: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-teal-500"
                  >
                    <option value="smooth">Smooth</option>
                    <option value="dynamic">Dynamic</option>
                    <option value="cinematic">Cinematic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Quality
                  </label>
                  <select
                    value={settings.quality}
                    onChange={(e) =>
                      setSettings({ ...settings, quality: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-teal-500"
                  >
                    <option value="standard">Standard</option>
                    <option value="high">High</option>
                    <option value="ultra">Ultra</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Image className="w-6 h-6 text-teal-400" />
                  <h2 className="text-xl font-semibold text-white">
                    Source Image
                  </h2>
                </div>

                {!uploadedImage ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-700 hover:border-teal-500 rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 hover:bg-gray-800/50"
                  >
                    <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Upload Your Image
                    </h3>
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-2xl overflow-hidden">
                    <img
                      src={uploadedImage.url}
                      alt="Uploaded"
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <p className="text-white font-medium">
                        {uploadedImage.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {uploadedImage.size} MB
                      </p>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                {uploadedImage && !isProcessing && !processedVideo && (
                  <button
                    onClick={handleProcessVideo}
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-teal-500/25"
                  >
                    <Zap className="w-5 h-5" />
                    Generate Video
                  </button>
                )}
              </div>

              {/* Result Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Video className="w-6 h-6 text-teal-400" />
                  <h2 className="text-xl font-semibold text-white">
                    Generated Video
                  </h2>
                </div>

                {!uploadedImage && !isProcessing && !processedVideo && (
                  <div className="bg-gray-800 rounded-2xl p-12 text-center">
                    <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Your generated video will appear here
                    </p>
                  </div>
                )}

                {isProcessing && (
                  <div className="bg-gray-800 rounded-2xl p-8">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500/20 rounded-full mb-4">
                        <Zap className="w-8 h-8 text-teal-400 animate-pulse" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Processing Your Video
                      </h3>
                      <p className="text-gray-400">
                        AI is working its magic...
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-teal-400">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-teal-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {processedVideo && (
                  <div className="bg-gray-800 rounded-2xl overflow-hidden">
                    <div className="bg-black h-64 flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-16 h-16 text-teal-400 mx-auto mb-4" />
                        <p className="text-white">Video Preview</p>
                        <p className="text-gray-400 text-sm">
                          {processedVideo.name}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 flex gap-3">
                      <button className="flex-1 bg-teal-500 hover:bg-teal-600 text-black font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        Play
                      </button>
                      <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
