import { nanoid } from "nanoid";

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
      return { id, type: "rect", x, y, startX: x, startY: y, width: 0, height: 0, ...style };

    case "square":
      return { id, type: "square", x, y, startX: x, startY: y, width: 0, height: 0, ...style };

    case "arrow":
      return { id, type: "arrow", points: [{ x, y }, { x, y }], ...style };

    case "diamond":
      return { id, type: "diamond", x, y, startX: x, startY: y, width: 0, height: 0, ...style };

    case "circle":
      return { id, type: "circle", x, y, startX: x, startY: y, rx: 0, ry: 0, ...style };

    case "ellipse":
      return { id, type: "ellipse", x, y, startX: x, startY: y, rx: 0, ry: 0, ...style };

    case "triangle":
      return { id, type: "triangle", x, y, startX: x, startY: y, points: [], ...style };

    case "star":
      return { id, type: "star", x, y, startX: x, startY: y, points: [], ...style };

    case "polygon":
      return { id, type: "polygon", x, y, startX: x, startY: y, points: [], ...style };

    case "line":
      return { id, type: "line", points: [{ x, y }, { x, y }], ...style };

    default:
      return null;
  }
};

export const updateShapeDimensions = (shape, x, y, isPerfect = false) => {
  const startX = shape.startX ?? shape.x;
  const startY = shape.startY ?? shape.y;

  switch (shape.type) {
    case "rect":
    case "rectangle":
    case "square": {
      let width = Math.abs(x - startX);
      let height = Math.abs(y - startY);

      if (isPerfect) {
        const side = Math.max(width, height);
        width = side;
        height = side;
      }

      // Flip logic
      const minX = x < startX ? startX - width : startX;
      const minY = y < startY ? startY - height : startY;

      return { x: minX, y: minY, width, height, startX, startY };
    }

    case "diamond": {
      let width = Math.abs(x - startX);
      let height = Math.abs(y - startY);
      if (isPerfect) {
        const side = Math.max(width, height);
        width = side;
        height = side;
      }
      const minX = Math.min(startX, x);
      const minY = Math.min(startY, y);
      return { x: minX, y: minY, width, height, startX, startY };
    }

    case "arrow":
      return { points: [shape.points[0], { x, y }] };

    case "circle":
    case "ellipse": {
      let rx = Math.abs(x - startX);
      let ry = Math.abs(y - startY);

      if (isPerfect) {
        const r = Math.max(rx, ry);
        rx = r;
        ry = r;
      }

      return { x: startX, y: startY, rx, ry, startX, startY };
    }

    case "triangle": {
      const minX = Math.min(startX, x);
      const maxX = Math.max(startX, x);
      const minY = Math.min(startY, y);
      const maxY = Math.max(startY, y);
      const midX = (minX + maxX) / 2;

      return {
        points: [
          { x: minX, y: maxY },
          { x: maxX, y: maxY },
          { x: midX, y: minY },
        ],
        startX,
        startY
      };
    }

    case "star":
      return { ...generateStarPoints(startX, startY, x, y), startX, startY };

    case "polygon":
      return { ...generatePolygonPoints(startX, startY, x, y), startX, startY };

    case "line":
      return { points: [shape.points[0], { x, y }] };

    default:
      return shape;
  }
};

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
