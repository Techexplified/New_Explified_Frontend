import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Sparkles,
  Download,
  X,
  Image as ImageIcon,
} from "lucide-react";

const apiKey = "reSe1VEif8KBPdhpzCncgxyF";

const backgroundThumbnails = [
  "./images/background/bg1.jpg",
  "./images/background/bg2.jpg",
  "./images/background/bg3.jpg",
  "./images/background/bg4.jpg",
  "./images/background/bg5.jpg",
  "./images/background/bg6.jpg",
];

const colorOptions = [
  "#ffffff",
  "#000000",
  "#ff5757",
  "#ffc947",
  "#27ae60",
  "#3498db",
  "#9b59b6",
  "#f368e0",
  "#ff9f43",
  "#10ac84",
];

export default function BackgroundRemover() {
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const [isCutoutMode, setIsCutoutMode] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [isErasing, setIsErasing] = useState(true); // Erase vs Restore
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const [isBackgroundMode, setIsBackgroundMode] = useState(false);
  const [backgroundType, setBackgroundType] = useState("magic"); // magic | photo | color
  const [selectedBackground, setSelectedBackground] = useState(null);

  useEffect(() => {
    if (!processedImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const img = new Image();
    img.src = processedImage;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(img, 0, 0);
    };
  }, [processedImage]);

  useEffect(() => {
    if (!preview || processedImage) return; // only show preview when no cutout yet

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const img = new Image();
    img.src = preview;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }, [preview, processedImage]);

  useEffect(() => {
    if (!isCutoutMode) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const previewCanvas = previewCanvasRef.current;
    const previewCtx = previewCanvas.getContext("2d");

    let drawing = false;

    // ✅ Make preview canvas match main canvas size
    previewCanvas.width = canvas.width;
    previewCanvas.height = canvas.height;

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const startDrawing = (e) => {
      drawing = true;
      draw(e);
    };

    const stopDrawing = () => {
      drawing = false;
      ctx.beginPath();
      previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    };

    const draw = (e) => {
      const { x, y } = getPos(e);

      // ✅ STEP 4 — Always update red preview circle
      previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      previewCtx.beginPath();
      previewCtx.arc(x, y, brushSize, 0, Math.PI * 2);
      previewCtx.fillStyle = "rgba(255, 0, 0, 0.6)";
      previewCtx.fill();

      if (!drawing) return;

      // ✅ erase / restore on main canvas
      ctx.globalCompositeOperation = isErasing
        ? "destination-out"
        : "source-over";

      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mousemove", draw);

    // ✅ STEP 5 — Hide brush when leaving canvas
    canvas.addEventListener("mouseleave", () => {
      previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    });

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseleave", () =>
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height)
      );
    };
  }, [isCutoutMode, brushSize, isErasing]);

  useEffect(() => {
    if (isBackgroundMode && selectedBackground) {
      if (selectedBackground.startsWith("#")) {
        applyColorBackground(selectedBackground);
      } else {
        applyImageBackground(selectedBackground);
      }
    }
  }, [isBackgroundMode]);

  useEffect(() => {
    if (selectedBackground) redrawCanvas();
  }, [selectedBackground]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file) => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setError(null);
    setSelectedFile(file);
    setProcessedImage(null);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const removeBackground = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append("size", "auto");
    formData.append("image_file", selectedFile);

    try {
      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Remove.bg API Error: ${response.status}`;

        // Provide more user-friendly error messages
        if (response.status === 401) {
          errorMessage =
            "Invalid API key. Please check your Remove.bg API key.";
        } else if (response.status === 402) {
          errorMessage =
            "API quota exceeded. You can get your own free API key from Remove.bg to continue using this tool.";
        } else if (response.status === 413) {
          errorMessage = "Image file too large. Please use a smaller image.";
        } else if (response.status === 422) {
          errorMessage = "Invalid image format. Please use JPEG, PNG, or WebP.";
        } else {
          errorMessage += ` - ${errorText}`;
        }

        throw new Error(errorMessage);
      }

      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyImageBackground = (imgUrl) => {
    setSelectedBackground(imgUrl); // ✅ store selection
    setTimeout(redrawCanvas, 10);
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const bgImg = new Image();
    bgImg.src = imgUrl;

    bgImg.onload = () => {
      ctx.globalCompositeOperation = "destination-over";
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    };
  };

  const applyColorBackground = (color) => {
    setSelectedBackground(color); // ✅ store selection
    setTimeout(redrawCanvas, 10);
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    if (!canvas || !ctx) return;
    if (!processedImage) return;

    const img = new Image();
    img.src = processedImage;

    img.onload = () => {
      // Step 1 → Resize canvas
      canvas.width = img.width;
      canvas.height = img.height;

      // Step 2 → Clear old content
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Step 3 → Draw background FIRST
      if (selectedBackground) {
        if (selectedBackground.startsWith("#")) {
          ctx.fillStyle = selectedBackground;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          const bg = new Image();
          bg.src = selectedBackground;

          bg.onload = () => {
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

            // Step 4 → Draw cutout image on top
            ctx.drawImage(img, 0, 0);
          };

          return; // ✅ important to prevent double-draw
        }
      }

      // Step 4 → Draw cutout (no background chosen)
      ctx.drawImage(img, 0, 0);
    };
  };

  // const downloadImage = () => {
  //   if (!processedImage) return;

  //   const link = document.createElement("a");
  //   link.href = processedImage;
  //   link.download = `no-bg-${selectedFile?.name?.replace(/\.[^/.]+$/, "")}.png`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "cutout.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const reset = () => {
    setSelectedFile(null);
    setPreview(null);
    setProcessedImage(null);
    setError(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: "#23b5b5" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: "#23b5b5" }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
        <div className="max-w-5xl w-full">
          {/* Header */}
          <div className="text-center mb-8 md:mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Background <span style={{ color: "#23b5b5" }}>Remover</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Remove backgrounds instantly with advanced AI. Perfect results in
              seconds.
            </p>
          </div>

          {/* Main Content */}
          {!selectedFile ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className="relative group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="block cursor-pointer">
                <div
                  className={`relative backdrop-blur-2xl rounded-3xl p-12 md:p-20 text-center transition-all duration-300 ${
                    isDragging ? "scale-105" : "hover:scale-[1.02]"
                  }`}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
                    border: isDragging
                      ? "2px solid #23b5b5"
                      : "2px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: isDragging
                      ? "0 0 40px rgba(35, 181, 181, 0.3)"
                      : "0 8px 32px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <div className="relative mb-8">
                    <div
                      className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(35, 181, 181, 0.2) 0%, rgba(35, 181, 181, 0.1) 100%)",
                      }}
                    >
                      <Upload
                        className="w-12 h-12"
                        style={{ color: "#23b5b5" }}
                      />
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {isDragging ? "Drop your image here" : "Upload your image"}
                  </h3>
                  <p className="text-gray-400 mb-8 text-base md:text-lg">
                    Drag and drop or click to browse
                  </p>

                  <div
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-black transition-all duration-300 bg-gradient-to-r from-teal-400 to-cyan-400 shadow-md hover:shadow-xl hover:scale-105 backdrop-blur-md"
                    style={{
                      boxShadow: "0 6px 20px rgba(0, 200, 200, 0.3)",
                    }}
                  >
                    <ImageIcon className="w-5 h-5" />
                    Choose File
                  </div>

                  <p className="text-gray-500 text-sm mt-6">
                    Supports: JPG, PNG, WEBP
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Display */}
              <div
                className={`relative flex items-center justify-center min-h-96 rounded-2xl overflow-hidden ${
                  processedImage ? "pt-24" : ""
                }`}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <button
                  onClick={reset}
                  className="absolute top-4 right-4 p-3 rounded-xl backdrop-blur-xl transition-all duration-300 hover:scale-110 z-10"
                  style={{
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* TOP TOOLBAR (only visible after processing) */}
                {processedImage && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-white/20 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-xl border border-white/10">
                    <button
                      onClick={() => setIsCutoutMode(true)}
                      className="text-white font-semibold hover:opacity-80"
                    >
                      Cutout
                    </button>
                    <button
                      onClick={() => {
                        setIsCutoutMode(false);
                        setIsBackgroundMode(true);
                      }}
                      className="text-white font-semibold hover:opacity-80"
                    >
                      Background
                    </button>

                    <button className="text-white font-semibold hover:opacity-80">
                      Effects
                    </button>
                    <button className="text-white font-semibold hover:opacity-80">
                      Adjust
                    </button>
                    <button className="text-white font-semibold hover:opacity-80">
                      Design
                    </button>
                    <button className="text-white font-semibold hover:opacity-80">
                      Undo
                    </button>
                    <button className="text-white font-semibold hover:opacity-80">
                      Redo
                    </button>
                    <button className="text-white font-semibold hover:opacity-80">
                      Compare
                    </button>

                    {/* Download button styled differently */}
                    <button
                      onClick={downloadImage}
                      className="ml-3 bg-teal-400 text-black font-bold px-4 py-2 rounded-lg shadow hover:scale-105 transition"
                    >
                      Download
                    </button>
                  </div>
                )}

                {/* ✅ RIGHT SIDE CUTOUT TOOL PANEL */}
                {isCutoutMode && (
                  <div className="absolute right-4 top-28 w-72 bg-white rounded-2xl shadow-xl p-4 z-40">
                    <h2 className="font-bold mb-4 text-gray-800">
                      Magic Brush
                    </h2>

                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => setIsErasing(true)}
                        className={`flex-1 p-3 rounded-xl border ${
                          isErasing
                            ? "border-blue-500 bg-blue-50 text-blue-500"
                            : " border-gray-400 text-gray-800"
                        }`}
                      >
                        Erase
                      </button>

                      <button
                        onClick={() => setIsErasing(false)}
                        className={`flex-1 p-3 rounded-xl border ${
                          !isErasing
                            ? "border-blue-500 bg-blue-50 text-blue-500"
                            : "border-gray-400 text-gray-800"
                        }`}
                      >
                        Restore
                      </button>
                    </div>

                    <div className="mb-4">
                      <p className="font-medium text-gray-700">Brush Size</p>
                      <input
                        type="range"
                        min="5"
                        max="80"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <button
                      onClick={() => setIsCutoutMode(false)}
                      className="mt-3 w-full py-2 text-gray-800 font-bold rounded-xl bg-gray-100 hover:bg-gray-200"
                    >
                      Close
                    </button>
                  </div>
                )}

                {/* ✅ RIGHT SIDE BACKGROUND TOOL PANEL */}
                {isBackgroundMode && (
                  <div className="absolute right-4 top-28 w-80 bg-white rounded-2xl shadow-xl p-4 z-40">
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => setBackgroundType("magic")}
                        className={`flex-1 py-2 rounded-lg font-semibold ${
                          backgroundType === "magic"
                            ? "bg-gray-200"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        Magic
                      </button>
                      <button
                        onClick={() => setBackgroundType("photo")}
                        className={`flex-1 py-2 rounded-lg font-semibold ${
                          backgroundType === "photo"
                            ? "bg-gray-200"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        Photo
                      </button>
                      <button
                        onClick={() => setBackgroundType("color")}
                        className={`flex-1 py-2 rounded-lg font-semibold ${
                          backgroundType === "color"
                            ? "bg-gray-200"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        Color
                      </button>
                    </div>

                    {/* ✅ MAGIC / PHOTO GRID */}
                    {backgroundType !== "color" && (
                      <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
                        {backgroundThumbnails.map((thumb, i) => (
                          <img
                            key={i}
                            src={thumb}
                            onClick={() => applyImageBackground(thumb)}
                            className={`w-full h-20 rounded-lg object-cover cursor-pointer
    ${selectedBackground === thumb ? "ring-4 ring-teal-400" : ""}
  `}
                          />
                        ))}
                      </div>
                    )}

                    {/* ✅ COLOR PICKER GRID */}
                    {backgroundType === "color" && (
                      <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                        {colorOptions.map((color, i) => (
                          <div
                            key={i}
                            onClick={() => applyColorBackground(color)}
                            className={`w-10 h-10 rounded-lg cursor-pointer
    ${selectedBackground === color ? "ring-4 ring-teal-400" : ""}
  `}
                            style={{ background: color }}
                          />
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => setIsBackgroundMode(false)}
                      className="mt-4 w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold"
                    >
                      Close
                    </button>
                  </div>
                )}

                <div
                  className="relative flex items-center justify-center min-h-96 rounded-2xl overflow-hidden"
                  style={{
                    backgroundImage: processedImage
                      ? "repeating-conic-gradient(rgba(255,255,255,0.05) 0% 25%, rgba(255,255,255,0.02) 0% 50%) 50% / 20px 20px"
                      : "linear-gradient(135deg, rgba(35, 181, 181, 0.05) 0%, rgba(0, 0, 0, 0.2) 100%)",
                  }}
                >
                  {/* ✅ White rounded background BEHIND the processed image */}
                  {processedImage && (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div
                        className="w-full h-full rounded-3xl"
                        style={{
                          background: "#ffffff",
                          opacity: 0.9,
                        }}
                      ></div>
                    </div>
                  )}

                  {/* ✅ Actual Image */}
                  <div className="relative">
                    <>
                      <canvas
                        ref={canvasRef}
                        className="relative z-10 max-w-full max-h-96 object-contain"
                      />
                      <canvas
                        ref={previewCanvasRef}
                        className="absolute inset-0 z-20 pointer-events-none max-w-full max-h-96 object-contain"
                      />
                    </>
                  </div>

                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                      <div className="text-center">
                        <div className="relative w-16 h-16 mx-auto mb-4">
                          <div
                            className="absolute inset-0 rounded-full border-4 border-transparent border-t-current animate-spin"
                            style={{ color: "#23b5b5" }}
                          ></div>
                        </div>
                        <p className="text-white font-semibold text-lg">
                          Processing with AI...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm mt-3 text-center font-medium bg-red-100 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <div
                className="inline-flex items-center gap-2 rounded-xl font-semibold text-black transition-all duration-300 bg-gradient-to-r from-teal-400 to-cyan-400 shadow-md hover:shadow-xl hover:scale-105 backdrop-blur-md"
                style={{
                  boxShadow: "0 6px 20px rgba(0, 200, 200, 0.3)",
                }}
              ></div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!processedImage ? (
                  <button
                    onClick={removeBackground}
                    disabled={isProcessing}
                    className="group relative px-8 py-4 rounded-xl font-semibold text-black transition-all duration-300 bg-gradient-to-r from-teal-400 to-cyan-400 shadow-md hover:shadow-xl hover:scale-105 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden"
                    style={{
                      boxShadow: "0 6px 20px rgba(0, 200, 200, 0.3)",
                    }}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    {isProcessing ? (
                      <>
                        <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />
                        Remove Background
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={downloadImage}
                      className="group relative px-8 py-4 rounded-xl font-semibold text-black transition-all duration-300 bg-gradient-to-r from-teal-400 to-cyan-400 shadow-md hover:shadow-xl hover:scale-105 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden text-lg"
                      style={{
                        boxShadow: "0 6px 20px rgba(0, 200, 200, 0.3)",
                      }}
                    >
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <Download className="w-5 h-5" />
                      Download Image
                    </button>
                    <button
                      onClick={() => setProcessedImage(null)}
                      className="px-8 py-5 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-xl"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "white",
                      }}
                    >
                      Process Again
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
