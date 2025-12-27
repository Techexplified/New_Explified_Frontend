// client/src/components/SlideList.jsx
import React, { useState } from "react";
import SlideCard from "./SlideCard";
import PreviewModal from "./PreviewModal";

/**
 * Simple parent wiring for demo / integration
 * Replace storage logic with your existing state management.
 */
export default function SlideList({ initialSlides = [] }) {
  const [slides, setSlides] = useState(initialSlides.length ? initialSlides : [
    { id: 1, title: "Intro", bullets: ["Goal", "Why it matters"], imageData: null, image_query: "blue abstract" },
    { id: 2, title: "Results", bullets: ["Metric A", "Metric B"], imageData: null, image_query: "charts" },
  ]);

  const [previewSlide, setPreviewSlide] = useState(null);

  function updateSlide(updated) {
    setSlides(s => s.map(sl => (sl.id === updated.id ? { ...sl, ...updated } : sl)));
  }

  function replaceImage(id, query) {
    // placeholder: in real app call image API -> set imageData as data URL
    const mock = `https://via.placeholder.com/800x450.png?text=${encodeURIComponent(query)}`;
    setSlides(s => s.map(sl => (sl.id === id ? { ...sl, image_query: query, imageData: mock } : sl)));
  }

  function duplicateSlide(id) {
    setSlides(s => {
      const idx = s.findIndex(x => x.id === id);
      if (idx === -1) return s;
      const copy = { ...s[idx], id: Date.now() };
      const next = [...s.slice(0, idx + 1), copy, ...s.slice(idx + 1)];
      return next;
    });
  }

  function deleteSlide(id) {
    if (!confirm("Delete this slide?")) return;
    setSlides(s => s.filter(x => x.id !== id));
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <ul role="list" className="space-y-4">
        {slides.map((slide, i) => (
          <SlideCard
            key={slide.id}
            slide={slide}
            index={i}
            onChange={(up) => updateSlide(up)}
            onMoveUp={() => setSlides(s => {
              if (i === 0) return s;
              const a = [...s];
              [a[i - 1], a[i]] = [a[i], a[i - 1]];
              return a;
            })}
            onMoveDown={() => setSlides(s => {
              if (i === s.length - 1) return s;
              const a = [...s];
              [a[i], a[i + 1]] = [a[i + 1], a[i]];
              return a;
            })}
            onReplaceImage={(q) => replaceImage(slide.id, q)}
            onDuplicate={() => duplicateSlide(slide.id)}
            onDelete={() => deleteSlide(slide.id)}
            onPreview={() => setPreviewSlide(slide)}
          />
        ))}
      </ul>

      <PreviewModal
        open={!!previewSlide}
        slide={previewSlide || {}}
        onClose={() => setPreviewSlide(null)}
      />
    </div>
  );
}
