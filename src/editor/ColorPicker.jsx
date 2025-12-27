import React from "react";
import { useStore } from "../store";
import { SketchPicker } from "react-color";

export default function ColorPicker() {
  const freehandColor = useStore((s) => s.freehandColor);
  const setFreehandColor = useStore((s) => s.setFreehandColor);

  return (
    <div className="absolute top-20 left-40 z-50">
      <SketchPicker
        color={freehandColor}
        onChangeComplete={(color) => setFreehandColor(color.hex)}
      />
    </div>
  );
}
