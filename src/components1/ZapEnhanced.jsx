import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, Link as LinkIcon, Play, Youtube } from "lucide-react";

const GEMINI_API_KEY = "AIzaSyCjxEkSZKRdCohde0z5FKaZAO624gF3wms";

const EnhancedPost = () => {
  const location = useLocation();
  const { videoUrl, query } = location.state || {};

  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [timeline, setTimeline] = useState([]);
  const [links, setLinks] = useState("");
  const [bestTime, setBestTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [ytChannel, setYtChannel] = useState("MrBeast");
  const [subs, setSubs] = useState("40M");
  const [members, setMembers] = useState("40M");

  const timeOptions = ["08:00 Am", "09:00 Pm", "12:00 Pm", "Custom"];

  const navigate = useNavigate();

  const handlePost = () => {
    // Handle post logic here
    navigate("/ai/youtube-upload", { state: { videoUrl } });
  };

  useEffect(() => {
    if (!query) return;

    const fetchGeminiContent = async () => {
      const contentPrompt = {
        contents: [
          {
            parts: [
              {
                text: `Generate the following for a video titled "${query}":\n\n1. A compelling video description\n2. Relevant hashtags (comma-separated)\n3. Timeline-based guesses for what the video might include in each 3-second interval (up to 30s).\n\nFormat:\n**Description:**\n...\n\n**Hashtags:**\n...\n\n**Timeline:**\n0-3s: ...\n3-6s: ...\n...`,
              },
            ],
          },
        ],
      };

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contentPrompt),
          }
        );

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        const descMatch = text.match(/\*\*Description:\*\*\n([\s\S]*?)\n\n/);
        const hashMatch = text.match(/\*\*Hashtags:\*\*\n([\s\S]*?)\n\n/);
        const timelineMatch = text.match(/\*\*Timeline:\*\*\n([\s\S]*)/);

        setDescription(descMatch?.[1]?.trim() || "");
        setHashtags(hashMatch?.[1]?.trim() || "");
        const timelineLines =
          timelineMatch?.[1]
            ?.trim()
            ?.split("\n")
            ?.map((line) => line.trim()) || [];

        setTimeline(timelineLines);
      } catch (err) {
        console.error("❌ Gemini Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGeminiContent();
  }, [query]);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center text-lg">
      {/* YouTube Channel Selector */}
      <div className="mb-8 w-full flex justify-center">
        <div className="w-full max-w-xs">
          <label className="text-lg font-semibold text-white text-center block mb-2">
            Select YouTube Channel
          </label>

          <div className="relative group">
            <Youtube
              className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600"
              size={20}
            />
            <select
              value={ytChannel}
              onChange={(e) => setYtChannel(e.target.value)}
              className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-md pl-10 pr-10 py-2 text-center appearance-none focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-red-400 transition duration-200 ease-in-out cursor-pointer"
            >
              <option value="MrBeast">MrBeast</option>
              <option value="Veritasium">Veritasium</option>
              <option value="MKBHD">MKBHD</option>
              <option value="Kurzgesagt">Kurzgesagt</option>
              <option value="YourCustomChannel">YourCustomChannel</option>
            </select>

            {/* Animated dropdown arrow */}
            <svg
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-white transition-transform duration-200"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-semibold mb-4">AI Video Post Generator</h1>

      {/* Video Placeholder */}
      <div className="w-full max-w-3xl aspect-video bg-gray-300 flex items-center justify-center rounded-lg overflow-hidden">
        {loading ? (
          <p className="text-black font-semibold">Loading...</p>
        ) : videoUrl ? (
          <video controls className="w-full h-full object-cover">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p className="text-black font-bold text-lg">
            No video found for "{query}"
          </p>
        )}
      </div>

      {/* Description */}
      <div className="mt-10 w-full max-w-3xl mb-8">
        <label className="block mb-1 text-xl">Description:</label>
        <div
          className="relative border rounded-xl p-3"
          style={{ borderColor: "#23b5b5" }}
        >
          <textarea
            className="w-full bg-transparent outline-none resize-none h-24"
            placeholder="Enter description..."
            value={loading ? "Generating..." : description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {description && !loading && (
            <X
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setDescription("")}
            />
          )}
        </div>
      </div>

      {/* Hashtags */}
      <div className="w-full max-w-3xl mb-8">
        <label className="block mb-1">Hashtags:</label>
        <div
          className="relative border rounded-xl p-3"
          style={{ borderColor: "#23b5b5" }}
        >
          <textarea
            value={loading ? "Generating..." : hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="Hashtags"
            className="w-full bg-transparent outline-none resize-none h-24"
          />

          {hashtags && !loading && (
            <X
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setHashtags("")}
            />
          )}
        </div>
      </div>

      {/* Timeline (Sections) */}
      <div className="w-full max-w-3xl mb-8">
        <label className="block mb-1">Sections:</label>
        <div
          className="border rounded-xl p-3 space-y-3"
          style={{ borderColor: "#23b5b5" }}
        >
          {timeline.length ? (
            timeline.map((line, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-400" />
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none border-b border-gray-500 py-1"
                  value={line}
                  onChange={(e) => {
                    const newTimeline = [...timeline];
                    newTimeline[idx] = e.target.value;
                    setTimeline(newTimeline);
                  }}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              {loading ? "Generating..." : "No timeline available"}
            </p>
          )}
        </div>
      </div>

      {/* Relevant Links */}
      <div className="w-full max-w-3xl mb-8">
        <label className="block mb-1">Relevant links:</label>
        <div
          className="relative border rounded-xl p-3 flex items-center"
          style={{ borderColor: "#23b5b5" }}
        >
          <LinkIcon className="mr-2" />
          <input
            type="text"
            className="flex-1 bg-transparent outline-none"
            placeholder="https://"
            value={links}
            onChange={(e) => setLinks(e.target.value)}
          />
          {links && (
            <X className="ml-2 cursor-pointer" onClick={() => setLinks("")} />
          )}
        </div>
      </div>

      {/* Best Time to Post */}
      <div className="w-full max-w-3xl mb-8">
        <label className="block mb-4">Best time to post:</label>
        <div className="flex flex-wrap gap-4">
          {timeOptions.map((time) => (
            <button
              key={time}
              className={`px-4 py-1 rounded-full border transition ${
                bestTime === time ? "text-black" : "text-white"
              }`}
              style={{
                backgroundColor: bestTime === time ? "#23b5b5" : "transparent",
                borderColor: "#23b5b5",
              }}
              onClick={() => setBestTime(time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="w-full max-w-3xl flex justify-between items-center">
        <div
          className="flex items-center rounded-full px-4 py-2 w-[75%]"
          style={{ border: "1px solid #23b5b5" }}
        >
          <input
            type="text"
            placeholder="Ask me questions"
            className="flex-1 bg-transparent outline-none text-white"
          />
          <Play className="w-5 h-5 cursor-pointer text-white" />
        </div>

        <button
          className="ml-4 px-6 py-2 rounded-full transition text-white"
          style={{ border: "1px solid #23b5b5", backgroundColor: "#000" }}
          onClick={handlePost}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#23b5b5")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#000")}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default EnhancedPost;
