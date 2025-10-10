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
import Logo from "../reusable_components/Logo";
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
  // const [selectedProvider, setSelectedProvider] = useState("expli");
  // const [sidebarPinned, setSidebarPinned] = useState(false);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ new state
  const [searchProviders, setSearchProviders] = useState(""); // ✅ new state
  const [menuOpen, setMenuOpen] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const user = useSelector((state) => state.user);
  console.log(user);

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
          ? "w-72  px-3"
          : "w-12 px-3 overflow-hidden"
      } absolute sm:relative z-50 h-screen  overflow-y-scroll sidebar-scroll bg-gradient-to-b from-black from-60% to-[#23b5b5]/60 backdrop-blur-2xl 
        border-r border-minimal-primary/30 shadow-2xl shadow-minimal-primary/10
        flex flex-col justify-between transition-all `}
    >
      {/* Top section */}

      <div className="flex flex-col justify-between h-full pb-4">
        <div>
          {/* Header */}
          <div
            className={`flex items-center justify-between  gap-3 border-b border-minimal-primary/30 py-4 mb-4`}
          >
            {/* <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white via-minimal-primary to-cyan-400 bg-clip-text text-transparent">
              <Logo />
              Expli
            </h1> */}

            <div className="flex items-center gap-3">
              <img className="h-6" alt="Logo" src={ExplifiedLogo} />
              <h1 className="text-2xl font-semibold text-white">Expli</h1>
            </div>
            <div className="flex items-center justify-between gap-1">
              {/* Pin button */}
              <button
                onClick={() => {
                  setSidebarPinned(!sidebarPinned);
                }}
                className={`p-2 hidden sm:inline-block rounded-lg transition-all duration-300 hover:scale-110 ${
                  sidebarPinned
                    ? "bg-minimal-primary/20 text-minimal-primary shadow-lg shadow-minimal-primary/25"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white"
                }`}
              >
                {sidebarPinned ? <PinOff size={15} /> : <Pin size={15} />}
              </button>
              {/* Cross button */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className={`p-2 sm:hidden rounded-lg transition-all duration-300 hover:scale-110 bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white`}
              >
                <X size={15} />
              </button>
            </div>
          </div>

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
            <div className="relative text-sm flex items-center justify-center gap-2">
              <span>
                <Plus size={20} />
              </span>
              {isSidebarOpen && <span>New Chat</span>}
            </div>
          </button>

          {/* Chat History */}

          {isSidebarOpen ? (
            <div className="bg-gray-900 mt-4 p-2">
              {/* Filtered History */}
              {filteredHistory && filteredHistory.length > 0 ? (
                <div className="space-y-2">
                  {filteredHistory.map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => handleHistoryClick(item)}
                      className="group bg-gray-700 hover:bg-gray-700/50 border border-gray-700/30 
    hover:border-minimal-primary/30 rounded-lg px-2 pt-1 pb-1.5 transition-all duration-200 cursor-pointer"
                    >
                      {/* Top row: question + 3-dot menu */}
                      <div className="flex items-center justify-between">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: formatText(item?.qa[0]?.promptSummary),
                          }}
                          className="text-sm text-gray-300 group-hover:text-white truncate "
                        />
                        {/* <div>{item?.qa[0]?.promptSummary}</div> */}

                        {/* Bottom row: tool icons */}
                        <div className="flex  gap-2 mt-1">
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

                        {/* 3-dot dropdown menu */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // prevent triggering history click
                              setMenuOpen(
                                menuOpen === item.id ? null : item.id
                              );
                            }}
                            className="pl-1 rounded hover:bg-gray-700/50 text-gray-400 hover:text-white"
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
                      {/* <div className="flex  gap-2 mt-1">
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
                      </div> */}
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
          ) : (
            <div className="mt-4">
              <MessageSquare />
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Profile Dropdown */}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative flex items-center justify-center ${
              isSidebarOpen ? "bg-gray-900" : ""
            }  rounded-xl`}
          >
            <button
              onClick={() => navigate("/profile")}
              className={`flex items-center justify-center gap-4
              w-full h-10 rounded-xl transition-all duration-200 transform
              ${
                location.pathname === "/profile"
                  ? "scale-110 text-[#23b5b5] bg-minimal-primary/20 border border-[#23b5b5]/40"
                  : "text-minimal-white hover:text-[#23b5b5] hover:bg-minimal-cardHover"
              }`}
            >
              <span>
                <CircleUserRound className="w-6 h-6" />
              </span>
              {isSidebarOpen && <span>{user?.name}</span>}
            </button>

            {isOpen && (
              <div
                className="absolute right-0 bottom-12 min-w-[220px]
                 bg-gradient-to-br from-[#0d1418] to-[#111c20] 
                 backdrop-blur-xl border border-[#23b5b5]/40 rounded-xl shadow-lg
                 p-4 flex flex-col items-center z-50
                 transform transition-all duration-300 ease-out
                 animate-in fade-in-20 scale-in-95"
              >
                <Link
                  className="w-full h-9 mb-3 rounded-lg border border-[#23b5b5]/40 text-sm font-medium text-white
                   bg-transparent hover:bg-[#23b5b5]/15 hover:border-[#23b5b5] 
                   hover:shadow-md hover:shadow-cyan-500/20 transition-all duration-200 flex items-center justify-center"
                  to="https://explified.com/explified-labs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  For Enterprises
                </Link>

                <div className="flex gap-2 w-full mb-3">
                  {[
                    { icon: Plus, to: "/expli" },
                    { icon: FileText, to: "/tasks" },
                  ].map(({ icon: Icon, to }, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        navigate(to);
                        setIsOpen(false);
                      }}
                      className="flex-1 h-9 flex items-center justify-center rounded-lg border border-[#23b5b5]/40 bg-transparent
                       hover:bg-[#23b5b5]/15 hover:border-[#23b5b5] hover:shadow-sm hover:shadow-cyan-500/20
                       text-white transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 w-full mb-3">
                  {[{ icon: Search, to: "/discover" }].map(
                    ({ icon: Icon, to }, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          navigate(to);
                          setIsOpen(false);
                        }}
                        className="flex-1 h-9 flex items-center justify-center rounded-lg border border-[#23b5b5]/40 bg-transparent
                       hover:bg-[#23b5b5]/15 hover:border-[#23b5b5] hover:shadow-sm hover:shadow-cyan-500/20
                       text-white transition-all duration-200"
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    )
                  )}
                </div>

                <div className="mb-3 w-full">
                  <h3 className="text-white text-xs font-semibold opacity-80 mb-2">
                    Workflows
                  </h3>
                  <div className="flex gap-2 w-full">
                    {[
                      { icon: Workflow, to: "/workflows" },
                      { icon: Zap, to: "/integrations" },
                    ].map(({ icon: Icon, to }, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          navigate(to);
                          setIsOpen(false);
                        }}
                        className="flex-1 h-9 flex items-center justify-center rounded-lg border border-[#23b5b5]/40 bg-transparent
                         hover:bg-[#23b5b5]/15 hover:border-[#23b5b5] hover:shadow-sm hover:shadow-cyan-500/20
                         text-white transition-all duration-200"
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full mb-1">
                  <h3 className="text-white text-xs font-semibold opacity-80 mb-2">
                    All Tools
                  </h3>
                  <button
                    onClick={() => navigate("/alltools")}
                    className="flex items-center justify-center w-12 h-12 mx-auto rounded-lg border border-[#23b5b5]/40 
                     text-white bg-transparent hover:bg-[#23b5b5]/15 hover:border-[#23b5b5]
                     hover:shadow-md hover:shadow-cyan-500/20 transition-all duration-200"
                  >
                    <Grip className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Learn More Section */}

          <div>
            <Link to={link}>
              <div className="underline text-white flex items-center justify-center gap-2">
                <IoIosInformationCircleOutline className="w-6 h-6 font-bold" />
                {isSidebarOpen && <span>Learn More</span>}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpliSidebar;
