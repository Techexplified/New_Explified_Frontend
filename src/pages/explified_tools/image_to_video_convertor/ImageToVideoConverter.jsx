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
import axiosInstance from "../../../network/axiosInstance";
import axios from "axios";
import WorkFlowButton from "../../../reusable_components/WorkFlowButton";
import { Link } from "react-router-dom";
import SidebarOnHover from "../../../reusable_components/SidebarOnHover";

export default function ImageToVideoConverter() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [uuid, setUuid] = useState("b7b0fc5a-e22f-46d3-b1e3-2fa4e61aabd5");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedVideo, setProcessedVideo] = useState(null);
  const [url, setUrl] = useState(null);
  const [progress, setProgress] = useState(0);

  const [settings, setSettings] = useState({
    duration: 3,
    fps: 24,
    style: "smooth",
    quality: "high",
  });
  const fileInputRef = useRef(null);

  // const handleImageUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const base64String = e.target.result;
  //     setUploadedImage({
  //       url: e.target.result,
  //       name: file.name,
  //       size: (file.size / 1024 / 1024).toFixed(2),
  //     });
  //     setProcessedVideo(null);
  //   };
  //   reader.readAsDataURL(file);
  // };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      // This sets only the base64 string in a separate state
      setImageBase64(reader.result);

      // Keep your original uploadedImage state as is
      setUploadedImage({
        url: URL.createObjectURL(file),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2),
      });
    };

    reader.readAsDataURL(file);
  };
  // const handleProcessVideo = async () => {
  //   if (!uploadedImage) return;

  //   setIsProcessing(true);
  //   setProgress(0);

  //   // Simulate processing with progress updates
  //   const interval = setInterval(() => {
  //     setProgress((prev) => {
  //       if (prev >= 100) {
  //         clearInterval(interval);
  //         setIsProcessing(false);
  //         setProcessedVideo({
  //           url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
  //           name: uploadedImage.name.replace(/\.[^/.]+$/, "") + "_video.mp4",
  //         });
  //         return 100;
  //       }
  //       return prev + Math.random() * 15;
  //     });
  //   }, 200);
  // };
  const handleProcessVideo = async () => {
    if (!imageBase64) return;

    try {
      setIsProcessing(true);
      setProgress(0);

      const res = await axiosInstance.post(
        "api/imageToVideo",
        { image: imageBase64 },
        {
          withCredentials: true,
        }
      );

      console.log(res?.data);
      setUuid(res?.data?.uuid);
    } catch (error) {
      console.log(error);
    }
  };

  const getVideo = async () => {
    try {
      setIsProcessing(true);
      setProgress(0);

      const options = {
        method: "GET",
        url: "https://runwayml.p.rapidapi.com/status",
        params: {
          uuid: "2858de6f-364c-481e-988a-b930af469aa9",
        },
        headers: {
          "x-rapidapi-key":
            "5c43358bb7msh620384fe8a16560p1a0fd1jsn853ee75f7459",
          "x-rapidapi-host": "runwayml.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      console.log(response?.data);

      setUrl(response?.data?.url);
    } catch (error) {
      console.log(error);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-minimal-background via-minimal-dark-100 to-minimal-dark-200 p-6 flex items-center justify-center">
      <SidebarOnHover
        link={"https://explified.com/image-to-video-ai/"}
        toolName={"Image To Video AI"}
      />

      <WorkFlowButton id={"imgtovid"} />

      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl">
              <Zap className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-teal-300 bg-clip-text text-transparent">
              Image to Video AI
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Transform your static images into dynamic videos with AI magic
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-black rounded-3xl border border-gray-800 overflow-hidden">
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
              {/* Result Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Video className="w-6 h-6 text-teal-400" />
                  <h2 className="text-xl font-semibold text-white">
                    Generated Video
                  </h2>
                </div>

                {/* Unified content box */}

                {!uploadedImage && !isProcessing && !processedVideo && !url && (
                  <div className="bg-gray-800 rounded-2xl p-12 text-center">
                    <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Your generated video will appear here
                    </p>
                  </div>
                )}

                {isProcessing && !url && (
                  <div className="bg-gray-800 rounded-2xl p-12 text-center">
                    <Zap className="w-16 h-16 text-teal-400 animate-pulse mx-auto mb-4" />
                    <p className="text-gray-400">Processing...</p>
                  </div>
                )}

                {url && (
                  <div className="bg-gray-800 rounded-2xl text-center">
                    <video
                      src={url}
                      controls
                      className="w-full rounded-xl shadow-lg border border-gray-700"
                    />
                  </div>
                )}

                {/* Step 2: Show "Get Video" after UUID is received */}
                {uuid && !url && !isProcessing && (
                  <button
                    onClick={getVideo}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-black font-semibold py-4 px-6 rounded-xl transition-all duration-300"
                  >
                    Get Video
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
