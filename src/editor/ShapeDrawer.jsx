import { nanoid } from "nanoid";

/**
 * Creates a new shape object based on the current tool and position.
 * Supports rectangle, square, circle, ellipse, triangle, star, polygon, line.
 */
export const createShape = (tool, shapeType, x, y, color = "#000000") => {
  const id = nanoid();

  switch (tool) {
    case "shapes":
      switch (shapeType) {
        case "rectangle":
          return { id, type: "rect", x, y, width: 0, height: 0, color };
        case "square":
          return { id, type: "square", x, y, size: 0, color };
        case "circle":
          return { id, type: "circle", x, y, radius: 0, color };
        case "ellipse":
          return { id, type: "ellipse", x, y, rx: 0, ry: 0, color };
        case "triangle":
          return { id, type: "triangle", x, y, points: [], color };
        case "star":
          return { id, type: "star", x, y, points: [], color };
        case "polygon":
          return { id, type: "polygon", x, y, points: [], color };
        case "line":
          return { id, type: "line", points: [{ x, y }, { x, y }], color };
        default:
          return null;
      }

    default:
      return null;
  }
};

/**
 * Updates shape dimensions based on movement.
 */
export const updateShapeDimensions = (shape, x, y) => {
  switch (shape.type) {
    case "rect":
      return { width: x - shape.x, height: y - shape.y };
    case "square":
      const size = Math.max(Math.abs(x - shape.x), Math.abs(y - shape.y));
      return { size };
    case "circle":
      return { radius: Math.sqrt(Math.pow(x - shape.x, 2) + Math.pow(y - shape.y, 2)) };
    case "ellipse":
      return { rx: Math.abs(x - shape.x), ry: Math.abs(y - shape.y) };
    case "triangle":
      return {
        points: [
          { x: shape.x, y },
          { x, y },
          { x: (shape.x + x) / 2, y: shape.y },
        ],
      };
    case "star":
      return generateStarPoints(shape.x, shape.y, x, y);
    case "polygon":
      return generatePolygonPoints(shape.x, shape.y, x, y);
    case "line":
      return { points: [shape.points[0], { x, y }] };
    default:
      return shape;
  }
};

/**
 * Generate star points dynamically
 */
function generateStarPoints(x1, y1, x2, y2, spikes = 5) {
  const outerRadius = Math.hypot(x2 - x1, y2 - y1);
  const innerRadius = outerRadius / 2.5;
  const step = Math.PI / spikes;
  const points = [];

  for (let i = 0; i < 2 * spikes; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = x1 + radius * Math.cos(i * step - Math.PI / 2);
    const y = y1 + radius * Math.sin(i * step - Math.PI / 2);
    points.push({ x, y });
  }

  return { points };
}

/**
 * Generate polygon (hexagon-like) points dynamically
 */
function generatePolygonPoints(x1, y1, x2, y2, sides = 6) {
  const radius = Math.hypot(x2 - x1, y2 - y1);
  const step = (2 * Math.PI) / sides;
  const points = [];

  for (let i = 0; i < sides; i++) {
    const x = x1 + radius * Math.cos(i * step - Math.PI / 2);
    const y = y1 + radius * Math.sin(i * step - Math.PI / 2);
    points.push({ x, y });
  }

  return { points };
}
