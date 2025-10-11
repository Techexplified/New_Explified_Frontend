// SidebarOnHover2.jsx
import {
  Pin,
  PinOff,
  Plus,
  MoreHorizontal,
  Calendar,
  Tag,
  Search,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function SidebarOnHover2({ toolName, onToggle, bottomSection }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  // Load tasks
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const sortedTasks = storedTasks.sort(
      (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
    );
    setTasks(sortedTasks);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Notify parent about state
  useEffect(() => {
    if (onToggle) {
      onToggle(sidebarOpen || sidebarPinned);
    }
  }, [sidebarOpen, sidebarPinned, onToggle]);

  const filteredTasks = tasks.filter((task) => {
    const title = task.title || "";
    const content = task.content || "";
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const selectedId = location.pathname.split("/").pop();

  const handleEdit = (task) => {
    const newTitle = prompt("Edit note title:", task.title);
    if (newTitle !== null) {
      const updatedTasks = tasks.map((t) =>
        t.id === task.id
          ? { ...t, title: newTitle, lastModified: new Date() }
          : t
      );
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      const updatedTasks = tasks.filter((t) => t.id !== id);
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }
  };

  return (
    <>
      {/* Hover trigger area */}
      {!sidebarPinned && (
        <div
          className="absolute left-0 top-0 h-full w-6 z-30"
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-black/95 backdrop-blur-xl border-r border-minimal-primary/20
  flex flex-col justify-between transition-all duration-300 z-50 overflow-y-auto
  ${sidebarOpen || sidebarPinned ? "w-72 px-6" : "w-0 px-0 overflow-hidden"}`}
        onMouseEnter={() => !sidebarPinned && setSidebarOpen(true)}
        onMouseLeave={() => !sidebarPinned && setSidebarOpen(false)}
      >
        {/* Top Section */}
        <div className="mt-8 flex flex-col gap-6">
          {/* Header + Pin */}
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white to-minimal-primary bg-clip-text text-transparent">
              {toolName || "Notes"}
            </p>
            <button
              onClick={() => {
                setSidebarPinned(!sidebarPinned);
                setSidebarOpen(true);
              }}
              className="text-minimal-primary"
            >
              {sidebarPinned ? <PinOff size={20} /> : <Pin size={20} />}
            </button>
          </div>

          {/* Search */}
          <div className="relative w-[200px] mr-4">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-minimal-primary/20 rounded-lg py-2 pl-3 pr-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-minimal-primary/40"
            />
            <Search className="absolute right-3 top-2.5 w-3 h-4 text-minimal-primary" />
          </div>

          {/* Floating + Button */}
          <button
            onClick={() => navigate("/notes")}
            className="absolute right-3 top-[90px] w-8 h-8 bg-minimal-primary text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-minimal-primary/80 transition-all"
            title="Add Note"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Notes list */}
          <div
            className="flex-1 h-screen overflow-y-auto space-y-3 pr-2 pb-6 
  scrollbar-thin scrollbar-thumb-minimal-primary/40 scrollbar-track-black"
          >
            {filteredTasks.map((task) => {
              const isSelected = String(task.id) === selectedId;
              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl transition-all cursor-pointer relative group
                    ${
                      isSelected
                        ? "border border-minimal-primary bg-gray-900/70"
                        : "border border-transparent hover:border-minimal-primary/40 hover:bg-gray-900/40"
                    }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3
                      onClick={() => navigate(`/notes/${task.id}`)}
                      className="font-semibold text-white text-sm"
                    >
                      {task.title || "Untitled Note"}
                    </h3>
                    <div className="relative" ref={menuRef}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(
                            menuOpenId === task.id ? null : task.id
                          );
                        }}
                        className="text-gray-400 hover:text-minimal-primary opacity-0 group-hover:opacity-100"
                        title="More actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {menuOpenId === task.id && (
                        <div className="absolute right-0 mt-2 w-28 bg-black border border-minimal-primary/20 rounded-lg shadow-md z-50">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(task);
                              setMenuOpenId(null);
                            }}
                            className="block w-full text-left px-3 py-2 text-sm text-minimal-primary hover:bg-gray-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(task.id);
                              setMenuOpenId(null);
                            }}
                            className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-800"
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
                  <div className="flex items-center gap-2 text-xs text-minimal-primary">
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
        </div>

        {/* Bottom Section */}
        <div className="mb-8">
          <Link to="https://explified.com/notes/" target="_self">
            <button className="w-full bg-gradient-to-r from-minimal-primary to-minimal-primary/80 hover:from-minimal-primary/80 hover:to-minimal-primary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-minimal-primary/25">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default SidebarOnHover2;
