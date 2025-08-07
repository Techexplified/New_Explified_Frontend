import React, { useState, useEffect } from "react";
import { FiPlus, FiMic, FiSliders } from "react-icons/fi";
import { BsSoundwave } from "react-icons/bs";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function Trone({ onFirstPrompt }) {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [firstPromptDone, setFirstPromptDone] = useState(() => {
  return localStorage.getItem("firstPromptDone") === "true";
});

  const location = useLocation();
  const { isDrawerOpen = true, reset = false } = location.state || {};
  const prevDrawerState = React.useRef(isDrawerOpen);
  const navigate = useNavigate();
useEffect(() => {
  if (!prevDrawerState.current && isDrawerOpen) {
    setFirstPromptDone(false);
    localStorage.setItem("firstPromptDone", "false");
    setChatHistory([]);
    localStorage.setItem("firstPromptDone", "false");
    console.log(JSON.stringify(localStorage, null, 2));
    setPrompt("");
  }

  prevDrawerState.current = isDrawerOpen;
}, [isDrawerOpen]);




  const GEMINI_API_KEY = "AIzaSyCjxEkSZKRdCohde0z5FKaZAO624gF3wms";

  // 🔧 Update chat width based on sidebar state
  const chatWidthClass = isDrawerOpen ? "w-[80%]" : "w-full";

  useEffect(() => {
    if (reset) {
      setChatHistory([]);
      setFirstPromptDone(false);
      setPrompt("");
    }
  }, [reset]);

  const handleSubmit = async (e) => {
    if (e.key === "Enter" && prompt.trim() !== "") {
      const userMessage = { sender: "user", text: prompt };
      setChatHistory((prev) => [...prev, userMessage]);
      setIsTyping(true);

      if (!firstPromptDone) {
  // Save prompt in localStorage
  const existing = JSON.parse(localStorage.getItem("recentPrompts")) || [];
  const newSet = [prompt, ...existing.slice(0, 4)];
  localStorage.setItem("recentPrompts", JSON.stringify(newSet));

  setFirstPromptDone(true);
localStorage.setItem("firstPromptDone", "true");
// Now mark first prompt as done
}


      try {
        const res = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
          }
        );

        const geminiResponse =
          res.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
        const botMessage = { sender: "bot", text: geminiResponse };

        setChatHistory((prev) => [...prev, botMessage]);
      } catch (err) {
        const errorMessage = { sender: "bot", text: "Error fetching response." };
        setChatHistory((prev) => [...prev, errorMessage]);
      } finally {
        setPrompt("");
        setIsTyping(false);
      }
    }
  };
  const shiftClass = isDrawerOpen ? "ml-[20%]" : "ml-0";
  const inputBarShift = isDrawerOpen ? "left-[40%]" : "left-40";
  

  return (

    <div
      className={`transition-all duration-300 ease-in-out ${shiftClass} w-full h-full`}
    >

    <div className="bg-black h-screen text-white flex flex-col justify-between px-6 py-4 overflow-y-auto relative">
      {/* Chat history area */}
      <div className="flex flex-col space-y-4 overflow-y-auto mb-28">
        {chatHistory.length === 0 && (
          <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-center text-white mt-10">
            Ask me anything
          </h1>
        )}

        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xl px-4 py-3 rounded-xl text-sm ${
              msg.sender === "user"
                ? "bg-[#2d2d2d] self-end text-right"
                : "bg-[#1e1e1e] self-start text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {isTyping && (
          <div className="bg-[#1e1e1e] self-start px-4 py-3 rounded-xl text-sm text-gray-400">
            <span className="animate-pulse">Typing<span className="dots">...</span></span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className={`fixed bottom-4 ${inputBarShift} right-4 bg-[#1e1e1e] rounded-2xl shadow-md px-4 py-2 z-10 transition-all duration-300`}>

        <input
          type="text"
          placeholder="Ask anything"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleSubmit}
          className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-400 text-sm px-2 py-3"
        />

        <div className="flex items-center justify-between mt-2 text-gray-400">
          <div className="flex items-center gap-2">
            <FiPlus className="text-lg" />
            <FiSliders className="text-lg" />
            <span className="text-sm">Tools</span>
          </div>

          <div className="flex items-center gap-4">
            <FiMic className="text-lg" />
            <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center">
              <BsSoundwave className="text-base" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Trone;
