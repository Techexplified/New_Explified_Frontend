import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MonitorPlay,
  ChevronDown,
  ArrowRight,
  Layout,
  Zap,
  X,
  Download,
  RefreshCcw,
  Layers,
  Share2,
  Palette,
  FileText,
  Check,
  Trash2,
  Copy,
  Image as ImageIcon,
} from "lucide-react";

import { localHeuristicGenerate } from "./generator";
import { exportSlidesToPptx, exportSlidesToPdf } from "./pptx";

/* ---------------------------------------------------
   THEME + STEPS
--------------------------------------------------- */
const THEME_HEX = "#158b8b";

const STEPS = [
  { id: "prepare", label: "Context" },
  { id: "generate", label: "Structure" },
  { id: "images", label: "Assets" },
  { id: "finalize", label: "Finalizing" },
];

/* ---------------------------------------------------
   API BASE URL (ENV + FALLBACK)
--------------------------------------------------- */
const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || "http://localhost:4000";

/* ---------------------------------------------------
   IMAGE HELPERS
--------------------------------------------------- */
const TRANSPARENT_PNG_DATAURL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVQIW2P8z/C/HwAGgwJ/lq0nNwAAAABJRU5ErkJggg==";

function isTransparentFallback(dataUrl) {
  return !dataUrl || dataUrl === TRANSPARENT_PNG_DATAURL;
}

async function fetchImageDataForSlide(query) {
  const baseQuery = (query || "abstract").trim();
  const variants = [
    baseQuery,
    `${baseQuery} photo`,
    `${baseQuery} illustration`,
    `${baseQuery} infographic`,
    `${baseQuery} diagram`,
  ];

  async function callServer(q) {
    try {
      const resp = await fetch(
        `${API_BASE_URL}/api/image?query=${encodeURIComponent(
          q
        )}&size=1200x800`
      );
      if (!resp.ok) {
        console.warn("Image endpoint failed:", resp.status, resp.statusText);
        return null;
      }
      const js = await resp.json();
      return js && js.data
        ? {
            data: js.data,
            source: js.source || null,
            warning: js.warning || null,
          }
        : null;
    } catch (err) {
      console.warn("image fetch failed for", q, err);
      return null;
    }
  }

  for (let i = 0; i < variants.length; i++) {
    const q = variants[i];
    const result = await callServer(q);
    if (!result) continue;
    if (result.warning === "image_fetch_failed") continue;
    if (isTransparentFallback(result.data)) continue;
    return result.data;
  }

  const lastTry = await callServer(baseQuery);
  return lastTry ? lastTry.data : null;
}

/* ---------------------------------------------------
   SERVER GENERATE
--------------------------------------------------- */
async function generateSlidesFromServer(prompt, slideCount, toneArg) {
  try {
    const r = await fetch(`${API_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, slideCount, tone: toneArg }),
    });
    if (!r.ok) {
      console.warn("Server generate failed, status:", r.status);
      return { slides: localHeuristicGenerate(prompt, slideCount, toneArg) };
    }
    const data = await r.json();
    return data;
  } catch (err) {
    console.warn("Generate request failed, falling back to local:", err);
    return { slides: localHeuristicGenerate(prompt, slideCount, toneArg) };
  }
}

/* ---------------------------------------------------
   DIALOGS
--------------------------------------------------- */

const SlidePromptDialog = ({
  isOpen,
  value,
  onChange,
  onClose,
  onConfirm,
  slideTitle,
  loading, // loader state
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-md bg-[#05080a] border border-slate-800 rounded-2xl shadow-2xl p-5"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-[#111827] border border-slate-800 text-[11px] text-slate-300">
                  <Sparkles size={12} className="text-[#158b8b]" />
                  <span>Prompt this slide with AI</span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-white">
                  Refine slide content
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Describe what you want this slide to say. Be specific about
                  tone, audience, and key points.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                disabled={loading}
              >
                <X size={16} />
              </button>
            </div>

            {/* Slide title hint */}
            {slideTitle && (
              <div className="mb-3 text-[11px] text-slate-400">
                <span className="uppercase tracking-wide text-slate-500">
                  Editing:
                </span>{" "}
                <span className="font-medium text-slate-200">
                  {slideTitle}
                </span>
              </div>
            )}

            {/* Textarea */}
            <div className="mb-4">
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full min-h-[110px] max-h-[220px] text-sm bg-[#020712] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 outline-none focus:ring-1 focus:ring-[#158b8b] focus:border-[#158b8b] resize-vertical placeholder:text-slate-600"
                placeholder="e.g. Rewrite this slide to be concise, executive-level, and highlight 3 key metrics."
                disabled={loading}
              />
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={!loading ? onConfirm : undefined}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-md text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: THEME_HEX }}
              >
                {loading ? (
                  <RefreshCcw size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                <span>{loading ? "Generating…" : "Regenerate slide"}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ImageQueryDialog = ({
  isOpen,
  value,
  onChange,
  onClose,
  onConfirm,
  slideTitle,
  currentQuery,
  loading, // loader for image replace
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-md bg-[#05080a] border border-slate-800 rounded-2xl shadow-2xl p-5"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-[#111827] border border-slate-800 text-[11px] text-slate-300">
                  <ImageIcon size={12} className="text-[#158b8b]" />
                  <span>Replace slide image</span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-white">
                  Choose a new image
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Describe the visual you want. You can specify style (photo,
                  illustration, diagram) and key elements.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <X size={16} />
              </button>
            </div>

            {/* Slide / current query hint */}
            <div className="mb-3 space-y-1">
              {slideTitle && (
                <div className="text-[11px] text-slate-400">
                  <span className="uppercase tracking-wide text-slate-500">
                    Slide:
                  </span>{" "}
                  <span className="font-medium text-slate-200">
                    {slideTitle}
                  </span>
                </div>
              )}
              {currentQuery && (
                <div className="text-[11px] text-slate-500">
                  <span className="uppercase tracking-wide">Current:</span>{" "}
                  <span className="text-slate-300">{currentQuery}</span>
                </div>
              )}
            </div>

            {/* Textarea */}
            <div className="mb-4">
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full min-h-[90px] max-h-[200px] text-sm bg-[#020712] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 outline-none focus:ring-1 focus:ring-[#158b8b] focus:border-[#158b8b] resize-vertical placeholder:text-slate-600"
                placeholder='e.g. "Modern flat illustration of people collaborating on analytics dashboard in teal/blue theme"'
                disabled={loading}
              />
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={!loading ? onConfirm : undefined}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-md text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: THEME_HEX }}
              >
                {loading ? (
                  <RefreshCcw size={14} className="animate-spin" />
                ) : (
                  <ImageIcon size={14} />
                )}
                <span>{loading ? "Replacing…" : "Replace image"}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------------------------------------------------
   MockEditor – now with dialogs + loaders
--------------------------------------------------- */

const MockEditor = ({ slides, setSlides, onClose, onExport, setStatus }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = slides[activeSlide] || {};

  const [promptLoading, setPromptLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // Dialog state: Prompt
  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [promptModalValue, setPromptModalValue] = useState("");
  const [promptModalIndex, setPromptModalIndex] = useState(null);

  // Dialog state: Image
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageDialogValue, setImageDialogValue] = useState("");
  const [imageDialogIndex, setImageDialogIndex] = useState(null);

  // DELETE SLIDE (still using confirm for now)
  const handleDeleteSlide = (index) => {
    if (!window.confirm("Delete this slide?")) return;
    setSlides((prev) => {
      const next = prev.filter((_, i) => i !== index);
      let newActive = activeSlide;
      if (index === activeSlide) {
        newActive = Math.min(index, next.length - 1);
      } else if (index < activeSlide) {
        newActive = activeSlide - 1;
      }
      setActiveSlide(newActive < 0 ? 0 : newActive);
      return next;
    });
  };

  // DUPLICATE SLIDE
  const handleDuplicateSlide = (index) => {
    setSlides((prev) => {
      if (!prev[index]) return prev;
      const copy = [...prev];
      const newSlide = { ...prev[index] };
      copy.splice(index + 1, 0, newSlide);
      return copy;
    });
    setActiveSlide(index + 1);
  };

  /* ---------- Prompt dialog handlers ---------- */

  const handlePromptSlide = (index) => {
    const current = slides[index];
    const defaultPrompt =
      current?.title && current.title.length
        ? `Rewrite this slide about "${current.title}" with clearer structure and strong messaging`
        : "One-slide summary of this topic with clear bullets and speaker notes";

    setPromptModalIndex(index);
    setPromptModalValue(defaultPrompt);
    setPromptModalOpen(true);
  };

  const confirmPromptForSlide = async () => {
    if (promptModalIndex == null) return;
    const current = slides[promptModalIndex];
    const prompt = promptModalValue.trim();
    if (!prompt) return;

    setPromptLoading(true);
    if (setStatus) setStatus("Regenerating slide…");
    try {
      const tone = current.tone || "Professional";
      const data = await generateSlidesFromServer(prompt, 1, tone);
      const arr = data.slides || data;
      const raw = Array.isArray(arr) ? arr[0] : arr;

      const q =
        (raw && (raw.image_query || raw.title)) ||
        prompt.split(" ").slice(0, 3).join(" ");

      let imageData = null;
      try {
        imageData = await fetchImageDataForSlide(q);
      } catch (err) {
        console.warn("image fetch for single slide failed", err);
      }

      const newSlide = {
        ...current,
        title: (raw && raw.title) || current.title || "",
        bullets:
          raw && Array.isArray(raw.bullets) && raw.bullets.length
            ? raw.bullets
            : current.bullets || [],
        body_text: (raw && raw.body_text) || current.body_text || "",
        speaker_notes:
          (raw && raw.speaker_notes) || current.speaker_notes || "",
        image_query: q,
        imageData: imageData || current.imageData || null,
        tone,
      };

      setSlides((prev) =>
        prev.map((s, i) => (i === promptModalIndex ? newSlide : s))
      );
      setPromptModalOpen(false);
      setPromptModalIndex(null);
    } catch (err) {
      console.error("prompt slide regenerate error:", err);
      if (setStatus) setStatus("Failed to regenerate this slide.");
    } finally {
      setPromptLoading(false);
      if (setStatus) setStatus("");
    }
  };

  /* ---------- Image dialog handlers ---------- */

  const handleReplaceImage = (index) => {
    const current = slides[index];
    const defaultQuery =
      current?.image_query ||
      current?.title ||
      "abstract illustration of this slide";

    setImageDialogIndex(index);
    setImageDialogValue(defaultQuery);
    setImageDialogOpen(true);
  };

  const confirmImageForSlide = async () => {
    if (imageDialogIndex == null) return;
    const query = imageDialogValue.trim();
    if (!query) return;

    setImageLoading(true);
    if (setStatus) setStatus("Replacing image…");
    try {
      const dataUrl = await fetchImageDataForSlide(query);
      if (dataUrl) {
        setSlides((prev) =>
          prev.map((s, i) =>
            i === imageDialogIndex
              ? { ...s, imageData: dataUrl, image_query: query }
              : s
          )
        );
      } else {
        if (setStatus) setStatus("No image found for that query.");
      }
    } catch (err) {
      console.warn("image fetch for single slide failed", err);
      if (setStatus) setStatus("Failed to replace image.");
    } finally {
      setImageLoading(false);
      setImageDialogOpen(false);
      setImageDialogIndex(null);
      if (setStatus) setStatus("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex flex-col bg-[#05080a] text-slate-300"
    >
      {/* Dialogs */}
      <SlidePromptDialog
        isOpen={promptModalOpen}
        value={promptModalValue}
        onChange={setPromptModalValue}
        onClose={() => {
          if (promptLoading) return;
          setPromptModalOpen(false);
          setPromptModalIndex(null);
        }}
        onConfirm={confirmPromptForSlide}
        slideTitle={slide.title}
        loading={promptLoading}
      />

      <ImageQueryDialog
        isOpen={imageDialogOpen}
        value={imageDialogValue}
        onChange={setImageDialogValue}
        onClose={() => {
          if (imageLoading) return;
          setImageDialogOpen(false);
          setImageDialogIndex(null);
        }}
        onConfirm={confirmImageForSlide}
        slideTitle={slide.title}
        currentQuery={slide.image_query}
        loading={imageLoading}
      />

      {/* Editor Header */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0B0F17]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <div className="w-6 h-6 rounded bg-[#158b8b] flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span>AutoDeck Editor</span>
          </div>
          <span className="text-slate-600 text-sm">/</span>
          <span className="text-slate-400 text-sm">
            {slide.title || "Untitled Presentation"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white">
            <Share2 size={16} />
          </button>

          <button
            onClick={onClose}
            className="ml-2 p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Editor Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Sidebar (Slide Strip) */}
        <div className="w-52 border-r border-slate-800 bg-[#0d1117] overflow-y-auto p-3 space-y-3">
          {slides.map((s, i) => (
            <div
              key={i}
              className={`relative aspect-[4/3] rounded-md p-2 border transition-all group cursor-pointer ${
                activeSlide === i
                  ? "bg-[#158b8b]/10 border-[#158b8b]"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              }`}
              onClick={() => setActiveSlide(i)}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[10px] font-bold ${
                    activeSlide === i ? "text-[#158b8b]" : "text-slate-500"
                  }`}
                >
                  {i + 1}
                </span>
              </div>

              <div className="space-y-1.5 opacity-60">
                <div className="h-1.5 w-3/4 bg-slate-500 rounded-sm" />
                <div className="h-1 w-full bg-slate-600 rounded_sm" />
                <div className="h-1 w-2/3 bg-slate-600 rounded-sm" />
              </div>

              {s.title && (
                <div className="mt-2 text-[9px] text-slate-400 line-clamp-2">
                  {s.title}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CENTER: Main Stage */}
        <div className="flex-[1.6] bg-[#05080a] relative flex items-center justify-center p-8">
          {/* The Slide */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-4xl aspect-video bg-white shadow-2xl relative text-slate-900 p-12 flex flex-col"
          >
            <div
              className="absolute top-0 left-0 w-2 h-full"
              style={{ backgroundColor: THEME_HEX }}
            />

            <div className="flex-1">
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2 block">
                Slide {activeSlide + 1}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 leading-tight break-words">
                {slide.title || "Untitled Slide"}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                {/* Text content */}
                <div className="space-y-4 text-slate-700 text-base md:text-lg leading-relaxed">
                  {Array.isArray(slide.bullets) && slide.bullets.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {slide.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  ) : slide.body_text ? (
                    <p>{slide.body_text}</p>
                  ) : (
                    <p className="text-slate-400 text-sm">
                      No content generated yet for this slide.
                    </p>
                  )}

                  {slide.speaker_notes ? (
                    <p className="mt-4 text-xs text-slate-500 border-t border-slate-200 pt-3">
                      Speaker notes: {slide.speaker_notes}
                    </p>
                  ) : null}
                </div>

                {/* Image / Placeholder */}
                <div className="bg-slate-50 border border-slate-100 p-4 flex items-center justify-center">
                  {slide.imageData ? (
                    <img
                      src={slide.imageData}
                      alt={slide.image_query || "Slide visual"}
                      className="max-h-[260px] w-full object-contain rounded"
                    />
                  ) : (
                    <div className="text-center text-slate-400">
                      <div className="mb-2 mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Layout size={24} />
                      </div>
                      <span className="text-xs font-medium">
                        Visual Content Placeholder
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-auto flex justify-between items-end border-t border-slate-100 pt-4">
              <span className="text-[10px] font-semibold text-slate-400">
                AUTODECK GENERATED
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                {activeSlide + 1} / {slides.length}
              </span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Permanent sidebar with actions */}
        <div className="w-40 border-l border-slate-800 bg-[#020712] p-4 space-y-4">
          {/* Slide info */}
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wide">
              Slide {activeSlide + 1}
            </div>
            <div className="text-sm font-semibold text-white mt-1 line-clamp-2">
              {slide.title || "Untitled slide"}
            </div>
          </div>

          {/* Buttons: Prompt (AI), Replace image, Duplicate, Delete */}
          <div className="space-y-2">
            <div className="text-[11px] text-slate-500 uppercase tracking-wide">
              Actions
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handlePromptSlide(activeSlide)}
                disabled={promptLoading}
                className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111827] hover:bg-[#158b8b]/80 text-[12px] text-slate-200 hover:text-white border border-slate-700 hover:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {promptLoading ? (
                  <RefreshCcw size={12} className="animate-spin" />
                ) : (
                  <Sparkles size={12} />
                )}
                <span>{promptLoading ? "Regenerating…" : "Prompt (AI)"}</span>
              </button>
              <button
                type="button"
                onClick={() => handleReplaceImage(activeSlide)}
                disabled={imageLoading}
                className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111827] hover:bg-[#158b8b]/80 text-[12px] text-slate-200 hover:text-white border border-slate-700 hover:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {imageLoading ? (
                  <RefreshCcw size={12} className="animate-spin" />
                ) : (
                  <ImageIcon size={12} />
                )}
                <span>{imageLoading ? "Replacing…" : "Replace image"}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDuplicateSlide(activeSlide)}
                className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111827] hover:bg-[#1f2937] text-[12px] text-slate-200 border border-slate-700 transition-colors"
              >
                <Copy size={12} />
                <span>Duplicate</span>
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSlide(activeSlide)}
                className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111827] hover:bg-red-600/90 text-[12px] text-red-300 hover:text-white border border-red-900/60 transition-colors"
              >
                <Trash2 size={12} />
                <span>Delete</span>
              </button>

              <button
                onClick={onExport}
                className="flex items-center justify-center gap-2 px-3 py-1.5 rounded text-xs font-semibold text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: THEME_HEX }}
              >
                <Download size={14} /> Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ---------------------------------------------------
   Generation Stepper Overlay
--------------------------------------------------- */
const GenerationStepper = ({ currentStepIndex }) => {
  const progress =
    (Math.max(0, currentStepIndex) / (STEPS.length - 1)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#05080a]/95 backdrop-blur-md"
    >
      <div className="w-full max-w-3xl px-8 flex flex-col items-center">
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-16 h-16 bg-[#158b8b]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-[#158b8b]/30"
          >
            <Sparkles size={32} className="text-[#158b8b] animate-pulse" />
          </motion.div>
          <h3 className="text-3xl font-bold text-white tracking-tight">
            Creating your deck
          </h3>
          <p className="text-slate-400 mt-3 text-lg">
            Our AI is weaving your narrative...
          </p>
        </div>

        <div className="relative w-full">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-800/50 rounded-full -z-10" />
          <motion.div
            className="absolute top-5 left-0 h-0.5 bg-[#158b8b] rounded-full -z-10"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          <div className="flex justify-between w-full">
            {STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center relative"
                >
                  <motion.div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-300 bg-[#05080a]
                      ${
                        isCompleted
                          ? "bg-[#158b8b] border-[#158b8b] text-white shadow-[0_0_15px_rgba(21,139,139,0.4)]"
                          : isActive
                          ? "border-[#158b8b] text-[#158b8b]"
                          : "border-slate-700 text-slate-700 bg-[#0B0F17]"
                      }
                    `}
                    animate={
                      isActive
                        ? {
                            boxShadow: [
                              "0 0 0 0px rgba(21,139,139,0)",
                              "0 0 0 6px rgba(21,139,139,0.2)",
                              "0 0 0 0px rgba(21,139,139,0)",
                            ],
                          }
                        : {}
                    }
                    transition={
                      isActive
                        ? {
                            duration: 2,
                            repeat: Infinity,
                          }
                        : {}
                    }
                  >
                    <AnimatePresence mode="wait">
                      {isCompleted ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check size={18} strokeWidth={3} />
                        </motion.div>
                      ) : isActive ? (
                        <motion.div
                          key="loader"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <div className="w-2.5 h-2.5 bg-[#158b8b] rounded-full" />
                        </motion.div>
                      ) : (
                        <span className="text-xs font-semibold">
                          {index + 1}
                        </span>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.span
                    className={`
                      absolute top-14 text-sm font-medium whitespace-nowrap transition-colors duration-300
                      ${
                        isActive
                          ? "text-white"
                          : isCompleted
                          ? "text-[#158b8b]"
                          : "text-slate-600"
                      }
                    `}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {step.label}
                  </motion.span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ---------------------------------------------------
   MAIN COMPONENT – AutoDeckProfessional
--------------------------------------------------- */
export default function AutoDeckProfessional() {
  const [promptText, setPromptText] = useState("");
  const [promptFocused, setPromptFocused] = useState(false);
  const textareaRef = useRef(null);

  const [slidesOpt, setSlidesOpt] = useState("8 Slides");
  const [tone, setTone] = useState("Professional");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [slides, setSlides] = useState([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const slidesOptions = ["5 Slides", "8 Slides", "10 Slides", "12 Slides"];
  const toneOptions = ["Professional", "Creative", "Minimal", "Executive"];

  const quickPrompts = [
    {
      label: "Q3 Business Review",
      icon: <Layout size={14} />,
      prompt:
        "Quarterly business review covering revenue, growth, and key metrics",
    },
    {
      label: "Startup Pitch Deck",
      icon: <Zap size={14} />,
      prompt:
        "Series A pitch deck for a fintech startup focused on security",
    },
    {
      label: "Product Roadmap",
      icon: <Share2 size={14} />,
      prompt: "Product strategy and roadmap for 2025 Q1-Q2",
    },
  ];

  useEffect(() => {
    if (textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [promptText]);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  /* ---------------- HANDLE GENERATE (full deck) ---------------- */
  const handleGenerate = async () => {
    if (!promptText.trim()) return;

    setError("");
    setStatus("");
    setSlides([]);
    setIsGenerating(true);
    setCurrentStepIndex(0);

    try {
      const slideCount = parseInt(slidesOpt) || 8;

      setCurrentStepIndex(0);

      // Step 1 – structure
      setCurrentStepIndex(1);
      setStatus("Generating slide structure…");
      const data = await generateSlidesFromServer(
        promptText,
        slideCount,
        tone
      );
      const s = data.slides || data;
      let normalizedSlides = s;
      if (!Array.isArray(s) || s.length === 0) {
        normalizedSlides = localHeuristicGenerate(
          promptText,
          slideCount,
          tone
        );
      }

      // Step 2 – images
      setCurrentStepIndex(2);
      setStatus("Fetching images for slides…");

      const slidesWithImages = [];
      for (let idx = 0; idx < normalizedSlides.length; idx++) {
        const sl = normalizedSlides[idx];
        const q =
          sl.image_query ||
          sl.title ||
          promptText.split(" ").slice(0, 3).join(" ");

        let imageData = null;
        try {
          imageData = await fetchImageDataForSlide(q);
        } catch (imgErr) {
          console.warn("fetchImageDataForSlide failed for slide", idx, imgErr);
        }

        slidesWithImages.push({
          title: sl.title || "",
          bullets: Array.isArray(sl.bullets) ? sl.bullets : [],
          body_text: sl.body_text || "",
          speaker_notes: sl.speaker_notes || "",
          image_query: q,
          imageData: imageData || null,
          tone,
          designStyle:
            sl.designStyle ||
            (tone === "Creative"
              ? "Creative Magazine"
              : tone === "Professional"
              ? "Corporate Executive"
              : "Minimal"),
          polish: sl.polish === true || false,
        });
      }

      // Step 3 – finalize
      setCurrentStepIndex(3);
      setStatus("Finalizing deck…");
      setSlides(slidesWithImages);
      setStatus("Slides ready. Editor opened.");
    } catch (err) {
      console.error("handleGenerate error:", err);
      setError(err && err.message ? err.message : "Failed to generate slides");
      setStatus("");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    if (!slides.length) return;
    try {
      setStatus("Building PPTX…");
      await exportSlidesToPptx(slides, `Autodeck-${Date.now()}.pptx`);
      setStatus("PPTX download started.");
    } catch (err) {
      console.error("Export PPTX failed:", err);
      setStatus("Failed to export PPTX.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-300 flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-[#158b8b]/30 selection:text-white">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#158b8b]/10 to-transparent opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-[#0f1521] to-transparent" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      {/* Editor Overlay */}
      <AnimatePresence>
        {slides.length > 0 && (
          <MockEditor
            slides={slides}
            setSlides={setSlides}
            onClose={() => setSlides([])}
            onExport={handleExport}
            setStatus={setStatus}
          />
        )}
      </AnimatePresence>

      {/* Generation Stepper */}
      <AnimatePresence>
        {isGenerating && (
          <GenerationStepper currentStepIndex={currentStepIndex} />
        )}
      </AnimatePresence>

      {/* Main UI */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-3xl px-6 flex flex-col items-center"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center px-3 py-1 mb-6 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <Sparkles size={14} className="text-[#158b8b] mr-2" />
            <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">
              AutoDeck AI
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Generate presentations.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
              Instantly professional.
            </span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-lg mx-auto font-light leading-relaxed">
            Turn your notes into polished slides with our enterprise-grade AI
            engine.
          </p>
        </div>

        {/* Input */}
        <div className="w-full relative">
          <div
            className={`
              relative w-full bg-[#111827] border transition-all duration-200 rounded-lg shadow-2xl
              ${
                promptFocused
                  ? "border-[#158b8b] ring-1 ring-[#158b8b]/20 shadow-[0_0_30px_-10px_rgba(21,139,139,0.15)]"
                  : "border-slate-700 hover:border-slate-600"
              }
            `}
          >
            <div className="flex flex-col md:flex-row p-1.5 gap-2">
              {/* Textarea */}
              <div className="flex-1 flex items-start pl-3 py-2">
                <div
                  className={`mr-3 pt-1 transition-colors ${
                    promptFocused ? "text-[#158b8b]" : "text-slate-600"
                  }`}
                >
                  <Sparkles size={24} />
                </div>
                <textarea
                  ref={textareaRef}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  onFocus={() => setPromptFocused(true)}
                  onBlur={() => setPromptFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!isGenerating) handleGenerate();
                    }
                  }}
                  placeholder="Describe the presentation you need..."
                  className="w-full bg-transparent border-none outline-none text-white placeholder:text-slate-500 text-base font-normal resize-none overflow-hidden min-h-[28px] max-h-[200px]"
                  rows={1}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between md:justify-end gap-2 px-2 md:px-0 border-t md:border-t-0 border-slate-800 pt-2 md:pt-0 self-end pb-1.5">
                <div className="flex items-center gap-1">
                  {/* Slides dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown("slides")}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors border
                        ${
                          activeDropdown === "slides"
                            ? "bg-slate-800 text-white border-slate-600"
                            : "bg-transparent text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200"
                        }
                      `}
                    >
                      <span>{slidesOpt}</span>
                      <ChevronDown size={12} />
                    </button>

                    {activeDropdown === "slides" && (
                      <div className="absolute top-full right-0 mt-2 w-32 bg-[#161b27] border border-slate-700 rounded shadow-xl py-1 z-20">
                        {slidesOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => {
                              setSlidesOpt(opt);
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tone dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown("tone")}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors border
                        ${
                          activeDropdown === "tone"
                            ? "bg-slate-800 text-white border-slate-600"
                            : "bg-transparent text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200"
                        }
                      `}
                    >
                      <span>{tone}</span>
                      <ChevronDown size={12} />
                    </button>

                    {activeDropdown === "tone" && (
                      <div className="absolute top-full right-0 mt-2 w-36 bg-[#161b27] border border-slate-700 rounded shadow-xl py-1 z-20">
                        {toneOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => {
                              setTone(opt);
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !promptText.trim()}
                  className={`
                    h-9 px-4 rounded flex items-center justify-center gap-2 text-sm font-semibold transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  style={{
                    backgroundColor: !promptText.trim()
                      ? "#1f2937"
                      : THEME_HEX,
                    color: !promptText.trim() ? "#6b7280" : "#ffffff",
                  }}
                >
                  {isGenerating ? (
                    <RefreshCcw size={14} className="animate-spin" />
                  ) : (
                    <>
                      <span>Generate</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Close dropdown backdrop */}
          {activeDropdown && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => setActiveDropdown(null)}
            />
          )}
        </div>

        {/* Error + Status */}
        {error && (
          <div className="mt-3 w-full text-sm text-red-400 text-center">
            {error}
          </div>
        )}
        {status && !error && (
          <div className="mt-2 w-full text-xs text-slate-400 text-center">
            {status}
          </div>
        )}

        {/* Quick prompts */}
        <div className="mt-12 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickPrompts.map((item, i) => (
            <button
              key={i}
              onClick={() => setPromptText(item.prompt)}
              className="text-left p-4 rounded border border-slate-800 bg-[#111827]/50 hover:bg-[#111827] hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center gap-2 mb-2 text-slate-400 group-hover:text-[#158b8b] transition-colors">
                {item.icon}
                <span className="text-xs font-bold uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-300 transition-colors line-clamp-2">
                {item.prompt}
              </p>
            </button>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
