import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock } from "react-icons/fa";
import { aiModelDetails } from "./aiModelDetails";

export default function ModelPreferencesModal({ open, onClose, onUpdateModels }) {
  const [modelStates, setModelStates] = useState(
    aiModelDetails.map((m) => ({
      ...m,
      enabled: m.id === "perplexity" ? true : !m.locked,
    }))
  );

  const [selectedModel, setSelectedModel] = useState(null);
  const [apiKeys, setApiKeys] = useState({});
  const [status, setStatus] = useState(null);

  // Load stored API keys
  useEffect(() => {
    const keys = {};
    aiModelDetails.forEach((m) => {
      const stored = localStorage.getItem(`apiKey_${m.id}`);
      if (stored) keys[m.id] = stored;
    });
    setApiKeys(keys);
  }, []);

  // Key validation (Gemini-specific)
  function validateKey(modelId, key) {
    if (modelId === "gemini") return /^AIza[0-9A-Za-z\-_]{35}$/.test(key);
    return key.length > 10;
  }

  function handleAddKey(modelId, key) {
    if (validateKey(modelId, key)) {
      localStorage.setItem(`apiKey_${modelId}`, key);
      setApiKeys((prev) => ({ ...prev, [modelId]: key }));
      setStatus({ type: "success", text: "✅ API key saved successfully!" });
    } else {
      setStatus({ type: "error", text: "❌ Invalid API key format." });
    }
  }

  function handleRemoveKey(modelId) {
    localStorage.removeItem(`apiKey_${modelId}`);
    setApiKeys((prev) => ({ ...prev, [modelId]: "" }));
    setStatus({ type: "info", text: "🔑 API key removed." });
  }

  function handleDropdownChange(idx, value) {
    setModelStates((state) =>
      state.map((m, i) => (i === idx ? { ...m, current: value } : m))
    );
  }

  function handleToggle(idx) {
    setModelStates((state) =>
      state.map((m, i) =>
        i === idx
          ? m.id === "perplexity"
            ? m
            : m.locked
            ? m
            : { ...m, enabled: !m.enabled }
          : m
      )
    );
  }

  function handleUpdate() {
    const enabledModels = modelStates.filter((m) => m.enabled);
    onUpdateModels(enabledModels);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Container */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 overflow-hidden"
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
          >
            {/* Close */}
            <button
              className="absolute right-4 top-3 text-gray-400 hover:text-red-500 font-bold text-xl"
              onClick={onClose}
            >
              ×
            </button>

            <h2 className="font-bold text-2xl mb-1 text-gray-900">
              Customize your chat AI model preferences
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Easily update your selections anytime in the settings.
            </p>

            {/* Model List */}
            <div className="space-y-2 relative">
              {modelStates.map((m, i) => (
                <motion.div
                  key={m.id}
                  onClick={() => setSelectedModel(m)}
                  className={`relative flex items-center gap-2 p-2 rounded-xl bg-gray-50 transition-all cursor-pointer ${
                    m.locked && m.id !== "perplexity"
                      ? "opacity-60 pointer-events-none"
                      : "hover:bg-indigo-50"
                  }`}
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white shadow mr-2">
                    {m.icon}
                  </div>

                  <div className="flex flex-col flex-1">
                    <span className="font-semibold text-gray-900 text-sm">
                      {m.name}
                    </span>
                    <span className="text-xs text-gray-500">{m.desc}</span>
                  </div>

                  <select
                    className="min-w-[100px] px-2 py-1 rounded-xl border border-gray-300 text-gray-800 shadow-sm bg-white"
                    value={m.current}
                    onChange={(e) => handleDropdownChange(i, e.target.value)}
                    disabled={m.locked && m.id !== "perplexity"}
                  >
                    {m.dropdown.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>

                  {m.locked && m.id !== "perplexity" ? (
                    <span className="h-5 w-5 flex items-center justify-center rounded-full border border-gray-300 bg-white ml-2">
                      <FaLock className="text-gray-400" size={12} />
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(i);
                      }}
                      className={`ml-2 w-10 h-5 flex items-center rounded-full transition-colors shadow ${
                        m.enabled ? "bg-indigo-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                          m.enabled ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Update Preferences Button */}
            <button
              onClick={handleUpdate}
              className="w-full mt-5 py-2 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition shadow"
            >
              Update preferences
            </button>

            {/* Upgrade Section */}
            <div className="w-full mt-3 flex flex-col items-center bg-gray-100 rounded-xl p-3">
              <div className="font-semibold mb-1 text-black">
                Upgrade and Unlock Premium AI Models
              </div>
              <div className="text-xs text-gray-600 text-center">
                Access all six top AI models for just{" "}
                <span className="font-semibold">$12/month</span>.
              </div>
            </div>

            {/* 🔒 Centered API Key Panel */}
            <AnimatePresence>
              {selectedModel && (
                <motion.div
                  key={selectedModel.id}
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{ type: "spring", stiffness: 250, damping: 25 }}
                  className={`absolute top-[4%] right-0 w-full sm:w-[380px] h-[92%] ${
                    selectedModel.id === "gemini"
                      ? "bg-[#0E0E0E] text-white"
                      : "bg-[#1A1A1A] text-gray-200"
                  } shadow-2xl rounded-l-2xl py-3 px-5 flex flex-col justify-center z-50`}
                > 
                  <h3 className="text-lg font-semibold mb-3">
                    {selectedModel.name} API Settings
                  </h3>

                  <label className="text-sm font-semibold mb-1">
                    {selectedModel.name} API Key
                  </label>

                  <input
                    type="password"
                    placeholder={`Enter ${selectedModel.name} API key`}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      selectedModel.id === "gemini"
                        ? "border-gray-700 bg-[#121212] text-white"
                        : "border-gray-600 bg-[#2A2A2A] text-white"
                    } text-sm focus:outline-none focus:ring-2 focus:ring-[#1d9a9a] mb-3`}
                    value={apiKeys[selectedModel.id] || ""}
                    onChange={(e) =>
                      setApiKeys((prev) => ({
                        ...prev,
                        [selectedModel.id]: e.target.value,
                      }))
                    }
                  />

                  <div className="flex justify-between">
                    <button
                      onClick={() =>
                        handleAddKey(selectedModel.id, apiKeys[selectedModel.id] || "")
                      }
                      className="px-3 py-1.5 text-sm font-semibold bg-[#23b5b5] text-white rounded-xl hover:bg-[#1a7777] transition"
                    >
                      Save Key
                    </button>
                    <button
                      onClick={() => handleRemoveKey(selectedModel.id)}
                      className="px-3 py-1.5 text-sm font-semibold bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition"
                    >
                      Remove Key
                    </button>
                  </div>

                  <AnimatePresence>
                    {status && (
                      <motion.p
                        key={status.text}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className={`text-xs mt-2 ${
                          status.type === "success"
                            ? "text-green-400"
                            : status.type === "error"
                            ? "text-red-400"
                            : "text-gray-400"
                        }`}
                      >
                        {status.text}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    className="mt-auto text-sm text-gray-300 hover:underline"
                    onClick={() => setSelectedModel(null)}
                  >
                    ← Back to preferences
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
