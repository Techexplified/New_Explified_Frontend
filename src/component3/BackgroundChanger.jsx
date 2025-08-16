import React, { useState } from "react";
import {
  ArrowLeft,
  Upload,
  Wand2,
  Sparkles,
  Download,
  RefreshCw,
  Expand,
  Layers,
  Layout,
  Type,
  Shuffle,
  Copy,
  Camera,
} from "lucide-react";
import { Pin, PinOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AiImageStyler = () => {
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [styledImage, setStyledImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  

  const styles = [
    {
      id: "Background1",
      name: "Background1",
      description: "Background",
      gradient: "from-[#23b5b5] to-[#23b5b5]",
    },
    {
      id: "Background2",
      name: "Background2",
      description: "Background",
      gradient: "from-[#23b5b5] to-[#23b5b5]",
    },
    {
      id: "Background3",
      name: "Background3",
      description: "Background",
      gradient: "from-[#23b5b5] to-[#23b5b5]",
    },
    {
      id: "Background4",
      name: "Background4",
      description: "Background",
      gradient: "from-[#23b5b5] to-[#23b5b5]",
    },
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size should be less than 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      setStyledImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyStyle = () => {
    if (!uploadedImage || !selectedStyle) return;
    setIsProcessing(true);
    setTimeout(() => {
      setStyledImage(uploadedImage);
      setIsProcessing(false);
    }, 3000);
  };

  const handleDownload = () => {
    if (styledImage) {
      const link = document.createElement("a");
      link.download = `styled-image-${selectedStyle || "output"}.png`;
      link.href = styledImage;
      link.click();
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setStyledImage(null);
    setSelectedStyle(null);
    setIsProcessing(false);
    setError(null);
  };
  const [selectedTool, setSelectedTool] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const tools = [
    {
      id: "expand",
      name: "AI Image Expand",
      icon: Expand,
      link: "/image-styler/expander",
    },
    {
      id: "styler",
      name: "AI Image Styler",
      icon: Wand2,
      link: "/image-styler/filter",
    },
    {
      id: "background",
      name: "AI BG Generator",
      icon: Layers,
      link: "/image-styler/backChanger",
    },
    {
      id: "template",
      name: "AI Template",
      icon: Layout,
      link: "/image-styler/filter",
    },
    {
      id: "editor",
      name: "AI Editor",
      icon: Type,
      link: "/image-styler/editor",
    },
    {
      id: "mage",
      name: "AI Image Merge",
      icon: Shuffle,
      link: "/image-styler/merger",
    },
  ];

  const [sidebarPinned, setSidebarPinned] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Left-edge activator to open when collapsed (below navbar) */}
      <div
        className="fixed left-0 h-[calc(100vh-0px)] w-10 z-50"
        onMouseEnter={() => setSidebarOpen(true)}
      />

      {/* Sidebar (appears below navbar) */}
      <div
        className={`fixed left-0 h-[calc(100vh-0px)] bg-black/95 backdrop-blur-xl border-r border-[#23b5b5]/20 
				flex flex-col justify-between transition-all duration-300 z-40
				${sidebarOpen ? "w-72 px-6" : "w-0 px-0 overflow-hidden"}`}
        onMouseEnter={() => !sidebarPinned && setSidebarOpen(true)}
            onMouseLeave={() => !sidebarPinned && setSidebarOpen(false)}
      >
        {/* Top section */}
        <div className="mt-8">
          {/* <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white to-[#23b5b5] bg-clip-text text-transparent">
              AI Image Styler
            </h2>
            <button
              onClick={() => {
                setSidebarPinned(!sidebarPinned);
                setSidebarOpen(true);
              }}
            >
              {sidebarPinned ? <PinOff size={20} /> : <Pin size={20} />}
            </button>
          </div> */}
          <div className="grid pt-6 grid-cols-1 gap-4">
            <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white to-[#23b5b5] bg-clip-text text-transparent">
              AI Image Styler
            </h2>
            <button
              onClick={() => {
                setSidebarPinned(!sidebarPinned);
                setSidebarOpen(true);
              }}
            >
              {sidebarPinned ? <PinOff size={20} /> : <Pin size={20} />}
            </button>
          </div>
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  setSelectedTool(tool.id);
                  navigate(tool.link);
                }}
                className={`w-full p-5 rounded-xl bg-minimal-card hover:bg-minimal-cardHover border border-minimal-border/60 shadow-sm transition-all duration-200 flex items-center space-x-4 ${
                  selectedTool === tool.id ? "ring-2 ring-minimal-primary" : ""
                }`}
              >
                <tool.icon className="w-7 h-7 text-minimal-primary" />
                <span className="text-base font-medium text-minimal-paragraph">
                  {tool.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="mb-8">
          <button
            onClick={() =>
              window.location.assign("https://explified.com/ai-image-styler/ ")
            }
            className="w-full bg-gradient-to-r from-[#23b5b5] to-[#1a9999] hover:from-[#1a9999] hover:to-[#23b5b5] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#23b5b5]/25"
          >
            Learn More
          </button>
        </div>
      </div>

      
      {/* Header */}
      <div className="p-6 pt-12 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#23b5b5] rounded-full flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#23b5b5] to-[#23b5b5] bg-clip-text text-transparent">
                AI Background Generator
              </h1>
              <p className="text-sm text-gray-400">
                Transform your images with AI magic
              </p>
            </div>
          </div>
          {/* <button onClick={handleReset} className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </button> */}
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="md:col-span-4 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Choose Your Background
            </h2>
            <div className="space-y-4">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`relative w-full p-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    selectedStyle === style.id
                      ? "bg-gradient-to-r " +
                        style.gradient +
                        " shadow-2xl ring-4 ring-white/20"
                      : "border border-gray-700"
                  }`}
                >
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-1">{style.name}</h3>
                    <p className="text-sm text-gray-400">{style.description}</p>
                  </div>
                  {selectedStyle === style.id && (
                    <div className="absolute top-2 right-2">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <button
                onClick={handleApplyStyle}
                disabled={!uploadedImage || !selectedStyle || isProcessing}
                className={`w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                  uploadedImage && selectedStyle && !isProcessing
                    ? "bg-[#23b5b5] hover:bg-[#1ba3a3] text-white shadow-lg hover:shadow-xl hover:scale-105"
                    : "border border-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Wand2 className="w-5 h-5" />
                    <span>Apply Background</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="md:col-span-8 grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Upload Your Image
              </h2>
              <div className="relative">
                <label className="block">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                      uploadedImage
                        ? "border-[#23b5b5] bg-[#23b5b5]/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {uploadedImage ? (
                      <div className="space-y-4">
                        <img
                          src={uploadedImage}
                          alt="Uploaded"
                          className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                        />
                        <div className="text-[#23b5b5] font-medium">
                          ✓ Image uploaded successfully
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-300">
                            Drop your image here or click to browse
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            Supports JPG, PNG, WebP up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Preview</h2>
              <div className="rounded-xl p-8 border border-gray-800">
                {styledImage ? (
                  <div className="space-y-4">
                    <img
                      src={styledImage}
                      alt="Styled result"
                      className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                      style={{
                        filter:
                          selectedStyle === "cartoon"
                            ? "contrast(1.2) saturate(1.5)"
                            : selectedStyle === "ghibli"
                            ? "sepia(0.3) saturate(1.2)"
                            : selectedStyle === "sketch"
                            ? "grayscale(0.8) contrast(1.3)"
                            : selectedStyle === "anime"
                            ? "contrast(1.1) saturate(1.3)"
                            : "none",
                      }}
                    />
                    <div className="flex space-x-3 justify-center">
                      <button
                        onClick={handleDownload}
                        className="flex items-center space-x-2 px-4 py-2 bg-[#23b5b5] hover:bg-[#1ba3a3] rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ) : isProcessing ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-[#23b5b5] rounded-full flex items-center justify-center mx-auto animate-spin">
                      <Wand2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-[#23b5b5]">
                        Applying{" "}
                        {styles.find((s) => s.id === selectedStyle)?.name}{" "}
                        style...
                      </p>
                      <p className="text-sm text-gray-400">
                        This may take a few moments
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 text-gray-400">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-lg">
                        Your styled image will appear here
                      </p>
                      <p className="text-sm">
                        Upload an image and select a background to get started
                      </p>
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
};

export default AiImageStyler;
