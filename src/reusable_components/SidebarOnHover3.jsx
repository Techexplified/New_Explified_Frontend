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

function SidebarOnHover3({ toolName, onToggle, bottomSection }) {
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

  return (
    <>
      {/* Hover trigger area at 30% from the left */}
      {!sidebarPinned && (
        <div
          className="fixed top-0 left-0 h-full z-40"
          style={{ width: "30vw", pointerEvents: "auto" }}
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full bg-black/95 backdrop-blur-xl border-r border-minimal-primary/20 flex flex-col items-center transition-all duration-300 z-50 overflow-y-auto ${
          sidebarOpen || sidebarPinned
            ? "w-60 px-3"
            : "w-0 px-0 overflow-hidden"
        }`}
        onMouseEnter={() => !sidebarPinned && setSidebarOpen(true)}
        onMouseLeave={() => !sidebarPinned && setSidebarOpen(false)}
      >
        {/* Admin Button at the top of the sidebar */}
        {bottomSection && (
          <div className="w-full flex flex-col items-center mt-8">
            {bottomSection}
          </div>
        )}
      </div>
    </>
  );
}

export default SidebarOnHover3;
