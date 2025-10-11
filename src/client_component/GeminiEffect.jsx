import React from "react";
import { motion, useAnimation } from "framer-motion";

// Simple SVG path animation for a Gemini-like effect
const paths = [
  "M10 30 Q 50 5, 90 30 T 170 30",
  "M10 50 Q 50 25, 90 50 T 170 50",
  "M10 70 Q 50 45, 90 70 T 170 70"
];

export default function GeminiEffect({ onClose }) {
  return (
    <div className="relative w-full flex flex-col items-center justify-center py-4">
      <div className="absolute right-4 top-2 z-10">
        <button
          onClick={onClose}
          className="bg-black/60 hover:bg-black/80 text-white rounded-full p-1 shadow transition"
          aria-label="Close Gemini Effect"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 6L14 14M14 6L6 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <svg width="100%" height="90" viewBox="0 0 180 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="#14b8a6"
            strokeWidth={i === 1 ? 3 : 2}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 + i, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            opacity={0.7 - i * 0.2}
          />
        ))}
      </svg>
    </div>
  );
}
