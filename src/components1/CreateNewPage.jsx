import React from "react";
import { useNavigate } from "react-router-dom";

export default function AutomatePage() {
  // dotted‑grid background created with a radial‑gradient
  const navigate = useNavigate();
  const dotGrid = {
    backgroundImage: "radial-gradient(#ffffff 1.2px, transparent 1.2px)",
    backgroundSize: "48px 48px",
  };

  return (
    <div
      className="relative min-h-screen text-white overflow-x-hidden"
      style={dotGrid}
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-lg font-medium hover:underline"
      >
        Back
      </button>

      {/* Main vertical stack */}
      <div className="flex flex-col items-center justify-center space-y-10 pt-6 pb-16">
        {/* Greeting card */}
        <div className="w-80 rounded-2xl border-2 border-[#23b5b5] p-6 text-center space-y-4 backdrop-blur-sm">
          <h2 className="text-xl">
            Hello,
            <br />
            <span className="text-2xl font-extrabold">Zeno here !</span>
          </h2>

          <p className="text-sm text-white/80">
            What can I automate for you&nbsp;?
          </p>

          {/* three “placeholder” bullet rows */}
          <div className="space-y-2">
            <BulletRow />
            <BulletRow />
            <BulletRow />
          </div>

          <input
            type="text"
            placeholder="What can I help you with ?"
            className="mt-4 rounded-md border bg-black border-[#23b5b5] px-4 py-2 text-sm hover:bg-[#23b5b5]/10 transition"
          ></input>
        </div>

        {/* OR divider */}
        <DividerWithText>OR</DividerWithText>

        {/* Trigger pill */}
        <Pill
          label="Trigger"
          text="Select your trigger event to start your workflow"
        />

        {/* vertical connector */}
        <div className="w-[3px] h-8 bg-white/70" />

        {/* Action pill */}
        <Pill label="Action" text="Select an action to your trigger event" />
      </div>
    </div>
  );
}

/* --------------- Helper Components --------------- */

function BulletRow() {
  return (
    <div className="flex items-center gap-2">
      <span className="block h-1.5 w-1.5 rounded-full bg-white" />
      <span className="h-px flex-1 bg-white/70" />
    </div>
  );
}

function DividerWithText({ children }) {
  return (
    <div className="flex items-center w-full max-w-xs">
      <div className="flex-1 h-[2px] bg-white/70" />
      <span className="mx-3 text-sm font-semibold">{children}</span>
      <div className="flex-1 h-[2px] bg-white/70" />
    </div>
  );
}

function Pill({ label, text }) {
  return (
    <div className="relative w-80">
      <span className="absolute -top-3 left-4 bg-black px-1 text-xs tracking-wide text-white/60">
        {label}
      </span>
      <div className="rounded-full border-2 border-[#23b5b5] px-6 py-3 text-center text-sm">
        {text}
      </div>
    </div>
  );
}
