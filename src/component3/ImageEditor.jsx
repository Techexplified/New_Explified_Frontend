import React, { useState } from 'react';

const AiEditor = () => {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="mt-20 flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row items-center gap-10 p-6 bg-[#1a1a1a] rounded-2xl shadow-2xl">
        {/* Image Upload Box */}
        <div className="w-72 h-[460px] bg-[#111] rounded-xl flex items-center justify-center overflow-hidden">
          {image ? (
            <img
              src={image}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
          ) : (
            <label className="cursor-pointer bg-[#23b5b5] hover:bg-cyan-700 transition px-5 py-3 rounded-lg text-white font-semibold shadow-md">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Tools Panel */}
        <div className="text-white space-y-6 w-52">
          <h2 className="text-2xl font-semibold">AI Editor</h2>

          <button className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] transition px-4 py-2 rounded-lg font-medium border border-cyan-400">
            Add Text
          </button>

          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex justify-between">
              <span className="font-medium">Font</span>
              <span className="font-medium">Aa</span>
              <span className="font-medium">🎨</span>
            </div>
            <div className="h-px bg-gray-700" />
            <p className="text-xs text-gray-400">Customize your image with tools</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiEditor;
