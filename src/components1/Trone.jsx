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
  FiStar,
  FiCpu,
  FiZap,
  FiLayers,
  FiCloud,
  FiGitBranch,
  FiChevronDown,
} from "react-icons/fi";
import { BsSoundwave } from "react-icons/bs";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarOnHover from "../reusable_components/SidebarOnHover";
import { Sparkle, Lock } from "lucide-react";

const INTEGRATION_PROVIDERS = [
  {
    id: "gemini",
    name: "Gemini",
    icon: FiStar,
    byok: true,
    description: "Google's Gemini models for text, chat and multimodal tasks.",
    apiUrl: "https://generativelanguage.googleapis.com/v1beta/", // Google AI Studio API
    docs: "https://ai.google.dev/gemini-api/docs",
  },
  {
    id: "openai",
    name: "OpenAI",
    icon: FiCpu,
    byok: true,
    description: "OpenAI GPT models for powerful text and chat experiences.",
    apiUrl: "https://api.openai.com/v1/",
    docs: "https://platform.openai.com/docs/api-reference",
  },
  {
    id: "grok",
    name: "Grok",
    icon: FiZap,
    byok: true,
    description: "xAI Grok models for reasoning and fast responses.",
    apiUrl: "https://api.x.ai/v1/", // xAI Grok API
    docs: "https://docs.x.ai/api",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    icon: FiLayers,
    byok: true,
    description: "Claude models by Anthropic for safe, helpful outputs.",
    apiUrl: "https://api.anthropic.com/v1/",
    docs: "https://docs.anthropic.com/claude/reference",
  },
  {
    id: "mistral",
    name: "Mistral",
    icon: FiCloud,
    byok: true,
    description: "Mistral small, medium and mixtral models.",
    apiUrl: "https://api.mistral.ai/v1/",
    docs: "https://docs.mistral.ai/",
  },
  {
    id: "cohere",
    name: "Cohere",
    icon: FiGitBranch,
    byok: true,
    description: "Cohere Command and Embed models for text and vectors.",
    apiUrl: "https://api.cohere.ai/v1/",
    docs: "https://docs.cohere.com/docs",
  },
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
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [selectedProviderKey, setSelectedProviderKey] = useState("");
  const [showProviderHelp, setShowProviderHelp] = useState(false);

  const PROVIDER_DOC_URL = {
    gemini: "https://ai.google.dev/",
    openai: "https://platform.openai.com/",
    grok: "https://x.ai/",
    anthropic: "https://console.anthropic.com/",
    mistral: "https://console.mistral.ai/",
    cohere: "https://dashboard.cohere.com/",
  };

  const PROVIDER_HELP_STEPS = {
    gemini: [
      "Go to Google AI Studio and sign in with your Google account.",
      "Create or open a project.",
      "Navigate to API keys from the left menu.",
      "Click 'Create API key' and copy the generated key.",
    ],
    openai: [
      "Go to OpenAI Platform and sign in.",
      "Open the 'View API keys' page from your profile.",
      "Click 'Create new secret key'.",
      "Copy the key. You won’t be able to see it again.",
    ],
    grok: [
      "Visit xAI (Grok) and sign in.",
      "Open the API dashboard.",
      "Create a new API key.",
      "Copy and store your key securely.",
    ],
    anthropic: [
      "Go to Anthropic Console and sign in.",
      "Open 'API Keys' in the left navigation.",
      "Click 'Create Key'.",
      "Copy your new Claude API key.",
    ],
    mistral: [
      "Open Mistral Console and log in.",
      "Go to 'API Keys'.",
      "Generate a new API key.",
      "Copy your key for use here.",
    ],
    cohere: [
      "Go to Cohere Dashboard and sign in.",
      "Open 'API Keys'.",
      "Create a new key if you don’t have one.",
      "Copy the key to your clipboard.",
    ],
  };

  const handleOpenProvider = (providerId) => {
    setSelectedProviderId(providerId);
    const existing = providerKeys?.[providerId] || "";
    setSelectedProviderKey(existing);
    setShowProviderHelp(false);
  };

  console.log(providerKeys);

  const handleSaveProviderKey = (providerId, useAfterSave = false) => {
    const next = { ...(providerKeys || {}), [providerId]: selectedProviderKey };
    try {
      localStorage.setItem("provider_keys", JSON.stringify(next));
    } catch (_) {}
    setProviderKeys(next);
    if (useAfterSave) {
      // optionally you can set active provider here if used elsewhere
      try {
        localStorage.setItem("active_provider", providerId);
      } catch (_) {}
    }
    setShowIntegrationsModal(false);
    setSelectedProviderId(null);
  };

  const [currentTool, setCurrentTool] = useState("gemini");
  const tools = [
    "default",
    "gemini",
    "openai",
    "grok",
    "anthropic",
    "mistral",
    "cohere",
  ];

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

  const GEMINI_API_KEY = "AIzaSyDpCjw13DKuj-KDH8VWegWh0BzVgdoJmjU";

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

      // Persist to recentPrompts
      const existing = JSON.parse(localStorage.getItem("recentPrompts")) || [];
      const trimmed = prompt.trim();
      const newSet = [trimmed, ...existing.filter((p) => p !== trimmed)].slice(
        0,
        5
      );
      localStorage.setItem("recentPrompts", JSON.stringify(newSet));
      if (!firstPromptDone) {
        setFirstPromptDone(true);
        localStorage.setItem("firstPromptDone", "true");
      }

      try {
        // Conversation context
        const conversationHistory = currentMessages.slice(-10);
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

        const tool = currentTool;
        const apiKey = providerKeys[tool] || "";

        if (!apiKey && tool !== "default")
          throw new Error(`No API key found for ${tool}.`);

        let apiUrl = "";

        let payload = {};
        let headers = { "Content-Type": "application/json" };
        let parseResponse = () => "No response received.";

        if (tool === "default") {
          apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
          payload = {
            contents: [{ parts: [{ text: contextPrompt }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          };
          parseResponse = (data) =>
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response received.";
        } else if (tool === "gemini") {
          apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
          payload = {
            contents: [{ parts: [{ text: contextPrompt }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          };
          parseResponse = (data) =>
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response received.";
        } else if (tool === "openai") {
          apiUrl = "https://api.openai.com/v1/chat/completions";
          headers["Authorization"] = `Bearer ${apiKey}`;
          payload = {
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: contextPrompt }],
          };
          parseResponse = (data) =>
            data.choices?.[0]?.message?.content || "No response received.";
        } else if (tool === "grok") {
          apiUrl = "https://api.x.ai/v1/chat/completions";
          headers["Authorization"] = `Bearer ${apiKey}`;
          payload = {
            model: "grok-beta",
            messages: [{ role: "user", content: contextPrompt }],
          };
          parseResponse = (data) =>
            data.choices?.[0]?.message?.content || "No response received.";
        } else if (tool === "anthropic") {
          apiUrl = "https://api.anthropic.com/v1/messages";
          headers["x-api-key"] = apiKey;
          headers["anthropic-version"] = "2023-06-01";
          payload = {
            model: "claude-3-opus-20240229",
            max_tokens: 500,
            messages: [{ role: "user", content: contextPrompt }],
          };
          parseResponse = (data) =>
            data.content?.[0]?.text || "No response received.";
        } else if (tool === "cohere") {
          apiUrl = "https://api.cohere.ai/v1/chat";
          headers["Authorization"] = `Bearer ${apiKey}`;
          payload = {
            model: "command-r-plus",
            messages: [{ role: "user", content: contextPrompt }],
          };
          parseResponse = (data) =>
            data.text || data.message?.content || "No response received.";
        } else if (tool === "mistral") {
          apiUrl = "https://api.mistral.ai/v1/chat/completions";
          headers["Authorization"] = `Bearer ${apiKey}`;
          payload = {
            model: "mistral-medium",
            messages: [{ role: "user", content: contextPrompt }],
          };
          parseResponse = (data) =>
            data.choices?.[0]?.message?.content || "No response received.";
        }

        const res = await axios.post(apiUrl, payload, {
          timeout: 30000,
          headers,
        });

        const botText = parseResponse(res.data);

        if (res.data.candidates?.[0]?.finishReason === "SAFETY") {
          throw new Error("Response was blocked due to safety filters.");
        }

        const botMessage = {
          sender: "bot",
          text: botText,
          timestamp: new Date().toISOString(),
        };

        setCurrentMessages((prev) => [...prev, botMessage]);

        const sessionRecord = {
          id: sessionId,
          startedAt: sessionStartedAt || Date.now(),
          endedAt: Date.now(),
          messages: [userMessage, botMessage],
        };
        setChatHistory((prev) => {
          const next = [...prev, sessionRecord];
          return next.slice(-3);
        });
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
    setCurrentMessages([]);
    setSessionStartedAt(null);
    setSessionId(
      `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
    );
  };

  return (
    <div className="bg-black text-white flex h-screen">
      <div className="absolute inset-0 rounded-xl opacity-30 pointer-events-none bg-gradient-to-br from-transparent via-cyan-500 to-transparent"></div>
      <SidebarOnHover
        onAddClick={newChat}
        chatHistory={chatHistory}
        setCurrentMessages={setCurrentMessages}
        onOpenChange={(open) => setIsSidebarOpen(open)}
        link={"https://explified.com/expli/"}
        toolName={"Expli(+)"}
        tools={providerKeys}
        setCurrentTool={setCurrentTool}
      />
      <div className="flex-1 flex flex-col items-center justify-center mt-12 w-screen">
        <div
          className={`fixed top-4 z-40 transition-all duration-300 ${
            isSidebarOpen ? "left-72" : "left-8"
          }`}
        ></div>

        {/* Session Controls */}
        <h1 className="text-2xl font-bold text-left w-full max-w-3xl mx-auto px-2 bg-gradient-to-r from-teal-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent mb-4">
          Expli(+)
        </h1>

        <div className="w-full max-w-3xl mx-auto rounded-xl border border-cyan-900/60 shadow-[0_0_0_1px_rgba(0,255,255,0.06),0_0_24px_rgba(0,255,255,0.07)] bg-transparent p-4 sm:p-5 flex flex-col min-h-[80vh] relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 rounded-xl opacity-50 pointer-events-none bg-gradient-to-br from-black  to-black"></div>

          {/* Chat Container */}
          <div
            ref={chatContainerRef}
            className="flex-1 w-full flex flex-col px-2 sm:px-3 overflow-y-auto scroll-smooth relative z-10"
            style={{
              scrollBehavior: "smooth",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          >
            {/* Welcome Header */}
            {currentMessages.length === 0 && (
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-white to-cyan-400 bg-clip-text text-transparent ">
                  Ask anything.
                </h1>
                {/* <p className="text-gray-400 text-sm">
                  Powered by advanced AI • Always here to help
                </p> */}
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-minimal-primary to-transparent mx-auto mt-4 rounded-full"></div>
              </div>
            )}

            {/* Messages Container */}
            <div className="w-full flex flex-col gap-6">
              {currentMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`transform transition-all duration-300 ease-out ${
                    msg.sender === "user" ? "self-end" : "self-start"
                  } max-w-[85%]`}
                >
                  <div
                    className={`px-6 py-4 rounded-2xl text-sm break-words whitespace-pre-wrap backdrop-blur-sm shadow-lg border transition-all duration-300 hover:shadow-xl ${
                      msg.isError
                        ? "border-red-500/50 bg-red-500/10 text-red-200"
                        : msg.sender === "user"
                        ? "bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-white"
                        : "bg-gradient-to-br from-gray-900/80 to-gray-800/60 border-gray-700/50 text-gray-200"
                    }`}
                    style={{
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.sender === "bot" && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-minimal-primary rounded-full "></div>
                        <span className="text-minimal-primary text-xs font-medium">
                          AI Assistant
                        </span>
                      </div>
                    )}

                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          msg.sender === "bot"
                            ? formatText(msg.text)
                            : msg.text,
                      }}
                      style={{
                        lineHeight: "1.5",
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="self-start max-w-[85%]">
                  <div className="px-6 py-4 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-gray-700/50 backdrop-blur-sm shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:150ms]"></div>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:300ms]"></div>
                      </div>
                      <span className="text-gray-300 text-sm">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Input Section */}
          <div className="mt-6 relative z-10">
            {/* Main Input Container */}
            <div className="rounded-2xl border-2 border-cyan-500/20 bg-gradient-to-r from-gray-900/90 to-gray-800/80 backdrop-blur-lg shadow-2xl">
              <div className="p-4">
                {/* Input Field */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={prompt}
                      onChange={handleInputChange}
                      onKeyDown={handleSubmit}
                      onPaste={handlePaste}
                      placeholder="Type your message here..."
                      className="w-full bg-black/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                      disabled={isTyping}
                      maxLength={2000}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                      {prompt.length}/2000
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {/* Voice Input */}
                    <button
                      type="button"
                      onClick={!isTyping ? handleMicClick : undefined}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 group ${
                        isRecording
                          ? "border-red-500/40 bg-red-500/10"
                          : "bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 hover:from-cyan-500/30 hover:to-cyan-600/20 hover:shadow-lg hover:shadow-cyan-500/20"
                      }`}
                      style={{ cursor: isTyping ? "not-allowed" : "pointer" }}
                      title="Voice input"
                      disabled={isTyping}
                    >
                      <FiMic
                        className={`text-lg ${
                          isRecording ? "text-white" : "text-minimal-primary"
                        }`}
                      />
                    </button>

                    {/* Magic/Sparkle Button */}
                    <button className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30 flex items-center justify-center hover:from-cyan-500/30 hover:to-cyan-600/20 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 group">
                      <Sparkle className="text-lg text-minimal-primary" />
                    </button>

                    {/* Send Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (prompt.trim()) {
                          handleSubmit({ key: "Enter" });
                        }
                      }}
                      className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10  border border-cyan-500/30 flex items-center justify-center hover:from-cyan-500/30 hover:to-cyan-600/20 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 group"
                      title="Send"
                    >
                      <FiSend className="text-lg text-minimal-primary" />
                    </button>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Generate Image */}
                    <button
                      type="button"
                      onClick={newChat}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800/60 to-gray-700/40 border border-gray-600/40 hover:from-gray-700/80 hover:to-gray-600/60 text-gray-200 transition-all duration-300 group"
                      title="Generate Image"
                    >
                      <FiImage className="text-minimal-primary" />
                      <span className="text-sm font-medium">
                        Generate Image
                      </span>
                    </button>

                    {/* Attach Files */}
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800/60 to-gray-700/40 border border-gray-600/40 hover:from-gray-700/80 hover:to-gray-600/60 text-gray-200 transition-all duration-300 group"
                      title="Attach files"
                    >
                      <FiPaperclip className="text-minimal-primary" />
                      <span className="text-sm font-medium">Attach Files</span>
                    </button>
                  </div>

                  {/* Powered By Badge */}

                  <div className="flex items-center justify-center gap-2">
                    <p className=" text-sm text-gray-300">Powered by</p>

                    <select
                      value={currentTool}
                      onChange={(e) => setCurrentTool(e.target.value)}
                      className="bg-gray-800 py-1.5 px-3  rounded-full bg-gradient-to-r from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 text-xs sm:text-sm text-gray-200 backdrop-blur focus:outline-none"
                    >
                      <option
                        value="default"
                        className="text-gray-200 rounded-lg"
                      >
                        default
                      </option>
                      {Object.keys(providerKeys).map((tool) => (
                        <option
                          key={tool}
                          value={tool}
                          className="text-gray-200"
                        >
                          {tool}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
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
          <div
            className={`relative w-full ${
              showProviderHelp ? "max-w-3xl" : "max-w-2xl"
            } mx-4 bg-[#111213] border border-[#0f8b8d]/50 rounded-xl shadow-2xl p-5`}
          >
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

            {!selectedProviderId && (
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
            )}

            {!selectedProviderId && (
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
            )}

            {!selectedProviderId && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
                {INTEGRATION_PROVIDERS.filter((p) => {
                  const matchesTab =
                    integrationTab === "my"
                      ? Boolean(providerKeys[p.id])
                      : true;
                  const q = integrationSearch.trim().toLowerCase();
                  const matchesQuery = p.name.toLowerCase().includes(q);
                  return matchesTab && matchesQuery;
                }).map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.id}
                      className="bg-[#23b5b5] bg-opacity-20 border border-teal-400 rounded-xl p-5 hover:bg-opacity-40 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-500/30 relative group cursor-pointer"
                      onClick={() => handleOpenProvider(p.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                          {Icon && <Icon className="text-white" size={20} />}
                        </div>
                        <div className="flex">
                          {!(p.id === "openai" || p.id === "gemini") && (
                            <button
                              type="button"
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-200 transform hover:scale-110 shadow-lg"
                            >
                              <Lock className="text-yellow-400" size={20} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenProvider(p.id);
                              setCurrentTool(p.id);
                            }}
                            className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white transition-all duration-200 transform hover:scale-110 shadow-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-teal-300 transition-colors flex items-center gap-2">
                        {p.name}
                        {p.byok && (
                          <span className="bg-black text-white text-[10px] px-2 py-[2px] rounded-md border border-gray-500">
                            BYOK
                          </span>
                        )}
                      </h3>

                      <p className="text-gray-300 text-xs leading-relaxed mb-1">
                        {p.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedProviderId && (
              <div className="mt-6">
                {(() => {
                  const provider = INTEGRATION_PROVIDERS.find(
                    (p) => p.id === selectedProviderId
                  );
                  const Icon = provider?.icon;
                  return (
                    <div>
                      <button
                        className="text-xs text-gray-300 hover:text-white mb-4"
                        onClick={() => setSelectedProviderId(null)}
                      >
                        ← Back
                      </button>

                      <div className="flex items-center gap-2 mb-3">
                        {Icon && (
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center"
                            style={{ background: "#23b5b5" }}
                          >
                            <Icon className="text-black/80" size={18} />
                          </div>
                        )}
                        <h4 className="text-white text-base font-semibold">
                          {provider?.name}
                        </h4>
                      </div>

                      <label className="block text-xs text-gray-400 mb-1">
                        API Key
                      </label>
                      <input
                        type="text"
                        value={selectedProviderKey}
                        onChange={(e) => setSelectedProviderKey(e.target.value)}
                        placeholder={`Enter ${provider?.name} API key`}
                        className="w-full bg-black/30 border border-[#2a2a2a] rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-600"
                      />

                      <div className="mt-2 flex items-center justify-between">
                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300"
                          onClick={() => setShowProviderHelp((v) => !v)}
                          aria-expanded={showProviderHelp}
                        >
                          <span>Don't have a key?</span>
                          <FiChevronDown
                            className={`transition-transform ${
                              showProviderHelp ? "rotate-180" : "rotate-0"
                            }`}
                            size={14}
                          />
                        </button>
                      </div>

                      <div
                        className={`mt-3 overflow-hidden transition-all duration-300 ease-in-out ${
                          showProviderHelp
                            ? "max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                        aria-hidden={!showProviderHelp}
                      >
                        <div className="border border-[#2a2a2a] rounded-lg p-3 bg-black/20">
                          <div className="flex items-center gap-2 mb-2">
                            {Icon && (
                              <div
                                className="w-6 h-6 rounded-md flex items-center justify-center"
                                style={{ background: "#23b5b5" }}
                              >
                                <Icon className="text-black/80" size={14} />
                              </div>
                            )}
                            <h5 className="text-white text-sm font-medium">
                              How to get a key for {provider?.name}
                            </h5>
                          </div>
                          <ol className="list-decimal list-inside text-sm text-gray-200 space-y-2">
                            {(
                              PROVIDER_HELP_STEPS[selectedProviderId] || []
                            ).map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                          <div className="mt-2">
                            <a
                              href={PROVIDER_DOC_URL[selectedProviderId]}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-teal-400 hover:text-teal-300"
                            >
                              Open official docs →
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          className="px-3 py-2 rounded-lg bg-[#191a1c] border border-[#2a2a2a] text-gray-200 hover:bg-[#1f2023]"
                          onClick={() =>
                            handleSaveProviderKey(selectedProviderId, false)
                          }
                        >
                          Save
                        </button>
                        <button
                          className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white"
                          onClick={() => {
                            handleSaveProviderKey(selectedProviderId, true);
                            setCurrentTool(selectedProviderId);
                          }}
                        >
                          Save & Use
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
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
