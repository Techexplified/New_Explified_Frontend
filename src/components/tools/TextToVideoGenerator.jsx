import {
  Film,
  Sparkles,
  Wand2,
  Timer,
  Zap,
  Languages,
  MicVocal,
  ChevronRight,
  Download,
  Stars,
  Play,
  Clock,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import WorkFlowButton from "../../reusable_components/WorkFlowButton";
import { InferenceClient } from "@huggingface/inference";
import { useNavigate } from "react-router-dom";
import SidebarOnHover from "../../reusable_components/SidebarOnHover";

const TextToVideoGenerator = () => {
  const [prompt, setPrompt] = useState("");
  // const [duration, setDuration] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [duration, setDuration] = useState(5);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const durationDropdownRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const videoRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("explified");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setIsLoggedIn(userData.isLoggedIn === "true");
      } catch (error) {
        console.error("Error parsing user data:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        durationDropdownRef.current &&
        !durationDropdownRef.current.contains(event.target)
      ) {
        setShowDurationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const defaultPrompts = [
    "A serene lake at sunset with gentle ripples reflecting golden light",
    "Futuristic cityscape with neon lights and flying cars at night",
    "A magical forest with glowing fireflies dancing around ancient trees",
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setShowResult(false);
    setErrorMsg("");

    try {
      const hfToken = import.meta.env.VITE_TEXT_TO_VIDEO;
      if (!hfToken) {
        throw new Error(
          "Missing Hugging Face token. Please set VITE_HF_TOKEN in your .env file."
        );
      }

      const client = new InferenceClient(hfToken);

      const response = await client.textToVideo({
        provider: "fal-ai",
        model: "zai-org/CogVideoX-5b",
        inputs: prompt,
      });

      let videoUrl = null;
      if (response instanceof Blob) {
        videoUrl = URL.createObjectURL(response);
      } else if (typeof response === "string") {
        videoUrl = response;
      } else if (response?.video instanceof Blob) {
        videoUrl = URL.createObjectURL(response.video);
      } else if (response?.url) {
        videoUrl = response.url;
      } else if (Array.isArray(response) && response[0]?.url) {
        videoUrl = response[0].url;
      }

      if (!videoUrl) {
        throw new Error("Failed to retrieve video URL from the API response.");
      }

      setGeneratedVideo({
        prompt,
        duration,
        url: videoUrl,
        thumbnail: "",
      });
      setShowResult(true);
    } catch (error) {
      console.error("Text-to-video error:", error);
      setErrorMsg(error?.message || "Failed to generate video.");
    } finally {
      setIsGenerating(false);
    }
  };

  const usePrompt = (selectedPrompt) => {
    setPrompt(selectedPrompt);
  };

  const durationOptions = [
    { value: 5, label: "5 seconds", icon: Clock },
    { value: 8, label: "8 seconds", icon: Clock },
    { value: 10, label: "10 seconds", icon: Clock },
  ];

  const handleDownload = async () => {
    try {
      if (!generatedVideo?.url) return;
      const url = generatedVideo.url;

      // If it's already a blob url, we can download directly
      if (url.startsWith("blob:")) {
        const a = document.createElement("a");
        a.href = url;
        a.download = `video-${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }

      // Otherwise fetch and convert to blob for reliable downloading
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      setErrorMsg("Failed to download video.");
    }
  };

  return (
    <>
      <SidebarOnHover
        link={"https://explified.com/text-to-video-ai/"}
        toolName={"AI Video Generator"}
      />

      <div className="min-h-screen relative bg-black text-gray-100 overflow-hidden">
        <WorkFlowButton id={"vidgen"} />
        {/* Background effects */}
        <div className="fixed inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#23b5b5]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#23b5b5]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-[#23b5b5]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Film className="w-12 h-12 text-[#23b5b5]" />
                <div className="absolute -inset-1 bg-[#23b5b5]/30 blur-lg rounded-full"></div>
              </div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-white to-[#23b5b5] bg-clip-text text-transparent mb-4">
              AI Video Generator
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Transform your ideas into stunning videos with the power of
              artificial intelligence
            </p>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            {/* Main Input Section */}
            <div className="bg-neutral-900/70 backdrop-blur rounded-3xl border border-neutral-800 p-8 mb-8 shadow-2xl">
              <div className="space-y-6">
                {errorMsg && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 px-4 py-3">
                    {errorMsg}
                  </div>
                )}
                {/* Prompt Input */}
                <div>
                  <label className=" text-sm font-medium text-[#23b5b5] mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Describe your video
                  </label>
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe what the video should communicate. What's the story, mood, or message behind your image?"
                      className="w-full h-32 bg-black/60 border border-neutral-800 rounded-2xl px-6 py-4 pr-32 text-white placeholder-gray-500 focus:outline-none focus:border-[#23b5b5] focus:ring-2 focus:ring-[#23b5b5]/20 transition-all duration-300 resize-none"
                      disabled={isGenerating}
                    />
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      {/* Attachment Button */}
                      <button
                        className="p-1 text-gray-400 hover:text-[#23b5b5] transition-colors duration-200"
                        title="Attach file"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          />
                        </svg>
                      </button>

                      {/* Voice Input Button */}
                      <button
                        className="p-1 text-gray-400 hover:text-[#23b5b5] transition-colors duration-200"
                        title="Voice input"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                          />
                        </svg>
                      </button>

                      <div className="w-px h-4 bg-neutral-700 mx-1"></div>

                      <Wand2 className="w-5 h-5 text-[#23b5b5] opacity-60" />
                    </div>
                  </div>
                  {/* Additional Controls */}
                  <div className="flex items-center justify-end mt-4 px-2">
                    <div className="flex items-center gap-1">
                      {/* Avatar Dropdown */}
                      <div className="relative group">
                        <button className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-[#23b5b5] transition-colors duration-200">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>

                      {/*Language Dropdown */}
                      <div className="relative group">
                        <button className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-[#23b5b5] transition-colors duration-200">
                          <Languages className="w-4 h-4" />
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Duration Dropdown Button */}
                      <div className="relative group" ref={durationDropdownRef}>
                        <button
                          onClick={() =>
                            setShowDurationDropdown(!showDurationDropdown)
                          }
                          className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-[#23b5b5] transition-colors duration-200"
                        >
                          <Timer className="w-4 h-4" />
                          <span className="text-sm">{duration}s</span>
                          <svg
                            className={`w-3 h-3 transition-transform duration-200 ${
                              showDurationDropdown ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {/* Duration Dropdown Menu */}
                        {showDurationDropdown && (
                          <div className="absolute top-full left-0 mt-2 w-32 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg z-50">
                            {durationOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  setDuration(option.value);
                                  setShowDurationDropdown(false);
                                }}
                                className={`w-full px-3 py-2 text-left text-sm transition-colors duration-200 flex items-center gap-2 ${
                                  duration === option.value
                                    ? "bg-[#23b5b5]/20 text-[#23b5b5]"
                                    : "text-gray-300 hover:bg-neutral-800 hover:text-[#23b5b5]"
                                }`}
                              >
                                <option.icon className="w-3 h-3" />
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Voice clone Button */}
                      <button className="p-2 text-gray-400 hover:text-[#23b5b5] transition-colors duration-200">
                        <MicVocal className="w-4 h-4" />
                      </button>

                      {/* Camera Button */}
                      <button className="p-2 text-gray-400 hover:text-[#23b5b5] transition-colors duration-200">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-[#23b5b5] to-[#1a9999] hover:from-[#1a9999] hover:to-[#23b5b5] disabled:from-gray-700 disabled:to-gray-800 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-[#23b5b5]/25"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Video...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Generate Video
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Video Result */}
            {showResult && generatedVideo && (
              <div className="bg-neutral-900/70 backdrop-blur rounded-3xl border border-neutral-800 p-8 mb-8 shadow-2xl animate-fade-in">
                <h3 className="text-2xl font-bold text-[#23b5b5] mb-6 flex items-center gap-2">
                  <Stars className="w-6 h-6" />
                  Generated Video
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative group">
                    {generatedVideo.url ? (
                      <video
                        ref={videoRef}
                        src={generatedVideo.url}
                        poster={generatedVideo.thumbnail || undefined}
                        className="w-full h-64 object-cover rounded-xl"
                        controls
                      />
                    ) : (
                      <div className="w-full h-64 bg-slate-900/60 rounded-xl flex items-center justify-center text-gray-400">
                        No video URL available
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Prompt:</p>
                      <p className="text-gray-200">{generatedVideo.prompt}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Duration:</p>
                      <p className="text-[#23b5b5]">
                        {generatedVideo.duration} seconds
                      </p>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="bg-gradient-to-r from-[#23b5b5] to-[#1a9999] hover:from-[#1a9999] hover:to-[#23b5b5] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
                    >
                      <Download className="w-4 h-4" />
                      Download Video
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Default Prompts */}
            <div className="bg-neutral-900/70 backdrop-blur rounded-3xl border border-neutral-800 p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-[#23b5b5] mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Try These Prompts
              </h3>
              <div className="flex flex-col gap-2">
                {defaultPrompts.map((defaultPrompt, index) => (
                  <button
                    key={index}
                    onClick={() => usePrompt(defaultPrompt)}
                    className="text-left p-4 bg-black/50 rounded-xl border border-neutral-800 hover:border-[#23b5b5]/50 hover:bg-black/70 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-gray-300 group-hover:text-[#23b5b5] transition-colors">
                        {defaultPrompt}
                      </p>
                      <ChevronRight className="w-5 h-5 text-[#23b5b5] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextToVideoGenerator;
