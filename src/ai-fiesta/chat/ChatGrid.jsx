import React from "react";
import ChatPanel from "./ChatPanel";
import ChatInput from "./ChatInput";
import { motion, AnimatePresence } from "framer-motion";
import { FaPenFancy } from "react-icons/fa";

export default function ChatGrid({
  chat,
  onSendMessage,
  onToggleModelEnabled,
  onNewChat,
}) {
  // 🌙 Empty state (no chat selected)
  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0E0E0E] text-white select-none">
        {/* Brand Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[#23b5b5] to-[#66d2d2] text-transparent bg-clip-text"
        >
          Explii
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-400 mt-2 text-sm"
        >
          Start exploring your ideas, notes, and chats
        </motion.p>

        {/* ✏️ Note Input Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 w-full max-w-2xl px-6"
        >
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 shadow-lg hover:shadow-[0_0_25px_#23b5b530] transition">
            <div className="flex items-start gap-3">
              <FaPenFancy className="text-[#23b5b5] mt-1" size={22} />
              <textarea
                placeholder="Start a new note or chat..."
                className="w-full bg-transparent resize-none outline-none text-gray-100 placeholder-gray-500 text-lg leading-relaxed min-h-[100px] focus:ring-0"
                rows={4}
              />
            </div>

            <div className="flex justify-end mt-4">
              <motion.button
                onClick={onNewChat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2 bg-[#23b5b5] text-black font-semibold rounded-xl hover:bg-[#1fa3a3] transition shadow-md hover:shadow-[0_0_12px_#23b5b550]"
              >
                Start
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // 💬 Active chat view
  return (
    <div className="flex-1 flex flex-col bg-[#0E0E0E] h-full">
      {/* Scrollable chat content */}
      <div className="flex-1 flex overflow-x-auto overflow-y-hidden border-b border-[#1E1E1E] scrollbar-thin scrollbar-thumb-[#2A2A2A]">
        <AnimatePresence initial={false}>
          {chat.models
            .filter((m) => m.enabled)
            .map((model) => (
              <motion.div
                key={model.id}
                layout
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -50 }}
                transition={{
                  duration: 0.4,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                className="flex-1 min-w-[400px] border-r border-[#1E1E1E] overflow-y-auto"
              >
                <ChatPanel
                  model={model}
                  isActive={model.enabled}
                  onToggleActive={() => onToggleModelEnabled(model.id)}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* Fixed bottom input */}
      <div className="sticky bottom-0 bg-[#0E0E0E]">
        <ChatInput onSend={onSendMessage} />
      </div>
    </div>
  );
}
