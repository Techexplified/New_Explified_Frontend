import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Clock,
  Key,
  Check,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  Unplug,
  AlertCircle,
  Sparkles,
  Settings,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_APP_URL || "http://localhost:8000/";

const INTERVAL_OPTIONS = [
  { label: "5 min", value: 5 },
  { label: "10 min", value: 10 },
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "3 hours", value: 180 },
  { label: "6 hours", value: 360 },
];

const STEPS = [
  {
    id: 0,
    title: "Connect Gmail",
    description: "Link your Google account to read emails",
    icon: "https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_48dp.png",
    type: "img",
  },
  {
    id: 1,
    title: "Set Interval",
    description: "Choose how often to check emails",
    icon: null,
    type: "clock",
  },
  {
    id: 2,
    title: "Gemini API Key",
    description: "Enter your Gemini API key for summaries",
    icon: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg",
    type: "img",
  },
  {
    id: 3,
    title: "Connect Telegram",
    description: "Link Telegram to receive summaries",
    icon: null,
    type: "telegram",
  },
];

export default function EmailAutomation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useSelector((state) => state.user);
  const userEmail = user?.email || "";

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  const [gmailConnected, setGmailConnected] = useState(false);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState(5);
  const [geminiKey, setGeminiKey] = useState("");
  const [geminiKeySet, setGeminiKeySet] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [error, setError] = useState("");
  const [editingInterval, setEditingInterval] = useState(false);
  const [selectedInfoStep, setSelectedInfoStep] = useState(null);
  const [editingGeminiKey, setEditingGeminiKey] = useState(false);

  useEffect(() => {
    if (searchParams.get("connected") === "gmail") {
      setGmailConnected(true);
      setCurrentStep(1);
    }
  }, [searchParams]);

  useEffect(() => {
    if (userEmail) {
      fetchStatus();
    } else {
      setStatusLoading(false);
    }
  }, [userEmail]);

  const fetchStatus = async () => {
    if (!userEmail) return;
    try {
      setStatusLoading(true);
      const res = await fetch(
        `${BACKEND_URL}api/email-automation/status/${userEmail}`,
      );

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error("Received non-JSON response from server");
      }

      const data = await res.json();
      if (data.found) {
        setGmailConnected(data.gmailConnected);
        setTelegramConnected(data.telegramConnected);
        setGeminiKeySet(data.geminiKeySet);
        setSelectedInterval(data.intervalMinutes || 5);

        if (
          data.gmailConnected &&
          data.telegramConnected &&
          data.geminiKeySet
        ) {
          setSetupComplete(true);
        } else {
          // Auto-advance logic
          if (data.gmailConnected) {
            if (data.geminiKeySet) {
              setCurrentStep(3); // Go to Telegram
            } else {
              // If Gmail connected, skip Interval (Step 1) and go to Gemini (Step 2)
              // User can click back to Step 1 if needed.
              setCurrentStep(2);
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch status details:", err);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleConnectGmail = () => {
    window.location.href = `${BACKEND_URL}api/email-automation/auth/google`;
  };

  const handleConnectTelegram = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${BACKEND_URL}api/email-automation/connect-telegram?email=${encodeURIComponent(userEmail)}`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      if (data.link) {
        window.open(data.link, "_blank");
        setTimeout(() => {
          setTelegramConnected(true);
        }, 3000);
      }
    } catch (err) {
      setError("Failed to connect Telegram. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInterval = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${BACKEND_URL}api/email-automation/updateIntervalMinutes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: userEmail,
            intervalMinutes: selectedInterval,
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setCurrentStep(2);
      }
    } catch (err) {
      setError("Failed to save interval.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeminiKey = async () => {
    if (!geminiKey.trim()) {
      setError("Please enter your Gemini API key.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `${BACKEND_URL}api/email-automation/updateGeminiApiKey`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: userEmail, geminiApiKey: geminiKey }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setGeminiKeySet(true);
        setCurrentStep(3);
      }
    } catch (err) {
      setError("Failed to save API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (service) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${BACKEND_URL}api/email-automation/disconnect/${service}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: userEmail }),
        },
      );
      const data = await res.json();
      if (data.success) {
        if (service === "gmail") setGmailConnected(false);
        if (service === "telegram") setTelegramConnected(false);
        if (service === "gemini") {
          setGeminiKeySet(false);
          setGeminiKey("");
        }
        setSetupComplete(false);
        setCurrentStep(0); // Reset to start
      }
    } catch (err) {
      setError("Failed to disconnect.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectAll = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${BACKEND_URL}api/email-automation/disconnect-all`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: userEmail }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setGmailConnected(false);
        setTelegramConnected(false);
        setGeminiKeySet(false);
        setGeminiKey("");
        setSetupComplete(false);
        setEditingInterval(false);
        setCurrentStep(0);
      }
    } catch (err) {
      setError("Failed to disconnect service.");
    } finally {
      setLoading(false);
    }
  };

  const isStepComplete = (stepId) => {
    switch (stepId) {
      case 0:
        return gmailConnected;
      case 1:
        return true; // Interval is practically always done
      case 2:
        return geminiKeySet;
      case 3:
        return telegramConnected;
      default:
        return false;
    }
  };

  const renderNodeIcon = (step) => {
    if (step.type === "img") {
      return (
        <img
          src={step.icon}
          alt={step.title}
          className="w-7 h-7 object-contain"
        />
      );
    }
    if (step.type === "clock") {
      return <Clock size={22} className="currentColor" />;
    }
    if (step.type === "telegram") {
      return <Send size={22} className="currentColor" />;
    }
    return null;
  };

  if (statusLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 className="w-8 h-8 text-[#059669] animate-spin" />
          <p>Loading automation status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-6 pl-20 flex justify-center font-sans">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-5 mb-12">
          <button
            onClick={() => navigate("/")}
            className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-gray-400 flex items-center justify-center transition-all hover:bg-[#059669]/10 hover:border-[#059669] hover:text-[#059669] hover:-translate-x-0.5 shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex flex-col items-start">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent m-0">
              Daily Email Updates On Telegram
            </h1>
            <p className="text-gray-500 text-sm mt-1.5">
              Automate email summaries directly to your Telegram
            </p>
          </div>
        </div>

        {/* Workflow Stepper Chain */}
        <div className="flex items-center justify-between mb-24 relative px-10">
          {/* The Line Behind */}
          <div className="absolute top-1/2 left-[60px] right-[60px] h-0.5 bg-[#1a1f2e] -translate-y-1/2 z-0" />

          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              {index > 0 && (
                <div
                  className={`flex-1 h-0.5 mx-1 rounded transition-all duration-300 ${isStepComplete(index) ? "bg-[#059669]" : "bg-[#1a1f2e]"}`}
                />
              )}
              <motion.div
                className={`w-16 h-16 rounded-full bg-black border-4 border-[#1a1f2e] flex items-center justify-center relative z-10 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer shadow-[0_0_0_4px_#000] 
                                    ${currentStep === index && !setupComplete ? "!border-[#dc2626] !bg-black shadow-[0_0_0_4px_#000,0_0_0_8px_rgba(220,38,38,0.15),0_0_20px_rgba(220,38,38,0.4)]" : ""} 
                                    ${isStepComplete(index) ? "!border-[#059669] !bg-black" : ""}
                                    hover:-translate-y-1 hover:scale-110 hover:border-[#333]`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() =>
                  setupComplete
                    ? setSelectedInfoStep(
                        selectedInfoStep === index ? null : index,
                      )
                    : setCurrentStep(index)
                }
                whileHover={{ scale: 1.12, y: -6 }}
                whileTap={{ scale: 0.95 }}
              >
                {isStepComplete(index) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Checkmark removed, just border */}
                  </div>
                )}
                <div
                  className={`
                                    ${currentStep === index && !setupComplete ? "text-[#dc2626] drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]" : "text-gray-400"} 
                                    ${isStepComplete(index) ? "!text-[#059669] drop-shadow-[0_0_8px_rgba(5,150,105,0.4)]" : ""}
                                `}
                >
                  {renderNodeIcon(step)}
                </div>
              </motion.div>
            </React.Fragment>
          ))}
        </div>

        {/* Setup Complete State */}
        {setupComplete ? (
          <motion.div
            className="py-5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Status Banner */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-br from-[#059669]/15 to-[#059669]/5 border border-[#059669]/40 rounded-full text-[#059669] font-bold text-[15px] mb-2 shadow-[0_8px_30px_-4px_rgba(5,150,105,0.5)]">
                <Sparkles size={20} />
                <span>Automation Active</span>
              </div>
              <p className="text-gray-500 text-sm">
                Your email summaries are being sent to Telegram every{" "}
                {selectedInterval < 60
                  ? `${selectedInterval} minutes`
                  : `${selectedInterval / 60} hour${selectedInterval > 60 ? "s" : ""}`}
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Tap any icon above to view its status
              </p>
            </div>

            {/* Clicked Icon Status Card */}
            <AnimatePresence mode="wait">
              {selectedInfoStep !== null && (
                <motion.div
                  key={selectedInfoStep}
                  className="mb-6 p-4 bg-[#059669]/5 border border-[#059669]/20 rounded-2xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#059669]/10 flex items-center justify-center">
                      {renderNodeIcon(STEPS[selectedInfoStep])}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-white m-0">
                        {STEPS[selectedInfoStep].title}
                      </p>
                      <p className="text-xs text-[#059669] mt-0.5 flex items-center gap-1">
                        <Check size={12} />
                        {selectedInfoStep === 0 && "Gmail Connected"}
                        {selectedInfoStep === 1 &&
                          `Interval: ${selectedInterval < 60 ? `${selectedInterval} min` : `${selectedInterval / 60}h`}`}
                        {selectedInfoStep === 2 && "Gemini API Key Set"}
                        {selectedInfoStep === 3 && "Telegram Connected"}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedInfoStep(null)}
                      className="bg-transparent border-none text-gray-500 cursor-pointer p-1 hover:text-white"
                    >
                      &times;
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit Section */}
            <div className="bg-[#0a0a0a] border border-[#1f2937] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#1f2937]">
                <Settings size={16} className="text-gray-400" />
                <h4 className="text-sm font-semibold text-white m-0">Edit</h4>
              </div>

              {/* Change Interval */}
              <div className="p-5 border-b border-[#1f2937]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2.5">
                    <Clock size={16} className="text-[#23b5b5]" />
                    <span className="text-sm font-medium text-white">
                      Check Interval
                    </span>
                  </div>
                  <button
                    onClick={() => setEditingInterval(!editingInterval)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#23b5b5]/10 border border-[#23b5b5]/30 rounded-lg text-[#23b5b5] text-xs font-semibold cursor-pointer transition-all hover:bg-[#23b5b5]/20"
                  >
                    {editingInterval ? "Cancel" : "Change"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-[26px]">
                  Currently set to{" "}
                  {selectedInterval < 60
                    ? `${selectedInterval} minutes`
                    : `${selectedInterval / 60} hour${selectedInterval > 60 ? "s" : ""}`}
                </p>

                <AnimatePresence>
                  {editingInterval && (
                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {INTERVAL_OPTIONS.map((opt) => (
                          <motion.button
                            key={opt.value}
                            className={`p-2.5 bg-[#13161a] border-2 border-[#2a2f3a] rounded-xl text-gray-400 text-xs font-semibold cursor-pointer transition-all text-center hover:border-[#23b5b5] hover:text-white ${selectedInterval === opt.value ? "!border-[#23b5b5] !bg-[#23b5b5]/15 !text-[#23b5b5]" : ""}`}
                            onClick={() => setSelectedInterval(opt.value)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {opt.label}
                          </motion.button>
                        ))}
                      </div>
                      <button
                        onClick={async () => {
                          await handleSaveInterval();
                          setEditingInterval(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 p-2.5 bg-gradient-to-br from-[#23b5b5] to-[#1a9090] text-white rounded-xl text-sm font-semibold cursor-pointer transition-all hover:-translate-y-px hover:shadow-lg disabled:opacity-50"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}
                        Save Interval
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Change Gemini API Key */}
              <div className="p-5 border-b border-[#1f2937]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2.5">
                    <Key size={16} className="text-purple-400" />
                    <span className="text-sm font-medium text-white">
                      Gemini API Key
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setEditingGeminiKey(!editingGeminiKey);
                      if (!editingGeminiKey) setGeminiKey("");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 text-xs font-semibold cursor-pointer transition-all hover:bg-purple-500/20"
                  >
                    {editingGeminiKey ? "Cancel" : "Change"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-[26px]">
                  Update your Gemini API key for AI summaries
                </p>

                <AnimatePresence>
                  {editingGeminiKey && (
                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="relative mb-3">
                        <input
                          type={showKey ? "text" : "password"}
                          placeholder="Paste your new Gemini API key"
                          value={geminiKey}
                          onChange={(e) => setGeminiKey(e.target.value)}
                          className="w-full p-3 pl-4 pr-12 bg-[#13161a] border border-[#2a2f3a] rounded-xl text-white text-sm outline-none transition-all box-border focus:border-purple-400 focus:shadow-[0_0_8px_rgba(168,85,247,0.15)] placeholder:text-[#555]"
                        />
                        <button
                          onClick={() => setShowKey(!showKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-500 cursor-pointer p-1 hover:text-purple-400"
                        >
                          {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <button
                        onClick={async () => {
                          await handleSaveGeminiKey();
                          setEditingGeminiKey(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 p-2.5 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl text-sm font-semibold cursor-pointer transition-all hover:-translate-y-px hover:shadow-lg disabled:opacity-50"
                        disabled={loading || !geminiKey.trim()}
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Key size={16} />
                        )}
                        Save API Key
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Disconnect */}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Unplug size={16} className="text-red-400" />
                    <div>
                      <span className="text-sm font-medium text-white">
                        Disconnect Service
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Remove all connected accounts and stop automation
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnectAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-semibold cursor-pointer transition-all hover:bg-red-500/20"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : null}
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-[13px] mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                  <button
                    onClick={() => setError("")}
                    className="ml-auto bg-transparent border-none text-red-400 text-lg cursor-pointer"
                  >
                    &times;
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                className="w-full"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                {/* Step 0: Gmail */}
                {currentStep === 0 && (
                  <div className="bg-[#0a0a0a] border border-[#1f2937] rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5 duration-400">
                    <div className="flex items-center gap-4 p-7 bg-gradient-to-r from-white/5 to-transparent border-b border-[#1f2937]">
                      <img
                        src="https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_48dp.png"
                        alt="Gmail"
                        className="w-9 h-9 object-contain"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white m-0 mb-1">
                          Connect Gmail
                        </h3>
                        <p className="text-sm text-gray-500 m-0">
                          Allow access to read your emails for summarization
                        </p>
                      </div>
                    </div>
                    <div className="p-7">
                      <div className="bg-[#23b5b5]/5 border border-[#23b5b5]/10 rounded-[14px] p-5 mb-6">
                        <h4 className="text-sm font-semibold text-gray-300 m-0 mb-2.5">
                          What it does
                        </h4>
                        <ul className="list-none p-0 m-0">
                          <li className="text-[13px] text-gray-400 py-1 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#23b5b5]">
                            Reads your latest unread emails
                          </li>
                          <li className="text-[13px] text-gray-400 py-1 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#23b5b5]">
                            Generates AI-powered summaries via Gemini
                          </li>
                          <li className="text-[13px] text-gray-400 py-1 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#23b5b5]">
                            Only uses read-only access — nothing is modified
                          </li>
                        </ul>
                      </div>
                      {gmailConnected ? (
                        <div className="flex items-center gap-2 px-4 py-3 bg-[#059669]/10 border border-[#059669]/30 rounded-xl text-[#059669] font-semibold text-sm">
                          <Check size={16} /> Gmail Connected
                          <button
                            onClick={() => setCurrentStep(1)}
                            className="ml-auto flex items-center gap-1 px-3.5 py-1.5 bg-[#059669]/20 border border-[#059669]/40 rounded-lg text-[#059669] text-xs font-semibold cursor-pointer transition-all hover:bg-[#059669]/30"
                          >
                            Next <ChevronRight size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleConnectGmail}
                          className="w-full flex items-center justify-center gap-3 p-3.5 bg-white text-gray-800 border-none rounded-xl text-[15px] font-semibold cursor-pointer transition-all hover:bg-gray-100 hover:-translate-y-px hover:shadow-lg"
                        >
                          <img
                            src="https://developers.google.com/identity/images/g-logo.png"
                            alt="Google"
                            className="w-5 h-5"
                          />
                          Sign in with Google
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 1: Interval */}
                {currentStep === 1 && (
                  <div className="bg-[#0a0a0a] border border-[#1f2937] rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5 duration-400">
                    <div className="flex items-center gap-4 p-7 bg-gradient-to-r from-white/5 to-transparent border-b border-[#1f2937]">
                      <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-[#23b5b5] to-[#1a9090] text-white">
                        <Clock size={22} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white m-0 mb-1">
                          Set Check Interval
                        </h3>
                        <p className="text-sm text-gray-500 m-0">
                          How often should we check for new emails?
                        </p>
                      </div>
                    </div>
                    <div className="p-7">
                      <div className="grid grid-cols-4 gap-2.5 mb-4">
                        {INTERVAL_OPTIONS.map((opt) => (
                          <motion.button
                            key={opt.value}
                            className={`p-3 bg-[#13161a] border-2 border-[#2a2f3a] rounded-xl text-gray-400 text-sm font-semibold cursor-pointer transition-all text-center hover:border-[#23b5b5] hover:text-white ${selectedInterval === opt.value ? "!border-[#23b5b5] !bg-[#23b5b5]/15 !text-[#23b5b5] shadow-[0_0_12px_rgba(35,181,181,0.15)]" : ""}`}
                            onClick={() => setSelectedInterval(opt.value)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {opt.label}
                          </motion.button>
                        ))}
                      </div>
                      <button
                        onClick={handleSaveInterval}
                        className="w-full flex items-center justify-center gap-2 p-3.5 bg-gradient-to-br from-[#23b5b5] to-[#1a9090] text-white rounded-xl text-[15px] font-semibold cursor-pointer transition-all hover:-translate-y-px hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : null}
                        Save & Continue
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Gemini API Key */}
                {currentStep === 2 && (
                  <div className="bg-[#0a0a0a] border border-[#1f2937] rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5 duration-400">
                    <div className="flex items-center gap-4 p-7 bg-gradient-to-r from-white/5 to-transparent border-b border-[#1f2937]">
                      <img
                        src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg"
                        alt="Gemini"
                        className="w-9 h-9 object-contain"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white m-0 mb-1">
                          Gemini API Key
                        </h3>
                        <p className="text-sm text-gray-500 m-0">
                          Enter your Google Gemini API key for AI-powered
                          summaries
                        </p>
                      </div>
                    </div>
                    <div className="p-7">
                      <div className="bg-[#23b5b5]/5 border border-[#23b5b5]/10 rounded-[14px] p-5 mb-6">
                        <h4 className="text-sm font-semibold text-gray-300 m-0 mb-2.5">
                          Get your API key
                        </h4>
                        <p className="text-[13px] text-gray-400 m-0 leading-relaxed">
                          Visit{" "}
                          <a
                            href="https://aistudio.google.com/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#23b5b5] no-underline inline-flex items-center gap-1 hover:underline"
                          >
                            Google AI Studio <ExternalLink size={12} />
                          </a>{" "}
                          to create a free Gemini API key.
                        </p>
                      </div>
                      {geminiKeySet ? (
                        <div className="flex items-center gap-2 px-4 py-3 bg-[#059669]/10 border border-[#059669]/30 rounded-xl text-[#059669] font-semibold text-sm">
                          <Check size={16} /> API Key Saved
                          <button
                            onClick={() => setCurrentStep(3)}
                            className="ml-auto flex items-center gap-1 px-3.5 py-1.5 bg-[#059669]/20 border border-[#059669]/40 rounded-lg text-[#059669] text-xs font-semibold cursor-pointer transition-all hover:bg-[#059669]/30"
                          >
                            Next <ChevronRight size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="relative mb-2">
                            <input
                              type={showKey ? "text" : "password"}
                              placeholder="Paste your Gemini API key here"
                              value={geminiKey}
                              onChange={(e) => setGeminiKey(e.target.value)}
                              className="w-full p-3.5 pl-4 pr-12 bg-[#0a0f0f] border border-[#2a2f3a] rounded-xl text-white text-sm outline-none transition-all box-border focus:border-[#23b5b5] focus:shadow-[0_0_8px_rgba(35,181,181,0.15)] placeholder:text-[#555]"
                            />
                            <button
                              onClick={() => setShowKey(!showKey)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-500 cursor-pointer p-1 hover:text-[#23b5b5]"
                            >
                              {showKey ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          </div>
                          <button
                            onClick={handleSaveGeminiKey}
                            className="w-full flex items-center justify-center gap-2 p-3.5 bg-gradient-to-br from-[#23b5b5] to-[#1a9090] text-white rounded-xl text-[15px] font-semibold cursor-pointer transition-all hover:-translate-y-px hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            disabled={loading || !geminiKey.trim()}
                          >
                            {loading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Key size={16} />
                            )}
                            Save API Key
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Telegram */}
                {currentStep === 3 && (
                  <div className="bg-[#0a0a0a] border border-[#1f2937] rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5 duration-400">
                    <div className="flex items-center gap-4 p-7 bg-gradient-to-r from-white/5 to-transparent border-b border-[#1f2937]">
                      <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-[#0088cc] to-[#0077aa] text-white">
                        <Send size={22} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white m-0 mb-1">
                          Connect Telegram
                        </h3>
                        <p className="text-sm text-gray-500 m-0">
                          Link your Telegram account to receive email summaries
                        </p>
                      </div>
                    </div>
                    <div className="p-7">
                      <div className="bg-[#23b5b5]/5 border border-[#23b5b5]/10 rounded-[14px] p-5 mb-6">
                        <h4 className="text-sm font-semibold text-gray-300 m-0 mb-2.5">
                          How it works
                        </h4>
                        <ul className="list-none p-0 m-0">
                          <li className="text-[13px] text-gray-400 py-1 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#23b5b5]">
                            Click the button below to open the Explified Bot
                          </li>
                          <li className="text-[13px] text-gray-400 py-1 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#23b5b5]">
                            Press "Start" in Telegram to link your account
                          </li>
                          <li className="text-[13px] text-gray-400 py-1 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#23b5b5]">
                            Summaries will be sent as messages to your chat
                          </li>
                        </ul>
                      </div>
                      {telegramConnected ? (
                        <div className="flex items-center gap-2 px-4 py-3 bg-[#059669]/10 border border-[#059669]/30 rounded-xl text-[#059669] font-semibold text-sm">
                          <Check size={16} /> Telegram Connected
                        </div>
                      ) : (
                        <button
                          onClick={handleConnectTelegram}
                          className="w-full flex items-center justify-center gap-2.5 p-3.5 bg-gradient-to-br from-[#0088cc] to-[#006699] text-white border-none rounded-xl text-[15px] font-semibold cursor-pointer transition-all hover:bg-gradient-to-br hover:from-[#0099dd] hover:to-[#0077aa] hover:-translate-y-px hover:shadow-[0_4px_15px_rgba(0,136,204,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send size={16} />
                          )}
                          Connect Telegram Bot
                          <ExternalLink size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
