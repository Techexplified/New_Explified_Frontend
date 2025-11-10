import React, { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, MessageSquare, MoreVertical, Share, Trash } from "lucide-react";
import { useExpli } from "../context/ExpliContext";
import { formatText } from "../utils/data/TroneData";
import ChatMenuPortal from "./ChatMenuPortal";
import { useNavigate } from "react-router-dom";

export default function ChatHistoryPopover({ visible, onClose }) {
  const {
    newChat,
    chatHistory,
    setChatHistory,
    setCurrentMessages,
    setCurrentMessagesGemini,
    setCurrentMessagesOpenAI,
  } = useExpli();

  const [hoverChat, setHoverChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [portalPos, setPortalPos] = useState(null);
  const navigate = useNavigate();

  // ✅ FIXED SEARCH LOGIC (checks question + nested qa text)
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return chatHistory;
    const q = searchQuery.toLowerCase();
    return chatHistory.filter((item) => {
      const mainQuestion = item?.question?.toLowerCase() || "";
      const qaSummary = item?.qa?.[0]?.promptSummary?.toLowerCase() || "";
      const qaQuestion = item?.qa?.[0]?.question?.toLowerCase() || "";
      return (
        mainQuestion.includes(q) ||
        qaSummary.includes(q) ||
        qaQuestion.includes(q)
      );
    });
  }, [searchQuery, chatHistory]);

  const handleHistoryClick = useCallback(
    (session) => {
      setCurrentMessages([]);
      setCurrentMessagesOpenAI([]);
      setCurrentMessagesGemini([]);

      const messagesExpli = [];
      const messagesOpenAI = [];
      const messagesGemini = [];

      session.qa.forEach((qaItem) => {
        const userMsg = {
          sender: "user",
          text: qaItem.question,
          timestamp: qaItem.timestamp,
        };

        qaItem.answers.forEach((ans) => {
          const botMsg = {
            sender: "bot",
            text: ans.text,
            timestamp: qaItem.timestamp,
          };
          if (ans.tool === "expli") {
            messagesExpli.push(userMsg, botMsg);
          } else if (ans.tool === "openai") {
            messagesOpenAI.push(userMsg, botMsg);
          } else if (ans.tool === "gemini") {
            messagesGemini.push(userMsg, botMsg);
          }
        });
      });

      setCurrentMessages(messagesExpli);
      setCurrentMessagesOpenAI(messagesOpenAI);
      setCurrentMessagesGemini(messagesGemini);
    },
    [setCurrentMessages, setCurrentMessagesOpenAI, setCurrentMessagesGemini]
  );

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative bg-[#0d1117] text-gray-200 rounded-xl shadow-xl p-5 w-[650px] h-[60vh] overflow-hidden border border-gray-800"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3 border-b border-gray-800 pb-2">
                <h2 className="text-lg font-semibold">Chat History</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white text-lg font-bold px-2"
                >
                  ✕
                </button>
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Search chat history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full mb-3 px-3 py-2 bg-[#1b1f24] border border-gray-700 rounded-md text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#23b5b5]"
              />

              {/* Chat list */}
              <div className="max-h-[55vh] overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-700">
                {filteredHistory && filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <div
                      key={item.id}
                      onMouseEnter={() => setHoverChat(item.id)}
                      onMouseLeave={() => setHoverChat(null)}
                      onClick={() => {
                        navigate("/expli");
                        handleHistoryClick(item);
                        setMenuOpen(false);
                        onClose();
                      }}
                      className="group hover:bg-[#1c1f24] rounded-lg px-2 py-1.5 transition-all duration-200 cursor-pointer relative"
                    >
                      <div className="flex items-center justify-between">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: formatText(
                              item?.qa?.[0]?.promptSummary || item?.question
                            ),
                          }}
                          className="text-sm text-gray-300 group-hover:text-white truncate"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.target.getBoundingClientRect();
                            setPortalPos({
                              top: rect.top - 6,
                              left: rect.right + 10,
                            });
                            setMenuOpen(menuOpen === item.id ? null : item.id);
                          }}
                          className={`pl-1 rounded text-gray-400 hover:text-white transition-opacity ${
                            hoverChat === item.id ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    <div className="text-center">
                      <MessageSquare
                        size={24}
                        className="mx-auto mb-2 opacity-50"
                      />
                      <p className="text-sm">No chat history found</p>
                    </div>
                  </div>
                )}
              </div>

              {/* New Chat Button */}
              <button
                onClick={() => {
                  navigate("/expli");
                  newChat();
                  onClose();
                }}
                className="mt-4 w-full bg-[#23B5B5]/10 text-[#23B5B5] text-sm font-semibold py-2 rounded-lg border border-[#23B5B5]/20 hover:bg-[#23B5B5]/20 transition"
              >
                + New Chat
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat action menu portal */}
      {menuOpen && portalPos && (
        <ChatMenuPortal
          position={portalPos}
          onClose={() => {
            setMenuOpen(null);
            setPortalPos(null);
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Share clicked:", menuOpen);
              setMenuOpen(null);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-t-lg"
          >
            <Share size={14} /> Share
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Rename clicked:", menuOpen);
              setMenuOpen(null);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
          >
            <Edit size={14} /> Rename
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const updatedHistory = chatHistory.filter(
                (h) => h.id !== menuOpen
              );
              setChatHistory(updatedHistory);
              setMenuOpen(null);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 rounded-b-lg"
          >
            <Trash size={14} /> Delete
          </button>
        </ChatMenuPortal>
      )}
    </>
  );
}
