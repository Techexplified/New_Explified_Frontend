// SidebarWithPlayer.jsx (UPDATED)
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Sparkles, Wrench, Folder, X, Undo2, Redo2, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ============== Helpers ============== */

// Minimal Undo/Redo manager
class UndoRedoManager {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
  }
  push(state) {
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(state);
    this.currentIndex++;
  }
  undo() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    }
    return null;
  }
  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }
    return null;
  }
  canUndo() {
    return this.currentIndex > 0;
  }
  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }
}

/* ============== Color Wheel Picker (native) ============== */
const ColorWheelPicker = React.memo(({ color = "#808080", onChange }) => {
  const [localColor, setLocalColor] = useState(() =>
    (color || "#808080").toUpperCase()
  );

  useEffect(() => {
    if (color && color.toUpperCase() !== localColor)
      setLocalColor(color.toUpperCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  const handleNativeChange = useCallback(
    (e) => {
      const v = e.target.value.toUpperCase();
      setLocalColor(v);
      onChange?.(v);
    },
    [onChange]
  );

  const handleHexInput = useCallback(
    (e) => {
      const v = e.target.value.toUpperCase();
      setLocalColor(v);
      if (v.match(/^#[0-9A-F]{6}$/)) onChange?.(v);
    },
    [onChange]
  );

  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center gap-3">
        <input
          aria-label="Choose color"
          type="color"
          value={localColor}
          onChange={handleNativeChange}
          className="w-12 h-12 p-0 border-0 rounded"
        />
        <input
          aria-label="Hex color"
          type="text"
          value={localColor}
          onChange={handleHexInput}
          placeholder="#808080"
          className="flex-1 p-2 rounded bg-gray-700 text-white text-sm font-mono"
        />
      </div>
      <div className="flex gap-2 items-center">
        <div className="text-xs text-gray-400">
          Tip: click the swatch to open the system color wheel/picker.
        </div>
      </div>
    </div>
  );
});
ColorWheelPicker.displayName = "ColorWheelPicker";

/* ============== UI Helpers ============== */
function NavItem({ icon: Icon, label, panelKey, activePanel, setActivePanel }) {
  const isActive = activePanel === panelKey;
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setActivePanel((s) => (s === panelKey ? null : panelKey))}
      className={`w-full flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-b from-gray-700 to-gray-800 text-white shadow-lg ring-2 ring-gray-600"
          : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}
      style={{ cursor: "pointer" }}
    >
      <div className={`p-2 rounded-lg mb-1 transition-all`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-xs font-semibold whitespace-nowrap text-center">
        {label}
      </span>
    </motion.button>
  );
}

const ToolHeader = ({
  title,
  onClose,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  closeBtnClass = "text-gray-400 hover:text-white",
}) => (
  <div className="flex items-center justify-between border-b border-gray-700/50 pb-3 mb-4 relative">
    <div className="flex gap-1">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded transition"
        title="Undo"
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded transition"
        title="Redo"
      >
        <Redo2 className="w-4 h-4" />
      </button>
    </div>

    <h3 className="absolute left-1/2 transform -translate-x-1/2 text-sm font-bold uppercase tracking-wider text-white">
      {title}
    </h3>

    <button
      onClick={onClose}
      className={`${closeBtnClass} p-1 rounded transition flex-shrink-0`}
      aria-label="Close"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);

/* ============== Panels (fixed positioning to avoid layout shift) ============== */
const LeftPanelContainer = ({ children, onClose }) => (
  <motion.div
    className="fixed z-50 bg-gray-800 p-4 shadow-2xl overflow-y-auto rounded-r-lg"
    style={{
      left: "7.8rem",
      top: "6rem",
      maxHeight: "calc(100vh - 10rem)",
      height: "fit-content",
      minWidth: "250px",
      boxSizing: "border-box",
      maxWidth: "calc(100vw - 9rem)",
    }}
    onClick={(e) => e.stopPropagation()}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.2 }}
  >
    {children}
    <button
      onClick={onClose}
      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white rounded transition"
      aria-label="Close"
    >
      <X className="w-5 h-5" />
    </button>
  </motion.div>
);

const RightPanelContainer = ({ children, onClose }) => (
  <motion.div
    className="fixed z-40 rounded-l-lg"
    style={{
      right: "1rem",
      top: "6rem",
      width: "22rem",
      boxSizing: "border-box",
      maxWidth: "calc(100vw - 9rem)",
    }}
    onClick={(e) => e.stopPropagation()}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.2 }}
  >
    <div className="bg-[#071018] border border-gray-800/60 p-4 shadow-lg rounded-l-lg">
      <div style={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}>
        {children}
      </div>
    </div>
  </motion.div>
);

/* ============== Tools ============== */

/* FontStyleTool */
const FontStyleTool = ({
  onApplyStyle,
  currentStyle,
  onClose,
  undoRedoManager,
}) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const options = [
    {
      label: "Sans (Default)",
      fontFamily: "Inter, system-ui, sans-serif",
      fontWeight: 400,
      fontSize: 16,
    },
    {
      label: "Serif",
      fontFamily: "Georgia, serif",
      fontWeight: 700,
      fontSize: 18,
    },
    {
      label: "Mono",
      fontFamily: "ui-monospace, Menlo, monospace",
      fontWeight: 600,
      fontSize: 16,
    },
    {
      label: "Big",
      fontFamily: "Inter, sans-serif",
      fontWeight: 700,
      fontSize: 28,
    },
    {
      label: "Small",
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      fontSize: 12,
    },
    {
      label: "Bold",
      fontFamily: "Inter, sans-serif",
      fontWeight: 800,
      fontSize: 18,
    },
    {
      label: "Light",
      fontFamily: "Inter, sans-serif",
      fontWeight: 300,
      fontSize: 16,
    },
    {
      label: "Comic Sans",
      fontFamily: "'Comic Sans MS', cursive",
      fontWeight: 600,
      fontSize: 18,
    },
    {
      label: "Courier",
      fontFamily: "Courier New, monospace",
      fontWeight: 500,
      fontSize: 14,
    },
    {
      label: "Times",
      fontFamily: "Times New Roman, serif",
      fontWeight: 600,
      fontSize: 18,
    },
  ];

  const handleApply = useCallback(
    (opt) => {
      const newStyle = {
        fontFamily: opt.fontFamily,
        fontWeight: opt.fontWeight,
        fontSize: opt.fontSize,
      };
      onApplyStyle?.(newStyle);
      undoRedoManager.current?.push({ type: "style", data: newStyle });
      setCanUndo(undoRedoManager.current?.canUndo() || false);
      setCanRedo(undoRedoManager.current?.canRedo() || false);
    },
    [onApplyStyle, undoRedoManager]
  );

  const handleUndo = useCallback(() => {
    const prev = undoRedoManager.current?.undo();
    if (prev) {
      onApplyStyle?.(prev.data);
      setCanUndo(undoRedoManager.current?.canUndo() || false);
      setCanRedo(undoRedoManager.current?.canRedo() || false);
    }
  }, [onApplyStyle, undoRedoManager]);

  const handleRedo = useCallback(() => {
    const next = undoRedoManager.current?.redo();
    if (next) {
      onApplyStyle?.(next.data);
      setCanUndo(undoRedoManager.current?.canUndo() || false);
      setCanRedo(undoRedoManager.current?.canRedo() || false);
    }
  }, [onApplyStyle, undoRedoManager]);

  return (
    <div className="space-y-4">
      <ToolHeader
        title="Font Styles"
        onClose={onClose}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        closeBtnClass="text-red-400 hover:text-red-300"
      />
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleApply(opt)}
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
    </div>
  );
};
FontStyleTool.displayName = "FontStyleTool";

/* FontColorTool (INLINE picker, redesigned to match mock) */
const FontColorTool = React.memo(
  ({ onApplyColor, currentStyle, onClose, undoRedoManager }) => {
    const [color, setColor] = useState(currentStyle?.color || "#28D7B4");
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [showPicker, setShowPicker] = useState(true); // inline by default

    const presets = [
      "#00C7A7",
      "#000000",
      "#FFFFFF",
      "#FF3B30",
      "#FF9500",
      "#FFCC00",
      "#34C759",
      "#0A84FF",
      "#007AFF",
      "#5856D6",
      "#AF52DE",
      "#8E8E93",
    ];

    useEffect(() => {
      if (currentStyle?.color && currentStyle.color !== color)
        setColor(currentStyle.color);
    }, [currentStyle?.color]);

    const handleColorChange = useCallback(
      (newColor) => {
        setColor(newColor);
        onApplyColor?.(newColor);
      },
      [onApplyColor]
    );

    const applyToHistory = useCallback(
      (c) => {
        undoRedoManager.current?.push({ type: "color", data: c });
        setCanUndo(undoRedoManager.current?.canUndo() || false);
        setCanRedo(undoRedoManager.current?.canRedo() || false);
      },
      [undoRedoManager]
    );

    const handleApply = useCallback(() => {
      applyToHistory(color);
      // Keep UX consistent: also call onApplyColor to ensure parent is up-to-date
      onApplyColor?.(color);
      // subtle toast replacement
      try {
        window?.$?.toast?.success?.("Color applied");
      } catch (e) {}
    }, [applyToHistory, color, onApplyColor]);

    return (
      <div className="space-y-4">
        <ToolHeader
          title="FONT COLOR"
          onClose={onClose}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={() => {
            const prev = undoRedoManager.current?.undo();
            if (prev) {
              setColor(prev.data);
              onApplyColor?.(prev.data);
              setCanUndo(undoRedoManager.current?.canUndo() || false);
              setCanRedo(undoRedoManager.current?.canRedo() || false);
            }
          }}
          onRedo={() => {
            const next = undoRedoManager.current?.redo();
            if (next) {
              setColor(next.data);
              onApplyColor?.(next.data);
              setCanUndo(undoRedoManager.current?.canUndo() || false);
              setCanRedo(undoRedoManager.current?.canRedo() || false);
            }
          }}
          closeBtnClass="text-red-400 hover:text-red-300"
        />

        <div className="flex items-start gap-4">
          {/* Big preview swatch on the left */}
          {/* <div className="flex-shrink-0">
            <div
              className="w-20 h-20 rounded-lg shadow-inner border-4"
              style={{ backgroundColor: color, borderColor: "#E6EEF0" }}
              aria-hidden
            />
          </div> */}

          {/* Middle column: presets + wheel preview */}
          <div className="flex-1">
            <div className="text-xs text-gray-400 mb-3">
              Click a swatch to apply instantly
            </div>

            <div className="grid grid-cols-6 gap-2 mb-3">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    handleColorChange(p);
                    applyToHistory(p);
                  }}
                  className={`w-8 h-8 rounded-md border-2 ${
                    p.toUpperCase() === color.toUpperCase()
                      ? "ring-2 ring-offset-1 ring-white"
                      : ""
                  }`}
                  style={{ backgroundColor: p, borderColor: p }}
                  title={p}
                  aria-label={`Apply color ${p}`}
                />
              ))}
            </div>

            <div className="mb-3 grid grid-cols-2 gap-3 items-center">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-md border-2"
                  style={{ backgroundColor: color, borderColor: color }}
                  aria-hidden
                />
                <div className="flex-1 p-2 bg-[#1f2933] rounded-md border border-gray-700">
                  <div className="text-xs text-gray-300 font-mono">
                    {color.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    const v = e.target.value.toUpperCase();
                    setColor(v);
                    if (v.match(/^#[0-9A-F]{6}$/)) onApplyColor?.(v);
                  }}
                  placeholder="#28D7B4"
                  className="w-full p-2 rounded bg-[#2b3942] text-white text-sm font-mono border border-gray-700"
                />
                <button
                  onClick={handleApply}
                  className="px-3 py-2 bg-[#06b6d4] hover:bg-[#05a5bf] text-white rounded"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-400 mb-2">
              Tip: click the swatch to open the system color wheel/picker.
            </div>

            {/* Inline native color wheel collapsed behind a small toggle to avoid extra panels */}
            {showPicker && (
              <div className="mb-2">
                <ColorWheelPicker color={color} onChange={handleColorChange} />
              </div>
            )}
          </div>
        </div>

        <div>
          <button
            onClick={() => {
              undoRedoManager.current?.push({ type: "color", data: color });
              setCanUndo(undoRedoManager.current?.canUndo() || false);
              setCanRedo(undoRedoManager.current?.canRedo() || false);
              alert("Saved to history");
            }}
            className="w-full px-4 py-3 bg-[#111827] hover:bg-[#0f1720] text-white rounded-lg font-semibold"
          >
            Save to history
          </button>
        </div>

        {/* subtle fake scrollbar preview area to match mock */}
        {/* <div className="mt-3 bg-[#0b0f12] h-3 rounded overflow-hidden">
          <div
            style={{ width: "40%" }}
            className="h-full bg-gray-600 rounded"
          />
        </div> */}
      </div>
    );
  }
);
FontColorTool.displayName = "FontColorTool";

/* SubtitleSettingsTool (INLINE picker) */
const SubtitleSettingsTool = React.memo(
  ({ subtitleStyle = {}, onUpdateStyle, onClose, undoRedoManager }) => {
    const normalizeInitialColor = (c) => {
      if (!c) return "#000000";
      if (c.toUpperCase() === "#FFFFFF") return "#F0F0F0";
      return c;
    };

    const [bgEnabled, setBgEnabled] = useState(
      !!subtitleStyle.backgroundEnabled
    );
    const [bgColor, setBgColor] = useState(
      normalizeInitialColor(subtitleStyle.backgroundColor || "#000000")
    );
    const [bgOpacity, setBgOpacity] = useState(
      subtitleStyle.backgroundOpacity ?? 0.85
    );
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [showPicker, setShowPicker] = useState(true);

    useEffect(() => {
      setBgEnabled(!!subtitleStyle.backgroundEnabled);
      if (subtitleStyle.backgroundColor)
        setBgColor(normalizeInitialColor(subtitleStyle.backgroundColor));
      if (typeof subtitleStyle.backgroundOpacity === "number")
        setBgOpacity(subtitleStyle.backgroundOpacity);
    }, [subtitleStyle]);

    const handleToggleBg = useCallback(
      (v) => {
        setBgEnabled(v);
        onUpdateStyle?.({ backgroundEnabled: v });
        undoRedoManager.current?.push({
          type: "bg",
          data: {
            backgroundEnabled: v,
            backgroundColor: bgColor,
            backgroundOpacity: bgOpacity,
          },
        });
        setCanUndo(undoRedoManager.current?.canUndo() || false);
        setCanRedo(undoRedoManager.current?.canRedo() || false);
      },
      [bgColor, bgOpacity, onUpdateStyle, undoRedoManager]
    );

    const handleColorChange = useCallback(
      (newColor) => {
        setBgColor(newColor);
        onUpdateStyle?.({ backgroundColor: newColor });
      },
      [onUpdateStyle]
    );

    const handleOpacityChange = useCallback(
      (v) => {
        setBgOpacity(v);
        onUpdateStyle?.({ backgroundOpacity: v });
      },
      [onUpdateStyle]
    );

    const handleApply = useCallback(() => {
      undoRedoManager.current?.push({
        type: "bg",
        data: {
          backgroundEnabled: bgEnabled,
          backgroundColor: bgColor,
          backgroundOpacity: bgOpacity,
        },
      });
      setCanUndo(undoRedoManager.current?.canUndo() || false);
      setCanRedo(undoRedoManager.current?.canRedo() || false);
      alert("Background applied");
    }, [bgEnabled, bgColor, bgOpacity, undoRedoManager]);

    return (
      <div className="space-y-4">
        <ToolHeader
          title="Subtitle BG"
          onClose={onClose}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={() => {
            const prev = undoRedoManager.current?.undo();
            if (prev) {
              setBgEnabled(prev.data.backgroundEnabled);
              setBgColor(prev.data.backgroundColor);
              setBgOpacity(prev.data.backgroundOpacity);
              onUpdateStyle?.(prev.data);
              setCanUndo(undoRedoManager.current?.canUndo() || false);
              setCanRedo(undoRedoManager.current?.canRedo() || false);
            }
          }}
          onRedo={() => {
            const next = undoRedoManager.current?.redo();
            if (next) {
              setBgEnabled(next.data.backgroundEnabled);
              setBgColor(next.data.backgroundColor);
              setBgOpacity(next.data.backgroundOpacity);
              onUpdateStyle?.(next.data);
              setCanUndo(undoRedoManager.current?.canUndo() || false);
              setCanRedo(undoRedoManager.current?.canRedo() || false);
            }
          }}
          closeBtnClass="text-red-400 hover:text-red-300"
        />

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-300">Background</div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={bgEnabled}
              onChange={(e) => handleToggleBg(e.target.checked)}
            />
            <span className="ml-2 text-xs text-gray-300">
              {bgEnabled ? "On" : "Off"}
            </span>
          </label>
        </div>

        {bgEnabled && (
          <>
            <div>
              <label className="text-sm text-gray-300">Background color</label>
              <div className="mt-2 relative flex items-center gap-3">
                {/* <button
                  onClick={() => setShowPicker((s) => !s)}
                  className="w-12 h-12 rounded-lg shadow-md border-2"
                  style={{ backgroundColor: bgColor, borderColor: bgColor }}
                  aria-label="Toggle background color picker"
                /> */}

                {showPicker && (
                  <div className="flex-1">
                    <ColorWheelPicker
                      color={bgColor}
                      onChange={handleColorChange}
                    />
                  </div>
                )}
              </div>
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
                onChange={(e) => handleOpacityChange(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>
          </>
        )}

        <div className="mt-2 text-xs text-gray-400">
          Turn off background to have floating text (no box).
        </div>
        <button
          onClick={handleApply}
          className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition"
        >
          Apply Background
        </button>
      </div>
    );
  }
);
SubtitleSettingsTool.displayName = "SubtitleSettingsTool";

/* Translate, Effects (improved) */
const TranslateTool = React.memo(
  ({ onClose, undoRedoManager, onTranslate }) => {
    const [selectedLang, setSelectedLang] = useState("en");
    const [isTranslating, setIsTranslating] = useState(false);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const languages = {
      en: "English",
      es: "Spanish",
      hi: "Hindi",
      fr: "French",
      de: "German",
      pt: "Portuguese",
      ja: "Japanese",
      zh: "Chinese",
      ru: "Russian",
      ar: "Arabic",
      it: "Italian",
      ko: "Korean",
    };

    const handleTranslate = useCallback(async () => {
      setIsTranslating(true);
      try {
        if (typeof onTranslate === "function") {
          await onTranslate(selectedLang);
        } else {
          // If no onTranslate provided, we simulate and emit an event with chosen language so parent can handle it
          window.dispatchEvent(
            new CustomEvent("translate-subtitles", {
              detail: { language: selectedLang },
            })
          );
          undoRedoManager.current?.push({
            type: "translate",
            data: { language: selectedLang, timestamp: Date.now() },
          });
          alert(
            `(Simulated) Requested translation to ${languages[selectedLang]}`
          );
        }
        setCanUndo(undoRedoManager.current?.canUndo() || false);
        setCanRedo(undoRedoManager.current?.canRedo() || false);
      } catch (err) {
        console.error(err);
        alert("Translation failed.");
      } finally {
        setIsTranslating(false);
      }
    }, [selectedLang, onTranslate, languages, undoRedoManager]);

    const handleUndo = useCallback(() => {
      const prev = undoRedoManager.current?.undo();
      if (prev) {
        setSelectedLang(prev.data.language);
        setCanUndo(undoRedoManager.current?.canUndo() || false);
        setCanRedo(undoRedoManager.current?.canRedo() || false);
      }
    }, [undoRedoManager]);

    const handleRedo = useCallback(() => {
      const next = undoRedoManager.current?.redo();
      if (next) {
        setSelectedLang(next.data.language);
        setCanUndo(undoRedoManager.current?.canUndo() || false);
        setCanRedo(undoRedoManager.current?.canRedo() || false);
      }
    }, [undoRedoManager]);

    return (
      <div className="space-y-4">
        <ToolHeader
          title="Translate"
          onClose={onClose}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={handleUndo}
          onRedo={handleRedo}
          closeBtnClass="text-red-400 hover:text-red-300"
        />
        <p className="text-gray-300 font-semibold mb-3">Choose a language:</p>
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="w-full bg-gray-700 p-3 rounded-lg text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500 cursor-pointer"
        >
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleTranslate}
          disabled={isTranslating}
          className="flex items-center justify-center w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition cursor-pointer"
        >
          {isTranslating ? "Translating..." : "Translate Subtitles"}{" "}
          <Sparkles className="w-4 h-4 ml-2" />
        </button>
      </div>
    );
  }
);
TranslateTool.displayName = "TranslateTool";

const EffectsTool = React.memo(
  ({ onClose, undoRedoManager, onApplyEffect }) => {
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [activeEffect, setActiveEffect] = useState(null);
    const effects = useMemo(
      () => [
        "Fade",
        "Slide",
        "Bounce",
        "Pop",
        "None",
        "Strong",
        "Soft",
        "Type",
      ],
      []
    );

    const handlePickEffect = useCallback(
      (effect) => {
        setActiveEffect(effect);
        // apply through prop if parent provided
        onApplyEffect?.(effect);
        // emit a global event so any subtitle renderer can apply it immediately
        window.dispatchEvent(
          new CustomEvent("subtitle-effect", { detail: { effect } })
        );

        undoRedoManager.current?.push({ type: "effect", data: effect });
        setCanUndo(undoRedoManager.current?.canUndo() || false);
        setCanRedo(undoRedoManager.current?.canRedo() || false);
      },
      [onApplyEffect, undoRedoManager]
    );

    const handleUndo = useCallback(() => {
      const prev = undoRedoManager.current?.undo();
      if (prev) {
        setActiveEffect(prev.data);
        onApplyEffect?.(prev.data);
        window.dispatchEvent(
          new CustomEvent("subtitle-effect", { detail: { effect: prev.data } })
        );
        setCanUndo(undoRedoManager.current?.canUndo() || false);
        setCanRedo(undoRedoManager.current?.canRedo() || false);
      }
    }, [onApplyEffect, undoRedoManager]);

    const handleRedo = useCallback(() => {
      const next = undoRedoManager.current?.redo();
      if (next) {
        setActiveEffect(next.data);
        onApplyEffect?.(next.data);
        window.dispatchEvent(
          new CustomEvent("subtitle-effect", { detail: { effect: next.data } })
        );
        setCanUndo(undoRedoManager.current?.canUndo() || false);
        setCanRedo(undoRedoManager.current?.canRedo() || false);
      }
    }, [onApplyEffect, undoRedoManager]);

    return (
      <div className="space-y-4">
        <ToolHeader
          title="Effects"
          onClose={onClose}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={handleUndo}
          onRedo={handleRedo}
          closeBtnClass="text-red-400 hover:text-red-300"
        />
        <p className="text-gray-300 font-semibold mb-3">Effects & Animations</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {effects.map((item, i) => (
            <button
              key={i}
              onClick={() => handlePickEffect(item)}
              className={`min-h-[56px] p-3 rounded-lg text-center cursor-pointer transition shadow-lg border ${
                activeEffect === item
                  ? "border-cyan-500 bg-[#071320] text-white"
                  : "bg-gray-900 text-cyan-200 hover:border-cyan-500"
              }`}
              title={item}
            >
              <div className="text-sm font-semibold">{item}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }
);
EffectsTool.displayName = "EffectsTool";

/* ============== Projects & Premium Panels ============== */
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

  const handleSave = useCallback(() => {
    if (!name.trim()) {
      alert("Please provide a project name");
      return;
    }
    const payload = onSaveProject ? onSaveProject(name.trim()) : null;
    if (!payload) {
      alert("Save failed: no payload");
      return;
    }
    const p = {
      id: "p_" + Date.now(),
      name: name.trim(),
      createdAt: Date.now(),
      payload,
    };
    const next = [p, ...projects];
    setProjects(next);
    store.save(next);
    setName("");
    alert("Project saved!");
  }, [name, projects, onSaveProject, store]);

  const handleLoad = useCallback(
    (p) => {
      if (onLoadProject) onLoadProject(p.payload);
      setActivePanel(null);
    },
    [onLoadProject, setActivePanel]
  );

  const handleDelete = useCallback(
    (id) => {
      if (!confirm("Delete project?")) return;
      const next = projects.filter((x) => x.id !== id);
      setProjects(next);
      store.save(next);
    },
    [projects, store]
  );

  return (
    <LeftPanelContainer onClose={() => setActivePanel(null)}>
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
          className="mt-2 w-full px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded cursor-pointer"
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
                  className="text-xs px-2 py-1 bg-cyan-600 rounded text-white cursor-pointer"
                >
                  Load
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-xs px-2 py-1 bg-red-700 rounded text-white cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LeftPanelContainer>
  );
};

const PremiumPanel = ({ setActivePanel }) => (
  <LeftPanelContainer onClose={() => setActivePanel(null)}>
    <h2 className="text-xl font-bold mb-8 text-white text-center">
      Upgrade Your Plan
    </h2>

    <div className="grid grid-cols-1 gap-4">
      {[
        {
          title: "PLAN 1",
          icon: "📋",
          color: "text-gray-300",
          features: ["Basic editing", "5 projects", "Standard export"],
        },
        {
          title: "PLAN 2",
          icon: "⭐",
          color: "text-yellow-400",
          features: [
            "Advanced editing",
            "50 projects",
            "4K export",
            "Priority support",
          ],
        },
        {
          title: "PLAN 3",
          icon: "💎",
          color: "text-red-400",
          features: [
            "Full access",
            "Unlimited projects",
            "8K export",
            "24/7 support",
            "API access",
          ],
        },
      ].map((plan, i) => (
        <div
          key={i}
          className="bg-gray-900 p-4 rounded-lg border-2 border-gray-700 hover:border-cyan-500 transition cursor-pointer"
        >
          <div className={`text-3xl mb-2 ${plan.color}`}>{plan.icon}</div>
          <h3 className="text-lg font-bold text-white mb-3">{plan.title}</h3>
          <ul className="text-xs text-gray-400 mb-4 space-y-1">
            {plan.features.map((f, j) => (
              <li key={j}>✓ {f}</li>
            ))}
          </ul>
          <button className="w-full px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold rounded transition cursor-pointer">
            GET PLAN
          </button>
        </div>
      ))}
    </div>
  </LeftPanelContainer>
);

/* ============== Main Sidebar Component ============== */

export default function Sidebar({
  activePanel,
  setActivePanel,
  selectedToolKey,
  setSelectedToolKey,
  onApplyStyle,
  onApplyColor,
  onUpdateStyle,
  subtitleStyle = {},
  onGenerateSubtitles,
  isGenerating = false,
  generationProgress = { stage: "", message: "Ready...", progress: 0 },
  onLoadProject,
  onSaveProject,
  onApplyEffect,
  onTranslate,
}) {
  const undoRedoManager = useRef(new UndoRedoManager());

  // Prevent horizontal scrollbar when panels open
  useEffect(() => {
    const shouldHide = !!activePanel || !!selectedToolKey;
    const prev = document.documentElement.style.overflowX || "";
    if (shouldHide) document.documentElement.style.overflowX = "hidden";
    else document.documentElement.style.overflowX = prev;
    return () => {
      document.documentElement.style.overflowX = prev;
    };
  }, [activePanel, selectedToolKey]);

  // Example state for demo: whether subtitle editor overlay is open
  const [isEditingSubtitles, setIsEditingSubtitles] = useState(false);

  return (
    <>
      {/* Sidebar Navigation */}
      <aside
        className="fixed left-0 top-0 ml-[48px] bottom-0 bg-gray-900 flex flex-col items-center py-4 space-y-2 shadow-2xl w-20"
        style={{ zIndex: 40 }}
      >
        <div className="p-2 rounded-xl bg-cyan-700 shadow-xl mb-2 flex items-center justify-center w-12 h-12 cursor-pointer hover:bg-cyan-600 transition">
          <Sparkles className="w-6 h-6 text-white" />
        </div>

        <div className="w-full px-2 space-y-1 flex flex-col items-center">
          <NavItem
            icon={Wrench}
            label="Tools"
            panelKey="tools"
            activePanel={activePanel}
            setActivePanel={setActivePanel}
          />
          <NavItem
            icon={Folder}
            label="Projects"
            panelKey="projects"
            activePanel={activePanel}
            setActivePanel={setActivePanel}
          />
        </div>

        <div className="w-10 h-px bg-gray-700 my-2" />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            setActivePanel((s) => (s === "premium" ? null : "premium"))
          }
          className={`w-full flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all duration-200 cursor-pointer ${
            activePanel === "premium"
              ? "bg-gradient-to-b from-yellow-600 to-yellow-700 text-white shadow-lg ring-2 ring-yellow-500"
              : "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20"
          }`}
        >
          <div className="p-2 rounded-lg mb-1">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold whitespace-nowrap">
            Premium
          </span>
        </motion.button>

        <div className="flex-grow" />

        <div className="w-full px-2 pt-4 border-t border-gray-700">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-lg cursor-pointer">
              N
            </div>
            <div className="text-xs text-gray-400 text-center">Account</div>
          </div>
        </div>
      </aside>

      {/* Panels */}
      <AnimatePresence>
        {activePanel === "tools" && (
          <ToolboxManager
            setActivePanel={setActivePanel}
            setSelectedToolKey={setSelectedToolKey}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activePanel === "projects" && (
          <ProjectsPanel
            setActivePanel={setActivePanel}
            onLoadProject={onLoadProject}
            onSaveProject={onSaveProject}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activePanel === "premium" && (
          <PremiumPanel setActivePanel={setActivePanel} />
        )}
      </AnimatePresence>

      {/* Right Panel - Tools */}
      <AnimatePresence>
        {selectedToolKey && (
          <RightPanelContainer onClose={() => setSelectedToolKey(null)}>
            {selectedToolKey === "fontStyle" && (
              <FontStyleTool
                onApplyStyle={onApplyStyle}
                currentStyle={subtitleStyle}
                onClose={() => setSelectedToolKey(null)}
                undoRedoManager={undoRedoManager}
              />
            )}
            {selectedToolKey === "fontColor" && (
              <FontColorTool
                onApplyColor={onApplyColor}
                currentStyle={subtitleStyle}
                onClose={() => setSelectedToolKey(null)}
                undoRedoManager={undoRedoManager}
              />
            )}
            {selectedToolKey === "subtitleSettings" && (
              <SubtitleSettingsTool
                subtitleStyle={subtitleStyle}
                onUpdateStyle={onUpdateStyle}
                onClose={() => setSelectedToolKey(null)}
                undoRedoManager={undoRedoManager}
              />
            )}
            {selectedToolKey === "translate" && (
              <TranslateTool
                onClose={() => setSelectedToolKey(null)}
                undoRedoManager={undoRedoManager}
                onTranslate={onTranslate}
              />
            )}
            {selectedToolKey === "effects" && (
              <EffectsTool
                onClose={() => setSelectedToolKey(null)}
                undoRedoManager={undoRedoManager}
                onApplyEffect={onApplyEffect}
              />
            )}
          </RightPanelContainer>
        )}
      </AnimatePresence>
    </>
  );
}

/* ============== ToolboxManager (placed after) ============== */
const ToolboxManager = ({ setActivePanel, setSelectedToolKey }) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const menuRef = useRef(null);

  const subTools = useMemo(
    () => [
      { key: "fontStyle", label: "FONT STYLE" },
      { key: "fontColor", label: "FONT COLOR" },
      { key: "subtitleSettings", label: "SUBTITLE BG" },
      { key: "translate", label: "TRANSLATE" },
      { key: "effects", label: "EFFECTS" },
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
        if (tool) setSelectedToolKey(tool.key);
      } else if (e.key === "Escape") {
        setActivePanel(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusedIndex, subTools, setActivePanel, setSelectedToolKey]);

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
      className="fixed z-50 rounded-r-lg"
      style={{
        left: "7.8rem",
        top: "6rem",
        minWidth: 0,
        width: "18rem",
        boxSizing: "border-box",
        maxWidth: "calc(100vw - 9rem)",
      }}
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
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-label="Toolbox"
    >
      <div className="bg-[#0f1720] border border-gray-800/60 p-4 shadow-lg rounded-r-lg">
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
                    setSelectedToolKey(t.key);
                  }}
                  role="menuitem"
                  aria-pressed={isFocused}
                  className={`w-full max-w-[14rem] text-center py-2 rounded-md transition focus:outline-none cursor-pointer ${
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
              onClick={() => setActivePanel(null)}
              className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
