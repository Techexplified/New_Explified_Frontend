import React, { useState } from "react";
import { aiModelDetails } from "../ai-fiesta/aiModelDetails";
import { FaSearch, FaArrowRight, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function CompareSelection() {
    const navigate = useNavigate();
    const [selectedModels, setSelectedModels] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleModel = (id) => {
        setSelectedModels((prev) =>
            prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        );
    };

    const handleStartCompare = () => {
        if (selectedModels.length < 1) return;
        // Navigate to chat with selected models, possibly passing them in state
        navigate("/expli/compare/chat", { state: { selectedModelIds: selectedModels } });
    };

    // Filter models
    const filteredModels = aiModelDetails.filter((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Hardcoded Top Combos for UI demo (as per screenshot)
    const topCombos = [
        {
            title: "Reasoning Powerhouse",
            models: ["openai", "anthropic"], // IDs from aiModelDetails
            desc: "Best for complex logic & code",
            color: "from-green-500/20 to-teal-500/20",
            borderColor: "border-green-500/30",
        },
        {
            title: "Creative & Fast",
            models: ["gemini", "explii"],
            desc: "Great for brainstorming & speed",
            color: "from-purple-500/20 to-pink-500/20",
            borderColor: "border-purple-500/30",
        },
        {
            title: "All Rounders",
            models: ["openai", "gemini", "anthropic"],
            desc: "Balanced mix of top tier models",
            color: "from-blue-500/20 to-indigo-500/20",
            borderColor: "border-blue-500/30",
        },
    ];

    const selectCombo = (modelIds) => {
        // Filter out models that might not exist in aiModelDetails to be safe
        const validIds = modelIds.filter(id => aiModelDetails.find(m => m.id === id));
        setSelectedModels(validIds);
    };

    return (
        <div className="w-full h-full flex flex-col bg-black/95 text-white overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-800/50 sticky top-0 bg-black/95 z-20 backdrop-blur-md">
                <div className="flex items-center gap-4 mb-2">
                    <button onClick={() => navigate("/expli")} className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
                        &larr; Back to Chat
                    </button>
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Compare Models
                </h1>
                <p className="text-gray-400 mt-1">
                    Select and compare multiple AI models side-by-side
                </p>

                {/* Search */}
                <div className="mt-6 relative max-w-2xl">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search models..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#23b5b5]/50 focus:ring-1 focus:ring-[#23b5b5]/50 transition-all"
                    />
                </div>
            </div>

            <div className="p-8 pb-32 max-w-7xl mx-auto w-full">
                {/* Top Combos */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-200">Top Model Combos Picked for You</h2>
                        <Sparkles className="text-[#23b5b5] w-5 h-5 animate-pulse" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {topCombos.map((combo, idx) => (
                            <div
                                key={idx}
                                onClick={() => selectCombo(combo.models)}
                                className={`group cursor-pointer rounded-2xl p-5 border ${combo.borderColor} bg-gradient-to-br ${combo.color} hover:opacity-90 transition-all relative overflow-hidden`}
                            >
                                <div className="relative z-10">
                                    <h3 className="font-bold text-lg mb-1">{combo.title}</h3>
                                    <p className="text-xs text-gray-300 mb-4">{combo.desc}</p>
                                    <div className="flex -space-x-2">
                                        {combo.models.map(mid => {
                                            const m = aiModelDetails.find(x => x.id === mid);
                                            return m ? (
                                                <div key={mid} className="w-8 h-8 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-xs" title={m.name}>
                                                    {m.icon}
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                                {/* Hover effect overlay */}
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* All Models Grid */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">All Models</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredModels.map((model) => {
                            const isSelected = selectedModels.includes(model.id);
                            return (
                                <div
                                    key={model.id}
                                    onClick={() => toggleModel(model.id)}
                                    className={`relative p-5 rounded-2xl border transition-all cursor-pointer group
                    ${isSelected
                                            ? "bg-[#23b5b5]/10 border-[#23b5b5]"
                                            : "bg-[#111] border-gray-800 hover:border-gray-700 hover:bg-[#161616]"
                                        }
                  `}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`p-2.5 rounded-xl ${isSelected ? "bg-[#23b5b5]/20" : "bg-gray-800/50"}`}>
                                            {model.icon}
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors
                        ${isSelected ? "bg-[#23b5b5] border-[#23b5b5]" : "border-gray-600 group-hover:border-gray-500"}
                    `}>
                                            {isSelected && <FaCheck className="text-black text-xs" />}
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-lg text-gray-100">{model.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{model.desc}</p>

                                    {/* Mock tags similar to screenshot */}
                                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                                        <span>Speed: <span className="text-gray-300">Fast</span></span>
                                        <span>Quality: <span className="text-gray-300">High</span></span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Floating Action Bar */}
            {selectedModels.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
                    <button
                        onClick={handleStartCompare}
                        className="flex items-center gap-3 px-8 py-4 bg-[#23b5b5] hover:bg-[#1ea8a8] text-black rounded-full font-bold shadow-[0_0_40px_-5px_rgba(35,181,181,0.5)] transition-all transform hover:scale-105"
                    >
                        <span>Compare {selectedModels.length} Models</span>
                        <FaArrowRight />
                    </button>
                </div>
            )}
        </div>
    );
}
