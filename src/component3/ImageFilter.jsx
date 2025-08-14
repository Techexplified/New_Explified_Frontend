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
import WorkFlowButton from "../reusable_components/WorkFlowButton";
import SidebarOnHover from "../reusable_components/SidebarOnHover";

const AiImageTool = () => {
  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedTool, setSelectedTool] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [sampleImage, setSampleImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [statusInfo, setStatusInfo] = useState({
    queuePosition: null,
    waitTime: null,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const HORDE_API_BASE = "https://aihorde.net/api/v2";
  const HORDE_API_KEY = "eUPKgSeCeNGuSKqdzi3V5w";

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
      name: "AI Background Generator",
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
      name: "AI Image Mage",
      icon: Shuffle,
      link: "/image-styler/merger",
    },
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
    if (!uploadedImage) {
      setErrorMsg("Please upload an image first.");
      return;
    }
    setErrorMsg(null);
    setResultImage(null);
    submitImg2Img({ prompt: aiPrompt, dataUrl: uploadedImage })
      .then((id) => {
        setJobId(id);
        setIsGenerating(true);
        return pollGeneration(id, (s) => setStatusInfo(s));
      })
      .then((imgUrl) => {
        setResultImage(imgUrl);
      })
      .catch((e) => setErrorMsg(e.message || "Generation failed"))
      .finally(() => setIsGenerating(false));
  };

  const handleCloneGenerate = () => {
    if (!sampleImage) {
      setErrorMsg("Please upload a sample image.");
      return;
    }
    setErrorMsg(null);
    setResultImage(null);
    submitImg2Img({ prompt: aiPrompt, dataUrl: sampleImage })
      .then((id) => {
        setJobId(id);
        setIsGenerating(true);
        return pollGeneration(id, (s) => setStatusInfo(s));
      })
      .then((imgUrl) => {
        setResultImage(imgUrl);
      })
      .catch((e) => setErrorMsg(e.message || "Generation failed"))
      .finally(() => setIsGenerating(false));
  };

  const submitImg2Img = async ({
    prompt,
    dataUrl,
    width = 512,
    height = 512,
  }) => {
    const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
    const body = {
      prompt,
      params: {
        sampler_name: "k_euler",
        steps: 28,
        cfg_scale: 7,
        width,
        height,
        denoising_strength: 0.6,
      },
      source_image: base64,
      source_processing: "img2img",
      nsfw: false,
      censor_nsfw: true,
    };
    const res = await fetch(`${HORDE_API_BASE}/generate/async`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: HORDE_API_KEY,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Submit failed: ${res.status}`);
    }
    const data = await res.json();
    if (!data?.id) throw new Error("Invalid response from server");
    return data.id;
  };

  const pollGeneration = async (id, onStatus) => {
    const start = Date.now();
    const maxWaitMs = 180000;
    while (Date.now() - start < maxWaitMs) {
      const res = await fetch(`${HORDE_API_BASE}/generate/status/${id}`);
      if (!res.ok) throw new Error(`Status failed: ${res.status}`);
      const data = await res.json();
      const queuePosition = data?.queue_position ?? null;
      const waitTime = data?.wait_time ?? null;
      if (onStatus) onStatus({ queuePosition, waitTime });
      if (data?.generations?.length) {
        const imgField = data.generations[0].img;
        if (typeof imgField === "string") {
          const trimmed = imgField.trim();
          if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
            return trimmed; // direct URL from Horde (R2)
          }
          if (trimmed.startsWith("data:")) {
            return trimmed; // already a data URL
          }
          // Assume base64 payload; Horde commonly returns webp
          return `data:image/webp;base64,${trimmed}`;
        }
        throw new Error("Invalid image payload from server");
      }
      await new Promise((r) => setTimeout(r, 3000));
    }
    throw new Error("Timed out waiting for generation");
  };

  return (
    <>
      <SidebarOnHover
        link={"https://explified.com/ai-image-styler/"}
        toolName={"AI Image Styler"}
      />

      <div className="min-h-screen relative flex bg-minimal-background text-minimal-heading font-poppins">
        <WorkFlowButton id={"styler"} />

        {/* Sidebar */}
        <div className="w-80 sticky top-0 h-screen overflow-y-auto border-r border-minimal-border bg-minimal-surface/70 backdrop-blur supports-[backdrop-filter]:bg-minimal-surface/80 p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="p-8 mx-6 my-6 text-center border rounded-2xl border-minimal-border bg-minimal-card shadow-md">
            <h1 className="text-3xl font-bold text-minimal-heading mb-2">
              Ready to see your photo transformed?
            </h1>
            <p className="text-xl text-minimal-paragraph mb-8">
              Upload your image and watch the magic happen!
            </p>

            {/* Upload */}
            <div className="max-w-md mx-auto">
              <label className="flex items-center justify-center w-full h-14 rounded-xl cursor-pointer transition-all border-2 border-dashed border-minimal-border hover:border-minimal-primary bg-minimal-surface text-minimal-paragraph">
                <Upload className="w-5 h-5 mr-2 text-minimal-primary" />
                <span className="font-medium">Upload Image</span>
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
                  className="w-full object-cover rounded-xl border border-minimal-border"
                />
              </div>
            )}
            {errorMsg && (
              <div className="mt-6 max-w-md mx-auto text-sm text-red-400">
                {errorMsg}
              </div>
            )}
            {isGenerating && (
              <div className="mt-6 max-w-md mx-auto text-sm text-minimal-paragraph">
                {statusInfo.queuePosition !== null && (
                  <div>Queue position: {statusInfo.queuePosition}</div>
                )}
                {statusInfo.waitTime !== null && (
                  <div>ETA: ~{statusInfo.waitTime}s</div>
                )}
              </div>
            )}
          </div>

          {/* Prompt & Clone Section */}
          <div className="flex-1 px-6 pb-10 space-y-6">
            <div className="max-w-2xl mx-auto">
              <div className="bg-minimal-card rounded-xl p-6 border border-minimal-border shadow-sm">
                <div className="flex items-center mb-4">
                  <Sparkles className="w-5 h-5 text-minimal-primary mr-2" />
                  <h3 className="text-lg font-semibold">AI Prompt</h3>
                </div>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Tell us how you want to transform your photo—be as creative or specific as you like!"
                  className="w-full h-28 bg-minimal-surface border border-minimal-border rounded-xl p-4 text-minimal-heading placeholder-minimal-muted resize-none focus:outline-none focus:ring-2 focus:ring-minimal-primary"
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`px-6 py-2 bg-minimal-primary text-black rounded-lg font-semibold transition-all hover:brightness-110 ${
                      isGenerating ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {isGenerating ? "Generating..." : "Generate"}
                  </button>
                </div>
              </div>
            </div>

            {/* Clone */}
            {/* <div className="max-w-2xl mx-auto">
            <div className="bg-minimal-card rounded-xl p-6 border border-minimal-border shadow-sm">
              <div className="flex items-center mb-4">
                <Copy className="w-5 h-5 text-minimal-primary mr-2" />
                <h3 className="text-lg font-semibold">AI Image Clone</h3>
              </div>
              <p className="text-minimal-paragraph mb-4">
                Upload a sample screenshot to set your desired style, and then
                choose media from your device to generate your AI image clone
              </p>
              <div className="flex items-center justify-between">
                <label className="flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer transition-all border border-minimal-border hover:border-minimal-primary bg-minimal-surface text-minimal-paragraph">
                  <Camera className="w-4 h-4 mr-2 text-minimal-primary" />
                  <span className="text-sm font-medium">Upload Sample</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => setSampleImage(ev.target?.result);
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
                <button
                  onClick={handleCloneGenerate}
                  disabled={isGenerating}
                  className={`px-6 py-2 bg-minimal-primary text-black rounded-lg font-semibold transition-all hover:brightness-110 ${
                    isGenerating ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {isGenerating ? "Generating..." : "Generate"}
                </button>
              </div>
            </div>
          </div> */}

            {/* Quick Actions & Styles */}
            {resultImage && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-minimal-card rounded-xl p-6 border border-minimal-border shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Result</h3>
                  <img
                    src={resultImage}
                    alt="Result"
                    className="w-full rounded-xl border border-minimal-border"
                  />
                  <div className="flex justify-end mt-4">
                    <a
                      href={resultImage}
                      download="aihorde_result.png"
                      className="px-4 py-2 bg-minimal-primary text-black rounded-lg font-semibold"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AiImageTool;
