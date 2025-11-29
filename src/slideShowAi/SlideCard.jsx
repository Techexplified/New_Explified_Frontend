import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  Eye,
  MoreHorizontal,
  Copy,
  Trash2,
  ImagePlus,
  MessageSquare,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import PreviewModal from "./PreviewModal";
import { localHeuristicGenerate } from "./generator";

/**
 * PromptModal - portaled modal so backdrop-filter works even when card is transformed
 * Rendered via createPortal to document.body.
 */
function PromptModal({ open, value, onChange, onClose, onGenerate, generating, genError }) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  // allow onChange to accept either value or function (like React setState)
  const handleTag = (tag) => {
    if (typeof onChange === "function") {
      onChange((prev) => (prev ? `${prev}\n${tag}` : tag));
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[480px] max-w-[94%] rounded-2xl p-5 shadow-2xl"
        style={{
          background: "linear-gradient(180deg, rgba(17,17,24,0.94), rgba(10,10,12,0.98))",
          border: "1px solid rgba(167,139,250,0.08)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center rounded-lg"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.06))",
                border: "1px solid rgba(167,139,250,0.06)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-90">
                <path d="M12 5v14" stroke="#c7b3ff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 12h14" stroke="#c7b3ff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div>
              <div className="text-sm font-semibold text-white">Slide prompt</div>
              <div className="text-[12px] text-white/60">Describe what you want for this slide</div>
            </div>
          </div>

          <button onClick={onClose} aria-label="Close prompt" className="rounded-md px-2 py-1 hover:bg-white/6 transition text-white/60">
            ✕
          </button>
        </div>

        <textarea
          autoFocus
          value={value}
          onChange={(e) => (typeof onChange === "function" ? onChange(e.target.value) : null)}
          placeholder="E.g. 'One-slide summary: Product vision, 3 bullets, call-to-action'"
          className="mt-4 w-full min-h-[140px] resize-none rounded-lg p-3 text-sm outline-none placeholder:text-white/35"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
            border: "1px solid rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.92)",
          }}
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {["Summary", "Sales Pitch", "Technical Overview", "Pros & Cons"].map((c) => (
            <button
              key={c}
              onClick={() => handleTag(c)}
              className="text-[12px] px-2.5 py-1 rounded-full border border-white/6 text-white/80 hover:bg-white/4 transition"
              type="button"
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-xs text-white/50">Tip: Be specific for better slides</div>

          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-1.5 rounded-md text-sm hover:bg-white/6 transition text-white/70">
              Cancel
            </button>

            <button
              onClick={() => onGenerate()}
              className="px-4 py-1.5 rounded-md text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(90deg, #7c3aed, #ec4899)",
                boxShadow: "0 8px 24px rgba(124,58,237,0.18)",
              }}
              type="button"
            >
              {generating ? "Generating…" : "Generate"}
            </button>
          </div>
        </div>

        {genError && <div className="mt-3 text-sm text-red-400">{genError}</div>}
      </div>
    </div>,
    document.body
  );
}

/**
 * SlideCard - mostly controlled component:
 * - `slide` prop is the source of truth for slide content
 * - local state used for title/bullets while editing
 * - onChange(updatedSlide) is called whenever the card produces changes
 */
export default function SlideCard({
  slide: initialSlide = null,
  onChange = () => {},
  onMoveUp = () => {},
  onMoveDown = () => {},
  onDuplicate = () => {},
  onDelete = () => {},
  onReplaceImage = () => {},
}) {
  // Defensive default slide shape
  const safeDefault = {
    id: Date.now(),
    title: "Title of Slide",
    bullets: ["Key point one", "Key point two"],
    imageData: null,
    image_query: "abstract blue",
    section: "Overview",
    summary: "A concise, scannable summary that helps reviewers understand the slide at a glance.",
    updatedAt: "Just now",
  };

  // Keep a reference to prop slide (source of truth)
  const slideProp = initialSlide || safeDefault;

  // Local UI states
  const [editingTitle, setEditingTitle] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(null);

  // local editable text fields (kept in sync with prop)
  const [title, setTitle] = useState(slideProp.title || "");
  const [bulletsText, setBulletsText] = useState((slideProp.bullets || []).join("\n"));

  const menuRef = useRef(null);
  const bulletsRef = useRef(null);

  // sync local text fields when parent slide changes (but do not clobber while editing)
  useEffect(() => {
    setTitle(slideProp.title || "");
    setBulletsText((slideProp.bullets || []).join("\n"));
  }, [slideProp.id, slideProp.title, JSON.stringify(slideProp.bullets || [])]);

  useEffect(() => {
    if (!bulletsRef.current) return;
    bulletsRef.current.style.height = "auto";
    bulletsRef.current.style.height = bulletsRef.current.scrollHeight + "px";
  }, [bulletsText]);

  useEffect(() => {
    function onDoc(e) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  // Commit helpers: update parent slide
  function commitTitle() {
    const t = (title || "").trim();
    if (t === (slideProp.title || "")) {
      setEditingTitle(false);
      return;
    }
    const newSlide = { ...slideProp, title: t, updatedAt: "Just now" };
    onChange(newSlide);
    setEditingTitle(false);
  }

  function commitBullets() {
    const bullets = bulletsText.split("\n").map((s) => s.trim()).filter(Boolean);
    if (JSON.stringify(bullets) === JSON.stringify(slideProp.bullets || [])) return;
    const newSlide = { ...slideProp, bullets, updatedAt: "Just now" };
    onChange(newSlide);
  }

  // fetch image via your server proxy (relative path).
  // NOTE: accepts an optional baseSlide to avoid clobbering newer changes
  async function handleReplaceImage(query, baseSlide = slideProp) {
    if (!query) return;
    const placeholderUrl = `https://via.placeholder.com/1200x675.png?text=${encodeURIComponent(query)}`;

    try {
      const resp = await fetch(`/api/image?query=${encodeURIComponent(query)}&size=1200x675`);
      if (!resp.ok) throw new Error(`Image proxy ${resp.status}`);
      const js = await resp.json().catch(() => null);
      const dataUrl = js && js.data ? js.data : null;

      const newSlide = {
        ...baseSlide, // use the provided baseSlide (mergedSlide when available)
        image_query: query,
        imageData: dataUrl || placeholderUrl,
        updatedAt: "Just now",
      };

      // notify parent (parent will persist the returned image in slides array)
      onChange(newSlide);
      // also call external hook (Editor bound a handler with index)
      if (typeof onReplaceImage === "function") onReplaceImage(query);
      return newSlide;
    } catch (err) {
      console.warn("handleReplaceImage: image proxy failed, using placeholder", err);
      const url = placeholderUrl;
      const newSlide = {
        ...baseSlide,
        image_query: query,
        imageData: url,
        updatedAt: "Just now",
      };
      onChange(newSlide);
      if (typeof onReplaceImage === "function") onReplaceImage(query);
      return newSlide;
    }
  }

  // single, canonical generator for this slide
  async function handleGenerateForThisSlide(prompt) {
    if (!prompt || !String(prompt).trim()) {
      setGenError("Please enter a prompt.");
      return;
    }
    setGenerating(true);
    setGenError(null);

    try {
      let generatedSlides = null;

      // 1) try server
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: prompt, slideCount: 1, tone: slideProp.tone || "Neutral" }),
        });
        if (res.ok) {
          const js = await res.json();
          if (js && Array.isArray(js.slides) && js.slides.length) generatedSlides = js.slides;
        } else {
          const txt = await res.text().catch(() => "");
          console.warn("generate server returned", res.status, txt.slice ? txt.slice(0, 400) : txt);
        }
      } catch (err) {
        console.warn("server generate failed:", err);
      }

      // 2) fallback local
      if (!generatedSlides) {
        const slides = localHeuristicGenerate(prompt, 1, slideProp.tone || "Neutral");
        if (Array.isArray(slides) && slides.length) generatedSlides = slides;
      }

      if (!generatedSlides || !generatedSlides.length) {
        setGenError("No content generated.");
        setGenerating(false);
        return;
      }

      // Merge generated content into current slide
      const g = generatedSlides[0];
      const mergedSlide = {
        ...slideProp,
        id: slideProp.id || Date.now(),
        title: g.title || slideProp.title,
        bullets: Array.isArray(g.bullets)
          ? g.bullets
          : g.body_text
          ? String(g.body_text).split(/\n/).slice(0, 6)
          : slideProp.bullets,
        body_text: g.body_text || slideProp.body_text || "",
        speaker_notes: g.speaker_notes || slideProp.speaker_notes || "",
        image_query:
          g.image_query ||
          slideProp.image_query ||
          (g.title || "").split(/\s+/).slice(0, 3).join(" "),
        updatedAt: "Just now",
      };

      // 1) update parent with text changes so UI updates right away
      onChange(mergedSlide);

      // 2) then fetch image for the new image_query (keeps thumbnail in sync)
      if (mergedSlide.image_query) {
        try {
          // pass mergedSlide as the base so the image update merges into the latest generated slide
          await handleReplaceImage(mergedSlide.image_query, mergedSlide);
        } catch (imgErr) {
          console.warn("Image fetch error after generation:", imgErr);
        }
      }

      setPromptOpen(false);
      setPromptValue("");
    } catch (err) {
      console.error("generate error:", err);
      setGenError(String(err.message || err));
    } finally {
      setGenerating(false);
    }
  }

  // Render
  const slide = slideProp; // alias

  return (
    <>
      <motion.li
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.22 }}
        className="group relative flex gap-6 items-start rounded-xl px-6 pt-8 pb-6 bg-gradient-to-b from-white/3 to-transparent border border-white/6 max-w-4xl w-full min-h-[220px] h-auto overflow-visible"
        role="listitem"
        aria-label={`Slide card ${slide.id}`}
      >
        {/* Actions ABOVE the card */}
        <div className="absolute -top-1 right-3 flex items-center gap-2 z-20">
          {/* Give Prompt */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPromptValue(slide?.title || slide?.image_query || "");
              setPromptOpen(true);
            }}
            title="Give prompt"
            aria-label="Give prompt"
            className="w-9 h-8 flex items-center justify-center rounded-md hover:bg-white/10 transition"
          >
            <MessageSquare className="w-4 h-4 text-white" />
          </button>

          {/* Duplicate */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            title="Duplicate"
            aria-label="Duplicate"
            className="w-9 h-8 flex items-center justify-center rounded-md hover:bg-white/10 transition"
          >
            <Copy className="w-4 h-4 text-white" />
          </button>

          {/* Replace image */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const q = prompt("Replace image query", slide.image_query || slide.title || "abstract");
              if (q) handleReplaceImage(q, slide);
            }}
            title="Replace image"
            aria-label="Replace image"
            className="w-9 h-8 flex items-center justify-center rounded-md hover:bg-white/10 transition"
          >
            <ImagePlus className="w-4 h-4 text-white" />
          </button>

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Delete this slide?")) onDelete();
            }}
            title="Delete slide"
            aria-label="Delete slide"
            className="w-9 h-8 flex items-center justify-center rounded-md hover:bg-red-600/20 transition"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Prompt Modal (portaled so blur works while card is transformed) */}
        <PromptModal
          open={promptOpen}
          value={promptValue}
          onChange={setPromptValue}
          onClose={() => setPromptOpen(false)}
          onGenerate={() => handleGenerateForThisSlide(promptValue)}
          generating={generating}
          genError={genError}
        />

        {/* Thumbnail */}
        <div
          className="w-[240px] h-[140px] rounded-md overflow-hidden flex-shrink-0 cursor-pointer shadow-sm relative"
          onClick={() => setPreviewOpen(true)}
          title="Preview slide"
        >
          {slide.imageData ? (
            <img src={slide.imageData} alt={slide.title || "Slide image"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400">
              <div className="text-sm">No image</div>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreviewOpen(true);
            }}
            className="absolute right-3 bottom-3 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition"
            aria-label="Preview slide"
          >
            <Eye className="w-4 h-4 text-white/90" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              {editingTitle ? (
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={commitTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitTitle();
                    if (e.key === "Escape") {
                      setTitle(slide.title || "");
                      setEditingTitle(false);
                    }
                  }}
                  className="w-full bg-transparent border-b border-transparent focus:border-b focus:border-indigo-400 text-lg font-semibold text-white outline-none placeholder:text-white/40"
                  placeholder="Slide title"
                  aria-label="Edit slide title"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <h3
                    onDoubleClick={() => setEditingTitle(true)}
                    className="text-lg font-semibold text-white cursor-text"
                    title="Double-click to edit"
                  >
                    {slide.title}
                  </h3>
                  <div className="text-sm text-white/60">• {slide.section}</div>
                </div>
              )}

              <p className="text-sm text-white/60 mt-2">{slide.summary}</p>

              <textarea
                ref={bulletsRef}
                value={bulletsText}
                onChange={(e) => {
                  setBulletsText(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                onBlur={commitBullets}
                placeholder="Bullet points (one per line)"
                className="mt-3 w-full bg-white/6 border border-white/5 rounded p-3 text-sm text-white/90 focus:outline-none min-h-[120px] max-h-[360px] overflow-auto resize-vertical"
                aria-label="Edit bullets"
              />
            </div>
          </div>

          <div className="mt-3 text-[13px] text-white/60 flex items-center gap-3">
            <span className="text-[12px] px-2 py-1 rounded bg-white/3 border border-white/4">
              {slide.section} • 2 min
            </span>
            <span className="text-[12px]">{slide.updatedAt}</span>
          </div>
        </div>
      </motion.li>

      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} slide={slide} />
    </>
  );
}
