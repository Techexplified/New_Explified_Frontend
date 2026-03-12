import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    GitFork,
    MessageCircle,
    ListChecks,
    BookOpen,
    Bell,
    Settings,
    ArrowUp,
    Paperclip,
    Image,
    Type,
    Video,
} from "lucide-react";

const FEATURES = [
    {
        id: "diagram",
        icon: GitFork,
        label: "Generate Diagram",
        disabled: false,
        path: "/expli/diagrams",
    },
    {
        id: "ask",
        icon: MessageCircle,
        label: "Focus Mode",
        disabled: false,
        path: "/expli/ask",
    },
    {
        id: "plan",
        icon: ListChecks,
        label: "Build Plan",
        disabled: false,
        path: "/expli/plans",
    },
    {
        id: "flashcard",
        icon: BookOpen,
        label: "Generate Flashcards",
        disabled: false,
        path: "/expli/flashcards",
    },
];

export default function ExpliV3Home() {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const textareaRef = useRef(null);
    const [mode, setMode] = useState("Core"); // Core or Nexus

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                Math.min(textareaRef.current.scrollHeight, 150) + "px";
        }
    }, [input]);

    const handleSubmit = () => {
        if (!input.trim()) return;
        // Navigate to Ask Question with the prompt
        navigate("/expli/ask", { state: { initialPrompt: input.trim() } });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="expli-v3-main">
            {/* Background orbs */}
            <div className="expli-v3-main__bg">
                <div className="expli-v3-main__bg-orb-1" />
                <div className="expli-v3-main__bg-orb-2" />
            </div>

            {/* Top Bar */}
            <div className="expli-v3-topbar">
                {/* Core / Nexus Toggle */}
                <div className="expli-v3-topbar__toggle">
                    <button
                        className={`expli-v3-topbar__toggle-btn ${mode === "Core"
                            ? "expli-v3-topbar__toggle-btn--active"
                            : "expli-v3-topbar__toggle-btn--inactive"
                            }`}
                        onClick={() => setMode("Core")}
                    >
                        Core
                    </button>
                    <button
                        className={`expli-v3-topbar__toggle-btn ${mode === "Nexus"
                            ? "expli-v3-topbar__toggle-btn--active"
                            : "expli-v3-topbar__toggle-btn--inactive"
                            }`}
                        onClick={() => setMode("Nexus")}
                    >
                        Nexus
                    </button>
                </div>

                <button className="expli-v3-topbar__icon-btn" title="Notifications">
                    <Bell size={16} />
                </button>
                <button className="expli-v3-topbar__icon-btn" title="Settings">
                    <Settings size={16} />
                </button>
                <div className="expli-v3-topbar__avatar">U</div>
            </div>

            {/* Hero Section */}
            <div className="expli-v3-hero">
                <h1 className="expli-v3-hero__title">Expli</h1>
                <p className="expli-v3-hero__subtitle">
                    Transform complex information into clear execution.
                </p>

                {/* Feature Buttons */}
                <div className="expli-v3-features">
                    {FEATURES.map((f) => {
                        const Icon = f.icon;
                        return (
                            <button
                                key={f.id}
                                className={`expli-v3-feature-btn ${f.disabled ? "expli-v3-feature-btn--disabled" : ""
                                    }`}
                                onClick={() => {
                                    if (f.disabled) return;
                                    if (f.path) {
                                        navigate(f.path);
                                    } else if (f.prompt) {
                                        navigate("/expli/ask", { state: { initialPrompt: f.prompt } });
                                    }
                                }}
                                title={f.disabled ? "Coming in V4" : f.label}
                            >
                                <span className="expli-v3-feature-btn__icon">
                                    <Icon size={16} />
                                </span>
                                {f.label}
                            </button>
                        );
                    })}
                </div>

                {/* Input Area */}
                <div className="expli-v3-input-wrapper">
                    <div className="expli-v3-input">
                        <textarea
                            ref={textareaRef}
                            className="expli-v3-input__textarea"
                            placeholder="Ask anything, upload a file, or define a goal..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                        />
                        <div className="expli-v3-input__actions">
                            <div className="expli-v3-input__actions-left">
                                <button className="expli-v3-input__action-btn" title="Text format">
                                    <Type size={17} />
                                </button>
                                <button className="expli-v3-input__action-btn" title="Attach file">
                                    <Paperclip size={17} />
                                </button>
                                <button className="expli-v3-input__action-btn" title="Add image">
                                    <Image size={17} />
                                </button>
                                <button className="expli-v3-input__action-btn" title="Video">
                                    <Video size={17} />
                                </button>
                            </div>
                            <button
                                className={`expli-v3-input__send-btn ${!input.trim() ? "expli-v3-input__send-btn--disabled" : ""
                                    }`}
                                onClick={handleSubmit}
                                disabled={!input.trim()}
                                title="Send"
                            >
                                <ArrowUp size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
