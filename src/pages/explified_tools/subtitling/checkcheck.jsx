// AiSubtitlerPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Sparkles,
  Wrench,
  Folder,
  RotateCcw,
  X,
  Play,
  Download,
  Maximize2,
  Minimize2,
  Cpu,
  Save,
  Undo2,
  Redo2,
  Layers,
  Paintbrush,
  Languages,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ---------------- Config & helpers ---------------- */
const BACKEND_ORIGIN = (
  import.meta.env.VITE_API_ORIGIN || "http://localhost:4000"
).replace(/\/$/, "");
function normalizeVttUrl(vttUrl) {
  if (!vttUrl) return null;
  if (/^https?:\/\//i.test(vttUrl)) return vttUrl;
  return BACKEND_ORIGIN + (vttUrl.startsWith("/") ? vttUrl : "/" + vttUrl);
}
function formatTime(t) {
  if (!t || isNaN(t)) t = 0;
  const hrs = Math.floor(t / 3600);
  const mins = Math.floor((t % 3600) / 60);
  const secs = Math.floor(t % 60);
  const ms = Math.floor((t % 1) * 1000);
  if (hrs)
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  return `${mins}:${String(secs).padStart(2, "0")}.${String(ms).padStart(
    3,
    "0"
  )}`;
}
function isLikelyUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}
async function uploadFileToBackend(file) {
  const url = BACKEND_ORIGIN + "/upload-audio";
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(url, { method: "POST", body: form });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Upload failed ${res.status}: ${txt}`);
  }
  return res.json();
}

/* ---------------- UI building blocks ---------------- */
const ToolHeader = ({ title, onClose }) => (
  <div className="flex items-center justify-between border-b border-gray-700/50 pb-3 mb-4">
    <button
      onClick={onClose}
      className="p-1 text-gray-400 hover:text-white rounded transition flex-shrink-0"
    >
      <X className="w-5 h-5" />
    </button>
    <h3 className="absolute left-1/2 transform -translate-x-1/2 text-sm font-bold uppercase tracking-wider text-white">
      {title}
    </h3>
    <div className="flex space-x-2 ml-auto">
      <Undo2 className="w-5 h-5 text-gray-500" />
      <Redo2 className="w-5 h-5 text-gray-500" />
    </div>
  </div>
);
const SaveButton = ({ label = "Save" }) => (
  <button className="flex items-center justify-center w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition mt-6">
    <Save className="w-4 h-4 mr-2" />
    {label}
  </button>
);
const PanelContainer = ({ children }) => (
  <div
    className="absolute w-80 bg-gray-800 p-4 shadow-2xl z-10 overflow-y-auto transition-all duration-200 rounded-r-lg"
    style={{
      left: "7.8rem",
      top: "6rem",
      maxHeight: "calc(100vh - 10rem)",
      height: "fit-content",
      minWidth: "250px",
    }}
    onClick={(e) => e.stopPropagation()}
  >
    {children}
  </div>
);

/* ---------------- Tools (with callbacks) ---------------- */
const FontStyleTool = ({ onApplyStyle, currentStyle }) => {
  const options = [
    {
      label: "Sans (Default)",
      fontFamily: "Inter, system-ui, sans-serif",
      fontWeight: 600,
      fontSize: 18,
    },
    {
      label: "Serif",
      fontFamily: "Georgia, serif",
      fontWeight: 700,
      fontSize: 20,
    },
    {
      label: "Mono",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      fontWeight: 600,
      fontSize: 18,
    },
    {
      label: "Big",
      fontFamily: currentStyle.fontFamily || "Inter, sans-serif",
      fontWeight: 700,
      fontSize: 28,
    },
    {
      label: "Small",
      fontFamily: currentStyle.fontFamily || "Inter, sans-serif",
      fontWeight: 500,
      fontSize: 14,
    },
  ];
  return (
    <div className="space-y-4">
      <ToolHeader title="Font Styles" onClose={() => {}} />
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() =>
              onApplyStyle({
                fontFamily: opt.fontFamily,
                fontWeight: opt.fontWeight,
                fontSize: opt.fontSize,
              })
            }
            className="p-3 bg-gray-900 hover:bg-gray-800 rounded-lg text-left transition"
          >
            <div
              style={{
                fontFamily: opt.fontFamily,
                fontSize: opt.fontSize,
                fontWeight: opt.fontWeight,
                color: "#e6eef0",
              }}
            >
              {opt.label}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {opt.fontFamily.split(",")[0]}
            </div>
          </button>
        ))}
      </div>
      <SaveButton label="Apply" />
    </div>
  );
};

const FontColorTool = ({ onApplyColor, currentStyle }) => {
  const quick = [
    "#FFFFFF",
    "#000000",
    "#FF0000",
    "#FFCC00",
    "#00FF00",
    "#0000FF",
    "#FF00FF",
    "#00FFFF",
  ];
  return (
    <div className="space-y-4">
      <ToolHeader title="Font Color" onClose={() => {}} />
      <div className="flex gap-3 flex-wrap">
        {quick.map((c) => (
          <button
            key={c}
            onClick={() => onApplyColor(c)}
            className="w-12 h-12 rounded-full shadow-md border-2"
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
      </div>
      <div className="mt-4">
        <label className="text-sm text-gray-300">Custom HEX</label>
        <input
          type="text"
          placeholder="#FFFFFF"
          className="w-full mt-2 p-2 rounded bg-gray-700 text-white"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const v = e.currentTarget.value.trim();
              if (v) onApplyColor(v);
            }
          }}
        />
      </div>
      <SaveButton label="Apply color" />
    </div>
  );
};

const SubtitleSettingsTool = ({ subtitleStyle, onUpdateStyle }) => {
  const [bgEnabled, setBgEnabled] = useState(!!subtitleStyle.backgroundEnabled);
  const [bgColor, setBgColor] = useState(
    subtitleStyle.backgroundColor || "#000000"
  );
  const [bgOpacity, setBgOpacity] = useState(
    subtitleStyle.backgroundOpacity ?? 0.85
  );
  useEffect(() => {
    setBgEnabled(!!subtitleStyle.backgroundEnabled);
    setBgColor(subtitleStyle.backgroundColor || "#000000");
    setBgOpacity(subtitleStyle.backgroundOpacity ?? 0.85);
  }, [subtitleStyle]);
  return (
    <div className="space-y-4">
      <ToolHeader title="Subtitle Background" onClose={() => {}} />
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-300">Background</div>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={bgEnabled}
            onChange={(e) => {
              const v = e.target.checked;
              setBgEnabled(v);
              onUpdateStyle({ backgroundEnabled: v });
            }}
          />
          <span className="ml-2 text-xs text-gray-300">
            {bgEnabled ? "On" : "Off"}
          </span>
        </label>
      </div>

      <div>
        <label className="text-sm text-gray-300">Background color (hex)</label>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => {
            setBgColor(e.target.value);
            onUpdateStyle({ backgroundColor: e.target.value });
          }}
          className="w-full h-10 p-0 mt-2 bg-transparent border-0"
        />
      </div>

      <div>
        <label className="text-sm text-gray-300">
          Opacity ({Math.round(bgOpacity * 100)}%)
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={bgOpacity}
          onChange={(e) => {
            const v = Number(e.target.value);
            setBgOpacity(v);
            onUpdateStyle({ backgroundOpacity: v });
          }}
          className="w-full"
        />
      </div>

      <div className="mt-2 text-xs text-gray-400">
        Turn subtitle background off to have floating text (no box).
      </div>
      <SaveButton label="Apply background" />
    </div>
  );
};

const TranslateTool = ({}) => (
  <div className="space-y-4">
    <ToolHeader title="Translate" onClose={() => {}} />
    <p className="text-gray-300 font-semibold mb-3">Choose a language:</p>
    <select className="w-full bg-gray-700 p-3 rounded-lg text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500">
      <option>Select --</option>
      <option>English</option>
      <option>Spanish</option>
      <option>Hindi</option>
    </select>
    <button className="flex items-center justify-center w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition mt-6">
      Generate
      <Sparkles className="w-4 h-4 ml-2" />
    </button>
  </div>
);

const EffectsTool = ({}) => (
  <div className="space-y-4">
    <ToolHeader title="Effects" onClose={() => {}} />
    <p className="text-gray-300 font-semibold mb-3">Effects & Animations</p>
    <div className="grid grid-cols-4 gap-3">
      {["Fade", "Slide", "Bounce", "Pop", "None", "Strong", "Soft", "Type"].map(
        (item, i) => (
          <div
            key={i}
            className="text-2xl text-cyan-400 p-3 bg-gray-900 rounded-lg text-center cursor-pointer hover:border-2 hover:border-cyan-500 transition shadow-lg"
          >
            {item}
          </div>
        )
      )}
    </div>
    <SaveButton />
  </div>
);

const AIAgentTool = ({
  onGenerateSubtitles,
  isGenerating,
  generationProgress,
}) => (
  <div className="flex flex-col items-center justify-center p-6 space-y-6">
    <div className="w-24 h-24 bg-yellow-600 rounded-full flex items-center justify-center shadow-2xl">
      {isGenerating ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Cpu className="w-12 h-12 text-white" />
        </motion.div>
      ) : (
        <Cpu className="w-12 h-12 text-white" />
      )}
    </div>

    {!isGenerating ? (
      <>
        <p className="text-gray-300 text-center text-sm">
          🎬 Extract audio from video and generate real subtitles automatically
          using speech recognition.
        </p>
        <button
          onClick={onGenerateSubtitles}
          disabled={isGenerating}
          className="flex items-center justify-center w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition"
        >
          {isGenerating ? "Processing..." : "🎙️ Extract & Generate"}
          <Sparkles className="w-4 h-4 ml-2" />
        </button>
      </>
    ) : (
      <div className="w-full space-y-3">
        <p className="text-gray-300 text-center text-sm font-semibold">
          {generationProgress.message}
        </p>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: `${generationProgress.progress || 50}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-gray-400 text-xs text-center">
          {generationProgress.stage?.toUpperCase()}
        </p>
      </div>
    )}
  </div>
);

/* ---------- Toolbox Manager (left flyout) ---------- */
const ToolboxManager = ({ onSelectTool, setActivePanel }) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const menuRef = useRef(null);

  const subTools = useMemo(
    () => [
      { key: "fontStyle", label: "FONT STYLE" },
      { key: "fontColor", label: "FONT COLOR" },
      { key: "subtitleSettings", label: "SUBTITLE BG" },
      { key: "translate", label: "TRANSLATE" },
      { key: "effects", label: "EFFECTS" },
      { key: "aiAgent", label: "AI AGENT" },
    ],
    []
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((s) => Math.min(s + 1, subTools.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const tool = subTools[focusedIndex];
        if (tool) onSelectTool(tool.key);
      } else if (e.key === "Escape") setActivePanel?.(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusedIndex, subTools, onSelectTool, setActivePanel]);

  useEffect(() => {
    if (menuRef.current) {
      const btn =
        menuRef.current.querySelectorAll("[data-tool-item]")[focusedIndex];
      btn?.focus();
    }
  }, [focusedIndex]);

  const itemVariants = {
    hidden: { opacity: 0, x: -6 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.03 } }),
  };

  return (
    <motion.div
      className="absolute z-50 rounded-r-lg"
      style={{ left: "7.8rem", top: "6rem", minWidth: 0, width: "18rem" }}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: -8, scale: 0.995 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: "spring", stiffness: 240, damping: 26 },
        },
      }}
      layout
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-label="Toolbox"
    >
      <div className="bg-[#0f1720] border border-gray-800/60 p-4 shadow-lg rounded-r-lg overflow-visible">
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <h3 className="text-white text-lg font-semibold tracking-wide">
              Tools
            </h3>
          </div>

          <div
            ref={menuRef}
            role="menu"
            aria-label="Tool menu"
            className="flex flex-col items-center gap-3 px-2"
          >
            {subTools.map((t, i) => {
              const isFocused = focusedIndex === i;
              return (
                <motion.button
                  key={t.key}
                  data-tool-item
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setFocusedIndex(i);
                    onSelectTool(t.key);
                  }}
                  role="menuitem"
                  aria-pressed={isFocused}
                  className={`w-full max-w-[14rem] text-center py-2 rounded-md transition focus:outline-none ${
                    isFocused
                      ? "bg-[#0b1220] ring-2 ring-offset-1 ring-cyan-500 text-white"
                      : "bg-transparent hover:bg-[#0b1220] text-gray-200"
                  }`}
                >
                  <span className="text-sm font-medium tracking-wide">
                    {t.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setActivePanel?.(null)}
              className="text-xs text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ---------- Right tool panel ---------- */
const RightToolPanel = ({
  toolKey,
  onClose,
  onGenerateSubtitles,
  isGenerating,
  generationProgress,
  onApplyStyle,
  onApplyColor,
  subtitleStyle,
  onUpdateSubtitleStyle,
}) => {
  if (!toolKey) return null;
  const toolMap = {
    fontStyle: () => (
      <FontStyleTool onApplyStyle={onApplyStyle} currentStyle={subtitleStyle} />
    ),
    fontColor: () => (
      <FontColorTool onApplyColor={onApplyColor} currentStyle={subtitleStyle} />
    ),
    subtitleSettings: () => (
      <SubtitleSettingsTool
        subtitleStyle={subtitleStyle}
        onUpdateStyle={onUpdateSubtitleStyle}
      />
    ),
    translate: () => <TranslateTool />,
    effects: () => <EffectsTool />,
    aiAgent: () => (
      <AIAgentTool
        onGenerateSubtitles={onGenerateSubtitles}
        isGenerating={isGenerating}
        generationProgress={generationProgress}
      />
    ),
  };
  const ToolComponent =
    toolMap[toolKey] ||
    (() => <div className="text-gray-400">No tool found</div>);

  return (
    <div
      className="absolute z-40 rounded-l-lg"
      style={{ right: "6rem", top: "6rem", width: "19rem" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-[#071018] border border-gray-800/60 p-4 shadow-lg rounded-l-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="text-white text-sm font-semibold">
            {toolKey.toUpperCase()}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded"
              aria-label="Close tool panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div style={{ maxHeight: "58vh", overflowY: "auto" }}>
          <ToolComponent />
        </div>
      </div>
    </div>
  );
};

/* ---------- Panels for left flyout (Projects uses localStorage) ---------- */
function useProjectsStorage(key = "ai_sub_projects") {
  const load = () => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };
  const save = (projects) =>
    localStorage.setItem(key, JSON.stringify(projects));
  return { load, save };
}

const ProjectsPanel = ({ setActivePanel, onLoadProject, onSaveProject }) => {
  const store = useProjectsStorage();
  const [projects, setProjects] = useState(store.load());
  const [name, setName] = useState("");

  useEffect(() => {
    setProjects(store.load());
  }, []);

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please provide a project name");
      return;
    }
    const p = {
      id: "p_" + Date.now(),
      name: name.trim(),
      createdAt: Date.now(),
      dataRef: null,
    };
    // Ask caller to provide actual content via onSaveProject callback
    const payload = onSaveProject ? onSaveProject(p.name) : null;
    if (!payload) {
      alert("Save failed: no payload");
      return;
    }
    p.payload = payload;
    const next = [p, ...projects];
    setProjects(next);
    store.save(next);
    setName("");
  };

  const handleLoad = (p) => {
    if (onLoadProject) onLoadProject(p.payload);
    setActivePanel(null);
  };

  const handleDelete = (id) => {
    if (!confirm("Delete project?")) return;
    const next = projects.filter((x) => x.id !== id);
    setProjects(next);
    store.save(next);
  };

  return (
    <PanelContainer>
      <h2 className="text-xl font-bold mb-4 text-white">Projects</h2>

      <div className="mb-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New project name"
          className="w-full p-2 rounded bg-gray-900 text-white"
        />
        <button
          onClick={handleSave}
          className="mt-2 w-full px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded"
        >
          Save Current Project
        </button>
      </div>

      <div>
        <p className="text-gray-400 text-xs mb-2">Saved Projects</p>
        <div className="space-y-2 max-h-[36vh] overflow-y-auto">
          {projects.length === 0 && (
            <div className="text-gray-500 text-sm">No projects saved yet.</div>
          )}
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-gray-900 p-2 rounded flex items-center justify-between"
            >
              <div>
                <div className="text-sm font-semibold text-white">{p.name}</div>
                <div className="text-xs text-gray-400">
                  {new Date(p.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLoad(p)}
                  className="text-xs px-2 py-1 bg-cyan-600 rounded text-white"
                >
                  Load
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-xs px-2 py-1 bg-red-700 rounded text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setActivePanel(null)}
        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white rounded transition"
      >
        <X className="w-5 h-5" />
      </button>
    </PanelContainer>
  );
};

const AutoModePanel = ({
  setActivePanel,
  onGenerateSubtitles,
  isGenerating,
  generationProgress,
}) => (
  <PanelContainer>
    <h2 className="text-xl font-bold mb-6 text-white">Auto Mode</h2>
    <div className="bg-gray-700 rounded-lg p-3 mb-4 w-48 h-32 overflow-hidden flex items-center justify-center">
      <img
        src="https://placehold.co/150x80/2f4f4f/99ff99?text=Extract+Audio"
        alt="Auto Mode"
        className="w-full h-auto object-cover"
      />
    </div>

    {!isGenerating ? (
      <>
        <p className="text-gray-400 text-xs mb-6">
          🎬 Click to extract audio from your video and generate real subtitles
          automatically.
        </p>
        <button
          onClick={onGenerateSubtitles}
          disabled={isGenerating}
          className="flex items-center justify-center w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition"
        >
          {isGenerating ? "Extracting..." : "🎙️ Extract Audio"}{" "}
          <Sparkles className="w-4 h-4 ml-2" />
        </button>
      </>
    ) : (
      <div className="space-y-3">
        <p className="text-gray-300 text-sm font-semibold text-center">
          {generationProgress.message}
        </p>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: `${generationProgress.progress || 50}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-gray-400 text-xs text-center">
          {generationProgress.stage?.toUpperCase()}
        </p>
      </div>
    )}

    <button
      onClick={() => setActivePanel(null)}
      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white rounded transition"
    >
      <X className="w-5 h-5" />
    </button>
  </PanelContainer>
);

const PremiumPanel = ({ setActivePanel }) => (
  <PanelContainer>
    <h2 className="text-xl font-bold mb-8 text-white">About</h2>
    <div className="space-y-4 text-sm text-gray-300">
      <div className="bg-gray-900 p-3 rounded">
        <p className="font-bold text-cyan-400 mb-1">🎬 How It Works</p>
        <p className="text-xs">
          Extracts audio from video → Converts to WAV format → Uses speech
          recognition to transcribe → Creates SRT subtitles
        </p>
      </div>
      <div className="bg-gray-900 p-3 rounded">
        <p className="font-bold text-cyan-400 mb-1">✨ Features</p>
        <p className="text-xs">
          • Real audio extraction
          <br />• Automatic speech recognition
          <br />• Time-synced subtitles
          <br />• Export as SRT/VTT
        </p>
      </div>
      <div className="bg-yellow-900 p-3 rounded">
        <p className="font-bold text-yellow-300 mb-1">⚠️ Note</p>
        <p className="text-xs">
          Works best with clear audio. Processing time depends on video length.
        </p>
      </div>
    </div>
    <button
      onClick={() => setActivePanel(null)}
      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white rounded transition"
    >
      <X className="w-5 h-5" />
    </button>
  </PanelContainer>
);

/* ---------------- PlayerContainer (with overlay background applied from style) ---------------- */
const PlayerContainer = ({
  videoRef,
  videoData,
  videoMetadata,
  isMaximized,
  setIsMaximized,
  currentSubtitle,
  subtitles,
  subtitleStyle = {},
  onSeekTo,
  view,
}) => {
  const MaximizeIcon = isMaximized ? Minimize2 : Maximize2;
  const maximizedContainerStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    zIndex: 10,
    backgroundColor: "black",
  };
  const isPortrait = videoMetadata?.aspectRatio === "portrait";
  const aspectRatioPadding = isPortrait ? "177.78%" : "56.25%";
  const normalContainerClasses = `w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden ${
    isPortrait ? "max-w-md" : "max-w-xl"
  }`;

  // attach vtt/subtitles if provided
  // attach vtt/subtitles if provided
  // attach vtt/subtitles if provided
  useEffect(() => {
    if (view !== "editor") return;
    const vttUrl = videoData?.vttUrl;
    const providedSegments = videoData?.subtitles || [];

    if (videoRef.current && vttUrl) {
      let trackEl = videoRef.current.querySelector("track[data-generated-vtt]");
      if (!trackEl) {
        trackEl = document.createElement("track");
        trackEl.kind = "subtitles";
        trackEl.label = "AI Subtitles";
        trackEl.srclang = "en";
        trackEl.setAttribute("data-generated-vtt", "true");
        trackEl.default = false;
        videoRef.current.appendChild(trackEl);
      }

      // set src (this triggers the browser to load cues)
      trackEl.src = vttUrl;

      const onTrackLoad = () => {
        try {
          const cues = Array.from(trackEl.track?.cues || []);
          if (cues.length > 0) {
            const mapped = cues.map((c) => ({
              start: c.startTime,
              end: c.endTime,
              text: c.text,
            }));
            setSubtitles(mapped);
          } else if (
            Array.isArray(providedSegments) &&
            providedSegments.length > 0
          ) {
            setSubtitles(providedSegments);
          }
        } catch (e) {
          if (Array.isArray(providedSegments) && providedSegments.length > 0) {
            setSubtitles(providedSegments);
          }
        }
      };

      trackEl.addEventListener("load", onTrackLoad);
      return () => trackEl.removeEventListener("load", onTrackLoad);
    } else if (Array.isArray(providedSegments) && providedSegments.length > 0) {
      // no vtt, but segments provided directly
      setSubtitles(providedSegments);
    }
  }, [view, videoData?.vttUrl, videoData?.subtitles]);

  const overlayStyle = {
    fontFamily: subtitleStyle.fontFamily || "Inter, system-ui, sans-serif",
    fontSize: (subtitleStyle.fontSize || 18) + "px",
    fontWeight: subtitleStyle.fontWeight || 600,
    color: subtitleStyle.color || "#fff",
    textShadow: subtitleStyle.textShadow || "0 2px 8px rgba(0,0,0,0.7)",
    lineHeight: 1.25,
    background: subtitleStyle.backgroundEnabled
      ? `${subtitleStyle.backgroundColor || "#000000"}`
      : "transparent",
    backgroundOpacity: subtitleStyle.backgroundOpacity ?? 0.85,
  };

  const bgStyleComputed =
    overlayStyle.background === "transparent"
      ? {}
      : {
          backgroundColor: overlayStyle.background,
          opacity: overlayStyle.backgroundOpacity,
          padding: "10px 18px",
          borderRadius: 10,
        };

  return (
    <div
      className="relative w-full h-full max-h-[85vh] flex items-center justify-center"
      style={isMaximized ? maximizedContainerStyle : {}}
    >
      <div className={isMaximized ? "w-full h-full" : normalContainerClasses}>
        <div
          className={isMaximized ? "w-full h-full relative" : "relative"}
          style={isMaximized ? {} : { paddingTop: aspectRatioPadding }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            {videoData?.videoUrl ? (
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                controls
                crossOrigin="anonymous"
                style={{ backgroundColor: "#000" }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-gray-400 text-xl">
                Video Placeholder (
                {videoMetadata?.aspectRatio === "portrait" ? "9:16" : "16:9"})
              </div>
            )}
          </div>

          <AnimatePresence>
            {currentSubtitle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-16 left-0 right-0 text-center z-40 pointer-events-none px-4"
              >
                <div
                  style={{
                    display: "inline-block",
                    ...bgStyleComputed,
                    border:
                      overlayStyle.background === "transparent"
                        ? "none"
                        : "1px solid rgba(6,182,212,0.18)",
                    color: overlayStyle.color,
                    fontFamily: overlayStyle.fontFamily,
                    fontSize: overlayStyle.fontSize,
                    fontWeight: overlayStyle.fontWeight,
                    lineHeight: overlayStyle.lineHeight,
                  }}
                >
                  {currentSubtitle}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {subtitles?.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-20"
            >
              ✓ {subtitles.length} Subtitles
            </motion.div>
          )}

          <button
            title={isMaximized ? "Minimize" : "Maximize"}
            className="absolute bottom-3 right-3 p-2 bg-gray-900/70 text-gray-300 hover:text-white rounded-lg transition-all z-20"
            onClick={(e) => {
              e.stopPropagation();
              setIsMaximized(!isMaximized);
            }}
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Timeline with cue markers (click to seek) ---------------- */
const TimelineBar = ({
  videoRef,
  videoMetadata,
  subtitles,
  onSeek,
  onPlayFrom,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const duration = (videoMetadata && videoMetadata.duration) || 100;
  useEffect(() => {
    if (videoRef?.current) {
      const video = videoRef.current;
      const updateTime = () => setCurrentTime(video.currentTime);
      video.addEventListener("timeupdate", updateTime);
      return () => video.removeEventListener("timeupdate", updateTime);
    }
  }, [videoRef]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const formatShort = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-4xl pt-8 pb-4 flex flex-col items-center gap-4">
      <div className="mb-2">
        <button
          className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors shadow-2xl"
          onClick={() => {
            if (videoRef?.current)
              videoRef.current.paused
                ? videoRef.current.play()
                : videoRef.current.pause();
          }}
        >
          <Play className="w-6 h-6 text-white fill-white" />
        </button>
      </div>

      <div className="w-full bg-gray-900 rounded-xl shadow-2xl p-4">
        <div
          className="w-full h-20 bg-black rounded-lg border-4 border-white flex items-center justify-center px-6 relative overflow-hidden cursor-pointer"
          onClick={(e) => {
            if (videoRef?.current && duration > 0) {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const percentage = clickX / rect.width;
              videoRef.current.currentTime = percentage * duration;
            }
          }}
        >
          {/* timeline progress */}
          <div
            className="absolute left-0 top-0 h-full bg-cyan-600/30 transition-all"
            style={{ width: `${progress}%` }}
          />
          <span className="text-gray-400 text-lg relative z-10 font-mono">
            {formatShort(currentTime)} / {formatShort(duration)}
          </span>

          {/* cue markers overlay */}
          {duration > 0 &&
            subtitles &&
            subtitles.map((s, i) => {
              const left = (s.start / duration) * 100;
              const width = Math.max(
                1,
                (Math.max(s.end - s.start, 0.2) / duration) * 100
              ); // min width for visibility
              return (
                <div
                  key={i}
                  title={`${formatTime(s.start)} — ${s.text}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSeek) onSeek(s.start);
                  }}
                  style={{
                    position: "absolute",
                    left: `${left}%`,
                    width: `${width}%`,
                    top: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(90deg, rgba(35,211,198,0.18), rgba(6,182,212,0.08))",
                    borderLeft: "1px solid rgba(6,182,212,0.18)",
                    cursor: "pointer",
                  }}
                >
                  {/* small play icon at left */}
                  <div style={{ position: "absolute", left: 2, top: 2 }}>
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        if (onPlayFrom) onPlayFrom(s.start);
                      }}
                      className="p-0 leading-none"
                    >
                      <Play className="w-3 h-3 text-white opacity-80" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

/* --- ExportModal --- */
function ExportModal({
  isOpen,
  onClose,
  subtitles = [],
  videoData = {},
  subtitleStyle = {},
  videoMetadata = {},
  onDownloadBlob, // function passed from parent
}) {
  if (!isOpen) return null;
  const fmtSrtTime = (time = 0) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
  };
  const fmtVttTime = (time = 0) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
  };

  const downloadSRT = () => {
    let srt = "";
    subtitles.forEach((sub, i) => {
      srt += `${i + 1}\n${fmtSrtTime(sub.start)} --> ${fmtSrtTime(sub.end)}\n${
        sub.text
      }\n\n`;
    });
    const blob = new Blob([srt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subtitles.srt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // inside AiSubtitlerPage component

  // helper to download a blob or URL
  const downloadBlob = (blobOrUrl, filename) => {
    const a = document.createElement("a");
    if (blobOrUrl instanceof Blob) {
      const url = URL.createObjectURL(blobOrUrl);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } else {
      // assume it's a URL string
      a.href = blobOrUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  // Download original video (best-effort)
  // Download original video (best-effort)
const downloadOriginalVideo = () => {
  try {
    const src = videoData?.videoUrl;
    if (!src) {
      alert("No video to download");
      return;
    }

    // Use the modal's internal downloadBlob helper (handles Blobs and URLs)
    downloadBlob(src, (videoData.fileName || "video") + ".mp4");
  } catch (err) {
    console.error(err);
    alert("Failed to download original video: " + err.message);
  }
};


  /*
  Export burned-in WebM video. This clones the video element, draws each frame onto
  a canvas while adding subtitle text at correct times, captures the canvas stream
  and records via MediaRecorder.
*/
  const exportBurnedInVideo = async () => {
    if (!videoData?.videoUrl) {
      alert("No video loaded.");
      return;
    }

    try {
      // create an offscreen video element to avoid changing UI playback
      const vid = document.createElement("video");
      vid.crossOrigin = "anonymous";
      vid.src = videoData.videoUrl;
      vid.muted = true;
      vid.playsInline = true;

      await new Promise((res, rej) => {
        vid.addEventListener("loadedmetadata", res, { once: true });
        vid.addEventListener(
          "error",
          (e) => rej(new Error("Failed to load video")),
          { once: true }
        );
      });

      const w = vid.videoWidth || 1280;
      const h = vid.videoHeight || 720;

      // prepare canvas
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");

      // style values for subtitle printing (from subtitleStyle state)
      const fontFamily =
        subtitleStyle.fontFamily || "Inter, system-ui, sans-serif";
      const fontSizePx = subtitleStyle.fontSize || 18;
      const fontWeight = subtitleStyle.fontWeight || 600;
      const color = subtitleStyle.color || "#ffffff";
      const bgEnabled = !!subtitleStyle.backgroundEnabled;
      const bgColor = subtitleStyle.backgroundColor || "#000000";
      const bgOpacity = subtitleStyle.backgroundOpacity ?? 0.85;

      // capture stream and init MediaRecorder
      const stream = canvas.captureStream(30); // 30 FPS
      let mime = "video/webm;codecs=vp9";
      if (!MediaRecorder.isTypeSupported(mime)) mime = "video/webm;codecs=vp8";
      if (!MediaRecorder.isTypeSupported(mime)) mime = "video/webm";

      const recordedChunks = [];
      const recorder = new MediaRecorder(stream, { mimeType: mime });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size) recordedChunks.push(e.data);
      };

      const finishRecording = () =>
        new Promise((resolve) => {
          recorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: mime });
            resolve(blob);
          };
        });

      // draw loop: draw video frame and overlay subtitles for currentTime
      let rafId;
      const drawFrame = () => {
        try {
          ctx.drawImage(vid, 0, 0, w, h);
        } catch (err) {
          // cross-origin / tainted canvas error
          console.error("Canvas drawImage error:", err);
          cancelAnimationFrame(rafId);
          recorder.state !== "inactive" && recorder.stop();
          alert(
            "Unable to draw video to canvas. Cross-origin restrictions may apply."
          );
          return;
        }

        // compute current time on clone video
        const t = vid.currentTime;

        // find active subtitle(s)
        const active = subtitles.filter((s) => t >= s.start && t <= s.end);
        if (active.length > 0) {
          const text = active.map((a) => a.text).join(" ");
          // subtitle background box
          const paddingX = Math.round(w * 0.02);
          const paddingY = 8;
          const maxWidth = Math.round(w * 0.9);

          ctx.font = `${fontWeight} ${fontSizePx}px ${fontFamily}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";

          // measure and wrap if necessary
          const words = text.split(" ");
          const lines = [];
          let line = "";
          for (let i = 0; i < words.length; i++) {
            const testLine = line ? `${line} ${words[i]}` : words[i];
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line) {
              lines.push(line);
              line = words[i];
            } else {
              line = testLine;
            }
          }
          if (line) lines.push(line);

          // calculate box size
          const lineHeight = fontSizePx * 1.25;
          const boxHeight = lineHeight * lines.length + paddingY * 2;
          const boxWidth = Math.min(
            maxWidth,
            ctx.measureText(
              lines.reduce((a, b) => (a.length > b.length ? a : b))
            ).width +
              paddingX * 2
          );

          const boxX = w / 2 - boxWidth / 2;
          const boxY = h - boxHeight - Math.round(h * 0.03);

          if (bgEnabled) {
            ctx.globalAlpha = bgOpacity;
            ctx.fillStyle = bgColor;
            ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
            ctx.globalAlpha = 1;
          }

          // draw text lines
          ctx.fillStyle = color;
          for (let i = 0; i < lines.length; i++) {
            const y = boxY + paddingY + (i + 1) * lineHeight - 4;
            ctx.fillText(lines[i], w / 2, y);
          }
        }

        rafId = requestAnimationFrame(drawFrame);
      };

      // start playback and recording
      vid.currentTime = 0;
      // ensure video plays
      await vid.play().catch((e) => {
        // autoplay might be blocked: still start recording but user will need to interact or we can set currentTime and step
        console.warn("Play blocked", e);
      });

      recorder.start(250); // emit data every 250ms
      drawFrame();

      // stop when clone video ends
      await new Promise((res) => {
        vid.addEventListener(
          "ended",
          () => {
            // stop draw loop & recorder
            cancelAnimationFrame(rafId);
            if (recorder.state !== "inactive") recorder.stop();
            res();
          },
          { once: true }
        );

        // safety: also stop after duration in case ended doesn't fire
        setTimeout(() => {
          if (!vid.ended) {
            // try to fast-forward to end
            try {
              vid.currentTime = vid.duration;
            } catch {}
          }
        }, (videoMetadata.duration || vid.duration) * 1000 + 1000);
      });

      const recordedBlob = await finishRecording();
      downloadBlob(
        recordedBlob,
        (videoData.fileName || "video") + "-burned.webm"
      );

      // cleanup
      vid.pause();
      vid.src = "";
      canvas.remove();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed: " + (err.message || err));
    }
  };

  const downloadVTT = () => {
    let vtt = "WEBVTT\n\n";
    subtitles.forEach((sub) => {
      vtt += `${fmtVttTime(sub.start)} --> ${fmtVttTime(sub.end)}\n${
        sub.text
      }\n\n`;
    });
    const blob = new Blob([vtt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subtitles.vtt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1500,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 520,
          maxWidth: "92vw",
          background: "#0f1720",
          color: "#fff",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <h3 style={{ margin: 0 }}>Export Subtitles</h3>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#bbb",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: 12 }}>
          <strong>Total cues:</strong> {subtitles.length}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button
            onClick={downloadSRT}
            style={{
              flex: 1,
              padding: 10,
              background: "#06b6d4",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Download SRT
          </button>
          <button
            onClick={downloadVTT}
            style={{
              flex: 1,
              padding: 10,
              background: "#34d399",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Download VTT
          </button>
        </div>

        {/* New video export controls */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button
            onClick={() => {
              // try to download original video
              try {
                downloadOriginalVideo();
              } catch (e) {
                alert("Failed to download original: " + e.message);
              }
            }}
            style={{
              flex: 1,
              padding: 10,
              background: "#3b82f6",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              cursor: "pointer",
              color: "#fff",
            }}
          >
            Download Original Video
          </button>

          <button
            onClick={() => {
              // kick off burned-in export
              // you must ensure exportBurnedInVideo is in scope (declare it inside the component)
              exportBurnedInVideo();
            }}
            style={{
              flex: 1,
              padding: 10,
              background: "#ef4444",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              cursor: "pointer",
              color: "#fff",
            }}
          >
            Export Video with Burned-in Subtitles (WebM)
          </button>
        </div>

        <div
          style={{
            background: "#071018",
            padding: 10,
            borderRadius: 8,
            maxHeight: 280,
            overflowY: "auto",
            border: "1px solid rgba(255,255,255,0.03)",
          }}
        >
          {subtitles.length === 0 ? (
            <div style={{ color: "#9ca3af" }}>No subtitles</div>
          ) : (
            subtitles.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: 8,
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                <div style={{ color: "#9fb0b0", fontSize: 12 }}>
                  [{i + 1}] {fmtVttTime(s.start)} → {fmtVttTime(s.end)}
                </div>
                <div style={{ marginTop: 6, fontSize: 13 }}>{s.text}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Main AiSubtitlerPage component -------------------- */
export default function AiSubtitlerPage() {
  const location = useLocation();
  const initialVideoData = location?.state || {};

  const [view, setView] = useState(
    initialVideoData?.videoUrl ? "editor" : "landing"
  );

  const [showUploadOverlay, setShowUploadOverlay] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [pasteValue, setPasteValue] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef();

  const [videoData, setVideoData] = useState(initialVideoData || {});
  const [activePanel, setActivePanel] = useState(null);
  const [selectedToolKey, setSelectedToolKey] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [subtitles, setSubtitles] = useState(initialVideoData?.subtitles || []);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({
    stage: "",
    message: "Ready...",
    progress: 0,
  });
  const [generationError, setGenerationError] = useState(null);

  const videoRef = useRef(null);
  const [videoMetadata, setVideoMetadata] = useState(
    initialVideoData?.videoMetadata || { aspectRatio: "landscape", duration: 0 }
  );

  // subtitle style state
  const [subtitleStyle, setSubtitleStyle] = useState({
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: 18,
    fontWeight: 600,
    color: "#ffffff",
    backgroundEnabled: true,
    backgroundColor: "#000000",
    backgroundOpacity: 0.85,
  });

  // file pick
  const onFilePicked = (e) => {
    const file = e?.target?.files?.[0] || e;
    if (!file) return;
    if (!file.type.startsWith("video/") && !file.type.startsWith("audio/")) {
      alert("Please select a valid video/audio file");
      return;
    }
    setSelectedFile(file);
    setSelectedFileName(file.name);
    setPasteValue("");
  };

  // generate/upload (keeps original behavior)
  const handleGenerate = async (
    overrideSelectedFile = null,
    overridePasteValue = null
  ) => {
    const fileToUse = overrideSelectedFile ?? selectedFile;
    const pasteToUse = overridePasteValue ?? pasteValue;
    if (!fileToUse && !pasteToUse) {
      alert("Please select a file or paste a URL first");
      return;
    }
    setIsExtracting(true);
    try {
      let videoUrl = null;
      let meta = { duration: 0, width: 0, height: 0, aspectRatio: "landscape" };

      if (fileToUse) {
        videoUrl = URL.createObjectURL(fileToUse);
        meta = await new Promise((resolve) => {
          const v = document.createElement("video");
          v.preload = "metadata";
          v.onloadedmetadata = () =>
            resolve({
              duration: v.duration || 0,
              width: v.videoWidth || 0,
              height: v.videoHeight || 0,
              aspectRatio:
                v.videoWidth > v.videoHeight ? "landscape" : "portrait",
            });
          v.src = videoUrl;
        });

        try {
          const result = await uploadFileToBackend(fileToUse);
          const { text, segments, vttUrl } = result || {};
          setIsExtracting(false);
          const newData = {
            videoUrl,
            videoMetadata: meta,
            fileName: selectedFileName || "Video from device",
            sourceType: "file",
            subtitles: segments || [],
            vttUrl: normalizeVttUrl(vttUrl),
            transcriptionText: text || "",
          };
          setVideoData(newData);
          setVideoMetadata(meta);
          setSubtitles(segments || []);
          setShowUploadOverlay(false);
          setView("editor");
          return;
        } catch (err) {
          console.error("Upload/transcription error:", err);
          setIsExtracting(false);
          alert("Failed to upload / transcribe file: " + (err.message || err));
          return;
        }
      } else {
        if (!isLikelyUrl(pasteToUse)) {
          setIsExtracting(false);
          alert("Invalid URL");
          return;
        }
        try {
          const v = document.createElement("video");
          v.preload = "metadata";
          v.src = pasteToUse;
          await new Promise((res, rej) => {
            v.onloadedmetadata = res;
            v.onerror = rej;
          });
          meta = {
            duration: v.duration || 0,
            width: v.videoWidth || 0,
            height: v.videoHeight || 0,
            aspectRatio:
              v.videoWidth > v.videoHeight ? "landscape" : "portrait",
          };
          videoUrl = pasteToUse;
          setIsExtracting(false);
          const newData = {
            videoUrl,
            videoMetadata: meta,
            fileName: "Video from URL",
            sourceType: "url",
            subtitles: [],
            vttUrl: null,
            transcriptionText: "",
          };
          setVideoData(newData);
          setVideoMetadata(meta);
          setSubtitles([]);
          setShowUploadOverlay(false);
          setView("editor");
          return;
        } catch (err) {
          setIsExtracting(false);
          alert("Invalid or unreachable video URL");
          return;
        }
      }
    } catch (err) {
      setIsExtracting(false);
      console.error(err);
      alert("An error occurred");
    }
  };

  // attach video src & metadata
  useEffect(() => {
    if (view === "editor" && videoData?.videoUrl && videoRef.current) {
      videoRef.current.src = videoData.videoUrl;
      const onLoaded = () => {
        const ar =
          videoRef.current.videoWidth > videoRef.current.videoHeight
            ? "landscape"
            : "portrait";
        setVideoMetadata({
          duration: videoRef.current.duration,
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
          aspectRatio: ar,
        });
      };
      videoRef.current.addEventListener("loadedmetadata", onLoaded);
      return () =>
        videoRef.current?.removeEventListener("loadedmetadata", onLoaded);
    }
  }, [view, videoData]);

  // attach vtt/subtitles if provided
  useEffect(() => {
    if (view !== "editor") return;
    const vttUrl = videoData?.vttUrl;
    const providedSegments = videoData?.subtitles || [];
    if (videoRef.current && vttUrl) {
      let trackEl = videoRef.current.querySelector("track[data-generated-vtt]");
      if (!trackEl) {
        trackEl = document.createElement("track");
        trackEl.kind = "subtitles";
        trackEl.label = "AI Subtitles";
        trackEl.srclang = "en";
        trackEl.setAttribute("data-generated-vtt", "true");
        trackEl.default = false;
        videoRef.current.appendChild(trackEl);
      }
      trackEl.src = vttUrl;
      trackEl.addEventListener("load", () => {
        try {
          const cues = Array.from(trackEl.track?.cues || []);
          if (cues.length > 0) {
            const mapped = cues.map((c) => ({
              start: c.startTime,
              end: c.endTime,
              text: c.text,
            }));
            setSubtitles(mapped);
          } else if (
            Array.isArray(providedSegments) &&
            providedSegments.length > 0
          ) {
            setSubtitles(providedSegments);
          }
        } catch (e) {
          if (Array.isArray(providedSegments) && providedSegments.length > 0)
            setSubtitles(providedSegments);
        }
      });
    } else if (Array.isArray(providedSegments) && providedSegments.length > 0) {
      setSubtitles(providedSegments);
    }
  }, [view, videoData?.vttUrl]);

  // timeupdate -> overlay subtitle
  useEffect(() => {
    if (view !== "editor") return;
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      const t = v.currentTime;
      const found = subtitles.find((s) => t >= s.start && t <= s.end);
      setCurrentSubtitle(found ? found.text : "");
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [view, subtitles]);

  // placeholder generation function
  const handleGenerateSubtitles = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationProgress({
      stage: "extract",
      message: "Extracting audio...",
      progress: 10,
    });
    try {
      await new Promise((r) => setTimeout(r, 1200));
      const dummy = [
        {
          start: 0,
          end: Math.min(4, videoMetadata.duration || 4),
          text: "Generated placeholder subtitle — replace with real transcriber.",
        },
      ];
      setSubtitles(dummy);
      setGenerationProgress({
        stage: "done",
        message: "Subtitles generated (placeholder)",
        progress: 100,
      });
      alert(
        "Auto-generation placeholder complete — plug in your transcription function here."
      );
      setActivePanel(null);
    } catch (err) {
      console.error(err);
      setGenerationError(err.message || "Failed to generate subtitles");
    } finally {
      setIsGenerating(false);
    }
  };

  // style update helpers
  const applyStyle = (partial) => {
    setSubtitleStyle((s) => ({ ...s, ...partial }));
  };
  const applyColor = (hex) => {
    setSubtitleStyle((s) => ({ ...s, color: hex }));
  };
  const updateSubtitleStyle = (partial) => {
    setSubtitleStyle((s) => ({ ...s, ...partial }));
  };

  // timeline seek and play-from functions
  const seekTo = (t) => {
    if (videoRef.current) videoRef.current.currentTime = t;
  };
  const playFrom = (t) => {
    if (videoRef.current) {
      videoRef.current.currentTime = t;
      videoRef.current.play();
    }
  };

  // cue editing functions
  const editCueText = (index, newText) => {
    setSubtitles((s) => {
      const copy = [...s];
      copy[index] = { ...copy[index], text: newText };
      return copy;
    });
  };
  const deleteCue = (index) => {
    if (!confirm("Delete this cue?")) return;
    setSubtitles((s) => s.filter((_, i) => i !== index));
  };
  const addCueAtCurrent = () => {
    const t = videoRef.current?.currentTime || 0;
    const dur = Math.min(4, (videoMetadata.duration || 4) - t);
    const newCue = { start: t, end: t + (dur || 2), text: "New subtitle…" };
    setSubtitles((s) => {
      const nxt = [...s, newCue].sort((a, b) => a.start - b.start);
      return nxt;
    });
  };

  // projects: save/load using localStorage (payload includes videoUrl, metadata, subtitles, subtitleStyle)
  const projectsKey = "ai_sub_projects";
  const loadProjects = () => {
    try {
      const raw = localStorage.getItem(projectsKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };
  const saveProject = (name) => {
    const projects = loadProjects();
    const project = {
      id: "p_" + Date.now(),
      name,
      createdAt: Date.now(),
      payload: { videoData, videoMetadata, subtitles, subtitleStyle },
    };
    const next = [project, ...projects];
    localStorage.setItem(projectsKey, JSON.stringify(next));
    return project;
  };
  const loadProject = (payload) => {
    if (!payload) {
      alert("Invalid project payload");
      return;
    }
    setVideoData(payload.videoData || {});
    setVideoMetadata(
      payload.videoMetadata || { aspectRatio: "landscape", duration: 0 }
    );
    setSubtitles(payload.subtitles || []);
    setSubtitleStyle(payload.subtitleStyle || subtitleStyle);
    setView("editor");
  };

  // Export: uses ExportModal (above)
  const [showProjectSavedToast, setShowProjectSavedToast] = useState(false);

  /* ---------------- Landing UI ---------------- */
  const LandingView = (
    <div
      style={{
        minHeight: "100vh",
        background: "#060708",
        color: "#e6eef0",
        fontFamily: "Inter, sans-serif",
        padding: 32,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              background: "#19b5ac",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#022",
              fontWeight: 800,
              fontSize: 24,
            }}
          >
            E
          </div>
          <h1 style={{ fontSize: 32, margin: 0, fontWeight: 700 }}>
            AI SUBTITLE GENERATOR
          </h1>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: 1000,
            maxWidth: "94vw",
            background:
              "linear-gradient(180deg, rgba(17,18,18,0.96), rgba(14,16,16,0.96))",
            borderRadius: 12,
            padding: 40,
            border: "1px solid rgba(30,130,125,0.06)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.65)",
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <button
              onClick={() => setShowUploadOverlay(true)}
              style={{
                width: "100%",
                maxWidth: 340,
                height: 210,
                borderRadius: 8,
                background:
                  "linear-gradient(180deg, rgba(14,20,20,1), rgba(10,12,12,1))",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.02)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.02), 0 8px 30px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#19b5ac",
                  background: "rgba(20,30,30,0.4)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
                  marginBottom: 6,
                }}
              >
                ⬆️
              </div>
              <div
                style={{
                  fontSize: 25,
                  fontWeight: 700,
                  color: "#fff",
                  marginTop: 12,
                }}
              >
                {selectedFileName ? "File Selected" : "Choose a file"}
              </div>
              <div style={{ color: "#9fb0b0", fontSize: 18, marginTop: 6 }}>
                {selectedFileName || "Upload a video to get started"}
              </div>
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              marginTop: 60,
              marginBottom: 36,
            }}
          >
            {[
              { title: "Multi-Language Support", icon: "🌐" },
              { title: "Caption Editing", icon: "✏️" },
              { title: "Font Color Control", icon: "🎨" },
              { title: "Auto Mode", icon: "⚙️" },
              { title: "Font Style Customization", icon: "📝" },
              { title: "Real-Time Preview", icon: "👁️" },
            ].map((item, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 6,
                    background: "#14bfb3",
                    boxShadow: "0 2px 8px rgba(25,181,172,0.18)",
                    flexShrink: 0,
                  }}
                />
                <div style={{ color: "#c8d2d2", fontSize: 18 }}>
                  {item.title}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={() => handleGenerate()}
              style={{
                background: "linear-gradient(90deg,#19b5ac,#13b7b0)",
                color: "#022",
                borderRadius: 10,
                padding: "14px 36px",
                fontWeight: 800,
                fontSize: 30,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 12px 30px rgba(19,181,172,0.18)",
              }}
            >
              Generate ✨
            </button>
          </div>
        </div>
      </div>

      {showUploadOverlay && (
        <div
          onClick={() => setShowUploadOverlay(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 1300,
              maxWidth: "95%",
              height: 600,
              maxHeight: "95vh",
              borderRadius: 8,
              background: "rgba(20,20,20,0.95)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
              padding: 28,
              position: "relative",
              color: "#e6efef",
              display: "flex",
              flexDirection: "column",
              gap: 28,
              overflowY: "auto",
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="video/*,audio/*"
              style={{ display: "none" }}
              onChange={onFilePicked}
            />
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 22,
                  marginBottom: 18,
                  color: "#dff7f5",
                }}
              >
                Upload File
              </div>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "100%",
                  maxWidth: 800,
                  height: 250,
                  borderRadius: 6,
                  background: "linear-gradient(180deg,#122826,#0d2424)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  gap: 18,
                  margin: "0 auto",
                }}
              >
                <div style={{ fontSize: 36 }}>📤</div>
                <div
                  style={{ fontSize: 34, fontWeight: 800, color: "#dff7f5" }}
                >
                  Upload file
                </div>
                <div style={{ color: "#9fb0b0", fontSize: 18 }}>
                  Click or drag & drop file here
                </div>
              </div>

              {selectedFileName && (
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 14,
                    color: "#19b5ac",
                    textAlign: "center",
                  }}
                >
                  ✓ File selected: <strong>{selectedFileName}</strong>
                </div>
              )}

              {selectedFileName && (
                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => {
                      setShowUploadOverlay(false);
                      handleGenerate();
                    }}
                    style={{
                      padding: "12px 32px",
                      borderRadius: 8,
                      background: "linear-gradient(90deg,#19b5ac,#13b7b0)",
                      border: "none",
                      color: "#022",
                      fontWeight: 800,
                      fontSize: 16,
                      cursor: "pointer",
                      boxShadow: "0 8px 20px rgba(19,181,172,0.2)",
                    }}
                  >
                    Generate ✨
                  </button>
                </div>
              )}
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.05)",
                paddingTop: 24,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 22,
                  marginBottom: 18,
                  color: "#dff7f5",
                }}
              >
                Paste Video URL
              </div>
              <input
                type="text"
                placeholder="Paste your link here (MP4, WebM, OGG)"
                value={pasteValue}
                onChange={(e) => {
                  setPasteValue(e.target.value);
                  setSelectedFile(null);
                  setSelectedFileName(null);
                }}
                style={{
                  width: "100%",
                  maxWidth: 800,
                  height: 52,
                  borderRadius: 8,
                  background: "linear-gradient(180deg,#122826,#0d2424)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: "0 16px",
                  color: "#e6efef",
                  fontSize: 16,
                  outline: "none",
                  boxSizing: "border-box",
                  margin: "0 auto",
                  display: "block",
                }}
              />
              <div
                style={{
                  marginTop: 12,
                  color: "#9fb0b0",
                  fontSize: 13,
                  maxWidth: 800,
                  margin: "12px auto 0",
                }}
              >
                Tip: Paste a direct link to an accessible video file.
              </div>
              {pasteValue && (
                <div
                  style={{
                    marginTop: 18,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => {
                      setShowUploadOverlay(false);
                      handleGenerate(null, pasteValue);
                    }}
                    style={{
                      padding: "12px 32px",
                      borderRadius: 8,
                      background: "linear-gradient(90deg,#19b5ac,#13b7b0)",
                      border: "none",
                      color: "#022",
                      fontWeight: 800,
                      fontSize: 16,
                      cursor: "pointer",
                      boxShadow: "0 8px 20px rgba(19,181,172,0.2)",
                    }}
                  >
                    Generate ✨
                  </button>
                </div>
              )}
            </div>

            <div
              onClick={() => setShowUploadOverlay(false)}
              style={{
                position: "absolute",
                right: 15,
                top: 12,
                fontSize: 28,
                color: "#cbd6d6",
                cursor: "pointer",
                lineHeight: "20px",
              }}
            >
              ×
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ---------------- Editor UI ---------------- */
  const EditorView = (
    <div
      className="min-h-screen bg-black flex text-white font-inter"
      style={{ minHeight: "100vh" }}
    >
      {/* Sidebar */}
      <aside
        className="bg-gray-900 flex flex-col items-center py-4 space-y-2 relative shadow-2xl transition-all duration-300 w-20"
        style={{ marginLeft: 45 }}
      >
        <div className="p-2 rounded-xl bg-cyan-700 shadow-xl cursor-pointer mb-2 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>

        <div className="w-full px-2 space-y-1 flex flex-col items-center">
          <div
            onClick={() =>
              setActivePanel((s) => (s === "tools" ? null : "tools"))
            }
          >
            <NavItem
              icon={Wrench}
              label="Tools"
              panelKey="tools"
              activePanel={activePanel}
              setActivePanel={setActivePanel}
            />
          </div>
          <div
            onClick={() =>
              setActivePanel((s) => (s === "projects" ? null : "projects"))
            }
          >
            <NavItem
              icon={Folder}
              label="Projects"
              panelKey="projects"
              activePanel={activePanel}
              setActivePanel={setActivePanel}
            />
          </div>
          <div
            onClick={() =>
              setActivePanel((s) => (s === "autoMode" ? null : "autoMode"))
            }
          >
            <NavItem
              icon={RotateCcw}
              label="Auto Mode"
              panelKey="autoMode"
              activePanel={activePanel}
              setActivePanel={setActivePanel}
            />
          </div>
        </div>

        <div className="w-full px-2 space-y-1 pt-4 flex items-center justify-center">
          <div
            onClick={() =>
              setActivePanel((s) => (s === "premium" ? null : "premium"))
            }
          >
            <NavItem
              icon={Sparkles}
              label="Help"
              panelKey="premium"
              activePanel={activePanel}
              setActivePanel={setActivePanel}
            />
          </div>
        </div>

        <div className="flex-grow" />
        <div className="absolute bottom-4 w-full px-2">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold text-sm mb-1">
              N
            </div>
            <div className="text-xs text-gray-400">Account</div>
          </div>
        </div>
      </aside>

      {/* left flyout */}
      {activePanel === "tools" && (
        <ToolboxManager
          onSelectTool={(k) => {
            setSelectedToolKey(k);
          }}
          setActivePanel={setActivePanel}
        />
      )}
      {activePanel === "projects" && (
        <ProjectsPanel
          setActivePanel={setActivePanel}
          onLoadProject={(payload) => {
            loadProject(payload);
          }}
          onSaveProject={(p) => {
            const proj = saveProject(p);
            setShowProjectSavedToast(true);
            setTimeout(() => setShowProjectSavedToast(false), 1500);
            return proj.payload;
          }}
        />
      )}
      {activePanel === "autoMode" && (
        <AutoModePanel
          setActivePanel={setActivePanel}
          onGenerateSubtitles={handleGenerateSubtitles}
          isGenerating={isGenerating}
          generationProgress={generationProgress}
        />
      )}
      {activePanel === "premium" && (
        <PremiumPanel setActivePanel={setActivePanel} />
      )}

      {/* Main content */}
      <main
        className="flex-1 flex flex-col items-center justify-start relative transition-all duration-300 p-8"
        onClick={() => {
          if (activePanel) setActivePanel(null);
        }}
      >
        <button
          className="absolute top-4 right-4 px-4 py-2 bg-cyan-700 text-white font-bold rounded-lg hover:bg-cyan-600 transition shadow-xl disabled:bg-gray-600 disabled:cursor-not-allowed"
          onClick={(e) => {
            e.stopPropagation();
            setShowExportModal(true);
          }}
          disabled={subtitles.length === 0}
        >
          EXPORT ({subtitles.length})
        </button>

        {generationError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 right-4 bg-red-600/90 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 max-w-xs whitespace-pre-wrap"
          >
            <span>
              <svg className="w-4 h-4" />
            </span>
            <span>{generationError}</span>
          </motion.div>
        )}

        {/* Centered player */}
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div style={{ width: "100%", maxWidth: 1100 }}>
            <PlayerContainer
              videoRef={videoRef}
              videoData={videoData}
              videoMetadata={videoMetadata}
              isMaximized={isMaximized}
              setIsMaximized={setIsMaximized}
              currentSubtitle={currentSubtitle}
              subtitles={subtitles}
              subtitleStyle={subtitleStyle}
              onSeekTo={seekTo}
              view={view}
            />
          </div>
        </div>

        {/* Timeline with cue markers */}
        <TimelineBar
          videoRef={videoRef}
          videoMetadata={videoMetadata}
          subtitles={subtitles}
          onSeek={seekTo}
          onPlayFrom={playFrom}
        />

        {/* Subtitle editor list (inline edit, delete, add at playhead) */}
        <div style={{ width: "100%", maxWidth: 1100, marginTop: 16 }}>
          <div
            style={{
              background: "#0b1111",
              padding: 12,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center justify-between">
              <strong style={{ fontSize: 14 }}>
                Subtitles ({subtitles.length})
              </strong>
              <div className="flex items-center gap-2">
                <button
                  onClick={addCueAtCurrent}
                  className="px-3 py-1 bg-cyan-600 rounded text-white text-sm"
                >
                  + Add cue at playhead
                </button>
                <div
                  style={{
                    padding: "6px 10px",
                    background: "#071018",
                    borderRadius: 8,
                  }}
                >
                  <small className="text-gray-400">Style preview</small>
                  <div
                    style={{
                      marginTop: 6,
                      display: "inline-block",
                      fontFamily: subtitleStyle.fontFamily,
                      fontSize: subtitleStyle.fontSize,
                      fontWeight: subtitleStyle.fontWeight,
                      color: subtitleStyle.color,
                      padding: subtitleStyle.backgroundEnabled
                        ? "6px 10px"
                        : "0",
                      background: subtitleStyle.backgroundEnabled
                        ? subtitleStyle.backgroundColor
                        : "transparent",
                      opacity: subtitleStyle.backgroundOpacity,
                    }}
                  >
                    Sample text
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 8, maxHeight: 280, overflowY: "auto" }}>
              {subtitles.length === 0 ? (
                <div style={{ color: "#9ca3af", padding: 8 }}>
                  No subtitles yet
                </div>
              ) : (
                subtitles.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      padding: 8,
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ minWidth: 120 }}>
                      <div style={{ color: "#9fb0b0", fontSize: 12 }}>
                        {formatTime(s.start)} → {formatTime(s.end)}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => seekTo(s.start)}
                          className="px-2 py-1 text-xs bg-gray-800 rounded"
                        >
                          Seek
                        </button>
                        <button
                          onClick={() => playFrom(s.start)}
                          className="px-2 py-1 text-xs bg-gray-800 rounded"
                        >
                          Play
                        </button>
                        <button
                          onClick={() => deleteCue(i)}
                          className="px-2 py-1 text-xs bg-red-700 rounded text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <textarea
                        value={s.text}
                        onChange={(e) => editCueText(i, e.target.value)}
                        rows={2}
                        className="w-full p-2 bg-gray-900 rounded text-white"
                        style={{
                          fontSize: subtitleStyle.fontSize,
                          fontFamily: subtitleStyle.fontFamily,
                          fontWeight: subtitleStyle.fontWeight,
                          color: subtitleStyle.color,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Right tool panel */}
      <RightToolPanel
        toolKey={selectedToolKey}
        onClose={() => setSelectedToolKey(null)}
        onGenerateSubtitles={handleGenerateSubtitles}
        isGenerating={isGenerating}
        generationProgress={generationProgress}
        onApplyStyle={applyStyle}
        onApplyColor={applyColor}
        subtitleStyle={subtitleStyle}
        onUpdateSubtitleStyle={updateSubtitleStyle}
      />

      {/* Export */}
      <ExportModal
  isOpen={showExportModal}
  onClose={() => setShowExportModal(false)}
  subtitles={subtitles}
  videoData={videoData}
  subtitleStyle={subtitleStyle}
  videoMetadata={videoMetadata}
/>

    </div>
  );

  return view === "landing" ? LandingView : EditorView;
}

/* ----------------- NavItem small component ----------------- */
function NavItem({ icon: Icon, label, panelKey, activePanel, setActivePanel }) {
  const isActive = activePanel === panelKey;
  return (
    <div
      className={`flex flex-col items-center justify-center py-3 text-xs font-semibold transition-colors duration-200 rounded-lg group w-full ${
        isActive
          ? "bg-gray-700 text-white shadow-lg"
          : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}
      style={{ cursor: "pointer", alignItems: "center" }}
    >
      <div
        className={`p-2 rounded-full mb-1 transition-all ${
          panelKey === "premium"
            ? "text-cyan-400"
            : "text-gray-500 group-hover:text-white"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <span className={`${isActive ? "text-white" : "text-gray-400"}`}>
        {label}
      </span>
    </div>
  );
}
