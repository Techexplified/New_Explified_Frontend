import React, { useState } from "react";
import { Smile } from "lucide-react";

export default function HelpButton() {
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [query, setQuery] = useState("");
  const [showHelpComp, setShowHelpComp] = useState(false);

  // Demo questions – replace or map real data
  const questions = [
    "Where can I see my socials?",
    "Where can I see my socials?",
    "Where can I see my socials?",
    "Where can I see my socials?",
    "Where can I see my socials?",
  ];

  return (
    <div className="fixed bottom-6 right-6">
      <div className="relative">
        {showHelpPopup && (
          <div className="absolute bottom-16 right-0 bg-black text-white p-3 rounded-lg shadow-lg border w-48">
            <div className="text-xs">
              <div className="font-semibold mb-1">Hey! How can I help you?</div>
            </div>
            <div className="absolute bottom-0 right-4 transform translate-y-1">
              <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white"></div>
            </div>
          </div>
        )}
        {showHelpComp && (
          <div className="absolute bottom-16 right-0 bg-black text-white p-3 rounded-lg shadow-lg border w-64">
            {/* Heading */}
            <h2 className="text-center text-sm">Hey ! How may I help you?</h2>
            <h3 className="mt-2 text-center text-lg font-semibold tracking-wide">
              FAQ
            </h3>

            {/* Input */}
            <input
              type="text"
              placeholder="Type here"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mt-4 w-full rounded-md bg-gray-300 px-3 py-2 text-sm text-black
                   placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Question list */}
            <ul className="mt-4">
              {questions.map((q, i) => (
                <li key={i} className="group">
                  <button
                    type="button"
                    className="w-full py-2 text-sm text-white transition-colors
                         hover:text-gray-300 focus:outline-none"
                  >
                    {q}
                  </button>
                  {/* Divider */}
                  {i !== questions.length - 1 && (
                    <div className="h-px w-3/4 mx-auto bg-gray-600" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          onMouseEnter={() => setShowHelpPopup(true)}
          onMouseLeave={() => setShowHelpPopup(false)}
          onClick={() => setShowHelpComp(!showHelpComp)}
          className="border hover:bg-[#23b5b5]  text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <Smile size={24} color="white" />
        </button>
      </div>
    </div>
  );
}
