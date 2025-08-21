import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  ChevronLeft,
  ChevronRight,
  FileText,
  Type,
  Square,
  Circle,
  Highlighter,
  MousePointer,
  Edit3,
  Download,
} from "lucide-react";


const PdfEditor = () => {
  const [pdfBytes, setPdfBytes] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentTool, setCurrentTool] = useState("select");
  const [pageAnnotations, setPageAnnotations] = useState({});
  const [librariesLoaded, setLibrariesLoaded] = useState(false);
  const [currentColor, setCurrentColor] = useState("#ff0000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingShape, setDrawingShape] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);

  // Available tools
  const tools = [
    { id: "select", name: "Select", icon: MousePointer },
    { id: "text", name: "Text", icon: Type },
    { id: "rectangle", name: "Rectangle", icon: Square },
    { id: "circle", name: "Circle", icon: Circle },
    { id: "pen", name: "Pen", icon: Edit3 },
    { id: "highlight", name: "Highlight", icon: Highlighter },
  ];

  // Predefined colors
  const colors = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#000000",
    "#808080",
    "#ffffff",
    "#ffa500",
    "#800080",
    "#008000",
  ];

  // Load libraries
  useEffect(() => {
    const loadLibraries = async () => {
      // Load Fabric.js
      if (!window.fabric) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "/libs/fabric.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Load PDF.js
      if (!window.pdfjsLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "/libs/pdf.min.js";
          script.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "/libs/pdf.worker.min.js";
            resolve();
          };
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Load PDF-lib
      if (!window.PDFLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "/libs/pdf-lib.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      setLibrariesLoaded(true);
    };

    loadLibraries().catch(console.error);
  }, []);

  // Initialize Fabric canvas
  useEffect(() => {
    if (librariesLoaded && canvasRef.current && !fabricCanvas.current) {
      try {
        const canvas = new window.fabric.Canvas(canvasRef.current, {
          backgroundColor: "#ffffff",
          selection: true,
        });
        canvas.setHeight(600);
        canvas.setWidth(800);
        fabricCanvas.current = canvas;

        // Set up canvas event listeners
        setupCanvasEvents(canvas);

        
      } catch (error) {
        console.error("Error initializing Fabric canvas:", error);
      }
    }

    return () => {
      if (fabricCanvas.current) {
        fabricCanvas.current.dispose();
        fabricCanvas.current = null;
      }
    };
  }, [librariesLoaded]);

  // Setup canvas event listeners
  const setupCanvasEvents = (canvas) => {
    // Mouse down event
    canvas.on("mouse:down", (options) => {
      const pointer = canvas.getPointer(options.e);

      if (currentTool === "text") {
        addTextAnnotation(pointer.x, pointer.y);
      } else if (["rectangle", "circle", "line"].includes(currentTool)) {
        startDrawingShape(pointer);
      }
    });

    // Mouse move event for shape drawing
    canvas.on("mouse:move", (options) => {
      if (isDrawing && drawingShape && startPoint) {
        const pointer = canvas.getPointer(options.e);
        updateDrawingShape(pointer);
      }
    });

    // Mouse up event
    canvas.on("mouse:up", (options) => {
      if (isDrawing && drawingShape) {
        finishDrawingShape();
      }
    });

    // Double click to edit text
    canvas.on("mouse:dblclick", (options) => {
      if (options.target && options.target.type === "i-text") {
        options.target.enterEditing();
      }
    });
  };

  // Add text annotation
  const addTextAnnotation = (x, y) => {
    if (!fabricCanvas.current) return;

    const canvas = fabricCanvas.current;

    const text = new window.fabric.IText("Click to edit text", {
      left: x,
      top: y,
      fontSize: 16,
      fill: currentColor,
      fontFamily: "Arial",
      isBackground: false,
      selectable: true,
      editable: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();

    // Auto-enter editing mode
    setTimeout(() => {
      text.enterEditing();
    }, 100);
  };

  // Start drawing shape
  const startDrawingShape = (pointer) => {
    if (!fabricCanvas.current) return;

    const canvas = fabricCanvas.current;
    setIsDrawing(true);
    setStartPoint(pointer);

    let shape;

    switch (currentTool) {
      case "rectangle":
        shape = new window.fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          width: 0,
          height: 0,
          fill: "transparent",
          stroke: currentColor,
          strokeWidth: strokeWidth,
          isBackground: false,
          selectable: false, // Disable selection while drawing
        });
        break;

      case "circle":
        shape = new window.fabric.Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 0,
          fill: "transparent",
          stroke: currentColor,
          strokeWidth: strokeWidth,
          isBackground: false,
          selectable: false, // Disable selection while drawing
        });
        break;

      case "line":
        shape = new window.fabric.Line(
          [pointer.x, pointer.y, pointer.x, pointer.y],
          {
            stroke: currentColor,
            strokeWidth: strokeWidth,
            isBackground: false,
            selectable: false, // Disable selection while drawing
          }
        );
        break;
    }

    if (shape) {
      canvas.add(shape);
      setDrawingShape(shape);
      canvas.renderAll();
    }
  };

  // Update drawing shape
  const updateDrawingShape = (pointer) => {
    if (!drawingShape || !startPoint) return;

    const canvas = fabricCanvas.current;

    switch (currentTool) {
      case "rectangle":
        const width = Math.abs(pointer.x - startPoint.x);
        const height = Math.abs(pointer.y - startPoint.y);
        const left = Math.min(pointer.x, startPoint.x);
        const top = Math.min(pointer.y, startPoint.y);

        drawingShape.set({
          left: left,
          top: top,
          width: width,
          height: height,
        });
        break;

      case "circle":
        const radius =
          Math.sqrt(
            Math.pow(pointer.x - startPoint.x, 2) +
              Math.pow(pointer.y - startPoint.y, 2)
          ) / 2;

        drawingShape.set({
          left: Math.min(pointer.x, startPoint.x),
          top: Math.min(pointer.y, startPoint.y),
          radius: Math.max(radius, 1),
        });
        break;

      case "line":
        drawingShape.set({
          x2: pointer.x,
          y2: pointer.y,
        });
        break;
    }

    canvas.renderAll();
  };

  // Finish drawing shape
  const finishDrawingShape = () => {
    if (drawingShape) {
      drawingShape.set({ selectable: true }); // Re-enable selection
      fabricCanvas.current.setActiveObject(drawingShape);
    }

    setIsDrawing(false);
    setDrawingShape(null);
    setStartPoint(null);
    fabricCanvas.current.renderAll();
  };

  // Get current annotations directly from canvas
  const getCurrentPageAnnotations = () => {
    if (!fabricCanvas.current) return [];

    const canvas = fabricCanvas.current;
    const annotationObjects = canvas
      .getObjects()
      .filter((obj) => !obj.isBackground);

    return annotationObjects.length > 0
      ? annotationObjects.map((obj) => obj.toObject())
      : [];
  };

  // Save annotations for a specific page
  const savePageAnnotations = (pageNum) => {
    return new Promise((resolve) => {
      if (!fabricCanvas.current) {
        resolve({});
        return;
      }

      const canvas = fabricCanvas.current;
      const annotationObjects = canvas
        .getObjects()
        .filter((obj) => !obj.isBackground);

      setPageAnnotations((prev) => {
        let updated = { ...prev };

        if (annotationObjects.length > 0) {
          const annotationData = annotationObjects.map((obj) => obj.toObject());
          updated[pageNum] = annotationData;
          
        } else {
          delete updated[pageNum];
          console.log(`Removed annotations for page ${pageNum}`);
        }

        setTimeout(() => resolve(updated), 0);
        return updated;
      });
    });
  };

  // Load annotations for a specific page
  const loadPageAnnotations = async (pageNum) => {
    if (!fabricCanvas.current) return;

    const canvas = fabricCanvas.current;

    // Remove all annotation objects (keep only background)
    const allObjects = [...canvas.getObjects()];
    allObjects.forEach((obj) => {
      if (!obj.isBackground) {
        canvas.remove(obj);
      }
    });

    // Load saved annotations for this page
    if (pageAnnotations[pageNum] && pageAnnotations[pageNum].length > 0) {
      const annotationData = pageAnnotations[pageNum];
      

      await new Promise((resolve) => {
        window.fabric.util.enlivenObjects(annotationData, (objects) => {
          objects.forEach((obj) => {
            obj.set({ isBackground: false });
            canvas.add(obj);
          });
          canvas.renderAll();
          resolve();
        });
      });
    }
  };

  // Handle tool change
  const handleToolChange = (toolId) => {
    if (!fabricCanvas.current) return;

    const canvas = fabricCanvas.current;
    setCurrentTool(toolId);
    canvas.isDrawingMode = false; // ✅ Ensure only pen/highlight enable this
    canvas.selection = true;
    canvas.defaultCursor = "default";
    canvas.hoverCursor = "move";
    // Reset any ongoing drawing
    setIsDrawing(false);
    setDrawingShape(null);
    setStartPoint(null);

    // Configure canvas based on tool
    switch (toolId) {
      case "select":
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.defaultCursor = "default";
        canvas.hoverCursor = "move";
        break;
      case "pen":
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = strokeWidth;
        canvas.freeDrawingBrush.color = currentColor;
        canvas.selection = false;
        break;
      case "highlight":
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = strokeWidth * 3;
        canvas.freeDrawingBrush.color = currentColor + "40"; // Add transparency
        canvas.selection = false;
        break;
    }
  };

  // added one
  const handleCanvasClick = (event) => {
    if (!fabricCanvas.current) return;

    const canvas = fabricCanvas.current;

    const pointer = canvas.getPointer(event.e);

    switch (currentTool) {
      case "rectangle":
        addRectangle(pointer);
        break;
      case "circle":
        addCircle(pointer);
        break;
      case "text":
        addText(pointer);
        break;
    }
    
  };

  // Add rectangle
  const addRectangle = (pointer) => {
    const rect = new window.fabric.Rect({
      left: pointer.x,
      top: pointer.y,
      width: 100,
      height: 60,
      fill: "transparent",
      stroke: currentColor,
      strokeWidth: strokeWidth,
      selectable: true,
      borderColor: "#23b5b5",
      cornerColor: "#23b5b5",
      cornerSize: 8,
      transparentCorners: false,
      cornerStrokeColor: "#ffffff",
      borderDashArray: [5, 5],
    });

    fabricCanvas.current.add(rect);
    fabricCanvas.current.setActiveObject(rect);
  };

  // Add circle
  const addCircle = (pointer) => {
    const circle = new window.fabric.Circle({
      left: pointer.x,
      top: pointer.y,
      radius: 30,
      fill: "transparent",
      stroke: currentColor,
      strokeWidth: strokeWidth,
      selectable: true,
      borderColor: "#23b5b5",
      cornerColor: "#23b5b5",
      cornerSize: 8,
      transparentCorners: false,
      cornerStrokeColor: "#ffffff",
      borderDashArray: [5, 5],
    });

    fabricCanvas.current.add(circle);
    fabricCanvas.current.setActiveObject(circle);
  };

  // Add text
  const addText = (pointer) => {
    const text = new window.fabric.IText("Click to edit", {
      left: pointer.x,
      top: pointer.y,
      fontFamily: "Arial",
      fontSize: 16,
      fill: currentColor,
      selectable: true,
      editable: true,
      borderColor: "#23b5b5",
      cornerColor: "#23b5b5",
      cornerSize: 8,
      transparentCorners: false,
      cornerStrokeColor: "#ffffff",
      borderDashArray: [5, 5],
    });

    fabricCanvas.current.add(text);
    fabricCanvas.current.setActiveObject(text);
  };

  useEffect(() => {
    if (fabricCanvas.current) {
      const canvas = fabricCanvas.current;
      canvas.on("mouse:down", handleCanvasClick);

      return () => {
        canvas.off("mouse:down", handleCanvasClick);
      };
    }
  }, [currentTool, currentColor, strokeWidth]);

  // Update brush settings when color or stroke width changes
  useEffect(() => {
    if (fabricCanvas.current && currentTool === "pen") {
      fabricCanvas.current.freeDrawingBrush.color = currentColor;
      fabricCanvas.current.freeDrawingBrush.width = strokeWidth;
    } else if (fabricCanvas.current && currentTool === "highlight") {
      fabricCanvas.current.freeDrawingBrush.color = currentColor + "40";
      fabricCanvas.current.freeDrawingBrush.width = strokeWidth * 3;
    }
  }, [currentColor, strokeWidth, currentTool]);

  // Render PDF page
  const renderPdfPage = async (pageNum, passedPdfDoc = pdfDoc) => {
    const pdfToUse = passedPdfDoc || pdfDoc;

    if (!fabricCanvas.current || !pdfToUse) return;

    try {
      const page = await pdfToUse.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1 });

      const tempCanvas = document.createElement("canvas");
      const context = tempCanvas.getContext("2d");
      tempCanvas.height = viewport.height;
      tempCanvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      const imageDataUrl = tempCanvas.toDataURL("image/png");
      const canvas = fabricCanvas.current;

      canvas.setHeight(viewport.height);
      canvas.setWidth(viewport.width);
      canvas.clear();

      const img = new Image();
      img.onload = () => {
        const fabricImg = new window.fabric.Image(img);
        fabricImg.set({
          left: 0,
          top: 0,
          selectable: false,
          evented: false,
          isBackground: true,
          hoverCursor: "default",
          moveCursor: "default",
        });

        canvas.add(fabricImg);
        canvas.sendToBack(fabricImg);
        canvas.renderAll();

        setTimeout(async () => {
          await loadPageAnnotations(pageNum);
        }, 200);
      };
      img.src = imageDataUrl;
    } catch (error) {
      console.error("Error rendering PDF page:", error);
    }
  };

  // Handle PDF upload
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please select a valid PDF file");
      return;
    }

    if (!librariesLoaded) {
      alert("Libraries are still loading. Please wait...");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      setPdfBytes(arrayBuffer.slice(0));

      const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      setPageAnnotations({});

      await renderPdfPage(1, pdf);
    } catch (error) {
      console.error("Error loading PDF:", error);
      alert("Error loading PDF: " + error.message);
    }
  };

  // Navigation
  const goToPreviousPage = async () => {
    if (currentPage <= 1) return;

    await savePageAnnotations(currentPage);
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    await renderPdfPage(newPage);
  };

  const goToNextPage = async () => {
    if (currentPage >= totalPages) return;

    await savePageAnnotations(currentPage);
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    await renderPdfPage(newPage);
  };

  // Save annotated PDF
  const handleSaveAnnotatedPdf = async () => {
    if (!pdfBytes || !window.PDFLib) {
      alert("Please upload a PDF first!");
      return;
    }

    try {
      const currentPageAnns = getCurrentPageAnnotations();
      const allAnnotations = { ...pageAnnotations };
      if (currentPageAnns.length > 0) {
        allAnnotations[currentPage] = currentPageAnns;
      }

      const pdfDoc = await window.PDFLib.PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const annotations = allAnnotations[pageNum];
        if (annotations && annotations.length > 0) {
          const page = pages[pageNum - 1];
          const { width, height } = page.getSize();

          const tempCanvas = document.createElement("canvas");
          const tempFabricCanvas = new window.fabric.Canvas(tempCanvas);

          tempFabricCanvas.setWidth(fabricCanvas.current.width);
          tempFabricCanvas.setHeight(fabricCanvas.current.height);

          await new Promise((resolve) => {
            window.fabric.util.enlivenObjects(annotations, (objects) => {
              objects.forEach((obj) => {
                tempFabricCanvas.add(obj);
              });
              tempFabricCanvas.renderAll();
              resolve();
            });
          });

          const annotationDataUrl = tempFabricCanvas.toDataURL({
            format: "png",
            backgroundColor: "rgba(0,0,0,0)",
            quality: 1,
          });

          if (annotationDataUrl && !annotationDataUrl.includes("data:,")) {
            const pngBytes = await fetch(annotationDataUrl).then((res) =>
              res.arrayBuffer()
            );
            const pngImage = await pdfDoc.embedPng(pngBytes);

            const scaleX = width / tempFabricCanvas.width;
            const scaleY = height / tempFabricCanvas.height;

            page.drawImage(pngImage, {
              x: 0,
              y: 0,
              width: tempFabricCanvas.width * scaleX,
              height: tempFabricCanvas.height * scaleY,
            });
          }

          tempFabricCanvas.dispose();
        }
      }

      const pdfBytesOutput = await pdfDoc.save();
      const blob = new Blob([pdfBytesOutput], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "annotated-document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert("Annotated PDF downloaded successfully!");
    } catch (error) {
      console.error("Error saving annotated PDF:", error);
      alert("Error saving PDF: " + error.message);
    }
  };

  return (
    <div className="min-h-screen p-4 text-white bg-black flex flex-col">
      <h1 className="text-3xl text-[#23b5b5] font-bold mb-6 text-center">
        PDF Editor with Annotations
      </h1>

      {!librariesLoaded && (
        <div className="text-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#23b5b5] mx-auto mb-2"></div>
          <p className="text-[#23b5b5]">Loading libraries...</p>
        </div>
      )}

      {librariesLoaded && (
        <div className="flex flex-col lg:flex-row gap-4 flex-1">
          {/* Toolbar */}
          <div className="lg:w-64 bg-[#111] rounded-lg p-4">
            {/* Upload */}
            <div className="mb-4">
              <label
                htmlFor="fileInput"
                className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-black font-semibold cursor-pointer transition-all hover:scale-105"
                style={{ backgroundColor: "#23b5b5" }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload PDF
              </label>
              <input
                type="file"
                accept=".pdf"
                id="fileInput"
                className="hidden"
                onChange={handlePdfUpload}
              />
            </div>

            {totalPages > 0 && (
              <>
                {/* Tools */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">
                    Tools
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {tools.map((tool) => {
                      const IconComponent = tool.icon;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => handleToolChange(tool.id)}
                          className={`p-2 rounded-md transition-all hover:scale-105 ${
                            currentTool === tool.id
                              ? "bg-[#23b5b5] text-black"
                              : "bg-[#222] text-white hover:bg-[#333]"
                          }`}
                          title={tool.name}
                        >
                          <IconComponent className="w-4 h-4 mx-auto" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Picker */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">
                    Color
                  </h3>
                  <div className="grid grid-cols-6 gap-1">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setCurrentColor(color)}
                        className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                          currentColor === color
                            ? "border-white"
                            : "border-[#444]"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="w-full mt-2 h-8 rounded border-0 bg-transparent"
                  />
                </div>

                {/* Settings */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">
                    Settings
                  </h3>

                  <div className="mb-2">
                    <label className="text-xs text-gray-400">
                      Stroke Width: {strokeWidth}px
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={strokeWidth}
                      onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center">
            {/* Page Navigation */}
            {totalPages > 0 && (
              <div className="mb-4 flex items-center gap-4 bg-[#111] px-4 py-2 rounded-lg">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage <= 1}
                  className="p-2 rounded-md bg-[#23b5b5] text-black disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#23b5b5]" />
                  <span className="text-white font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage >= totalPages}
                  className="p-2 rounded-md bg-[#23b5b5] text-black disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Canvas */}
            <div className="border-2 border-[#333] bg-white rounded-xl overflow-hidden mb-4 shadow-2xl">
              <canvas
                ref={canvasRef}
                style={{
                  display: "block",
                  maxWidth: "90vw",
                  maxHeight: "70vh",
                }}
              />
            </div>

            {/* Save Button */}
            {totalPages > 0 && (
              <button
                onClick={handleSaveAnnotatedPdf}
                className="px-8 py-3 rounded-lg text-black font-bold text-lg transition-all hover:scale-105 shadow-lg"
                style={{ backgroundColor: "#23b5b5" }}
              >
                <Download className="w-5 h-5 mr-2 inline" />
                Download Annotated PDF
              </button>
            )}

            {/* Empty State */}
            {totalPages === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-40 text-[#23b5b5]" />
                <p className="text-lg text-gray-300">
                  Upload a PDF to start editing
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfEditor;
