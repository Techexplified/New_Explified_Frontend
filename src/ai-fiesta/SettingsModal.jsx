import { motion, AnimatePresence } from "framer-motion";
import {
  FaBell,
  FaPalette,
  FaShieldAlt,
  FaSignOutAlt,
  FaUserCog,
  FaKey,
  FaArrowLeft,
  FaEdit,
  FaSave,
  FaTrashAlt,
  FaUnlock,
  FaLock,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useExpli } from "../context/ExpliContext";

/* ==============================
   🌙 SETTINGS MODAL (Unified)
================================= */
export default function SettingsModal({ open, onClose }) {
  const [view, setView] = useState("main"); // main | account | apikeys

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-[#0E0E0E] border border-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 260 }}
          >
            <button
              className="absolute right-4 top-3 text-gray-400 hover:text-red-500 text-xl font-bold"
              onClick={onClose}
            >
              ×
            </button>

            <AnimatePresence mode="wait">
              {view === "main" && (
                <MainSettingsView
                  key="main"
                  onOpenAccount={() => setView("account")}
                  onOpenApiKeys={() => setView("apikeys")}
                />
              )}

              {view === "account" && (
                <AccountSettingsView
                  key="account"
                  onBack={() => setView("main")}
                />
              )}

              {view === "apikeys" && (
                <ApiKeysView key="apikeys" onBack={() => setView("main")} />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -----------------------------
   MAIN SETTINGS PANEL
----------------------------- */
function MainSettingsView({ onOpenAccount, onOpenApiKeys }) {
  const settings = [
    {
      icon: <FaUserCog className="text-[#23B5B5]" />,
      label: "Profile & Account",
      onClick: onOpenAccount,
    },
    {
      icon: <FaPalette className="text-[#23B5B5]" />,
      label: "Appearance",
    },
    {
      icon: <FaBell className="text-[#23B5B5]" />,
      label: "Notifications",
    },
    {
      icon: <FaShieldAlt className="text-[#23B5B5]" />,
      label: "Privacy & Security",
    },
    {
      icon: <FaKey className="text-[#23B5B5]" />,
      label: "Manage API Keys",
      onClick: onOpenApiKeys,
    },
  ];

  return (
    <motion.div
      key="main"
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -60, opacity: 0 }}
      transition={{ type: "spring", damping: 22, stiffness: 260 }}
    >
      <h2 className="text-2xl font-bold text-gray-100 mb-1">Settings</h2>
      <p className="text-xs text-gray-500 mb-4">
        Manage your preferences and integrations
      </p>

      <div className="space-y-2">
        {settings.map((item) => (
          <motion.button
            key={item.label}
            onClick={item.onClick}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-[#161616] border border-[#1E1E1E] text-gray-200 font-semibold hover:bg-[#1A1A1A] transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {item.icon}
            {item.label}
          </motion.button>
        ))}

        <hr className="my-3 border-[#1E1E1E]" />

        <motion.button
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-[#1C1C1C] text-red-500 font-semibold hover:bg-red-900/20 transition border border-[#2A2A2A]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <FaSignOutAlt size={18} />
          Sign Out
        </motion.button>
      </div>
    </motion.div>
  );
}

/* -----------------------------
   ACCOUNT SETTINGS PANEL
----------------------------- */
function AccountSettingsView({ onBack }) {
  const [form, setForm] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    password: "",
  });

  return (
    <motion.div
      key="account"
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -80, opacity: 0 }}
      transition={{ type: "spring", damping: 22, stiffness: 260 }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-[#23B5B5] mb-4"
      >
        <FaArrowLeft size={14} />
        Back
      </button>

      <h2 className="text-xl font-bold text-gray-100 mb-3">
        Profile & Account
      </h2>

      <div className="space-y-3">
        {["name", "email", "password"].map((field) => (
          <div key={field}>
            <label className="block text-xs font-semibold text-gray-400 mb-1 capitalize">
              {field}
            </label>
            <input
              type={field === "password" ? "password" : "text"}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              placeholder={field === "password" ? "••••••••" : ""}
              className="w-full rounded-lg bg-[#161616] border border-[#1E1E1E] px-3 py-2 text-sm text-gray-100 focus:ring-2 focus:ring-[#23B5B5] outline-none"
            />
          </div>
        ))}

        <motion.button
          onClick={() => console.log("Updated:", form)}
          className="w-full mt-4 bg-[#23B5B5] text-black font-semibold py-2 rounded-xl hover:bg-[#1CA3A3] transition shadow"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          Save Changes
        </motion.button>
      </div>
    </motion.div>
  );
}

/* -----------------------------
   API KEYS PANEL (Improved)
----------------------------- */
function ApiKeysView({ onBack }) {
  const { providerKeys, setProviderKeys } = useExpli();

  const models = [
    {
      id: "openai",
      name: "OpenAI (ChatGPT)",
      placeholder: "sk-...",
      color: "text-green-400",
      docs: "https://platform.openai.com/api-keys",
    },
    {
      id: "gemini",
      name: "Google Gemini",
      placeholder: "AIza...",
      color: "text-blue-400",
      docs: "https://aistudio.google.com/app/apikey",
    },
    {
      id: "llama",
      name: "Meta Llama",
      placeholder: "nvapi-...",
      color: "text-blue-500",
      docs: "https://build.nvidia.com/",
    },
    {
      id: "perplexity",
      name: "Perplexity",
      placeholder: "pplx-...",
      color: "text-teal-400",
      docs: "https://www.perplexity.ai/settings/api",
    },
    {
      id: "anthropic",
      name: "Anthropic (Claude)",
      placeholder: "sk-ant-...",
      color: "text-orange-400",
      docs: "https://console.anthropic.com/settings/keys",
    },
    {
      id: "grok",
      name: "xAI (Grok)",
      placeholder: "xai-...",
      color: "text-gray-200",
      docs: "https://console.x.ai/",
    },
    {
      id: "qwen",
      name: "Alibaba Cloud (Qwen)",
      placeholder: "sk-...",
      color: "text-indigo-400",
      docs: "https://bailian.console.aliyun.com/",
    },
  ];

  const [expanded, setExpanded] = useState(null);
  const [status, setStatus] = useState(null);
  const [inputValues, setInputValues] = useState({});

  // Initialize input values from context keys
  useEffect(() => {
    setInputValues(providerKeys || {});
  }, [providerKeys]);

  const handleSave = (id) => {
    const val = inputValues[id]?.trim();

    // Update context (and thus localStorage)
    setProviderKeys((prev) => ({ ...prev, [id]: val }));

    if (val) {
      setStatus({ type: "success", text: `✅ ${id} key saved!` });
    } else {
      setStatus({ type: "info", text: `🗑️ ${id} key removed.` });
    }

    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -40, opacity: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 25 }}
      className="text-gray-100"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-[#23B5B5] mb-5"
      >
        <FaArrowLeft size={14} />
        Back
      </button>

      <h2 className="font-bold text-xl mb-2 text-white">Manage API Keys</h2>
      <p className="text-gray-400 text-sm mb-5">
        Securely add your own API keys. These are stored locally on your device.
      </p>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {models.map((m) => {
          const isExpanded = expanded === m.id;
          const hasKey = !!providerKeys[m.id];

          return (
            <motion.div
              key={m.id}
              layout
              className={`rounded-2xl bg-[#141414] border border-gray-700 overflow-hidden shadow-sm ${
                isExpanded ? "ring-1 ring-[#23B5B5]" : ""
              }`}
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1B1B1B] transition"
                onClick={() => setExpanded(isExpanded ? null : m.id)}
              >
                <div className="flex items-center gap-3">
                  <FaKey className={`${m.color}`} size={16} />
                  <div>
                    <div className="font-semibold text-white">{m.name}</div>
                    <div className="text-xs text-gray-500">
                      {hasKey ? "Active Key Stored" : "No Key Added"}
                    </div>
                  </div>
                </div>
                {hasKey ? (
                  <FaUnlock className="text-green-400" size={14} />
                ) : (
                  <FaLock className="text-gray-500" size={14} />
                )}
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    key="expand"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-700 bg-[#0E0E0E] p-4 space-y-3"
                  >
                    <input
                      type="password"
                      placeholder={`Enter ${m.name} API key`}
                      className="w-full px-3 py-2 rounded-xl border border-gray-600 bg-[#1A1A1A] text-sm text-gray-200 focus:ring-2 focus:ring-[#23B5B5] outline-none"
                      value={inputValues[m.id] || ""}
                      onChange={(e) =>
                        setInputValues((prev) => ({
                          ...prev,
                          [m.id]: e.target.value,
                        }))
                      }
                    />
                    <div className="flex justify-between items-center">
                      <a
                        href={m.docs}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-400 hover:underline"
                      >
                        Get Key &rarr;
                      </a>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(m.id)}
                          className="px-3 py-1.5 text-xs bg-[#23B5B5] text-black rounded-lg font-semibold hover:bg-[#1AA2A2] transition"
                        >
                          Save
                        </button>
                        {hasKey && (
                          <button
                            onClick={() => {
                              setInputValues((prev) => ({
                                ...prev,
                                [m.id]: "",
                              }));
                              setProviderKeys((prev) => ({
                                ...prev,
                                [m.id]: "",
                              }));
                              setStatus({
                                type: "info",
                                text: `🗑️ ${m.id} key removed.`,
                              });
                              setTimeout(() => setStatus(null), 3000);
                            }}
                            className="px-3 py-1.5 text-xs bg-gray-700 text-gray-300 rounded-lg font-semibold hover:bg-gray-600 transition"
                          >
                            <FaTrashAlt
                              size={12}
                              className="inline-block mr-1"
                            />
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {status && (
          <motion.p
            key={status.text}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`text-xs mt-4 ${
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
    </motion.div>
  );
}
