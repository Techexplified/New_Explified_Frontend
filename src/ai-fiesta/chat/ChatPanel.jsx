import React from "react";
import { motion } from "framer-motion";

export default function ChatPanel({ model, isActive, onToggleActive }) {
  return (
    <section
      className={`flex flex-col border-r border-[#656565] bg-[#121212] last:border-none overflow-hidden transition-all duration-300 ${
        isActive ? "opacity-100" : "opacity-60"
      }`}
    >
      {/* Header */}
      <header className="flex items-center justify-between h-14 px-4 border-b border-[#1E1E1E] bg-[#161616]">
        {/* Left: Model icon + name */}
        <div className="flex items-center gap-2">
          <div className="text-[#23B5B5] text-lg">{model.icon}</div>
          <span className="font-semibold text-gray-100 tracking-tight">
            {model.name}
          </span>
        </div>

        {/* Right: Toggle switch (on/off) */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">Chat Mode</span>

          <button
            onClick={onToggleActive}
            aria-pressed={isActive}
            className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
              isActive ? "bg-[#23B5B5]" : "bg-gray-600/30"
            }`}
            title={isActive ? "Disable model" : "Enable model"}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                isActive ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </header>

      {/* Messages */}
      {isActive ? (
        <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin scrollbar-thumb-[#1E1E1E]">
          <div className="space-y-3">
            {model.messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm font-medium shadow-sm ${
                    msg.role === "user"
                      ? "bg-[#1d7b7b] text-white"
                      : "bg-[#1C1C1C] text-gray-400 border border-[#2A2A2A]"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-600 text-sm italic">
          Chat mode is off
        </div>
      )}
    </section>
  );
}
