import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const GEMINI_API_KEY = 'AIzaSyCjxEkSZKRdCohde0z5FKaZAO624gF3wms';

const Meme = () => {
  const [query, setQuery] = useState('');
  const [duration, setDuration] = useState(5);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const extractImageDescription = (rawText) => {
    const match = rawText.match(/\*\*Image:\*\*\s*(.*?)\s*(\*\*|$)/);
    return match ? match[1].trim() : rawText;
  };

  const handleGenerate = () => {
    if (!query.trim()) return;
    navigate(`/result2?query=${encodeURIComponent(query)}&duration=${duration}`);
  };

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
          {
            text: "Describe this image in a meme-style prompt.",
          },
        ],
      }],
    };

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY,
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

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(prev => prev + ' ' + transcript);
    };
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

  return (
    <div className="bg-black text-white min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="text-cyan-400 text-xl">🤖</div>
        <div className="text-white text-xl font-bold">VisionaryBot</div>
      </div>

      {/* Subtitle */}
      <div className="text-center text-sm mb-3 text-gray-400">
        Describe anything and get a video instantly.
      </div>

      <h1 className="text-center text-3xl font-bold mb-8">AI Video Generator</h1>

      {/* Input Area */}
      <div className="bg-zinc-900 rounded-md p-4 max-w-3xl mx-auto">
        <label className="text-sm text-gray-400 mb-2 block">What do you want to see?</label>
        <textarea
          rows={3}
          className="w-full bg-zinc-800 text-cyan-200 p-3 rounded-md"
          placeholder="Type something or upload an image/link"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Action Buttons */}
        <div className="flex gap-4 mt-4 flex-wrap">
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-teal-700 text-white px-3 py-1 rounded-md text-sm"
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
            className="bg-teal-700 text-white px-3 py-1 rounded-md text-sm"
          >
            Add Link
          </button>

          <button
            onClick={handleVoiceInput}
            className="bg-teal-700 text-white px-3 py-1 rounded-md text-sm"
          >
            🎤 Voice Input
          </button>

          <div className="flex items-center gap-2 text-sm">
            <label>Duration:</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="bg-zinc-800 text-white p-1 rounded-md"
            >
              <option value={5}>5s</option>
              <option value={10}>10s</option>
              <option value={15}>15s</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center mt-6">
        <button
          className="bg-teal-600 px-6 py-2 text-white rounded-md"
          onClick={handleGenerate}
        >
          Generate Video
        </button>
      </div>
    </div>
  );
};

export default Meme;
