import { useEffect, useRef } from "react";

function ChatContainer({ messages, isTyping, toolName, enabled, setEnabled }) {
  const chatContainerRef = useRef(null);
  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);
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

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 w-full flex flex-col px-2 sm:px-3 overflow-y-auto scroll-smooth relative z-10 border border-gray-600 rounded-xl h-[60vh]"
      style={{
        scrollBehavior: "smooth",
        paddingTop: "0",
        paddingBottom: "1rem",
      }}
    >
      <h1 className="flex items-center justify-between text-2xl border-b border-gray-600 mb-4 py-2">
        {toolName}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:bg-cyan-500 transition-colors"></div>
          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
        </label>
      </h1>
      {/* Messages Container */}
      <div className="w-full flex flex-col gap-6">
        {messages.map((msg, index) => (
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
                    msg.sender === "bot" ? formatText(msg.text) : msg.text,
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
                <span className="text-gray-300 text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatContainer;
