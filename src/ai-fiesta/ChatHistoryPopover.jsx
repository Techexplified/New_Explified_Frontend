import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function ChatHistoryPopover({
  visible,
  chats,
  onSelectChat,
  onNewChat,
  onDeleteChat, // ✅ new prop for delete
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute left-14 top-0 z-50 bg-gray-900 text-gray-200 rounded-xl shadow-lg p-3 w-56 border border-gray-800"
        >
          {/* Header */}
          <div className="text-sm font-semibold mb-2">Chat History</div>

          {/* Chat list */}
          <div className="max-h-56 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-700">
            {chats?.length > 0 ? (
              chats.map((chat, idx) => (
                <div
                  key={chat.id || idx}
                  className="flex items-center justify-between group px-2 py-1.5 rounded-md hover:bg-gray-800 transition"
                >
                  {/* Chat title button */}
                  <button
                    onClick={() => onSelectChat(chat.id)}
                    className="flex-1 text-left text-sm text-gray-300 truncate"
                  >
                    {chat.title || `Chat ${idx + 1}`}
                  </button>

                  {/* Delete button (only visible on hover) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat?.(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition"
                    title="Delete chat"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-500 italic py-2">No chats yet</div>
            )}
          </div>

          {/* New chat button */}
          <button
            onClick={onNewChat}
            className="mt-3 w-full bg-[#23B5B5]/10 text-[#23B5B5] text-sm font-semibold py-1.5 rounded-lg border border-[#23B5B5]/20 hover:bg-[#23B5B5]/20 transition"
          >
            + New Chat
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
