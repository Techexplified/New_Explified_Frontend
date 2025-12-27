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
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../utils/auth_slice/UserSlice";
import { useNavigate } from "react-router-dom";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
          onClick={() => {
            dispatch(clearUser());
            localStorage.removeItem("explified");
            navigate("/login");
          }}
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
  const user = useSelector((state) => state.user);

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
        {[
          { label: "name", value: user?.name || "John Doe" },
          { label: "email", value: user?.email || "john.doe@example.com" },
        ].map((field) => (
          <div key={field.label}>
            <label className="block text-xs font-semibold text-gray-400 mb-1 capitalize">
              {field.label}
            </label>
            <div className="w-full rounded-lg bg-[#161616] border border-[#1E1E1E] px-3 py-2 text-sm text-gray-100">
              {field.value}
            </div>
          </div>
        ))}

        <motion.button
          className="w-full mt-4 bg-[#23B5B5] text-black font-semibold py-2 rounded-xl hover:bg-[#1CA3A3] transition shadow"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          Edit Profile
        </motion.button>
      </div>
    </motion.div>
  );
}

/* -----------------------------
   API KEYS PANEL (Improved)
----------------------------- */
function ApiKeysView({ onBack }) {
  const models = [
    {
      id: "openai",
      name: "OpenAI",
      pattern: /^sk-[A-Za-z0-9]{20,}$/,
      color: "text-blue-400",
    },
    {
      id: "gemini",
      name: "Gemini",
      pattern: /^AIza[0-9A-Za-z\-_]{35}$/,
      color: "text-amber-400",
    },
    {
      id: "replicate",
      name: "Replicate",
      pattern: /^r8_[A-Za-z0-9_]{30,}$/,
      color: "text-green-400",
    },
  ];

  const [keys, setKeys] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const loaded = {};
    models.forEach((m) => {
      const stored = localStorage.getItem(`apiKey_${m.id}`);
      if (stored) loaded[m.id] = stored;
    });
    setKeys(loaded);
  }, []);

  const saveKey = (id, value) => {
    const model = models.find((m) => m.id === id);
    if (!value) {
      setStatus({ type: "info", text: "🔑 API key removed." });
      localStorage.removeItem(`apiKey_${id}`);
      setKeys((prev) => ({ ...prev, [id]: "" }));
      return;
    }
    if (model.pattern.test(value)) {
      localStorage.setItem(`apiKey_${id}`, value);
      setKeys((prev) => ({ ...prev, [id]: value }));
      setStatus({ type: "success", text: "✅ Key saved successfully!" });
    } else {
      setStatus({ type: "error", text: "❌ Invalid API key format." });
    }
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
        Securely add or remove your API keys for each provider.
      </p>

      <div className="space-y-3">
        {models.map((m) => {
          const isExpanded = expanded === m.id;
          const hasKey = !!keys[m.id];

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
                      value={keys[m.id] || ""}
                      onChange={(e) =>
                        setKeys((prev) => ({
                          ...prev,
                          [m.id]: e.target.value,
                        }))
                      }
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => saveKey(m.id, keys[m.id])}
                        className="px-3 py-1.5 text-xs bg-[#23B5B5] text-black rounded-lg font-semibold hover:bg-[#1AA2A2] transition"
                      >
                        Save
                      </button>
                      {hasKey && (
                        <button
                          onClick={() => saveKey(m.id, "")}
                          className="px-3 py-1.5 text-xs bg-gray-700 text-gray-300 rounded-lg font-semibold hover:bg-gray-600 transition"
                        >
                          <FaTrashAlt size={12} className="inline-block mr-1" />
                          Remove
                        </button>
                      )}
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
