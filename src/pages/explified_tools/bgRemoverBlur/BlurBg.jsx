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
    <div className="bg-black w-full text-gray-200 px-4 py-6">
  <div className="max-w-6xl mx-auto">
    {/* Header */}
    <div className="text-center mb-6">
      <div className="bg-black border border-neutral-800 rounded-2xl px-6 py-4 shadow">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-[#23b5b5] to-cyan-400 rounded-full mb-3">
          <UploadCloud className="w-7 h-7 text-black" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          AI Background <span className="text-[#23b5b5]">Blurrer</span>
        </h1>
        <p className="text-neutral-400 text-base max-w-2xl mx-auto">
          Blur the background of your images with AI. Upload, adjust the
          radius, and process in seconds.
        </p>
      </div>
    </div>

    {/* Upload Panel */}
    <div className="bg-black border border-neutral-800 rounded-2xl p-6 mb-6 backdrop-blur">
      <div
        onClick={pickFile}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="w-full p-10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition text-center hover:bg-[#23b5b5]/5 hover:border-[#23b5b5]/50"
      >
        {selectedFile ? (
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="preview"
            className="max-h-64 object-contain rounded-lg"
          />
        ) : (
          <>
            <UploadCloud className="w-16 h-16 mb-4 stroke-[#23b5b5]" />
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
    <div className="bg-black border border-neutral-800 rounded-2xl p-6 mb-6 backdrop-blur">
      <div className="w-full flex items-center gap-4">
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
          className="flex-1 accent-[#23b5b5]"
        />
        <span className="w-10 text-right font-mono">{radius}</span>
      </div>
    </div>

    {/* Action */}
    <div className="text-center mb-6">
      <button
        onClick={handleBlur}
        disabled={!selectedFile || loading}
        className="inline-flex items-center gap-2 px-10 py-3 rounded-full bg-gradient-to-r from-[#23b5b5] to-cyan-400 text-black font-semibold hover:from-[#23b5b5]/90 hover:to-cyan-400/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-[#23b5b5]/20"
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        Blur Background
      </button>
    </div>

    {/* Result Preview */}
    {resultImg && (
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 backdrop-blur">
        <div className="w-full">
          <h2 className="text-base font-semibold text-white mb-3 text-center">
            Result
          </h2>
          <img src={resultImg} alt="result" className="rounded-xl shadow" />
          <div className="flex justify-center items-center mt-6">
            <a href={resultImg} download="blurred.png">
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#23b5b5] to-cyan-400 text-black font-semibold py-2 px-6 rounded-full">
                <Download className="w-5 h-5" />
                Download Image
              </button>
            </a>
          </div>
        </div>
      </div>
    )}
  </div>
</div>

  );
}
