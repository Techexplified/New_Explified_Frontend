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

      // const response = await fetch(
      //   `${import.meta.env.VITE_APP_URL}api/gemini/topic`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ topic: topic }),
      //   }
      // );
      // const data = await response.json();

      const data = {
        title: "Photosynthesis",
        slides: [
          {
            title: "Photosynthesis: An Overview",
            bulletPoints: [
              "The process by which plants and some bacteria convert light energy into chemical energy.",
              "Essential for life on Earth, providing energy and oxygen.",
              "Occurs in chloroplasts within plant cells.",
            ],
          },
          {
            title: "Light-Dependent Reactions",
            bulletPoints: [
              "Occur in the thylakoid membranes of chloroplasts.",
              "Light energy is absorbed by chlorophyll and other pigments.",
              "Water is split, releasing oxygen and electrons.",
              "ATP and NADPH are produced (energy carriers).",
            ],
          },
          {
            title: "The Calvin Cycle (Light-Independent)",
            bulletPoints: [
              "Occurs in the stroma of chloroplasts.",
              "Carbon dioxide is fixed (incorporated) into organic molecules.",
              "ATP and NADPH from light reactions provide energy.",
              "Glucose (sugar) is produced.",
            ],
          },
          {
            title: "Key Components: Chloroplasts",
            bulletPoints: [
              "Chloroplasts contain chlorophyll, the primary light-absorbing pigment.",
              "Thylakoids: Internal membrane system where light reactions occur.",
              "Stroma: Fluid-filled space surrounding thylakoids, site of the Calvin cycle.",
            ],
          },
          {
            title: "Factors Affecting Photosynthesis",
            bulletPoints: [
              "Light intensity: Higher intensity generally increases rate.",
              "Carbon dioxide concentration: Increased CO₂ can boost rate.",
              "Temperature: Optimal range is needed for enzyme activity.",
              "Water availability: Lack of water can limit photosynthesis.",
            ],
          },
          {
            title: "Alternative Photosynthetic Pathways",
            bulletPoints: [
              "C4 photosynthesis: Minimizes photorespiration in hot, dry climates.",
              "CAM photosynthesis: Open stomata at night to conserve water.",
              "Adaptations to specific environmental conditions.",
            ],
          },
          {
            title: "Significance of Photosynthesis",
            bulletPoints: [
              "Primary source of energy for most ecosystems.",
              "Produces oxygen necessary for aerobic respiration.",
              "Removes carbon dioxide from the atmosphere, mitigating climate change.",
              "Foundation of the food chain.",
            ],
          },
        ],
      };

      buildPPT(data);

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

  function buildPPT({ title, slides }) {
  const pptx = new PptxGenJS();

  for (let i = 0; i < slides.length; i++) {
    const s = pptx.addSlide();

    /* ---------- Title ---------- */
    s.addText(slides[i].title, {
      x: 0.5,
      y: 0.5,
      fontSize: 24,
      bold: true,
    });

    /* ---------- Bullet points ---------- */
    let bullets = slides[i].bulletPoints;

    // make sure we have an array
    if (typeof bullets === "string") bullets = [bullets];

    // convert to correct object format for PptxGenJS
    const bulletObjects = bullets.map(b => ({
      text: b,
      options: { bullet: true }
    }));

    // now add them
    s.addText(bulletObjects, {
      x: 0.7,
      y: 1.2,
      fontSize: 16,
      color: "363636",
    });
  }

  pptx.writeFile(`${title}.pptx`);
}


  // allow pressing Enter inside the input
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
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center p-2 disabled:opacity-40"
          aria-label="Generate presentation content"
        >
          <ArrowRight className="w-8 h-8 transition-transform duration-200 hover:scale-110 hover:text-[#23b5b5] border hover:border-[#23b5b5] rounded p-1" />
        </button>
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
