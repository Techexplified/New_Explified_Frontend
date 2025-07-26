import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const GEMINI_API_KEY = 'AIzaSyCjxEkSZKRdCohde0z5FKaZAO624gF3wms';

export default function AutomatedVideoGenerator() {
  const [query, setQuery] = useState('');
  const [duration, setDuration] = useState(5);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const dotGrid = {
    backgroundImage: 'radial-gradient(#ffffff 1.2px, transparent 1.2px)',
    backgroundSize: '48px 48px',
  };

  const extractImageDescription = (rawText) => {
    const match = rawText.match(/\*\*Image:\*\*\s*(.*?)\s*(\*\*|$)/);
    return match ? match[1].trim() : rawText;
  };

  const handleGenerate = () => {
    if (!query.trim()) return;
    navigate(`/result2?query=${encodeURIComponent(query)}&duration=${duration}`);
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

  return (
    <div className="relative text-white overflow-x-hidden" style={dotGrid}>
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="absolute top-4 left-4 text-lg font-medium hover:underline">
        Back
      </button>

      {/* Main UI */}
      <div className="flex flex-col items-center justify-center space-y-10 pt-6 pb-16">

        {/* Greeting Card with Query Input */}
        <div className="w-[500px] rounded-2xl border-2 border-[#23b5b5] p-6 text-center space-y-4 backdrop-blur-sm">
          <h2 className="text-xl">
            Hello,
            <br />
            <span className="text-2xl font-extrabold">Zeno here !</span>
          </h2>

          <p className="text-sm text-white/80">
            What do you want to see in a video?
          </p>

          <textarea
            rows={3}
            placeholder="Describe your idea here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border bg-black border-[#23b5b5] px-3 py-2 text-sm text-white"
          />

          {/* Upload / Input Buttons */}
          <div className="flex flex-col mx-auto gap-2 w-4/6">
            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-[#23b5b5] text-black px-3 py-1 rounded text-sm"
            >
              Upload Image
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageUpload}
            />

            <button
              onClick={handleLinkInput}
              className="bg-[#23b5b5] text-black px-3 py-1 rounded text-sm"
            >
              Add Link
            </button>

            <button
              onClick={handleVoiceInput}
              className="bg-[#23b5b5] text-black px-3 py-1 rounded text-sm"
            >
              🎤 Voice Input
            </button>

            <div className="flex justify-between items-center mt-2 text-sm">
              <label>Duration:</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="bg-black border border-[#23b5b5] text-white p-1 rounded-md"
              >
                <option value={5}>5s</option>
                <option value={10}>10s</option>
                <option value={15}>15s</option>
              </select>
            </div>

            <button
              className="bg-[#23b5b5] text-black px-4 py-2 rounded-md mt-4 font-semibold"
              onClick={handleGenerate}
            >
              Generate Video
            </button>
          </div>
        </div>

        {/* Divider and Steps */}
        <DividerWithText>OR</DividerWithText>

        <Pill label="Trigger" text="Select your trigger event to start your workflow" />
        <div className="w-[3px] h-8 bg-white/70" />
        <Pill label="Action" text="Select an action to your trigger event" />
      </div>
    </div>
  );
}

/* Helper Components */
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
