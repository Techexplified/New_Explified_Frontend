import React, { useState, useCallback } from "react";
import {
    FiVolume2,
    FiVolumeX,
    FiGlobe,
    FiShare2,
    FiUsers,
    FiZap,
} from "react-icons/fi";
import {
    TbBinaryTree,
    TbLanguage,
    TbHighlight,
    TbUserPlus,
} from "react-icons/tb";
import { RiFlowChart } from "react-icons/ri";
import { HiOutlineSparkles } from "react-icons/hi";

const LANGUAGES = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
    { code: "pt", name: "Portuguese", flag: "🇧🇷" },
    { code: "ru", name: "Russian", flag: "🇷🇺" },
];

export const VoiceExplanation = ({ text, isPlaying, onToggle }) => {
    const [speaking, setSpeaking] = useState(false);

    const handleSpeak = useCallback(() => {
        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
            onToggle?.(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => {
            setSpeaking(true);
            onToggle?.(true);
        };

        utterance.onend = () => {
            setSpeaking(false);
            onToggle?.(false);
        };

        utterance.onerror = () => {
            setSpeaking(false);
            onToggle?.(false);
        };

        window.speechSynthesis.speak(utterance);
    }, [text, speaking, onToggle]);

    return (
        <button
            onClick={handleSpeak}
            className={`p-1.5 rounded-lg transition-all duration-200 ${speaking
                ? "bg-[#23b5b5] text-white animate-pulse"
                : "text-gray-400 hover:text-[#23b5b5] hover:bg-gray-800/50"
                }`}
            title={speaking ? "Stop speaking" : "Listen to response"}
        >
            {speaking ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
        </button>
    );
};

export const MultiLanguageSelector = ({
    selectedLanguage,
    onSelect,
    showDropdown,
    setShowDropdown,
}) => {
    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-[#23b5b5] hover:bg-gray-800/50 transition-all duration-200"
                title="Translate response"
            >
                <TbLanguage size={16} />
                <span className="text-xs font-medium">
                    {LANGUAGES.find((l) => l.code === selectedLanguage)?.flag || "🌐"}
                </span>
            </button>

            {showDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-2 border-b border-gray-700/50">
                        <span className="text-xs text-gray-400 font-medium">
                            Translate to
                        </span>
                    </div>
                    <div className="max-h-48 overflow-y-auto custom-scrollbar">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    onSelect(lang.code);
                                    setShowDropdown(false);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${selectedLanguage === lang.code
                                    ? "bg-[#23b5b5]/20 text-[#23b5b5]"
                                    : "text-gray-300 hover:bg-gray-800/50"
                                    }`}
                            >
                                <span className="text-base">{lang.flag}</span>
                                <span>{lang.name}</span>
                                {selectedLanguage === lang.code && (
                                    <span className="ml-auto text-[#23b5b5]">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const DiagramGenerator = ({ text, onGenerate }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showDiagram, setShowDiagram] = useState(false);
    const [diagramType, setDiagramType] = useState("flowchart");

    const generateDiagram = async () => {
        setIsGenerating(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setShowDiagram(true);
            onGenerate?.({ type: diagramType, text });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="relative group">
            <button
                onClick={generateDiagram}
                disabled={isGenerating}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 ${isGenerating
                    ? "bg-[#23b5b5]/20 text-[#23b5b5] animate-pulse"
                    : "text-gray-400 hover:text-[#23b5b5] hover:bg-gray-800/50"
                    }`}
                title="Generate diagram"
            >
                <RiFlowChart size={14} />
                {isGenerating && <span className="text-xs">Generating...</span>}
            </button>

            <div className="absolute hidden group-hover:flex bottom-full left-0 mb-2 gap-1 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-lg p-1 shadow-xl">
                {["flowchart", "mindmap", "sequence"].map((type) => (
                    <button
                        key={type}
                        onClick={() => setDiagramType(type)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${diagramType === type
                            ? "bg-[#23b5b5] text-white"
                            : "text-gray-400 hover:bg-gray-700"
                            }`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    );
};

export const CollaborationPanel = ({ sessionId, onShare, onInvite }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [shareLink, setShareLink] = useState("");
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        const link = `${window.location.origin}/expli/share/${sessionId}`;
        setShareLink(link);
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        onShare?.(link);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-[#23b5b5] hover:bg-gray-800/50 transition-all duration-200"
                title="Collaborate"
            >
                <FiUsers size={14} />
            </button>

            {isOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-700/50">
                        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                            <FiUsers size={14} />
                            Collaboration
                        </h4>
                    </div>

                    <div className="p-3 space-y-3">
                        <button
                            onClick={handleShare}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#23b5b5]/20 text-[#23b5b5] rounded-lg hover:bg-[#23b5b5]/30 transition-colors"
                        >
                            <FiShare2 size={14} />
                            {copied ? "Link Copied!" : "Share Chat"}
                        </button>

                        <button
                            onClick={onInvite}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors"
                        >
                            <TbUserPlus size={14} />
                            Invite Collaborator
                        </button>

                        <div className="text-xs text-gray-500 text-center">
                            Collaborators can view and add to this conversation
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const HighlightExplainer = ({ onExplain }) => {
    const [isActive, setIsActive] = useState(false);
    const [selectedText, setSelectedText] = useState("");

    const handleActivate = () => {
        setIsActive(!isActive);
        if (!isActive) {
            const handleSelection = () => {
                const selection = window.getSelection();
                const text = selection?.toString().trim();
                if (text && text.length > 0) {
                    setSelectedText(text);
                    onExplain?.(text);
                }
            };
            document.addEventListener("mouseup", handleSelection);
            setTimeout(() => {
                document.removeEventListener("mouseup", handleSelection);
                setIsActive(false);
            }, 10000);
        }
    };

    return (
        <button
            onClick={handleActivate}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 ${isActive
                ? "bg-yellow-500/20 text-yellow-400 ring-2 ring-yellow-500/30"
                : "text-gray-400 hover:text-yellow-400 hover:bg-gray-800/50"
                }`}
            title={isActive ? "Select text to explain" : "Highlight to explain"}
        >
            <TbHighlight size={14} />
            {isActive && <span className="text-xs">Select text...</span>}
        </button>
    );
};

export const V2FeaturesBar = ({
    messageText,
    sessionId,
    onTranslate,
    onDiagramGenerate,
    onShare,
    onExplainHighlight,
}) => {
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleLanguageSelect = async (langCode) => {
        setSelectedLanguage(langCode);
        if (langCode !== "en" && onTranslate) {
            onTranslate(messageText, langCode);
        }
    };

    return (
        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-800/50">
            <VoiceExplanation
                text={messageText}
                isPlaying={isSpeaking}
                onToggle={setIsSpeaking}
            />

            <MultiLanguageSelector
                selectedLanguage={selectedLanguage}
                onSelect={handleLanguageSelect}
                showDropdown={showLanguageDropdown}
                setShowDropdown={setShowLanguageDropdown}
            />

            <DiagramGenerator text={messageText} onGenerate={onDiagramGenerate} />

            <CollaborationPanel sessionId={sessionId} onShare={onShare} />

            <HighlightExplainer onExplain={onExplainHighlight} />
        </div>
    );
};

export const V2Badge = () => (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-[#23b5b5]/20 to-purple-500/20 rounded-full text-[10px] font-bold text-[#23b5b5] border border-[#23b5b5]/30">
        <HiOutlineSparkles size={10} />
        V2
    </span>
);

export default {
    VoiceExplanation,
    MultiLanguageSelector,
    DiagramGenerator,
    CollaborationPanel,
    HighlightExplainer,
    V2FeaturesBar,
    V2Badge,
    LANGUAGES,
};
