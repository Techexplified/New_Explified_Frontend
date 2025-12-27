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
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl py-4 mb-6 -mx-4 sm:-mx-6 px-4 sm:px-6 border-b border-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              className={`${toolName === "Expli" ? "h-8" : "h-6"} rounded-lg`}
              alt={toolName}
              src={logo}
            />
            <h1 className="text-lg font-semibold text-white">{toolName}</h1>
          </div>

          {!onlyExpliOpen && (
            <div className="flex items-center gap-3">
              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => setEnabled(!enabled)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-white transition-colors duration-300"></div>
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-black rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
              </label>

              {/* Close Button */}
              {toolName !== "Expli" && (
                <button
                  onClick={() => handleCloseChat(pid)}
                  className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="w-full flex flex-col gap-6 flex-1">
        {/* Empty State */}
        {(!messages || messages.length === 0) && (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <h3 className="text-xl font-medium text-gray-100 mb-2">Hi</h3>
            <p className="text-gray-400 text-base mb-8">
              Hello! How can I help you today?
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
                className="h-5 w-5 rounded mt-1 flex-shrink-0"
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
              <div className="w-5 h-5 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-300">
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
