import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  FileText,
  Paperclip,
  Image as ImageIcon,
  ArrowUp,
  Copy,
  Check,
  Sparkles,
  MessageSquare,
  Clock,
  Hash,
  Lightbulb,
  X,
  TrendingUp,
  Brain,
  Zap,
  ExternalLink,
  Search,
} from "lucide-react";

// Generate a slug ID from heading text
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// ====== RICH TEXT RENDERER with anchor IDs on headings ======
function RichText({ text }) {
  if (!text) return null;
  return (
    <div className="expli-v3-markdown">
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => <p className="mb-2" {...props} />,
          strong: ({ node, ...props }) => (
            <strong className="text-gray-200 font-bold" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="text-gray-300" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code
              className="bg-[#23b5b5]/10 text-[#23b5b5] px-1.5 py-0.5 rounded text-[0.9em]"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc ml-6 mb-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal ml-6 mb-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="mb-1 text-inherit" {...props} />
          ),
          h1: ({ node, children, ...props }) => {
            const text = String(children);
            return (
              <h1
                id={`section-${slugify(text)}`}
                className="text-xl font-bold mt-4 mb-2 text-gray-200 scroll-mt-5"
                {...props}
              >
                {children}
              </h1>
            );
          },
          h2: ({ node, children, ...props }) => {
            const text = String(children);
            return (
              <h2
                id={`section-${slugify(text)}`}
                className="text-[1.1rem] font-bold mt-3 mb-2 text-gray-200 scroll-mt-5"
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3: ({ node, children, ...props }) => {
            const text = String(children);
            return (
              <h3
                id={`section-${slugify(text)}`}
                className="text-base font-bold mt-2 mb-1 text-gray-200 scroll-mt-5"
                {...props}
              >
                {children}
              </h3>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

// ====== NORMALIZE HEADING TEXT FOR MATCHING ======
function normalizeForMatch(text) {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .replace(/^\d+\.\s*/, "") // remove leading "1. "
    .trim()
    .toLowerCase();
}

// ====== DETECT IF LINE IS A SECTION BOUNDARY ======
function getSectionLevel(line) {
  const trimmed = line.trim();
  // ## Heading → level 2
  const hashMatch = trimmed.match(/^(#{1,4})\s+/);
  if (hashMatch) return hashMatch[1].length;
  // 1. **Bold Heading** → treat as level 2
  if (/^\d+\.\s*\*\*.+\*\*/.test(trimmed)) return 2;
  return 0; // not a heading
}

// ====== EXTRACT FULL SECTION CONTENT FROM MARKDOWN ======
function extractSectionContent(fullText, headingLabel) {
  if (!fullText || !headingLabel) return headingLabel;
  const lines = fullText.split("\n");
  const targetNorm = normalizeForMatch(headingLabel);

  // Step 1: Find the start line of this section
  let startIdx = -1;
  let sectionLevel = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineLevel = getSectionLevel(lines[i]);
    if (lineLevel === 0) continue;

    const lineNorm = normalizeForMatch(
      lines[i].replace(/^#{1,4}\s+/, "").replace(/^\d+\.\s*/, ""),
    );

    // Flexible matching: check if either contains the other
    if (
      lineNorm.includes(targetNorm) ||
      targetNorm.includes(lineNorm) ||
      (targetNorm.length > 8 &&
        lineNorm.includes(
          targetNorm.substring(0, Math.min(targetNorm.length, 25)),
        ))
    ) {
      startIdx = i;
      sectionLevel = lineLevel;
      break;
    }
  }

  if (startIdx === -1) return headingLabel; // fallback

  // Step 2: Find end line — next heading of same or higher level
  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    const lineLevel = getSectionLevel(lines[i]);
    if (lineLevel > 0 && lineLevel <= sectionLevel) {
      endIdx = i;
      break;
    }
  }

  // Step 3: Extract and clean
  const section = lines.slice(startIdx, endIdx).join("\n");
  return section
    .replace(/^#{1,4}\s+/gm, "") // remove heading markers
    .replace(/\*\*\*/g, "") // remove bold-italic
    .replace(/\*\*/g, "") // remove bold
    .replace(/\*/g, "") // remove italic
    .replace(/`/g, "") // remove code markers
    .replace(/^[-]\s+/gm, "• ") // dashes to bullets
    .replace(/\n{3,}/g, "\n\n") // collapse blank lines
    .trim();
}

// ====== DYNAMIC RIGHT SIDEBAR ======
function FocusSidebar({
  messages,
  uploadedFiles,
  keyTopics,
  insights,
  conversationStats,
  onTopicClick,
  onAskDeeper,
  chatContainerRef,
  lastBotText,
}) {
  const [activeTab, setActiveTab] = useState("Outputs");
  const [copiedTopic, setCopiedTopic] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const tabs = ["Outputs", "Context", "Insights"];

  const handleTopicClick = (topic) => {
    setActiveTopic(topic.slug);
    // Scroll to the heading in the chat
    const el = document.getElementById(`section-${topic.slug}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });

      // Highlight flash effect using Tailwind classes where possible, or keep minimal inline for dynamic transition
      el.classList.add(
        "transition-colors",
        "duration-300",
        "bg-[#23b5b5]/15",
        "rounded-md",
        "px-2",
        "py-0.5",
        "-ml-2",
      );
      setTimeout(() => {
        el.classList.remove("bg-[#23b5b5]/15", "px-2", "py-0.5", "-ml-2");
        setActiveTopic(null);
      }, 1500);
    }
  };

  const handleCopyTopic = (topic, e) => {
    e.stopPropagation();
    // Extract full section content (heading + all text until next heading)
    const sectionContent = extractSectionContent(lastBotText, topic.label);
    navigator.clipboard.writeText(sectionContent);
    setCopiedTopic(topic.slug);
    setTimeout(() => setCopiedTopic(null), 2000);
  };

  const handleAskAbout = (topic, e) => {
    e.stopPropagation();
    onAskDeeper(topic.label);
  };

  return (
    <div className="expli-v3-right-sidebar">
      <div className="expli-v3-right-sidebar__tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`expli-v3-right-sidebar__tab ${activeTab === tab ? "expli-v3-right-sidebar__tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab === "Context" && uploadedFiles.length > 0 && (
              <span className="ml-[6px] bg-[#23b5b5] text-black rounded-full px-1.5 py-[1px] text-[10px] font-bold">
                {uploadedFiles.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="expli-v3-right-sidebar__content overflow-y-auto">
        {/* ====== OUTPUTS TAB ====== */}
        {activeTab === "Outputs" && (
          <>
            {/* Session Stats */}
            {conversationStats.totalMessages > 0 && (
              <div className="p-4 border-b border-white/5">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Session Overview
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#23b5b5]/10 rounded-lg py-2.5 px-3">
                    <div className="text-lg font-bold text-[#23b5b5]">
                      {conversationStats.totalMessages}
                    </div>
                    <div className="text-[10px] text-gray-500">Messages</div>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg py-2.5 px-3">
                    <div className="text-lg font-bold text-purple-500">
                      {conversationStats.botResponses}
                    </div>
                    <div className="text-[10px] text-gray-500">Responses</div>
                  </div>
                </div>
              </div>
            )}

            {/* Key Topics — INTERACTIVE */}
            {keyTopics.length > 0 && (
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                  <Hash size={12} />
                  Topics · Click to jump
                </div>
                <div className="flex flex-col gap-1">
                  {keyTopics.map((topic, i) => (
                    <div
                      key={i}
                      onClick={() => handleTopicClick(topic)}
                      className={`group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-200 border ${activeTopic === topic.slug ? "bg-[#23b5b5]/10 border-[#23b5b5]/25" : "bg-white/0 border-white/5 hover:bg-[#23b5b5]/10 hover:border-[#23b5b5]/15"}`}
                    >
                      {/* Topic indicator dot */}
                      <div
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${i < 2 ? "bg-[#23b5b5]" : i < 4 ? "bg-purple-500" : "bg-gray-500"}`}
                      />

                      {/* Topic label */}
                      <span
                        className={`flex-1 text-xs font-medium truncate ${activeTopic === topic.slug ? "text-[#23b5b5]" : "text-gray-300"}`}
                      >
                        {topic.label}
                      </span>

                      {/* Action buttons */}
                      <div className="flex gap-0.5 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                        {/* Copy topic */}
                        <button
                          onClick={(e) => handleCopyTopic(topic, e)}
                          title="Copy topic"
                          className={`w-[22px] h-[22px] rounded border-none bg-transparent flex items-center justify-center cursor-pointer transition-colors duration-150 ${copiedTopic === topic.slug ? "text-[#23b5b5]" : "text-gray-500 hover:text-gray-300"}`}
                        >
                          {copiedTopic === topic.slug ? (
                            <Check size={11} />
                          ) : (
                            <Copy size={11} />
                          )}
                        </button>

                        {/* Ask deeper */}
                        <button
                          onClick={(e) => handleAskAbout(topic, e)}
                          title="Ask more about this"
                          className="w-[22px] h-[22px] rounded border-none bg-transparent text-gray-500 hover:text-gray-300 flex items-center justify-center cursor-pointer transition-colors duration-150"
                        >
                          <Search size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Latest Response Summary */}
            {conversationStats.lastResponseSummary && (
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                  <MessageSquare size={12} />
                  Latest Response
                </div>
                <div className="text-xs text-gray-300 leading-relaxed">
                  {conversationStats.lastResponseSummary}
                </div>
                {conversationStats.lastResponseSections > 0 && (
                  <div className="mt-2 text-[11px] text-[#23b5b5]">
                    {conversationStats.lastResponseSections} sections covered
                  </div>
                )}
              </div>
            )}

            {/* Suggested follow-ups */}
            {conversationStats.suggestedFollowups &&
              conversationStats.suggestedFollowups.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                    <Zap size={12} />
                    Quick Follow-ups
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {conversationStats.suggestedFollowups.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => onAskDeeper(q)}
                        className="px-3 py-2 rounded-lg text-left border border-white/5 bg-white/0 text-gray-400 text-[11px] cursor-pointer font-inherit transition-all duration-200 leading-snug flex items-center gap-2 hover:border-[#23b5b5]/25 hover:text-[#23b5b5] hover:bg-[#23b5b5]/5"
                      >
                        <Sparkles size={12} className="shrink-0" />
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Empty State */}
            {conversationStats.totalMessages === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Sparkles size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-[13px] mb-1">No outputs yet</p>
                <p className="text-[11px]">
                  Start a conversation to see interactive outputs here
                </p>
              </div>
            )}
          </>
        )}

        {/* ====== CONTEXT TAB ====== */}
        {activeTab === "Context" && (
          <>
            {/* Uploaded Files */}
            {uploadedFiles.length > 0 ? (
              <div style={{ padding: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 12,
                  }}
                >
                  <Paperclip size={12} />
                  Uploaded Files ({uploadedFiles.length})
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {uploadedFiles.map((file, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "12px",
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.06)",
                        background: "rgba(255,255,255,0.02)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: "rgba(35,181,181,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FileText size={16} style={{ color: "#23b5b5" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#e5e7eb",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {file.name}
                          </div>
                          <div style={{ fontSize: 10, color: "#6b7280" }}>
                            {file.size} · {file.type || "Document"} ·{" "}
                            {file.uploadedAt}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                style={{ padding: 32, textAlign: "center", color: "#6b7280" }}
              >
                <Paperclip
                  size={32}
                  style={{ margin: "0 auto 12px", opacity: 0.2 }}
                />
                <p style={{ fontSize: 13, marginBottom: 4 }}>
                  No files uploaded
                </p>
                <p style={{ fontSize: 11 }}>
                  Use the paperclip icon to attach files
                </p>
              </div>
            )}

            {/* Conversation History */}
            {messages.length > 0 && (
              <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  <Clock size={12} />
                  Conversation History
                </div>
                <div className="flex flex-col gap-1.5">
                  {messages
                    .filter((m) => m.type === "user")
                    .slice(-5)
                    .map((msg, i) => (
                      <div
                        key={i}
                        onClick={() => onAskDeeper(msg.text)}
                        className="px-3 py-2 rounded-lg bg-white/0 border border-white/5 text-[11px] text-gray-400 truncate cursor-pointer transition-colors duration-150 hover:border-[#23b5b5]/25 hover:text-gray-300 hover:bg-[#23b5b5]/5"
                      >
                        <span className="text-[#23b5b5] mr-1.5">Q:</span>
                        {msg.text.substring(0, 60)}
                        {msg.text.length > 60 ? "..." : ""}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ====== INSIGHTS TAB ====== */}
        {activeTab === "Insights" && (
          <>
            {insights.length > 0 ? (
              <div className="p-4">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  <Lightbulb size={12} />
                  AI Insights
                </div>
                <div className="flex flex-col gap-2.5">
                  {insights.map((insight, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-white/5 bg-white/0"
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {insight.type === "suggestion" && (
                          <Zap size={12} className="text-amber-500" />
                        )}
                        {insight.type === "trend" && (
                          <TrendingUp size={12} className="text-[#23b5b5]" />
                        )}
                        {insight.type === "summary" && (
                          <Brain size={12} className="text-purple-500" />
                        )}
                        <span className="text-[11px] font-semibold text-gray-200">
                          {insight.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 leading-snug">
                        {insight.content}
                      </div>
                      {insight.action && (
                        <button
                          onClick={() => onAskDeeper(insight.action)}
                          className="mt-2 px-2.5 py-1 rounded-md border border-[#23b5b5]/20 bg-[#23b5b5]/10 text-[#23b5b5] text-[10px] font-bold cursor-pointer font-inherit transition-colors duration-150 flex items-center gap-1 hover:bg-[#23b5b5]/20"
                        >
                          <Sparkles size={10} />
                          Ask about this
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Lightbulb size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-[13px] mb-1">No insights yet</p>
                <p className="text-[11px]">
                  Insights will appear as you have deeper conversations
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ====== MAIN FOCUS MODE PAGE ======
export default function AskQuestion() {
  const location = useLocation();
  const initialPrompt = location.state?.initialPrompt || "";
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [keyTopics, setKeyTopics] = useState([]);
  const [insights, setInsights] = useState([]);
  const [conversationStats, setConversationStats] = useState({
    totalMessages: 0,
    botResponses: 0,
    lastResponseSummary: null,
    lastResponseSections: 0,
    suggestedFollowups: [],
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, []);

  // Extract key topics with slugs for scroll anchoring — only uses ## headings
  const extractTopics = (text) => {
    const topics = [];
    const seen = new Set();
    const lines = text.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      // Only match ## headings (the format we enforce in the prompt)
      const headingMatch = trimmed.match(/^(#{2,3})\s+(.+)$/);
      if (headingMatch) {
        const label = headingMatch[2].replace(/\*\*/g, "").trim();
        const norm = label.toLowerCase();
        if (label.length > 2 && label.length < 60 && !seen.has(norm)) {
          seen.add(norm);
          topics.push({ label, slug: slugify(label) });
        }
      }
    }
    return topics.slice(0, 15);
  };

  // Generate suggested follow-ups from the response
  const generateFollowups = (botText, userQuestion) => {
    const topics = extractTopics(botText);
    const followups = [];

    if (topics.length >= 2) {
      followups.push(
        `Explain "${topics[0].label}" in more detail with examples`,
      );
    }
    if (topics.length >= 3) {
      followups.push(`Compare ${topics[1].label} vs ${topics[2].label}`);
    }
    if (userQuestion) {
      followups.push(`What are common mistakes when implementing this?`);
    }

    return followups.slice(0, 3);
  };

  // Generate insights from conversation
  const generateInsights = (allMessages, newBotText) => {
    const newInsights = [];
    const userMessages = allMessages.filter((m) => m.type === "user");
    const botMessages = allMessages.filter((m) => m.type === "bot");
    const newTopics = extractTopics(newBotText);

    if (botMessages.length >= 2) {
      newInsights.push({
        type: "trend",
        title: "Conversation Depth",
        content: `You've explored ${userMessages.length} questions across ${keyTopics.length + newTopics.length} sub-topics. Great depth!`,
      });
    }

    if (newTopics.length >= 3) {
      newInsights.push({
        type: "summary",
        title: "Topics Covered",
        content: `This response covers ${newTopics.length} areas: ${newTopics
          .slice(0, 3)
          .map((t) => t.label)
          .join(
            ", ",
          )}${newTopics.length > 3 ? ` and ${newTopics.length - 3} more` : ""}.`,
        action: `Summarize the key takeaways from: ${newTopics
          .slice(0, 2)
          .map((t) => t.label)
          .join(" and ")}`,
      });
    }

    if (newTopics.length >= 2) {
      newInsights.push({
        type: "suggestion",
        title: "Go Deeper",
        content: `You could explore "${newTopics[0].label}" further for actionable insights.`,
        action: `Give me a detailed breakdown of "${newTopics[0].label}" with real-world examples and best practices`,
      });
    }

    if (uploadedFiles.length > 0) {
      newInsights.push({
        type: "summary",
        title: "File Context Active",
        content: `${uploadedFiles.length} file(s) loaded. Responses are contextualized with your uploaded content.`,
      });
    }

    return newInsights;
  };

  // Handle sending via sidebar (ask deeper / follow-up)
  const handleAskDeeper = useCallback((question) => {
    setInput(question);
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (text) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMsg = {
      id: Date.now(),
      type: "user",
      text: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const apiKey =
        import.meta.env.VITE_TRONE_GEMINI_API_KEY ||
        import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const conversationHistory = messages.slice(-10);

      const fileContext =
        uploadedFiles.length > 0
          ? `\n\nThe user has uploaded these files for context: ${uploadedFiles.map((f) => `"${f.name}" (${f.size})`).join(", ")}. Reference these when relevant.`
          : "";

      const systemPrompt = `You are Expli Focus Mode, an advanced AI assistant designed for deep, focused topic exploration. You provide comprehensive, well-structured answers.${fileContext}

STRICT FORMATTING RULES (you must follow these exactly):
1. Structure every response using ONLY ## markdown headings for main sections and ### for sub-sections
2. NEVER use "1. **Bold Text**" as section headers — always use ## or ### headings instead
3. Use **bold** for key terms within paragraphs
4. Use bullet points (- ) for lists and details under each section
5. Each ## section should have a clear, descriptive title
6. Keep section titles concise (under 50 characters)

Example structure:
## Section Title Here
Explanation paragraph with **key terms** highlighted.
- Detail point one
- Detail point two

### Sub-section Title
More details here.

Always follow this exact format. Never deviate from using ## for main sections.`;

      const contextPrompt =
        conversationHistory.length > 0
          ? `${systemPrompt}\n\nPrevious conversation:\n${conversationHistory.map((m) => `${m.type === "user" ? "User" : "Expli"}: ${m.text}`).join("\n")}\n\nCurrent question: ${messageText}`
          : `${systemPrompt}\n\nUser question: ${messageText}`;

      const payload = {
        contents: [{ parts: [{ text: contextPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
      };

      const res = await axios.post(apiUrl, payload, {
        timeout: 45000,
        headers: { "Content-Type": "application/json" },
      });

      const botText =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received.";
      const botMsg = {
        id: Date.now() + 1,
        type: "bot",
        text: botText,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const updated = [...prev, botMsg];
        const userCount = updated.filter((m) => m.type === "user").length;
        const botCount = updated.filter((m) => m.type === "bot").length;

        // Summary
        const summary = botText
          .replace(/^#{1,3}\s+/gm, "")
          .replace(/\*\*/g, "")
          .replace(/[-*]\s+/g, "")
          .trim()
          .substring(0, 120);

        const sectionCount = (botText.match(/^#{1,3}\s+/gm) || []).length;

        // Generate follow-ups
        const followups = generateFollowups(botText, messageText);

        setConversationStats({
          totalMessages: updated.length,
          botResponses: botCount,
          lastResponseSummary: summary + (summary.length >= 120 ? "..." : ""),
          lastResponseSections: sectionCount,
          suggestedFollowups: followups,
        });

        // Extract and merge topics
        const newTopics = extractTopics(botText);
        setKeyTopics((prev) => {
          const existingSlugs = new Set(prev.map((t) => t.slug));
          const unique = newTopics.filter((t) => !existingSlugs.has(t.slug));
          return [...prev, ...unique].slice(0, 15);
        });

        // Generate insights
        const newInsights = generateInsights(updated, botText);
        setInsights(newInsights);

        return updated;
      });
    } catch (err) {
      console.error("Focus Mode error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          text: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (text, idx) => {
    try {
      // Clean markdown syntax for a proper readable copy
      const cleaned = text
        .replace(/^#{1,3}\s+/gm, "") // remove heading markers
        .replace(/\*\*\*/g, "") // remove bold-italic markers
        .replace(/\*\*/g, "") // remove bold markers
        .replace(/\*/g, "") // remove italic markers
        .replace(/`{3}[\s\S]*?`{3}/g, (m) => m.replace(/`{3}\w*\n?/g, "")) // clean code blocks
        .replace(/`/g, "") // remove inline code markers
        .replace(/^[-] /gm, "• ") // convert dashes to bullets
        .replace(/^\s*[-*]\s+/gm, "• ") // convert markdown bullets to clean bullets
        .replace(/\n{3,}/g, "\n\n") // collapse excessive newlines
        .trim();
      await navigator.clipboard.writeText(cleaned);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const typeMap = {
        pdf: "PDF",
        doc: "Word",
        docx: "Word",
        txt: "Text",
        csv: "CSV",
        xlsx: "Excel",
        pptx: "PowerPoint",
        jpg: "Image",
        png: "Image",
        jpeg: "Image",
      };
      const newFile = {
        name: file.name,
        size:
          file.size > 1024 * 1024
            ? (file.size / (1024 * 1024)).toFixed(1) + " MB"
            : (file.size / 1024).toFixed(0) + " KB",
        type: typeMap[ext] || ext?.toUpperCase() || "File",
        uploadedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        file: file,
      };
      setUploadedFiles((prev) => [...prev, newFile]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (idx) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="expli-v3-ask flex-1 flex overflow-hidden relative z-10">
      {/* Background orbs */}
      <div className="expli-v3-main__bg">
        <div className="expli-v3-main__bg-orb-1" />
        <div className="expli-v3-main__bg-orb-2" />
      </div>
      <div className="expli-v3-ask__main flex-1 flex flex-col overflow-hidden relative z-1">
        {/* File Bar */}
        {uploadedFiles.length > 0 && (
          <div className="flex gap-2 px-8 py-3 border-b border-white/5 overflow-x-auto overflow-y-hidden">
            {uploadedFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#23b5b5]/5 border border-[#23b5b5]/10 shrink-0"
              >
                <FileText size={16} className="text-[#23b5b5]" />
                <div>
                  <div className="text-xs font-medium text-gray-200 max-w-[150px] truncate">
                    {file.name}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {file.size} · {file.type}
                  </div>
                </div>
                <button
                  onClick={() => removeFile(i)}
                  className="w-5 h-5 rounded-full border-none bg-white/5 text-gray-500 flex items-center justify-center cursor-pointer shrink-0 transition-colors hover:bg-white/10"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          className="expli-v3-ask__chat flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6 scroll-smooth"
        >
          {messages.length === 0 && !isTyping && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-[linear-gradient(135deg,rgba(35,181,181,0.15),rgba(139,92,246,0.15))] border border-[#23b5b5]/10">
                <Sparkles size={28} className="text-[#23b5b5]" />
              </div>
              <p className="text-lg font-semibold mb-1.5 text-gray-200">
                Focus Mode
              </p>
              <p className="text-[13px] mb-5 text-center max-w-[400px]">
                Deep dive into any topic. Upload files for context and get
                comprehensive, structured answers.
              </p>
              <div className="flex gap-2 flex-wrap justify-center">
                {[
                  "Explain quantum computing simply",
                  "Analyze my business model",
                  "Help me learn React hooks",
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(suggestion)}
                    className="px-4 py-2 rounded-full border border-white/5 bg-white/5 text-gray-400 text-xs cursor-pointer font-inherit transition-all duration-200 hover:border-[#23b5b5]/30 hover:text-[#23b5b5]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`expli-v3-msg ${msg.type === "user" ? "expli-v3-msg--user" : ""}`}
            >
              <div
                className={`expli-v3-msg__avatar ${msg.type === "user" ? "expli-v3-msg__avatar--user" : "expli-v3-msg__avatar--bot"}`}
              >
                {msg.type === "user" ? "U" : <Sparkles size={14} />}
              </div>
              <div className="expli-v3-msg__content">
                <div
                  className={`expli-v3-msg__label ${msg.type === "user" ? "expli-v3-msg__label--user" : "expli-v3-msg__label--bot"}`}
                >
                  {msg.type === "user" ? "You" : "Expli Focus"}
                  <span
                    style={{
                      fontSize: 10,
                      color: "#4b5563",
                      marginLeft: 8,
                      fontWeight: 400,
                    }}
                  >
                    {msg.timestamp?.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {msg.type === "user" ? (
                  <div className="expli-v3-msg__bubble expli-v3-msg__bubble--user">
                    {msg.text}
                  </div>
                ) : (
                  <div className="expli-v3-msg__bubble expli-v3-msg__bubble--bot">
                    <RichText text={msg.text} />
                  </div>
                )}

                {msg.type === "bot" && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => copyToClipboard(msg.text, idx)}
                      className="flex items-center gap-1 text-[11px] text-gray-500 bg-transparent border-none cursor-pointer px-2 py-1 rounded-md transition-all duration-150 hover:bg-white/5"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check size={12} className="text-[#23b5b5]" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> Copy
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="expli-v3-typing">
              <div
                className="expli-v3-msg__avatar expli-v3-msg__avatar--bot"
                style={{ width: 28, height: 28, fontSize: 11 }}
              >
                <Sparkles size={12} />
              </div>
              <div className="expli-v3-typing__dots">
                <div className="expli-v3-typing__dot" />
                <div className="expli-v3-typing__dot" />
                <div className="expli-v3-typing__dot" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="px-8 pt-4 pb-5 border-t border-white/5">
          <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#111118] px-4 py-3">
            <div className="flex gap-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-8 h-8 rounded-lg border-none bg-transparent text-gray-500 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
              >
                <Paperclip size={16} />
              </button>
              <button className="w-8 h-8 rounded-lg border-none bg-transparent text-gray-500 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                <ImageIcon size={16} />
              </button>
            </div>
            <input
              ref={inputRef}
              placeholder="Ask a question in Focus Mode..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-gray-200 text-sm font-inherit placeholder:text-gray-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isTyping}
              className={`w-9 h-9 rounded-xl border-none flex items-center justify-center shrink-0 transition-all duration-200 ${
                input.trim() && !isTyping
                  ? "bg-[#23b5b5] text-black cursor-pointer shadow-[0_4px_16px_rgba(35,181,181,0.25)] hover:bg-[#20a3a3]"
                  : "bg-white/5 text-white/15 cursor-default"
              }`}
            >
              <ArrowUp size={18} strokeWidth={2.5} />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.pptx,.jpg,.png,.jpeg"
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <FocusSidebar
        messages={messages}
        uploadedFiles={uploadedFiles}
        keyTopics={keyTopics}
        insights={insights}
        conversationStats={conversationStats}
        onTopicClick={() => {}}
        onAskDeeper={handleAskDeeper}
        chatContainerRef={chatContainerRef}
        lastBotText={
          messages.filter((m) => m.type === "bot").slice(-1)[0]?.text || ""
        }
      />
    </div>
  );
}
