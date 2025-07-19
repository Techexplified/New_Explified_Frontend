import React, { useState } from "react";
import {
  Expand,
  Wand2,
  Layers,
  Layout,
  Type,
  Shuffle,
  Upload,
  Sparkles,
  Copy,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AiImageTool = () => {
  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedTool, setSelectedTool] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const navigate = useNavigate();

  const tools = [
    { id: "expand", name: "AI Image Expand", icon: Expand ,link:"/image-styler/expander"},
    { id: "styler", name: "AI Image Styler", icon: Wand2 ,link:"/image-styler/filter"},
    { id: "background", name: "AI Background Generator", icon: Layers ,link:"/image-styler/backChanger"},
    { id: "template", name: "AI Template", icon: Layout ,link:"/image-styler/filter"},
    { id: "editor", name: "AI Editor", icon: Type ,link:"/image-styler/editor"},
    { id: "mage", name: "AI Image Mage", icon: Shuffle ,link:"/image-styler/merger"},
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    console.log("Generating with prompt:", aiPrompt);
  };

  const handleCloneGenerate = () => {
    console.log("Generating clone...");
  };

  return (
    <div className=" bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-[#111] p-6 space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {setSelectedTool(tool.id)
                navigate(tool.link)
              }}
              className={`w-full p-5 rounded-xl bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-all duration-200 flex items-center space-x-4 ${
                selectedTool === tool.id ? "ring-2 ring-[#23b5b5]" : ""
              }`}
            >
              <tool.icon className="w-7 h-7 text-[#23b5b5]" />
              <span className="text-base font-medium text-gray-200">
                {tool.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="p-8 mx-4 text-center border rounded-2xl border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-2">
            Ready to see your photo transformed?
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Upload your image and watch the magic happen!
          </p>

          {/* Upload */}
          <div className="max-w-md mx-auto">
            <label className="flex items-center justify-center w-full h-12 bg-[#333] hover:bg-[#444] rounded-lg cursor-pointer transition-colors">
              <Upload className="w-5 h-5 mr-2" />
              <span>Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {uploadedImage && (
            <div className="mt-6 max-w-md mx-auto">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-full object-cover rounded-lg border-2 border-gray-600"
              />
            </div>
          )}
        </div>

        {/* Prompt & Clone Section */}
        <div className="flex-1 p-8 space-y-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <Sparkles className="w-5 h-5 text-[#23b5b5] mr-2" />
                <h3 className="text-lg font-semibold">AI Prompt</h3>
              </div>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Tell us how you want to transform your photo—be as creative or specific as you like!"
                className="w-full h-24 bg-[#111] border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#23b5b5]"
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleGenerate}
                  className="px-6 py-2 bg-[#23b5b5] hover:bg-[#1ba0a0] rounded-lg font-semibold transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>

          {/* Clone */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <Copy className="w-5 h-5 text-[#23b5b5] mr-2" />
                <h3 className="text-lg font-semibold">AI Image Clone</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Upload a sample screenshot to set your desired style, and then
                choose media from your device to generate your AI image clone
              </p>
              <div className="flex items-center justify-between">
                <label className="flex items-center justify-center px-4 py-2 bg-[#333] hover:bg-[#444] rounded-lg cursor-pointer transition-colors">
                  <Camera className="w-4 h-4 mr-2" />
                  <span className="text-sm">Upload Sample</span>
                  <input type="file" accept="image/*" className="hidden" />
                </label>
                <button
                  onClick={handleCloneGenerate}
                  className="px-6 py-2 bg-[#23b5b5] hover:bg-[#1ba0a0] rounded-lg font-semibold transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions & Styles */}
        </div>
      </div>
    </div>
  );
};

export default AiImageTool;
