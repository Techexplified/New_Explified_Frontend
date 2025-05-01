import React, { useRef, useState, useEffect } from "react";
import { BsTriangle } from "react-icons/bs";
import { FaEraser, FaPen, FaRegCircle } from "react-icons/fa";
import { MdOutlineRectangle } from "react-icons/md";

const Scribbling = () => {
  const canvasRef = useRef(null);
  const tempCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [drawingColor, setDrawingColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isEraser, setIsEraser] = useState(false);
  const [selectedShape, setSelectedShape] = useState(null);
  // const [history, setHistory] = useState([]);
  // const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const tempCanvas = tempCanvasRef.current;
      if (canvas && tempCanvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        tempCanvas.width = window.innerWidth;
        tempCanvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPosition({ x, y });
    if (!selectedShape) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (selectedShape) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ctx = canvasRef.current.getContext("2d");
      drawShape(startPosition.x, startPosition.y, x, y, ctx);
      tempCanvasRef.current
        .getContext("2d")
        .clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvasRef.current.getContext("2d");

    if (!selectedShape) {
      ctx.strokeStyle = isEraser ? bgColor : drawingColor;
      ctx.lineWidth = isEraser ? 20 : 3;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      const tempCtx = tempCanvasRef.current.getContext("2d");
      tempCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      drawShape(startPosition.x, startPosition.y, x, y, tempCtx);
    }
  };

  const drawShape = (x1, y1, x2, y2, ctx) => {
    ctx.strokeStyle = drawingColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (selectedShape === "rectangle") {
      ctx.rect(x1, y1, x2 - x1, y2 - y1);
    } else if (selectedShape === "circle") {
      const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
    } else if (selectedShape === "triangle") {
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x1 * 2 - x2, y2);
      ctx.closePath();
    }
    ctx.stroke();
  };

  const toggleEraser = () => {
    setIsEraser((prev) => !prev);
    setSelectedShape(null);
  };

  // const saveState = () => {
  //   const canvas = canvasRef.current;
  //   setHistory((prev) => [...prev, canvas.toDataURL()]);
  //   setRedoStack([]);
  // };

  // const undo = () => {
  //   if (history.length === 0) return;
  //   const lastState = history[history.length - 1];
  //   setRedoStack((prev) => [...prev, canvasRef.current.toDataURL()]);
  //   setHistory((prev) => prev.slice(0, -1));
  //   restoreState(lastState);
  // };

  // const redo = () => {
  //   if (redoStack.length === 0) return;
  //   const nextState = redoStack[redoStack.length - 1];
  //   setHistory((prev) => [...prev, canvasRef.current.toDataURL()]);
  //   setRedoStack((prev) => prev.slice(0, -1));
  //   restoreState(nextState);
  // };

  // const restoreState = (dataURL) => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");
  //   const img = new Image();
  //   img.src = dataURL;
  //   img.onload = () => {
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     ctx.drawImage(img, 0, 0);
  //   };
  // };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden">
      <div className="w-full flex flex-row justify-between items-center px-10 py-4">
        <div className="w-[50%] flex flex-row gap-2 justify-evenly items-center">
          <button
            onClick={() => {
              setSelectedShape(null);
              setIsEraser(false);
            }}
            className={`border-1 rounded-md p-2 border-zinc-700 hover:bg-zinc-700 ${
              !isEraser && selectedShape == null ? "bg-zinc-700" : "bg-zinc-800"
            }`}
          >
            <FaPen />
          </button>
          <button
            onClick={() => {
              setSelectedShape("rectangle");
              setIsEraser(false);
            }}
            className={`border-1 rounded-md p-2 border-zinc-700 hover:bg-zinc-700 ${
              selectedShape == "rectangle" ? "bg-zinc-700" : "bg-zinc-800"
            }`}
          >
            <MdOutlineRectangle />
          </button>
          <button
            onClick={() => {
              setSelectedShape("circle");
              setIsEraser(false);
            }}
            className={`border-1 rounded-md p-2 border-zinc-700 hover:bg-zinc-700 ${
              selectedShape == "circle" ? "bg-zinc-700" : "bg-zinc-800"
            }`}
          >
            <FaRegCircle />
          </button>
          <button
            onClick={() => {
              setSelectedShape("triangle");
              setIsEraser(false);
            }}
            className={`border-1 rounded-md p-2 border-zinc-700 hover:bg-zinc-700 ${
              selectedShape == "triangle" ? "bg-zinc-700" : "bg-zinc-800"
            }`}
          >
            <BsTriangle />
          </button>
          <button
            onClick={toggleEraser}
            className={`border-1 rounded-md p-2 border-zinc-700 hover:bg-zinc-700 ${
              isEraser ? "bg-zinc-700" : "bg-zinc-800"
            }`}
          >
            <FaEraser />
          </button>
          <div className="w-full" />
          {[
            "#ff0000",
            "#00ff00",
            "#0000ff",
            "#ffff00",
            "#ff00ff",
            "#000000",
          ].map((color) => (
            <button
              key={color}
              style={{ backgroundColor: color }}
              className={`w-12 h-6 rounded-full ${
                drawingColor == color
                  ? "border-3 border-white"
                  : "border-1 border-zinc-400"
              }`}
              onClick={() => setDrawingColor(color)}
            />
          ))}
        </div>
      </div>
      <div className="relative w-screen h-screen">
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: bgColor,
            cursor: isEraser
              ? 'url("/images/cursor/eraser.cur") 16 16, auto' // Eraser cursor
              : 'url("/images/cursor/pencil.cur") 2 26, auto', // Pen cursor
          }}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onMouseMove={draw}
          className="shadow-lg"
        />
        <canvas
          ref={tempCanvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

export default Scribbling;

// import React, { useRef, useState, useEffect } from "react";

// const Scribbling = () => {
//   const canvasRef = useRef(null);
//   const tempCanvasRef = useRef(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
//   const [drawingColor, setDrawingColor] = useState("#000000");
//   const [bgColor, setBgColor] = useState("#ffffff");
//   const [isEraser, setIsEraser] = useState(false);
//   const [selectedShape, setSelectedShape] = useState(null);

//   useEffect(() => {
//     const handleResize = () => {
//       setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const startDrawing = (e) => {
//     setIsDrawing(true);
//     const rect = canvasRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     setStartPosition({ x, y });
//     if (!selectedShape) {
//       const ctx = canvasRef.current.getContext("2d");
//       ctx.beginPath();
//       ctx.moveTo(x, y);
//     }
//   };

//   const stopDrawing = () => {
//     setIsDrawing(false);
//   };

//   const draw = (e) => {
//     if (!isDrawing) return;
//     const rect = canvasRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const ctx = canvasRef.current.getContext("2d");

//     if (!selectedShape) {
//       ctx.strokeStyle = isEraser ? bgColor : drawingColor;
//       ctx.lineWidth = isEraser ? 20 : 3;
//       ctx.lineTo(x, y);
//       ctx.stroke();
//     } else {
//       const tempCtx = tempCanvasRef.current.getContext("2d");
//       tempCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
//       drawShape(startPosition.x, startPosition.y, x, y, tempCtx);
//     }
//   };

//   const drawShape = (x1, y1, x2, y2, ctx) => {
//     ctx.strokeStyle = drawingColor;
//     ctx.lineWidth = 3;
//     ctx.beginPath();

//     if (selectedShape === "rectangle") {
//       ctx.rect(x1, y1, x2 - x1, y2 - y1);
//     } else if (selectedShape === "circle") {
//       const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
//       ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
//     } else if (selectedShape === "triangle") {
//       ctx.moveTo(x1, y1);
//       ctx.lineTo(x2, y2);
//       ctx.lineTo(x1 * 2 - x2, y2);
//       ctx.closePath();
//     }

//     ctx.stroke();
//   };

//   const finalizeShape = (e) => {
//     if (!isDrawing || !selectedShape) return;
//     setIsDrawing(false);
//     const rect = canvasRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const ctx = canvasRef.current.getContext("2d");
//     drawShape(startPosition.x, startPosition.y, x, y, ctx);
//     tempCanvasRef.current.getContext("2d").clearRect(0, 0, window.innerWidth, window.innerHeight);
//   };

//   const toggleEraser = () => {
//     setIsEraser((prev) => !prev);
//     setSelectedShape(null);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center w-screen h-screen">
//       <div className="w-full flex flex-row justify-between items-center px-10 py-4">
//         <div className="flex flex-row gap-2">
//           <button onClick={() => setSelectedShape(null)}>Pen</button>
//           <button onClick={() => setSelectedShape("rectangle")}>Rectangle</button>
//           <button onClick={() => setSelectedShape("circle")}>Circle</button>
//           <button onClick={() => setSelectedShape("triangle")}>Triangle</button>
//           <button onClick={toggleEraser}>{isEraser ? "Eraser On" : "Eraser Off"}</button>
//           <input type="color" value={drawingColor} onChange={(e) => setDrawingColor(e.target.value)} />
//         </div>
//       </div>
//       <div className="relative w-screen h-screen">
//         <canvas
//           ref={canvasRef}
//           width={window.innerWidth}
//           height={window.innerHeight}
//           style={{ position: "absolute", top: 0, left: 0, backgroundColor: bgColor }}
//           onMouseDown={startDrawing}
//           onMouseUp={finalizeShape}
//           onMouseLeave={stopDrawing}
//           onMouseMove={draw}
//           className="shadow-lg"
//         />
//         <canvas
//           ref={tempCanvasRef}
//           width={window.innerWidth}
//           height={window.innerHeight}
//           style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
//         />
//       </div>
//     </div>
//   );
// };

// export default Scribbling;

// import { useRef, useState, useEffect } from "react";

// const Scribbling = () => {
//   const canvasRef = useRef(null);
//   const [shape, setShape] = useState("rectangle");
//   const [startPos, setStartPos] = useState(null);
//   const [drawing, setDrawing] = useState(false);
//   const [penDrawing, setPenDrawing] = useState(false);
//   const [shapes, setShapes] = useState([]);
//   const [color, setColor] = useState("black");
//   let penPath = [];

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     redrawCanvas();
//   }, [shapes]);

//   const startDrawing = (e) => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     if (shape === "pen" || shape === "eraser") {
//       setPenDrawing(true);
//       ctx.globalCompositeOperation = shape === "eraser" ? "destination-out" : "source-over";
//       ctx.lineWidth = shape === "eraser" ? 20 : 2;
//       ctx.beginPath();
//       ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//       penPath = [{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }];
//     } else {
//       setStartPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
//       setDrawing(true);
//     }
//   };

//   const drawShape = (e) => {
//     if (penDrawing) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");
//       ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//       ctx.stroke();
//       penPath.push({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
//       return;
//     }

//     if (!drawing) return;

//     const endPos = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
//     const width = Math.abs(endPos.x - startPos.x);
//     const height = Math.abs(endPos.y - startPos.y);
//     const x = Math.min(startPos.x, endPos.x);
//     const y = Math.min(startPos.y, endPos.y);

//     redrawCanvas([...shapes, { shape, x, y, width, height, startPos, endPos, color }]);
//   };

//   const endDrawing = (e) => {
//     if (penDrawing) {
//       if (shape === "eraser") {
//         setShapes(shapes.filter(s => !penPath.some(p => p.x >= s.x && p.x <= s.x + s.width && p.y >= s.y && p.y <= s.y + s.height)));
//       } else {
//         setShapes([...shapes, { shape, path: penPath, color }]);
//       }
//       setPenDrawing(false);
//       return;
//     }
//     if (!drawing) return;
//     setDrawing(false);

//     const endPos = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
//     const width = Math.abs(endPos.x - startPos.x);
//     const height = Math.abs(endPos.y - startPos.y);
//     const x = Math.min(startPos.x, endPos.x);
//     const y = Math.min(startPos.y, endPos.y);

//     setShapes([...shapes, { shape, x, y, width, height, startPos, endPos, color }]);
//   };

//   const redrawCanvas = (updatedShapes = shapes) => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     updatedShapes.forEach((s) => {
//       ctx.beginPath();
//       ctx.globalCompositeOperation = "source-over";

//       if (s.shape === "rectangle") {
//         ctx.strokeStyle = s.color;
//         ctx.rect(s.x, s.y, s.width, s.height);
//       } else if (s.shape === "circle") {
//         ctx.strokeStyle = s.color;
//         ctx.arc(s.x + s.width / 2, s.y + s.height / 2, Math.min(s.width, s.height) / 2, 0, Math.PI * 2);
//       } else if (s.shape === "star") {
//         ctx.strokeStyle = s.color;
//         const cx = s.x + s.width / 2;
//         const cy = s.y + s.height / 2;
//         const spikes = 5;
//         const outerRadius = Math.min(s.width, s.height) / 2;
//         const innerRadius = outerRadius / 2;
//         let rot = Math.PI / 2 * 3;
//         let step = Math.PI / spikes;
//         ctx.moveTo(cx, cy - outerRadius);
//         for (let i = 0; i < spikes; i++) {
//           let x = cx + Math.cos(rot) * outerRadius;
//           let y = cy - Math.sin(rot) * outerRadius;
//           ctx.lineTo(x, y);
//           rot += step;

//           x = cx + Math.cos(rot) * innerRadius;
//           y = cy - Math.sin(rot) * innerRadius;
//           ctx.lineTo(x, y);
//           rot += step;
//         }
//         ctx.closePath();
//       } else if (s.shape === "pen") {
//         ctx.strokeStyle = s.color;
//         s.path.forEach((point, idx) => {
//           if (idx === 0) {
//             ctx.moveTo(point.x, point.y);
//           } else {
//             ctx.lineTo(point.x, point.y);
//           }
//         });
//       }
//       ctx.stroke();
//     });
//   };

//   return (
//     <div className="absolute top-0 left-0 w-full h-full">
//       <canvas
//         ref={canvasRef}
//         className="absolute top-0 left-0 w-full h-full border border-gray-400"
//         onMouseDown={startDrawing}
//         onMouseMove={drawShape}
//         onMouseUp={endDrawing}
//       ></canvas>
//       <div className="absolute top-4 left-4 flex gap-2">
//         <button className="p-2 bg-blue-500 text-white rounded" onClick={() => setShape("rectangle")}>Rectangle</button>
//         <button className="p-2 bg-yellow-500 text-white rounded" onClick={() => setShape("circle")}>Circle</button>
//         <button className="p-2 bg-purple-500 text-white rounded" onClick={() => setShape("star")}>Star</button>
//         <button className="p-2 bg-green-500 text-white rounded" onClick={() => setShape("pen")}>Pen</button>
//         <button className="p-2 bg-gray-500 text-white rounded" onClick={() => setShape("eraser")}>Eraser</button>
//         <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="ml-2" />
//       </div>
//     </div>
//   );
// };

// export default Scribbling;
