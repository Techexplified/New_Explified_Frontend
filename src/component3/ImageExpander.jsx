import React, { useState } from "react";
import {
  Upload,
  Download,
  MoveHorizontal,
  RefreshCw,
  Sparkles,

  Expand,
  Wand2,
  Layers,
  Layout,
  Type,
  Shuffle,
  
  
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Pin, PinOff } from "lucide-react";

const AiImageExpander = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedTool, setSelectedTool] = useState(null);
  
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarPinned, setSidebarPinned] = useState(false);
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

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size should be under 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target.result);
      setExpandedImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleExpandImage = async () => {};

  return (
    <div className="min-w-96 bg-[#111] p-4 rounded-2xl shadow-xl space-y-4 text-white max-w-xl mx-auto">
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


      <div className="flex items-center space-x-2 pt-12">
        <MoveHorizontal className="text-[#00ffd5]" />
        <h2 className="text-xl font-semibold">AI Image Expander (Uncrop)</h2>
      </div>

      <label className="block cursor-pointer">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            uploadedImage
              ? "border-[#23b5b5] bg-[#23b5b5]/10"
              : "border-gray-700 hover:border-gray-600"
          }`}
        >
          {uploadedImage ? (
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="max-w-sm mx-auto rounded-lg shadow"
            />
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg text-gray-300">
                Click to upload an image (JPG/PNG/WebP)
              </p>
              <p className="text-sm text-gray-500">Max size: 10MB</p>
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

      {uploadedImage && !expandedImage && (
        <button
          onClick={handleExpandImage}
          disabled={loading}
          className="w-full bg-[#00ffd5] text-black font-medium px-4 py-2 rounded-xl hover:bg-[#00e6c0] transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="animate-spin" />
              Expanding...
            </>
          ) : (
            <>
              <Sparkles />
              Expand Image
            </>
          )}
        </button>
      )}

      {expandedImage && (
        <div className="space-y-4">
          <img
            src={expandedImage}
            alt="Expanded"
            className="max-w-sm mx-auto rounded-lg shadow-lg"
          />
          <a
            href={expandedImage}
            download="expanded-image.png"
            className="w-full bg-white text-black text-center font-medium px-4 py-2 rounded-xl hover:bg-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Download />
            Download Expanded Image
          </a>
        </div>
      )}

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default AiImageExpander;