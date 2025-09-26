import { Sparkles, X, Zap, Bot, User, Copy, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatText } from "../utils/data/TroneData";

function ChatContainer({
  messages,
  isTyping,
  toolName,
  icon,
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
        "flex-1 w-full bg-gradient-to-b from-gray-900/50 to-black/95 backdrop-blur-2xl  flex flex-col px-2 sm:px-3 overflow-y-auto scroll-smooth relative z-10 border border-gray-600 rounded-xl h-full"
      }
      style={{
        scrollBehavior: "smooth",
        paddingTop: "0",
        paddingBottom: "1rem",
        // background:
        //   "linear-gradient(180deg, rgba(30,30,30,0.9) 0%, rgba(20,20,20,0.9) 100%)",
        scrollbarWidth: "thin",
        scrollbarColor: "#374151 transparent",
      }}
    >
      {/* Enhanced Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-gray-900/50 to-black/95 backdrop-blur-2xl border-b border-gray-600/50 mb-4 rounded-t-xl -mx-2 sm:-mx-3 px-2 sm:px-3">
        <div className="flex items-center justify-between py-3">
          {/* Left side: Icon + Tool Name */}
          <div className="flex items-center gap-3">
            <div className="relative p-3 bg-gradient-to-br from-cyan-500/30 to-blue-600/20 rounded-xl border border-cyan-500/40 shadow-lg backdrop-blur-sm">
              <span className="text-cyan-400 text-xl drop-shadow-sm">
                {icon}
              </span>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-xl"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-white tracking-tight">
                {toolName}
              </h1>
              {/* <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full  shadow-sm shadow-green-400/50"></div>
                <p className="text-xs text-slate-400 font-medium">
                  AI Assistant
                </p>
              </div> */}
            </div>
          </div>

          {/* Right side: Controls */}
          {!onlyExpliOpen && (
            <div className="flex items-center gap-4">
              {/* Enhanced Toggle */}
              <div className="flex items-center gap-3">
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
      <div className="w-full flex flex-col gap-6 px-1 ">
        {(!messages || messages.length === 0) && (
          <div className="flex flex-col items-center justify-center h-full text-center mt-12 animate-fade-in">
            <div className="relative mb-6">
              <div className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-700/40 rounded-2xl border border-slate-600/50 shadow-2xl backdrop-blur-sm">
                <Sparkles className="w-10 h-10 text-[#23b5b5]" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
              Ready to assist you
            </h3>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              I'm here to help! Ask me anything and let's start an engaging
              conversation.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`group transform transition-all duration-500 ease-out ${
              msg.sender === "user" ? "self-end" : "self-start"
            } max-w-[85%] animate-slide-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`relative px-6 py-4 rounded-2xl text-sm break-words whitespace-pre-wrap backdrop-blur-sm shadow-xl border transition-all duration-300 hover:shadow-2xl  ${
                msg.isError
                  ? "border-red-500/50 bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-200 shadow-red-500/20"
                  : msg.sender === "user"
                  ? "bg-gradient-to-br from-cyan-500/25 to-cyan-600/15 border-cyan-500/40 text-white shadow-cyan-500/20"
                  : "bg-gradient-to-br from-sky-500/25 to-sky-600/15 border-sky-500/40 text-white shadow-sky-500/20"
              }`}
              style={{
                wordBreak: "break-word",
              }}
            >
              {/* Message Header for Bot Messages */}
              {msg.sender === "bot" && (
                <div className="flex items-center justify-between  pb-2 border-b border-gray-700/30">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-gradient-to-br from-sky-500/20 to-sky-600/10 rounded-lg">
                      <Bot className="w-3 h-3 text-sky-400" />
                    </div>
                    <span className="text-sky-400 text-xs font-semibold tracking-wide">
                      AI ASSISTANT
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(msg.text, index)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-cyan-400 rounded-md transition-all duration-200 hover:bg-cyan-500/10"
                    title="Copy message"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              )}

              {/* User Message Header */}
              {msg.sender === "user" && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 rounded-lg">
                    <User className="w-3 h-3 text-cyan-400" />
                  </div>
                  <span className="text-cyan-400 text-xs font-semibold tracking-wide">
                    YOU
                  </span>
                </div>
              )}

              {/* Message Content */}
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    msg.sender === "bot" ? formatText(msg.text) : msg.text,
                }}
                style={{
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
              />

              {/* Message Glow Effect */}
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                  msg.isError
                    ? "bg-gradient-to-br from-red-500/10 to-transparent"
                    : msg.sender === "user"
                    ? "bg-gradient-to-br from-cyan-400/10 to-transparent"
                    : "bg-gradient-to-br from-gray-400/5 to-transparent"
                }`}
              ></div>
            </div>
          </div>
        ))}

        {/* Enhanced Typing Indicator */}
        {isTyping && (
          <div className="self-start max-w-[85%] animate-fade-in">
            <div className="px-6 py-4 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/70 border border-gray-700/60 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-lg">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full animate-bounce shadow-sm shadow-cyan-400/50"></div>
                    <div
                      className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full animate-bounce shadow-sm shadow-cyan-400/50"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full animate-bounce shadow-sm shadow-cyan-400/50"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                  <span className="text-gray-300 text-sm font-medium">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
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
