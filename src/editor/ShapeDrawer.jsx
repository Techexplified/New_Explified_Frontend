import { nanoid } from "nanoid";

/**
 * Creates a new shape object based on the selected shape type and position.
 * Supports rectangle, square, circle, ellipse, triangle, star, polygon, line.
 */
export const createShape = (
  shapeType,
  x,
  y,
  style = { stroke: "#000000", fill: "transparent", strokeWidth: 2, opacity: 1 }
) => {
  const id = nanoid();

  switch (shapeType) {
    case "rect":
    case "rectangle":
      return { id, type: "rect", x, y, width: 0, height: 0, ...style };

    case "square":
      return { id, type: "square", x, y, size: 0, ...style };

    case "circle":
      return { id, type: "circle", x, y, radius: 0, ...style };

    case "ellipse":
      return { id, type: "ellipse", x, y, rx: 0, ry: 0, ...style };

    case "triangle":
      return { id, type: "triangle", x, y, points: [], ...style };

    case "star":
      return { id, type: "star", x, y, points: [], ...style };

    case "polygon":
      return { id, type: "polygon", x, y, points: [], ...style };

    case "line":
      return { id, type: "line", points: [{ x, y }, { x, y }], ...style };

    default:
      return null;
  }
};

/**
 * Updates shape dimensions based on pointer movement.
 */
export const updateShapeDimensions = (shape, x, y) => {
  switch (shape.type) {
    case "rect":
      return { width: x - shape.x, height: y - shape.y };

    case "square":
      const size = Math.max(Math.abs(x - shape.x), Math.abs(y - shape.y));
      return { size };

    case "circle":
      return {
        radius: Math.sqrt(Math.pow(x - shape.x, 2) + Math.pow(y - shape.y, 2)),
      };

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
 * Generate star points dynamically.
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
 * Generate polygon (hexagon-like) points dynamically.
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
