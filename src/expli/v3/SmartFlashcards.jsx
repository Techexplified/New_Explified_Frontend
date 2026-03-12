import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import {
  Search,
  Plus,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Check,
  X,
  Activity,
  BarChart2,
  Zap,
  Settings,
  BookOpen,
  Target,
  Image as ImageIcon,
  Video,
  File,
  ShieldAlert,
  Award,
  Sparkles,
  Wand2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function SmartFlashcards() {
  const [topicInput, setTopicInput] = useState("");
  const [countInput, setCountInput] = useState("");

  // Custom PDF Export State
  const [rightPanelTab, setRightPanelTab] = useState("insights"); // "insights" | "export"
  const [pdfTheme, setPdfTheme] = useState("dark"); // "dark" | "light" | "blue"
  const [pdfFont, setPdfFont] = useState("times"); // "times" | "courier" | "calibri"
  const [pdfFontSize, setPdfFontSize] = useState("medium"); // "small" | "medium" | "large"

  // State for generation process
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  // State for decks and cards
  const [decks, setDecks] = useState([]);
  const [activeDeckId, setActiveDeckId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // State for active study session
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardIsFlipped, setCardIsFlipped] = useState(false);
  const [expandedDecks, setExpandedDecks] = useState({});

  // Derived state for the active deck
  const activeDeck = decks.find((d) => d.id === activeDeckId) || null;
  const filteredDecks = decks.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // When starting a new app session or after generate, ensure we select the first deck
  useEffect(() => {
    if (decks.length > 0 && !activeDeckId) {
      setActiveDeckId(decks[0].id);
      setCurrentCardIndex(0);
      setCardIsFlipped(false);
      setExpandedDecks((prev) => ({ ...prev, [decks[0].id]: true }));
    }
  }, [decks, activeDeckId]);

  // ====== GENERATION LOGIC (GEMINI 2.5 FLASH) ======
  const _callGemini = async (prompt) => {
    const apiKey =
      import.meta.env.VITE_TRONE_GEMINI_API_KEY ||
      import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `You are an expert AI creating flashcards. 
Goal: Create high-quality, concise flashcards.
Output: You MUST respond with ONLY a raw JSON array of objects. No markdown formatting, no backticks.
Format: [{"question": "What is...", "answer": "It is..."}]`;

    const payload = {
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\n" + prompt }] },
      ],
      generationConfig: { temperature: 0.7, topK: 40 },
    };

    const res = await axios.post(apiUrl, payload, {
      headers: { "Content-Type": "application/json" },
    });
    let responseText = res.data.candidates[0].content.parts[0].text;
    responseText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(responseText);
  };

  const handleGenerateCards = async () => {
    if (!topicInput.trim()) {
      setGenerationError("Please enter a topic to generate flashcards.");
      return;
    }
    setIsGenerating(true);
    setGenerationError("");

    try {
      const countText = countInput.trim()
        ? `Generate exactly ${countInput} flashcards.`
        : "Generate 7 to 10 flashcards.";
      const userPrompt = `Topic: ${topicInput}\nRequirement: ${countText}`;
      const flashcardsJson = await _callGemini(userPrompt);

      if (!Array.isArray(flashcardsJson) || flashcardsJson.length === 0)
        throw new Error("Format error");

      const newCards = flashcardsJson.map((card, idx) => ({
        id: Date.now() + idx,
        q: card.question,
        a: card.answer,
        correctness: null,
        difficulty: null,
        level: 1,
      }));

      const newDeck = {
        id: Date.now(),
        title: topicInput.trim(),
        level: 1,
        cards: newCards,
        color: ["#23b5b5", "#f59e0b", "#8b5cf6", "#ec4899", "#3b82f6"][
          Math.floor(Math.random() * 5)
        ],
      };

      setDecks([newDeck, ...decks]);
      setActiveDeckId(newDeck.id);
      setCurrentCardIndex(0);
      setCardIsFlipped(false);
      setExpandedDecks((prev) => ({ ...prev, [newDeck.id]: true }));
    } catch (error) {
      setGenerationError("Failed to generate flashcards. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateNextLevel = async () => {
    if (!activeDeck) return;
    setIsGenerating(true);

    try {
      const wrongQs = activeDeck.cards
        .filter((c) => c.correctness === "wrong")
        .map((c) => c.q)
        .join("\n");
      const hardQs = activeDeck.cards
        .filter((c) => c.difficulty === "hard")
        .map((c) => c.q)
        .join("\n");

      const adaptationPrompt = `The user answered these incorrectly:\n${wrongQs || "None"}\nThe user struggled with these (hard):\n${hardQs || "None"}`;
      const countText = `Generate ${activeDeck.cards.length} new flashcards.`;
      const userPrompt = `Topic: ${activeDeck.title}\nPrior Context: ${adaptationPrompt}\nInstruction: Create the next progression level. Adapt to their weaknesses. If they got things wrong, give similar but slightly different associative questions to reinforce learning.\nRequirement: ${countText}`;

      const flashcardsJson = await _callGemini(userPrompt);

      if (!Array.isArray(flashcardsJson) || flashcardsJson.length === 0)
        throw new Error("Format error");

      const newCards = flashcardsJson.map((card, idx) => ({
        id: Date.now() + idx,
        q: card.question,
        a: card.answer,
        correctness: null,
        difficulty: null,
        level: activeDeck.level + 1,
      }));

      const nextLevelDeck = {
        ...activeDeck,
        id: Date.now(),
        title: `${activeDeck.title} (Level ${activeDeck.level + 1})`,
        level: activeDeck.level + 1,
        cards: newCards,
      };

      setDecks([
        nextLevelDeck,
        ...decks.filter((d) => d.id !== activeDeck.id),
        activeDeck,
      ]);
      setActiveDeckId(nextLevelDeck.id);
      setCurrentCardIndex(0);
      setCardIsFlipped(false);
      setExpandedDecks((prev) => ({ ...prev, [nextLevelDeck.id]: true }));
    } catch (error) {
      alert("Failed to generate next level. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const rateCorrectness = (isCorrect) => {
    if (!activeDeck) return;
    const currentCard = activeDeck.cards[currentCardIndex];
    const updatedCards = [...activeDeck.cards];

    updatedCards[currentCardIndex] = {
      ...currentCard,
      correctness: isCorrect ? "correct" : "wrong",
    };
    updateActiveDeck(updatedCards);
  };

  const rateDifficulty = (difficultyStr) => {
    if (!activeDeck) return;
    const currentCard = activeDeck.cards[currentCardIndex];
    const updatedCards = [...activeDeck.cards];
    updatedCards[currentCardIndex] = {
      ...currentCard,
      difficulty: difficultyStr,
    };
    saveCardsAndAdvance(updatedCards);
  };

  const saveCardsAndAdvance = (updatedCards) => {
    updateActiveDeck(updatedCards);
    if (currentCardIndex < updatedCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setCardIsFlipped(false);
    }
  };

  const updateActiveDeck = (updatedCards) => {
    const updatedDecks = decks.map((d) =>
      d.id === activeDeckId ? { ...d, cards: updatedCards } : d,
    );
    setDecks(updatedDecks);
  };

  const toggleDeckSidebar = (deckId) => {
    setExpandedDecks((prev) => ({ ...prev, [deckId]: !prev[deckId] }));
  };

  // ====== METRICS CALCULATIONS ======
  let cardsReviewed = 0;
  let accuracyValue = 0;
  let retentionForecast = "Pending";
  let deckProgress = 0;

  let isDeckComplete = false;

  if (activeDeck) {
    const reviewedCards = activeDeck.cards.filter(
      (c) =>
        c.correctness !== null &&
        (c.correctness === "wrong" || c.difficulty !== null),
    );
    cardsReviewed = reviewedCards.length;

    const correctCount = reviewedCards.filter(
      (c) => c.correctness === "correct",
    ).length;
    accuracyValue =
      cardsReviewed > 0 ? Math.round((correctCount / cardsReviewed) * 100) : 0;

    deckProgress =
      activeDeck.cards.length > 0
        ? Math.round((cardsReviewed / activeDeck.cards.length) * 100)
        : 0;
    isDeckComplete = cardsReviewed === activeDeck.cards.length;

    if (cardsReviewed > 0) {
      if (accuracyValue >= 80) retentionForecast = "Strong";
      else if (accuracyValue >= 50) retentionForecast = "Moderate";
      else retentionForecast = "Weak";
    }
  }

  const handleExportPDF = () => {
    if (!activeDeck || activeDeck.cards.length === 0) return;
    const doc = new jsPDF("landscape");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const themeColors = {
      dark: {
        bg: [20, 20, 30],
        cardBg: [30, 30, 45],
        text: [255, 255, 255],
        textSec: [156, 163, 175],
        accent: [35, 181, 181],
      },
      light: {
        bg: [243, 244, 246],
        cardBg: [255, 255, 255],
        text: [17, 24, 39],
        textSec: [107, 114, 128],
        accent: [35, 181, 181],
      },
      blue: {
        bg: [15, 23, 42],
        cardBg: [30, 41, 59],
        text: [248, 250, 252],
        textSec: [148, 163, 184],
        accent: [56, 189, 248],
      },
    };
    const c = themeColors[pdfTheme] || themeColors.dark;

    const sizeMultipliers = { small: 0.8, medium: 1, large: 1.25 };
    const sm = sizeMultipliers[pdfFontSize] || 1;
    const _font = pdfFont === "calibri" ? "helvetica" : pdfFont;

    const drawFrame = (pageNum, totalPages, label) => {
      doc.setFillColor(...c.bg);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      doc.setDrawColor(...c.accent);
      doc.setLineWidth(1);
      doc.roundedRect(15, 15, pageWidth - 30, pageHeight - 30, 5, 5);
      doc.setFillColor(...c.cardBg);
      doc.roundedRect(25, 25, pageWidth - 50, pageHeight - 50, 10, 10, "F");
      doc.setFontSize(20 * sm);
      doc.setTextColor(...c.textSec);
      doc.setFont(_font, "normal");
      doc.text(`${activeDeck.title} | ${label}`, 35, 45);
      doc.text(`${pageNum} / ${totalPages}`, pageWidth - 35, 45, {
        align: "right",
      });
    };

    const totalPages = activeDeck.cards.length * 2;
    let currentPage = 1;

    activeDeck.cards.forEach((card, index) => {
      if (index > 0) doc.addPage();
      drawFrame(currentPage, totalPages, `Card ${index + 1} - Question`);

      doc.setFontSize(14 * sm);
      doc.setTextColor(...c.accent);
      doc.setFont(_font, "bold");
      doc.text(`Question ${index + 1}:`, pageWidth / 2, pageHeight / 2 - 40, {
        align: "center",
      });

      doc.setFontSize(22 * sm);
      doc.setTextColor(...c.text);
      doc.setFont(_font, "bold");
      const qLines = doc.splitTextToSize(card.q, pageWidth - 80);
      doc.text(
        qLines,
        pageWidth / 2,
        pageHeight / 2 - (qLines.length * (11 * sm)) / 2 + 5,
        { align: "center" },
      );

      currentPage++;
      doc.addPage();
      drawFrame(currentPage, totalPages, `Card ${index + 1} - Answer`);

      doc.setFontSize(14 * sm);
      doc.setTextColor(...c.accent);
      doc.setFont(_font, "bold");
      doc.text(`Answer ${index + 1}:`, pageWidth / 2, pageHeight / 2 - 40, {
        align: "center",
      });

      doc.setFontSize(18 * sm);
      doc.setTextColor(...c.text);
      doc.setFont(_font, "normal");
      const aLines = doc.splitTextToSize(card.a, pageWidth - 80);
      doc.text(
        aLines,
        pageWidth / 2,
        pageHeight / 2 - (aLines.length * (9 * sm)) / 2 + 5,
        { align: "center" },
      );

      currentPage++;
    });

    const pdfPageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pdfPageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(16 * sm);
      doc.setTextColor(...c.textSec);
      doc.text(`EXPLI | Smart Flashcards`, 35, pageHeight - 15);
      doc.text(
        new Date().toLocaleDateString(),
        pageWidth - 35,
        pageHeight - 15,
        { align: "right" },
      );
    }

    doc.save(
      `${activeDeck.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_flashcards.pdf`,
    );
  };

  return (
    <div className="expli-v3-plan flex flex-1 overflow-hidden relative z-10 bg-[#0A0A0B] text-white">
      <div className="expli-v3-main__bg">
        <div className="expli-v3-main__bg-orb-1" />
        <div className="expli-v3-main__bg-orb-2" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative z-1">
        {/* Header */}
        <div className="px-8 pt-6 pb-5 flex justify-between items-end border-b border-white/5">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1.5">
              Smart Flashcards
            </h1>
            <p className="text-[13px] text-zinc-400">
              AI-generated knowledge with adaptive Next-Level progression.
            </p>
          </div>
          {activeDeck && (
            <button
              onClick={() => setRightPanelTab("export")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#23b5b5] text-black text-[13px] font-semibold cursor-pointer hover:brightness-110 transition-all border-0"
            >
              <Settings size={14} /> Export Settings
            </button>
          )}
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* ====== LEFT PANEL: DECKS & CARDS MAP ====== */}
          <div className="w-[300px] border-r border-white/5 flex flex-col p-6 overflow-y-auto bg-black/20">
            <div className="relative mb-6">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search decks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 pl-8 pr-3 rounded-lg border border-white/5 bg-[#16161f] text-gray-200 text-[13px] outline-none"
              />
            </div>
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Your Decks
            </div>

            {decks.length === 0 ? (
              <div className="text-center py-5 text-gray-500 text-[13px]">
                No decks yet.
                <br />
                Generate one to begin!
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredDecks.map((deck) => {
                  const isActive = activeDeckId === deck.id;
                  const isExpanded = expandedDecks[deck.id];
                  const rCount = deck.cards.filter(
                    (c) =>
                      c.correctness !== null &&
                      (c.correctness === "wrong" || c.difficulty !== null),
                  ).length;

                  return (
                    <div key={deck.id} className="flex flex-col">
                      <div
                        onClick={() => {
                          setActiveDeckId(deck.id);
                          if (isActive) toggleDeckSidebar(deck.id);
                          else
                            setExpandedDecks((prev) => ({
                              ...prev,
                              [deck.id]: true,
                            }));
                          // Auto-resume at first unreviewed card
                          const unrev = deck.cards.findIndex(
                            (c) =>
                              c.correctness === null ||
                              (c.correctness === "correct" &&
                                c.difficulty === null),
                          );
                          if (!isDeckComplete) {
                            setCurrentCardIndex(unrev === -1 ? 0 : unrev);
                            setCardIsFlipped(false);
                          }
                        }}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                          isActive
                            ? "bg-opacity-15"
                            : "border-white/5 bg-white/2"
                        }`}
                        style={
                          isActive
                            ? {
                                borderColor: deck.color,
                                backgroundColor: `${deck.color}15`,
                              }
                            : {}
                        }
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div
                              className={`flex items-center gap-1.5 text-sm font-medium mb-1 ${isActive ? "text-white" : "text-gray-200"}`}
                            >
                              {isExpanded ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronRight size={14} />
                              )}{" "}
                              {deck.title}
                            </div>
                            <div className="text-xs text-zinc-400 ml-5">
                              {deck.cards.length} cards generated
                            </div>
                          </div>
                        </div>
                        <div
                          className="flex items-center gap-1.5 text-xs opacity-80 ml-5"
                          style={{ color: deck.color }}
                        >
                          <Activity size={12} /> {rCount} / {deck.cards.length}{" "}
                          Reviewed
                        </div>
                      </div>

                      {/* Sub-list of Individual Cards */}
                      {isExpanded && (
                        <div
                          className="flex flex-col gap-1 mt-2 pl-4 ml-4"
                          style={{ borderLeft: `2px solid ${deck.color}30` }}
                        >
                          {deck.cards.map((c, i) => {
                            const isWrong = c.correctness === "wrong";
                            const isRight = c.correctness === "correct";
                            const isFinished =
                              (isWrong || isRight) && c.difficulty !== null;

                            let statusCol = "text-gray-500";
                            let statusTxt = "Pending";
                            if (isWrong && c.difficulty) {
                              statusCol = "text-red-500";
                              statusTxt = `Wrong - ${c.difficulty}`;
                            } else if (isWrong) {
                              statusCol = "text-red-500";
                              statusTxt = "Wrong";
                            } else if (isRight && c.difficulty) {
                              statusCol = "text-emerald-500";
                              statusTxt = `Correct - ${c.difficulty}`;
                            } else if (isRight) {
                              statusCol = "text-emerald-500";
                              statusTxt = "Correct";
                            }

                            return (
                              <div
                                key={c.id}
                                onClick={() => {
                                  setActiveDeckId(deck.id);
                                  setCurrentCardIndex(i);
                                  setCardIsFlipped(false);
                                }}
                                className={`px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                                  isActive && currentCardIndex === i
                                    ? "bg-white/10"
                                    : "bg-white/5 hover:bg-white/10"
                                }`}
                              >
                                <div className="text-xs text-white mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                  <span className="text-zinc-400 mr-1.5">
                                    Q{i + 1}:
                                  </span>
                                  {c.q}
                                </div>
                                <div
                                  className={`text-[10px] font-semibold uppercase ${statusCol}`}
                                >
                                  {statusTxt}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ====== CENTER PANEL: CANVAS ====== */}
          <div className="flex-1 px-15 py-8 flex flex-col overflow-y-auto relative">
            <div className="bg-[#14141e]/60 border border-[#23b5b5]/20 rounded-2xl px-6 py-5 mb-8">
              <div className="flex gap-4 items-center">
                <div className="flex-[2]">
                  <label className="text-[13px] text-gray-400 mb-2.5 block">
                    What do you want to learn?
                  </label>
                  <input
                    type="text"
                    placeholder="Data Structures..."
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleGenerateCards()
                    }
                    className="w-full px-[18px] py-3.5 rounded-lg bg-[#16161f] border border-white/10 text-white text-[15px] outline-none transition-colors focus:border-[#23b5b5]/50 focus:bg-[#1a1a24]"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[13px] text-gray-400 mb-2.5 block">
                    Number of cards
                  </label>
                  <input
                    type="number"
                    placeholder="Default 7-10"
                    value={countInput}
                    onChange={(e) => setCountInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleGenerateCards()
                    }
                    min="1"
                    max="50"
                    className="w-full px-[18px] py-3.5 rounded-lg bg-[#16161f] border border-white/10 text-white text-[15px] outline-none transition-colors focus:border-[#23b5b5]/50 focus:bg-[#1a1a24]"
                  />
                </div>
                <div className="pt-6">
                  <button
                    onClick={handleGenerateCards}
                    disabled={isGenerating || !topicInput.trim()}
                    className={`px-6 py-3.5 rounded-lg text-white border-none text-sm font-semibold flex items-center gap-2 transition-all ${
                      isGenerating || !topicInput.trim()
                        ? "bg-gray-700 opacity-60 cursor-not-allowed"
                        : "bg-[#23b5b5] cursor-pointer hover:bg-[#1a8888] hover:shadow-[0_4px_12px_rgba(35,181,181,0.3)]"
                    }`}
                  >
                    <Wand2
                      size={16}
                      className={isGenerating ? "animate-spin" : ""}
                    />{" "}
                    {isGenerating ? "Generating..." : "Generate AI Cards"}
                  </button>
                </div>
              </div>
              {generationError && (
                <div className="text-red-500 text-[13px] mt-3">
                  {generationError}
                </div>
              )}
            </div>

            {!activeDeck ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <Sparkles size={48} className="opacity-20 mb-4" />
                <h3 className="text-lg text-gray-400">
                  Enter a topic to generate a dynamic AI deck.
                </h3>
              </div>
            ) : isDeckComplete ? (
              <div className="flex-1 flex flex-col items-center justify-center text-white text-center">
                <Award size={64} color={activeDeck.color} className="mb-6" />
                <h2 className="text-2xl font-semibold mb-3">Deck Completed!</h2>
                <p className="text-sm text-zinc-400 max-w-[400px] mb-8">
                  You have reviewed all {activeDeck.cards.length} cards. Expli
                  can now formulate a{" "}
                  <strong>Level {activeDeck.level + 1}</strong> deck tailored to
                  the concepts you found difficult or guessed incorrectly.
                </p>
                <button
                  onClick={handleRegenerateNextLevel}
                  disabled={isGenerating}
                  className={`px-7 py-3.5 rounded-xl border-none text-base font-bold flex items-center gap-2.5 transition-all duration-300 ${isGenerating ? "bg-gray-500 cursor-not-allowed" : "text-black cursor-pointer shadow-lg hover:brightness-110"}`}
                  style={
                    !isGenerating
                      ? {
                          backgroundColor: activeDeck.color,
                          boxShadow: `0 8px 24px ${activeDeck.color}40`,
                        }
                      : {}
                  }
                >
                  <Sparkles
                    size={18}
                    className={isGenerating ? "animate-spin" : ""}
                  />
                  {isGenerating
                    ? "Analyzing Adaptations..."
                    : `Generate Level ${activeDeck.level + 1}`}
                </button>

                <button
                  onClick={() => {
                    setCurrentCardIndex(0);
                    setCardIsFlipped(false);
                    isDeckComplete = false;
                  }}
                  className="mt-6 bg-transparent border-none text-gray-500 text-sm underline cursor-pointer hover:text-gray-400"
                >
                  Or review existing deck again
                </button>
              </div>
            ) : (
              <>
                <div
                  onClick={() => setCardIsFlipped(!cardIsFlipped)}
                  className={`flex-1 min-h-[400px] rounded-3xl bg-[#14141e]/80 flex flex-col items-center justify-center px-15 py-10 cursor-pointer relative transition-all duration-300 ${cardIsFlipped ? "[transform:rotateX(2deg)] shadow-xl" : ""}`}
                  style={{ border: `1px solid ${activeDeck.color}50` }}
                >
                  <div className="text-center relative z-10 w-full">
                    <div
                      className="w-12 h-1.5 rounded mx-auto mb-10"
                      style={{
                        backgroundColor: cardIsFlipped
                          ? activeDeck.color
                          : "rgba(255,255,255,0.1)",
                      }}
                    />
                    <span
                      className="text-xs font-bold uppercase tracking-widest mb-4 block"
                      style={{ color: activeDeck.color }}
                    >
                      {cardIsFlipped ? "Answer" : "Question"}
                    </span>
                    <h2
                      className={`text-white max-w-[700px] mx-auto mb-8 leading-relaxed ${cardIsFlipped ? "text-xl font-normal" : "text-[26px] font-medium"}`}
                    >
                      {cardIsFlipped
                        ? activeDeck.cards[currentCardIndex].a
                        : activeDeck.cards[currentCardIndex].q}
                    </h2>
                    <div
                      className={`flex items-center justify-center gap-2 text-gray-500 text-[13px] ${cardIsFlipped ? "opacity-0" : "opacity-100"} transition-opacity`}
                    >
                      <Activity size={14} /> Tap to reveal answer
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 text-gray-500 text-xs">
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={14} /> {activeDeck.title}
                    </span>
                    <span>
                      Card {currentCardIndex + 1} of {activeDeck.cards.length}
                    </span>
                  </div>
                </div>

                {/* Dynamic Assessment UI */}
                <div className="flex flex-col items-center justify-center gap-3 mt-8 min-h-[60px]">
                  <div
                    className={`px-8 py-2 transition-all duration-300 ${cardIsFlipped ? "opacity-100 pointer-events-auto" : "opacity-40 pointer-events-none"}`}
                  >
                    {!activeDeck.cards[currentCardIndex].correctness ? (
                      <>
                        <div className="text-[13px] text-zinc-400 mb-1 text-center">
                          Did you guess correctly?
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              rateCorrectness(true);
                            }}
                            className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-[15px] font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/25 cursor-pointer transition-colors hover:bg-emerald-500/20"
                          >
                            <Check size={18} /> I Got It Right
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              rateCorrectness(false);
                            }}
                            className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-[15px] font-semibold text-red-500 bg-red-500/10 border border-red-500/25 cursor-pointer transition-colors hover:bg-red-500/20"
                          >
                            <X size={18} /> I Got It Wrong
                          </button>
                        </div>
                      </>
                    ) : activeDeck.cards[currentCardIndex].correctness !==
                        null &&
                      !activeDeck.cards[currentCardIndex].difficulty ? (
                      <>
                        <div className="text-[13px] text-zinc-400 mb-1 text-center">
                          How difficult was it?
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              rateDifficulty("hard");
                            }}
                            className="px-6 py-2.5 rounded-lg text-sm font-medium text-amber-500 bg-transparent border border-amber-500/25 cursor-pointer hover:bg-amber-500/10 transition-colors"
                          >
                            Hard
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              rateDifficulty("medium");
                            }}
                            className="px-6 py-2.5 rounded-lg text-sm font-medium text-blue-500 bg-transparent border border-blue-500/25 cursor-pointer hover:bg-blue-500/10 transition-colors"
                          >
                            Medium
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              rateDifficulty("easy");
                            }}
                            className="px-6 py-2.5 rounded-lg text-sm font-medium text-emerald-500 bg-transparent border border-emerald-500/25 cursor-pointer hover:bg-emerald-500/10 transition-colors"
                          >
                            Easy
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-zinc-400 text-sm text-center">
                        Rating recorded. Proceed to next.
                      </div>
                    )}
                  </div>

                  {/* Make Skip always clickable even if card not flipped */}
                  {(!activeDeck.cards[currentCardIndex].correctness ||
                    !activeDeck.cards[currentCardIndex].difficulty) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentCardIndex < activeDeck.cards.length - 1) {
                          setCurrentCardIndex(currentCardIndex + 1);
                          setCardIsFlipped(false);
                        }
                      }}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-gray-400 bg-white/5 border border-white/10 transition-all duration-200 ${currentCardIndex === activeDeck.cards.length - 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:bg-white/10"}`}
                      disabled={
                        currentCardIndex === activeDeck.cards.length - 1
                      }
                    >
                      Skip Question
                    </button>
                  )}
                </div>

                <div className="flex justify-center items-center gap-4 mt-4">
                  <button
                    onClick={() => {
                      setCurrentCardIndex(Math.max(0, currentCardIndex - 1));
                      setCardIsFlipped(false);
                    }}
                    disabled={currentCardIndex === 0}
                    className={`bg-transparent border border-white/10 text-zinc-400 px-4 py-2 rounded-lg ${currentCardIndex === 0 ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:bg-white/5"}`}
                  >
                    ← Previous
                  </button>
                  <span className="text-[13px] text-gray-500">
                    Swap freely without rating
                  </span>
                  <button
                    onClick={() => {
                      setCurrentCardIndex(
                        Math.min(
                          activeDeck.cards.length - 1,
                          currentCardIndex + 1,
                        ),
                      );
                      setCardIsFlipped(false);
                    }}
                    disabled={currentCardIndex === activeDeck.cards.length - 1}
                    className={`bg-transparent border border-white/10 text-zinc-400 px-4 py-2 rounded-lg ${currentCardIndex === activeDeck.cards.length - 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:bg-white/5"}`}
                  >
                    Next →
                  </button>
                </div>

                <div className="mt-auto pt-10">
                  <div className="text-[13px] text-zinc-400 mb-4">
                    Today's Progress
                  </div>
                  <div className="grid grid-cols-4 gap-6">
                    <div>
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Check size={12} /> Reviewed
                      </div>
                      <div className="text-2xl font-semibold text-white">
                        {cardsReviewed}{" "}
                        <span className="text-sm text-gray-500">
                          / {activeDeck.cards.length}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Target size={12} /> Accuracy
                      </div>
                      <div className="text-2xl font-semibold text-white">
                        {accuracyValue}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <BarChart2 size={12} /> Forecast
                      </div>
                      <div
                        className="text-2xl font-semibold"
                        style={{ color: activeDeck.color }}
                      >
                        {retentionForecast}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <RefreshCw size={12} /> Deck Progress
                      </div>
                      <div className="text-2xl font-semibold text-white">
                        {deckProgress}%
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ====== RIGHT PANEL: SETTINGS & SUGGESTIONS ====== */}
          <div className="w-[320px] border-l border-white/5 flex flex-col bg-black/20">
            <div className="flex border-b border-white/5 pt-4">
              <button
                onClick={() => setRightPanelTab("insights")}
                className={`flex-1 pb-4 text-[13px] font-medium bg-transparent border-t-0 border-l-0 border-r-0 cursor-pointer transition-colors ${rightPanelTab === "insights" ? "border-b-2 border-[#23b5b5] text-[#23b5b5]" : "border-b-2 border-transparent text-gray-400 hover:text-gray-300"}`}
              >
                AI Insights
              </button>
              <button
                onClick={() => setRightPanelTab("export")}
                className={`flex-1 pb-4 text-[13px] font-medium bg-transparent border-t-0 border-l-0 border-r-0 cursor-pointer transition-colors ${rightPanelTab === "export" ? "border-b-2 border-[#23b5b5] text-[#23b5b5]" : "border-b-2 border-transparent text-gray-400 hover:text-gray-300"}`}
              >
                Export Options
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {rightPanelTab === "insights" ? (
                <>
                  {accuracyValue < 60 && cardsReviewed > 3 ? (
                    <div className="p-4 rounded-xl bg-[#23b5b5]/5 border border-[#23b5b5]/20 mb-4">
                      <div className="flex items-center gap-2 text-[#23b5b5] text-[13px] font-semibold mb-2">
                        <ShieldAlert size={14} /> Focus Area Identified
                      </div>
                      <p className="text-[13px] text-gray-300 leading-relaxed">
                        It seems you found "{activeDeck?.title}" challenging. We
                        recommend waiting to do a structured Level-Up review.
                      </p>
                    </div>
                  ) : accuracyValue > 85 && cardsReviewed > 3 ? (
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 mb-4">
                      <div className="flex items-center gap-2 text-emerald-500 text-[13px] font-semibold mb-2">
                        <Award size={14} /> Mastered Concept
                      </div>
                      <p className="text-[13px] text-gray-300 leading-relaxed">
                        You are mastering "{activeDeck?.title}" quickly with a
                        high accuracy of {accuracyValue}%. Keep it up!
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 mb-8">
                      <div className="flex items-center gap-2 text-gray-400 text-[13px] font-semibold mb-2">
                        <Activity size={14} /> AI Analysis Pending
                      </div>
                      <p className="text-[13px] text-gray-500 leading-relaxed">
                        Review more cards for Expli AI to analyze your
                        performance and dynamically calculate next level
                        requirements.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="text-[12px] font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                    Background Theme
                  </div>
                  <div className="flex gap-2 mb-6">
                    {["dark", "light", "blue"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setPdfTheme(t)}
                        className={`flex-1 py-2.5 rounded-lg text-[13px] font-medium capitalize border transition-colors cursor-pointer ${pdfTheme === t ? "bg-[#23b5b5]/10 border-[#23b5b5] text-[#23b5b5]" : "bg-transparent border-white/10 text-gray-400 hover:bg-white/5"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="text-[12px] font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                    Font Style
                  </div>
                  <div className="flex flex-col gap-2 mb-6">
                    {["times", "courier", "calibri"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setPdfFont(f)}
                        className={`w-full py-3 px-4 rounded-lg text-[14px] text-left border transition-colors cursor-pointer ${pdfFont === f ? "bg-[#23b5b5]/10 border-[#23b5b5] text-white" : "bg-white/5 border-transparent text-gray-300 hover:bg-white/10"}`}
                        style={{
                          fontFamily: f === "calibri" ? "sans-serif" : f,
                        }}
                      >
                        {f === "times"
                          ? "Times New Roman"
                          : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="text-[12px] font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                    Font Size
                  </div>
                  <div className="flex gap-2 mb-8">
                    {["small", "medium", "large"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setPdfFontSize(s)}
                        className={`flex-1 py-2.5 rounded-lg text-[13px] font-medium capitalize border transition-colors cursor-pointer ${pdfFontSize === s ? "bg-[#23b5b5]/10 border-[#23b5b5] text-[#23b5b5]" : "bg-transparent border-white/10 text-gray-400 hover:bg-white/5"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/5">
                    <button
                      onClick={handleExportPDF}
                      className="w-full py-3.5 bg-[#23b5b5] text-black rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-[#23b5b5]/20 transition-all cursor-pointer"
                    >
                      <Download size={16} /> Generate & Export PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
