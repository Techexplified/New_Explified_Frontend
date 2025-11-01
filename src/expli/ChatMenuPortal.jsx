import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function ChatMenuPortal({ position, onClose, children }) {
  const ref = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return createPortal(
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        zIndex: 9999,
      }}
      onMouseLeave={onClose} // ✅ Auto-close when cursor leaves menu
      className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl"
    >
      {children}
    </div>,
    document.body
  );
}
