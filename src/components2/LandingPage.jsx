import {
  Undo2,
  Redo2,
  Pencil,
  Mic,
  FileText,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PptxGenJS from "pptxgenjs";

// Reusable bordered box for the three‑step row
const StepBox = ({ label }) => (
  <div className="w-40 h-24 border-2 border-gray-600 rounded-lg flex items-center justify-center text-sm font-medium uppercase tracking-wider transition-transform duration-200 hover:scale-105">
    {label}
  </div>
);

// Grey placeholder block (replace with real assets later)
const Placeholder = ({ className = "" }) => (
  <div className={`bg-gray-700/50 rounded-lg ${className}`} />
);

export default function LandingPage() {
  const [topic, setTopic] = useState("");
  const [font, setFont] = useState("Arial");
  const [slideCount, setSlideCount] = useState(5);
  const [generatedContent, setGeneratedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => setTopic(e.target.value);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    try {
      setLoading(true);
      setErrorMsg("");
      setGeneratedContent("");

      const response = await fetch(`${import.meta.env.VITE_APP_URL}api/gemini/topic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: topic, slideCount: slideCount }),
      });
      const data = await response.json();

      await buildPPT(data.pptData);

      setGeneratedContent(data.content);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  async function getImageBase64(prompt) {
  try {
    const res = await fetch(`${import.meta.env.VITE_APP_URL}api/gemini/image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    return data.base64;
  } catch (err) {
    console.error("Image generation error:", err);
    return null;
  }
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
    const bulletBoxWidth = 5.3;

    // Left box for text
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: contentTopY,
      w: bulletBoxWidth,
      h: contentHeight,
      fill: colors.white,
      line: { color: colors.border, width: 1 },
    });

    // Side accent bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: contentTopY,
      w: 0.1,
      h: contentHeight,
      fill: colors.secondary,
      line: { color: colors.secondary, width: 0 },
    });

    // Bullet text
    const bulletPoints = slideData.bulletPoints || [];

    // Dynamic font size and spacing
    let fontSize = 17;
    let lineSpacingMultiple = 1.1;
    let margin = 2;

    if (bulletPoints.length > 6) fontSize = 15;
    if (bulletPoints.length > 8) fontSize = 14;
    if (bulletPoints.length > 10) fontSize = 13;
    if (bulletPoints.length > 12) fontSize = 12;

    if (bulletPoints.length > 8) lineSpacingMultiple = 1.0;
    if (bulletPoints.length > 10) lineSpacingMultiple = 0.9;

    const bulletText = bulletPoints.map((point) => `• ${point}`).join("\n");

    slide.addText(bulletText, {
      x: 0.7,
      y: contentTopY ,
      w: bulletBoxWidth - 0.4,
      h: contentHeight - 0.4,
      fontSize,
      color: colors.text,
      fontFace: font,
      align: "left",
      lineSpacingMultiple,
      margin,
      shrinkText: true, // allow shrink-to-fit as backup
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
    <section className="relative min-h-screen w-full bg-black text-white overflow-x-hidden font-sans">
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

      <div className="flex justify-center mt-4 px-4 ">
        <section className="w-full max-w-5xl mx-auto mt-12 px-4">
          <h2 className="text-center text-2xl font-medium mb-6 text-gray-400">
            What do we provide?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-600  border-b border-gray-600">
            {/* Box 1 */}
            <div className="flex flex-col items-center py-6 space-y-3">
              <RotateCcw className="w-8 h-8" />
              <div className="mt-2 text-center text-md text-gray-400 space-y-1">
                <p>Instantly update your slides</p>
                <p>Revise your message on the go</p>
              </div>
            </div>

            {/* Box 2 */}
            <div className="flex flex-col items-center py-6 space-y-3">
              <FileText className="w-8 h-8" />
              <div className="mt-2 text-center text-md text-gray-400 space-y-1">
                <p>AI‑powered text creation</p>
                <p>Bullet to paragraph converter</p>
              </div>
            </div>

            {/* Box 3 */}
            <div className="flex flex-col items-center py-6 space-y-3">
              <Pencil className="w-8 h-8" />
              <div className="mt-2 text-center text-md text-gray-400 space-y-1">
                <p>Choose from design styles</p>
                <p>Customize colors & fonts</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Prompt input */}
      <div className="flex justify-center items-center mt-14 px-4 gap-4">
        <div className="flex items-center space-x-2 border border-[#23b5b5] rounded-3xl py-3 px-4  w-full max-w-lg">
          <input
            type="text"
            placeholder="Enter your topic and see the magic!"
            className="flex-1 bg-transparent outline-none placeholder:text-gray-400 text-sm px-2"
            value={topic}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <Mic className="w-4 h-4 cursor-pointer transition-transform duration-200 hover:scale-110" />
        </div>
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

      <div className="flex justify-end">
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
      </div>

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

      {/* 3 easy steps */}
      <h2 className="text-center text-base sm:text-2xl mt-12 px-4 transition-opacity duration-700 ease-out">
        Get a meeting‑ready presentation in just{" "}
        <span className="font-semibold">3 easy steps</span>
      </h2>

      <div className="flex justify-center space-x-6 mt-6">
        <StepBox label="Step 1" />
        <StepBox label="Step 2" />
        <StepBox label="Step 3" />
      </div>

      {/* Use‑cases */}
      <div className="flex flex-col items-center text-center mt-10 tracking-wider px-4 space-y-1">
        <p className="uppercase text-gray-400 mb-4">Can be used for</p>
        <div className="flex flex-col items-center text-gray-200 text-md space-y-1">
          <div>
            <span className="text-white text-xl">Pitch Decks</span> : Product
            Presentations
          </div>
          <div>
            <span className="text-white text-xl">Industry Reports</span>: Sales
            Presentations
          </div>
          <div>
            <span className="text-white text-xl">Marketing Presentations</span>{" "}
            : Business Presentations
          </div>
        </div>
      </div>

      {/* Representation blocks */}
      <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-12 px-6 max-w-6xl mx-auto">
        {/* Row 1 */}
        <div className="flex flex-col space-y-2 order-1 sm:order-none">
          <h3 className="text-3xl font-medium">Visual Representation</h3>
          <p className="text-gray-400 text-md max-w-xs">
            To notch up your presentation
          </p>
        </div>
        <Placeholder className="h-40 sm:h-48 order-0 sm:order-none" />

        {/* Row 2 */}
        <Placeholder className="h-40 sm:h-48" />
        <div className="flex flex-col space-y-2">
          <h3 className="text-3xl font-medium">Animating Representation</h3>
          <p className="text-gray-400 text-md max-w-xs">
            To make your presentation pop
          </p>
        </div>

        {/* Row 3 */}
        <div className="flex flex-col space-y-2 order-1 sm:order-none">
          <h3 className="text-3xl font-medium">SpeakerFlow Scripts</h3>
          <p className="text-gray-400 text-md max-w-xs">To know what to say</p>
        </div>
        <Placeholder className="h-40 sm:h-48 order-0 sm:order-none" />
      </section>

      {/* Templates grid */}
      <h2 className="text-center text-base sm:text-lg mt-20 px-4">
        Experience our variety of templates on various topics
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8 px-6">
        <Placeholder className="h-20" />
        <Placeholder className="h-20" />
        <Placeholder className="h-20" />
        <Placeholder className="h-20" />
        <Placeholder className="h-20" />
        <Placeholder className="h-20" />
      </div>

      {/* Explore more */}
      <div className="text-center mt-16 mb-20 space-y-4 px-4">
        <h3 className="text-sm sm:text-base uppercase tracking-widest text-gray-400">
          Explore more from Explified
        </h3>
        <div className="flex justify-center space-x-6 text-xs sm:text-sm">
          <a
            href="#"
            className="underline underline-offset-2 decoration-emerald-400 transition-transform duration-200 hover:scale-105"
          >
            Tool 1
          </a>
          <a
            href="#"
            className="underline underline-offset-2 decoration-emerald-400 transition-transform duration-200 hover:scale-105"
          >
            Tool 2
          </a>
          <a
            href="#"
            className="underline underline-offset-2 decoration-emerald-400 transition-transform duration-200 hover:scale-105"
          >
            Tool 3
          </a>
          <a
            href="#"
            className="underline underline-offset-2 decoration-emerald-400 transition-transform duration-200 hover:scale-105"
          >
            Tool 4
          </a>
        </div>
      </div>
    </section>
  );
}
