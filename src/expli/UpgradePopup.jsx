import React from "react";

function UpgradePopup() {
  return (
    <div className="absolute bottom-8 -translate-x-1/2  w-64 bg-[#111] text-gray-300 p-4 rounded-xl border border-gray-700 shadow-xl animate-fadeIn z-50">
      <h3 className="font-semibold text-white mb-2">Research</h3>
      <p className="text-sm mb-2">Deep research on any topic</p>
      <hr className="border-gray-700 my-2" />
      <p className="text-sm text-[#23b5b5] font-medium mb-1">
        Extended access for subscribers
      </p>
      <p className="text-sm mb-3">
        Reports with more sources, charts, reasoning.
      </p>
      <p className="text-sm mb-3">3 queries remaining today</p>
      <button className="w-full bg-[#23b5b5] hover:bg-[#1fa0a0] text-black font-medium rounded-lg py-2 transition">
        Upgrade to Pro
      </button>
    </div>
  );
}

export default UpgradePopup;
