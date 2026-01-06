// src/context/ExpliContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

const ExpliContext = createContext(null);

export const useExpli = () => {
  const ctx = useContext(ExpliContext);
  if (!ctx) throw new Error("useExpli must be used within ExpliProvider");
  return ctx;
};

export function ExpliProvider({ children }) {
  //   const navigate = useNavigate?.() || (() => {}); // if used outside router, fallback

  // ---------- states (moved from Trone) ----------
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

  const [sidebarPinned, setSidebarPinned] = useState(false);
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

  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const raw = localStorage.getItem("expli_chat_sessions1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [currentMessages, setCurrentMessages] = useState([]); // expli
  const [currentMessagesOpenAI, setCurrentMessagesOpenAI] = useState([]); // openai
  const [currentMessagesGemini, setCurrentMessagesGemini] = useState([]); // gemini

  const [sessionId, setSessionId] = useState(
    () =>
      `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  );
  const [sessionStartedAt, setSessionStartedAt] = useState(null);

  const [firstPromptDone, setFirstPromptDone] = useState(
    localStorage.getItem("firstPromptDone") === "true"
  );

  // recorder refs
  const recognitionRef = useRef(null);

  // current tool and current QA ref
  const [currentTool, setCurrentTool] = useState("expli");
  const currentQaIdRef = useRef(null);

  // Helper computed flags
  const onlyExpliOpen =
    (closedChats.openai || !providerKeys.openai) &&
    (closedChats.gemini || !providerKeys.gemini);

  const chatNotPresent =
    currentMessages.length === 0 &&
    currentMessagesGemini.length === 0 &&
    currentMessagesOpenAI.length === 0;

  // ---------- localStorage side effects ----------
  useEffect(() => {
    try {
      localStorage.setItem("trone_closed_chats", JSON.stringify(closedChats));
    } catch (err) {
      console.error("Failed to save closedChats:", err);
    }
  }, [closedChats]);

  useEffect(() => {
    try {
      localStorage.setItem("provider_keys", JSON.stringify(providerKeys));
    } catch (e) {
      console.error(e);
    }
  }, [providerKeys]);

  useEffect(() => {
    try {
      localStorage.setItem("expli_chat_sessions1", JSON.stringify(chatHistory));
    } catch (e) {
      console.error(e);
    }
  }, [chatHistory]);

  // ---------- chat-session helpers moved from Trone ----------
  const pushNewQaToHistory = (qaObj, sessionActive) => {
    setChatHistory((prev) => {
      const updated = [...prev];
      if (sessionActive) {
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

  const attachAnswerToCurrentQa = (tool, text) => {
    setChatHistory((prev) => {
      if (!prev || prev.length === 0 || !currentQaIdRef.current) {
        console.warn("No active QA to attach answer to");
        return prev;
      }

      const updated = [...prev];
      let sessionIndex = updated.findIndex((s) => s.id === sessionId);
      if (sessionIndex === -1) sessionIndex = updated.length - 1;

      const session = { ...updated[sessionIndex] };
      session.qa = [...session.qa];

      const qaIndex = session.qa.findIndex(
        (q) => q.id === currentQaIdRef.current
      );
      if (qaIndex === -1) {
        console.warn("No QA found for currentQaIdRef");
        return prev;
      }

      const qa = { ...session.qa[qaIndex] };
      qa.answers = [...(qa.answers || []), { tool, text }];
      session.qa[qaIndex] = qa;
      updated[sessionIndex] = session;
      return updated;
    });
  };

  const updatePromptSummaryInQa = (qaId, summary) => {
    setChatHistory((prev = []) =>
      prev.map((session) => {
        if (!Array.isArray(session.qa)) return session;
        return {
          ...session,
          qa: session.qa.map((item) =>
            item.id === qaId ? { ...item, promptSummary: summary } : item
          ),
        };
      })
    );
  };

  // ---------- summarization (kept as-is) ----------
  const summarizePrompt = async (prompt, qaId) => {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${
        import.meta.env.VITE_TRONE_GEMINI_API_KEY
      }`;

      const payload = {
        contents: [
          {
            parts: [
              {
                text: `Turn the following text into a declarative format sentence. 
Return **only** the text , without any explanations, formatting, or markdown:
"${prompt}"`,
              },
            ],
          },
        ],
      };

      const res = await axios.post(apiUrl, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });

      const summary = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // 🧩 Update the corresponding QA entry in history
      updatePromptSummaryInQa(qaId, summary);
    } catch (err) {
      console.error("Summary error:", err);
    }
  };
  // ---------- newChat and provider remove ----------
  const newChat = () => {
    setCurrentMessages([]);
    setCurrentMessagesGemini([]);
    setCurrentMessagesOpenAI([]);
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

  // ---------- microphone functionality ----------
  const [isRecording, setIsRecording] = useState(false);

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

  // ---------- input handlers ----------
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 2000) {
      setPrompt(value);
    }
  };

  const handlePaste = (e) => {
    const paste = (e.clipboardData || window.clipboardData).getData("text");
    if (paste.length > 2000) {
      e.preventDefault();
      alert("Pasted text is too long. Please keep it under 2000 characters.");
    }
  };

  // ---------- message generation handlers (extracted versions) ----------
  // The three handlers are adapted from your code. They set isTyping flags and append messages.
  const handleDefault = async (userMessage, contextPrompt) => {
    setIsTyping((prev) => ({ ...prev, expli: true }));
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${
        import.meta?.env.REACT_APP_TRONE_GEMINI_API_KEY ||
        import.meta?.env?.VITE_TRONE_GEMINI_API_KEY
      }`;
      const payload = {
        contents: [{ parts: [{ text: contextPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      };

      const res = await axios.post(apiUrl, payload, {
        timeout: 30000,
        headers: { "Content-Type": "application/json" },
      });

      const botText =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received.";
      if (res.data.candidates?.[0]?.finishReason === "SAFETY")
        throw new Error("Response blocked due to safety filters.");

      const botMessage = {
        sender: "bot",
        text: botText,
        timestamp: new Date().toISOString(),
      };
      setCurrentMessages((prev) => [...prev, botMessage]);
      attachAnswerToCurrentQa("expli", botText);
    } catch (err) {
      console.error("handleDefault error:", err);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, I encountered an error. Please try again.",
        isError: true,
        timestamp: new Date().toISOString(),
      };
      setCurrentMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping((prev) => ({ ...prev, expli: false }));
    }
  };

  const handleOpenAI = async (userMessage, contextPrompt) => {
    setIsTyping((prev) => ({ ...prev, openai: true }));
    try {
      const apiUrl = "https://api.openai.com/v1/chat/completions";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${providerKeys?.openai}`,
      };
      const payload = {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: contextPrompt }],
      };
      const res = await axios.post(apiUrl, payload, {
        timeout: 30000,
        headers,
      });
      const botText =
        res.data?.choices?.[0]?.message?.content || "No response received.";
      const botMessage = {
        sender: "bot",
        text: botText,
        timestamp: new Date().toISOString(),
      };
      setCurrentMessagesOpenAI((prev) => [...prev, botMessage]);
      attachAnswerToCurrentQa("openai", botText);
    } catch (err) {
      console.error("handleOpenAI error:", err);
      setCurrentMessagesOpenAI((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, OpenAI error.",
          isError: true,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping((prev) => ({ ...prev, openai: false }));
    }
  };

  const handleGemini = async (userMessage, contextPrompt) => {
    setIsTyping((prev) => ({ ...prev, gemini: true }));
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${providerKeys?.gemini}`;
      const payload = {
        contents: [{ parts: [{ text: contextPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      };
      const res = await axios.post(apiUrl, payload, {
        timeout: 30000,
        headers: { "Content-Type": "application/json" },
      });
      const botText =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received.";
      const botMessage = {
        sender: "bot",
        text: botText,
        timestamp: new Date().toISOString(),
      };
      setCurrentMessagesGemini((prev) => [...prev, botMessage]);
      attachAnswerToCurrentQa("gemini", botText);
    } catch (err) {
      console.error("handleGemini error:", err);
      setCurrentMessagesGemini((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, Gemini error.",
          isError: true,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping((prev) => ({ ...prev, gemini: false }));
    }
  };

  // ---------- main submit (Enter) ----------
  const handleSubmit = async (eOrPayload) => {
    // Accept either keydown event or direct trigger object { text }.
    const isEvent = eOrPayload && eOrPayload.key !== undefined;
    const text = isEvent
      ? eOrPayload.key === "Enter" && prompt.trim()
      : eOrPayload?.text || prompt.trim();

    if (!text) return;
    if (isEvent && eOrPayload.key !== "Enter") return;

    const userMessage = { sender: "user", text: text.trim() };
    if (currentMessages.length === 0) setSessionStartedAt(Date.now());

    // create new QA and mark current QA ref
    const qaId =
      crypto?.randomUUID?.() ??
      `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    currentQaIdRef.current = qaId;

    const newQa = {
      id: qaId,
      question: text.trim(),
      promptSummary: "",
      answers: [],
      timestamp: new Date().toISOString(),
    };

    const sessionActive =
      currentMessages.length > 0 ||
      currentMessagesOpenAI.length > 0 ||
      currentMessagesGemini.length > 0;
    pushNewQaToHistory(newQa, sessionActive);

    // add user messages
    if (enabledProviders.expli)
      setCurrentMessages((prev) => [...prev, userMessage]);
    if (enabledProviders.openai)
      setCurrentMessagesOpenAI((prev) => [...prev, userMessage]);
    if (enabledProviders.gemini)
      setCurrentMessagesGemini((prev) => [...prev, userMessage]);

    // recent prompts
    try {
      const existing = JSON.parse(localStorage.getItem("recentPrompts")) || [];
      const trimmed = text.trim();
      const newSet = [trimmed, ...existing.filter((p) => p !== trimmed)].slice(
        0,
        5
      );
      localStorage.setItem("recentPrompts", JSON.stringify(newSet));
    } catch {}

    if (!firstPromptDone) {
      setFirstPromptDone(true);
      try {
        localStorage.setItem("firstPromptDone", "true");
      } catch {}
    }

    // contextPrompt (use last 10 messages)
    const conversationHistory = currentMessages.slice(-10);
    const contextPrompt =
      conversationHistory.length > 0
        ? `Previous conversation context:\n${conversationHistory
            .map(
              (msg) =>
                `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`
            )
            .join("\n")}\n\nCurrent question: ${text.trim()}`
        : text.trim();

    try {
      const tool = currentTool;
      const apiKey = providerKeys[tool] || "";
      if (!apiKey && tool !== "expli")
        throw new Error(`No API key found for ${tool}.`);

      // Start summarization (do not block)
      summarizePrompt(text.trim(), qaId);

      const tasks = [];
      if (tool === "expli" && enabledProviders.expli)
        tasks.push(handleDefault(userMessage, contextPrompt));
      if (
        providerKeys?.openai &&
        enabledProviders.openai &&
        !closedChats.openai
      )
        tasks.push(handleOpenAI(userMessage, contextPrompt));
      if (
        providerKeys?.gemini &&
        enabledProviders.gemini &&
        !closedChats.gemini
      )
        tasks.push(handleGemini(userMessage, contextPrompt));
      await Promise.allSettled(tasks);
    } catch (err) {
      console.error("Error in handleSubmit:", err);
    } finally {
      setPrompt("");
    }
  };

  // Expose provider values
  const value = {
    // states
    prompt,
    setPrompt,
    enabledProviders,
    setEnabledProviders,
    isTyping,
    setIsTyping,
    closedChats,
    setClosedChats,
    sidebarPinned,
    setSidebarPinned,
    isSidebarOpen,
    setIsSidebarOpen,
    providerKeys,
    setProviderKeys,
    chatHistory,
    setChatHistory,
    currentMessages,
    setCurrentMessages,
    currentMessagesOpenAI,
    setCurrentMessagesOpenAI,
    currentMessagesGemini,
    setCurrentMessagesGemini,
    sessionId,
    setSessionId,
    sessionStartedAt,
    setSessionStartedAt,
    firstPromptDone,
    setFirstPromptDone,
    recognitionRef,
    isRecording,
    setIsRecording,
    currentTool,
    setCurrentTool,
    onlyExpliOpen,
    chatNotPresent,

    // handlers
    pushNewQaToHistory,
    attachAnswerToCurrentQa,
    updatePromptSummaryInQa,
    summarizePrompt,
    newChat,
    handleRemoveProvider,
    handleMicClick,
    handleInputChange,
    handlePaste,
    handleDefault,
    handleOpenAI,
    handleGemini,
    handleSubmit,
  };

  return (
    <ExpliContext.Provider value={value}>{children}</ExpliContext.Provider>
  );
}
