import React, { useState, useRef, useEffect } from "react";

function SimpleChatbot({ open, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const apiKey = "AIzaSyDtZVlnCjG2BgVw59Ym5lJ0lGprHeZHsrA";

  useEffect(() => {
    if (open && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [open, messages]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Show user message immediately
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");

    // Guard: API key missing
    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Gemini API key not configured. Set VITE_GEMINI_API_KEY.",
        },
      ]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: trimmed }] }],
          }),
        }
      );

      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate a response.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error contacting Gemini. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed bottom-24 right-6 z-50 transition-transform duration-300 ${
        open
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-80 h-96 bg-black/90 border border-minimal-primary/40 rounded-xl shadow-2xl backdrop-blur-xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-minimal-primary/30">
          <p className="text-white font-medium">Assistant</p>
          <button
            onClick={onClose}
            className="text-minimal-muted hover:text-white"
          >
            ✕
          </button>
        </div>
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-3 space-y-2"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                m.role === "assistant"
                  ? "bg-minimal-dark-200 text-white self-start"
                  : "bg-minimal-primary text-white ml-auto"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="max-w-[85%] px-3 py-2 rounded-lg text-sm bg-minimal-dark-200 text-white self-start">
              Thinking...
            </div>
          )}
        </div>
        <div className="p-3 border-t border-minimal-primary/30">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-minimal-dark-200 border border-minimal-primary/30 rounded-lg px-3 py-2 text-white outline-none"
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              className="px-3 py-2 bg-minimal-primary text-white rounded-lg hover:opacity-90"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleChatbot;
