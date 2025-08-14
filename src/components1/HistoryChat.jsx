// src/pages/HistoryChat.jsx
import { useState } from "react";
import { Play, Presentation, Video } from "lucide-react";
import History from "../components1/History";

export default function HistoryChat() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const recentItems = [
    {
      id: 1,
      icon: <Play className="w-5 h-5" />,
      type: "Youtube Summarizer",
      title: "Video: How to use Figma",
      category: "video",
    },
    {
      id: 2,
      icon: <Presentation className="w-5 h-5" />,
      type: "Slideshow Maker",
      title: "Product Management: Case Competition",
      category: "slideshow",
    },
    {
      id: 3,
      icon: <Video className="w-5 h-5" />,
      type: "Video Generator",
      title: "Product Management",
      category: "video",
    },
  ];

  async function handleSend() {
    if (!input.trim()) return;

    setLoading(true);
    const userMessage = { role: "user", text: input };

    try {
      // Call Gemini API
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
          import.meta.env.VITE_GEMINI_API_KEY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: input }],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const botMessage = {
        role: "assistant",
        text: data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response",
      };

      setChatHistory((prev) => [...prev, userMessage, botMessage]);
    } catch (err) {
      console.error(err);
    }

    setInput("");
    setLoading(false);
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-6">
      <div className="flex items-center justify-center text-3xl font-semibold mb-4">
        Chat History
      </div>

      {/* History Component */}
      <History items={recentItems} />

      {/* Gemini Chat Messages */}
      <div className="w-full max-w-2xl mt-6 space-y-3">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg ${
              msg.role === "user" ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="w-full max-w-2xl flex mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Know about history..."
          className="flex-1 p-3 rounded-l-lg bg-black border border-gray-700 focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 bg-teal-500 rounded-r-lg hover:bg-teal-600 disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

