import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPaperclip,
  FiImage,
  FiSend,
  FiShoppingCart,
  FiSearch,
  FiTruck,
  FiInfo,
  FiMic,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import SidebarOnHover2 from "../reusable_components/SidebarOnHover2";
import GeminiLinearEffect from "./GeminiLinearEffect";
import SidebarOnHover3 from "../reusable_components/SidebarOnHover3";

const promptSuggestions = [
  { icon: <FiShoppingCart />, text: "Checking part availability" },
  { icon: <FiSearch />, text: "Find compatible tires for a 2020 Honda Civic" },
  { icon: <FiTruck />, text: "Placing an order for car parts" },
  {
    icon: <FiInfo />,
    text: "What’s the difference between synthetic and regular oil?",
  },
];

const AdminModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-black border border-gray-500 rounded-xl shadow-2xl w-full max-w-sm p-8 relative">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">
          Flowsense Admin Login
        </h1>

        <h2 className="text-lg font-semibold text-center text-white mb-6">
          Login
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email Id
            </label>
            <input
              type="email"
              placeholder="hello@explified.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 mb-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <Link to={"/flowsense/explified/admin"}>
            <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition">
              Login
            </button>
          </Link>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const webhookUrl =
  "https://infogaurav.app.n8n.cloud/webhook/7cf23db3-e0c0-40b2-bb8f-77c8399e2e85";

const CarPartsAssistant = () => {
  // State for chat/voice card visibility and chat box interactivity
  // Remove cards, show Gemini effect on load, then blurred chat box
  const [showGeminiEffect, setShowGeminiEffect] = useState(true);
  const [chatBoxActive, setChatBoxActive] = useState(false);

  // Card click handlers
  // No cards, just Gemini effect and then blurred chat box
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  // Admin access handler - direct navigation without login layer
  const handleAdminAccess = () => {
    setIsAdminModalOpen(true);
  };

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
      };
      recognitionRef.current.onerror = () => {
        setListening(false);
      };
      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }
  }, []);

  // Always keep mic on (voice recognition always listening)
  useEffect(() => {
    if (showGeminiEffect && recognitionRef.current && !listening) {
      setListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }
    // If recognition ends and Gemini is still open, restart it
    if (showGeminiEffect && recognitionRef.current) {
      recognitionRef.current.onend = () => {
        setListening(false);
        try {
          recognitionRef.current.start();
        } catch (e) {}
      };
    }
    // If Gemini is closed, stop mic
    if (!showGeminiEffect && recognitionRef.current && listening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setListening(false);
    }
    // eslint-disable-next-line
  }, [showGeminiEffect, listening]);

  const handleMicClick = () => {
    // Always show animation and restore mic handlers
    if (!showGeminiEffect) {
      setShowGeminiEffect(true);
      setChatBoxActive(false);
      // Wait for animation to mount before starting mic
      setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            setListening(false);
          };
          recognitionRef.current.onerror = () => {
            setListening(false);
          };
          recognitionRef.current.onend = () => {
            setListening(false);
          };
          setListening(true);
          try {
            recognitionRef.current.start();
          } catch (e) {}
        }
      }, 100); // Small delay to ensure animation is visible
    } else {
      setChatBoxActive(false);
      if (recognitionRef.current) {
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setListening(false);
        };
        recognitionRef.current.onerror = () => {
          setListening(false);
        };
        recognitionRef.current.onend = () => {
          setListening(false);
        };
        setListening(true);
        try {
          recognitionRef.current.start();
        } catch (e) {}
      }
    }
  };

  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, loading]);

  const parseBotResponse = (text) => {
    const clean = text.trim();
    const itemMatch = clean.match(/Item Name:\s*(.+)/i);
    const partMatch = clean.match(/Part Number:\s*(.+)/i);
    const priceMatch = clean.match(/Price:\s*(.+)/i);

    return {
      raw: clean,
      item: itemMatch ? itemMatch[1] : null,
      part: partMatch ? partMatch[1] : null,
      price: priceMatch ? priceMatch[1] : null,
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);
    setError(null);
    setFirstMessageSent(true);

    setChat((prev) => [...prev, { sender: "user", text: userMessage }]);

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userMessage }),
      });
      console.log("Response:", res);

      if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);

      const data = await res.json();
      const output =
        Array.isArray(data) && data[0] && data[0].output
          ? data[0].output
          : data.output || JSON.stringify(data);
      const parsed = parseBotResponse(output);

      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          ...parsed,
          raw: parsed.raw || output || JSON.stringify(data),
        },
      ]);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-black">
      {/* Ocean Abyss Background with Top Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.25), transparent 70%), #000000",
        }}
      />

      {/* Main App Content */}
      <div className="relative z-10 flex h-screen opacity-80">
        {/* Sidebar */}
        <SidebarOnHover3
          toolName="AI Assistant"
          onToggle={(open) => {
            setIsSidebarOpen(open);
            setIsSidebarPinned(open);
          }}
          bottomSection={
            <button
              onClick={handleAdminAccess}
              className="w-32 bg-gradient-to-r from-teal-600 to-teal-400 hover:from-teal-700 hover:to-teal-500 text-white font-semibold py-2 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm"
              style={{ minWidth: 80, textAlign: "center" }}
            >
              Admin
            </button>
          }
        />

        {/* Main Content - No header, only chat and input area */}
        <main
          className={`flex-1 p-8 overflow-y-auto transition-all duration-300 ${
            isSidebarOpen || isSidebarPinned ? "ml-72" : "ml-0"
          }`}
        >
          {/* Chat area with TaskPage theme */}
          <div className="flex-1 px-4 overflow-y-auto pb-44 pt-4 max-w-3xl w-full mx-auto">
            {/* Talking AI effect animation at the top, only if enabled */}
            {showGeminiEffect ? (
              <GeminiLinearEffect
                speaking={listening}
                onClose={() => {
                  setShowGeminiEffect(false);
                  setChatBoxActive(true); // unblur and activate chat box
                  // Stop mic and remove all handlers
                  if (recognitionRef.current) {
                    try {
                      recognitionRef.current.stop();
                    } catch (e) {}
                    recognitionRef.current.onresult = null;
                    recognitionRef.current.onerror = null;
                    recognitionRef.current.onend = null;
                  }
                  setListening(false);
                }}
              />
            ) : null}
            <div className="flex flex-col gap-4">
              {chat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-sm whitespace-pre-line shadow-lg backdrop-blur-sm border transition-all duration-300
                      ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-teal-600 to-teal-400 text-white border-teal-400/40"
                          : "bg-slate-800/40 text-teal-100 border-teal-600/20"
                      }
                    `}
                  >
                    {msg.sender === "bot" ? (
                      <div>
                        {/* Show item/part/price if present */}
                        {msg.item && (
                          <p>
                            <span className="text-teal-300 font-semibold">
                              Item Name:
                            </span>{" "}
                            <span className="font-medium">{msg.item}</span>
                          </p>
                        )}
                        {msg.part && (
                          <p>
                            <span className="text-teal-300 font-semibold">
                              Part Number:
                            </span>{" "}
                            <span className="font-medium">{msg.part}</span>
                          </p>
                        )}
                        {msg.price && (
                          <p className="mt-2 px-3 py-1 inline-block bg-gradient-to-r from-teal-600 to-teal-400 text-white rounded-full font-semibold text-sm">
                            Price: {msg.price}
                          </p>
                        )}
                        {/* Always show bot response (raw or text) */}
                        <div className="mt-2 prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown
                            components={{
                              strong: ({ ...props }) => (
                                <strong
                                  className="text-teal-400 font-semibold"
                                  {...props}
                                />
                              ),
                              ul: ({ ...props }) => (
                                <ul
                                  className="list-disc list-inside ml-4"
                                  {...props}
                                />
                              ),
                              p: ({ ...props }) => (
                                <p className="mb-2" {...props} />
                              ),
                            }}
                          >
                            {msg.raw || msg.text || ""}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 text-gray-100 text-sm p-3 rounded-lg animate-pulse">
                    Typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center mt-2">
                {error}
              </div>
            )}
          </div>

          {/* Input Area with consistent dark/teal theme */}
          <div className="w-full fixed bottom-0 left-0 bg-black border-t border-teal-800/40 z-50 px-4 py-5">
            <div className="max-w-3xl mx-auto">
              <div
                className={`bg-black border border-teal-800/40 rounded-2xl px-5 py-4 flex flex-col shadow-[0_4px_32px_0_rgba(0,0,0,0.65)] focus-within:ring-2 focus-within:ring-teal-700/40 transition-all duration-200
                  ${
                    !chatBoxActive
                      ? "backdrop-blur-2xl pointer-events-none opacity-60"
                      : ""
                  }`}
                style={
                  !chatBoxActive ? { filter: "blur(1.5px) saturate(1)" } : {}
                }
              >
                {/* Top row: textarea + send/mic */}
                <div className="flex items-end gap-3">
                  <textarea
                    rows="2"
                    placeholder="Type your message..."
                    className="flex-1 resize-none text-base bg-transparent text-teal-200 placeholder-white focus:outline-none leading-6 max-h-32"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      (e.preventDefault(), handleSend())
                    }
                    maxLength={1000}
                    disabled={loading || !chatBoxActive}
                  ></textarea>

                  <div className="flex items-center gap-2 pb-1">
                    <button
                      onClick={handleMicClick}
                      className={`p-2 rounded-full transition ${
                        listening
                          ? "bg-gradient-to-r from-teal-600 to-teal-400"
                          : "bg-[#1e293b] hover:bg-teal-700/40"
                      } text-white`}
                      aria-label="Voice input"
                      disabled={loading || listening || !chatBoxActive}
                    >
                      <FiMic size={18} />
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={loading || !input.trim() || !chatBoxActive}
                      className="p-2 bg-gradient-to-r from-teal-600 to-teal-400 hover:from-teal-700 hover:to-teal-500 text-white rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiSend size={18} />
                    </button>
                  </div>
                </div>

                {/* Bottom row: attachments + counter */}
                <div className="flex items-center justify-between mt-2 text-xs text-white">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-teal-300">
                      <FiPaperclip size={14} />
                      <span>Attachment</span>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer hover:text-teal-300">
                      <FiImage size={14} />
                      <span>Image</span>
                    </div>
                  </div>
                  <span>{input.length}/1000</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
};

export default CarPartsAssistant;
