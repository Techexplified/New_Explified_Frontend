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
  textStyle: {
    color: "#000000",
    fontFamily: "Arial",
    fontSize: 18,
    textAlign: "left",
    opacity: 1,
  },
  setTextStyle: (updates) =>
    set((state) => ({
      textStyle: { ...state.textStyle, ...updates },
    })),

  // ======= Freehand Settings =======
  freehandType: "pencil",
  setFreehandType: (type) => set({ freehandType: type }),

  freehandStrokeWidth: 2,
  setFreehandStrokeWidth: (width) => set({ freehandStrokeWidth: width }),

  freehandColor: "#000000",
  setFreehandColor: (color) => set({ freehandColor: color }),

  freehandOpacity: 1,
  setFreehandOpacity: (opacity) => set({ freehandOpacity: opacity }),

  freehandTexture: "none",
  setFreehandTexture: (texture) => set({ freehandTexture: texture }),

  // ======= Shape Tool Settings =======
  shapeType: "rect",
  setShapeType: (type) => set({ shapeType: type }),

  shapeColor: "#000000", // stroke color
  setShapeColor: (color) => set({ shapeColor: color }),

  shapeFill: "transparent", // default no fill
  setShapeFill: (fill) => set({ shapeFill: fill }),

  shapeStrokeWidth: 2,
  setShapeStrokeWidth: (width) => set({ shapeStrokeWidth: width }),

  shapeOpacity: 1,
  setShapeOpacity: (opacity) => set({ shapeOpacity: opacity }),

  // ======= Image Tool Settings =======
  imageOpacity: 1,
  setImageOpacity: (opacity) => set({ imageOpacity: opacity }),

  selectedImageId: null,
  setSelectedImageId: (id) => set({ selectedImageId: id }),
  selectedShape: null, // add this
  setSelectedImageId: (id) =>
    set({
      selectedImageId: id,
      selectedShape: get().shapes.find((s) => s.id === id) || null,
    }),
  resizeImage: (id, width, height) =>
    set((state) => ({
      shapes: state.shapes.map((s) =>
        s.id === id ? { ...s, width, height } : s
      ),
    })),

   // Sticky note selection
  selectedShapeId: null,
  selectedShape: null,
  setSelectedShape: (shape) =>
    set({ selectedShape: shape, selectedShapeId: shape?.id || null }),

  // Update selected shape directly
  updateSelectedShape: (updater) => {
    const shape = get().selectedShape;
    if (!shape) return;
    const updatedShape = typeof updater === "function" ? updater(shape) : { ...shape, ...updater };
    get().updateShape(shape.id, updatedShape);
    set({ selectedShape: updatedShape });
  },
}));
