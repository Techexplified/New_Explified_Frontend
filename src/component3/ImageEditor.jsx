import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { Pin, PinOff } from "lucide-react";

import WorkFlowButton from "../reusable_components/WorkFlowButton";

const AiEditor = () => {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const [selectedTool, setSelectedTool] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [sidebarPinned, setSidebarPinned] = useState(false);
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

  return (
    <>
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


      <div className="mt-20 flex items-center justify-center px-4">
        <div className="flex flex-col md:flex-row items-center gap-10 p-6 pt-12 bg-[#1a1a1a] rounded-2xl shadow-2xl">
          {/* Image Upload Box */}
          <div className="w-72 h-[460px] bg-[#111] rounded-xl flex items-center justify-center overflow-hidden">
            {image ? (
              <img
                src={image}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            ) : (
              <label className="cursor-pointer bg-[#23b5b5] hover:bg-cyan-700 transition px-5 py-3 rounded-lg text-white font-semibold shadow-md">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Tools Panel */}
          <div className="text-white space-y-6 w-52">
            <h2 className="text-2xl font-semibold">AI Editor</h2>

            <button className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] transition px-4 py-2 rounded-lg font-medium border border-cyan-400">
              Add Text
            </button>

            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span className="font-medium">Font</span>
                <span className="font-medium">Aa</span>
                <span className="font-medium">🎨</span>
              </div>
              <div className="h-px bg-gray-700" />
              <p className="text-xs text-gray-400">
                Customize your image with tools
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AiEditor;
