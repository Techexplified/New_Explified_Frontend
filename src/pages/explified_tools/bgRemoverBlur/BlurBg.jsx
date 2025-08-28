import React, { useState, useRef } from "react";
import { UploadCloud, Loader2, Download } from "lucide-react";

/**
 * Dark‑themed (black + teal) UI for the AI background‑blur tool.
 * Logic is identical to your previous version – only the UI/UX is upgraded.
 */
export default function BlurBgApp() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [radius, setRadius] = useState(10);
  const [resultImg, setResultImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // ───────────────────────── helpers ──────────────────────────
  const pickFile = () => inputRef.current?.click();

  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setResultImg(null); // reset any previous result
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setResultImg(null);
    }
  };

  const handleBlur = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append("image", selectedFile);
      form.append("radius", radius);

      const res = await fetch(`${import.meta.env.VITE_APP_URL}api/bg/blur-bg`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      setResultImg(URL.createObjectURL(blob));
    } catch (err) {
      alert(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────── UI ───────────────────────────────
  return (
    <div className="bg-black w-full text-gray-200 px-4 py-10 min-h-screen max-w-2xl mx-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-3xl px-8 py-6 shadow-xl backdrop-blur-md hover:shadow-cyan-400/10 transition">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#23b5b5] to-cyan-400 rounded-2xl shadow-lg shadow-cyan-500/30 mb-4 animate-pulse">
              <UploadCloud className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
              AI Background <span className="text-[#23b5b5]">Blurrer</span>
            </h1>
            <p className="text-neutral-400 text-base max-w-2xl mx-auto">
              Blur the background of your images with AI. Upload, adjust the
              radius, and process in seconds.
            </p>
          </div>
        </div>

        {/* Upload Panel */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-3xl p-6 backdrop-blur-md shadow-lg">
          <div
            onClick={pickFile}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="w-full p-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer text-center transition relative group hover:border-[#23b5b5] hover:bg-[#23b5b5]/5"
          >
            {/* Glow border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#23b5b5] to-cyan-400 opacity-0 group-hover:opacity-10 blur-xl transition" />
            {selectedFile ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="preview"
                className="max-h-64 object-contain rounded-xl shadow-lg shadow-black/40"
              />
            ) : (
              <>
                <UploadCloud className="w-16 h-16 mb-4 stroke-[#23b5b5] animate-bounce" />
                <p className="text-sm text-neutral-300">
                  Click or drag an image here to upload
                </p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleSelect}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="max-w-72 mx-auto bg-neutral-900/70 border border-neutral-800 rounded-3xl p-6 backdrop-blur-md shadow-lg">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <label
              htmlFor="radius"
              className="whitespace-nowrap text-sm text-neutral-300"
            >
              Blur radius:
            </label>
            <input
              id="radius"
              type="range"
              min={1}
              max={50}
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="flex-1 accent-[#23b5b5] cursor-pointer"
            />
            <span className="w-10 text-right font-mono">{radius}</span>
          </div>
        </div>

        {/* Action */}
        <div className="text-center">
          <button
            onClick={handleBlur}
            disabled={!selectedFile || loading}
            className="inline-flex items-center gap-2 px-12 py-3 rounded-full bg-gradient-to-r from-[#23b5b5] to-cyan-400 text-black font-semibold shadow-lg shadow-cyan-500/30 hover:scale-105 hover:shadow-cyan-400/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            Blur Background
          </button>
        </div>

        {/* Result Preview */}
        {resultImg && (
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-3xl p-6 backdrop-blur-md shadow-lg">
            <h2 className="text-base font-semibold text-white mb-4 text-center">
              Result
            </h2>
            <img
              src={resultImg}
              alt="result"
              className="rounded-xl shadow-lg mx-auto"
            />
            <div className="flex justify-center mt-6">
              <a href={resultImg} download="blurred.png">
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#23b5b5] to-cyan-400 text-black font-semibold py-2 px-6 rounded-full shadow hover:scale-105 transition">
                  <Download className="w-5 h-5" />
                  Download Image
                </button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
