import { Sparkles, X, Zap, Bot, User, Copy, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatText } from "../utils/data/TroneData";
import { FiCheck, FiCopy } from "react-icons/fi";

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
}) {
  const chatContainerRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

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

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 w-full  bg-black backdrop-blur-xl flex flex-col px-4 sm:px-6 overflow-y-auto scroll-smooth relative z-10"
      style={{
        maxHeight: "calc(100vh - 100px)",
        scrollBehavior: "smooth",
        paddingTop: "0",
        paddingBottom: "1rem",
        scrollbarWidth: "thin",
        scrollbarColor: "#4b5563 transparent",
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl py-3 mb-4 -mx-4 sm:-mx-6 px-4 sm:px-6 border-b border-gray-800/60">
        <div className={`flex items-center justify-between`}>
          {/* Left: Icon + Tool Name */}
          <div className="flex items-center justify-end gap-2">
            <img
              src={logo}
              alt={toolName}
              className={`${toolName === "Expli" ? "h-8" : "h-6"} rounded-lg`}
            />
            <h1 className="text-base font-semibold text-white tracking-tight">
              {toolName}
            </h1>
          </div>

          {/* Right: Toggle + Close */}
          {!onlyExpliOpen && (
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-gray-400 font-medium px-2 py-0.5 rounded-full bg-gray-800">
                Chat Mode
              </span>
              {/* Toggle */}
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

              {/* Close */}
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

      {/* Messages Container */}
      <div
        className={`w-full flex flex-col gap-6 
    ${onlyExpliOpen ? "max-w-3xl mx-auto flex-1" : "flex-1"}`}
      >
        {/* Empty State */}
        {(!messages || messages.length === 0) && (
          <div className="flex">
            <p className="bg-gray-900 text-gray-200 px-4 py-2.5 rounded-lg text-sm leading-relaxed mb-8">
              👋 Hello! How can I assist you ?
            </p>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex w-full gap-3 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <img
                className={`${
                  onlyExpliOpen ? "w-8 h-8" : "w-5 h-5"
                }  rounded mt-1 flex-shrink-0`}
                alt={toolName}
                src={logo}
              />
            )}

            <div className="flex flex-col max-w-[70%]">
              {/* Message Bubble */}
              <div
                className={`px-4 py-2.5 rounded-lg text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-gray-800 text-gray-100"
                    : "bg-gray-900 text-gray-200"
                }`}
                dangerouslySetInnerHTML={{
                  __html:
                    msg.sender === "bot" ? formatText(msg.text) : msg.text,
                }}
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
              />

              {/* Copy Button for Bot Messages */}
              {msg.sender === "bot" && (
                <button
                  onClick={() => copyToClipboard(msg.text, index)}
                  className="self-start flex items-center gap-1.5 text-xs text-gray-400 mt-2 hover:text-gray-300 transition-colors"
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
              )}
            </div>

            {msg.sender === "user" && (
              <div
                className={`${
                  onlyExpliOpen ? "w-7 h-7" : "w-5 h-5"
                }  rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-300`}
              >
                S
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2">
            <img
              className="h-5 w-5 rounded flex-shrink-0"
              alt={toolName}
              src={logo}
            />
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce"></div>
              <div
                className="w-2 h-2 rounded-full bg-gray-600 animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-gray-600 animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar */}
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
}

export default ChatContainer;
