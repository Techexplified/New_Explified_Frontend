import React, { useState, useEffect, useRef } from "react";
import {
  Pin,
  PinOff,
  Plus,
  MoreHorizontal,
  Calendar,
  Tag,
  Search,
  Edit3,
  Clock,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function TaskManagerWithSidebar() {
  const [tasks, setTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedT, setSelectedT] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  // Gemini AI
  const genAI = new GoogleGenerativeAI(
    "AIzaSyA3iqoMW6g81LMjWdyS24WHM32M0ie7AEs"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Load tasks
  useEffect(() => {
    try {
      const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      const normalizedTasks = storedTasks.map((t, index) => ({
        id: t.id || Date.now() + index,
        title: t.title || "",
        content: t.content || "",
        lastModified: t.lastModified || new Date().toISOString(),
        tag: t.tag || "General",
      }));
      setTasks(normalizedTasks);

      normalizedTasks.forEach(async (task) => {
        if (!task.title && task.content) {
          const title = await generateTitle(task.content);
          updateTaskTitle(task.id, title);
        }
      });
    } catch {
      setTasks([]);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const generateTitle = async (content) => {
    try {
      const prompt = `From the following note, pick one short significant word or concise 2-3 word phrase as its title. Avoid punctuation. Note: "${content}"`;
      const result = await model.generateContent(prompt);
      return result.response.text().trim() || "Untitled";
    } catch {
      return "Untitled";
    }
  };

  // Update task content
  const updateTaskContent = (id, content) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, content, lastModified: new Date().toISOString() }
        : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // Update task title
  const updateTaskTitle = (id, title) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, title, lastModified: new Date().toISOString() }
        : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // Delete task
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    if (selectedTaskId === id) setSelectedTaskId(null);
  };

  // Edit task inline
  const handleEditTitle = (task) => {
    setEditingTitleId(task.id);
  };

  const filteredTasks = tasks.filter((task) => {
    const title = task.title || "";
    const content = task.content || "";
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const selectedId = location.pathname.split("/").pop();
  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      {!sidebarPinned && (
        <div
          className="absolute left-0 top-0 h-full w-6 z-30"
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full bg-black border-r border-[#23b5b5]/40 flex flex-col transition-all duration-300 z-50
    ${sidebarOpen || sidebarPinned ? "w-80 px-4" : "w-0 px-0 overflow-hidden"}`}
        onMouseEnter={() => !sidebarPinned && setSidebarOpen(true)}
        onMouseLeave={() => !sidebarPinned && setSidebarOpen(false)}
      >
        {/* Search */}
        <div className="relative mt-6 mb-6">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111] rounded-xl py-2 pl-3 pr-10 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]"
          />
          <Search className="absolute right-3 top-2 text-gray-500" />
        </div>

        {/* Floating + Button */}
        <button
          onClick={() => navigate("/notes")}
          className="absolute right-10 top-20 w-10 h-10 bg-[#23b5b5] text-black rounded-xl flex items-center justify-center shadow-lg hover:bg-[#1f9e9e] transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Header + Pin */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center">
            All Notes <span className="ml-1 text-gray-400">⌄</span>
          </h2>
          <button
            onClick={() => {
              setSidebarPinned(true);
              setSidebarOpen(true);
            }}
            className="text-gray-400 hover:text-[#23b5b5]"
          >
            {sidebarPinned ? <PinOff size={18} /> : <Pin size={18} />}
          </button>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-6">
          {filteredTasks.map((task) => {
            const isSelected = String(task.id) === selectedId;
            return (
              <div
                onClick={() => setSelectedT(task.id)}
                key={task.id}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative group
    ${
      selectedT === task.id
        ? "border-[#23b5b5] bg-[#111] hover:bg-[#111] hover:border-[#23b5b5] hover:text-[#23b5b5]"
        : "border-gray-700 hover:border-[#23b5b5]/70 hover:bg-[#222]"
    }`}
              >
                <div className="flex items-start justify-between mb-1">
                  {editingTitleId === task.id ? (
                    <input
                      type="text"
                      value={task.title}
                      autoFocus
                      onChange={(e) => updateTaskTitle(task.id, e.target.value)}
                      onBlur={() => setEditingTitleId(null)}
                      className="font-semibold text-white text-sm w-full focus:outline-none border-b border-gray-700"
                    />
                  ) : (
                    <h3 className="font-semibold text-white text-sm cursor-pointer">
                      {task.title || "Untitled Note"}
                    </h3>
                  )}

                  {/* Dropdown Menu */}
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === task.id ? null : task.id);
                      }}
                      className="text-gray-500 hover:text-[#23b5b5] opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {menuOpenId === task.id && (
                      <div className="absolute right-0 mt-2 w-28 bg-black border border-gray-700 rounded-lg shadow-md z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTitle(task);
                            setMenuOpenId(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-[#23b5b5]/10"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                            setMenuOpenId(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-700 hover:text-white rounded-b-md"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-400 text-xs line-clamp-1 mb-2">
                  {task.content || "No content"}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(task.lastModified)}</span>
                  <Tag className="w-3 h-3 ml-2" />
                  <span>{task.tag || "General"}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="mb-8 flex-shrink-0">
          <Link to="https://explified.com/notes/" target="_self">
            <button className="w-full bg-[#23b5b5] hover:bg-[#1f9e9e] text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Learn More
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main
        className={`flex-1 p-8 overflow-y-auto transition-all duration-300 ${
          sidebarOpen || sidebarPinned ? "ml-72" : "ml-0"
        }`}
      >
        <div className="max-w-7xl mx-auto pt-12">
          <div className="flex flex-col mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Your Notes</h2>
            <p className="text-gray-400">Capture your thoughts and ideas</p>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-hidden">
            <button
              onClick={() => navigate("/notes")}
              className="bg-gradient-to-r from-[#23b5b5] to-cyan-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center gap-2 max-h-[90px]"
            >
              <Plus className="w-5 h-5" />
              New Note
            </button>

            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-300 overflow-y-hidden"
              >
                <div className="flex items-start justify-between mb-3">
                  <Edit3
                    className="w-4 h-4 text-[#23b5b5] mt-1 cursor-pointer"
                    onClick={() => setEditingTaskId(task.id)}
                  />
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all text-sm"
                  >
                    ✕
                  </button>
                </div>

                {/* Title + Content */}
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedTaskId(task.id)}
                >
                  {editingTitleId === task.id ? (
                    <input
                      type="text"
                      value={task.title}
                      autoFocus
                      onChange={(e) => updateTaskTitle(task.id, e.target.value)}
                      onBlur={() => setEditingTitleId(null)}
                      className="w-full bg-transparent text-white/90 border-b border-gray-300 focus:outline-none text-lg font-semibold mb-2"
                    />
                  ) : (
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {task.title || "Untitled"}
                    </h4>
                  )}

                  {editingTaskId === task.id ? (
                    <textarea
                      value={task.content}
                      onChange={(e) =>
                        updateTaskContent(task.id, e.target.value)
                      }
                      onBlur={() => setEditingTaskId(null)}
                      className="w-full bg-transparent text-white/90 resize-none focus:outline-none text-sm leading-relaxed min-h-[120px]"
                      autoFocus
                    />
                  ) : (
                    <p className="text-white/70 text-sm leading-relaxed">
                      {task.content}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/10">
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Modified {formatDate(task.lastModified)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Note Modal */}
          {selectedTask && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
              <div className="relative w-full max-w-md p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg">
                <button
                  onClick={() => setSelectedTaskId(null)}
                  className="absolute top-3 right-3 text-white hover:text-gray-300"
                >
                  ✕
                </button>
                <h3 className="text-xl font-bold text-white mb-4">
                  {selectedTask.title || "Untitled"}
                </h3>
                <p className="text-gray-300">{selectedTask.content}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
