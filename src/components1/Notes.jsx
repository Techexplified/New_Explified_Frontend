import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, X } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import SidebarOnHover from "../reusable_components/SidebarOnHover2"; // ✅ import your sidebar

export default function Notes() {
  const [newTask, setNewTask] = useState("");
  const [title, setTitle] = useState("Create New Note");
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [tasks, setTasks] = useState([]);

  const navigate = useNavigate();
  const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
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
      title: "",
      content: newTask.trim(),
      lastModified: new Date().toISOString(),
    };
    const updated = [...tasks, newNote];
    localStorage.setItem("tasks", JSON.stringify(updated));
    localStorage.setItem(
      "alltask",
      JSON.stringify([...JSON.parse(localStorage.getItem("alltask") || "[]"), newNote])
    );
    setTasks(updated);
    setNewTask("");
    navigate("/Tasks");
  };

  return (
    <div className="flex bg-black min-h-screen text-white">
      {/* ✅ Sidebar is now separate */}
      <SidebarOnHover tasks={tasks} />

      {/* Main Content */}
      <div className="flex-1 p-8 pt-[50px]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 bg-gradient-to-r from-[#23b5b5] to-cyan-500 rounded-full flex items-center justify-center cursor-pointer"
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
                  className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setTitle(tempTitle.trim() || "Untitled Note");
                    setIsEditing(false);
                  }}
                  className="px-3 py-1 bg-cyan-500 rounded text-white"
                >
                  Save
                </button>
              </div>
            ) : (
              <h2 className="text-2xl font-bold">{title}</h2>
            )}
          </div>

          <X
            className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer"
            onClick={() => navigate("/Tasks")}
          />
        </div>

        <textarea
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white resize-none h-40"
          placeholder="Start writing your note..."
          autoFocus
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={addTask}
            disabled={!newTask.trim()}
            className="px-6 py-3 bg-gradient-to-r from-[#23b5b5] to-cyan-500 text-white rounded-xl disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed"
          >
            Create Note
          </button>
        </div>
      </div>
    </div>
  );
}
