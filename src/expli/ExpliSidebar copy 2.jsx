import {
  MessageSquare,
  Trash2,
  PinOff,
  Pin,
  Search,
  Plus,
  MoreVertical,
  Share2,
  Edit3,
  X,
  CircleUserRound,
  LayoutGrid,
  Save,
  NotebookPen,
  LogOut,
  Settings,
  HelpCircle,
  User,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useState, useMemo, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatText } from "../utils/data/TroneData";
import { AiOutlineOpenAI } from "react-icons/ai";
import { RiGeminiLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { ExpliLogo } from "../assets";
import { clearUser } from "../utils/auth_slice/UserSlice";
import ProfileSettingsModal from "./ProfileSettingsModal";
import { useExpli } from "../context/ExpliContext";

function ExpliSidebar({ link }) {
  const {
    newChat,
    chatHistory,
    setChatHistory,
    setCurrentMessages,
    setCurrentMessagesGemini,
    setCurrentMessagesOpenAI,
    isSidebarOpen,
    setIsSidebarOpen,
    sidebarPinned,
    setSidebarPinned,
  } = useExpli();
  const [searchQuery, setSearchQuery] = useState(""); // ✅ new state
  const [menuOpen, setMenuOpen] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [pinOpen, setPinOpen] = useState(false);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoverChat, setHoverChat] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return chatHistory;
    return chatHistory.filter((item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, chatHistory]);

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

  let timeoutId;
  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setIsOpen(false), 200);
  };
  return (
    <>
      <div
        onMouseEnter={() => !sidebarPinned && setIsSidebarOpen(true)}
        onMouseLeave={() => {
          setShowDropdown(false);
          if (!sidebarPinned) {
            setIsSidebarOpen(false);
            setPinOpen(false);
          }
        }}
        className={`h-screen ${
          isSidebarOpen || sidebarPinned
            ? "w-72  px-3"
            : "w-16 px-3 overflow-hidden"
        } absolute sm:relative z-50 h-screen  overflow-y-scroll sidebar-scroll bg-black backdrop-blur-2xl 
        border-r border-minimal-primary/30 shadow-2xl shadow-minimal-primary/10
        flex flex-col justify-between transition-all `}
      >
        {/* Top section */}

        <div className="flex flex-col justify-between h-full pb-4">
          <div>
            {/* Header */}
            <div
              onMouseEnter={() => setShowDropdown(true)}
              // onMouseLeave={() => setShowDropdown(false)}
              className={`flex items-center justify-between gap-3 border-b border-minimal-primary/30 py-4 relative`}
            >
              {/* Left: Logo + Title */}
              <div className="flex items-center gap-3">
                <img className="h-10" alt="Logo" src={ExpliLogo} />
                <h1
                  className={`text-2xl font-semibold ${
                    isSidebarOpen ? "text-white" : "text-black"
                  }`}
                >
                  Expli
                </h1>
              </div>

              {/* Right: Menu icon + dropdown + close */}
              <div className="flex items-center justify-between gap-1 relative">
                {/* Menu icon (3 dots) */}
                <button
                  onClick={() => setPinOpen((prev) => !prev)}
                  className="p-2 hidden sm:inline-block rounded-lg transition-all duration-300 hover:scale-110 bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white"
                >
                  <MoreVertical size={15} />
                </button>

                {/* Dropdown menu */}
                {pinOpen && isSidebarOpen && (
                  <div className="absolute right-0 top-10 bg-gray-900 text-gray-200 rounded-xl shadow-lg border border-gray-700 w-40 py-2 z-50">
                    <button
                      onClick={() => {
                        setSidebarPinned(!sidebarPinned);
                        setPinOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-800 transition-all"
                    >
                      {sidebarPinned ? <PinOff size={15} /> : <Pin size={15} />}
                      {sidebarPinned ? "Unpin Sidebar" : "Pin Sidebar"}
                    </button>
                    <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-800 transition-all">
                      <Link to={link}>
                        <div className="flex items-center justify-center gap-2">
                          <IoIosInformationCircleOutline className="w-5 h-5 font-bold" />
                          {isSidebarOpen && <span>Learn More</span>}
                        </div>
                      </Link>
                    </button>
                  </div>
                )}

                {/* Cross button for mobile */}
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 sm:hidden rounded-lg transition-all duration-300 hover:scale-110 bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {isSidebarOpen && showDropdown && (
              <div className="flex items-center justify-around bg-black/90 border-t border-gray-700 py-3 rounded-t-2xl shadow-lg">
                <button
                  onClick={() => navigate("/")}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white"
                >
                  <LayoutGrid size={20} />
                </button>

                <button
                  onClick={() => navigate("/notes")}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white"
                >
                  <NotebookPen size={20} />
                </button>

                <button
                  onClick={() => navigate("/memory")}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white"
                >
                  <Save size={20} />
                </button>

                <button
                  onClick={() => navigate("/expli/discover")}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white"
                >
                  <Search size={20} />
                </button>
              </div>
            )}

            <button
              onClick={newChat}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-gray-800/80 to-gray-700/80 
                hover:from-minimal-primary/20 hover:to-cyan-500/20 border border-gray-600/50 hover:border-minimal-primary/50
                text-white font-medium py-1.5 px-2 rounded-lg transition-all duration-300 hover:scale-105 
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
              <div className="bg-transparent p-2 pt-6 relative">
                {/* Left vertical line connector */}
                {/* <div className="absolute -left-0 top-0 bottom-0 w-0.5 bg-gray-700" /> */}

                {/* Filtered History */}
                {filteredHistory && filteredHistory.length > 0 ? (
                  <div className="space-y-2 relative">
                    {filteredHistory.map((item, index) => (
                      <div
                        key={item.id}
                        onMouseEnter={() => setHoverChat(item.id)} // set hovered chat ID
                        onMouseLeave={() => setHoverChat(null)} // reset when leaving
                        onClick={() => {
                          handleHistoryClick(item);
                          setMenuOpen(false);
                        }}
                        className="group hover:bg-gray-700/50 border border-gray-700/30 
    hover:border-minimal-primary/30 rounded-lg px-2 pt-1 pb-1.5 transition-all duration-200 cursor-pointer relative"
                      >
                        <div className="flex items-center justify-between">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: formatText(item?.qa[0]?.promptSummary),
                            }}
                            className="text-sm text-gray-300 group-hover:text-white truncate"
                          />

                          {hoverChat === item.id && (
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
                          )}

                          <div className="relative">
                            {hoverChat === item.id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMenuOpen(
                                    menuOpen === item.id ? null : item.id
                                  );
                                }}
                                className="pl-1 rounded text-gray-400 hover:text-white"
                              >
                                <MoreVertical size={16} />
                              </button>
                            )}

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
              <div className="mt-6 flex justify-center">
                <div className="relative">
                  <MessageSquare className="text-gray-300" size={25} />
                  <div className="absolute inset-0 bg-gray-400 blur-xl opacity-20" />
                </div>
              </div>
            )}

            {!isSidebarOpen && (
              <div className="mt-6 flex justify-center">
                <div className="relative">
                  <Save
                    onClick={() => navigate("/memory")}
                    className="text-gray-300"
                    size={25}
                  />
                  <div className="absolute inset-0 bg-gray-400 blur-xl opacity-20" />
                </div>
              </div>
            )}
            {!isSidebarOpen && (
              <div className="mt-6 flex justify-center">
                <div className="relative">
                  <Search
                    onClick={() => navigate("/search")}
                    className="text-gray-300"
                    size={25}
                  />
                  <div className="absolute inset-0 bg-gray-400 blur-xl opacity-20" />
                </div>
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
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="flex w-full items-center justify-center gap-3 px-4 py-3 hover:bg-gray-800 transition"
                  >
                    <User size={18} />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate("/profile");
                    }}
                    className="flex w-full items-center justify-center gap-3 px-4 py-3 hover:bg-gray-800 transition"
                  >
                    <Settings size={18} />
                    Settings
                  </button>

                  <button
                    onClick={() => {
                      navigate("/profile");
                    }}
                    className="flex w-full items-center justify-center gap-3 px-4 py-3 hover:bg-gray-800 transition"
                  >
                    <HelpCircle size={18} />
                    Help
                  </button>

                  <button
                    onClick={() => {
                      dispatch(clearUser());
                      localStorage.removeItem("explified");
                      navigate("/login");
                    }}
                    className="flex w-full items-center justify-center gap-3 px-4 py-3 hover:bg-gray-800 transition"
                  >
                    <LogOut size={18} />
                    Log out
                  </button>
                </div>
              )}
            </div>

            {isSidebarOpen && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="mt-2 w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 
               border border-cyan-500/30 text-cyan-400 text-sm font-medium
               hover:from-cyan-500/30 hover:to-blue-500/30 hover:text-white
               transition-all duration-300"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>
      </div>

      {showProfileModal && (
        <ProfileSettingsModal onClose={() => setShowProfileModal(false)} />
      )}

      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]">
          <div className="bg-[#0f171c] border border-cyan-500/40 rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm text-center text-white relative">
            <h2 className="text-lg font-semibold mb-2">Upgrade To Premium</h2>
            <p className="text-gray-400 text-sm">
              Exciting premium features are on the way! Stay tuned
            </p>
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
            >
              <X size={18} />
            </button>
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-[#23b5b5] text-white rounded-lg hover:opacity-90 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ExpliSidebar;
