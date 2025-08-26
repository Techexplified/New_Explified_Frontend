import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  MoreHorizontal,
  Calendar,
  Tag,
  Search,
  Edit3,
  Clock,
  ChevronDown,
  Heart,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import LexicalEditor from "./LexicalEditor";
import SidebarOnHover2 from "../reusable_components/SidebarOnHover2";

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
  const [pinnedNotes, setPinnedNotes] = useState([
    {
      id: "p1",
      title: "Prayer as an Anchor",
      content: "Some note context come over to the second...",
      date: "5 Dec 2023 • 4:58 PM",
      tag: "Sermons",
      visible: true,
    },
    {
      id: "p2",
      title: "Mindful Mornings",
      content: "Start the day with gratitude, one line at a time.",
      date: "5 Dec 2023 • 4:58 PM",
      tag: "Sermons",
      visible: true,
    },
  ]);
  const [editingPinnedId, setEditingPinnedId] = useState(null);
  const [activeToolbarTool, setActiveToolbarTool] = useState("text");
  const [editing, setEditing] = useState(false);

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
        favorite: !!t.favorite,
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

  // Toggle favorite
  const toggleFavorite = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, favorite: !task.favorite } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
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
      <SidebarOnHover2 />

      {/* Main Content */}
      <main
        className={`flex-1 relative h-screen p-8 overflow-y-auto transition-all duration-300 ${
          sidebarOpen || sidebarPinned ? "ml-72" : "ml-0"
        }`}
      >
        {!editing && (
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
                        onChange={(e) =>
                          updateTaskTitle(task.id, e.target.value)
                        }
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
                    <div className="text-xs text-gray-500 flex items-center justify-between">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Modified {formatDate(task.lastModified)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(task.id);
                        }}
                        className={`p-1 rounded hover:bg-white/10 transition-colors ${
                          task.favorite ? "text-[#ff5a7a]" : "text-gray-400"
                        }`}
                        title={task.favorite ? "Unfavorite" : "Favorite"}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            task.favorite ? "fill-current" : ""
                          }`}
                        />
                      </button>
                    </div>
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
        )}

        {editing && (
          <>
            {/* Floating Toolbar inside main content */}
            <LexicalEditor />

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 flex justify-center pointer-events-none">
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 backdrop-blur px-3 py-2 shadow-xl pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setActiveToolbarTool("text")}
                  aria-selected={activeToolbarTool === "text"}
                  className={`h-8 w-8 grid place-items-center rounded-md hover:bg-white/10 active:bg-white/15 ${
                    activeToolbarTool === "text"
                      ? "bg-white/15 text-white"
                      : "text-gray-200"
                  }`}
                  title="Text"
                >
                  <span className="font-semibold">T</span>
                </button>
                <div className="h-6 w-px bg-white/20" />
                <button
                  type="button"
                  onClick={() => setActiveToolbarTool("edit")}
                  aria-selected={activeToolbarTool === "edit"}
                  className={`h-8 w-8 grid place-items-center rounded-md hover:bg-white/10 active:bg-white/15 ${
                    activeToolbarTool === "edit"
                      ? "bg-white/15 text-white"
                      : "text-gray-200"
                  }`}
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <div className="h-6 w-px bg-white/20" />
                <button
                  type="button"
                  onClick={() => setActiveToolbarTool("magic")}
                  aria-selected={activeToolbarTool === "magic"}
                  className={`h-8 w-8 grid place-items-center rounded-md hover:bg-white/10 active:bg-white/15 ${
                    activeToolbarTool === "magic"
                      ? "bg-white/15 text-white"
                      : "text-gray-200"
                  }`}
                  title="Magic"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
