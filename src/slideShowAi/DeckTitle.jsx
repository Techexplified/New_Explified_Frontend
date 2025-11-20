import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  RotateCcw,
  Trash2,
  Eye,
  Copy,
  X,
} from "lucide-react";

// DeckTitle Revamp
// - Matches Sidebar theme: dark gradient surfaces, indigo->pink badges, subtle glassy borders
// - Uses framer-motion for smooth, professional animations
// - TailwindCSS + framer-motion required

const containerVariants = {
  hidden: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.36, ease: "easeOut" } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8, scale: 0.995 },
  enter: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.26, ease: "easeOut" } },
  hover: { scale: 1.01 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  enter: { opacity: 1, scale: 1, transition: { duration: 0.26, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.18 } },
};

export default function DeckTitle() {
  const slides = [1, 2, 3];
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setShowModal(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function openPreview(s) {
    setSelectedSlide(s);
    setShowModal(true);
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-[#0b0b0b] flex items-center justify-center p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="enter"
        exit="exit"
        className="w-full max-w-[960px] bg-gradient-to-b from-[#0b0b0b] to-[#070707] rounded-[12px] border border-white/4 shadow-[0_8px_30px_rgba(2,6,23,0.6)] relative overflow-hidden"
      >
        {/* Header */}
        <div className="pt-6 px-8 md:px-10">
          <div className="flex items-center">
            <button aria-label="back" className="w-9 h-9 rounded-full flex items-center justify-center mr-4 text-white/90 bg-white/2 backdrop-blur-sm hover:bg-white/4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>

            <h1 className="flex-1 text-center text-[28px] md:text-[32px] font-extrabold tracking-tight text-white">
              TITLE OF DECK
            </h1>

            <div className="w-9 h-9 mr-2 flex items-center justify-center">
              {/* placeholder for symmetric spacing */}
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="px-8 md:px-10 pb-8 pt-6">
          <h2 className="text-[18px] font-semibold text-white/90 mb-5">Review Content</h2>

          {/* Slides List */}
          <div className="space-y-3">
            {slides.map((s, idx) => {
              const isSelected = selectedSlide === s;
              return (
                <motion.div
                  key={s}
                  variants={itemVariants}
                  initial="hidden"
                  animate="enter"
                  whileHover="hover"
                  className="w-full"
                >
                  <div
                    onClick={() => setSelectedSlide(s)}
                    className={`relative flex items-start gap-3 rounded-[10px] px-3 py-3 bg-gradient-to-b from-[#0f0f0f] to-[#0b0b0b] transition-colors cursor-pointer ${
                      isSelected ? "ring-2 ring-indigo-400/30 shadow-[0_8px_24px_rgba(99,102,241,0.06)]" : "border border-white/6"
                    }`}
                  >
                    {/* Left icon rail */}
                    <div className="flex flex-col items-center gap-2 pt-1">
                      <button className="w-7 h-7 rounded-md flex items-center justify-center text-white/70 hover:text-white bg-white/2 hover:bg-white/4 transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                      <button className="w-7 h-7 rounded-md flex items-center justify-center text-white/70 hover:text-white bg-white/2 hover:bg-white/4 transition-colors">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button className="w-7 h-7 rounded-md flex items-center justify-center text-white/70 hover:text-red-400 bg-white/2 hover:bg-white/4 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Thumbnail */}
                    <div className="w-[120px] h-[62px] bg-[#171717] rounded-sm flex items-center justify-center relative overflow-hidden border border-white/6">
                      <div className="w-[92px] h-[44px] bg-[#bdbdbd] rounded-sm" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openPreview(s);
                        }}
                        className="absolute right-2 bottom-2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors"
                        aria-label={`Preview slide ${s}`}
                      >
                        <Eye className="w-4 h-4 text-white/90" />
                      </button>
                    </div>

                    {/* Text content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="text-[14px] font-semibold text-white leading-none">Title of Slide</h3>
                        <button className="w-8 h-8 rounded-md flex items-center justify-center text-white/70 hover:text-white bg-white/2 hover:bg-white/4 transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-3">
                        <div className="border-t border-dotted border-[#2b2b2b] pt-2 text-[13px] text-white/70 leading-tight">
                          Content Overview — concise summary that helps reviewers quickly scan what this slide contains.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* + Add slide separator */}
                  {idx < slides.length - 1 && (
                    <div className="flex items-center justify-center mt-3">
                      <div className="flex-grow border-t border-[#2b2b2b] max-w-[180px]" />
                      <div className="px-2 text-[11px] text-white/60">+ Add slide</div>
                      <div className="flex-grow border-t border-[#2b2b2b] max-w-[180px]" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Bottom chevron indicator */}
          <div className="w-full flex justify-center mt-6">
            <div className="w-6 h-1 bg-[#2b2b2b] rounded-full" />
          </div>

          {/* Footer buttons */}
          <div className="w-full flex items-center justify-center gap-6 mt-6">
            <motion.button whileHover={{ scale: 1.02 }} className="min-w-[150px] px-6 py-2 rounded-full border border-[rgba(167,139,250,0.16)] text-[rgba(167,139,250,0.9)] font-semibold text-sm hover:bg-white/4 transition-colors">
              Change Tone
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} className="min-w-[150px] px-6 py-2 rounded-full border-2 border-gradient-to-tr from-indigo-500 to-pink-500 text-white bg-gradient-to-br from-[rgba(167,139,250,0.12)] to-transparent font-semibold text-sm hover:brightness-95 transition-all shadow-sm">
              Proceed
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Slide Preview Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setShowModal(false)}
          >
            {/* overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* modal box */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="enter"
              exit="exit"
              onMouseDown={(e) => e.stopPropagation()}
              className="relative z-10 w-[780px] max-w-[95%] h-[440px] bg-gradient-to-b from-[#0b0b0b] to-[#060606] rounded-2xl border border-white/6 p-6 flex flex-col items-center shadow-2xl"
            >
              {/* close button */}
              <button
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white bg-white/2 transition-colors"
                onClick={() => setShowModal(false)}
                aria-label="Close preview"
              >
                <X className="w-4 h-4" />
              </button>

              {/* title */}
              <div className="text-white text-[18px] mb-3">Slide {selectedSlide}</div>

              {/* slide mock */}
              <div className="w-full flex-1 rounded-lg bg-[#000] flex items-center justify-center p-4">
                <div className="w-full max-w-[90%] h-[300px] bg-[#e6e6e6] rounded-sm relative">
                  {/* small expand handle bottom-right */}
                  <div className="absolute right-2 bottom-2 w-8 h-8 rounded bg-transparent flex items-center justify-center text-black/60">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M9 9L15 15M15 9v6H9" stroke="#111" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
