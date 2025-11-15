import React, { useState, useRef, useEffect } from "react";
import "./BGRemover.css";
import { LayoutDashboard, Undo2, Redo2, Pilcrow, Heading } from "lucide-react";
import { Upload, Download, X, Image as ImageIcon } from "lucide-react";
import { Type } from "lucide-react";

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
  const [selectedBackground, setSelectedBackground] = useState(null);

  const [isEffectsMode, setIsEffectsMode] = useState(false);
  const [blurEnabled, setBlurEnabled] = useState(false);
  const [blurAmount, setBlurAmount] = useState(10); // default blur level

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [isDesignMode, setIsDesignMode] = useState(false);
  const [textElements, setTextElements] = useState([]);
  const [activeTextId, setActiveTextId] = useState(null); // which one is being edited

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
      saveCanvasState(); // save before editing
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      // If user clicked inside any editable text box, do nothing
      if (e.target.closest(".editable-text")) {
        return;
      }

      // If user clicked inside the design panel (toolbar), also do nothing
      if (e.target.closest(".design-panel")) {
        return;
      }

      // Otherwise close edit mode
      setActiveTextId(null);
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const applyImageBackground = (imgUrl) => {
    saveCanvasState();
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
    saveCanvasState();
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

  // Save current canvas state to undo stack
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    setUndoStack((prev) => [...prev, dataUrl]);
    setRedoStack([]); // clear redo after new action
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
            ctx.filter = blurEnabled ? `blur(${blurAmount}px)` : "none";
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
            ctx.filter = "none";

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

  const addTextElement = (type) => {
    const defaultStyles = {
      heading: { fontSize: "32px", fontWeight: "bold", text: "Add a heading" },
      subheading: {
        fontSize: "24px",
        fontWeight: "600",
        text: "Add a subheading",
      },
      paragraph: {
        fontSize: "16px",
        fontWeight: "normal",
        text: "Add a paragraph",
      },
    };

    const style = defaultStyles[type];
    const id = Date.now();

    const newText = {
      id,
      type,
      text: style.text,
      x: 100,
      y: 100,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      isDragging: false,
    };

    setTextElements((prev) => [...prev, newText]);
    setActiveTextId(id); // start in edit mode

    setTimeout(() => {
      const el = document.querySelector(`[data-text-id="${id}"]`);
      if (el) {
        // make it editable then focus and move caret
        el.focus();
        placeCaretAtEnd(el);
      }
    }, 50);
  };

  const handleTextChange = (id, newText) => {
    setTextElements((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  const handleMouseDown = (e, id) => {
    setActiveTextId(id); // also enter edit mode when clicked

    const element = textElements.find((t) => t.id === id);
    if (!element) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = element.x;
    const initialY = element.y;

    const handleMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      setTextElements((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, x: initialX + dx, y: initialY + dy } : t
        )
      );
    };

    const stopDrag = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stopDrag);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopDrag);
  };

  // Put this inside the component
  const placeCaretAtEnd = (el) => {
    if (!el) return;
    // If the element is empty, put a zero-width space so caret can be placed,
    // then remove it after selection (prevents some browsers from placing caret at start)
    if (el.textContent.length === 0) {
      el.textContent = "\u200B";
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      // remove the zwsp but keep caret: setTimeout to let the browser settle
      setTimeout(() => {
        // remove the zwsp only if nothing else was typed
        if (el.textContent === "\u200B") el.textContent = "";
      }, 0);
      return;
    }

    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false); // move caret to the end (false = end)
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Effects */}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
        <div className="max-w-5xl w-full">
          {/* Header */}

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
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-neutral-800/80 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-lg border border-neutral-700">
                    <button>Cutout</button>
                    <button>Background</button>
                    <button>Effects</button>

                    {/* Design */}
                    <button
                      onClick={() => {
                        setIsCutoutMode(false);
                        setIsBackgroundMode(false);
                        setIsEffectsMode(false);
                        setIsDesignMode(true);
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-sm transition-all ${
                        isDesignMode
                          ? "bg-neutral-700 text-teal-300"
                          : "text-gray-300 hover:bg-neutral-700/60 hover:text-white"
                      }`}
                    >
                      <LayoutDashboard size={16} />
                      Design
                    </button>

                    {/* Divider */}
                    <div className="w-px h-6 bg-neutral-600 mx-1"></div>

                    <button>
                      <Undo2 size={18} />
                    </button>

                    <button>
                      <Redo2 size={18} />
                    </button>

                    {/* Download */}
                    <button
                      onClick={downloadImage}
                      className="ml-2 bg-teal-500 hover:bg-teal-400 text-black font-semibold px-5 py-2 rounded-full flex items-center gap-1 transition"
                    >
                      <Download size={18} />
                      Download
                    </button>
                  </div>
                )}

                {isDesignMode && (
                  <div className="design-panel absolute right-4 top-28 w-80 bg-neutral-800/90 backdrop-blur-xl text-gray-200 rounded-2xl shadow-2xl p-5 z-40 border border-neutral-700">
                    {/* Add Heading */}
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-700/60 transition-colors">
                      <Heading className="w-5 h-5 text-teal-400" />
                      <button
                        onClick={() => addTextElement("heading")}
                        className="font-medium"
                      >
                        Add a Heading
                      </button>
                    </div>

                    {/* Add Subheading */}
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-700/60 transition-colors">
                      <Type className="w-5 h-5 text-teal-400" />
                      <button
                        onClick={() => addTextElement("subheading")}
                        className="font-medium"
                      >
                        Add a Subheading
                      </button>
                    </div>

                    {/* Add Paragraph */}
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-700/60 transition-colors">
                      <Pilcrow className="w-5 h-5 text-teal-400" />
                      <button
                        onClick={() => addTextElement("paragraph")}
                        className="font-medium"
                      >
                        Add a Paragraph
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-5 border-t border-neutral-700 pt-3 text-center">
                      <button
                        onClick={() => setIsDesignMode(false)}
                        className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 duration-200 font-semibold text-gray-200"
                      >
                        Close
                      </button>
                    </div>
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
                        className={`relative z-10 ${
                          isDesignMode ? "pointer-events-none" : ""
                        } max-w-full max-h-96 object-contain`}
                      />
                      <canvas
                        ref={previewCanvasRef}
                        className={`absolute inset-0 z-20 pointer-events-none max-w-full max-h-96 object-contain`}
                      />
                      {/* ✅ Render editable text elements */}
                      {textElements.map((t) => (
                        <div
                          key={t.id}
                          data-text-id={t.id}
                          contentEditable={activeTextId === t.id}
                          suppressContentEditableWarning
                          spellCheck={false}
                          dir="ltr"
                          onInput={(e) =>
                            handleTextChange(t.id, e.currentTarget.textContent)
                          }
                          onFocus={(e) => {
                            placeCaretAtEnd(e.currentTarget);
                            setActiveTextId(t.id);
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            if (e.target === e.currentTarget)
                              handleMouseDown(e, t.id);
                          }}
                          style={{
                            position: "absolute",
                            top: `${t.y}px`,
                            left: `${t.x}px`,
                            fontSize: t.fontSize,
                            fontWeight: t.fontWeight,
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            direction: "ltr",
                            textAlign: "left",
                            cursor: activeTextId === t.id ? "text" : "grab",
                            userSelect: "text",
                            outline:
                              activeTextId === t.id
                                ? "1px dashed teal"
                                : "none",
                            background:
                              activeTextId === t.id
                                ? "rgba(0,0,0,0.3)"
                                : "transparent",
                            minWidth: "50px",
                            zIndex: 50,
                            whiteSpace: "pre-wrap",
                          }}
                          className="editable-text"
                        >
                          {t.text}
                        </div>
                      ))}
                    </>
                  </div>

                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                      <div className="text-center">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
