import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  User,
  LogOut,
  Menu,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import HelpButton from "./HelpButton";
import Breadcrumbs from "./Breadcrumbs";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { clearUser } from "../utils/auth_slice/UserSlice";
const quickToolsDropdown = [
  { name: "AI Tools", route: "/aitools" },
  { name: "Youtube Summarizer", route: "/youtube-summarizer" },
  { name: "AI Subtitler", route: "/ai-subtitler" },
  { name: "Linkedin Extension", route: "/linkedin" },
  { name: "Video Generator", route: "/Meme" },
  { name: "BG Remover", route: "/bg-remover" },
  { name: "Influmark", route: "/influmark" },
];

function GlobalStyle() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      html, body, #root { height: 100%; }
      body { margin: 0; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
}

export default function DashBoardLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [profileDropdown, setProfileDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toolsDropdown, setToolsDropdown] = useState(false);
  const [showWorkDropdown, setShowWorkDropdown] = useState(false);
  const [showChatsDropdown, setShowChatsDropdown] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [chatUsers, setChatUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const socket = useRef(null);
  const user = useSelector((state) => state.user);

  const currentUsername = user?.given_name || "Guest";

  const [currentEmail, setCurrentEmail] = useState("guest@example.com");

  useEffect(() => {
    if (!currentUsername || currentUsername === "Guest") return;

    fetch(`http://localhost:3000/api/user-details?username=${currentUsername}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.email) {
          setCurrentEmail(data.email);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch email for user:", err);
      });
  }, [currentUsername]);

  useEffect(() => {
    let isMounted = true;
    const fetchChatUsers = async () => {
      try {
        const [userRes, adminRes] = await Promise.all([
          fetch("http://localhost:3000/api/users/all"),
          fetch("http://localhost:3000/api/AdminUsers/all"),
        ]);
        const userData = await userRes.json();
        const adminData = await adminRes.json();

        if (isMounted) {
          const filteredUsers = (userData.users || []).filter(
            (u) =>
              typeof u === "string" && u.trim() !== "" && u !== currentUsername
          );
          const filteredAdmins = (adminData.users || []).filter(
            (u) =>
              typeof u === "string" && u.trim() !== "" && u !== currentUsername
          );

          setChatUsers(filteredUsers);
          setAdminUsers(filteredAdmins);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchChatUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    socket.current = io("http://localhost:3001");
    socket.current.emit("join", currentUsername);

    socket.current.on("receive-message", ({ from, message }) => {
      setMessages((prev) => ({
        ...prev,
        [from]: [...(prev[from] || []), { from, message, time: Date.now() }],
      }));
    });

    return () => socket.current?.disconnect();
  }, []);

  const isAdmin = adminUsers.includes(currentUsername);

  const handleAddUser = () => {
    const trimmed = newUsername.trim();
    if (trimmed && !chatUsers.includes(trimmed)) {
      setChatUsers((prev) => [...prev, trimmed]);
    }
    setNewUsername("");
    setShowAddUserPopup(false);
  };

  return (
    <>
      <GlobalStyle />
      {/* Add User Popup */}
      {showAddUserPopup && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded text-black w-80">
            <h2 className="text-lg font-semibold mb-2">Add New User</h2>
            <input
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter username"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1 bg-gray-300 rounded"
                onClick={() => setShowAddUserPopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 bg-[#23b5b5] text-black rounded"
                onClick={handleAddUser}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex h-screen bg-black text-white overflow-hidden">
        {/* Add User Popup */}
        {showAddUserPopup && isAdmin && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded text-black w-80">
              <h2 className="text-lg font-semibold mb-2">Add New User</h2>
              <input
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter username"
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-1 bg-gray-300 rounded"
                  onClick={() => setShowAddUserPopup(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1 bg-[#23b5b5] text-black rounded"
                  onClick={handleAddUser}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <aside
          className={`relative z-30 bg-black border-r border-b border-gray-800 flex-shrink-0 flex flex-col transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-16"
          }`}
        >
          <div className="flex flex-col justify-between h-full">
            {/* Top Section */}
            <div>
              <div className="flex items-center justify-between p-4">
                <img
                  src="/Explified_logo.png"
                  alt="Logo"
                  className="w-10 h-10 cursor-pointer"
                  onClick={() => navigate("/")}
                />
                <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                  {sidebarOpen ? (
                    <ChevronLeft size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </button>
              </div>

              {sidebarOpen && (
                <nav className="flex-1 overflow-y-auto p-4 space-y-3">
                  <button
                    onClick={() => {
                      navigate("/");
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left p-2 rounded hover:bg-gray-800 border border-gray-600"
                  >
                    Dashboard
                  </button>
                  {/* Tools */}
                  <div>
                    <button
                      onClick={() => setToolsDropdown(!toolsDropdown)}
                      className="w-full flex justify-between items-center p-2 rounded hover:bg-gray-800 border border-gray-600"
                    >
                      <span>Tools</span>
                      <ChevronDown size={16} />
                    </button>
                    {toolsDropdown && (
                      <div className="mt-2 p-2 space-y-1 border border-gray-600 rounded">
                        {quickToolsDropdown.map((tool, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              navigate(tool.route);
                              setSidebarOpen(false);
                            }}
                            className="block w-full text-left px-2 py-1 rounded hover:bg-[#23b5b5] hover:text-black"
                          >
                            {tool.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Socials */}
                  <button
                    onClick={() => {
                      navigate("/socials");
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left p-2 rounded hover:bg-gray-800 border border-gray-600"
                  >
                    Socials
                  </button>

                  {/* Workflows */}
                  <div className="flex border border-gray-600 rounded">
                    <button
                      onClick={() => {
                        navigate("/workflows");
                        setSidebarOpen(false);
                      }}
                      className="w-full text-left p-2 rounded flex items-center justify-between"
                    >
                      Workflows
                    </button>
                    <div
                      className="p-2"
                      onClick={() => setShowWorkDropdown(!showWorkDropdown)}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </div>
                  {showWorkDropdown && (
                    <div className="mt-2 p-2 space-y-1 border border-gray-600 rounded">
                      <button
                        onClick={() => {
                          navigate("/workflows");
                          setSidebarOpen(false);
                        }}
                        className="block w-full text-left px-2 py-1 rounded hover:bg-[#23b5b5] hover:text-black"
                      >
                        Workflows 1
                      </button>
                      <button
                        onClick={() => {
                          navigate("/templates");
                          setSidebarOpen(false);
                        }}
                        className="block w-full text-left px-2 py-1 rounded hover:bg-[#23b5b5] hover:text-black"
                      >
                        Workflows 2
                      </button>
                    </div>
                  )}

                  {/* Chats */}
                  <div className="flex items-center gap-1">
                    <button
                      disabled={!isAdmin}
                      onClick={() => isAdmin && setShowAddUserPopup(true)}
                      className={`p-1 rounded hover:text-[#23b5b5] border border-gray-600 ${
                        isAdmin
                          ? "cursor-pointer"
                          : "opacity-30 cursor-not-allowed"
                      }`}
                      title={
                        isAdmin ? "Add new user" : "Only admins can add users"
                      }
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => setShowChatsDropdown(!showChatsDropdown)}
                      className="flex-1 flex justify-between items-center p-2 rounded hover:bg-gray-800 border border-gray-600 w-full"
                    >
                      <span>Chats</span>
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  {showChatsDropdown && (
                    <div className="mt-2 p-2 space-y-1 border border-gray-600 rounded">
                      {adminUsers.map((name, i) => (
                        <button
                          key={`admin-${i}`}
                          onClick={() => setActiveChat(name)}
                          className="block w-full text-left px-2 py-1 rounded hover:bg-[#23b5b5] hover:text-black font-bold"
                        >
                          👑 {name}
                        </button>
                      ))}
                      {chatUsers.map((name, i) => (
                        <button
                          key={`user-${i}`}
                          onClick={() => setActiveChat(name)}
                          className="block w-full text-left px-2 py-1 rounded hover:bg-[#23b5b5] hover:text-black"
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                </nav>
              )}
            </div>

            {/* Bottom Section: Favorites and Credits */}
            {sidebarOpen && (
              <div className="p-4 space-y-4 border-t border-gray-800">
                <button
                  onClick={() => {
                    navigate("/favorites");
                    setSidebarOpen(false);
                  }}
                  className="w-full text-left p-2 rounded hover:bg-gray-800 border border-gray-600"
                >
                  Favorites
                </button>

                <div className="w-full p-4 rounded-md shadow border border-gray-600">
                  <div className="text-sm text-gray-100 flex items-center justify-between mb-2">
                    <span>Credits remaining</span>
                    <span className="flex items-center gap-1 text-gray-400 font-medium">
                      <svg
                        className="w-4 h-4 text-gray-100"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zM8 15l-5-5 1.4-1.4L8 12.2l7.6-7.6L17 6l-9 9z" />
                      </svg>
                      400 / 400
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                    <div
                      className="bg-teal-400 h-1.5 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <button className="w-full bg-[#23b5b5] text-black py-2 rounded-md hover:bg-black hover:text-white border border-gray-600 transition-all">
                    Upgrade
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-black z-10">
            <div className="flex items-center gap-4 ml-4 space-x-4">
              <img
                src="/Explified_logo.png"
                alt="Logo"
                className="ml-4 w-10 h-10 md:hidden"
                onClick={() => navigate("/")}
              />
              <button
                className="text-lg font-semibold hidden md:block"
                onClick={() => navigate("/")}
              >
                Home
              </button>
              <button
                onClick={() => navigate("/history")}
                className="text-lg font-semibold hidden md:block"
              >
                History
              </button>
              <button
                onClick={() => navigate("/integrations")}
                className="text-lg font-semibold hidden md:block"
              >
                Integrations
              </button>
            </div>
            <div className="relative flex items-center gap-4">
              <button
                className="md:hidden text-white"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center space-x-2 p-2 rounded hover:text-[#23b5b5] transition-colors"
              >
                <User size={20} />
                <ChevronDown size={16} />
              </button>
              {profileDropdown && (
                <div className="absolute right-0 top-12 mt-2 bg-black border border-white rounded-xl w-64 z-50">
                  <div className="flex flex-col items-center py-4">
                    <User size={24} className="mb-2" />
                    <p className="font-medium">{currentUsername}</p>
                    <p className="text-sm text-gray-300">{currentEmail}</p>
                  </div>
                  <div className="border-t border-white my-2" />
                  {user ? (
                    <button
                      className="w-full py-2 flex justify-center items-center space-x-2"
                      onClick={() => {
                        signOut(auth)
                          .then(() => {
                            dispatch(clearUser());
                            navigate("/login"); // navigate to login page after logout
                          })
                          .catch((error) => {
                            console.error("Logout failed:", error);
                          });
                      }}
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  ) : (
                    <button
                      className="w-full py-2 flex justify-center items-center space-x-2"
                      onClick={() => navigate("/login")}
                    >
                      <User size={16} />
                      <span>Log In</span>
                    </button>
                  )}

                  <div className="border-t border-white my-2" />
                  <div className="grid grid-cols-2 divide-x divide-white">
                    <button className="py-2 text-sm">Contact us</button>
                    <button className="py-2 text-sm">Feedback</button>
                  </div>
                </div>
              )}
            </div>
          </header>

          {activeChat ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-black">
              <div className="text-xl font-bold mb-4">
                Chat with {activeChat}
              </div>
              <div className="h-[calc(100vh-200px)] overflow-y-auto space-y-2">
                {(messages[activeChat] || []).map((msg, i) => (
                  <div
                    key={i}
                    className={`my-1 ${
                      msg.from === currentUsername ? "text-right" : "text-left"
                    }`}
                  >
                    <span className="inline-block bg-[#23b5b5] text-black px-3 py-1 rounded">
                      {msg.message}
                    </span>
                  </div>
                ))}
              </div>
              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const msg = e.target.elements["input-message"].value.trim();
                  if (msg) {
                    socket.current.emit("send-message", {
                      to: activeChat,
                      from: currentUsername,
                      message: msg,
                    });
                    setMessages((prev) => ({
                      ...prev,
                      [activeChat]: [
                        ...(prev[activeChat] || []),
                        {
                          from: currentUsername,
                          message: msg,
                          time: Date.now(),
                        },
                      ],
                    }));
                    e.target.reset();
                  }
                }}
              >
                <input
                  name="input-message"
                  className="flex-1 p-2 rounded text-black"
                  placeholder="Type your message..."
                />
                <button className="bg-[#23b5b5] px-4 py-2 rounded text-black">
                  Send
                </button>
              </form>
            </div>
          ) : (
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-black">
              <Breadcrumbs />
              <Outlet />
            </main>
          )}
          <HelpButton />
        </div>
      </div>
    </>
  );
}
