import React, { useState, useRef, useEffect } from "react";

// The main App component for our Figma-like canvas
const Canvas = () => {
  // State for managing the canvas transformation (zoom and pan)
  const [transform, setTransform] = useState({
    scale: 1, // Initial zoom level
    x: 0, // Initial x-axis pan position
    y: 0, // Initial y-axis pan position
  });
  // State for tracking the dragging action
  const [isDragging, setIsDragging] = useState(false);
  // Ref to store the position of the mouse at the start of a drag
  const startDrag = useRef({ x: 0, y: 0 });
  // Ref for the main canvas container
  const canvasRef = useRef(null);

  // useEffect hook to handle mouse events for dragging and zooming
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // --- Event Handlers ---

    // Handles zooming with the mouse wheel
    const handleWheel = (e) => {
      // Prevent default scroll behavior
      e.preventDefault();

      // Determine the direction of the scroll
      const delta = e.deltaY > 0 ? 1 : -1;
      // Calculate the new scale (zoom factor)
      const newScale = Math.max(
        0.1,
        Math.min(10, transform.scale * (1 - delta * 0.1))
      );

      // Get the bounding box of the canvas to calculate positions
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate new x and y positions to zoom towards the mouse cursor
      const newX = transform.x + mouseX * (transform.scale - newScale);
      const newY = transform.y + mouseY * (transform.scale - newScale);

      // Update the transform state
      setTransform({ scale: newScale, x: newX, y: newY });
    };

    // Handles the start of a drag when the mouse button is pressed
    const handleMouseDown = (e) => {
      setIsDragging(true);
      // Store the initial mouse position
      startDrag.current = {
        x: e.clientX - transform.x,
        y: e.clientY - transform.y,
      };
    };

    // Handles the drag movement
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      // Update the transform state with the new position based on mouse movement
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - startDrag.current.x,
        y: e.clientY - startDrag.current.y,
      }));
    };

    // Handles the end of a drag when the mouse button is released
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // --- Attach Event Listeners ---
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // --- Cleanup Function ---
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, transform]); // Dependencies: re-run effect if these states change

  // This function would be where you would render your canvas content (e.g., shapes, text)
  // For this example, we'll just have some styled boxes to show the canvas is moving.
  const renderCanvasContent = () => {
    return (
      <div className="absolute inset-0 grid grid-cols-5 gap-4 p-8">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="bg-purple-500/50 hover:bg-purple-400/50 transition-colors cursor-pointer rounded-lg shadow-lg flex items-center justify-center text-white text-lg font-bold"
            style={{ width: "200px", height: "150px" }}
          >
            Item {i + 1}
          </div>
        ))}
      </div>
    );
  };

  return (
    // Main container, fixed to the full screen.
    <div className="h-screen w-screen bg-cyan-900 text-white font-sans flex flex-col overflow-hidden">
      {/* Main content area, with fixed sidebar and zoomable canvas */}
      <main className="flex flex-1 overflow-hidden relative">
        {/* The interactive canvas area */}
        <div
          className="relative flex-1 cursor-grab active:cursor-grabbing overflow-hidden"
          ref={canvasRef}
        >
          {/* This is the zoomable/pannable container */}
          <div
            className="absolute transform-gpu origin-top-left will-change-transform"
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            }}
          >
            <p className="text-white">HEllow</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Canvas;
