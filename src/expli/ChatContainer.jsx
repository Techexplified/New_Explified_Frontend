import { Sparkles, X, Zap, Bot, User, Copy, Check } from "lucide-react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { formatText } from "../utils/data/TroneData";
import { FiCheck, FiCopy } from "react-icons/fi";
import {
  V2FeaturesBar,
  V2Badge,
  VoiceExplanation,
} from "./V2Features";

function ChatContainer({
  messages,
  isTyping,
  toolName,
  icon,
  logo,
  enabled,
  setEnabled,
  handleCloseChat,
  pid,
  onlyExpliOpen,
  sessionId,
}) {
  const chatContainerRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedFeatures, setExpandedFeatures] = useState({});
  const [translatedMessages, setTranslatedMessages] = useState({});

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const toggleFeatures = (index) => {
    setExpandedFeatures((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleTranslate = useCallback(async (text, langCode, index) => {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta?.env?.VITE_TRONE_GEMINI_API_KEY
        }`;

      const payload = {
        contents: [
          {
            parts: [
              {
                text: `Translate the following text to ${langCode}. Return ONLY the translated text without any explanations:\n\n"${text}"`,
              },
            ],
          },
        ],
      };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const translatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text || text;

      setTranslatedMessages((prev) => ({
        ...prev,
        [index]: translatedText,
      }));
    } catch (err) {
      console.error("Translation error:", err);
    }
  }, []);

  const handleDiagramGenerate = useCallback((data) => {
    console.log("Generating diagram:", data);
  }, []);

  const handleShare = useCallback((link) => {
    console.log("Shared with link:", link);
  }, []);

  const handleExplainHighlight = useCallback(async (selectedText) => {
    console.log("Explaining:", selectedText);
  }, []);

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 w-full bg-black backdrop-blur-xl flex flex-col px-4 sm:px-6 overflow-y-auto scroll-smooth relative z-10"
      style={{
        maxHeight: "calc(100vh - 100px)",
        scrollBehavior: "smooth",
        paddingTop: "0",
        paddingBottom: "140px",
        scrollbarWidth: "thin",
        scrollbarColor: "#4b5563 transparent",
      }}
    >
      {(!onlyExpliOpen || (messages && messages.length > 0)) && (
        <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl py-3 mb-4 -mx-4 sm:-mx-6 px-4 sm:px-6 border-b border-gray-800/60">
          <div className={`flex items-center justify-between`}>
            <div className="flex items-center justify-end gap-2">
              {logo ? (
                <img
                  src={logo}
                  alt={toolName}
                  className="h-6 rounded-lg"
                />
              ) : (
                <div className="h-6 w-6 flex items-center justify-center rounded-lg bg-gray-800">
                  {icon}
                </div>
              )}
              <h1 className="text-base font-semibold text-white tracking-tight">
                {toolName}
              </h1>
              <V2Badge />
            </div>

            {!onlyExpliOpen && (
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => setEnabled(!enabled)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-700/80 rounded-full peer-focus:ring-2 peer-focus:ring-[#23B5B5]/40 transition-all peer-checked:bg-[#22d3d3]"></div>
                  <div className="absolute translate-x-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                </label>

                {toolName !== "Expli" && (
                  <button
                    onClick={() => handleCloseChat(pid)}
                    aria-label="Close chat"
                    className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className={`w-full flex flex-col gap-6 pb-14
    ${onlyExpliOpen ? "max-w-3xl mx-auto flex-1" : "flex-1"}`}
      >
        {(!messages || messages.length === 0) && !onlyExpliOpen && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-[#23b5b5]/15 to-purple-500/15 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-[#23b5b5]" />
            </div>
            <p className="text-gray-300 text-center text-base font-medium mb-1">
              👋 Hello! How can I assist you?
            </p>
            <p className="text-gray-500 text-center text-sm">
              Ask anything to get started
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex w-full gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
          >
            {msg.sender === "bot" && (
              logo ? (
                <img
                  className={`${onlyExpliOpen ? "w-8 h-8" : "w-5 h-5"} rounded mt-1 flex-shrink-0`}
                  alt={toolName}
                  src={logo}
                />
              ) : (
                <div className={`${onlyExpliOpen ? "w-8 h-8" : "w-5 h-5"} rounded mt-1 flex-shrink-0 flex items-center justify-center bg-gray-800`}>
                  {icon}
                </div>
              )
            )}

            <div className="flex flex-col max-w-[70%]">
              <div
                className={`px-4 py-2.5 rounded-xl text-sm leading-relaxed shadow-lg ${msg.sender === "user"
                  ? "bg-gradient-to-r from-gray-800 to-gray-800/80 text-gray-100 border border-gray-700/30"
                  : "bg-gradient-to-r from-gray-900 to-gray-900/80 text-gray-200 border border-gray-700/30"
                  }`}
                dangerouslySetInnerHTML={{
                  __html:
                    msg.sender === "bot"
                      ? formatText(translatedMessages[index] || msg.text)
                      : msg.text,
                }}
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
              />

              {msg.sender === "bot" && (
                <div className="mt-2 flex flex-col">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(msg.text, index)}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-300 transition-colors px-2 py-1 rounded-md hover:bg-gray-800/50"
                    >
                      {copiedIndex === index ? (
                        <>
                          <FiCheck className="text-green-500" size={14} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <FiCopy size={14} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <VoiceExplanation text={msg.text} />

                    <button
                      onClick={() => toggleFeatures(index)}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#23b5b5] transition-colors px-2 py-1 rounded-md hover:bg-gray-800/50"
                    >
                      <Sparkles size={12} />
                      <span>V2 Features</span>
                    </button>
                  </div>

                  {expandedFeatures[index] && (
                    <V2FeaturesBar
                      messageText={msg.text}
                      sessionId={sessionId}
                      onTranslate={(text, lang) =>
                        handleTranslate(text, lang, index)
                      }
                      onDiagramGenerate={handleDiagramGenerate}
                      onShare={handleShare}
                      onExplainHighlight={handleExplainHighlight}
                    />
                  )}
                </div>
              )}
            </div>

            {msg.sender === "user" && (
              <div
                className={`${onlyExpliOpen ? "w-7 h-7" : "w-5 h-5"
                  } rounded-full bg-gradient-to-br from-[#23b5b5] to-[#1a8a8a] flex-shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-lg`}
              >
                U
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2">
            {logo ? (
              <img
                className="h-5 w-5 rounded flex-shrink-0"
                alt={toolName}
                src={logo}
              />
            ) : (
              <div className="h-5 w-5 rounded flex-shrink-0 flex items-center justify-center bg-gray-800">
                {icon}
              </div>
            )}
            <div className="flex gap-1 px-3 py-2 bg-gray-900/50 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-[#23b5b5] animate-bounce"></div>
              <div
                className="w-2 h-2 rounded-full bg-[#23b5b5] animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-[#23b5b5] animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #23b5b5 0%, #4b5563 100%);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #23b5b5;
        }
      `}</style>
    </div>
  );
}

export default React.memo(ChatContainer);
