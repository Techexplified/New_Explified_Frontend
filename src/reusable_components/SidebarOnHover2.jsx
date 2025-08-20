// SidebarOnHover2.jsx
import {
  Pin,
  PinOff,
  Plus,
  MoreHorizontal,
  Calendar,
  Tag,
  Search
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function SidebarOnHover2({ toolName, onToggle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null); // track which note’s menu is open
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  // Fetch tasks from localStorage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const sortedTasks = storedTasks.sort(
      (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
    );
    setTasks(sortedTasks);
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

  // Notify parent about sidebar state
  useEffect(() => {
    if (onToggle) {
      onToggle(sidebarOpen || sidebarPinned);
    }
  }, [sidebarOpen, sidebarPinned, onToggle]);

  // Filter notes by title/content
  const filteredTasks = tasks.filter((task) => {
    const title = task.title || "";
    const content = task.content || "";
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Determine selected note from URL
  const selectedId = location.pathname.split("/").pop();

  // Edit a note
  const handleEdit = (task) => {
    const newTitle = prompt("Edit note title:", task.title);
    if (newTitle !== null) {
      const updatedTasks = tasks.map((t) =>
        t.id === task.id ? { ...t, title: newTitle, lastModified: new Date() } : t
      );
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }
  };

  // Delete a note
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      const updatedTasks = tasks.filter((t) => t.id !== id);
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }
  };

  return (
    <>
      {/* Hover trigger area (only active when not pinned) */}
      {!sidebarPinned && (
        <div
          className="absolute left-0 top-0 h-full w-6 z-30"
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50
        ${
          sidebarOpen || sidebarPinned
            ? "w-80 px-4"
            : "w-0 px-0 overflow-hidden"
        }`}
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
            className="w-full bg-gray-100 rounded-xl py-2 pl-3 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]"
          />
          <Search className="absolute right-3 top-2 text-gray-400" />
        </div>

        {/* Floating + Button */}
        <button
          onClick={() => navigate("/notes")}
          className="absolute right-10 top-20 w-10 h-10 bg-[#9b6b5f] text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-[#805447] transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Header + Pin */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            All Notes <span className="ml-1 text-gray-500">⌄</span>
          </h2>
          <button
            onClick={() => {
              setSidebarPinned(!sidebarPinned);
              setSidebarOpen(true);
            }}
            className="text-gray-500 hover:text-gray-700"
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
                key={task.id}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative group
                  ${
                    isSelected
                      ? "border-[#f4c7b7] bg-[#fdf2ef]"
                      : "border-gray-200 hover:border-[#23b5b5] hover:bg-[#23b5b5]/5"
                  }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3
                    onClick={() => navigate(`/notes/${task.id}`)}
                    className="font-semibold text-gray-900 text-sm"
                  >
                    {task.title || "Untitled Note"}
                  </h3>

                  {/* Dropdown Menu */}
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === task.id ? null : task.id);
                      }}
                      className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {menuOpenId === task.id && (
                      <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-md z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(task);
                            setMenuOpenId(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(task.id);
                            setMenuOpenId(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-500 text-xs line-clamp-1 mb-2">
                  {task.content || "No content"}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {task.lastModified
                      ? new Date(task.lastModified).toLocaleString()
                      : "No date"}
                  </span>
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
            <button className="w-full bg-[#23b5b5] hover:bg-[#1f9e9e] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default SidebarOnHover2;
