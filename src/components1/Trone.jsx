import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import SidebarOnHover from "../reusable_components/SidebarOnHover";
import ExpliInput from "../expli/ExpliInput";
import ExpliIntegration from "../expli/ExpliIntegration";
import ChatContainer from "../expli/ChatContainer";

function Trone() {
  const [prompt, setPrompt] = useState("");
  const [enabledProviders, setEnabledProviders] = useState({
    expli: true,
    openai: true,
    gemini: true,
  });
  const [isTyping, setIsTyping] = useState({
    expli: false,
    openai: false,
    gemini: false,
  });

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
  const [currentMessagesOpenAI, setCurrentMessagesOpenAI] = useState([]); // active session messages
  const [currentMessagesGemini, setCurrentMessagesGemini] = useState([]); // active session messages
  const [sessionId, setSessionId] = useState(
    () =>
      `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  );
  const [sessionStartedAt, setSessionStartedAt] = useState(null);

  // const [isTyping, setIsTyping] = useState(false);
  const [firstPromptDone, setFirstPromptDone] = useState(
    localStorage.getItem("firstPromptDone") === "true"
  );

  const location = useLocation();
  const { isDrawerOpen = true, reset = false } = location.state || {};
  const prevDrawerState = useRef(isDrawerOpen);

  // Voice recognition
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
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

  console.log(providerKeys);

  const [currentTool, setCurrentTool] = useState("default");

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

  // Removed auto-syncing current messages from localStorage to prevent overwriting sessions

  useEffect(() => {
    if (reset) {
      setCurrentMessages([]);
      setFirstPromptDone(false);
      setPrompt("");
    }
  }, [reset]);

  // Enhanced submit handler with better error handling and conversation context
  const handleSubmit = async (e) => {
    if (e.key === "Enter" && prompt.trim() !== "") {
      const userMessage = { sender: "user", text: prompt.trim() };
      if (currentMessages.length === 0) {
        setSessionStartedAt(Date.now());
      }
      setCurrentMessages((prev) => [...prev, userMessage]);
      setCurrentMessagesOpenAI((prev) => [...prev, userMessage]);
      setCurrentMessagesGemini((prev) => [...prev, userMessage]);
      // setIsTyping(true);

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

        if (tool === "default" && enabledProviders.expli) {
          await handleDefault(userMessage, contextPrompt);
        }
        if (providerKeys?.gemini && enabledProviders.gemini) {
          await handleGemini(contextPrompt);
        }
        if (providerKeys?.openai && enabledProviders.openai) {
          await handleOpenAI(contextPrompt);
        }
      } catch (err) {
        console.error("Error details:", err);
      } finally {
        setPrompt("");
        // setIsTyping(false);
      }
    }
  };
  const handleDefault = async (userMessage, contextPrompt) => {
    setIsTyping((prev) => ({ ...prev, expli: true }));
    try {
      let apiUrl = "";
      let payload = {};
      let headers = { "Content-Type": "application/json" };
      let parseResponse = () => "No response received.";

      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
        import.meta.env.VITE_TRONE_GEMINI_API_KEY
      }`;
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
        errorMessage = "Too many requests. Please wait a moment and try again.";
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
      setIsTyping((prev) => ({ ...prev, expli: false }));
    }
  };
  const handleOpenAI = async (contextPrompt) => {
    setIsTyping((prev) => ({ ...prev, openai: true }));
    try {
      let apiUrl = "";
      let payload = {};
      let headers = { "Content-Type": "application/json" };
      let parseResponse = () => "No response received.";

      apiUrl = "https://api.openai.com/v1/chat/completions";
      headers["Authorization"] = `Bearer ${providerKeys?.openai}`;
      payload = {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: contextPrompt }],
      };
      parseResponse = (data) =>
        data.choices?.[0]?.message?.content || "No response received.";

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

      setCurrentMessagesOpenAI((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error details:", err);
      let errorMessage = "Sorry, I encountered an error. Please try again.";

      if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
        errorMessage =
          "Request timed out. Please check your internet connection and try again.";
      } else if (err.response?.status === 429) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      } else if (err.response?.status === 400) {
        errorMessage = "Invalid request. Please rephrase your question.";
      } else if (err.response?.status === 403) {
        errorMessage = "API access denied. Please check your API key.";
      } else if (err.message.includes("safety")) {
        errorMessage =
          "Your message was blocked by safety filters. Please rephrase your question.";
      }

      setCurrentMessagesOpenAI((prev) => [
        ...prev,
        {
          sender: "bot",
          text: errorMessage,
          isError: true,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping((prev) => ({ ...prev, openai: false }));
    }
  };
  const handleGemini = async (contextPrompt) => {
    setIsTyping((prev) => ({ ...prev, gemini: true }));
    try {
      let apiUrl = "";
      let payload = {};
      let headers = { "Content-Type": "application/json" };
      let parseResponse = () => "No response received.";

      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${providerKeys?.gemini}`;
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

      setCurrentMessagesGemini((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error details:", err);
      let errorMessage = "Sorry, I encountered an error. Please try again.";

      if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
        errorMessage =
          "Request timed out. Please check your internet connection and try again.";
      } else if (err.response?.status === 429) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      } else if (err.response?.status === 400) {
        errorMessage = "Invalid request. Please rephrase your question.";
      } else if (err.response?.status === 403) {
        errorMessage = "API access denied. Please check your API key.";
      } else if (err.message.includes("safety")) {
        errorMessage =
          "Your message was blocked by safety filters. Please rephrase your question.";
      }

      setCurrentMessagesGemini((prev) => [
        ...prev,
        {
          sender: "bot",
          text: errorMessage,
          isError: true,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping((prev) => ({ ...prev, gemini: false }));
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

        <div className="w-full max-w-5xl mx-auto rounded-xl border border-cyan-900/60 shadow-[0_0_0_1px_rgba(0,255,255,0.06),0_0_24px_rgba(0,255,255,0.07)] bg-transparent p-4 sm:p-5 flex gap-4 min-h-[80vh] relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 rounded-xl opacity-50 pointer-events-none bg-gradient-to-br from-black  to-black"></div>

          {/* Chat Container */}
          <ChatContainer
            messages={currentMessages}
            isTyping={isTyping.expli}
            toolName="Expli"
            enabled={enabledProviders.expli}
            setEnabled={(val) =>
              setEnabledProviders((prev) => ({ ...prev, expli: val }))
            }
          />

          {/* Chat Container */}
          {providerKeys?.openai && (
            <ChatContainer
              messages={currentMessagesOpenAI}
              isTyping={isTyping.openai}
              toolName="OpenAI"
              enabled={enabledProviders.openai}
              setEnabled={(val) =>
                setEnabledProviders((prev) => ({ ...prev, openai: val }))
              }
            />
          )}

          {/* Chat Container */}
          {providerKeys?.gemini && (
            <ChatContainer
              messages={currentMessagesGemini}
              isTyping={isTyping.gemini}
              toolName="Gemini"
              enabled={enabledProviders.gemini}
              setEnabled={(val) =>
                setEnabledProviders((prev) => ({ ...prev, gemini: val }))
              }
            />
          )}
        </div>
      </div>

      <ExpliInput
        prompt={prompt}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handlePaste={handlePaste}
        isTyping={isTyping.expli}
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
