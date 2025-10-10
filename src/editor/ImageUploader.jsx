import React from "react";
import { useStore } from "../store";
import { nanoid } from "nanoid";
import { Image } from "lucide-react";

export default function ImageUploader({ fileInputRef }) {
  const addShape = useStore((s) => s.addShape);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      addShape({
        id: nanoid(),
        type: "image",
        src: ev.target.result,
        x: 200,
        y: 200,
        width: 180,
        height: 120,
        rotation: 0,
        filters: { brightness: 1, contrast: 1, saturate: 1, blur: 0 },
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <>
      <button
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        className="p-3 rounded-xl"
        title="Add Image"
      >
        <Image />
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
    </>
  );
}
