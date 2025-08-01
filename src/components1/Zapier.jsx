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

const dotSize = 0.5 * scale; // scales the dot radius with zoom
const gridSize = 16 * scale; // scales the spacing

const dotGrid = {
  backgroundImage: `radial-gradient(#d3d3d3 ${dotSize}px, transparent ${dotSize}px)`,
  backgroundSize: `${gridSize}px ${gridSize}px`,
  transition: 'all 0.4s ease-in-out',
  minHeight: '100vh',
};



  const extractImageDescription = (rawText) => {
    const match = rawText.match(/\*\*Image:\*\*\s*(.*?)\s*(\*\*|$)/);
    return match ? match[1].trim() : rawText;
  };

  const handleGenerate = async (type = "video") => {
    if (!query.trim()) return;

    const token = localStorage.getItem("yt_access_token");

    const modifiedQuery =
      type === "short"
        ? `Create a vertical 9:16 short video under 60 seconds: ${query}`
        : `Create a horizontal 16:9 full-length video: ${query}`;

    if (!token) {
      const CLIENT_ID = "1080089039501-2rkku1lknn3d0ukj3a3oh8hi3rg496hl.apps.googleusercontent.com";
      const REDIRECT_URI = "http://localhost:5173/api/youtube/oauth2callback";
      const SCOPE = "https://www.googleapis.com/auth/youtube.upload";

      sessionStorage.setItem(
        "postAuthRedirect",
        `/result2?query=${encodeURIComponent(modifiedQuery)}&duration=${duration}&type=${type}`
      );

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&response_type=token&scope=${encodeURIComponent(
        SCOPE
      )}&prompt=consent&state=${encodeURIComponent(
        `/result2?query=${modifiedQuery}&duration=${duration}&type=${type}`
      )}`;

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
    <div className="relative text-white overflow-x-hidden" style={dotGrid}>
      {/* Fixed Zoom Buttons */}
      <div className="fixed bottom-4 left-4 space-x-2 z-50">
        <button
          onClick={() => setScale(s => Math.max(0.3, s - 0.1))}
          className="bg-[#23b5b5] text-black px-3 py-1 rounded">-</button>
        <button
          onClick={() => setScale(s => Math.min(3, s + 0.1))}
          className="bg-[#23b5b5] text-black px-3 py-1 rounded">+</button>
      </div>

      {/* Back and WhatsApp */}
      <a href="https://wa.me/+14155238886?text=Hi%20there!" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: "36px", color: "#25D366" }} />
      </a>
      <button onClick={() => navigate(-1)} className="absolute top-4 left-4 text-lg font-medium hover:underline">
        Back
      </button>

      {/* Zoomable Page Content */}
      <div
        id="zoom-wrapper"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <div className="flex flex-col items-center justify-center space-y-10 pt-6 pb-16">
          <div className="w-[500px] rounded-2xl border-2 border-[#23b5b5] p-6 text-center space-y-4 backdrop-blur-sm">
            <h2 className="text-xl">
              Hello,
              <br />
              <span className="text-2xl font-extrabold">Zeno here !</span>
            </h2>
            <p className="text-sm text-white/80">What do you want to see in a video?</p>
            <textarea
              rows={3}
              placeholder="Describe your idea here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border bg-black border-[#23b5b5] px-3 py-2 text-sm text-white"
            />
            <div className="flex flex-col space-y-3 mt-4">
              <button
                className="bg-[#23b5b5] text-black px-4 py-2 rounded-md font-semibold"
                onClick={() => handleGenerate('short')}
              >
                Create Short
              </button>
              <button
                className="bg-[#23b5b5] text-black px-4 py-2 rounded-md font-semibold"
                onClick={() => handleGenerate('video')}
              >
                Create Video
              </button>
            </div>
          </div>

          <DividerWithText>OR</DividerWithText>

          <Pill label="Trigger" text="Select your trigger event to start your workflow" />
          <div className="w-[3px] h-8 bg-white/70" />
          <Pill label="Action" text="Select an action to your trigger event" />
        </div>
      </div>

      {/* Non-scaled ZoomableBox */}
      <ZoomableBox />
    </div>
  );
}

function DividerWithText({ children }) {
  return (
    <div className="flex items-center w-full max-w-xs">
      <div className="flex-1 h-[2px] bg-white/70" />
      <span className="mx-3 text-sm font-semibold">{children}</span>
      <div className="flex-1 h-[2px] bg-white/70" />
    </div>
  );
}

function Pill({ label, text }) {
  return (
    <div className="relative w-80">
      <span className="absolute -top-3 left-4 bg-black px-1 text-xs tracking-wide text-white/60">
        {label}
      </span>
      <div className="rounded-full border-2 border-[#23b5b5] px-6 py-3 text-center text-sm">
        {text}
      </div>
    </div>
  );
}

function ZoomableBox() {
  const [boxes, setBoxes] = useState([]);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState(null);

  const addBox = () => {
    setBoxes([...boxes, { id: Date.now(), icon: null }]);
  };

  const handleIconSelect = (selected, index) => {
    const updated = [...boxes];
    updated[index].icon = selected.value;
    setBoxes(updated);
    setSelectedBoxIndex(null); // close select after choosing
  };

  return (
    <div>
      {/* Fixed toolbar at bottom */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-full px-4 py-2 flex items-center space-x-4 z-50">
        <button
          onClick={addBox}
          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded"
          title="Add Box"
        >
          ⬜
        </button>
      </div>

      {/* Render Boxes */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-4">
        {boxes.map((box, index) => (
          <div key={box.id} className="relative">
            <div
              onClick={() => setSelectedBoxIndex(index)}
              className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center cursor-pointer"
            >
              {box.icon || "⬜"}
            </div>
            {selectedBoxIndex === index && (
              <div className="absolute top-14 z-50 w-64">
                <Select
  options={allOptions}
  onChange={(selected) => handleIconSelect(selected, index)}
  placeholder="Select a tool..."
  isSearchable
  menuPosition="fixed"
  styles={{
    control: (base) => ({
      ...base,
      backgroundColor: '#fff',
      color: '#000',
      borderColor: '#ccc',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#fff',
      zIndex: 9999,
      color: '#000',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#f0f0f0' : '#fff',
      color: '#000',
    }),
    singleValue: (base) => ({
      ...base,
      color: '#000',
    }),
    input: (base) => ({
      ...base,
      color: '#000',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#666',
    }),
  }}
/>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}