import { Pin, PinOff } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function SidebarOnHover2({ toolName, onToggle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const link = "https://explified.com/notes/";

  // Fetch tasks from localStorage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    // Ensure it's sorted by latest modified
    const sortedTasks = storedTasks.sort(
      (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
    );

    setTasks(sortedTasks);
  }, []);

  // 🔑 Notify parent about sidebar state
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
        className={`fixed top-0 left-0 h-full bg-black/95 backdrop-blur-xl border-r border-minimal-primary/20 
        flex flex-col transition-all duration-300 z-50
        ${sidebarOpen || sidebarPinned ? "w-56 px-6" : "w-0 px-0 overflow-hidden"}`}
        onMouseEnter={() => !sidebarPinned && setSidebarOpen(true)}
        onMouseLeave={() => !sidebarPinned && setSidebarOpen(false)}
      >
        {/* Top Section */}
        <div className="mt-8 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            
            <p className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white to-minimal-primary bg-clip-text text-transparent">
              Notes
            </p>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <button
              onClick={() => {
                setSidebarPinned(!sidebarPinned);
                setSidebarOpen(true); // always open when pinned
              }}
            >
              {sidebarPinned ? <PinOff size={20} /> : <Pin size={20} />}
            </button>
          </div>
        </div>

        {/* Search + Recent Notes */}
        <div className="mb-4">
          <p className="text-white font-semibold mb-2">Recent Notes</p>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-minimal-primary"
          />
        </div>

        {/* Scrollable Middle Section (Tasks) */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-2 mb-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
            >
              <p className="text-white text-sm font-semibold">{task.title || "Untitled Note"}</p>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <br/>
        

        <div className="mb-8 flex-shrink-0">
  <Link to={link} target="_self">   {/* ✅ force same tab */}
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

