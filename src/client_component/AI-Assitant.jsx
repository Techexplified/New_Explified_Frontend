import { useState, useEffect, useRef } from "react";
import {
  FiPaperclip,
  FiImage,
  FiSend,
  FiShoppingCart,
  FiSearch,
  FiTruck,
  FiInfo,
  FiMic,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";

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
  "https://productexplified.app.n8n.cloud/webhook/d4b49ce1-2117-4f7e-ab66-c890a6d7fe79";

const CarPartsAssistant = () => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Admin button logic
  const isLoggedIn =
    typeof window !== "undefined" && localStorage.getItem("explified");

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
      };
      recognitionRef.current.onerror = () => {
        setListening(false);
      };
      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }
  }, []);

  const handleMicClick = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

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
      const output = data[0]?.output || data.output || JSON.stringify(data);
      const parsed = parseBotResponse(output);

      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          ...parsed,
          raw: parsed.raw || output || JSON.stringify(data),
        },
      ]);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col">
      {/* Admin Button at Top Right */}
      <header className="fixed top-0 right-0 z-50 p-6">
        <div
           className="fixed z-50"
        style={{
          top: "50px",      // move down
          right: "40px",    // move right
        }}
        >
          {isLoggedIn && (
            <a
              href="/explified/admin"
              className="bg-[#23b5b5] text-black px-5 py-2 rounded-full font-semibold hover:bg-[#1fa3a3] transition shadow-sm text-sm"
              style={{ minWidth: 90, textAlign: "center" }}
            >
              Admin
            </a>
          )}
        </div>
      </header>

      {!firstMessageSent && (
        <div className="flex flex-1 items-center justify-center px-4 py-8 mt-20">
          <div className="max-w-4xl w-full text-center space-y-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-extralight text-white leading-tight font-serif">
                <span className="bg-gradient-to-r from-white via-[#23b5b5]/80 to-[#23b5b5]/80 text-transparent bg-clip-text font-semibold">
                
                </span>
                <br />
                <span className="text-white font-light">
                  How can we assist you?
                </span>
              </h1>
              
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
                {msg.sender === "bot" ? (
                  <div>
                    {/* Show item/part/price if present */}
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
                    {/* Always show bot response (raw or text) */}
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
                        {msg.raw || msg.text || ""}
                      </ReactMarkdown>
                    </div>
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
      <div className="w-full fixed bottom-0 left-0 bg-gray-900 border-t border-gray-800 z-50 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 flex flex-col shadow-sm">
            {/* Top row: textarea + send/mic */}
            <div className="flex items-end gap-2">
              <textarea
                rows="3"
                placeholder="Type your message..."
                className="flex-1 resize-none text-sm bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none leading-5 max-h-28"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  (e.preventDefault(), handleSend())
                }
                maxLength={1000}
                disabled={loading}
              ></textarea>

              <div className="flex items-center gap-2 pb-1">
                <button
                  onClick={handleMicClick}
                  className={`p-2 rounded-full transition ${
                    listening
                      ? "bg-[#23b5b5]"
                      : "bg-gray-700 hover:bg-[#23b5b5]/40"
                  } text-white`}
                  aria-label="Voice input"
                  disabled={loading || listening}
                >
                  <FiMic size={18} />
                </button>
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="p-2 bg-[#23b5b5]/80 hover:bg-[#23b5b5]/70 text-white rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend size={18} />
                </button>
              </div>
            </div>

            {/* Bottom row: attachments + counter */}
            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                  <FiPaperclip size={14} />
                  <span>Attachment</span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                  <FiImage size={14} />
                  <span>Image</span>
                </div>
              </div>
              <span>{input.length}/1000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarPartsAssistant;