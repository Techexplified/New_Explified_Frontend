import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChartLine, FaBrain, FaStickyNote } from "react-icons/fa";

export default function ToolsPopover({ visible }) {
  const tools = [
    {
      label: "Dashboard",
      icon: FaChartLine,
      url: "/dashboard",
    },
    { label: "Memory", icon: FaBrain, url: "/memory" },
    { label: "Notes", icon: FaStickyNote, url: "/notes" },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -12, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -12, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute left-14 top-0 z-50 bg-gradient-to-br from-[#101010] to-[#1b1b1b]
          border border-[#23b5b5]/40 rounded-2xl p-3 w-48 shadow-[0_0_20px_#23b5b530] backdrop-blur-xl"
        >
          <div className="absolute -left-2 top-5 w-3 h-3 bg-[#101010] border-l border-t border-[#23b5b5]/40 rotate-45"></div>

          <p className="text-gray-400 text-xs mb-2 ml-1 tracking-wide">
            Quick Tools
          </p>

          {tools.map((tool) => (
            <motion.a
              key={tool.label}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                scale: 1.05,
                backgroundColor: "#181818",
                boxShadow: "0 0 12px #23b5b540",
              }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 text-gray-300 hover:text-[#23b5b5] rounded-lg px-3 py-2 transition"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#23b5b5]/10 text-white hover:text-[#23b5b5]">
                <tool.icon size={14} />
              </div>
              <span className="text-sm font-medium">{tool.label}</span>
            </motion.a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
