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

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Copy message text to clipboard
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
      className={
        "flex-1 w-full  bg-black backdrop-blur-xl flex flex-col px-2 sm:px-3 overflow-y-auto scroll-smooth relative z-10 border border-cyan-500/30   shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:shadow-[0_0_60px_rgba(6,182,212,0.25)] transition-all duration-500"
      }
      style={{
        maxHeight: "calc(100vh - 100px)",
        scrollBehavior: "smooth",
        paddingTop: "0",
        paddingBottom: "1rem",
        scrollbarWidth: "thin",
        scrollbarColor: "#06b6d4 transparent",
      }}
    >
      {/* Animated Border Glow */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse" />
      </div>

      {/* Enhanced Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-br from-gray-900/90 via-gray-950/80 to-black/70 backdrop-blur-2xl border-b border-cyan-500/30 mb-4 rounded-t-2xl -mx-2 sm:-mx-3 px-2 sm:px-3 shadow-[0_4px_20px_rgba(6,182,212,0.1)]">
        <div className="flex items-center justify-between py-1">
          {/* Left side: Icon + Tool Name */}
          <div className="flex items-center gap-3">
            {/* <div className="relative p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-sm hover:scale-105 transition-transform duration-300"> */}
            <span className="">
              {/* {icon} */}
              <img
                className={`${toolName === "Expli" ? "h-9" : "h-5"}`}
                alt="Logo"
                src={logo}
              />
            </span>
            {/* <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-xl animate-pulse"></div> */}

            {/* <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl blur-md -z-10"></div> */}
            {/* </div> */}
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-white tracking-tight">
                {toolName}
              </h1>
            </div>
          </div>

          {/* Right side: Controls */}
          {!onlyExpliOpen && (
            <div className="flex items-center gap-4">
              {/* Enhanced Toggle */}
              {/* <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => setEnabled(!enabled)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500/50 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-cyan-400 transition-all duration-300 shadow-lg peer-checked:shadow-cyan-500/25"></div>
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-6 shadow-md peer-checked:shadow-lg"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-transparent opacity-0 peer-checked:opacity-100 transition-opacity duration-300"></div>
                </label>
              </div> */}

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => setEnabled(!enabled)}
                    className="sr-only peer"
                  />
                  {/* Background track */}
                  <div className="w-8 h-4 bg-gray-600 rounded-full peer-focus:ring-2 peer-focus:ring-cyan-500/40 peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-cyan-400 transition-all duration-300 shadow-md peer-checked:shadow-cyan-500/20"></div>

                  {/* Toggle circle */}
                  <div className="absolute left-[2px] top-[1.5px] w-3.5 h-3.5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-4 shadow-sm peer-checked:shadow-md"></div>

                  {/* Glow overlay */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-transparent opacity-0 peer-checked:opacity-100 transition-opacity duration-300"></div>
                </label>
              </div>

              {/* Enhanced Close Button */}
              {toolName !== "Expli" && (
                <button
                  onClick={() => handleCloseChat(pid)}
                  className="relative p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-300 group border border-transparent hover:border-red-500/30 backdrop-blur-sm"
                  aria-label="Close chat"
                >
                  <X
                    size={18}
                    className="group-hover:rotate-90 transition-all duration-300 drop-shadow-sm"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div
        className={`w-full flex flex-col gap-4 ${
          onlyExpliOpen ? "px-8" : "px-2"
        }`}
      >
        {/* Empty State */}
        {(!messages || messages.length === 0) && (
          <div className="flex flex-col items-center justify-center h-full text-center mt-20">
            <h3 className="text-lg font-medium text-gray-200 mb-2">
              Hello! How can I help you today?
            </h3>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
              Start a conversation and I’ll do my best to assist you.
            </p>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex w-full gap-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex flex-col max-w-[80%]">
              {/* Message Bubble */}
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[#2a2a2a] text-gray-100"
                    : "bg-[#1a1a1a] text-gray-200"
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
                  className="self-start flex items-center gap-1 text-xs text-gray-400 mt-1 ml-2 hover:text-gray-200 transition-colors"
                >
                  {copiedIndex === index ? (
                    <>
                      <FiCheck className="text-green-400" /> Copied
                    </>
                  ) : (
                    <>
                      <FiCopy />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
            <div
              className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #374151 0%, #4b5563 100%);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #4b5563 0%, #6b7280 100%);
        }
      `}</style>
    </div>
  );
}

export default ChatContainer;
