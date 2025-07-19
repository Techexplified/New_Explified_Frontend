import React, { useState, useRef } from "react";
import { UploadCloud, Loader2 } from "lucide-react";

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
    <div className=" w-full flex flex-col items-center justify-center bg-black text-teal-300 px-4 py-10 space-y-10">
      <h1 className="text-3xl font-semibold tracking-wide">AI Background Blurrer</h1>

      {/* ─── Upload Panel ─── */}
      <div
        onClick={pickFile}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="w-full max-w-md p-8 border-2 border-dashed border-teal-500 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-black/30 transition"
      >
        {selectedFile ? (
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="preview"
            className="max-h-64 object-contain rounded-lg"
          />
        ) : (
          <>
            <UploadCloud className="w-16 h-16 mb-4 stroke-teal-400" />
            <p className="text-center text-sm opacity-80">
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

      {/* ─── Controls ─── */}
      <div className="w-full max-w-md flex items-center gap-4">
        <label htmlFor="radius" className="whitespace-nowrap text-sm opacity-80">
          Blur radius:
        </label>
        <input
          id="radius"
          type="range"
          min={1}
          max={50}
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="flex-1 accent-teal-500"
        />
        <span className="w-10 text-right font-mono">{radius}</span>
      </div>

      {/* ─── Action Button ─── */}
      <button
        onClick={handleBlur}
        disabled={!selectedFile || loading}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-teal-600 text-black font-medium hover:bg-teal-500 disabled:opacity-50 transition"
      >
        {loading && <Loader2 className="animate-spin" />}
        Blur Background
      </button>

      {/* ─── Result Preview ─── */}
      {resultImg && (
        <div className="w-full max-w-md">
          <h2 className="text-xl mb-2 font-semibold">Result</h2>
          <img src={resultImg} alt="result" className="rounded-lg shadow-xl" />
          <div className="flex justify-center items-center mt-10">
            <button className="bg-teal-600 hover:bg-teal-500 text-black font-medium py-2 px-4 rounded-full">
              <a
                href={resultImg}
                download="blurred.png"
                className="block text-center"
              >
                Download Image
              </a>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
