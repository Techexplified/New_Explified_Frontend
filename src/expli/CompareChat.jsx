import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { aiModelDetails } from "../ai-fiesta/aiModelDetails";
import { useExpli } from "../context/ExpliContext";
import ChatContainer from "./ChatContainer";
import ExpliInput from "./ExpliInput";
import axios from "axios";
import { ExpliLogo } from "../assets";
import GeminiLogo from "../assets/logos/gemini.png";
import ChatGPT from "../assets/logos/openai.png";

import { Settings } from "lucide-react";
import SettingsModal from "../ai-fiesta/SettingsModal";

const noop = () => { };

export default function CompareChat() {
    const location = useLocation();
    const navigate = useNavigate();
    const { providerKeys } = useExpli();
    const [models, setModels] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [isAnyTyping, setIsAnyTyping] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Initialize selected models
    useEffect(() => {
        const selectedIds = location.state?.selectedModelIds || [];
        if (selectedIds.length === 0) {
            // If no models selected (direct access), maybe redirect or show empty state
            // For now, let's just default to Expli + OpenAI if available
            const defaults = ["explii", "openai"].filter(id => aiModelDetails.find(m => m.id === id));
            if (defaults.length > 0) {
                initializeModels(defaults);
            } else {
                navigate("/expli/compare");
            }
        } else {
            initializeModels(selectedIds);
        }
    }, [location.state, navigate]);

    const initializeModels = (ids) => {
        const initialModels = ids.map((id) => {
            const details = aiModelDetails.find((d) => d.id === id);
            return {
                id: id,
                name: details?.name || id,
                icon: details?.icon,
                messages: [],
                isTyping: false,
                enabled: true,
                details: details
            };
        });
        setModels(initialModels);
    };

    const handleInputChange = (e) => setPrompt(e.target.value);

    // Toggle model enabled/disabled
    const toggleModel = (id) => {
        setModels(prev => prev.map(m =>
            m.id === id ? { ...m, enabled: !m.enabled } : m
        ));
    };

    // Remove model from view
    const removeModel = (id) => {
        setModels(prev => prev.filter(m => m.id !== id));
    };

    const handleSubmit = async (eOrText) => {
        const text = typeof eOrText === 'string' ? eOrText : prompt;
        if (!text?.trim()) return;

        const userMsg = { sender: "user", text: text };
        setPrompt("");

        // Set typing state
        setModels((prev) =>
            prev.map((m) => {
                if (!m.enabled) return m;
                return {
                    ...m,
                    messages: [...m.messages, userMsg],
                    isTyping: true,
                };
            })
        );
        setIsAnyTyping(true);

        const contextPrompt = text; // In future, append previous context if needed

        // Parallel API Calls
        const promises = models.map(async (model) => {
            if (!model.enabled) return { id: model.id, text: null, skipped: true };

            try {
                const userKey = providerKeys?.[model.id];

                // Prepare messages for backend
                // Backend expects [{role: "user", content: "..."}]
                // We'll just send the current prompt for now as per original logic
                const messages = [{ role: "user", content: contextPrompt }];

                const res = await axios.post(
                    "http://localhost:3000/api/ai/chat",
                    {
                        modelId: model.id,
                        messages: messages,
                        userKey: userKey, // Optional, backend handles it
                        temperature: 0.2, // Default params
                        top_p: 0.7,
                        max_tokens: 1024
                    }
                );

                const responseText = res.data?.text;
                return { id: model.id, text: responseText || "No response." };

            } catch (err) {
                console.error(`Error fetching ${model.id}:`, err);
                return { id: model.id, text: `Error: ${err.response?.data?.error || err.message || "Failed to fetch response"}` };
            }
        });

        // Update IO as they finish
        promises.forEach(p => {
            p.then(result => {
                if (result.skipped) return;
                setModels(prev => prev.map(m => {
                    if (m.id === result.id) {
                        return {
                            ...m,
                            messages: [...m.messages, { sender: "bot", text: result.text }],
                            isTyping: false
                        };
                    }
                    return m;
                }));
            });
        });

        await Promise.all(promises);
        setIsAnyTyping(false);
    };


    return (
        <div className="flex flex-col w-full h-full bg-black/95 relative overflow-hidden">
            {/* Simple Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800/50 bg-black/50 backdrop-blur z-20">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/expli/compare")} className="text-gray-400 hover:text-white">
                        &larr; Back
                    </button>
                    <h1 className="text-lg font-semibold text-white">Compare {models.length} Models</h1>
                </div>
                <button
                    onClick={() => setShowSettings(true)}
                    className="text-gray-400 hover:text-[#23B5B5] transition-colors"
                    title="Manage API Keys"
                >
                    <Settings size={20} />
                </button>
            </div>

            {/* Horizontal Scrolling Models Container */}
            <div className="flex-1 flex overflow-x-auto overflow-y-hidden divide-x divide-gray-800/50 pb-32">
                {models.map((model) => (
                    <div key={model.id} className="min-w-[460px] flex-1 flex flex-col relative">
                        <ChatContainer
                            messages={model.messages}
                            isTyping={model.isTyping}
                            toolName={model.name}
                            logo={
                                model.id === 'explii' ? ExpliLogo :
                                    model.id === 'openai' ? ChatGPT :
                                        model.id === 'gemini' ? GeminiLogo :
                                            null
                            }
                            icon={model.details?.icon}
                            enabled={model.enabled}
                            setEnabled={() => toggleModel(model.id)}
                            handleCloseChat={() => removeModel(model.id)}
                            pid={model.id} // pid used for closing
                            onlyExpliOpen={false} // Force standard view
                        // We need to ensure ChatContainer doesn't throw if sessionId is missing or context is different
                        />
                    </div>
                ))}
            </div>

            {/* Shared Input */}
            <ExpliInput
                prompt={prompt}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isTyping={isAnyTyping}
                // Minimal props for visual consistency
                onlyExpliOpen={false}
                chatNotPresent={false}
            />

            {/* Settings Modal */}
            <SettingsModal
                open={showSettings}
                onClose={() => setShowSettings(false)}
            />
        </div>
    );
}
