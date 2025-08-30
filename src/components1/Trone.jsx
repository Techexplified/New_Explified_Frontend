import { useState, useEffect, useRef } from "react";
import { FiX, FiSearch, FiChevronDown } from "react-icons/fi";
import axios from "axios";
import { useLocation } from "react-router-dom";
import SidebarOnHover from "../reusable_components/SidebarOnHover";
import { Lock } from "lucide-react";
import {
  INTEGRATION_PROVIDERS,
  PROVIDER_DOC_URL,
  PROVIDER_HELP_STEPS,
} from "../utils/data/TroneData";
import ExpliInput from "../expli/ExpliInput";
import ExpliIntegration from "../expli/ExpliIntegration";

function Trone() {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const raw = localStorage.getItem("trone_chat_sessions");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.log(e);
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

  // Voice recognition
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [providerKeys, setProviderKeys] = useState(() => {
    try {
      const raw = localStorage.getItem("provider_keys");
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.log(e);
      return {};
    }
  });

  const [currentTool, setCurrentTool] = useState("gemini");

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
      console.log(e);
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
    <div className="bg-black relative text-white h-screen">
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
      <div className="flex-1 flex flex-col items-center justify-center pt-12 w-screen">
        <div
          className={`fixed top-4 z-40 transition-all duration-300 ${
            isSidebarOpen ? "left-72" : "left-8"
          }`}
        ></div>

        <h1 className="text-2xl font-bold text-left w-full max-w-4xl mx-auto px-2 bg-gradient-to-r from-teal-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent mb-4">
          Expli(+)
        </h1>

        <div className="w-full max-w-4xl mx-auto rounded-xl border border-cyan-900/60 shadow-[0_0_0_1px_rgba(0,255,255,0.06),0_0_24px_rgba(0,255,255,0.07)] bg-transparent p-4 sm:p-5 flex gap-4 min-h-[80vh] relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 rounded-xl opacity-50 pointer-events-none bg-gradient-to-br from-black  to-black"></div>

          {/* Chat Container */}
          <div
            ref={chatContainerRef}
            className="flex-1 w-full flex flex-col px-2 sm:px-3 overflow-y-auto scroll-smooth relative z-10 border border-gray-600 rounded-xl"
            style={{
              scrollBehavior: "smooth",
              paddingTop: "0",
              paddingBottom: "1rem",
            }}
          >
            <h1 className="text-2xl border-b border-gray-600 mb-4 py-2">
              Expli
            </h1>
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

          {/* Chat Container */}
          <div
            ref={chatContainerRef}
            className="flex-1 w-full flex flex-col px-2 sm:px-3 overflow-y-auto scroll-smooth relative z-10 border border-gray-600 rounded-xl"
            style={{
              scrollBehavior: "smooth",
              paddingTop: "0",
              paddingBottom: "1rem",
            }}
          >
            <h1 className="text-2xl border-b border-gray-600 mb-4 py-2">
              Gemini
            </h1>
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
        </div>
      </div>

      <ExpliInput
        prompt={prompt}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handlePaste={handlePaste}
        isTyping={isTyping}
        handleMicClick={handleMicClick}
        isRecording={isRecording}
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        providerKeys={providerKeys}
      />

      <ExpliIntegration
        currentTool={currentTool}
        providerKeys={providerKeys}
        setProviderKeys={setProviderKeys}
      />
    </div>
  );
}

export default Trone;
