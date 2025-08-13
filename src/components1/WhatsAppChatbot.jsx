import React, { useState, useRef, useEffect } from "react";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY1; // Replace with your actual key

const WhatsAppChatbot = () => {
  const [phone, setPhone] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submittedPhone, setSubmittedPhone] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const sendToWhatsApp = async (receiver, message) => {
    await fetch("http://localhost:8000/api/whatsapp/send-whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiver, message }),
    });
  };

  const sendPrompt = async () => {
    console.log(GEMINI_API_KEY,import.meta.env.GEMINI_API_KEY1)
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
          }),
        }
      );

      const data = await res.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate a response.";

      const botMessage = { role: "bot", text: aiText };
      setMessages((prev) => [...prev, botMessage]);

      await sendToWhatsApp(phone, aiText);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error fetching response from Gemini." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.trim()) setSubmittedPhone(true);
  };

  return (
    <div className="flex justify-center items-center bg-black transition-all duration-300">
      <div className="w-full max-w-2xl bg-black/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-[#23b5b5] p-6">
        <h1 className="text-4xl font-bold mb-6 text-center text-[#23b5b5] tracking-wide">
          AI WhatsApp Assistant 🤖
        </h1>

        {!submittedPhone ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter WhatsApp number (+911234567890)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border border-[#23b5b5] rounded-lg shadow-inner bg-black text-white focus:outline-none focus:ring-2 focus:ring-[#23b5b5]"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#23b5b5] text-black py-2 rounded-lg hover:bg-[#1aa5a5] font-semibold transition"
            >
              Start Chat
            </button>
          </form>
        ) : (
          <>
            <div
              ref={chatRef}
              className="h-[30rem] overflow-y-auto border border-[#23b5b5] rounded-lg p-4 bg-black/40 shadow-inner mb-4 scrollbar-thin scrollbar-thumb-[#23b5b5]/60"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-3 flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-5 py-3 rounded-2xl max-w-sm text-sm animate-fadeIn ${
                      msg.role === "user"
                        ? "bg-[#23b5b5] text-black shadow-md"
                        : "bg-gray-800 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center space-x-2 text-[#23b5b5] text-sm animate-pulse">
                  <span className="dot dot1">.</span>
                  <span className="dot dot2">.</span>
                  <span className="dot dot3">.</span>
                  <span>AI is typing...</span>
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-3 border border-[#23b5b5] rounded-xl bg-black text-white focus:outline-none focus:ring-2 focus:ring-[#23b5b5]"
              />
              <button
                onClick={sendPrompt}
                className="bg-[#23b5b5] text-black px-5 py-2 rounded-xl hover:bg-[#1aa5a5] font-medium transition"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WhatsAppChatbot;
