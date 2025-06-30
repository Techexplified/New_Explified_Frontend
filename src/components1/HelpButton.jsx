import React from "react";
import { Smile } from "lucide-react";

export default function HelpButton() {
  const [showHelpPopup, setShowHelpPopup] = React.useState(false);
  return (
    <div className="fixed bottom-6 right-6">
      <div className="relative">
        {showHelpPopup && (
          <div className="absolute bottom-16 right-0 bg-transparent text-white p-3 rounded-lg shadow-lg border w-48">
            <div className="text-xs">
              <div className="font-semibold mb-1">
                Hey! How can I help you?
              </div>
            </div>
            <div className="absolute bottom-0 right-4 transform translate-y-1">
              <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white"></div>
            </div>
          </div>
        )}
        <button
          onMouseEnter={() => setShowHelpPopup(true)}
          onMouseLeave={() => setShowHelpPopup(false)}
          className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <Smile size={24} color="white" />
        </button>
      </div>
    </div>
  );
}