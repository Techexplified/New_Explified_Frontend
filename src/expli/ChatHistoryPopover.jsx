import React, { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Edit3,
  MessageSquare,
  MoreVertical,
  Plus,
  Share,
  Share2,
  Trash,
  Trash2,
} from "lucide-react";
import { useExpli } from "../context/ExpliContext";
import { formatText } from "../utils/data/TroneData";
import { AiOutlineOpenAI } from "react-icons/ai";
import { RiGeminiLine } from "react-icons/ri";
import ChatMenuPortal from "./ChatMenuPortal";
import { useNavigate } from "react-router-dom";

export default function ChatHistoryPopover({ visible }) {
  const {
    newChat,
    chatHistory,
    setChatHistory,
    setCurrentMessages,
    setCurrentMessagesGemini,
    setCurrentMessagesOpenAI,
  } = useExpli();
  const [hoverChat, setHoverChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ new state
  const [menuOpen, setMenuOpen] = useState(null);
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return chatHistory;
    return chatHistory.filter((item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, chatHistory]);
  const [portalPos, setPortalPos] = useState(null);
  const navigate = useNavigate();

  const handleHistoryClick = useCallback(
    (session) => {
      // Reset all panels
      setCurrentMessages([]);
      setCurrentMessagesOpenAI([]);
      setCurrentMessagesGemini([]);

      // Temporary arrays for each tool
      const messagesExpli = [];
      const messagesOpenAI = [];
      const messagesGemini = [];

      // Loop through all Q&A in that session
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

      // Update states
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-14 top-0 z-50 bg-gray-900 text-gray-200 rounded-xl shadow-lg p-3 w-56 border border-gray-800"
          >
            {/* Header */}
            <div className="text-sm font-semibold mb-2">Chat History</div>

            {/* Chat list */}
            <div className="max-h-56 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-700">
              {filteredHistory && filteredHistory.length > 0 ? (
                <>
                  {filteredHistory.map((item, index) => (
                    <div
                      key={item.id}
                      onMouseEnter={() => setHoverChat(item.id)} // set hovered chat ID
                      onMouseLeave={() => setHoverChat(null)} // reset when leaving
                      onClick={() => {
                        navigate("/expli");
                        handleHistoryClick(item);
                        setMenuOpen(false);
                      }}
                      className="group hover:bg-gray-800  rounded-lg px-2 py-1.5 transition-all duration-200 cursor-pointer relative"
                    >
                      <div className="flex items-center justify-between">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: formatText(item?.qa[0]?.promptSummary),
                          }}
                          className="text-sm text-gray-300 group-hover:text-white truncate"
                        />

                        {/* {hoverChat === item.id && (
                          <div className="flex gap-2 mt-1">
                            {item.qa[0].answers.map((ans) => (
                              <span
                                key={ans.tool}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700 text-gray-300 flex items-center justify-center"
                              >
                                {ans.tool === "expli" && <Plus size={10} />}
                                {ans.tool === "openai" && (
                                  <AiOutlineOpenAI size={10} />
                                )}
                                {ans.tool === "gemini" && (
                                  <RiGeminiLine size={10} />
                                )}
                              </span>
                            ))}
                          </div>
                        )} */}

                        <div className="relative">
                          {/* <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(menuOpen === item.id ? null : item.id);
                          }}
                          className={`${
                            hoverChat === item.id ? "opacity-100" : "opacity-0"
                          } pl-1 rounded text-gray-400 hover:text-white`}
                        >
                          <MoreVertical size={16} />
                        </button> */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = e.target.getBoundingClientRect();

                              setPortalPos({
                                top: rect.top - 6, // nicer vertical alignment
                                left: rect.right + 10, // appear to the right side
                              });

                              setMenuOpen(
                                menuOpen === item.id ? null : item.id
                              );
                            }}
                            className={`${
                              hoverChat === item.id
                                ? "opacity-100"
                                : "opacity-0"
                            } pl-1 rounded text-gray-400 hover:text-white`}
                          >
                            <MoreVertical size={16} />
                          </button>

                          {/* {menuOpen === item.id && (
                          <div className="absolute right-0 mt-2 w-36 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-[100]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Share clicked:", item);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-t-lg"
                            >
                              <Share size={14} /> Share
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Rename clicked:", item);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
                            >
                              <Edit size={14} /> Rename
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const updatedHistory = chatHistory.filter(
                                  (h) => h.id !== item.id
                                );
                                setChatHistory(updatedHistory);
                                setMenuOpen(null);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 rounded-b-lg"
                            >
                              <Trash size={14} /> Delete
                            </button>
                          </div>
                        )} */}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
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

            {/* New chat button */}
            <button
              onClick={() => {
                navigate("/expli");
                newChat();
              }}
              className="mt-3 w-full bg-[#23B5B5]/10 text-[#23B5B5] text-sm font-semibold py-1.5 rounded-lg border border-[#23B5B5]/20 hover:bg-[#23B5B5]/20 transition"
            >
              + New Chat
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
