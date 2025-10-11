import React from "react";

// Linear glowing effect, blending into the background, inspired by the user's image
export default function GeminiLiveGlow({ onClose }) {
  return (
    <div className="relative w-full flex flex-col items-center justify-center py-2">
      {/* Close button */}
      <div className="absolute right-4 top-2 z-10">
        <button
          onClick={onClose}
          className="bg-black/60 hover:bg-black/80 text-white rounded-full p-1 shadow transition"
          aria-label="Close Gemini Live Effect"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 6L14 14M14 6L6 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {/* Linear glowing bar at the bottom */}
      <div className="relative w-full flex items-end justify-center h-16">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-2xl h-10 pointer-events-none select-none">
          {/* Main linear glow */}
          <div className="w-full h-full animate-gemini-glow rounded-full bg-gradient-to-r from-[#6ee7f7] via-[#a78bfa] to-[#818cf8] opacity-70 blur-2xl" style={{mixBlendMode:'screen'}} />
          {/* Subtle secondary glow */}
          <div className="w-full h-full absolute top-0 left-0 animate-gemini-glow2 rounded-full bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#818cf8] opacity-40 blur-3xl" style={{mixBlendMode:'screen'}} />
        </div>
      </div>
    </div>
  );
}

// Tailwind CSS animations (add to your global CSS if not present):
// .animate-gemini-glow {
//   animation: gemini-glow 2.5s ease-in-out infinite alternate;
// }
// .animate-gemini-glow2 {
//   animation: gemini-glow2 3.2s ease-in-out infinite alternate;
// }
// @keyframes gemini-glow {
//   0% { filter: blur(32px) brightness(1); transform: scaleX(1) scaleY(1); }
//   100% { filter: blur(48px) brightness(1.2); transform: scaleX(1.08) scaleY(1.12); }
// }
// @keyframes gemini-glow2 {
//   0% { filter: blur(48px) brightness(0.9); transform: scaleX(1) scaleY(1); }
//   100% { filter: blur(64px) brightness(1.1); transform: scaleX(1.12) scaleY(1.18); }
// }
