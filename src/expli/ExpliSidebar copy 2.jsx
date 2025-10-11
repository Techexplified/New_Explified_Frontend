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
  X,
  CircleUserRound,
  Grip,
} from "lucide-react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { Zap, FileText } from "lucide-react";
import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { INTEGRATION_PROVIDERS, formatText } from "../utils/data/TroneData";
import { AiOutlineOpenAI } from "react-icons/ai";
import { RiGeminiLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { ExplifiedLogo } from "../assets";

function ExpliSidebar({
  link,
  chatHistory = [],
  setChatHistory,
  setCurrentMessages,
  setCurrentMessagesGemini,
  setCurrentMessagesOpenAI,
  onAddClick,
  tools = [],
  closedChats,
  setClosedChats,
  handleRemoveProvider,
  sidebarPinned,
  isSidebarOpen,
  setSidebarPinned,
  setIsSidebarOpen,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchProviders, setSearchProviders] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const user = useSelector((state) => state.user);

  const navigate = useNavigate();
  const location = useLocation();
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return chatHistory;
    return chatHistory.filter((item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, chatHistory]);

  const handleHistoryClick = (session) => {
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
  };

  let timeoutId;
  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div
      onMouseEnter={() => !sidebarPinned && setIsSidebarOpen(true)}
      onMouseLeave={() => !sidebarPinned && setIsSidebarOpen(false)}
      className={`h-screen ${
        isSidebarOpen || sidebarPinned
          ? "w-72 px-4"
          : "w-16 px-2 overflow-hidden"
      } absolute sm:relative z-50 overflow-y-auto sidebar-scroll 
        bg-gradient-to-b from-black via-gray-950 to-black
        border-r border-gray-800/50 
        flex flex-col justify-between transition-all duration-300 ease-in-out
        shadow-2xl shadow-black/50`}
      style={{
        background:
          "linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)",
      }}
    >
      {/* Glow effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-cyan-500/5 pointer-events-none opacity-30" />

      {/* Content wrapper */}
      <div className="relative flex flex-col justify-between h-full pb-4">
        <div>
          {/* Header */}
          <div
            className={`flex items-center justify-between gap-3 py-5 mb-6 relative`}
          >
            {/* Logo section with glow */}
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                <img
                  className="h-7 relative z-10 filter brightness-110"
                  alt="Logo"
                  src={ExplifiedLogo}
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                Expli
              </h1>
            </div>

            <div className="flex items-center gap-1">
              {/* Pin button with enhanced styling */}
              <button
                onClick={() => setSidebarPinned(!sidebarPinned)}
                className={`p-2 hidden sm:inline-block rounded-lg transition-all duration-300 group ${
                  sidebarPinned
                    ? "bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 text-cyan-400 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
                    : "bg-gray-900/50 text-gray-500 hover:bg-gray-800 hover:text-gray-300 hover:shadow-lg hover:shadow-black/20"
                }`}
              >
                <div className="relative">
                  {sidebarPinned ? <PinOff size={16} /> : <Pin size={16} />}
                  <div
                    className={`absolute inset-0 ${
                      sidebarPinned ? "bg-cyan-400" : "bg-gray-400"
                    } blur-xl opacity-0 group-hover:opacity-40 transition-opacity`}
                  />
                </div>
              </button>

              {/* Mobile close button */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 sm:hidden rounded-lg bg-gray-900/50 text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-all duration-200"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* New Chat Button with enhanced design */}
          <button
            onClick={onAddClick}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800
              border border-gray-700/50 hover:border-cyan-500/30
              text-gray-100 font-medium py-3 px-4 rounded-xl transition-all duration-300
              hover:shadow-xl hover:shadow-cyan-500/10 hover:scale-[1.02]"
          >
            {/* Animated gradient overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 
              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
            />

            <div className="relative flex items-center justify-center gap-2.5">
              <div className="relative">
                <Plus
                  size={18}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />
              </div>
              {isSidebarOpen && <span className="font-medium">New Chat</span>}
            </div>
          </button>

          {/* Chat History Section */}
          {isSidebarOpen ? (
            <div className="mt-6 space-y-1">
              {/* Section header */}
              <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Recent Chats
                </h3>
                <span className="text-xs text-gray-600 bg-gray-900 px-2 py-0.5 rounded-full">
                  {filteredHistory.length}
                </span>
              </div>

              {/* Chat items */}
              {filteredHistory && filteredHistory.length > 0 ? (
                <div className="space-y-1.5">
                  {filteredHistory.map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => handleHistoryClick(item)}
                      className="group relative bg-gradient-to-r from-gray-900/50 to-gray-900/30 
                        hover:from-gray-800/60 hover:to-gray-800/40
                        border border-gray-800/50 hover:border-cyan-500/20
                        rounded-lg px-3 py-2.5 transition-all duration-200 cursor-pointer
                        hover:shadow-lg hover:shadow-cyan-500/5 hover:translate-x-0.5"
                    >
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />

                      <div className="relative flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: formatText(item?.qa[0]?.promptSummary),
                            }}
                            className="text-sm text-gray-400 group-hover:text-gray-200 line-clamp-2 transition-colors duration-200"
                          />

                          {/* Tool badges */}
                          <div className="flex gap-1.5 mt-2">
                            {item.qa[0].answers.map((ans) => (
                              <span
                                key={ans.tool}
                                className="inline-flex items-center justify-center px-2 py-0.5 rounded-md
                                  bg-gray-800/60 border border-gray-700/50 group-hover:border-gray-600
                                  transition-all duration-200"
                              >
                                {ans.tool === "expli" && (
                                  <Plus size={11} className="text-cyan-400" />
                                )}
                                {ans.tool === "openai" && (
                                  <AiOutlineOpenAI
                                    size={11}
                                    className="text-green-400"
                                  />
                                )}
                                {ans.tool === "gemini" && (
                                  <RiGeminiLine
                                    size={11}
                                    className="text-blue-400"
                                  />
                                )}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Menu button */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpen(
                                menuOpen === item.id ? null : item.id
                              );
                            }}
                            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 
                              hover:bg-gray-700/50 text-gray-500 hover:text-gray-300
                              transition-all duration-200"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {/* Dropdown menu with enhanced styling */}
                          {menuOpen === item.id && (
                            <div
                              className="absolute right-0 mt-2 w-40 bg-gray-950 border border-gray-800 
                              rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-[100]
                              transition-all duration-200"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Share clicked:", item);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-300 
                                  hover:bg-gray-800/50 hover:text-white transition-colors duration-150"
                              >
                                <Share2 size={14} />
                                <span>Share</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Rename clicked:", item);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-300 
                                  hover:bg-gray-800/50 hover:text-white transition-colors duration-150"
                              >
                                <Edit3 size={14} />
                                <span>Rename</span>
                              </button>
                              <div className="border-t border-gray-800 mt-1 pt-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const updatedHistory = chatHistory.filter(
                                      (h) => h.id !== item.id
                                    );
                                    setChatHistory(updatedHistory);
                                    setMenuOpen(null);
                                  }}
                                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 
                                    hover:bg-red-500/10 hover:text-red-300 transition-colors duration-150"
                                >
                                  <Trash2 size={14} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-600">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <MessageSquare
                        size={28}
                        className="mx-auto mb-3 opacity-30"
                      />
                      <div className="absolute inset-0 bg-gray-400 blur-2xl opacity-10" />
                    </div>
                    <p className="text-sm font-medium">No chat history</p>
                    <p className="text-xs text-gray-700 mt-1">
                      Start a new conversation
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 flex justify-center">
              <div className="relative">
                <MessageSquare className="text-gray-600" size={20} />
                <div className="absolute inset-0 bg-gray-400 blur-xl opacity-20" />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 mt-auto pt-4 border-t border-gray-800/50">
          {/* Profile Section */}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            <button
              onClick={() => navigate("/profile")}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
                transition-all duration-200 group
                ${
                  location.pathname === "/profile"
                    ? "bg-gradient-to-r from-cyan-500/10 to-cyan-600/5 text-cyan-400 border border-cyan-500/20"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-900/50"
                }`}
            >
              <CircleUserRound className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && (
                <span className="font-medium truncate">{user?.name}</span>
              )}
            </button>

            {/* Enhanced dropdown menu */}
            {isOpen && (
              <div
                className="absolute right-0 bottom-12 min-w-[240px]
                  bg-gray-950 backdrop-blur-2xl 
                  border border-gray-800 rounded-2xl shadow-2xl shadow-black/50
                  p-4 z-50 transition-all duration-200"
              >
                {/* Enterprise link */}
                <Link
                  className="w-full h-10 mb-3 rounded-lg border border-gray-800 
                    bg-gradient-to-r from-gray-900/50 to-gray-800/50
                    text-sm font-medium text-gray-200
                    hover:border-cyan-500/30 hover:from-cyan-500/10 hover:to-cyan-600/5
                    hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10
                    transition-all duration-200 flex items-center justify-center group"
                  to="https://explified.com/explified-labs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>For Enterprises</span>
                  <Zap
                    size={14}
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>

                {/* Quick actions grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { icon: Plus, to: "/expli", tooltip: "Expli" },
                    { icon: FileText, to: "/tasks", tooltip: "Tasks" },
                  ].map(({ icon: Icon, to, tooltip }, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        navigate(to);
                        setIsOpen(false);
                      }}
                      className="group relative h-10 flex items-center justify-center rounded-lg 
                        bg-gray-900/50 border border-gray-800
                        hover:bg-gray-800/50 hover:border-gray-700
                        text-gray-400 hover:text-gray-200
                        transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                      <span
                        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 
                        bg-gray-800 text-xs text-gray-300 rounded opacity-0 
                        group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                      >
                        {tooltip}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-2 mb-3">
                  {[{ icon: Search, to: "/discover", label: "Discover" }].map(
                    ({ icon: Icon, to, label }, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          navigate(to);
                          setIsOpen(false);
                        }}
                        className="h-10 flex items-center justify-center gap-2 rounded-lg 
                          bg-gray-900/50 border border-gray-800
                          hover:bg-gray-800/50 hover:border-gray-700
                          text-gray-400 hover:text-gray-200
                          transition-all duration-200"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{label}</span>
                      </button>
                    )
                  )}
                </div>

                {/* Workflows section */}
                <div className="mb-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Workflows
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: Workflow, to: "/workflows", label: "Flows" },
                      { icon: Zap, to: "/integrations", label: "Integrate" },
                    ].map(({ icon: Icon, to, label }, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          navigate(to);
                          setIsOpen(false);
                        }}
                        className="h-10 flex items-center justify-center gap-2 rounded-lg 
                          bg-gray-900/50 border border-gray-800
                          hover:bg-gray-800/50 hover:border-gray-700
                          text-gray-400 hover:text-gray-200
                          transition-all duration-200"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* All Tools */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    All Tools
                  </h3>
                  <button
                    onClick={() => {
                      navigate("/alltools");
                      setIsOpen(false);
                    }}
                    className="w-full h-12 rounded-lg bg-gradient-to-r from-gray-900/50 to-gray-800/50
                      border border-gray-800 hover:border-cyan-500/20
                      hover:from-cyan-500/5 hover:to-cyan-600/5
                      text-gray-400 hover:text-cyan-400
                      transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    <Grip className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-sm font-medium">Browse All</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Learn More Section */}
          <div>
            <Link to={link}>
              <div
                className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-300 
                transition-colors duration-200 py-2 group"
              >
                <IoIosInformationCircleOutline className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                {isSidebarOpen && (
                  <span className="text-sm underline decoration-gray-700 hover:decoration-gray-500">
                    Learn More
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpliSidebar;
