import { useState, useEffect, useRef } from "react";
import {
  FiPaperclip,
  FiImage,
  FiSend,
  FiSettings,
  FiDollarSign,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";

const promptSuggestions = [
  {
    icon: <FiSettings />,
    text: "Learning about our automation services",
  },
  {
    icon: <FiDollarSign />,
    text: "Exploring our pricing automation tools",
  },
  {
    icon: <FiUsers />,
    text: "Connecting you with a sales expert",
  },
  {
    icon: <FiCalendar />,
    text: "Scheduling a call with our team",
  },
];

const webhookUrl =
  "https://invgauravkaushik.app.n8n.cloud/webhook/7cf23db3-e0c0-40b2-bb8f-77c8399e2e85";

const SalesAssistant = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, loading]);

  const parseBotResponse = (text) => {
    const clean = text ? text.trim() : "";
    const itemMatch = clean.match(/Item Name:\s*(.+)/i);
    const partMatch = clean.match(/Part Number:\s*(.+)/i);
    const priceMatch = clean.match(/Price:\s*(.+)/i);

    return {
      raw: clean,
      item: itemMatch ? itemMatch[1] : null,
      part: partMatch ? partMatch[1] : null,
      price: priceMatch ? priceMatch[1] : null,
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);
    setError(null);
    setFirstMessageSent(true);

    setChat((prev) => [...prev, { sender: "user", text: userMessage }]);

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);

      const data = await res.json();
      const botText =
        data && Array.isArray(data) && data[0]?.output
          ? data[0].output
          : data.output || "";

      const parsed = parseBotResponse(botText);

      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          raw: parsed.raw,
          item: parsed.item,
          part: parsed.part,
          price: parsed.price,
        },
      ]);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClick = (text) => {
    setInput(text);
  };
  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col">
      {!firstMessageSent && (
        <div className="flex flex-1 items-center justify-center px-4 py-8 mt-20">
          <div className="max-w-4xl w-full text-center space-y-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-extralight text-white leading-tight font-serif">
                <span className="bg-gradient-to-r from-white via-[#23b5b5]/80 to-[#23b5b5]/80 text-transparent bg-clip-text font-semibold">
                  Sales Automation Assistant
                </span>
                <br />
                <span className="text-white font-light">
                  How can we assist you today?
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-400 font-serif">
                Your{" "}
                <span className="text-[#23b5b5] font-semibold">
                  smart assistant
                </span>{" "}
                for automation-related queries. Just send us your request — our
                team will review it and get in touch!
              </p>
            </div>

            {/* Prompt Suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {promptSuggestions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handlePromptClick(item.text)}
                  className="group flex flex-col items-start gap-3 p-4 bg-gray-800 border border-gray-700 rounded-xl shadow-sm transition hover:shadow-lg hover:border-[#23b5b5]/70 hover:scale-105 cursor-pointer"
                >
                  <div className="text-2xl text-[#23b5b5] group-hover:rotate-6 transition-transform">
                    {item.icon}
                  </div>
                  <div className="text-sm font-medium text-gray-100">
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* 💬 Chat area */}
      <div className="flex-1 px-4 overflow-y-auto pb-44 pt-4 max-w-3xl w-full mx-auto">
        <div className="flex flex-col gap-4">
          {chat.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-[#23b5b5] text-white"
                    : "bg-gray-800 text-gray-100"
                }`}
              >
                {msg.sender === "bot" ? (
                  <>
                    {msg.raw ? (
                      <ReactMarkdown
                        components={{
                          strong: ({ ...props }) => (
                            <strong
                              className="text-[#23b5b5] font-semibold"
                              {...props}
                            />
                          ),
                          ul: ({ ...props }) => (
                            <ul
                              className="list-disc list-inside ml-4"
                              {...props}
                            />
                          ),
                          p: ({ ...props }) => (
                            <p className="mb-2" {...props} />
                          ),
                        }}
                      >
                        {msg.raw}
                      </ReactMarkdown>
                    ) : (
                      <p>(No bot message found)</p>
                    )}
                  </>
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-gray-100 text-sm p-3 rounded-lg animate-pulse">
                Typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center mt-2">{error}</div>
        )}
      </div>

      {/* ✏️ Input area */}
      <div className="w-full fixed bottom-0 left-0 bg-gray-900 border-t border-gray-800 z-50 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-sm">
            <textarea
              rows="2"
              placeholder="Type your message here..."
              className="w-full resize-none text-sm bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1000}
              disabled={loading}
            ></textarea>

            <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                  <FiPaperclip />
                  <span>Add Attachment</span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                  <FiImage />
                  <span>Use Image</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {input.length}/1000
                </span>
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="p-2 bg-[#23b5b5]/80 hover:bg-[#23b5b5]/70 text-white rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAssistant;
