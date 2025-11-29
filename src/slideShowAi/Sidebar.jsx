import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Sidebar.jsx (updated background to match AutoDeckCenter)
const PANEL_W = 260;
const STRIP_W = 48;

const backdropVariant = {
  hidden: { opacity: 0, pointerEvents: "none" },
  visible: { opacity: 1, pointerEvents: "auto" },
};

const panelVariant = {
  closed: { x: -PANEL_W + STRIP_W, transition: { type: "spring", stiffness: 300, damping: 30 } },
  open: { x: 0, transition: { type: "spring", stiffness: 260, damping: 24 } },
};

const listVariants = {
  open: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const itemVariants = {
  open: { opacity: 1, x: 0, y: 0 },
  closed: { opacity: 0, x: -8, y: 6 },
};

export default function Sidebar({ compact = false }) {
  const [open, setOpen] = useState(!compact);
  const toggleRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => searchRef.current?.focus(), 160);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open && toggleRef.current) toggleRef.current.focus();
  }, [open]);

  const history = Array.from({ length: 8 }).map((_, i) => ({ id: i + 1, title: `Deck Title ${i + 1}` }));

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30"
            variants={backdropVariant}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          >
            <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.aside
        className="fixed left-0 top-0 bottom-0 z-40 w-[260px]"
        variants={panelVariant}
        initial={open ? "open" : "closed"}
        animate={open ? "open" : "closed"}
        transition={{}}
        style={{
          boxShadow: "0 8px 30px rgba(2,6,23,0.5)",
          // radial background to match AutoDeckCenter
          background: "radial-gradient(ellipse at top right, rgba(0,0,0,1) 0%, rgba(17,24,39,1) 45%, rgba(11,11,11,1) 100%)",
        }}
      >
        {/* note: kept inner classes for spacing & text colors */}
        <div className="h-full text-white flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="px-5 pt-5 flex items-center gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    // Example: create new chat action
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/6 hover:bg-white/10 px-3 py-2 text-sm backdrop-blur-sm"
                  aria-label="New chat"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-medium">New</span>
                </button>

                <div className="ml-2 text-xs text-white/60">Quick actions</div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="ml-auto p-2 rounded-md hover:bg-white/5"
                aria-label="Close sidebar"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Search */}
            <div className="px-5 mt-4">
              <label className="relative block">
                <span className="sr-only">Search</span>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-80">
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </span>
                <input
                  ref={searchRef}
                  type="search"
                  placeholder="Search decks, slides... (Ctrl/Cmd+K)"
                  className="w-full rounded-lg bg-white/5 placeholder:text-white/50 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/10"
                />
              </label>
            </div>

            <div className="px-5 mt-5 text-xs text-white/60 uppercase tracking-wide">Recent decks</div>

            <nav className="px-2 mt-3 overflow-auto" style={{ maxHeight: "58vh" }}>
              <motion.ul variants={listVariants} initial={false} animate={open ? "open" : "closed"} className="space-y-2 px-3 py-2">
                {history.map((h, i) => (
                  <motion.li
                    key={h.id}
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                    className="group rounded-lg p-2 flex items-center gap-3 cursor-pointer hover:bg-white/4"
                    onClick={() => {
                      // select deck action
                    }}
                  >
                    <div className="w-9 h-9 rounded-md bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-sm font-semibold text-white">
                      {String(h.id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{h.title}</div>
                      <div className="text-xs text-white/60 truncate">Updated 2 days ago</div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white/60 text-xs">View</div>
                  </motion.li>
                ))}

                {/* CTA: create new deck */}
                <motion.li variants={itemVariants} className="mt-3">
                  <button
                    onClick={() => {
                      /* new deck */
                    }}
                    className="w-full rounded-lg border border-white/6 py-2 text-sm hover:bg-white/6"
                  >
                    + Create deck
                  </button>
                </motion.li>
              </motion.ul>
            </nav>
          </div>

          {/* Footer */}
          <div className="px-4 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-green-600 flex items-center justify-center text-black font-bold">KY</div>
              <div className="flex-1">
                <div className="text-sm font-medium">Kashish Yadav</div>
                <div className="text-xs text-white/60">Free account • Member</div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 rounded-md hover:bg-white/5" title="Settings">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.3 17.88l.06-.06A1.65 1.65 0 0 0 2.7 15.99 1.65 1.65 0 0 0 1.36 14.2H1a2 2 0 1 1 0-4h.36c.48-1.2 1.61-2.07 2.92-2.07.6 0 1.17.16 1.66.45A1.65 1.65 0 0 0 8.09 5.8H8.5a2 2 0 1 1 4 0h.41c.16 0 .32.02.47.06.5.2 1.06.31 1.65.31 1.31 0 2.44.86 2.92 2.07H23a2 2 0 1 1 0 4h-.36c-.69 0-1.34.28-1.81.74z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <button className="p-2 rounded-md bg-white/6 hover:bg-white/10 text-sm">Upgrade</button>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Collapsed strip */}
      <AnimatePresence>
        {!open && (
          <motion.div
            className="fixed left-0 top-0 bottom-0 z-50 w-[48px] flex flex-col items-center justify-between py-4"
            initial={{ x: -8, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -8, opacity: 0 }}
            style={{
              background: "radial-gradient(ellipse at top right, rgba(0,0,0,1) 0%, rgba(17,24,39,1) 45%, rgba(11,11,11,1) 100%)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex flex-col items-center gap-3 w-full">
              <button
                ref={toggleRef}
                onClick={() => setOpen(true)}
                className="w-10 h-10 rounded-full bg-white/6 hover:scale-105 transform transition-transform"
                aria-label="Open sidebar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="mt-2 w-full px-2">
                <div className="w-full h-[1px] bg-white/6 rounded" />
              </div>
            </div>

            <div className="mb-2">
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-emerald-400 to-green-600 text-black font-bold">KY</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
