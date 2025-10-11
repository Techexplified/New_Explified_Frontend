import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

// A glowing orb that pulses and responds to the `speaking` prop
export default function GeminiOrbEffect({ speaking = false, onClose }) {
  const controls = useAnimation();
  const pulseControls = useAnimation();
  const orbRef = useRef(null);

  useEffect(() => {
    if (speaking) {
      controls.start({
        scale: [1, 1.15, 1],
        boxShadow: [
          "0 0 40px 10px #14b8a6, 0 0 80px 20px #0fffc0, 0 0 0px 0px #fff0",
          "0 0 80px 30px #14b8a6, 0 0 120px 40px #0fffc0, 0 0 20px 10px #fff8",
          "0 0 40px 10px #14b8a6, 0 0 80px 20px #0fffc0, 0 0 0px 0px #fff0"
        ],
        transition: { duration: 1.2, repeat: Infinity, repeatType: "loop" }
      });
      pulseControls.start({
        opacity: [0.5, 1, 0.5],
        transition: { duration: 1.2, repeat: Infinity, repeatType: "loop" }
      });
    } else {
      controls.start({
        scale: 1,
        boxShadow: "0 0 40px 10px #14b8a6, 0 0 80px 20px #0fffc0, 0 0 0px 0px #fff0",
        transition: { duration: 0.5 }
      });
      pulseControls.start({
        opacity: 0.5,
        transition: { duration: 0.5 }
      });
    }
  }, [speaking, controls, pulseControls]);

  return (
    <div className="relative flex flex-col items-center justify-center py-6">
      <div className="absolute right-4 top-2 z-10">
        <button
          onClick={onClose}
          className="bg-black/60 hover:bg-black/80 text-white rounded-full p-1 shadow transition"
          aria-label="Close Gemini Orb Effect"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 6L14 14M14 6L6 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <motion.div
        ref={orbRef}
        animate={controls}
        initial={{ scale: 1, boxShadow: "0 0 40px 10px #14b8a6, 0 0 80px 20px #0fffc0, 0 0 0px 0px #fff0" }}
        className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 via-cyan-300 to-blue-500 shadow-2xl flex items-center justify-center relative"
        style={{ boxShadow: "0 0 40px 10px #14b8a6, 0 0 80px 20px #0fffc0, 0 0 0px 0px #fff0" }}
      >
        <motion.div
          animate={pulseControls}
          initial={{ opacity: 0.5 }}
          className="absolute inset-0 rounded-full bg-white/10 pointer-events-none"
        />
        <svg width="80" height="80" viewBox="0 0 80 80" className="z-10">
          <defs>
            <radialGradient id="orbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#14b8a6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0fffc0" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          <circle cx="40" cy="40" r="32" fill="url(#orbGlow)" />
          <ellipse cx="40" cy="50" rx="18" ry="6" fill="#fff" fillOpacity="0.08" />
        </svg>
      </motion.div>
      <div className="mt-4 text-center text-teal-200 text-lg font-medium select-none">
        Gemini AI
      </div>
    </div>
  );
}
