import { useState, useEffect, useRef } from "react";
import {
  FiPaperclip,
  FiImage,
  FiSend,
  FiShoppingCart,
  FiSearch,
  FiTruck,
  FiInfo,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown"; // ✅ Added import

const promptSuggestions = [
  { icon: <FiShoppingCart />, text: "Checking part availability" },
  { icon: <FiSearch />, text: "Find compatible tires for a 2020 Honda Civic" },
  { icon: <FiTruck />, text: "Placing an order for car parts" },
  {
    icon: <FiInfo />,
    text: "What’s the difference between synthetic and regular oil?",
  },
];

const webhookUrl =
  "https://invgauravkaushik.app.n8n.cloud/webhook/69cf9b73-d9a8-4151-b743-46c5f97e533c";

const CarPartsAssistant = () => {
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
    const clean = text.trim();
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
      const parsed = parseBotResponse(data[0]?.output || "");

      setChat((prev) => [...prev, { sender: "bot", ...parsed }]);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col">
      {!firstMessageSent && (
        <div className="flex flex-1 items-center justify-center px-4 py-8 mt-20">
          <div className="max-w-4xl w-full text-center space-y-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-extralight text-white leading-tight font-serif">
                <span className="bg-gradient-to-r from-white via-[#23b5b5]/80 to-[#23b5b5]/80 text-transparent bg-clip-text font-semibold">
                  AI Assistant
                </span>
                <br />
                <span className="text-white font-light">
                  What car part do you need?
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-400 font-serif">
                Your{" "}
                <span className="text-[#23b5b5] font-semibold">
                  smart assistant
                </span>{" "}
                for finding and ordering the right car parts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {promptSuggestions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setInput(item.text)}
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

      {/* Chat area */}
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
                {msg.sender === "bot" && (msg.item || msg.part || msg.price) ? (
                  <div>
                    {msg.item && (
                      <p>
                        <span className="text-[#23b5b5]/60 font-semibold">
                          Item Name:
                        </span>{" "}
                        <span className="font-medium">{msg.item}</span>
                      </p>
                    )}
                    {msg.part && (
                      <p>
                        <span className="text-[#23b5b5]/60 font-semibold">
                          Part Number:
                        </span>{" "}
                        <span className="font-medium">{msg.part}</span>
                      </p>
                    )}
                    {msg.price && (
                      <p className="mt-2 px-3 py-1 inline-block bg-[#23b5b5] text-white rounded-full font-semibold text-sm">
                        Price: {msg.price}
                      </p>
                    )}
                    <div className="mt-2 prose prose-invert prose-sm max-w-none">
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
                    </div>
                  </div>
                ) : msg.sender === "bot" ? (
                  <div className="prose prose-invert prose-sm max-w-none">
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
                        p: ({ ...props }) => <p className="mb-2" {...props} />,
                      }}
                    >
                      {msg.raw}
                    </ReactMarkdown>
                  </div>
                ) : (
                  msg.text
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

      {/* Input Area */}
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

export default CarPartsAssistant;
