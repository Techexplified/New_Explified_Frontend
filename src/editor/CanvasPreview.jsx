import React, { useRef, useEffect } from "react";

export default function CanvasPreview({ shapes = [] }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const container = containerRef.current;

    if (!canvas || !ctx || !container) return;

    // Match canvas size to container size dynamically
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      drawPreview(ctx, width, height);
    };

    const drawPreview = (ctx, width, height) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      if (!shapes || shapes.length === 0) return;

      // find bounds
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      shapes.forEach((shape) => {
        switch (shape.type) {
          case "freehand":
          case "line":
            shape.points?.forEach((p) => {
              minX = Math.min(minX, p.x);
              minY = Math.min(minY, p.y);
              maxX = Math.max(maxX, p.x);
              maxY = Math.max(maxY, p.y);
            });
            break;
          case "rect":
            minX = Math.min(minX, shape.x);
            minY = Math.min(minY, shape.y);
            maxX = Math.max(maxX, shape.x + shape.width);
            maxY = Math.max(maxY, shape.y + shape.height);
            break;
          case "circle":
            minX = Math.min(minX, shape.x - shape.radius);
            minY = Math.min(minY, shape.y - shape.radius);
            maxX = Math.max(maxX, shape.x + shape.radius);
            maxY = Math.max(maxY, shape.y + shape.radius);
            break;
          default:
            break;
        }
      });

      if (minX === Infinity) return;

      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;
      const scale = Math.min(width / contentWidth, height / contentHeight) * 0.9;
      const offsetX = (width - contentWidth * scale) / 2;
      const offsetY = (height - contentHeight * scale) / 2;

      ctx.save();
      ctx.translate(offsetX - minX * scale, offsetY - minY * scale);
      ctx.scale(scale, scale);

      shapes.forEach((shape) => {
        ctx.strokeStyle = shape.color || "#00bcd4";
        ctx.lineWidth = shape.size || 2;

        switch (shape.type) {
          case "freehand":
          case "line":
            ctx.beginPath();
            ctx.moveTo(shape.points[0]?.x, shape.points[0]?.y);
            shape.points?.forEach((p) => ctx.lineTo(p.x, p.y));
            ctx.stroke();
            break;
          case "rect":
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            break;
          case "circle":
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
            break;
          default:
            break;
        }
      });

      ctx.restore();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [shapes]);

  return (
    <div
      ref={containerRef}
      className="w-full h-40 md:h-48 lg:h-56 rounded-t-2xl overflow-hidden border-b border-slate-700/40 bg-white"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ objectFit: "contain", display: "block" }}
      />
    </div>
  );
}
