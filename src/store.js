import { create } from "zustand";

export const useStore = create((set) => ({
  // ======= Drawing & Tool State =======
  shapes: [],
  selectedTool: "hand", // default tool
  setTool: (tool) => set({ selectedTool: tool }),

  addShape: (shape) => set((state) => ({ shapes: [...state.shapes, shape] })),
  setShapes: (shapes) => set({ shapes }),
  updateShape: (id, updater) =>
    set((state) => ({
      shapes: state.shapes.map((s) =>
        s.id === id
          ? { ...s, ...(typeof updater === "function" ? updater(s) : updater) }
          : s
      ),
    })),
  removeShape: (id) =>
    set((state) => ({
      shapes: state.shapes.filter((s) => s.id !== id),
    })),

  // ======= Shape Selection =======
  selectedShapeId: null,
  setSelectedShapeId: (id) => set({ selectedShapeId: id }),

  // ======= Text Styles =======
 
  setTextStyle: (partial) =>
    set((state) => ({ textStyle: { ...state.textStyle, ...partial } })),

  // ======= Write Tool Notes =======
  notes: [""],
  setNotes: (newNotes) => set({ notes: newNotes }),

  // ======= Freehand Settings =======
  freehandType: "pencil", // default
  setFreehandType: (type) => set({ freehandType: type }),

  freehandStrokeWidth: 2,
  setFreehandStrokeWidth: (width) => set({ freehandStrokeWidth: width }),

  freehandColor: "#23b5b5",
  setFreehandColor: (color) => set({ freehandColor: color }),

  freehandTexture: "none",
  setFreehandTexture: (texture) => set({ freehandTexture: texture }),

  // ======= Shape Tool =======
  shapeType: "rectangle",
  setShapeType: (type) => set({ shapeType: type }),

   textStyle: {
    color: "#000000",
    fontFamily: "Arial",
    fontSize: 18,
    textAlign: "left",
    opacity: 1,
  },

  // ✨ TEXT STYLE ACTIONS
  setTextStyle: (updates) =>
    set((state) => ({
      textStyle: { ...state.textStyle, ...updates },
    })),

    // ======= Freehand Settings =======
  freehandType: "pencil",
  setFreehandType: (type) => set({ freehandType: type }),

  freehandStrokeWidth: 2,
  setFreehandStrokeWidth: (w) => set({ freehandStrokeWidth: w }),

  freehandColor: "#000000",
  setFreehandColor: (c) => set({ freehandColor: c }),

  freehandOpacity: 1,
  setFreehandOpacity: (o) => set({ freehandOpacity: o }),
  // ======= Shape Tool =======
shapeType: "rectangle",
setShapeType: (type) => set({ shapeType: type }),

shapeColor: "#000000", // ✅ Default black color
setShapeColor: (color) => set({ shapeColor: color }),
shapeFill: "transparent", // ✅ fill color (default no fill)
setShapeFill: (fill) => set({ shapeFill: fill }),
shapeStrokeWidth: 2,
setShapeStrokeWidth: (w) => set({ shapeStrokeWidth: w }),
shapeOpacity: 1,
setShapeOpacity: (o) => set({ shapeOpacity: o }),

}));
