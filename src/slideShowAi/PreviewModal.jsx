// client/src/components/PreviewModal.jsx
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * PreviewModal
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - slide: { title, bullets: string[], imageData, section }
 *
 * Renders a faithful, large preview of the slide: image (top), title, bullets,
 * and a small actions panel. Accessible (Esc to close, aria attributes).
 */

export default function PreviewModal({ open, onClose, slide = {} }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose && onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 bg-black/65" />

          <motion.div
            onMouseDown={(e) => e.stopPropagation()}
            initial={{ y: 16, opacity: 0, scale: 0.99 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative z-10 w-[960px] max-w-[94%] max-h-[92vh] rounded-2xl bg-gradient-to-b from-[#071115] to-[#040406] border border-white/6 shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              aria-label="Close preview"
              className="absolute right-4 top-4 z-20 w-10 h-10 rounded-lg flex items-center justify-center text-white/80 bg-white/3 hover:bg-white/5 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 flex flex-col md:flex-row gap-6 max-h-[88vh]">
              {/* Left: visual slide render (what the slide will look like) */}
              <div className="flex-1 min-w-0 flex items-center justify-center">
                <div className="w-full max-w-[720px] h-[460px] bg-white/90 rounded-md overflow-hidden shadow-inner flex flex-col">
                  {/* Image */}
                  {slide.imageData ? (
                    <img
                      src={slide.imageData}
                      alt={slide.title || "Slide image"}
                      className="w-full h-[58%] object-cover"
                    />
                  ) : (
                    <div className="w-full h-[58%] bg-slate-200 flex items-center justify-center text-slate-600">
                      No image
                    </div>
                  )}

                  <div className="p-6 flex-1 overflow-auto bg-white/90">
                    <h2 className="text-xl font-semibold text-slate-900">{slide.title || "Untitled slide"}</h2>
                    {slide.section && <div className="text-sm text-slate-700 mt-1">Section · {slide.section}</div>}

                    <div className="mt-3 space-y-2 text-slate-800">
                      {(slide.bullets || []).length ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {(slide.bullets || []).map((b, i) => (
                            <li key={i} className="leading-5">{b}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-700/90">No bullet points — this is a visual preview of the slide layout.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: metadata + actions */}
              <div className="w-full max-w-[320px]">
                <div className="rounded-lg p-4 bg-white/3 border border-white/5">
                  <div className="text-white text-sm font-semibold mb-2">Slide preview</div>
                  <div className="text-sm text-white/80 mb-4">This modal shows a faithful representation of the slide at real size.</div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        // Example: in-app open (user can hook this to navigation)
                        // For pure preview, leave as no-op or close
                        onClose && onClose();
                      }}
                      className="px-4 py-2 rounded-md bg-gradient-to-tr from-indigo-600 to-pink-500 text-white font-semibold"
                    >
                      Open slide
                    </button>

                    <button
                      onClick={() => {
                        if (slide.title || (slide.bullets && slide.bullets.length)) {
                          const text = `${slide.title || ""}\n\n${(slide.bullets || []).join("\n")}`;
                          navigator.clipboard?.writeText(text).then(() => {
                            /* silently copied */
                          });
                        }
                      }}
                      className="px-4 py-2 rounded-md bg-white/6 text-white"
                    >
                      Copy contents
                    </button>

                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-transparent border border-white/6 text-white">
                      Close
                    </button>
                  </div>

                  <div className="mt-4 text-[13px] text-white/60">
                    <div className="mb-2 font-medium">Notes</div>
                    <div className="text-sm">Image, heading and bullets are rendered in the same arrangement users will see when exported or presented.</div>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
