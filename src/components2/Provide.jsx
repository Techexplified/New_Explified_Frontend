import { FileText, Pencil, RotateCcw } from "lucide-react";
import React from "react";
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

function Provide() {
  return (
    <>
      <div className="flex justify-center mt-4 px-4 ">
        <section className="w-full max-w-5xl mx-auto mt-12 px-4">
          <h2 className="text-center text-2xl font-medium mb-6 text-gray-400">
            What do we provide?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-600  border-b border-gray-600">
            <div className="flex flex-col items-center py-6 space-y-3">
              <RotateCcw className="w-8 h-8" />
              <div className="mt-2 text-center text-md text-gray-400 space-y-1">
                <p>Instantly update your slides</p>
                <p>Revise your message on the go</p>
              </div>
            </div>

            <div className="flex flex-col items-center py-6 space-y-3">
              <FileText className="w-8 h-8" />
              <div className="mt-2 text-center text-md text-gray-400 space-y-1">
                <p>AI‑powered text creation</p>
                <p>Bullet to paragraph converter</p>
              </div>
            </div>

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
    </>
  );
}

export default Provide;
