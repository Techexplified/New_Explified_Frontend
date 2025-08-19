import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  FaWhatsapp,
  FaDiscord,
  FaTelegram,
  FaSlack,
  FaRobot,
  FaGem,
  FaSearch,
  FaBrain,
  FaFeatherAlt,
  FaMicrosoft,
  FaFacebook,
  FaTwitter,
  FaGithub,
  FaGoogle,
  FaComments,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaChrome,
} from "react-icons/fa";
import Select from "react-select";

import {
  Play,
  Sparkles,
  Zap,
  Video,
  Clock,
  ChevronDown,
  Check,
  Download,
} from "lucide-react";

const categorizedTools = {
  Messaging: [
    { label: "WhatsApp by Twilio", value: <FaWhatsapp /> },
    { label: "Discord", value: <FaDiscord /> },
    { label: "Telegram", value: <FaTelegram /> },
    { label: "Dealbot for Slack", value: <FaSlack /> },
  ],
  "AI Tools": [
    { label: "ChatGPT", value: <FaRobot /> },
    { label: "Gemini", value: <FaGem /> },
    { label: "DeepSeek", value: <FaSearch /> },
    { label: "Perplexity AI", value: <FaBrain /> },
    { label: "Notion AI", value: <FaFeatherAlt /> },
    { label: "Slack GPT", value: <FaSlack /> },
    { label: "Bing AI", value: <FaMicrosoft /> },
    { label: "Facebook AI", value: <FaFacebook /> },
    { label: "Twitter AI", value: <FaTwitter /> },
    { label: "GitHub Copilot", value: <FaGithub /> },
  ],
  "Video Conferencing": [
    { label: "Google Meet", value: <FaGoogle /> },
    { label: "Microsoft Teams", value: <FaMicrosoft /> },
    { label: "Zoom Meetings", value: <FaComments /> },
  ],
  "Social Media": [
    { label: "Instagram", value: <FaInstagram /> },
    { label: "LinkedIn Tools", value: <FaLinkedin /> },
    { label: "YouTube AI", value: <FaYoutube /> },
  ],
  Automation: [
    { label: "Zapier", value: <FaFeatherAlt /> },
  ],
  "Browser Extensions": [
    { label: "Chrome Extensions", value: <FaChrome /> },
  ],
};

const allOptions = Object.entries(categorizedTools).flatMap(([label, options]) => ({
  label,
  options,
}));
const GEMINI_API_KEY = 'AIzaSyCjxEkSZKRdCohde0z5FKaZAO624gF3wms';

export default function AutomatedVideoGenerator() {
  const [query, setQuery] = useState('');
  const [duration, setDuration] = useState(5);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);
    const [prompt, setPrompt] = useState("");
  const [videoType, setVideoType] = useState("normal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

const dotSize = 0.5 * scale; // scales the dot radius with zoom
const gridSize = 16 * scale; // scales the spacing

const dotGrid = {
  backgroundImage: `radial-gradient(#d3d3d3 ${dotSize}px, transparent ${dotSize}px)`,
  backgroundSize: `${gridSize}px ${gridSize}px`,
  transition: 'all 0.4s ease-in-out',
  minHeight: '100vh',
};


const videoTypes = [
    {
      value: "normal",
      label: "Normal Video",
      icon: Video,
      duration: "5-15 min",
    },
    {
      value: "short",
      label: "YouTube Short",
      icon: Clock,
      duration: "15-60 sec",
    },
  ];

  const selectedType = videoTypes.find((type) => type.value === videoType);
  const extractImageDescription = (rawText) => {
    const match = rawText.match(/\*\*Image:\*\*\s*(.*?)\s*(\*\*|$)/);
    return match ? match[1].trim() : rawText;
  };

const handleGenerate = async (type = "video") => {
  const queryText = query || prompt; // fallback if one is undefined
  if (!queryText?.trim()) return;

  setIsGenerating(true);
  setGenerationProgress(0);
  setShowSuccess(false);

  const interval = setInterval(() => {
    setGenerationProgress((prev) => {
      if (prev >= 100) {
        clearInterval(interval);
        setIsGenerating(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        return 100;
      }
      return prev + Math.random() * 12;
    });
  }, 250);

  const token = localStorage.getItem("yt_access_token");

  const modifiedQuery =
    type === "short"
      ? `Create a vertical 9:16 short video under 60 seconds: ${queryText}`
      : `Create a horizontal 16:9 full-length video: ${queryText}`;

  if (!token) {
    const CLIENT_ID = "1080089039501-2rkku1lknn3d0ukj3a3oh8hi3rg496hl.apps.googleusercontent.com";
    const REDIRECT_URI = "http://localhost:5173/api/youtube/oauth2callback";

    const SCOPE = [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.readonly"
    ].join(" ");

    const redirectPath = `/result2?query=${encodeURIComponent(modifiedQuery)}&duration=${duration}&type=${type}`;
    sessionStorage.setItem("postAuthRedirect", redirectPath);

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=token&scope=${encodeURIComponent(SCOPE)}&prompt=consent&state=${encodeURIComponent(redirectPath)}`;

    window.location.href = authUrl;
  } else {
    navigate(`/result2?query=${encodeURIComponent(modifiedQuery)}&duration=${duration}&type=${type}`);
  }
};



  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64 = await toBase64(file);
    const payload = {
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64.split(',')[1],
            },
          },
          { text: "Describe this image in a meme-style prompt." },
        ],
      }],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const imageOnly = extractImageDescription(raw || "");
    if (imageOnly) setQuery(imageOnly);
  };

  const handleLinkInput = async () => {
    const url = prompt('Paste an image or document link:');
    if (!url) return;

    const payload = {
      contents: [{
        parts: [
          { text: `Describe this content from the following link in a meme-worthy prompt: ${url}` }
        ]
      }]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const imageOnly = extractImageDescription(raw || "");
    if (imageOnly) setQuery(imageOnly);
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(prev => prev + ' ' + transcript);
    };
  };

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setScale(prev => Math.min(Math.max(prev + delta, 0.3), 3));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === '=' || e.key === '+') {
      setScale(prev => Math.min(prev + 0.1, 3));
    } else if (e.key === '-' || e.key === '_') {
      setScale(prev => Math.max(prev - 0.1, 0.3));
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Card with Glowing Border */}
      <div className="relative group">
        {/* Glowing Border Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse"></div>

        {/* Main Content */}
        <div className="relative border-2 border-cyan-700 bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 ">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-700 rounded-lg blur-sm opacity-60"></div>
              <div className="relative bg-gradient-to-r from-cyan-500 to-blue-400 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Workflow</h2>
              <p className="text-gray-400 text-xs">
                Create stunning videos with zeno
              </p>
            </div>
          </div>

          {/* Video Type Selector */}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Video Type
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-gray-800/60 border border-gray-600/60 rounded-lg px-3 py-2.5 text-left flex items-center justify-between transition-all duration-300 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/10 text-sm"
              >
                <div className="flex items-center space-x-2">
                  <selectedType.icon className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-white font-medium">
                      {selectedType.label}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {selectedType.duration}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800/95 backdrop-blur-xl border border-gray-600/60 rounded-lg overflow-hidden z-20 transform transition-all duration-300">
                  {videoTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setVideoType(type.value);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2.5 text-left flex items-center space-x-2 hover:bg-gray-700/50 transition-colors duration-200 text-sm"
                    >
                      <type.icon className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="text-white font-medium">
                          {type.label}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {type.duration}
                        </div>
                      </div>
                      {videoType === type.value && (
                        <Check className="w-4 h-4 text-cyan-400 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Video Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your video idea..."
              className="w-full bg-gray-800/60 border border-gray-600/60 rounded-lg px-3 py-2.5 text-white placeholder-gray-400 resize-none h-20 text-sm transition-all duration-300 focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/20 focus:outline-none hover:border-gray-500/60"
              rows={3}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 transform ${
              !prompt.trim() || isGenerating
                ? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-800 text-white hover:from-cyan-400 hover:to-blue-900 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98]"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Generate Video</span>
                </>
              )}
            </div>
          </button>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="mt-4 transform transition-all duration-500">
              <div className="flex justify-between text-xs text-gray-300 mb-2">
                <span>Processing...</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-500 ease-out rounded-full relative"
                  style={{ width: `${generationProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="mt-4 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg transform transition-all duration-500">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-green-500 rounded-full">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-green-400 font-medium text-sm">
                    Video Ready!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}