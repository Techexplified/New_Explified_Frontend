import React, { useState, useRef, useEffect } from "react";
import { Plus, Paperclip, Globe, Image, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatInput({ onSend, onAttach, onImageUpload, onDeepSearch }) {
  const [text, setText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Auto-grow textarea height but limit max height
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 200) + "px"; // limit height
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend?.(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full flex justify-center py-4 px-3 border-t border-[#1E1E1E] bg-[#0E0E0E]">
      <div className="relative w-full max-w-4xl bg-[#1A1A1A] rounded-3xl flex items-end px-5 py-3 border border-[#2A2A2A] shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:border-[#23B5B5]/40 transition-all duration-200">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Ask anything..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none overflow-y-auto bg-transparent text-gray-100 placeholder-gray-500 text-[15px] focus:outline-none pr-24 max-h-[200px]"
        />

        {/* Buttons */}
        <div className="absolute right-4 bottom-3 flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#2A2A2A] hover:bg-[#23B5B5]/20 transition"
            >
              <Plus size={18} className="text-gray-300" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-10 right-0 w-44 bg-[#111] border border-[#2A2A2A] rounded-xl shadow-lg overflow-hidden z-50"
                >
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-[#23B5B5]/10 text-sm w-full text-left"
                  >
                    <Paperclip size={15} /> Attach File
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onAttach?.(f);
                      e.target.value = "";
                    }}
                  />

                  <button
                    onClick={() => imageInputRef.current.click()}
                    className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-[#23B5B5]/10 text-sm w-full text-left"
                  >
                    <Image size={15} /> Upload Image
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onImageUpload?.(f);
                      e.target.value = "";
                    }}
                  />

                  <button
                    onClick={() => onDeepSearch?.(text)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-[#23B5B5]/10 text-sm w-full text-left"
                  >
                    <Globe size={15} /> Deep Search
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleSend}
            className="flex items-center justify-center bg-[#2A2A2A] text-gray-300 hover:text-[#23B5B5] rounded-full w-8 h-8 transition"
          >
            <Mic size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
