import React, { useState, useEffect, useRef } from "react";
import {
  FiPlus,
  FiMic,
  FiSliders,
  FiX,
  FiSend,
  FiImage,
  FiPaperclip,
  FiSearch,
} from "react-icons/fi";
import { BsSoundwave } from "react-icons/bs";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarOnHover from "../reusable_components/SidebarOnHover";
import { Sparkle } from "lucide-react";

const INTEGRATION_PROVIDERS = [
  { id: "gemini", name: "Gemini" },
  { id: "openai", name: "OpenAI" },
  { id: "grok", name: "Grok" },
  { id: "anthropic", name: "Anthropic" },
  { id: "mistral", name: "Mistral" },
  { id: "cohere", name: "Cohere" },
];

function Trone({ onFirstPrompt }) {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const raw = localStorage.getItem("trone_chat_sessions");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }); // stores ended sessions
  const [currentMessages, setCurrentMessages] = useState([]); // active session messages
  const [sessionId, setSessionId] = useState(
    () =>
      `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  );
  const [sessionStartedAt, setSessionStartedAt] = useState(null);

  const [isTyping, setIsTyping] = useState(false);
  const [firstPromptDone, setFirstPromptDone] = useState(
    localStorage.getItem("firstPromptDone") === "true"
  );

  const location = useLocation();
  const { isDrawerOpen = true, reset = false } = location.state || {};
  const prevDrawerState = useRef(isDrawerOpen);
  const navigate = useNavigate();

  // Voice recognition
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showIntegrationHint, setShowIntegrationHint] = useState(true);
  const [isHoveringIntegration, setIsHoveringIntegration] = useState(false);
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);
  const [integrationTab, setIntegrationTab] = useState("my"); // "my" | "add"
  const [integrationSearch, setIntegrationSearch] = useState("");
  const [providerKeys, setProviderKeys] = useState(() => {
    try {
      const raw = localStorage.getItem("provider_keys");
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    if (!prevDrawerState.current && isDrawerOpen) {
      setFirstPromptDone(false);
      localStorage.setItem("firstPromptDone", "false");
      setCurrentMessages([]);
      setPrompt("");
    }
    prevDrawerState.current = isDrawerOpen;
  }, [isDrawerOpen]);

  // Persist sessions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("trone_chat_sessions", JSON.stringify(chatHistory));
    } catch (e) {
      // ignore storage errors
    }
  }, [chatHistory]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [currentMessages, isTyping]);

  const GEMINI_API_KEY = "AIzaSyCjxEkSZKRdCohde0z5FKaZAO624gF3wms";

  // Removed auto-syncing current messages from localStorage to prevent overwriting sessions

  useEffect(() => {
    if (reset) {
      setCurrentMessages([]);
      setFirstPromptDone(false);
      setPrompt("");
    }
  }, [reset]);

  useEffect(() => {
    const timerId = setTimeout(() => setShowIntegrationHint(false), 5000);
    return () => clearTimeout(timerId);
  }, []);

  // Format text with proper line breaks, code blocks, and lists
  const formatText = (text) => {
    if (!text) return "";

    return (
      text
        // Handle code blocks (```code```)
        .replace(
          /```([\s\S]*?)```/g,
          '<pre style="background: #2a2a2a; padding: 12px; border-radius: 8px; margin: 8px 0; overflow-x: auto;"><code>$1</code></pre>'
        )
        // Handle inline code (`code`)
        .replace(
          /`([^`]+)`/g,
          '<code style="background: #2a2a2a; padding: 2px 6px; border-radius: 4px; font-family: monospace;">$1</code>'
        )
        // Handle bold text (**text** or __text__)
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/__(.*?)__/g, "<strong>$1</strong>")
        // Handle italic text (*text* or _text_)
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/_(.*?)_/g, "<em>$1</em>")
        // Handle numbered lists
        .replace(/^\d+\.\s+(.+)$/gm, '<div style="margin: 4px 0;">• $1</div>')
        // Handle bullet points
        .replace(/^[-•*]\s+(.+)$/gm, '<div style="margin: 4px 0;">• $1</div>')
        // Handle line breaks
        .replace(/\n\n/g, "<br><br>")
        .replace(/\n/g, "<br>")
    );
  };

  // Enhanced submit handler with better error handling and conversation context
  const handleSubmit = async (e) => {
    if (e.key === "Enter" && prompt.trim() !== "") {
      const userMessage = { sender: "user", text: prompt.trim() };
      if (currentMessages.length === 0) {
        setSessionStartedAt(Date.now());
      }
      setCurrentMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      // Persist to recentPrompts on every prompt (dedupe, keep latest 5)
      const existing = JSON.parse(localStorage.getItem("recentPrompts")) || [];
      const trimmed = prompt.trim();
      const newSet = [trimmed, ...existing.filter((p) => p !== trimmed)].slice(
        0,
        5
      );
      localStorage.setItem("recentPrompts", JSON.stringify(newSet));
      // Do not sync localStorage back into currentMessages; we maintain full conversation here
      if (!firstPromptDone) {
        setFirstPromptDone(true);
        localStorage.setItem("firstPromptDone", "true");
      }

      try {
        // Build conversation context for better responses
        const conversationHistory = currentMessages.slice(-10); // Last 10 messages for context
        const contextPrompt =
          conversationHistory.length > 0
            ? `Previous conversation context:\n${conversationHistory
                .map(
                  (msg) =>
                    `${msg.sender === "user" ? "User" : "Assistant"}: ${
                      msg.text
                    }`
                )
                .join("\n")}\n\nCurrent question: ${prompt.trim()}`
            : prompt.trim();

        const res = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: contextPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          },
          {
            timeout: 30000, // 30 second timeout
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const geminiResponse =
          res.data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No response received.";

        // Check for potential issues with the response
        if (res.data.candidates?.[0]?.finishReason === "SAFETY") {
          throw new Error("Response was blocked due to safety filters.");
        }

        const botMessage = {
          sender: "bot",
          text: geminiResponse,
          timestamp: new Date().toISOString(),
        };

        setCurrentMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        console.error("Error details:", err);

        let errorMessage = "Sorry, I encountered an error. Please try again.";

        if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
          errorMessage =
            "Request timed out. Please check your internet connection and try again.";
        } else if (err.response?.status === 429) {
          errorMessage =
            "Too many requests. Please wait a moment and try again.";
        } else if (err.response?.status === 400) {
          errorMessage = "Invalid request. Please rephrase your question.";
        } else if (err.response?.status === 403) {
          errorMessage = "API access denied. Please check your API key.";
        } else if (err.message.includes("safety")) {
          errorMessage =
            "Your message was blocked by safety filters. Please rephrase your question.";
        }

        setCurrentMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: errorMessage,
            isError: true,
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setPrompt("");
        setIsTyping(false);
      }
    }
  };

  // Enhanced microphone functionality
  const handleMicClick = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onstart = () => setIsRecording(true);

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      setIsRecording(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      if (event.error === "no-speech") {
        alert("No speech detected. Please try again.");
      } else if (event.error === "network") {
        alert("Network error. Please check your internet connection.");
      }
    };

    recognitionRef.current.onend = () => setIsRecording(false);

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      setIsRecording(false);
    }
  };

  // Handle input changes with better validation
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 2000) {
      // Limit input length
      setPrompt(value);
    }
  };

  // Handle paste events
  const handlePaste = (e) => {
    const paste = (e.clipboardData || window.clipboardData).getData("text");
    if (paste.length > 2000) {
      e.preventDefault();
      alert("Pasted text is too long. Please keep it under 2000 characters.");
    }
  };

  const newChat = () => {
    if (currentMessages.length > 0) {
      const sessionRecord = {
        id: sessionId,
        startedAt: sessionStartedAt || Date.now(),
        endedAt: Date.now(),
        messages: currentMessages,
      };
      setChatHistory((prev) => {
        const next = [...prev, sessionRecord];
        return next;
      });
    }
    setCurrentMessages([]);
    setSessionStartedAt(null);
    setSessionId(
      `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
    );
  };

  return (
    <div className="bg-black text-white flex h-screen">
      <SidebarOnHover
        onAddClick={newChat}
        chatHistory={chatHistory}
        onOpenChange={(open) => setIsSidebarOpen(open)}
        link={"https://explified.com/expli/"}
        toolName={"Expli"}
      />
      <div className="flex-1 flex flex-col items-center justify-center mt-12 w-screen">
        <div
          className={`fixed top-4 z-40 transition-all duration-300 ${
            isSidebarOpen ? "left-72" : "left-8"
          }`}
        ></div>
        {/* Session Controls */}

        <div className="w-full max-w-3xl mx-auto rounded-xl border border-cyan-900/60 shadow-[0_0_0_1px_rgba(0,255,255,0.06),0_0_24px_rgba(0,255,255,0.07)] bg-transparent p-4 sm:p-5 flex flex-col min-h-[70vh]">
          <div
            ref={chatContainerRef}
            className="flex-1 w-full flex flex-col px-2 sm:px-3 overflow-y-auto scroll-smooth"
            style={{
              scrollBehavior: "smooth",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          >
            {currentMessages.length === 0 && (
              <h1 className="text-2xl md:text-3xl font-medium mb-4 text-center text-gray-200">
                Ask anything.
              </h1>
            )}
            <div className="w-full flex flex-col gap-4 ">
              {currentMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`px-4 py-3 rounded-lg text-sm break-words whitespace-pre-wrap text-gray-200 border ${
                    msg.isError
                      ? "border-red-500/50 bg-red-500/5"
                      : "border-cyan-900/50 bg-cyan-900/10 shadow-[0_0_12px_rgba(0,255,255,0.04)]"
                  }`}
                  style={{
                    alignSelf:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    maxWidth: "100%",
                    wordBreak: "break-word",
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        msg.sender === "bot" ? formatText(msg.text) : msg.text,
                    }}
                    style={{
                      lineHeight: "1.5",
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                    }}
                  />
                </div>
              ))}
              {isTyping && (
                <div className="self-start px-4 py-3 rounded-lg text-sm text-gray-300 bg-cyan-900/10 border border-cyan-900/50 shadow-[0_0_12px_rgba(0,255,255,0.05)]">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input bar - minimalist */}
          <div className="mt-3 rounded-xl border border-cyan-900/60 bg-transparent px-3 py-2 shadow-[0_0_0_1px_rgba(0,255,255,0.05),0_0_18px_rgba(0,255,255,0.06)]">
            <div className="flex items-center gap-3">
              {/* Input */}
              <input
                type="text"
                value={prompt}
                onChange={handleInputChange}
                onKeyDown={handleSubmit}
                onPaste={handlePaste}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent outline-none text-gray-200 placeholder-gray-500 text-sm px-2 py-2"
                disabled={isTyping}
                maxLength={2000}
              />

              {/* Right icon buttons */}
              <button
                type="button"
                onClick={!isTyping ? handleMicClick : undefined}
                className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                  isRecording
                    ? "border-red-500/40 bg-red-500/10"
                    : "border-cyan-900/60 hover:bg-cyan-900/10 shadow-[0_0_10px_rgba(0,255,255,0.05)]"
                }`}
                style={{ cursor: isTyping ? "not-allowed" : "pointer" }}
                title="Voice input"
              >
                <FiMic
                  className={`text-sm ${
                    isRecording ? "text-white" : "text-gray-300"
                  }`}
                />
              </button>
              <div className="w-9 h-9 rounded-lg border border-cyan-900/60 flex items-center justify-center hover:bg-cyan-900/10 shadow-[0_0_10px_rgba(0,255,255,0.05)]">
                <Sparkle className="text-xs text-gray-300" />
              </div>
              <button
                type="button"
                onClick={() => {
                  // trigger submit using Enter handler for consistency
                  if (prompt.trim()) {
                    handleSubmit({ key: "Enter" });
                  }
                }}
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-cyan-900/60 hover:bg-cyan-900/10 shadow-[0_0_10px_rgba(0,255,255,0.05)]"
                title="Send"
              >
                <FiSend className="text-gray-200" />
              </button>
            </div>
            {/* Actions below input */}
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={newChat}
                className="flex items-center gap-2 border border-cyan-900/60 hover:bg-cyan-900/10 shadow-[0_0_10px_rgba(0,255,255,0.05)] text-gray-200 px-3 py-1.5 rounded-lg text-xs"
                title="New chat"
              >
                <FiImage className="text-gray-300" />
                <span>Generate Image</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 border border-cyan-900/60 hover:bg-cyan-900/10 shadow-[0_0_10px_rgba(0,255,255,0.05)] text-gray-200 px-3 py-1.5 rounded-lg text-xs"
                title="Attach files"
              >
                <FiPaperclip className="text-gray-300" />
                <span>Attach Files</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Integrations button
      
      */}

      <div className="fixed bottom-6 right-6 z-40">
        <div
          className="relative"
          onMouseEnter={() => setIsHoveringIntegration(true)}
          onMouseLeave={() => setIsHoveringIntegration(false)}
        >
          {(showIntegrationHint || isHoveringIntegration) && (
            <div className="absolute -top-14 right-0 bg-[#191a1c] border border-[#2a2a2a] text-gray-200 text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              Integrate your own API key
              <div className="absolute -bottom-1 right-4 w-3 h-3 bg-[#191a1c] rotate-45 border-r border-b border-[#2a2a2a]" />
            </div>
          )}
          <button
            type="button"
            className="w-18 h-16 px-2 rounded-lg bg-[#191a1c] hover:bg-[#1f2023] border border-[#2a2a2a] text-gray-200 text-[10px] font-medium flex items-center justify-center shadow-lg"
            title="Integrations"
            onClick={() => setShowIntegrationsModal(true)}
          >
            Integrations
          </button>
        </div>
      </div>

      {showIntegrationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowIntegrationsModal(false)}
          />
          <div className="relative w-full max-w-2xl mx-4 bg-[#111213] border border-[#0f8b8d]/50 rounded-xl shadow-2xl p-5">
            <button
              aria-label="Close"
              onClick={() => setShowIntegrationsModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <FiX />
            </button>
            <h3 className="text-white text-xl font-semibold text-center">
              Integrations
            </h3>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => setIntegrationTab("my")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  integrationTab === "my"
                    ? "bg-teal-700 text-white"
                    : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                }`}
              >
                My key's
              </button>
              <button
                onClick={() => setIntegrationTab("add")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  integrationTab === "add"
                    ? "bg-teal-700 text-white"
                    : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                }`}
              >
                Add Key's
              </button>
            </div>

            <div className="mt-4 relative">
              <input
                type="text"
                value={integrationSearch}
                onChange={(e) => setIntegrationSearch(e.target.value)}
                placeholder="Search ..."
                className="w-full bg-black/30 border border-[#2a2a2a] rounded-lg pl-3 pr-9 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
              {INTEGRATION_PROVIDERS.filter((p) => {
                const matchesTab =
                  integrationTab === "my" ? Boolean(providerKeys[p.id]) : true;
                const q = integrationSearch.trim().toLowerCase();
                const matchesQuery = p.name.toLowerCase().includes(q);
                return matchesTab && matchesQuery;
              }).map((p) => (
                <div key={p.id} className="flex flex-col items-center gap-2">
                  <div className="w-full h-20 bg-gray-300 rounded-md" />
                  <span className="text-sm text-gray-200">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Drawer (if needed later) */}
      {/* {isDrawerOpen && (
        <div className="absolute top-0 right-0 w-64 h-full bg-[#1e1e1e] p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Tools</h2>
            <FiX className="cursor-pointer" onClick={() => {}} />
          </div>
        </div>
      )} */}

      {/* Drawer (if needed later) */}
      {/* {isDrawerOpen && (
        <div className="absolute top-0 right-0 w-64 h-full bg-[#1e1e1e] p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Tools</h2>
            <FiX className="cursor-pointer" onClick={() => {}} />
          </div>
        </div>
      )} */}

      {/* Drawer (if needed later) */}
      {/* {isDrawerOpen && (
        <div className="absolute top-0 right-0 w-64 h-full bg-[#1e1e1e] p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Tools</h2>
            <FiX className="cursor-pointer" onClick={() => {}} />
          </div>
        </div>
      )} */}
    </div>
  );
}

export default Trone;
