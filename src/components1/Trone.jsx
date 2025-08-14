import { FiPlus, FiMic, FiSliders, FiX } from "react-icons/fi";
import { BsSoundwave } from "react-icons/bs";
import { useState } from "react";

function Trone() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // controls sidebar visibility

  return (
    <div className="bg-black text-white flex h-screen">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col items-center justify-center flex-grow px-4">
          <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-center">
            Ready when you are.
          </h1>

          {/* Input + Icons */}
          <div className="w-full max-w-2xl bg-[#1e1e1e] rounded-2xl shadow-md px-4 py-2">
            <input
              type="text"
              placeholder="Ask anything"
              className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-400 text-sm px-2 py-3"
            />

            <div className="flex items-center justify-between mt-2 text-gray-400">
              {/* Left icons */}
              <div className="flex items-center gap-2">
                <FiSliders className="text-lg" />
                <span className="text-sm">Tools</span>
              </div>

              {/* Right icons */}
              <div className="flex items-center gap-4">
                <FiMic className="text-lg" />
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                  <BsSoundwave className="text-base" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trone;
import React, { useState, useEffect, useRef } from "react";
import { FiPlus, FiMic, FiSliders, FiX } from "react-icons/fi";
import { BsSoundwave } from "react-icons/bs";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarOnHover from "../reusable_components/SidebarOnHover";
function Trone({ onFirstPrompt }) {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
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

  useEffect(() => {
    if (!prevDrawerState.current && isDrawerOpen) {
      setFirstPromptDone(false);
      localStorage.setItem("firstPromptDone", "false");
      setChatHistory([]);
      setPrompt("");
    }
    prevDrawerState.current = isDrawerOpen;
  }, [isDrawerOpen]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const GEMINI_API_KEY = "AIzaSyCjxEkSZKRdCohde0z5FKaZAO624gF3wms";

  useEffect(() => {
    if (reset) {
      setChatHistory([]);
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
      setChatHistory((prev) => [...prev, userMessage]);
      setIsTyping(true);

      if (!firstPromptDone) {
        const existing =
          JSON.parse(localStorage.getItem("recentPrompts")) || [];
        const newSet = [prompt.trim(), ...existing.slice(0, 4)];
        localStorage.setItem("recentPrompts", JSON.stringify(newSet));
        setFirstPromptDone(true);
        localStorage.setItem("firstPromptDone", "true");
      }

      try {
        // Build conversation context for better responses
        const conversationHistory = chatHistory.slice(-10); // Last 10 messages for context
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

        setChatHistory((prev) => [...prev, botMessage]);
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

        setChatHistory((prev) => [
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

  return (
    <div className="bg-black text-white flex h-screen">
      <SidebarOnHover
        link={"https://explified.com/expli/"}
        toolName={"Expli"}
      />
      <div className="flex-1 flex flex-col">
        {/* Chat history */}
        <div
          ref={chatContainerRef}
          className="flex flex-col items-center justify-center flex-grow px-4 overflow-y-auto scroll-smooth"
          style={{ scrollBehavior: "smooth" }}
        >
          {chatHistory.length === 0 && (
            <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-center">
              Ready when you are.
            </h1>
          )}
          <div className="w-full max-w-2xl flex flex-col gap-4">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`max-w-xl px-4 py-3 rounded-xl text-sm ${
                  msg.sender === "user"
                    ? "bg-[#2d2d2d] self-end text-right"
                    : msg.isError
                    ? "bg-red-900/30 self-start text-left border border-red-500/50"
                    : "bg-[#1e1e1e] self-start text-left"
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      msg.sender === "bot" ? formatText(msg.text) : msg.text,
                  }}
                  style={{
                    lineHeight: "1.5",
                    wordBreak: "break-word",
                  }}
                />
              </div>
            ))}
            {isTyping && (
              <div className="bg-[#1e1e1e] self-start px-4 py-3 rounded-xl text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
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

        {/* Input bar */}
        <div className="w-full mt-10 max-w-2xl mx-auto bg-[#1e1e1e] rounded-full shadow-md px-4 py-2 mb-6">
          <div className="flex items-center justify-between text-gray-400">
            {/* Left icons */}
            <div className="flex items-center gap-2">
              <FiPlus className="text-lg cursor-pointer" />
            </div>

            {/* Input */}
            <input
              type="text"
              value={prompt}
              onChange={handleInputChange}
              onKeyDown={handleSubmit}
              onPaste={handlePaste}
              placeholder="Ask anything"
              className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-400 text-sm px-2 py-3"
              disabled={isTyping}
              maxLength={2000}
            />
            {/* Input */}
            {/* <input
              type="text"
              value={prompt}
              onChange={handleInputChange}
              onKeyDown={handleSubmit}
              onPaste={handlePaste}
              placeholder="Ask anything"
              className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-400 text-sm px-2 py-3"
              disabled={isTyping}
              maxLength={2000}
            /> */}

            {/* Right icons */}
            <div className="flex items-center gap-4">
              <FiMic
                className={`text-lg cursor-pointer transition-colors ${
                  isRecording
                    ? "text-red-500"
                    : isTyping
                    ? "text-gray-600"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={!isTyping ? handleMicClick : undefined}
                style={{ cursor: isTyping ? "not-allowed" : "pointer" }}
              />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isRecording ? "bg-red-600 animate-pulse" : "bg-[#2a2a2a]"
                }`}
              >
                <BsSoundwave className="text-base" />
              </div>
            </div>
          </div>
        </div>
      </div>

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
