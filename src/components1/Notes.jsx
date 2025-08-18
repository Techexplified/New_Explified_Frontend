import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, X } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import SidebarOnHover2 from "../reusable_components/SidebarOnHover2"; // ✅ import your sidebar

export default function Notes() {
  const [newTask, setNewTask] = useState("");
  const [title, setTitle] = useState("Create New Note");
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [tasks, setTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); // 🔑 track sidebar state

  const navigate = useNavigate();
  const genAI = new GoogleGenerativeAI("AIzaSyA3iqoMW6g81LMjWdyS24WHM32M0ie7AEs");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Fetch tasks from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tasks") || "[]");
    const normalized = stored.map((t, i) =>
      typeof t === "string"
        ? {
            id: Date.now() + i,
            title: "",
            content: t,
            lastModified: new Date().toISOString(),
          }
        : {
            id: t.id || Date.now() + i,
            title: t.title || "",
            content: t.content || "",
            lastModified: t.lastModified || new Date().toISOString(),
          }
    );
    setTasks(normalized);
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;
    const newNote = {
      id: Date.now(),
      title: title.trim() || "Untitled Note", // ✅ save title with the note
      content: newTask.trim(),
      lastModified: new Date().toISOString(),
    };

    const updated = [...tasks, newNote];
    localStorage.setItem("tasks", JSON.stringify(updated));
    localStorage.setItem(
      "alltask",
      JSON.stringify([
        ...JSON.parse(localStorage.getItem("alltask") || "[]"),
        newNote,
      ])
    );

    setTasks(updated);
    setNewTask("");
    navigate("/Tasks");
  };

  return (
    <div className="flex bg-black min-h-screen text-white">
      {/* ✅ Sidebar with toggle callback */}
      <SidebarOnHover2 tasks={tasks} onToggle={setSidebarOpen} />

      {/* ✅ Main Content Wrapper (centers the note area) */}
      <div
        className="flex flex-1 justify-center items-start p-8 pt-[50px] transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? "14rem" : "0rem" }}
      >
        {/* ✅ Notes Card (centered) */}
        <div className="w-full max-w-3xl">
          {/* Notepad Header */}
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 bg-gradient-to-r from-[#23b5b5] to-cyan-500 rounded-full flex items-center justify-center cursor-pointer shadow-md"
                onClick={() => {
                  setTempTitle(title);
                  setIsEditing(true);
                }}
              >
                <Edit3 className="w-5 h-5 text-white" />
              </div>

              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setTitle(tempTitle.trim() || "Untitled Note");
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-[#23b5b5] to-cyan-500 rounded-lg text-white hover:scale-105 transition-all"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <h2 className="text-2xl font-bold italic tracking-wide">
                  {title}
                </h2>
              )}
            </div>

            <X
              className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer"
              onClick={() => navigate("/Tasks")}
            />
          </div>

          {/* Notepad Area */}
          <div className="bg-white/5 rounded-xl border border-white/10 shadow-inner relative overflow-hidden">
            {/* Paper-like lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:100%_2.5rem] pointer-events-none"></div>

            <textarea
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="w-full p-6 bg-transparent text-white resize-none h-52 font-mono relative z-10 focus:outline-none"
              placeholder="Start writing your note..."
              autoFocus
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={addTask}
              disabled={!newTask.trim()}
              className="px-6 py-3 bg-gradient-to-r from-[#23b5b5] to-cyan-500 text-white rounded-xl disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              Create Note
            </button>
          </div>
        </div>
      </div>
      <div className="mb-8 flex-shrink-0">
  <button
    className="fixed bottom-6 right-6 
               bg-gradient-to-r from-minimal-primary to-minimal-primary/80 
               hover:from-minimal-primary/80 hover:to-minimal-primary 
               text-white font-semibold py-2 px-4 rounded-2xl 
               transition-all duration-300 hover:scale-105 
               hover:shadow-lg hover:shadow-minimal-primary/25"
  >
    Workflow
  </button>
</div>

    </div>
  );
}
