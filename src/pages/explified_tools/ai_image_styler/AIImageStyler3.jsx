// src/App.jsx - COMPLETE VERSION WITH ALL FIXES (cursor fix included)
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  UploadCloud,
  Tally5,
  Share2,
  Layers,
  Loader2,
  Image as ImgIcon,
  Sparkles,
  Plus,
  Palette,
  Copy as CopyIcon,
  Trash2,
  Camera,
  X as CloseIcon,
  Smile,
} from "lucide-react";
import { HexColorPicker } from "react-colorful";
import html2canvas from "html2canvas";

const ACCENT_COLOR = "#23b5b5";
const IMGUR_CLIENT_ID = null;

// ⚠️ REPLACE THESE WITH YOUR ACTUAL API KEYS
const REMOVEBG_API_KEY = "Dn2MEutKyEyE394zWpQt8fPg";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });

const createImageItem = (mimeType, base64Data, originalUrl, options = {}) => ({
  id: crypto?.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2),
  mimeType,
  base64Data,
  originalUrl,
  processedUrl: null,
  background: null,
  effects: [],
  adjustments: {
    brightness: 100,
    contrast: 100,
    saturation: 100,
  },
  annotations: [],
  position: options.position || { x: 0, y: 0 },
  size: options.size || { width: "auto", height: "auto" },
  rotation: options.rotation || 0,
  isPositioned: options.isPositioned || false,
  scale: options.scale || 1, // <-- new per-image scale (1 = 100%)
});

const ImagePanel = ({ handleInitialUpload, onGenerateImage, isGenerating }) => (
  <div className="p-6 space-y-4 overflow-y-auto text-gray-300 border-b border-gray-700">
    <h3 className="text-xl font-bold text-indigo-400 pb-2">Image Tools</h3>
    <p className="text-gray-400">Manage your main image on the canvas.</p>

    <label
      htmlFor="file-upload-panel"
      className="w-full inline-flex items-center justify-center px-4 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer text-white font-semibold transition-colors"
    >
      <UploadCloud className="w-5 h-5" />
      <span className="ml-2">Upload Image</span>
    </label>
    <input
      id="file-upload-panel"
      type="file"
      accept="image/*"
      onChange={handleInitialUpload}
      className="hidden"
    />

    <div className="pt-4 border-t border-gray-700">
      <h4 className="text-sm font-semibold text-white mb-2">
        AI Image Generation
      </h4>
      <p className="text-xs text-gray-400 mb-3">
        Generate images from text prompts
      </p>

      <button
        onClick={onGenerateImage}
        disabled={isGenerating}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          isGenerating
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin inline-block" />
            <span className="ml-2">Generating...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 inline-block" />
            <span className="ml-2">Generate with AI</span>
          </>
        )}
      </button>
    </div>
  </div>
);

const EmojiPanel = ({ onAddEmoji }) => {
  const [selectedCategory, setSelectedCategory] = useState("smileys");

  const emojiCategories = {
    smileys: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
      "😋",
    ],
    animals: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐸",
      "🐵",
      "🐔",
      "🐧",
      "🐦",
      "🐤",
      "🦆",
    ],
    food: [
      "🍎",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
      "🍆",
      "🥑",
      "🥦",
      "🥬",
      "🥒",
    ],
    nature: [
      "🌸",
      "🌺",
      "🌻",
      "🌷",
      "🌹",
      "🥀",
      "🌼",
      "🌵",
      "🌲",
      "🌳",
      "🌴",
      "🌱",
      "🌿",
      "☘️",
      "🍀",
      "🍁",
      "🍂",
      "🍃",
      "🌾",
      "💐",
    ],
    objects: [
      "⚽",
      "🏀",
      "🏈",
      "⚾",
      "🎾",
      "🏐",
      "🏉",
      "🎱",
      "🏓",
      "🏸",
      "🎯",
      "🎮",
      "🎰",
      "🎲",
      "♠️",
      "♥️",
      "♦️",
      "♣️",
      "🃏",
      "🎴",
    ],
    symbols: [
      "❤️",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "💔",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "⭐",
      "🌟",
      "✨",
      "💫",
      "🔥",
      "💥",
    ],
  };

  const categories = Object.keys(emojiCategories);
  const filteredEmojis = selectedCategory
    ? emojiCategories[selectedCategory]
    : [];

  return (
    <div className="p-6 space-y-4 overflow-y-auto text-gray-300 border-b border-gray-700">
      {/* <h3 className="text-xl font-bold text-indigo-400 pb-2">Emoji Picker</h3> */}
      <p className="text-gray-400 text-sm">
        Click any emoji to add it to canvas
      </p>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded text-xs capitalize whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {filteredEmojis.map((emoji, idx) => (
          <button
            key={`${emoji}-${idx}`}
            onClick={() => onAddEmoji(emoji)}
            className="text-3xl p-2 hover:bg-gray-700 rounded transition-colors"
            title={`Add ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

const TextPanel = ({
  onAddTextBox,
  onAddHeading,
  onAddSubheading,
  onAddBody,
}) => (
  <div className="p-6 space-y-4 overflow-y-auto text-gray-300 border-b border-gray-700">
    {/* <h3 className="text-xl font-bold text-indigo-400 pb-2">Text</h3>
    <p className="text-gray-400">
      Add text overlays. Click text to select, then edit directly.
    </p> */}
    <button
      onClick={onAddTextBox}
      className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
    >
      Add a Text Box
    </button>
    <div className="space-y-2 pt-2">
      <button
        onClick={onAddHeading}
        className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
      >
        Add a heading
      </button>
      <button
        onClick={onAddSubheading}
        className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
      >
        Add a subheading
      </button>
      <button
        onClick={onAddBody}
        className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
      >
        Add a little bit of body text
      </button>
    </div>
  </div>
);

const TextSettingsPanel = ({
  activeAnn,
  onUpdateAnnotation,
  onDeleteAnnotation,
}) => {
  // Add state for toggling the custom color picker
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!activeAnn) {
    return (
      <div className="p-6 space-y-4 overflow-y-auto text-gray-300 border-b border-gray-700">
        <div className="text-gray-400">
          Select a text on the canvas to edit its properties here.
        </div>
      </div>
    );
  }

  const { imageId, ann } = activeAnn;
  const update = (patch) => onUpdateAnnotation(imageId, ann.id, patch);

  return (
    <div className="p-6 space-y-3 overflow-y-auto text-gray-300 border-b border-gray-700">
      <h3 className="text-xl font-bold text-indigo-400 pb-2">Selected Text</h3>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="text-sm text-gray-300 block">Font size</label>
          <input
            type="range"
            min="8"
            max="120"
            value={ann.fontSize}
            onChange={(e) => update({ fontSize: +e.target.value })}
            className="w-full"
          />
        </div>

        {/* CUSTOM COLOR PICKER SECTION */}
        {/* CUSTOM COLOR PICKER SECTION */}
        <div className="relative">
          <label className="text-sm text-gray-300 block mb-1">Color</label>

          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-10 h-9 rounded border border-gray-600 shadow-sm transition-transform active:scale-95"
            style={{ backgroundColor: ann.color }}
            title="Choose Text Color"
          />

          {showColorPicker && (
            <div
              data-prevent-close="true"
              className="absolute top-0 right-full mr-4 z-50 p-3 bg-gray-800 rounded-xl shadow-2xl border border-gray-700"
              style={{ width: "200px" }}
              // ✅ CRITICAL FIX: Add this onMouseDown handler
              onMouseDown={(e) => {
                // Prevent the click/drag events inside the picker
                // from reaching the global document listener that closes the panel.
                e.stopPropagation();
              }}
            >
              <HexColorPicker
                color={ann.color}
                onChange={(c) => update({ color: c })}
              />
              <div className="mt-2 text-right">
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="text-xs text-gray-400 hover:text-white underline"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ... Rest of your Font Weight, Underline, Font Family controls ... */}
      <div className="flex gap-2 pt-2">
        {/* (Keep the rest of your existing code here unchanged) */}
        <button
          onClick={() =>
            update({ fontWeight: ann.fontWeight === "700" ? "400" : "700" })
          }
          className={`px-3 py-2 rounded ${
            ann.fontWeight === "700" ? "bg-indigo-600" : "bg-gray-700"
          }`}
        >
          B
        </button>
        <button
          onClick={() =>
            update({
              textDecoration:
                ann.textDecoration === "underline" ? "none" : "underline",
            })
          }
          className={`px-3 py-2 rounded ${
            ann.textDecoration === "underline" ? "bg-indigo-600" : "bg-gray-700"
          }`}
        >
          U
        </button>
        <select
          value={ann.fontFamily || "inherit"}
          onChange={(e) => update({ fontFamily: e.target.value })}
          className="bg-gray-700 rounded px-2 text-white border-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="inherit">Default</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Courier New', monospace">Courier</option>
        </select>
      </div>

      <div className="pt-3 flex gap-2">
        <button
          onClick={() => update({ textAlign: "left" })}
          className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          Left
        </button>
        <button
          onClick={() => update({ textAlign: "center" })}
          className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          Center
        </button>
        <button
          onClick={() => update({ textAlign: "right" })}
          className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          Right
        </button>
      </div>

      <div className="pt-3">
        <button
          onClick={() => onDeleteAnnotation(imageId, ann.id)}
          className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded w-full transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// ✅ FIXED: Style panel with adjustments and reset button, removed AI prompt
const StylePanel = ({
  selectedImage,
  adjustments = {},
  onAdjustmentChange,
  onClearAdjustments,
}) => {
  if (!selectedImage) {
    return (
      <div className="p-6 space-y-4 overflow-y-auto text-gray-300 border-b border-gray-700">
        <div className="text-gray-400">
          Select an image to edit its style properties.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4 overflow-y-auto text-gray-300 border-b border-gray-700">
      <h3 className="text-lg font-semibold text-white">Style Adjustments</h3>

      <div className="pt-2 text-sm">
        <label className="block text-gray-400 mb-2">Brightness</label>
        <input
          type="range"
          min="50"
          max="150"
          value={adjustments.brightness}
          onChange={(e) => onAdjustmentChange("brightness", +e.target.value)}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{adjustments.brightness}%</span>
      </div>

      <div className="pt-2 text-sm">
        <label className="block text-gray-400 mb-2">Contrast</label>
        <input
          type="range"
          min="50"
          max="150"
          value={adjustments.contrast}
          onChange={(e) => onAdjustmentChange("contrast", +e.target.value)}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{adjustments.contrast}%</span>
      </div>

      <div className="pt-2 text-sm">
        <label className="block text-gray-400 mb-2">Saturation</label>
        <input
          type="range"
          min="50"
          max="150"
          value={adjustments.saturation}
          onChange={(e) => onAdjustmentChange("saturation", +e.target.value)}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{adjustments.saturation}%</span>
      </div>

      <div className="pt-3">
        <button
          onClick={onClearAdjustments}
          className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
        >
          Reset Adjustments
        </button>
      </div>
    </div>
  );
};

const EffectsPanel = ({ onApplyEffect }) => (
  <div className="p-6 space-y-4 overflow-y-auto text-gray-300 border-b border-gray-700">
    {/* <h3 className="text-lg font-semibold text-white">Filters</h3> */}
    <div className="space-y-3">
      <button
        onClick={() => onApplyEffect("warm_bright")}
        className="w-full py-3 bg-white/90  text-black rounded transition-colors"
      >
        Warm & Bright
      </button>
      <button
        onClick={() => onApplyEffect("cinematic")}
        className="w-full py-3 bg-white/90 text-black rounded shadow-md"
      >
        Cinematic
      </button>
      <button
        onClick={() => onApplyEffect("soft_pastel")}
        className="w-full py-3 bg-white/90 text-black rounded shadow-md"
      >
        Soft & Pastel
      </button>
      <button
        onClick={() => onApplyEffect("vibrant_pop")}
        className="w-full py-3 bg-white/90 text-black rounded shadow-md"
      >
        Vibrant & Pop
      </button>
      <button
        onClick={() => onApplyEffect("clear")}
        className="w-full py-2 mt-2 bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 rounded transition-colors"
      >
        Clear Filters
      </button>
    </div>
  </div>
);

// ✅ FIXED: Background panel with Images, Gradient, Solid colors side by side
const BackgroundPanel = ({
  onSetBackground,
  backgroundImages,
  backgroundGradients,
  onRemoveBackground,
  selectedBackgroundType,
  setSelectedBackgroundType,
}) => {
  return (
    <div className="p-6 space-y-4 overflow-y-auto text-gray-300 border-b border-gray-700 max-h-[calc(100vh-200px)]">
      {/* <h3 className="text-lg font-semibold text-white">Backgrounds</h3> */}

      <div className="mb-4">
        <button
          onClick={onRemoveBackground}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 rounded-lg text-white font-bold transition-opacity flex items-center justify-center gap-2"
        >
          <Camera className="w-5 h-5" />
          Remove Background
        </button>
      </div>

      {/* ✅ Side-by-side tabs like emoji panel */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelectedBackgroundType("images")}
          className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
            selectedBackgroundType === "images"
              ? "bg-indigo-600 text-white"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          <ImgIcon className="w-4 h-4 inline-block mr-1" />
          Images
        </button>
        <button
          onClick={() => setSelectedBackgroundType("gradient")}
          className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
            selectedBackgroundType === "gradient"
              ? "bg-indigo-600 text-white"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          <Palette className="w-4 h-4 inline-block mr-1" />
          Gradient
        </button>
        <button
          onClick={() => setSelectedBackgroundType("solid")}
          className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
            selectedBackgroundType === "solid"
              ? "bg-indigo-600 text-white"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          <div className="w-4 h-4 inline-block mr-1 rounded bg-gray-500" />
          Solid
        </button>
      </div>

      {/* Content based on selected type */}
      {selectedBackgroundType === "solid" && (
        <div>
          <div className="grid grid-cols-5 gap-2">
            {[
              "#0b1220",
              "#1f2937",
              "#0f766e",
              "#7c3aed",
              "#b91c1c",
              "#024b0b",
              "#374151",
              "#111827",
              "#3b82f6",
              "#dc2626",
              "#ea580c",
              "#84cc16",
              "#8b5cf6",
              "#ec4899",
              "#f59e0b",
              "#10b981",
              "#06b6d4",
              "#6366f1",
              "#a855f7",
              "#f43f5e",
            ].map((c, i) => (
              <div
                onClick={() => onSetBackground({ type: "color", value: c })}
                key={`c-${i}`}
                className="aspect-square rounded-lg hover:opacity-90 cursor-pointer transition-all hover:scale-105 border-2 border-gray-700"
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      )}

      {selectedBackgroundType === "gradient" && (
        <div>
          <div className="grid grid-cols-3 gap-2">
            {backgroundGradients.map((grad, idx) => (
              <div
                key={"grad-" + idx}
                onClick={() =>
                  onSetBackground({ type: "gradient", value: grad })
                }
                className="aspect-square rounded-lg hover:opacity-90 cursor-pointer transition-all hover:scale-105 border-2 border-gray-700"
                style={{ background: grad }}
              />
            ))}
          </div>
        </div>
      )}

      {selectedBackgroundType === "images" && (
        <div>
          <div className="grid grid-cols-3 gap-2">
            {backgroundImages.map((src, idx) => (
              <div
                key={"bgimg-" + idx}
                onClick={() => onSetBackground({ type: "image", value: src })}
                className="aspect-square rounded-lg hover:opacity-90 cursor-pointer transition-all hover:scale-105 overflow-hidden border-2 border-gray-700"
              >
                <img
                  src={src}
                  alt={`bg-${idx}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [imageList, setImageList] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [imageZoom, setImageZoom] = useState(100);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedBackgroundType, setSelectedBackgroundType] =
    useState("images");

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addAfterInputRef = useRef(null);
  const addAfterTargetRef = useRef(null);
  const annotationRefs = useRef({}); // map annId -> dom node
  const annotationFocusRef = useRef(null);
  const aiBtnRef = useRef(null);

  const setAnnotationDomText = (annId, text) => {
    const el = annotationRefs.current[annId];
    if (el && el.innerText !== text) {
      el.innerText = text;
    }
  };

  // When a text annotation changes externally (e.g., undo/redo, effect), update DOM
  useEffect(() => {
    // iterate images & annotations and update DOM for those not currently being edited
    imageList.forEach((img) => {
      img.annotations.forEach((ann) => {
        if (annotationFocusRef.current !== ann.id) {
          // only update DOM if not focused (so we don't disturb typing)
          setAnnotationDomText(ann.id, ann.text || "");
        } else {
          // keep buffer in sync if focused (optional)
          annotationEditBufferRef.current[ann.id] = ann.text || "";
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageList]);

  // Single outside-click handler: keep toolbar when clicking inside an annotation wrapper
  // or when clicking UI panels that should not dismiss the toolbar (allowlist).
  // src/App.jsx

  // Single outside-click handler: keep toolbar when clicking inside an annotation wrapper
  // or when clicking UI panels that should not dismiss the toolbar.
  useEffect(() => {
    const allowlistSelectors = [
      "[data-ann-id]", // Annotation wrappers
      ".slide-panel", // Sidebar panel
      ".right-panel",
      ".share-modal",
      "input", // Allow all inputs
      "button", // Allow all buttons
      "select", // Allow dropdowns
      "option",
      ".react-colorful", // The color picker library itself
      "[data-prevent-close]", // ✅ CRITICAL FIX: Allow any element with this attribute
    ];

    const isAllowed = (target) => {
      if (!target) return false;

      // 1. Explicit check for the custom color picker:
      // If the click happened inside the HexColorPicker or its wrapper, allow it.
      if (
        target.closest(".react-colorful") ||
        target.closest('[data-prevent-close="true"]')
      ) {
        return true;
      }

      // 2. Check all other standard/utility selectors (including the main panels):
      const standardAllowlist = [
        "[data-ann-id]",
        ".slide-panel",
        ".right-panel",
        ".share-modal",
        "input",
        "button",
        "select",
        "option",
      ];

      try {
        for (const sel of standardAllowlist) {
          if (target.closest && target.closest(sel)) return true;
        }
      } catch (err) {
        // ignore
      }
      return false;
    };

    const onDocMouseDown = (e) => {
      // If click is inside annotation wrapper or on any allowed UI -> keep activeAnnotation
      if (isAllowed(e.target)) return;

      // Otherwise hide controls
      setActiveAnnotation(null);
    };

    // Use capture phase so it runs early and reliably
    document.addEventListener("mousedown", onDocMouseDown, true);
    return () =>
      document.removeEventListener("mousedown", onDocMouseDown, true);
  }, []);

  const backgroundImages = useMemo(
    () => [
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80",
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80",
      "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&q=80",
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1200&q=80",
      "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=1200&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
      "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1200&q=80",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80",
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=80",
    ],
    []
  );

  const backgroundGradients = useMemo(
    () => [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)",
      "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)",
    ],
    []
  );

  const dragStateRef = useRef({
    dragging: false,
    resizing: false,
    annId: null,
    imageId: null,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
    startFont: 0,
    dragType: null,
  });

  const [activeAnnotation, setActiveAnnotation] = useState(null);

  const selectedImage = useMemo(
    () => imageList.find((i) => i.id === selectedImageId) || null,
    [imageList, selectedImageId]
  );

  const totalPages = imageList.length;
  const currentPageIndex = imageList.findIndex(
    (img) => img.id === selectedImageId
  );
  const currentPage = currentPageIndex !== -1 ? currentPageIndex + 1 : 0;

  const saveToHistory = useCallback(
    (newImageList) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(newImageList)));
        return newHistory.slice(-50);
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 49));
    },
    [historyIndex]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setImageList(JSON.parse(JSON.stringify(history[historyIndex - 1])));
      showStatusMessage("Undo");
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setImageList(JSON.parse(JSON.stringify(history[historyIndex + 1])));
      showStatusMessage("Redo");
    }
  }, [historyIndex, history]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  const showStatusMessage = (msg, isErr = false) => {
    if (isErr) setError(msg);
    else setMessage(msg);
    setTimeout(() => {
      setMessage(null);
      setError(null);
    }, 4200);
  };

  const handleInitialUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = null;
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showStatusMessage("Only images allowed", true);
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      showStatusMessage("File too large (12MB limit)", true);
      return;
    }

    setIsLoading(true);
    try {
      const dataUrl = await fileToBase64(file);
      const parts = dataUrl.split(";base64,");
      const newImg = createImageItem(
        file.type,
        parts.length === 2 ? parts[1] : "",
        dataUrl
      );
      const newList = [...imageList, newImg];
      setImageList(newList);
      setSelectedImageId(newImg.id);
      saveToHistory(newList);
      showStatusMessage("Uploaded successfully");
    } catch (err) {
      showStatusMessage("Upload failed: " + err.message, true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    const prompt = window.prompt(
      "Enter your image prompt:\n\nExamples:\n• sunset over mountains\n• cute kitten playing\n• abstract colorful art\n• futuristic cityscape"
    );

    if (!prompt || prompt.trim() === "") return;

    setIsGenerating(true);
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) {
        throw new Error("Image generation failed. Check your API key.");
      }

      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        const newImg = createImageItem("image/png", null, base64data, {
          isPositioned: true,
          position: { x: 50, y: 50 },
        });
        const newList = [...imageList, newImg];
        setImageList(newList);
        setSelectedImageId(newImg.id);
        saveToHistory(newList);
        showStatusMessage(`AI image "${prompt}" generated!`);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      showStatusMessage("AI generation failed: " + err.message, true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAIDetailBoost = async () => {
    if (!selectedImageId) {
      showStatusMessage("Select an image first", true);
      return;
    }
    // TODO: call your AI detail boost pipeline here
    showStatusMessage("AI Detail boost started...");
    // example: apply a preset locally while you wire the API
    applyPreset(selectedImageId, "vibrant_pop");
  };

  const handleAIEraser = async () => {
    if (!selectedImageId) {
      showStatusMessage("Select an image first", true);
      return;
    }
    showStatusMessage("AI Eraser running...");
    // TODO: call remove.bg or your inpainting endpoint
    await handleRemoveBackground(); // or a custom inpainting flow
  };

  const handleAIRecompose = async () => {
    if (!selectedImageId) {
      showStatusMessage("Select an image first", true);
      return;
    }
    showStatusMessage("AI Recompose started...");
    // TODO: call your recompose endpoint (inpainting / content-aware fill / generative edit)
  };

  const handleAddImageAfterFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = null;
    const afterId = addAfterTargetRef.current;
    addAfterTargetRef.current = null;
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showStatusMessage("Only images allowed", true);
      return;
    }

    setIsLoading(true);
    try {
      const dataUrl = await fileToBase64(file);
      const parts = dataUrl.split(";base64,");
      const newImg = createImageItem(
        file.type,
        parts.length === 2 ? parts[1] : "",
        dataUrl
      );

      const newImageList = (() => {
        if (!afterId) return [...imageList, newImg];
        const idx = imageList.findIndex((p) => p.id === afterId);
        if (idx === -1) return [...imageList, newImg];
        return [
          ...imageList.slice(0, idx + 1),
          newImg,
          ...imageList.slice(idx + 1),
        ];
      })();

      setImageList(newImageList);
      saveToHistory(newImageList);
      setSelectedImageId(newImg.id);
      showStatusMessage("Image added");
    } catch (err) {
      showStatusMessage("Failed to read file: " + err.message, true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = useCallback(
    (id = selectedImageId) => {
      if (!id) return;
      const next = imageList.filter((p) => p.id !== id);
      if (next.length === 0) {
        setSelectedImageId(null);
      } else {
        const removedIndex = imageList.findIndex((p) => p.id === id);
        const pickIndex = Math.min(removedIndex, next.length - 1);
        setSelectedImageId(next[pickIndex].id);
      }
      setImageList(next);
      saveToHistory(next);
      showStatusMessage("Image deleted");
    },
    [selectedImageId, imageList, saveToHistory]
  );

  const handleDuplicateImage = useCallback(
    (id = selectedImageId) => {
      if (!id) return;
      const idx = imageList.findIndex((p) => p.id === id);
      if (idx === -1) return;
      const item = imageList[idx];
      const copy = {
        ...item,
        id: crypto?.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2),
      };
      const next = [
        ...imageList.slice(0, idx + 1),
        copy,
        ...imageList.slice(idx + 1),
      ];
      setSelectedImageId(copy.id);
      setImageList(next);
      saveToHistory(next);
      showStatusMessage("Image duplicated");
    },
    [selectedImageId, imageList, saveToHistory]
  );

  const addAnnotationToImage = useCallback(
    (imgId, annotation) => {
      setImageList((prev) => {
        const next = prev.map((img) =>
          img.id === imgId
            ? { ...img, annotations: [...img.annotations, annotation] }
            : img
        );
        saveToHistory(next);
        return next;
      });
    },
    [saveToHistory]
  );

  const updateAnnotationOnImage = useCallback((imgId, annId, updates) => {
    setImageList((prev) =>
      prev.map((img) =>
        img.id === imgId
          ? {
              ...img,
              annotations: img.annotations.map((a) =>
                a.id === annId ? { ...a, ...updates } : a
              ),
            }
          : img
      )
    );
  }, []);

  const removeAnnotationFromImage = useCallback(
    (imgId, annId) => {
      setImageList((prev) => {
        const next = prev.map((img) =>
          img.id === imgId
            ? {
                ...img,
                annotations: img.annotations.filter((a) => a.id !== annId),
              }
            : img
        );
        saveToHistory(next);
        return next;
      });
      setActiveAnnotation(null);
    },
    [saveToHistory]
  );

  const handleAddTextBox = () => {
    if (!selectedImageId) {
      showStatusMessage("Select a page to add text to", true);
      return;
    }
    const ann = {
      id: crypto?.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
      text: "New text",
      left: 24,
      top: 24,
      fontSize: 16,
      color: "#ffffff",
      fontWeight: "400",
      textDecoration: "none",
      fontFamily: "inherit",
      textAlign: "left",
    };
    addAnnotationToImage(selectedImageId, ann);
    setActiveAnnotation({ imageId: selectedImageId, ann });
    showStatusMessage("Text box added");
  };

  const handleAddEmoji = (emoji) => {
    if (!selectedImageId) {
      showStatusMessage("Select a page to add emoji to", true);
      return;
    }
    const ann = {
      id: crypto?.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
      text: emoji,
      left: 50,
      top: 50,
      fontSize: 48,
      color: "#ffffff",
      fontWeight: "400",
      textDecoration: "none",
      fontFamily: "inherit",
      textAlign: "left",
    };
    addAnnotationToImage(selectedImageId, ann);
    setActiveAnnotation({ imageId: selectedImageId, ann });
    showStatusMessage("Emoji added!");
  };

  const handleAddHeading = () => {
    if (!selectedImageId) {
      showStatusMessage("Select a page to add text to", true);
      return;
    }
    const ann = {
      id: crypto?.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
      text: "Heading",
      left: 24,
      top: 24,
      fontSize: 28,
      color: "#ffffff",
      fontWeight: "700",
      textDecoration: "none",
      fontFamily: "inherit",
      textAlign: "left",
    };
    addAnnotationToImage(selectedImageId, ann);
    setActiveAnnotation({ imageId: selectedImageId, ann });
    showStatusMessage("Heading added");
  };

  const handleAddSubheading = () => {
    if (!selectedImageId) {
      showStatusMessage("Select a page to add text to", true);
      return;
    }
    const ann = {
      id: crypto?.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
      text: "Subheading",
      left: 24,
      top: 24,
      fontSize: 20,
      color: "#ffffff",
      fontWeight: "600",
      textDecoration: "none",
      fontFamily: "inherit",
      textAlign: "left",
    };
    addAnnotationToImage(selectedImageId, ann);
    setActiveAnnotation({ imageId: selectedImageId, ann });
    showStatusMessage("Subheading added");
  };

  const handleAddBody = () => {
    if (!selectedImageId) {
      showStatusMessage("Select a page to add text to", true);
      return;
    }
    const ann = {
      id: crypto?.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
      text: "Body text",
      left: 24,
      top: 24,
      fontSize: 14,
      color: "#ffffff",
      fontWeight: "400",
      textDecoration: "none",
      fontFamily: "inherit",
      textAlign: "left",
    };
    addAnnotationToImage(selectedImageId, ann);
    setActiveAnnotation({ imageId: selectedImageId, ann });
    showStatusMessage("Body text added");
  };

  // Annotation edit buffering & debounce refs (fix cursor-jump by not updating state on each keystroke)
  const annotationEditBufferRef = useRef({}); // { annId: "current live text" }
  const annotationEditTimeoutsRef = useRef({}); // { annId: timeoutId }

  // ✅ IMAGE DRAGGING SUPPORT
  useEffect(() => {
    const onMove = (e) => {
      if (!dragStateRef.current.dragging && !dragStateRef.current.resizing)
        return;
      const {
        dragging,
        resizing,
        annId,
        imageId,
        startX,
        startY,
        startLeft,
        startTop,
        startFont,
        dragType,
      } = dragStateRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (dragging && dragType === "text") {
        setImageList((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? {
                  ...img,
                  annotations: img.annotations.map((a) =>
                    a.id === annId
                      ? {
                          ...a,
                          left: Math.max(4, startLeft + dx),
                          top: Math.max(4, startTop + dy),
                        }
                      : a
                  ),
                }
              : img
          )
        );
      } else if (dragging && dragType === "image") {
        setImageList((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? {
                  ...img,
                  position: {
                    x: startLeft + dx,
                    y: startTop + dy,
                  },
                }
              : img
          )
        );
      } else if (resizing) {
        const newFont = Math.max(
          8,
          Math.round(startFont + dx * 0.1 + dy * 0.1)
        );
        setImageList((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? {
                  ...img,
                  annotations: img.annotations.map((a) =>
                    a.id === annId ? { ...a, fontSize: newFont } : a
                  ),
                }
              : img
          )
        );
      }
    };

    const onUp = () => {
      dragStateRef.current.dragging = false;
      dragStateRef.current.resizing = false;
      dragStateRef.current.annId = null;
      dragStateRef.current.imageId = null;
      dragStateRef.current.dragType = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const startDrag = (imageId, ann, e) => {
    e.preventDefault();
    e.stopPropagation();
    dragStateRef.current = {
      dragging: true,
      resizing: false,
      annId: ann.id,
      imageId,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: ann.left,
      startTop: ann.top,
      startFont: ann.fontSize,
      dragType: "text",
    };
    setActiveAnnotation({ imageId, ann });
  };

  const startImageDrag = (imageId, e, currentPos) => {
    e.preventDefault();
    e.stopPropagation();
    dragStateRef.current = {
      dragging: true,
      resizing: false,
      annId: null,
      imageId,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: currentPos.x,
      startTop: currentPos.y,
      startFont: 0,
      dragType: "image",
    };
  };

  const startResize = (imageId, ann, e) => {
    e.preventDefault();
    e.stopPropagation();
    dragStateRef.current = {
      dragging: false,
      resizing: true,
      annId: ann.id,
      imageId,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: ann.left,
      startTop: ann.top,
      startFont: ann.fontSize,
      dragType: "text",
    };
    setActiveAnnotation({ imageId, ann });
  };

  // removed the previous caret save/restore logic; using debounce commit instead
  const onAnnotationInputBuffered = (imageId, annId, e) => {
    const text = e.currentTarget.textContent || "";
    // keep live text in buffer
    annotationEditBufferRef.current[annId] = text;

    // clear existing timeout
    if (annotationEditTimeoutsRef.current[annId]) {
      clearTimeout(annotationEditTimeoutsRef.current[annId]);
    }

    // debounce commit (400ms)
    annotationEditTimeoutsRef.current[annId] = setTimeout(() => {
      updateAnnotationOnImage(imageId, annId, {
        text: annotationEditBufferRef.current[annId] || "",
      });
      delete annotationEditTimeoutsRef.current[annId];
    }, 400);
  };

  // onBlur commit immediately to state
  const onAnnotationBlurCommit = (imageId, annId, e) => {
    const text = e.currentTarget.textContent || "";

    // clear any pending timeout
    if (annotationEditTimeoutsRef.current[annId]) {
      clearTimeout(annotationEditTimeoutsRef.current[annId]);
      delete annotationEditTimeoutsRef.current[annId];
    }

    // update buffer & commit
    annotationEditBufferRef.current[annId] = text;
    updateAnnotationOnImage(imageId, annId, { text });
  };

  const onAnnotationColorChange = (imageId, annId, color) => {
    updateAnnotationOnImage(imageId, annId, { color });
  };

  const onDeleteAnnotationImmediate = (imageId, annId) => {
    removeAnnotationFromImage(imageId, annId);
    setActiveAnnotation(null);
  };

  const applyPreset = (imageId, preset) => {
    const newList = imageList.map((img) => {
      if (img.id !== imageId) return img;
      switch (preset) {
        case "warm_bright":
          return {
            ...img,
            effects: ["warm"],
            adjustments: {
              ...img.adjustments,
              brightness: 110,
              contrast: 105,
              saturation: 115,
            },
          };
        case "cinematic":
          return {
            ...img,
            effects: ["cinematic"],
            adjustments: {
              ...img.adjustments,
              brightness: 95,
              contrast: 120,
              saturation: 90,
            },
          };
        case "soft_pastel":
          return {
            ...img,
            effects: ["pastel"],
            adjustments: {
              ...img.adjustments,
              brightness: 105,
              contrast: 95,
              saturation: 85,
            },
          };
        case "vibrant_pop":
          return {
            ...img,
            effects: ["vibrant"],
            adjustments: {
              ...img.adjustments,
              brightness: 105,
              contrast: 110,
              saturation: 130,
            },
          };
        case "clear":
          return {
            ...img,
            effects: [],
            adjustments: {
              brightness: 100,
              contrast: 100,
              saturation: 100,
            },
          };
        default:
          return img;
      }
    });
    setImageList(newList);
    saveToHistory(newList);
  };

  const handleApplyEffect = (key) => {
    if (!selectedImageId) {
      showStatusMessage("Select a page to apply effect", true);
      return;
    }
    applyPreset(selectedImageId, key);
    showStatusMessage("Filter applied");
  };

  const handleAdjustmentChange = (key, value) => {
    if (!selectedImageId) {
      showStatusMessage("Select a page to adjust", true);
      return;
    }
    setImageList((prev) =>
      prev.map((img) =>
        img.id === selectedImageId
          ? { ...img, adjustments: { ...img.adjustments, [key]: value } }
          : img
      )
    );
  };

  const handleClearAdjustments = () => {
    if (!selectedImageId) return;
    const newList = imageList.map((img) =>
      img.id === selectedImageId
        ? {
            ...img,
            adjustments: {
              brightness: 100,
              contrast: 100,
              saturation: 100,
            },
          }
        : img
    );
    setImageList(newList);
    saveToHistory(newList);
    showStatusMessage("Adjustments reset");
  };

  const handleSetBackground = (bg) => {
    if (!selectedImageId) {
      showStatusMessage("Select a page to change background", true);
      return;
    }
    const newList = imageList.map((img) =>
      img.id === selectedImageId ? { ...img, background: bg } : img
    );
    setImageList(newList);
    saveToHistory(newList);
    showStatusMessage("Background set");
  };

  const handleRemoveBackground = async () => {
    if (!selectedImage?.originalUrl) {
      showStatusMessage("No image selected", true);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      const response = await fetch(selectedImage.originalUrl);
      const blob = await response.blob();
      formData.append("image_file", blob);
      formData.append("size", "auto");

      const apiResponse = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": REMOVEBG_API_KEY,
        },
        body: formData,
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(
          errorData.errors?.[0]?.title || "Background removal failed"
        );
      }

      const resultBlob = await apiResponse.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        const newList = imageList.map((img) =>
          img.id === selectedImageId
            ? { ...img, originalUrl: base64data, processedUrl: base64data }
            : img
        );
        setImageList(newList);
        saveToHistory(newList);
        showStatusMessage("Background removed successfully!");
      };
      reader.readAsDataURL(resultBlob);
    } catch (err) {
      showStatusMessage("Background removal failed: " + err.message, true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!activeAnnotation) return;
    const img = imageList.find((i) => i.id === activeAnnotation.imageId);
    if (!img) {
      setActiveAnnotation(null);
      return;
    }
    const ann = img.annotations.find((a) => a.id === activeAnnotation.ann.id);
    if (!ann) {
      setActiveAnnotation(null);
      return;
    }
    setActiveAnnotation({ imageId: img.id, ann });
  }, [imageList]);

  const Sidebar = () => {
    const sidebarTools = [
      { id: "image", label: "Image", Icon: ImgIcon, disabled: true },
      { id: "text", label: "Text", Icon: Tally5 },
      { id: "emoji", label: "Emoji", Icon: Smile },
      { id: "style", label: "Style", Icon: Palette },
      { id: "effects", label: "Effects", Icon: Sparkles },
      { id: "background", label: "Background", Icon: Layers },
    ];

    return (
      <aside className="flex flex-col items-center p-3 bg-gray-900 border-r border-gray-800 w-20 flex-shrink-0">
        <div className="flex flex-col gap-3">
          {sidebarTools.map((t) => {
            const isActive = selectedTool === t.id;
            const isTopImage = t.id === "image";

            return (
              <div key={t.id} className="flex flex-col items-center">
                <button
                  onClick={() => {
                    if (t.disabled) return; // ⛔ ignore clicks
                    setSelectedTool((prev) => (prev === t.id ? null : t.id));
                  }}
                  disabled={t.disabled}
                  title={t.label}
                  className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-shadow ${
                    isActive
                      ? "bg-gray-700 ring-2 ring-indigo-500"
                      : isTopImage
                      ? "bg-teal-600 hover:bg-teal-700 ring-2 ring-teal-400 shadow-lg"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  <t.Icon className="w-6 h-6 text-white" />
                </button>
                <div className="mt-1 text-xs text-gray-300 select-none">
                  {isTopImage ? "" : t.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex-grow" />

        <button
          ref={aiBtnRef}
          onClick={() =>
            setSelectedTool((prev) => (prev === "ai-magic" ? null : "ai-magic"))
          }
          className={`w-14 h-14 mb-1 rounded-xl flex items-center justify-center shadow-lg transition-transform focus:outline-none ${
            selectedTool === "ai-magic"
              ? "bg-indigo-700 ring-2 ring-indigo-400 transform scale-105"
              : "bg-gradient-to-r from-pink-500 to-indigo-500 hover:opacity-95"
          }`}
          title="AI Magic"
          aria-expanded={selectedTool === "ai-magic"}
          aria-label="AI Magic"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </button>
      </aside>
    );
  };

  const SlidePanel = () => {
    const panelWidthClass = "w-96";
    if (!selectedTool) return null;

    return (
      <div className={`fixed right-0 top-0 h-full z-40 pointer-events-none`}>
        {selectedTool && (
          <div
            onClick={() => setSelectedTool(null)}
            className="absolute left-0 top-0 w-screen h-full bg-black/40"
          />
        )}

        <div
          className={`absolute right-10 top-[120px] h-auto w-[300px] ${panelWidthClass} bg-gray-800 border-l rounded-lg border-gray-700 shadow-2xl transform transition-transform duration-300 ease-out ${
            selectedTool
              ? "translate-x-0 pointer-events-auto"
              : "translate-x-full pointer-events-none"
          }`}
        >
          <div className="p-4 overflow-y-auto h-full max-h-[calc(100vh-140px)]">
            <div className="flex items-center justify-between mb-3 border-b border-gray-700 pb-2">
              <h3 className="text-xl font-bold text-white">
                {selectedTool ? selectedTool.toUpperCase() : ""}
              </h3>
              <button
                onClick={() => setSelectedTool(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            {selectedTool === "image" && (
              <ImagePanel
                handleInitialUpload={handleInitialUpload}
                onGenerateImage={handleGenerateImage}
                isGenerating={isGenerating}
              />
            )}

            {selectedTool === "text" && (
              <>
                <TextPanel
                  onAddTextBox={handleAddTextBox}
                  onAddHeading={handleAddHeading}
                  onAddSubheading={handleAddSubheading}
                  onAddBody={handleAddBody}
                />
                <TextSettingsPanel
                  activeAnn={
                    activeAnnotation
                      ? {
                          imageId: activeAnnotation.imageId,
                          ann: activeAnnotation.ann,
                        }
                      : null
                  }
                  onUpdateAnnotation={(imgId, annId, patch) =>
                    updateAnnotationOnImage(imgId, annId, patch)
                  }
                  onDeleteAnnotation={(imgId, annId) =>
                    onDeleteAnnotationImmediate(imgId, annId)
                  }
                />
              </>
            )}

            {selectedTool === "emoji" && (
              <EmojiPanel onAddEmoji={handleAddEmoji} />
            )}

            {selectedTool === "style" && (
              <StylePanel
                selectedImage={selectedImage}
                adjustments={
                  selectedImage?.adjustments || {
                    brightness: 100,
                    contrast: 100,
                    saturation: 100,
                  }
                }
                onAdjustmentChange={(k, v) => handleAdjustmentChange(k, v)}
                onClearAdjustments={() => handleClearAdjustments()}
              />
            )}

            {selectedTool === "effects" && selectedImage && (
              <EffectsPanel onApplyEffect={(p) => handleApplyEffect(p)} />
            )}

            {selectedTool === "background" && (
              <BackgroundPanel
                onSetBackground={handleSetBackground}
                backgroundImages={backgroundImages}
                backgroundGradients={backgroundGradients}
                onRemoveBackground={handleRemoveBackground}
                selectedBackgroundType={selectedBackgroundType}
                setSelectedBackgroundType={setSelectedBackgroundType}
              />
            )}
            {selectedTool === "ai-magic" && (
              <AiMagicPanelContent
                onClose={() => setSelectedTool(null)}
                onDetailBoost={handleAIDetailBoost}
                onEraser={handleAIEraser}
                onRecompose={handleAIRecompose}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  // REPLACE existing AiMagicPanel with this:
  const AiMagicPanelContent = ({ onDetailBoost, onEraser, onRecompose }) => {
    return (
      <div className="p-6 space-y-4 w-[250px] overflow-y-auto text-gray-300">
        <div className="flex items-stretch justify-between gap-3">
          {/* AI Detail */}
          <button
            onClick={onDetailBoost}
            className="flex-1 flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="AI Detail boost"
            aria-label="AI Detail boost"
          >
            <div className="w-14 h-14 rounded-full bg-gray-500/95 flex items-center justify-center shadow-inner">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-gray-200 text-center leading-tight">
              AI Detail
              <br />
              boost
            </span>
          </button>

          {/* AI Eraser */}
          <button
            onClick={onEraser}
            className="flex-1 flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="AI Eraser"
            aria-label="AI Eraser"
          >
            <div className="w-14 h-14 rounded-full bg-gray-500/95 flex items-center justify-center shadow-inner">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M3 6h18v2H3V6zm3 4h12l-2 10H8L6 10z" />
              </svg>
            </div>
            <span className="text-xs text-gray-200 text-center leading-tight">
              AI
              <br />
              Eraser
            </span>
          </button>

          {/* AI Recompose */}
          <button
            onClick={onRecompose}
            className="flex-1 flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="AI Recompose"
            aria-label="AI Recompose"
          >
            <div className="w-14 h-14 rounded-full bg-gray-500/95 flex items-center justify-center shadow-inner">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-gray-200 text-center leading-tight">
              AI
              <br />
              Recompose
            </span>
          </button>
        </div>
      </div>
    );
  };

  async function shortenUrl(url) {
    try {
      const resp = await fetch(
        `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`
      );
      if (!resp.ok) throw new Error("Shortener failed");
      const short = await resp.text();
      return short; // returns the short URL string
    } catch (err) {
      console.warn("shorten failed", err);
      return url; // fallback to original
    }
  }

  const ShareModalPanel = ({
    showShareModal,
    setShowShareModal,
    selectedImage,
  }) => {
    const [copied, setCopied] = useState(false);

    const shareUrl =
      selectedImage?.processedUrl ||
      selectedImage?.originalUrl ||
      window.location.href;

    // src/App.jsx

    const handleCopy = async () => {
      if (!selectedImage) {
        showStatusMessage("Nothing to copy", true);
        return;
      }

      try {
        // find the same DOM node you use for download
        const cardEl = document.querySelector(
          `[data-image-card-id="${selectedImage.id}"]`
        );
        if (!cardEl) {
          showStatusMessage("Could not find the design on the page", true);
          return;
        }

        showStatusMessage("Preparing image to copy…");

        // render the styled card with html2canvas
        // render the styled card with html2canvas (hide UI controls before rendering)
        // inside handleDownload:
        const canvas = await html2canvas(cardEl, {
          useCORS: true,
          backgroundColor: null,
          scale:
            window.devicePixelRatio && window.devicePixelRatio > 1 ? 2 : 1.5,
          onclone: (clonedDoc) => {
            try {
              // Hide elements marked with .no-export
              clonedDoc.querySelectorAll(".no-export").forEach((el) => {
                el.style.display = "none";
              });

              // Hide known UI overlays if present (safety)
              clonedDoc
                .querySelectorAll(".slide-panel, .right-panel, .share-modal")
                .forEach((el) => {
                  el.style.display = "none";
                });

              // Find the cloned card and remove outlines/borders/rings
              const clonedCard = clonedDoc.querySelector(
                `[data-image-card-id="${selectedImage.id}"]`
              );
              if (clonedCard) {
                // remove visible border/ring/outline (inline style override)
                clonedCard.style.boxShadow = "none";
                clonedCard.style.outline = "none";
                clonedCard.style.border = "none";
                // If the card uses tailwind ring classes (ring-4 etc), removing inline border/ring-visible parts helps
                // also ensure rounded corners/background are preserved (we don't clear background)
              }

              // Additionally remove any tiny selection outlines that might be on text annotations
              clonedDoc.querySelectorAll("[data-ann-id]").forEach((a) => {
                a.style.outline = "none";
                a.style.boxShadow = "none";
              });
            } catch (err) {
              console.warn("html2canvas onclone tweak failed", err);
            }
          },
        });

        // convert to blob
        const blob = await new Promise((res) =>
          canvas.toBlob(res, "image/png", 0.95)
        );
        if (!blob) {
          throw new Error("Failed to create image blob");
        }

        // 1) Try to write the image to the clipboard (user can paste the image)
        if (navigator.clipboard && window.ClipboardItem) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
            setCopied(true);
            showStatusMessage("Image copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
          } catch (err) {
            console.warn("clipboard image write failed:", err);
            // continue to attempt to upload/copy URL
          }
        }

        // 2) If you want a shareable URL, attempt to upload to Imgur (requires client id)
        let publicUrl = null;
        if (IMGUR_CLIENT_ID) {
          try {
            const fd = new FormData();
            fd.append("image", blob);

            const resp = await fetch("https://api.imgur.com/3/image", {
              method: "POST",
              headers: {
                Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
              },
              body: fd,
            });

            const j = await resp.json();
            if (resp.ok && j && j.data && j.data.link) {
              publicUrl = j.data.link;

              // shorten and copy instead of copying long URL
              try {
                const short = await shortenUrl(publicUrl);
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  await navigator.clipboard.writeText(short);
                  setCopied(true);
                  showStatusMessage("Short link copied to clipboard!");
                  setTimeout(() => setCopied(false), 2000);
                  return;
                }
              } catch (err) {
                // fallback: copy long publicUrl
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  await navigator.clipboard.writeText(publicUrl);
                  setCopied(true);
                  showStatusMessage("Shareable link copied to clipboard!");
                  setTimeout(() => setCopied(false), 2000);
                  return;
                }
              }
            } else {
              console.warn("Imgur upload failed", j);
            }
          } catch (err) {
            console.warn("Imgur upload error", err);
          }
        }

        // 3) If Imgur was not used / failed, try to create a short URL from the blob by:
        //    - creating an object URL and copying that (ephemeral), or
        //    - if you have your own upload endpoint, send the blob there and copy returned URL.
        if (!publicUrl) {
          // fallback: create a blob: URL and copy it (note: not permanent)
          const blobUrl = URL.createObjectURL(blob);
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(blobUrl);
              setCopied(true);
              showStatusMessage("Blob URL copied to clipboard (session-only)!");
              setTimeout(() => setCopied(false), 2000);
            } else {
              // fallback: create temporary textarea
              const ta = document.createElement("textarea");
              ta.value = blobUrl;
              ta.style.position = "fixed";
              ta.style.left = "-9999px";
              document.body.appendChild(ta);
              ta.select();
              document.execCommand("copy");
              document.body.removeChild(ta);
              setCopied(true);
              showStatusMessage("Blob URL copied to clipboard (session-only)!");
              setTimeout(() => setCopied(false), 2000);
            }
          } catch (err) {
            console.warn("Failed to copy blob URL:", err);
            showStatusMessage("Copy failed. Use Download or try again.", true);
          }
        }
      } catch (err) {
        console.error("handleCopy error:", err);
        showStatusMessage("Copy failed: " + (err.message || "Unknown"), true);
      }
    };

    const handleDownload = async () => {
      console.log("handleDownload: start");
      if (!selectedImage) {
        showStatusMessage("No image to download", true);
        return;
      }

      try {
        const cardEl = document.querySelector(
          `[data-image-card-id="${selectedImage.id}"]`
        );
        console.log("handleDownload: found cardEl?", !!cardEl);
        if (!cardEl) {
          showStatusMessage("Could not find the design on the page", true);
          return;
        }

        if (document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }

        showStatusMessage("Preparing image…");

        const canvas = await html2canvas(cardEl, {
          useCORS: true,
          backgroundColor: null,
          scale: window.devicePixelRatio > 1 ? 2 : 1.5,
          onclone: (clonedDoc) => {
            try {
              clonedDoc
                .querySelectorAll(".no-export")
                .forEach((el) => (el.style.display = "none"));
              clonedDoc
                .querySelectorAll(
                  ".slide-panel, .right-panel, .share-modal, .react-colorful, .tooltip, .popover"
                )
                .forEach((el) => (el.style.display = "none"));
              const clonedCard = clonedDoc.querySelector(
                `[data-image-card-id="${selectedImage.id}"]`
              );
              if (clonedCard) {
                clonedCard.style.boxShadow = "none";
                clonedCard.style.outline = "none";
                clonedCard.style.border = "none";
                clonedCard.style.borderRadius =
                  clonedCard.style.borderRadius || "";
              }
              clonedDoc.querySelectorAll("[data-ann-id]").forEach((a) => {
                a.style.outline = "none";
                a.style.boxShadow = "none";
                a.style.caretColor = "transparent";
              });
              const style = clonedDoc.createElement("style");
              style.type = "text/css";
              style.appendChild(
                clonedDoc.createTextNode(`
  [data-image-card-id="${selectedImage.id}"], [data-image-card-id="${selectedImage.id}"] * {
    box-shadow: none !important; outline: none !important; border: none !important;
  }
  .ring, [class*="ring-"], [class*="ring"] { box-shadow: none !important; }
  *:focus { outline: none !important; box-shadow: none !important; caret-color: transparent !important; }
  [data-image-card-id="${selectedImage.id}"]::before, [data-image-card-id="${selectedImage.id}"]::after { display: none !important; }
          `)
              );
              if (clonedDoc.head) clonedDoc.head.appendChild(style);
            } catch (err) {
              console.warn("onclone tweak failed", err);
            }
          },
        });

        if (!canvas) throw new Error("Canvas creation failed");
        console.log(
          "handleDownload: canvas created",
          canvas.width,
          canvas.height
        );

        // TUNE THESE if you still see stray pixels (increase cropPercent)
        const cropPercent = 0.03; // 3% crop on left/top/right
        const extraBottomPercent = 0.04; // 4% extra bottom crop
        const inset = Math.round(
          Math.min(canvas.width, canvas.height) * cropPercent
        );
        const extraBottomCrop = Math.round(canvas.height * extraBottomPercent);

        const srcX = inset;
        const srcY = inset;
        const srcW = Math.max(1, canvas.width - inset * 2);
        const srcH = Math.max(1, canvas.height - inset * 2 - extraBottomCrop);

        // final rounded radius
        const radius = Math.round(Math.min(srcW, srcH) * 0.06); // 6% radius (adjust if needed)

        // create target canvas (transparent background)
        const out = document.createElement("canvas");
        out.width = srcW;
        out.height = srcH;
        const ctx = out.getContext("2d", { alpha: true });

        // helper: rounded rect path
        function roundedRectPath(ctx, x, y, w, h, r) {
          const rad = Math.max(0, Math.min(r, Math.min(w, h) / 2));
          ctx.beginPath();
          ctx.moveTo(x + rad, y);
          ctx.lineTo(x + w - rad, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
          ctx.lineTo(x + w, y + h - rad);
          ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
          ctx.lineTo(x + rad, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
          ctx.lineTo(x, y + rad);
          ctx.quadraticCurveTo(x, y, x + rad, y);
          ctx.closePath();
        }

        // Clear, apply rounded clip, draw cropped region
        ctx.clearRect(0, 0, out.width, out.height);
        roundedRectPath(ctx, 0, 0, out.width, out.height, radius);
        ctx.save();
        ctx.clip();

        // draw the cropped area from original canvas into out canvas
        ctx.drawImage(
          canvas,
          srcX,
          srcY,
          srcW,
          srcH,
          0,
          0,
          out.width,
          out.height
        );

        ctx.restore();

        // NOTE: no white fill, no stroke. Transparent corners remain transparent.
        // If you want a subtle border, we can add a stroke here (but you said remove white).

        out.toBlob(
          (blob) => {
            if (!blob) {
              showStatusMessage("Failed to export image", true);
              return;
            }
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `ai-styled-image-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            showStatusMessage("Image downloaded!");
            console.log("handleDownload: finished download");
          },
          "image/png",
          1
        );
      } catch (err) {
        console.error("handleDownload error:", err);
        showStatusMessage(
          "Download failed: " + (err.message || "Unknown error"),
          true
        );
      }
    };

    const shareToSocial = (platform) => {
      const text = "Check out my AI styled image!";
      const url = encodeURIComponent(shareUrl);
      const encodedText = encodeURIComponent(text);

      const urls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${url}`,
        whatsapp: `https://wa.me/?text=${encodedText}%20${url}`,
        instagram: `https://www.instagram.com/`,
      };

      if (platform === "instagram") {
        showStatusMessage("Open Instagram app to share", false);
      } else {
        window.open(urls[platform], "_blank", "width=600,height=400");
      }
    };

    if (!showShareModal) return null;

    return (
      <div className="fixed right-10 top-[115px] w-[320px] bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Share Design</h3>
          <button
            onClick={() => setShowShareModal(false)}
            className="text-gray-400 hover:text-white"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 px-3 w-[150px] py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
              onFocus={(e) => {
                // help users select quickly if they click the field
                e.currentTarget.select();
              }}
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded text-white font-semibold transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* ---- Social icons: direct to homepage ---- */}
          <div className="grid grid-cols-4 gap-4 pt-2 justify-items-center">
            {/* Facebook */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open("https://www.facebook.com/", "_blank");
              }}
              className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all text-white pointer-events-auto cursor-pointer"
              title="Open Facebook"
              aria-label="Open Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 
             5.373-12 12c0 5.99 4.388 10.954 10.125 
             11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 
             1.792-4.669 4.533-4.669 1.312 0 2.686.235 
             2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 
             1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 
             23.027 24 18.062 24 12.073z"
                />
              </svg>
            </button>

            {/* Twitter */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open("https://twitter.com/", "_blank");
              }}
              className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all text-white pointer-events-auto cursor-pointer"
              title="Open Twitter"
              aria-label="Open Twitter"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </button>

            {/* WhatsApp */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open("https://www.whatsapp.com/", "_blank");
              }}
              className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all text-white pointer-events-auto cursor-pointer"
              title="Open WhatsApp"
              aria-label="Open WhatsApp"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </button>

            {/* Instagram (already correct) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open("https://www.instagram.com/", "_blank");
              }}
              className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all text-white pointer-events-auto cursor-pointer"
              title="Open Instagram"
              aria-label="Open Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
              </svg>
            </button>
          </div>
          {/* ---- end social icons ---- */}

          <button
            onClick={handleDownload}
            className="w-full py-3 rounded-md bg-teal-600 hover:bg-teal-700 text-white font-bold transition-opacity flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download Image
          </button>
        </div>
      </div>
    );
  };

  const StatusToast = () =>
    message || error ? (
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/75 text-white px-4 py-2 rounded z-50">
        <div className={`${error ? "text-red-400" : "text-green-300"}`}>
          {error || message}
        </div>
      </div>
    ) : null;

  if (imageList.length === 0) {
    return (
      <div className="pt-[100px] bg-gray-900 text-white h-screen font-sans flex flex-col items-center justify-center p-4">
        <header className="absolute top-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-wider text-white">
            AI IMAGE STYLER
          </h1>
          <p className="mt-2 text-gray-400 text-xl font-serif">
            Faster, smarter and more creative image generation
          </p>
        </header>

        <div className="p-10 mb-[120px] rounded-3xl text-center max-w-2xl w-full">
          <div className="border-4 border-dashed border-gray-700 p-8 md:p-16 rounded-3xl w-[600px] space-y-8 bg-gray-800/50">
            <h2 className="text-3xl font-semibold text-white">
              Ready to transform your photo?
            </h2>
            <ImgIcon className="w-32 h-32 text-gray-600 mx-auto" />
            <p className="text-gray-400 text-lg">
              Upload an image to start creating.
            </p>

            <div className="flex items-center justify-center gap-4">
              <label
                htmlFor="file-upload-initial"
                className={`inline-flex items-center px-8 py-4 rounded-xl text-xl font-bold transition-all duration-300 bg-teal-600 hover:bg-teal-700 shadow-lg cursor-pointer ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <UploadCloud className="w-6 h-6" />
                )}{" "}
                <span className="ml-3">
                  {isLoading ? "Uploading..." : "Upload Image"}
                </span>
              </label>
            </div>

            <input
              id="file-upload-initial"
              type="file"
              accept="image/*"
              onChange={handleInitialUpload}
              className="hidden"
              disabled={isLoading}
            />
            {/* <p className="text-sm text-gray-500 pt-3">
              ✨ New: AI image generation, drag images, 30+ backgrounds, emojis!
            </p> */}
          </div>
        </div>

        <StatusToast />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen ml-[48px] bg-gray-900 text-white font-sans flex overflow-hidden">
      <Sidebar aiBtnRef={aiBtnRef} />

      <div className="flex flex-col flex-grow overflow-hidden">
        <header className="flex justify-between items-center p-4 md:p-6 border-b border-gray-800 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-extrabold tracking-wider text-white">
              AI IMAGE STYLER
            </h1>
            <p className="mt-0 text-gray-400 text-sm">
              Drag & drop • Background removal • Emoji support
            </p>
          </div>

          <div className="flex mr-10 items-center gap-3">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            </button>

            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
                />
              </svg>
            </button>

            <label
              htmlFor="file-upload-top"
              className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span className="ml-2">Add Image</span>
            </label>
            <input
              id="file-upload-top"
              type="file"
              accept="image/*"
              onChange={handleInitialUpload}
              className="hidden"
            />

            <button
              onClick={() => setShowShareModal((s) => !s)}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold transition-colors shadow-lg"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </header>

        <ShareModalPanel
          showShareModal={showShareModal}
          setShowShareModal={setShowShareModal}
          selectedImage={selectedImage}
        />

        <div className="flex-grow mr-[50px] overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6 p-6">
            {imageList.map((img, index) => {
              const showSrc = img.processedUrl || img.originalUrl;
              const isSelected = img.id === selectedImageId;

              const adj = img.adjustments || {
                brightness: 100,
                contrast: 100,
                saturation: 100,
              };

              // build filter string from adjustments + effects
              const filterParts = [
                `brightness(${adj.brightness / 100})`,
                `contrast(${adj.contrast / 100})`,
                `saturate(${adj.saturation / 100})`,
              ];

              if (img.effects.includes("warm")) filterParts.push("sepia(0.06)");
              if (img.effects.includes("cinematic"))
                filterParts.push("contrast(1.1) saturate(0.9)");
              if (img.effects.includes("pastel"))
                filterParts.push(
                  "saturate(0.8) contrast(0.95) brightness(1.03)"
                );
              if (img.effects.includes("vibrant"))
                filterParts.push("saturate(1.25) contrast(1.05)");

              const filterStyle = filterParts.join(" ");

              const bg = img.background;
              const backgroundStyle = bg
                ? bg.type === "color"
                  ? { background: bg.value }
                  : bg.type === "gradient"
                  ? { background: bg.value }
                  : {
                      backgroundImage: `url(${bg.value})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                : {};

              // compute numeric globalScale (e.g. 1.00 for 100%)
              const globalScale = imageZoom / 100;

              // use per-image scale (default 1)
              const imgScale = img.scale || 1;

              return (
                <div
                  key={img.id}
                  data-image-card-id={img.id}
                  className={`bg-gray-800 rounded-2xl p-4 border ${
                    isSelected
                      ? "ring-4 ring-indigo-500 ring-offset-2 ring-offset-gray-900"
                      : "border-gray-700"
                  }`}
                >
                  <div className="flex justify-end space-x-2 mb-3 no-export">
                    <button
                      onClick={() => {
                        addAfterTargetRef.current = img.id;
                        addAfterInputRef.current?.click();
                      }}
                      title="Add image after"
                      className="p-2 rounded bg-gray-700 hover:bg-gray-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDuplicateImage(img.id)}
                      title="Duplicate"
                      className="p-2 rounded bg-gray-700 hover:bg-gray-600"
                    >
                      <CopyIcon className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      title="Delete"
                      className="p-2 rounded bg-gray-700 hover:bg-gray-600"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>

                  <div
                    onClick={() => setSelectedImageId(img.id)}
                    className="rounded-xl overflow-hidden bg-gray-900 flex items-center justify-center cursor-pointer"
                    style={{
                      /* keep the container tall enough when the image is switched to absolute */
                      minHeight:
                        img.isPositioned && img.size?.height
                          ? img.size.height
                          : 300,
                      /* optionally set exact height to avoid sudden reflow:
               height: img.isPositioned && img.size?.height ? img.size.height : 'auto', */ position:
                        "relative",
                      ...backgroundStyle,
                    }}
                  >
                    {showSrc ? (
                      <img
                        src={showSrc}
                        alt={`page-${index + 1}`}
                        className="max-w-full max-h-[640px] object-contain transition-transform cursor-move"
                        style={{
                          // measured size when positioned (keeps it from collapsing)
                          width:
                            img.isPositioned && img.size?.width
                              ? `${img.size.width}px`
                              : "auto",
                          height:
                            img.isPositioned && img.size?.height
                              ? `${img.size.height}px`
                              : "auto",

                          // scale when selected (non-positioned)
                          transform: (() => {
                            if (img.isPositioned) {
                              // keep measured size but allow local scale + global UI zoom
                              return `scale(${imgScale * globalScale})`;
                            }
                            // non-positioned: apply global zoom, also allow per-image scale if user set it
                            return `scale(${imgScale * globalScale})`;
                          })(),
                          transformOrigin: "center center",

                          transition:
                            "filter 260ms cubic-bezier(.2,.9,.2,1), transform 160ms ease",

                          // position / absolute layout when 'positioned'
                          position: img.isPositioned ? "absolute" : "relative",
                          left: img.isPositioned ? img.position.x : "auto",
                          top: img.isPositioned ? img.position.y : "auto",

                          touchAction: "none",

                          // <-- IMPORTANT: apply computed CSS filters so adjustments/effects take effect
                          filter: filterStyle,
                          WebkitFilter: filterStyle,
                        }}
                        // inside the <img ... /> props — replace the current onMouseDown handler with this:
                        onMouseDown={async (e) => {
                          // Prevent the outer click handler from selecting the page
                          e.stopPropagation();
                          e.preventDefault();

                          const containerRect =
                            e.currentTarget.parentElement.getBoundingClientRect();
                          const imgRect =
                            e.currentTarget.getBoundingClientRect();

                          // measured displayed size BEFORE we switch to absolute positioning
                          const measuredWidth = Math.round(imgRect.width);
                          const measuredHeight = Math.round(imgRect.height);

                          // click position relative to container (unscaled coords)
                          const clickX = e.clientX - containerRect.left;
                          const clickY = e.clientY - containerRect.top;

                          // desired image top-left so image centers under cursor
                          const desiredLeft = Math.round(
                            clickX - measuredWidth / 2
                          );
                          const desiredTop = Math.round(
                            clickY - measuredHeight / 2
                          );

                          setImageList((prev) =>
                            prev.map((it) => {
                              if (it.id !== img.id) return it;

                              // If already positioned: only update the position (don't overwrite size)
                              if (it.isPositioned) {
                                return {
                                  ...it,
                                  position: { x: desiredLeft, y: desiredTop },
                                };
                              }

                              // First time: set isPositioned and record measured size so it doesn't collapse
                              return {
                                ...it,
                                isPositioned: true,
                                position: { x: desiredLeft, y: desiredTop },
                                size: {
                                  width: measuredWidth,
                                  height: measuredHeight,
                                },
                              };
                            })
                          );

                          // start dragging using the same helper you already wrote
                          startImageDrag(img.id, e, {
                            x: desiredLeft,
                            y: desiredTop,
                          });
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          showStatusMessage("Image failed to load", true);
                        }}
                      />
                    ) : (
                      <div className="text-gray-500 text-2xl">
                        Image not available
                      </div>
                    )}

                    <div
                      className="absolute inset-0"
                      style={{ pointerEvents: "none" }}
                    >
                      {img.annotations.map((ann) => {
                        const isActive =
                          activeAnnotation &&
                          activeAnnotation.imageId === img.id &&
                          activeAnnotation.ann.id === ann.id;
                        return (
                          <div
                            key={ann.id}
                            data-ann-id={ann.id}
                            className="absolute"
                            style={{
                              left: ann.left,
                              top: ann.top,
                              pointerEvents: "auto",
                              cursor: "text",
                              userSelect: "text",
                              zIndex: isActive ? 40 : 20,
                              maxWidth: "80%",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImageId(img.id);
                              setActiveAnnotation({ imageId: img.id, ann });
                            }}
                          >
                            <div
                              ref={(el) => {
                                if (el) {
                                  annotationRefs.current[ann.id] = el;
                                  if (annotationFocusRef.current !== ann.id) {
                                    el.innerText = ann.text || "";
                                  }
                                } else {
                                  delete annotationRefs.current[ann.id];
                                }
                              }}
                              contentEditable
                              suppressContentEditableWarning
                              onInput={(e) => {
                                onAnnotationInputBuffered(img.id, ann.id, e);
                              }}
                              onFocus={(e) => {
                                annotationFocusRef.current = ann.id;
                                annotationEditBufferRef.current[ann.id] =
                                  e.currentTarget.innerText || "";
                              }}
                              onBlur={(e) => {
                                annotationFocusRef.current = null;
                                onAnnotationBlurCommit(img.id, ann.id, e);
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                              }}
                              style={{
                                fontSize: ann.fontSize,
                                color: ann.color,
                                fontWeight: ann.fontWeight || "400",
                                textDecoration: ann.textDecoration || "none",
                                fontFamily: ann.fontFamily || "inherit",
                                textAlign: ann.textAlign || "left",
                                textShadow: "0 2px 6px rgba(0,0,0,0.6)",
                                outline: isActive
                                  ? "2px dashed rgba(255,255,255,0.12)"
                                  : "none",
                                padding: 6,
                                background: "transparent",
                                minWidth: 30,
                                display: "block",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                cursor: "text",
                              }}
                            />

                            {isActive && (
                              <div
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  marginTop: 6,
                                  alignItems: "center",
                                  pointerEvents: "auto",
                                }}
                              >
                                <button
                                  onMouseDown={(e) => startDrag(img.id, ann, e)}
                                  title="Drag"
                                  className="px-2 py-1 bg-gray-700 rounded text-sm"
                                >
                                  Drag
                                </button>
                                <input
                                  type="color"
                                  value={ann.color}
                                  title="Text color"
                                  onChange={(ev) =>
                                    onAnnotationColorChange(
                                      img.id,
                                      ann.id,
                                      ev.target.value
                                    )
                                  }
                                  style={{
                                    width: 36,
                                    height: 28,
                                    padding: 0,
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                  }}
                                />
                                <button
                                  onMouseDown={(e) =>
                                    startResize(img.id, ann, e)
                                  }
                                  title="Drag to resize"
                                  className="px-2 py-1 bg-gray-700 rounded text-sm"
                                >
                                  Resize
                                </button>
                                <button
                                  onClick={() =>
                                    onDeleteAnnotationImmediate(img.id, ann.id)
                                  }
                                  title="Delete text"
                                  className="px-2 py-1 bg-red-600 rounded text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-gray-700 mt-4" />
                </div>
              );
            })}

            <input
              ref={addAfterInputRef}
              id="file-upload-add-after"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAddImageAfterFile}
            />
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto px-6 pb-6 pt-2 flex-shrink-0">
          <div className="w-full max-w-4xl mx-auto mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-4 bg-gray-900/80 p-2 rounded-xl">
              <span className="text-sm text-gray-400 w-10 text-right">
                {selectedImageId
                  ? Math.round(
                      (imageList.find((i) => i.id === selectedImageId)?.scale ||
                        1) * 100
                    )
                  : imageZoom}
                %
              </span>
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={
                  // if an image is selected, show the *selected image* scale as percentage
                  selectedImageId
                    ? Math.round(
                        (imageList.find((i) => i.id === selectedImageId)
                          ?.scale || 1) * 100
                      )
                    : imageZoom
                }
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (selectedImageId) {
                    // set only the selected image's scale (val is percent)
                    setImageList((prev) =>
                      prev.map((img) =>
                        img.id === selectedImageId
                          ? { ...img, scale: val / 100 }
                          : img
                      )
                    );
                    // keep global zoom unchanged
                  } else {
                    // no selected image -> adjust global UI zoom
                    setImageZoom(val);
                  }
                }}
                className="w-40 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />

              <div className="flex items-center text-sm text-gray-400">
                <div className="w-40 bg-gray-700 rounded-full h-1.5 mr-1">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full"
                    style={{
                      width: `${
                        (currentPage / Math.max(1, totalPages)) * 100
                      }%`,
                    }}
                  />
                </div>
                <span>
                  pages {currentPage}/{totalPages}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SlidePanel />

      <StatusToast />
    </div>
  );
}
