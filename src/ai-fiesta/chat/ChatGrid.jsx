import React from "react";
import ChatPanel from "./ChatPanel";
import ChatInput from "./ChatInput";
import { motion, AnimatePresence } from "framer-motion"

export default function ChatGrid({ chat, onSendMessage, onToggleModelEnabled }) {
  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0E0E0E] text-gray-400">
        <div className="text-center">
          <div className="text-2xl font-semibold mb-2">No chat selected</div>
          <p className="text-sm text-gray-500">Click + to start a new chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0E0E0E]">
<div className="flex-1 flex border-b border-[#1E1E1E] overflow-x-auto scrollbar-thin scrollbar-thumb-[#2A2A2A]">
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
          transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
          className="flex-1 min-w-[400px] border-r border-gray-700"
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

      <ChatInput onSend={onSendMessage} />
    </div>
  );
}
