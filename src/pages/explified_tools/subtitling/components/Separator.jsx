import React from "react";

function Separator() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
      <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
    </div>
  );
}

export default Separator;
