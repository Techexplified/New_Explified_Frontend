import { create } from "zustand";

export const useStore = create((set, get) => ({
  shapes: [],
  selectedTool: "freehand",
  setTool: (tool) => set({ selectedTool: tool }),
  setShapes: (shapesFromPreviousNote) =>
    set({ shapes: shapesFromPreviousNote }),
  addShape: (shape) => set((state) => ({ shapes: [...state.shapes, shape] })),
  freehandStrokeWidth: 2,
  setFreehandStrokeWidth: (width) => set({ freehandStrokeWidth: width }),
  updateShape: (id, updater) => {
    set((state) => ({
      shapes: state.shapes.map((s) =>
        s.id === id
          ? { ...s, ...(typeof updater === "function" ? updater(s) : updater) }
          : s
      ),
    }));
  },
  removeShape: (id) =>
    set((state) => ({ shapes: state.shapes.filter((s) => s.id !== id) })),
  selectedShapeId: null,
  setSelectedShapeId: (id) => set({ selectedShapeId: id }),
  textStyle: {
    fontFamily: "Arial",
    fontSize: 20,
    bold: false,
    italic: false,
    color: "#23b5b5",
  },
  setTextStyle: (partial) =>
    set((state) => ({ textStyle: { ...state.textStyle, ...partial } })),
  freehandType: "pencil",
  setFreehandType: (fType) => set({ freehandType: fType }),
  freehandColor: "#23b5b5",
  setFreehandColor: (color) => set({ freehandColor: color }),

  // ✅ Added shape support
  shapeType: "rectangle",
  setShapeType: (type) => set({ shapeType: type }),
}));
