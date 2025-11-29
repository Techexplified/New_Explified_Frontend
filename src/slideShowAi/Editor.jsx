// client/src/components/Editor.jsx
import React from "react";
import SlideCard from "./SlideCard";

export default function Editor({
  slides,
  setSlides,
  replaceImage,
  updateSlide, // optional: prefer this if provided
  moveUp,
  moveDown,
}) {
  // If parent provided updateSlide use it, otherwise fallback to setSlides
  const update = (i, slide) => {
    if (typeof updateSlide === "function") {
      updateSlide(i, slide);
    } else {
      setSlides((s) => s.map((x, idx) => (idx === i ? slide : x)));
    }
  };

  if (!Array.isArray(slides)) return null;

  // remove slide at index i
  const handleDelete = (i) => {
    setSlides((s) => {
      // defensive: ensure index valid
      if (i < 0 || i >= s.length) return s;
      const copy = [...s];
      copy.splice(i, 1);
      return copy;
    });
  };

  // duplicate slide at index i (insert duplicate right after original)
  const handleDuplicate = (i) => {
    setSlides((s) => {
      if (i < 0 || i >= s.length) return s;
      const copy = [...s];
      const original = copy[i];
      const dup = {
        ...original,
        id: Date.now() + Math.floor(Math.random() * 1000), // new id
        title: (original.title || "") + " (copy)",
        updatedAt: "Just now",
      };
      copy.splice(i + 1, 0, dup);
      return copy;
    });
  };

  // wire replaceImage to accept (index, query)
  const handleReplaceImage = (i, query) => {
    if (typeof replaceImage === "function") replaceImage(i, query);
  };

  return (
    // NOTE: no max-h, no overflow-auto here — let the page height grow
    <div className="flex flex-col w-full items-stretch space-y-4">
      {slides.length === 0 && (
        <div className="text-sm text-slate-400">No slides — generate a deck from the prompt.</div>
      )}

      {slides.map((sl, i) => (
        <SlideCard
          key={sl.id ?? i}
          slide={sl}
          onChange={(ns) => update(i, ns)}
          onMoveUp={() => moveUp(i)}
          onMoveDown={() => moveDown(i)}
          onReplaceImage={(q) => handleReplaceImage(i, q)}
          onDelete={() => handleDelete(i)}
          onDuplicate={() => handleDuplicate(i)}
        />
      ))}
    </div>
  );
}
