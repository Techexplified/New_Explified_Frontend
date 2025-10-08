import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ExpliInput from "../expli/ExpliInput";
import ExpliIntegration from "../expli/ExpliIntegration";
import ChatContainer from "../expli/ChatContainer";
import { AiOutlineOpenAI } from "react-icons/ai";
import { RiGeminiLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import ExpliSidebar from "../expli/ExpliSidebar";
import IntegrationModal from "../expli/IntegrationModal";
import { Menu, X } from "lucide-react";

function Trone({
  providerKeys,
  setProviderKeys,
  showIntegrationsModal,
  setShowIntegrationsModal,
  sidebarPinned,
  isSidebarOpen,
  setSidebarPinned,
  setIsSidebarOpen,
}) {
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
  const [closedChats, setClosedChats] = useState(() => {
    try {
      const raw = localStorage.getItem("trone_closed_chats");
      return raw ? JSON.parse(raw) : { openai: false, gemini: false };
    } catch {
      return { openai: false, gemini: false };
    }
  });

  // const [selectedTool, setSelectedTool] = useState("expli");

  const [chatHistory, setChatHistory] = useState(() => {
    const raw = localStorage.getItem("expli_chat_sessions1");
    return raw ? JSON.parse(raw) : [];
  });

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

  // const [providerKeys, setProviderKeys] = useState(() => {
  //   try {
  //     const raw = localStorage.getItem("provider_keys");
  //     return raw ? JSON.parse(raw) : {};
  //   } catch (e) {
  //     console.log(e);
  //     return {};
  //   }
  // });

  const [currentTool, setCurrentTool] = useState("expli");
  const currentQaIdRef = useRef(null);

  // add a new qa object to chatHistory (either append to last session or create a new session)
  const pushNewQaToHistory = (qaObj, sessionActive) => {
    setChatHistory((prev) => {
      const updated = [...prev];
      if (sessionActive) {
        // append to last session (create one if none exists)
        if (updated.length === 0) {
          updated.push({
            id: sessionId,
            startAt: new Date().toISOString(),
            qa: [qaObj],
          });
        } else {
          const last = { ...updated[updated.length - 1] };
          last.qa = [...(last.qa || []), qaObj];
          updated[updated.length - 1] = last;
        }
        return updated;
      } else {
        // create a new session
        return [
          ...updated,
          {
            id: sessionId,
            startAt: new Date().toISOString(),
            qa: [qaObj],
          },
        ];
      }
    });
  };

  // attach a provider answer to the current qa in the current session
  const attachAnswerToCurrentQa = (tool, text) => {
    setChatHistory((prev) => {
      if (!prev || prev.length === 0 || !currentQaIdRef.current) {
        console.warn("No active QA to attach answer to");
        return prev;
      }

      const updated = [...prev];
      // find the session with the current sessionId
      let sessionIndex = updated.findIndex((s) => s.id === sessionId);
      if (sessionIndex === -1) sessionIndex = updated.length - 1;

      const session = { ...updated[sessionIndex] };
      session.qa = [...session.qa];

      // find current QA
      const qaIndex = session.qa.findIndex(
        (q) => q.id === currentQaIdRef.current
      );
      if (qaIndex === -1) {
        console.warn("No QA found for currentQaIdRef");
        return prev;
      }

      // append answer only
      const qa = { ...session.qa[qaIndex] };
      qa.answers = [...qa.answers, { tool, text }];
      session.qa[qaIndex] = qa;

      updated[sessionIndex] = session;
      return updated;
    });
  };

  useEffect(() => {
    try {
      localStorage.removeItem("expli_chat_sessions");
      localStorage.removeItem("trone_chat_sessions");
      localStorage.removeItem("trone_chat_sessions1");
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("trone_closed_chats", JSON.stringify(closedChats));
    } catch (err) {
      console.error("Failed to save closedChats:", err);
    }
  }, [closedChats]);

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
      localStorage.setItem("expli_chat_sessions1", JSON.stringify(chatHistory));
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

      let apiUrl = "";
      let payload = {};
      let headers = { "Content-Type": "application/json" };
      let parseResponse = () => "No response received.";

      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
        import.meta.env.VITE_TRONE_GEMINI_API_KEY
      }`;
      payload = {
        contents: [
          {
            parts: [
              {
                text: `Generate summary of this promt within 4-6 words.Return just the summerized text. ${prompt}`,
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
      };
      parseResponse = (data) =>
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received.";

      const res = await axios.post(apiUrl, payload, {
        timeout: 30000,
        headers,
      });

      const promptSummary = parseResponse(res.data);

      // inside handleSubmit, after you have promptSummary:
      const sessionActive = currentMessages.length > 0; // whether the chat container has messages

      // create qa object for this user prompt

      const qaId = crypto.randomUUID();
      currentQaIdRef.current = qaId;

      const newQa = {
        id: qaId,
        question: prompt.trim(),
        promptSummary,
        answers: [], // answers come later
        timestamp: new Date().toISOString(),
      };

      // push new QA into the chatHistory (append to last session if sessionActive)
      pushNewQaToHistory(newQa, sessionActive);

      // keep the qaId in a ref so provider handlers append to same QA
      currentQaIdRef.current = qaId;

      // now add the user message into provider-specific currentMessages as you already do
      if (enabledProviders.expli) {
        setCurrentMessages((prev) => [...prev, userMessage]);
      }
      if (enabledProviders.openai) {
        setCurrentMessagesOpenAI((prev) => [...prev, userMessage]);
      }
      if (enabledProviders.gemini) {
        setCurrentMessagesGemini((prev) => [...prev, userMessage]);
      }

      // then call your providers (await handleDefault / handleGemini / handleOpenAI ...)
      // after all awaits (i.e., in finally) clear prompt and currentQaIdRef
      // ...

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

        if (!apiKey && tool !== "expli")
          throw new Error(`No API key found for ${tool}.`);

        if (tool === "expli" && enabledProviders.expli) {
          await handleDefault(userMessage, contextPrompt, promptSummary);
        }
        if (
          providerKeys?.gemini &&
          enabledProviders.gemini &&
          !closedChats.gemini
        ) {
          await handleGemini(userMessage, contextPrompt, promptSummary);
        }
        if (
          providerKeys?.openai &&
          enabledProviders.openai &&
          !closedChats.openai
        ) {
          await handleOpenAI(userMessage, contextPrompt, promptSummary);
        }
      } catch (err) {
        console.error("Error details:", err);
      } finally {
        setPrompt("");
        // currentQaIdRef.current = null;
      }
    }
  };
  const handleDefault = async (userMessage, contextPrompt, promptSummary) => {
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

      // instead of the old setChatHistory logic, call:
      attachAnswerToCurrentQa("expli", botText);
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
  const handleOpenAI = async (userMessage, contextPrompt, promptSummary) => {
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

      attachAnswerToCurrentQa("openai", botText);
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
  const handleGemini = async (userMessage, contextPrompt, promptSummary) => {
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

      attachAnswerToCurrentQa("gemini", botText);
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
  const handleRemoveProvider = (providerId) => {
    const next = { ...(providerKeys || {}), [providerId]: "" };
    try {
      localStorage.setItem("provider_keys", JSON.stringify(next));
    } catch (err) {
      console.log(err);
    }
    setProviderKeys(next);
  };
  // True if Expli is the only open chat
  const onlyExpliOpen =
    (closedChats.openai || !providerKeys.openai) &&
    (closedChats.gemini || !providerKeys.gemini);

  return (
    <div className="flex relative text-white h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Animated Background with Multiple Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] animate-float-slower" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[100px] animate-pulse-slow" />

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Animated Scanline Effect */}
        <div
          className="absolute inset-0 opacity-[0.02] animate-scan"
          style={{
            background:
              "linear-gradient(transparent 50%, rgba(6, 182, 212, 0.1) 50%)",
            backgroundSize: "100% 4px",
          }}
        />
      </div>

      <button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className="absolute top-3 left-4 z-50 p-2 sm:hidden rounded-xl bg-gray-900/80 backdrop-blur-xl hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] group"
      >
        <span className="group-hover:text-cyan-400 transition-colors duration-300">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </span>
      </button>
      <ExpliSidebar
        onAddClick={newChat}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        setCurrentMessages={setCurrentMessages}
        setCurrentMessagesGemini={setCurrentMessagesGemini}
        setCurrentMessagesOpenAI={setCurrentMessagesOpenAI}
        link={"https://explified.com/expli/"}
        tools={providerKeys}
        closedChats={closedChats}
        setClosedChats={setClosedChats}
        handleRemoveProvider={handleRemoveProvider}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        sidebarPinned={sidebarPinned}
        setSidebarPinned={setSidebarPinned}
      />

      <div className="overflow-x-auto relative h-screen w-screen flex flex-col">
        {/* Chat + Input inside same box */}
        <div className="w-full flex-1 border border-cyan-500/20 shadow-[0_0_60px_rgba(6,182,212,0.15),0_0_100px_rgba(6,182,212,0.08)] bg-gradient-to-br from-[#0a0f14] via-[#0d1820] to-[#0a0f14] p-4 sm:p-5 flex flex-col gap-4 relative backdrop-blur-xl">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Radial Gradient Glow */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent" />
            <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-radial from-blue-500/5 via-transparent to-transparent" />

            {/* Noise Texture */}
            <div
              className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E\")",
              }}
            />
          </div>

          {/* Chat Containers Row */}
          <div
            className={`flex gap-4 mb-20 sm:mb-24 ${
              onlyExpliOpen ? "w-full sm:w-[70%] mx-auto" : "flex-1"
            } pt-16 h-full overflow-x-auto flex-nowrap [&>*]:min-w-[320px]`}
          >
            <ChatContainer
              messages={currentMessages}
              isTyping={isTyping.expli}
              toolName="Expli"
              icon={<FaPlus />}
              enabled={enabledProviders.expli}
              setEnabled={(val) =>
                setEnabledProviders((prev) => ({ ...prev, expli: val }))
              }
              onlyExpliOpen={onlyExpliOpen}
            />

            {providerKeys?.openai && !closedChats.openai && (
              <ChatContainer
                messages={currentMessagesOpenAI}
                isTyping={isTyping.openai}
                toolName="OpenAI"
                pid="openai"
                icon={<AiOutlineOpenAI />}
                enabled={enabledProviders.openai}
                setEnabled={(val) =>
                  setEnabledProviders((prev) => ({ ...prev, openai: val }))
                }
                handleCloseChat={(pid) =>
                  setClosedChats((prev) => ({ ...prev, [pid]: true }))
                }
              />
            )}

            {providerKeys?.gemini && !closedChats.gemini && (
              <ChatContainer
                messages={currentMessagesGemini}
                isTyping={isTyping.gemini}
                toolName="Gemini"
                pid="gemini"
                icon={<RiGeminiLine />}
                enabled={enabledProviders.gemini}
                setEnabled={(val) =>
                  setEnabledProviders((prev) => ({ ...prev, gemini: val }))
                }
                handleCloseChat={(pid) =>
                  setClosedChats((prev) => ({ ...prev, [pid]: true }))
                }
              />
            )}
          </div>
        </div>

        {showIntegrationsModal && (
          <IntegrationModal
            providerKeys={providerKeys}
            setProviderKeys={setProviderKeys}
            setShowIntegrationsModal={setShowIntegrationsModal}
          />
        )}

        {/* Input Box Below Chats */}
        <ExpliInput
          prompt={prompt}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handlePaste={handlePaste}
          isTyping={isTyping.expli}
          handleMicClick={handleMicClick}
          isRecording={isRecording}
          isSidebarOpen={isSidebarOpen}
          sidebarPinned={sidebarPinned}
        />
      </div>

      {/* Advanced Animation Styles */}
      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-30px, 30px) scale(0.95);
          }
        }

        @keyframes float-slower {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-40px, 40px) scale(1.1);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-float-slower {
          animation: float-slower 25s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 15s ease-in-out infinite;
        }

        .animate-scan {
          animation: scan 8s linear infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        /* Glassmorphism Enhancement */
        .backdrop-blur-xl {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(
            180deg,
            rgba(6, 182, 212, 0.5),
            rgba(59, 130, 246, 0.5)
          );
          border-radius: 10px;
          border: 2px solid transparent;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            180deg,
            rgba(6, 182, 212, 0.8),
            rgba(59, 130, 246, 0.8)
          );
        }
      `}</style>
    </div>
  );
}

export default Trone;
