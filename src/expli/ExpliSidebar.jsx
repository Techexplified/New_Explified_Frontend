import {
  MessageSquare,
  Trash2,
  Workflow,
  PinOff,
  Pin,
  Search,
  Plus,
  MoreVertical,
  Share2,
  Edit3,
  Archive,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { INTEGRATION_PROVIDERS } from "../utils/data/TroneData";
import { AiOutlineOpenAI } from "react-icons/ai";
import { RiGeminiLine } from "react-icons/ri";

function ExpliSidebar({
  link,
  id,
  chatHistory = [],
  setChatHistory,
  setCurrentMessages,
  setCurrentMessagesGemini,
  setCurrentMessagesOpenAI,
  onAddClick,
  tools = [],
  setCurrentTool = () => {},
  setShowIntegrationsModal,
}) {
  // const [selectedProvider, setSelectedProvider] = useState("expli");
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ new state
  const [searchProviders, setSearchProviders] = useState(""); // ✅ new state
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(null);

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return chatHistory;
    return chatHistory.filter((item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, chatHistory]);

  const handleHistoryClick = (item) => {
    // Reset all panels
    setCurrentMessages([]);
    setCurrentMessagesOpenAI([]);
    setCurrentMessagesGemini([]);

    // Load question + answers into respective bots
    const userMsg = {
      sender: "user",
      text: item.question,
      timestamp: item.timestamp,
    };

    item.answers.forEach((ans) => {
      const botMsg = {
        sender: "bot",
        text: ans.text,
        timestamp: item.timestamp,
      };

      if (ans.tool === "expli") {
        setCurrentMessages([userMsg, botMsg]);
      } else if (ans.tool === "openai") {
        setCurrentMessagesOpenAI([userMsg, botMsg]);
      } else if (ans.tool === "gemini") {
        setCurrentMessagesGemini([userMsg, botMsg]);
      }
    });
  };
  return (
    <>
      <div
        onMouseEnter={() => !sidebarPinned && setIsOpen(true)}
        onMouseLeave={() => !sidebarPinned && setIsOpen(false)}
        className={`h-screen ${
          isOpen || sidebarPinned ? "w-72  px-3" : "w-0 px-0 overflow-hidden"
        } relative z-50 overflow-y-scroll sidebar-scroll bg-gradient-to-b from-gray-900/50 to-black/95 backdrop-blur-2xl 
        border-r border-minimal-primary/30 shadow-2xl shadow-minimal-primary/10
        flex flex-col justify-between transition-all duration-500 ease-in-out`}
      >
        {/* Top section */}
        <div className="mt-4 space-y-4">
          {/* Header */}
          <div className="border-b border-minimal-primary/30 pb-2">
            <div className="flex items-center justify-between gap-3 mb-2">
              {isOpen && (
                <>
                  <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white via-minimal-primary to-cyan-400 bg-clip-text text-transparent">
                    Expli
                  </h1>
                  <div className="flex items-center justify-between gap-1">
                    {/* Workflow button */}
                    <button
                      onClick={() =>
                        navigate(`w?id=${id}`, { relative: "path" })
                      }
                      className="p-2 rounded-md hover:bg-gray-800 transition-colors"
                    >
                      <Workflow size={18} className="text-white" />
                    </button>

                    {/* Pin button */}
                    <button
                      onClick={() => {
                        setSidebarPinned(!sidebarPinned);
                      }}
                      className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                        sidebarPinned
                          ? "bg-minimal-primary/20 text-minimal-primary shadow-lg shadow-minimal-primary/25"
                          : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white"
                      }`}
                    >
                      {sidebarPinned ? <PinOff size={15} /> : <Pin size={15} />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Only render content when open */}
          {isOpen && (
            <div className="space-y-2">
              {/* New Chat */}
              <button
                onClick={onAddClick}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-gray-800/80 to-gray-700/80 
                hover:from-minimal-primary/20 hover:to-cyan-500/20 border border-gray-600/50 hover:border-minimal-primary/50
                text-white font-medium py-1.5 px-2 rounded-xl transition-all duration-300 hover:scale-105 
                hover:shadow-lg hover:shadow-minimal-primary/10"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-minimal-primary/0 to-minimal-primary/10 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="relative text-sm flex items-center justify-center gap-3">
                  <MessageSquare size={14} />
                  <span>New Chat</span>
                </div>
              </button>

              {/* Chat History */}
              <div className="bg-gray-900/30 rounded-xl p-1 border border-gray-700/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-minimal-primary" />
                    <h3 className="text-sm font-medium text-gray-300">
                      Chat History
                    </h3>
                  </div>

                  {/* <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="bg-gray-800/80 text-white text-xs rounded-lg px-3 py-1.5 border border-gray-600/50 
                    focus:border-minimal-primary/50 focus:outline-none transition-colors duration-200"
                  >
                    <option value="gemini">Gemini</option>
                    <option value="openai">OpenAI</option>
                    <option value="expli">Expli</option>
                  </select> */}
                </div>

                {/* ✅ Input Section (Search Bar) */}
                <div className="relative mb-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chats..."
                    className="w-full bg-gray-800/80 text-white text-xs rounded-lg px-3 py-1.5 pr-8 border border-gray-600/50 
                    focus:border-minimal-primary/50 focus:outline-none transition-colors duration-200"
                  />
                  <Search
                    size={14}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>

                {/* Filtered History */}
                {filteredHistory && filteredHistory.length > 0 ? (
                  <div className="space-y-2">
                    {filteredHistory.map((item, index) => (
                      <div
                        key={item.id}
                        onClick={() => handleHistoryClick(item)}
                        className="group bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/30 
    hover:border-minimal-primary/30 rounded-lg px-3 pt-1 pb-1.5 transition-all duration-200 cursor-pointer"
                      >
                        {/* Top row: question + 3-dot menu */}
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-300 group-hover:text-white truncate">
                            {item.question}
                          </p>

                          {/* 3-dot dropdown menu */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // prevent triggering history click
                                setMenuOpen(
                                  menuOpen === item.id ? null : item.id
                                );
                              }}
                              className="p-1 rounded hover:bg-gray-700/50 text-gray-400 hover:text-white"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {menuOpen === item.id && (
                              <div className="absolute right-0 mt-2 w-36 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-[100]">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Share clicked:", item);
                                  }}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-t-lg"
                                >
                                  <Share2 size={14} /> Share
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Rename clicked:", item);
                                  }}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                >
                                  <Edit3 size={14} /> Rename
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
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bottom row: tool icons */}
                        <div className="flex gap-2 mt-1">
                          {item.answers.map((ans) => (
                            <span
                              key={ans.tool}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700 text-gray-300 flex items-center justify-center"
                            >
                              {ans.tool === "expli" && <Plus size={15} />}
                              {ans.tool === "openai" && (
                                <AiOutlineOpenAI size={15} />
                              )}
                              {ans.tool === "gemini" && (
                                <RiGeminiLine size={15} />
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
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

              {/* Available Models */}
              <div className="">
                <h2 className="text-lg font-semibold mb-3 mt-10">
                  Available Keys
                </h2>

                {/* ✅ Input Section (Search Bar) */}
                <div className="relative mb-2">
                  <input
                    type="text"
                    value={searchProviders}
                    onChange={(e) => setSearchProviders(e.target.value)}
                    placeholder="Search keys..."
                    className="w-full bg-gray-800/80 text-white text-xs rounded-lg px-3 py-1.5 pr-8 border border-gray-600/50 
      focus:border-minimal-primary/50 focus:outline-none transition-colors duration-200"
                  />
                  <Search
                    size={14}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>

                {/* ✅ Filter + Render Providers */}
                <div className="space-y-2">
                  {INTEGRATION_PROVIDERS.filter((provider) =>
                    provider.name
                      .toLowerCase()
                      .includes(searchProviders.toLowerCase())
                  )
                    .slice(0, 3)
                    .map((provider) => {
                      const isActive = Boolean(tools[provider.id]); // check if key exists

                      return (
                        <div
                          key={provider.id}
                          onClick={() => setShowIntegrationsModal(true)}
                          className={`flex items-center gap-2 p-2 text-xs rounded-lg border transition-colors ${
                            isActive
                              ? "bg-[#23b5b5]/20 border-[#23b5b5]"
                              : "bg-gray-800/50 border-gray-700"
                          }`}
                        >
                          {/* name */}
                          <div className="text-white">{provider.name}</div>

                          {/* active indicator */}
                          <div className="ml-auto">
                            {isActive ? (
                              <span className="text-green-400 text-xs font-semibold">
                                Active
                              </span>
                            ) : (
                              <span className="text-gray-500 text-xs">
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        {isOpen && (
          <div className="my-4 space-y-4">
            <Link to={link}>
              <div className="underline text-[#23b5b5] flex items-center justify-center gap-2">
                <span>Learn More</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default ExpliSidebar;
