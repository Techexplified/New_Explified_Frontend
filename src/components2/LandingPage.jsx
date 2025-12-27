import {
  Undo2,
  Redo2,
  Pencil,
  Mic,
  FileText,
  RotateCcw,
  ArrowRight,
  Key,
} from "lucide-react";
import { useState } from "react";
import PptxGenJS from "pptxgenjs";
import WorkFlowButton from "../reusable_components/WorkFlowButton";
import { Link } from "react-router-dom";
import SidebarOnHover from "../reusable_components/SidebarOnHover";
import Provide from "./Provide";

export default function LandingPage() {
  const [topic, setTopic] = useState("");
  const [font, setFont] = useState("Arial");
  const [slideCount, setSlideCount] = useState(5);
  const [generatedContent, setGeneratedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");

  const handleInputChange = (e) => setTopic(e.target.value);

  // Test function disabled in client-only mode
  const testApiKey = async () => {
    alert("Client-only mode: No API key needed.");
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    try {
      setLoading(true);
      setErrorMsg("");
      setGeneratedContent("");

      // Try AI first (Gemini), then fall back to template generator

      const aiKey =
        (localStorage.getItem("gemini_api_token") || "").trim() ||
        "AIzaSyCBPFYlQvdgtu6NC-iHylpQuZJ6vpqFgi8";
      let outline = null;
      if (aiKey) {
        try {
          outline = await generateOutlineWithGemini(
            topic.trim(),
            slideCount,
            aiKey
          );
        } catch (e) {
          console.warn(
            "Gemini generation failed, falling back to template:",
            e
          );
        }
      }

      if (!outline) {
        outline = generateOutline(topic.trim(), slideCount);
      }
      await buildPPT(outline);

      // Display content preview
      const contentText = [
        `Title: ${outline.title}`,
        ...outline.slides.map(
          (s, idx) => `\nSlide ${idx + 1}: ${s.title}\n${s.paragraph}`
        ),
      ].join("\n\n");
      setGeneratedContent(contentText);
    } catch (err) {
      setErrorMsg(err.message || "Failed to generate presentation.");
    } finally {
      setLoading(false);
    }
  };

  async function generateOutlineWithGemini(rawTopic, count, apiKey) {
    const safeCount = Math.max(2, Math.min(15, Number(count) || 5));
    const title = capitalize(rawTopic);

    const prompt = [
      `Topic: ${title}`,
      `Slides: ${safeCount}`,
      "Write one concise, self-contained paragraph (80-120 words) for each slide.",
      "Each paragraph must be directly relevant to the topic and slide focus.",
      "Return ONLY valid JSON with this shape:",
      '{"slides":[{"title":"Slide 1 title","paragraph":"text"}]}',
    ].join("\n");

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Gemini request failed: ${res.status}`);
    }
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const jsonStr = extractJson(text);
    const parsed = JSON.parse(jsonStr);
    const slides = Array.isArray(parsed?.slides) ? parsed.slides : [];

    const normalizedSlides = slides.slice(0, safeCount).map((s, i) => ({
      title: s?.title?.toString()?.trim() || `${title}: Slide ${i + 1}`,
      paragraph: s?.paragraph?.toString()?.trim() || "",
    }));

    // Ensure we have exactly safeCount slides; if fewer, pad with template ones
    while (normalizedSlides.length < safeCount) {
      const templ = generateOutline(title, safeCount).slides[
        normalizedSlides.length
      ];
      normalizedSlides.push(templ);
    }

    return { title, slides: normalizedSlides };
  }

  function extractJson(text) {
    // Remove markdown code fences if present and trim
    const trimmed = String(text || "").trim();
    const fenceMatch = trimmed.match(/```(?:json)?([\s\S]*?)```/i);
    if (fenceMatch) return fenceMatch[1].trim();
    // Try to find first { and last } block
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      return trimmed.slice(start, end + 1);
    }
    return trimmed; // hope it's raw JSON
  }

  function generateOutline(rawTopic, count) {
    const safeCount = Math.max(2, Math.min(15, Number(count) || 5));
    const title = capitalize(rawTopic);

    const baseSections = [
      "Overview",
      "Why It Matters",
      "Key Concepts",
      "Examples & Use Cases",
      "Best Practices",
      "Pitfalls & Challenges",
      "Summary & Next Steps",
    ];

    const slides = Array.from({ length: safeCount }).map((_, i) => {
      const section = baseSections[i % baseSections.length];
      return {
        title: `${title}: ${section}`,
        paragraph: buildParagraphForSection(section, title),
      };
    });

    // Ensure first and last slide are intro/outro
    slides[0] = {
      title: `${title}: Overview`,
      paragraph: `This slide introduces ${title}, explains its scope and why it matters right now, and outlines what the presentation will cover to help you quickly grasp the essentials and the value you can expect.`,
    };
    slides[slides.length - 1] = {
      title: `${title}: Summary & Next Steps`,
      paragraph: `We recap the most important takeaways about ${title}, highlight practical next steps you can act on, and point to resources for deeper learning and successful adoption.`,
    };

    return { title, slides };
  }

  function buildParagraphForSection(section, title) {
    switch (section) {
      case "Why It Matters":
        return `${title} delivers tangible value by improving outcomes, reducing friction, and opening new opportunities. This slide explains why it is relevant now, the benefits for stakeholders, and what changes as ${title} becomes part of your workflow.`;
      case "Key Concepts":
        return `To work effectively with ${title}, it helps to understand a few core ideas and terms. We define the essentials in simple language and show how the pieces fit together so you can build intuition quickly.`;
      case "Examples & Use Cases":
        return `Here we translate ${title} into concrete scenarios. You will see typical use cases, how teams implement them, and what successful outcomes look like so you can model your own adoption.`;
      case "Best Practices":
        return `Adopt ${title} with confidence by following practical guidelines. We cover high‑impact habits, common pitfalls to avoid, and the metrics that indicate whether you are on track.`;
      case "Pitfalls & Challenges":
        return `Every approach has trade‑offs. This slide highlights the most frequent challenges when applying ${title}, why they happen, and proven ways to mitigate or sidestep them.`;
      default:
        return `${title} at a glance: what it is, when to use it, and how it creates value for your audience. This sets context for the rest of the presentation.`;
    }
  }

  function capitalize(text) {
    const t = String(text || "").trim();
    if (!t) return "Presentation";
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  async function getImageBase64(_) {
    // Client-only mode: skip image fetching
    return null;
  }

  function tempPPT() {
    let pptx = new PptxGenJS();
    let slide = pptx.addSlide();

    getImageBase64().then((base64Image) => {
      if (base64Image) {
        slide.addImage({
          data: base64Image,
          x: 1,
          y: 1,
          w: 5,
          h: 5,
        });

        pptx.writeFile("generated.pptx");
      }
    });
  }

  async function buildPPT({ title, slides }) {
    const pptx = new PptxGenJS();

    // Set presentation properties
    pptx.author = "Explified";
    pptx.company = "AI Powered Presentation Generator";
    pptx.subject = title;
    pptx.title = title;

    // Define color palette for consistency
    const colors = {
      primary: "1E40AF", // Deep blue
      secondary: "059669", // Emerald green
      accent: "DC2626", // Red accent
      background: "F8FAFC", // Light blue-gray
      text: "1F2937", // Dark gray
      textLight: "6B7280", // Medium gray
      border: "E5E7EB", // Light gray border
      white: "FFFFFF",
    };

    // Global theme settings
    pptx.theme = {
      headFontFace: `${font} Semibold`,
      bodyFontFace: font,
    };

    // Create title slide
    createTitleSlide(pptx, title, colors);

    // Create content slides
    for (let i = 0; i < slides.length; i++) {
      await createContentSlide(pptx, slides[i], i + 1, slides.length, colors);
    }

    // Create summary slide
    createSummarySlide(pptx, title, slides, colors);

    // Export presentation
    pptx.writeFile(`${title}.pptx`);
  }

  function createTitleSlide(pptx, title, colors) {
    const titleSlide = pptx.addSlide();

    // Background
    titleSlide.background = { fill: colors.background };

    // Main title
    titleSlide.addText(title, {
      x: 1,
      y: 2,
      w: 8,
      h: 1.5,
      fontSize: 44,
      bold: true,
      color: colors.primary,
      fontFace: `${font} Semibold`,
      align: "center",
    });

    // Subtitle
    titleSlide.addText("Breaking Down Complex Topics Simply", {
      x: 1,
      y: 4.2,
      w: 8,
      h: 0.8,
      fontSize: 20,
      color: colors.textLight,
      fontFace: font,
      align: "center",
      italic: true,
    });

    // Decorative element
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: 3,
      y: 5.5,
      w: 4,
      h: 0.1,
      fill: colors.secondary,
      line: { color: colors.secondary, width: 0 },
    });

    // Date/footer
    const currentDate = new Date().toLocaleDateString();
    titleSlide.addText(currentDate, {
      x: 0.5,
      y: 6.8,
      w: 9,
      h: 0.5,
      fontSize: 12,
      color: colors.textLight,
      fontFace: font,
      align: "center",
    });
  }

  async function createContentSlide(
    pptx,
    slideData,
    slideNumber,
    totalSlides,
    colors,
    font = "Segoe UI"
  ) {
    const slide = pptx.addSlide();

    // Background
    slide.background = { fill: colors.background };

    // Header bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: "100%",
      h: 0.3,
      fill: colors.primary,
      line: { color: colors.primary, width: 0 },
    });

    // Slide title box
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fill: colors.white,
      line: { color: colors.border, width: 1 },
    });

    slide.addText(slideData.title, {
      x: 0.7,
      y: 0.65,
      w: 8.6,
      h: 0.7,
      fontSize: 28,
      bold: true,
      color: colors.text,
      fontFace: `${font} Semibold`,
      align: "left",
      valign: "middle",
    });

    // Content area setup
    const contentTopY = 1.6;
    const contentHeight = 4.6;
    const textBoxWidth = 8.5;

    // Text container
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: contentTopY,
      w: textBoxWidth,
      h: contentHeight,
      fill: colors.white,
      line: { color: colors.border, width: 1 },
    });

    // Paragraph text
    const paragraph = slideData.paragraph || "";
    slide.addText(paragraph, {
      x: 0.7,
      y: contentTopY + 0.2,
      w: textBoxWidth - 0.6,
      h: contentHeight - 0.4,
      fontSize: 16,
      color: colors.text,
      fontFace: font,
      align: "left",
      lineSpacingMultiple: 1.2,
      margin: 10,
      valign: "top",
      shrinkText: true,
      breakLine: true,
    });

    // Image
    const imageBase64 = await getImageBase64(slideData.title);
    if (imageBase64) {
      slide.addImage({
        data: imageBase64,
        x: 6,
        y: contentTopY + 0.3,
        w: 3.2,
        h: 3.2,
      });
    } else {
      console.warn("No image found for:", slideData.title);
    }

    // Slide number
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 8.2,
      y: 6.3,
      w: 1.3,
      h: 0.5,
      fill: colors.primary,
      line: { color: colors.primary, width: 0 },
      rectRadius: 0.1,
    });

    slide.addText(`${slideNumber} / ${totalSlides}`, {
      x: 8.2,
      y: 6.3,
      w: 1.3,
      h: 0.5,
      fontSize: 14,
      bold: true,
      color: colors.white,
      fontFace: font,
      align: "center",
      valign: "middle",
    });

    // Footer
    slide.addText(slideData.title, {
      x: 0.5,
      y: 6.5,
      w: 7,
      h: 0.4,
      fontSize: 11,
      color: colors.textLight,
      fontFace: font,
      align: "left",
      italic: true,
    });
  }

  function createSummarySlide(pptx, title, slides, colors) {
    const summarySlide = pptx.addSlide();

    // Background
    summarySlide.background = { fill: colors.background };

    // Header
    summarySlide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: "100%",
      h: 0.3,
      fill: colors.primary,
      line: { color: colors.primary, width: 0 },
    });

    // Title
    summarySlide.addText("Summary", {
      x: 1,
      y: 1,
      w: 8,
      h: 0.8,
      fontSize: 36,
      bold: true,
      color: colors.primary,
      fontFace: `${font} Semibold`,
      align: "center",
    });

    // Section title
    summarySlide.addText("Key Topics Covered:", {
      x: 1,
      y: 2.2,
      w: 8,
      h: 0.5,
      fontSize: 20,
      bold: true,
      color: colors.text,
      fontFace: `${font} Semibold`,
      align: "left",
    });

    // Create plain bullet list (each on a new line)
    const topicsText = slides
      .map((slide, index) => `• ${slide.title}`)
      .join("\n");

    summarySlide.addText(topicsText, {
      x: 1.5,
      y: 2.4,
      w: 7,
      h: 3.5,
      fontSize: 14, // slightly smaller
      color: colors.text,
      fontFace: font,
      align: "left",
      lineSpacingMultiple: 1.3,
    });

    // Thank you message
    summarySlide.addText("Thank You for Your Attention!", {
      x: 1,
      y: 6.2,
      w: 8,
      h: 0.6,
      fontSize: 24,
      bold: true,
      color: colors.secondary,
      fontFace: `${font} Semibold`,
      align: "center",
    });
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleGenerate();
  };

  return (
    <section className="relative min-h-screen w-full bg-gradient-to-br from-minimal-background via-minimal-dark-100 to-minimal-dark-200 text-white overflow-x-hidden font-sans">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#23b5b5]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#23b5b5]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#23b5b5]/5 to-transparent rounded-full animate-spin-slow"></div>
      </div>

      <SidebarOnHover
        link={"https://explified.com/slideshow-maker-ai-tool/"}
        toolName={"AutoDeck AI"}
        id={"presentation"}
      />

      {/* Brand header */}
      <header className="flex flex-col items-center pt-8 px-4 space-y-1 text-center">
        <h1 className="text-[2.8rem] font-extrabold tracking-wide mb-4 border border-gray-600 px-4 py-2">
          AutoDeck <span className="text-[#23b5b5]">AI</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 uppercase tracking-widest">
          From messy ideas to polished decks
        </p>
        <p className="text-xs sm:text-sm text-gray-300 uppercase tracking-widest">
          let AI handle the heavy lifting, while you focus on your message
        </p>
      </header>

      {/* Prompt input */}
      <div className="flex justify-center items-center mt-14 px-4 gap-4">
        <div className="flex items-center space-x-2 border border-[#23b5b5] rounded-3xl py-3 px-4 w-full max-w-lg group hover:shadow-lg hover:shadow-[#23b5b5]/20 transition-all duration-300">
          <input
            type="text"
            placeholder="Enter your topic and see the magic!"
            className="flex-1 bg-transparent outline-none placeholder:text-gray-400 text-sm px-2"
            value={topic}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <Mic className="w-4 h-4 cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-[#23b5b5]" />
        </div>

        {/* Add Key button */}
        <button
          onClick={() => {
            try {
              const saved = localStorage.getItem("gemini_api_token");
              setApiKeyInput(saved || "");
            } catch (e) {}
            setShowApiKeyModal(true);
          }}
          className="flex items-center justify-center w-12 h-12 rounded-full border border-[#23b5b5] hover:text-[#23b5b5] hover:border-[#23b5b5] transition-transform duration-200 hover:scale-110"
          aria-label="Add API Key"
          title="Add API Key"
        >
          <Key className="w-6 h-6" />
        </button>

        {/* Test API Key button */}
        <button
          onClick={testApiKey}
          className="flex items-center justify-center w-12 h-12 rounded-full border border-green-500 hover:text-green-500 hover:border-green-500 transition-transform duration-200 hover:scale-110"
          aria-label="Test API Key"
          title="Test API Key"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        {/* Enhanced generate button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !topic}
          className="flex items-center justify-center w-12 h-12 rounded-full border border-[#23b5b5] hover:text-[#23b5b5] hover:border-[#23b5b5] transition-transform duration-200 hover:scale-110 disabled:opacity-40 hover:shadow-lg hover:shadow-[#23b5b5]/30"
          aria-label="Generate presentation content"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-gray-600 border-t-[#23b5b5] rounded-full animate-spin"></div>
          ) : (
            <ArrowRight className="w-6 h-6" />
          )}
        </button>
      </div>

      <div className="bg-black text-white p-6 rounded-xl max-w-md mx-auto shadow-lg shadow-[#23b5b580]">
        <h3 className="text-[#23b5b5] text-xl font-semibold mb-4">
          Slide Settings
        </h3>

        {/* Slide Count */}
        <div className="mb-5">
          <label className="block text-sm mb-1">Number of Slides:</label>
          <input
            type="number"
            min={2}
            max={15}
            value={slideCount}
            onChange={(e) => setSlideCount(Number(e.target.value))}
            className="w-full px-3 py-2 bg-[#121212] border border-[#23b5b5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#23b5b5] text-white"
          />
        </div>

        {/* Font Selector */}
        <div>
          <label className="block text-sm mb-1">Font Family:</label>
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="w-full px-3 py-2 bg-[#121212] border border-[#23b5b5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#23b5b5] text-white"
          >
            <option value="Arial">Arial</option>
            <option value="Calibri">Calibri</option>
            <option value="Cambria">Cambria</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Segoe UI">Segoe UI</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Verdana">Verdana</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
          </select>
        </div>
      </div>

      {/* <div className="flex justify-end">
        <div className=" flex  justify-center text-white rounded-xl w-20 h-20  mx-auto shadow-lg shadow-[#23b5b580]">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className=" flex items-center disabled:opacity-40"
            aria-label="Generate presentation content"
          >
            <ArrowRight className="w-8 h-8 transition-transform duration-200 hover:scale-110 hover:text-[#23b5b5] border hover:border-[#23b5b5] rounded p-1" />
          </button>
        </div>
      </div> */}

      {/* Test */}
      {loading && (
        <p className="text-center mt-6 text-[#23b5b5] animate-pulse">
          Generating content…
        </p>
      )}
      {errorMsg && <p className="text-center mt-6 text-red-400">{errorMsg}</p>}

      {/* Render generated content */}
      {generatedContent && (
        <div className="mt-10 px-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">
            AI‑Generated Presentation Content
          </h2>
          {/* Keep line‑breaks & markdown formatting */}
          <pre className="whitespace-pre-wrap text-sm text-gray-200 bg-gray-800/40 p-4 rounded-lg border border-gray-700">
            {generatedContent}
          </pre>

          {/* <button
            className="mt-4 underline"
            onClick={() =>
              navigate("/editor", { state: { content: generatedContent } })
            }
          >
            Open in slide editor →
          </button> */}
        </div>
      )}

      {/* <Provide /> */}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">
              AutoDeck AI
            </div>
            <h3 className="text-xl font-semibold text-[#23b5b5] mb-2">
              Gemini API Key
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Enter your Gemini API key. It will be saved in your browser only.
            </p>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#23b5b5] focus:ring-2 focus:ring-[#23b5b5]/20 transition-all duration-300 mb-4"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="px-4 py-2 rounded-xl border border-neutral-700 text-gray-300 hover:text-white hover:border-neutral-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const trimmed = (apiKeyInput || "").trim();
                  if (trimmed) {
                    try {
                      localStorage.setItem("gemini_api_token", trimmed);
                    } catch (e) {}
                  }
                  setShowApiKeyModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#23b5b5] to-[#1a9999] text-white font-medium hover:from-[#1a9999] hover:to-[#23b5b5] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
