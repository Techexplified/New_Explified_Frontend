import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Upload,
  Link as LinkIcon,
  Mic,
  Play,
  Loader2,
} from "lucide-react";

const GEMINI_API_KEY = "AIzaSyA3iqoMW6g81LMjWdyS24WHM32M0ie7AEs"; // Replace with your Gemini API key

const Meme = () => {
  const [query, setQuery] = useState("");
  const [duration, setDuration] = useState(5);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const extractImageDescription = (rawText) => {
    const match = rawText.match(/\*\*Image:\*\*\s*(.*?)\s*(\*\*|$)/);
    return match ? match[1].trim() : rawText;
  };

  const handleMemeGenerate = () => {
    if (!query.trim()) return;
    navigate(`/result?query=${encodeURIComponent(query)}&duration=${duration}`);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsGeneratingPrompt(true);
    try {
      const base64 = await toBase64(file);
      const payload = {
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64.split(",")[1],
                },
              },
              {
                text: "Describe this image in a meme-style prompt.",
              },
            ],
          },
        ],
      };

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
          GEMINI_API_KEY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const imageOnly = extractImageDescription(raw || "");
      if (imageOnly) setQuery(imageOnly);
    } catch (error) {
      console.error("Error generating prompt from image:", error);
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery((prev) => prev + " " + transcript);
    };
  };

  const handleLinkInput = async () => {
    const url = prompt("Paste an image or document link:");
    if (!url) return;

    setIsGeneratingPrompt(true);
    try {
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `Describe this content from the following link in a meme-worthy prompt: ${url}`,
              },
            ],
          },
        ],
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const imageOnly = extractImageDescription(raw || "");
      if (imageOnly) setQuery(imageOnly);
    } catch (error) {
      console.error("Error generating prompt from link:", error);
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-minimal-background via-minimal-dark-100 to-minimal-dark-200 p-6 flex  items-center justify-center">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-minimal-primary/20 rounded-xl border border-minimal-primary/30">
              <Video className="w-8 h-8 text-minimal-primary" />
            </div>
            <h1 className="text-4xl font-bold text-minimal-white">
              AI Meme Generator
            </h1>
          </div>
          <p className="text-minimal-muted text-lg">
            Transform your ideas into viral memes with AI
          </p>
        </div>

        {/* Main Input Card */}
        <div className="bg-minimal-dark-100/50 backdrop-blur-lg rounded-2xl border border-minimal-border/50 p-8 mb-6">
          <div className="mb-6">
            <label className="text-minimal-white text-sm font-medium mb-3 block">
              Describe your meme
            </label>
            <textarea
              rows={4}
              className="w-full bg-minimal-card/50 backdrop-blur-sm text-minimal-white p-4 rounded-xl border border-minimal-border/50 placeholder-minimal-muted focus:outline-none focus:border-minimal-primary/50 focus:ring-2 focus:ring-minimal-primary/20 transition-all duration-200 resize-none"
              placeholder="What's on your mind? Type it out or attach a link — we'll meme it!"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isGeneratingPrompt}
            />
            {isGeneratingPrompt && (
              <div className="flex items-center gap-2 mt-2 text-minimal-primary">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Generating prompt from image...</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={isGeneratingPrompt}
              className="flex items-center gap-2 px-4 py-2 bg-minimal-card/50 backdrop-blur-sm text-minimal-white rounded-xl border border-minimal-border/50 hover:bg-minimal-cardHover hover:border-minimal-primary/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPrompt ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {isGeneratingPrompt ? "Processing..." : "Upload Image"}
              </span>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageUpload}
              disabled={isGeneratingPrompt}
            />

            <button
              onClick={handleLinkInput}
              disabled={isGeneratingPrompt}
              className="flex items-center gap-2 px-4 py-2 bg-minimal-card/50 backdrop-blur-sm text-minimal-white rounded-xl border border-minimal-border/50 hover:bg-minimal-cardHover hover:border-minimal-primary/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LinkIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Add Link</span>
            </button>

            <button
              onClick={handleVoiceInput}
              disabled={isGeneratingPrompt}
              className="flex items-center gap-2 px-4 py-2 bg-minimal-card/50 backdrop-blur-sm text-minimal-white rounded-xl border border-minimal-border/50 hover:bg-minimal-cardHover hover:border-minimal-primary/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mic className="w-4 h-4" />
              <span className="text-sm font-medium">Voice Input</span>
            </button>

            <div className="flex items-center gap-2 px-4 py-2 bg-minimal-card/50 backdrop-blur-sm text-minimal-white rounded-xl border border-minimal-border/50">
              <label className="text-sm font-medium">Duration:</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="bg-transparent text-minimal-white text-sm focus:outline-none"
                disabled={isGeneratingPrompt}
              >
                <option className="text-black" value={5}>
                  5s
                </option>
                <option className="text-black" value={10}>
                  10s
                </option>
                <option className="text-black" value={15}>
                  15s
                </option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <button
              className="flex items-center gap-2 mx-auto px-8 py-3 bg-gradient-to-r from-minimal-primary to-minimal-primary/80 text-minimal-white rounded-xl font-semibold hover:from-minimal-primary/90 hover:to-minimal-primary/70 transition-all duration-200 shadow-lg shadow-minimal-primary/25 hover:shadow-xl hover:shadow-minimal-primary/30 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              onClick={handleMemeGenerate}
              disabled={!query.trim() || isGeneratingPrompt}
            >
              <Play className="w-5 h-5" />
              <span>Generate Meme</span>
            </button>
          </div>
        </div>

        {/* Features Section */}
      </div>
    </div>
  );
};

export default Meme;
