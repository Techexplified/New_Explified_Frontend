import React, { useState, useEffect, useRef } from "react";
import {
  FiPlus,
  FiMic,
  FiSliders,
  FiX,
  FiSend,
  FiImage,
  FiPaperclip,
} from "react-icons/fi";
import { BsSoundwave } from "react-icons/bs";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarOnHover from "../reusable_components/SidebarOnHover";
import { Sparkle } from "lucide-react";

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
  const showIntegrationHint = true;
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);
  const [customApiKey, setCustomApiKey] = useState("");

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
        er
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
        >
          <button
            onClick={newChat}
            className="px-3 py-1 mt-5 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700"
          >
            New Chat
          </button>
        </div>
        {/* Session Controls */}

        <div className="w-full max-w-3xl mx-auto bg-gray-800/40 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col min-h-[70vh]">
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
              <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-center text-white">
                Ready when you are.
              </h1>
            )}
            <div className="w-full flex flex-col gap-4 ">
              {currentMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`px-4 py-3 rounded-xl text-sm break-words whitespace-pre-wrap text-white`}
                  style={{
                    backgroundColor:
                      msg.sender === "user"
                        ? "#2d2d2d"
                        : msg.isError
                        ? "rgba(255, 0, 0, 0.1)"
                        : "#1e1e1e",
                    alignSelf:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    border: msg.isError && "1px solid rgba(255,0,0,0.5)",
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
                <div className="bg-[#1e1e1e] self-start px-4 py-3 rounded-xl text-sm text-gray-300">
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

          {/* Input bar inside box - styled like the reference */}
          <div className="mt-4 bg-[#111213] rounded-2xl border border-[#222] px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Input */}
              <input
                type="text"
                value={prompt}
                onChange={handleInputChange}
                onKeyDown={handleSubmit}
                onPaste={handlePaste}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent outline-none text-gray-200 placeholder-gray-400 text-sm px-2 py-2"
                disabled={isTyping}
                maxLength={2000}
              />

              {/* Right icon buttons */}
              <button
                type="button"
                onClick={!isTyping ? handleMicClick : undefined}
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isRecording ? "bg-red-600" : "bg-[#191a1c] hover:bg-[#1f2023]"
                }`}
                style={{ cursor: isTyping ? "not-allowed" : "pointer" }}
                title="Voice input"
              >
                <FiMic
                  className={`text-base ${
                    isRecording ? "text-white" : "text-gray-300"
                  }`}
                />
              </button>
              <div className="w-10 h-10 rounded-xl bg-[#191a1c] flex items-center justify-center">
                <Sparkle className="text-sm text-gray-300" />
              </div>
              <button
                type="button"
                onClick={() => {
                  // trigger submit using Enter handler for consistency
                  if (prompt.trim()) {
                    handleSubmit({ key: "Enter" });
                  }
                }}
                className="w-10 h-10 rounded-xl bg-[#166876] hover:bg-[#144645] flex items-center justify-center"
                title="Send"
              >
                <FiSend className="text-white" />
              </button>
            </div>
            {/* Actions below input */}
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={newChat}
                className="flex items-center gap-2 bg-[#191a1c] hover:bg-[#1f2023] text-gray-200 px-3 py-2 rounded-lg text-xs"
                title="New chat"
              >
                <FiImage className="text-gray-300" />
                <span>Generate Image</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 bg-[#191a1c] hover:bg-[#1f2023] text-gray-200 px-3 py-2 rounded-lg text-xs"
                title="Attach files"
              >
                <FiPaperclip className="text-gray-300" />
                <span>Attach Files</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Integrations button */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative">
          {showIntegrationHint && (
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
          <div className="relative w-full max-w-md mx-4 bg-[#111213] border border-[#222] rounded-xl shadow-2xl p-5">
            <button
              aria-label="Close"
              onClick={() => setShowIntegrationsModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <FiX />
            </button>
            <h3 className="text-white text-lg font-semibold mb-3">
              Enter API key
            </h3>
            <input
              type="text"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="Paste your API key"
              className="w-full bg-black/30 border border-[#2a2a2a] rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-3 py-2 rounded-lg bg-[#191a1c] border border-[#2a2a2a] text-gray-200 hover:bg-[#1f2023]"
                onClick={() => setShowIntegrationsModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white"
                onClick={() => {
                  try {
                    localStorage.setItem("custom_api_key", customApiKey || "");
                  } catch (_) {}
                  setShowIntegrationsModal(false);
                }}
              >
                Save
              </button>
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