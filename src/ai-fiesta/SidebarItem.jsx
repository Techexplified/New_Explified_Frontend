import React from "react";

export default function SidebarItem({
  icon: Icon,
  label,
  active,
  onClick,
  className = "",
  dot,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center w-full py-3 hover:bg-[#1a1a1a] rounded-xl 
      transition relative group ${
        active ? "text-[#23b5b5]" : "text-gray-400"
      } ${className}`}
    >
      <Icon
        className={`mx-auto ${
          active ? "text-[#23b5b5]" : "text-gray-400 group-hover:text-[#23b5b5]"
        }`}
        size={20}
      />
      <span
        className={`text-[11px] mt-1 ${
          active
            ? "font-semibold text-[#23b5b5]"
            : "text-gray-500 group-hover:text-[#23b5b5]"
        }`}
      >
        {label}
      </span>
      {dot && (
        <span className="absolute left-3 top-3 h-2 w-2 rounded-full bg-pink-500"></span>
      )}
    </button>
  );
}
