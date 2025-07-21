import React, { useState } from "react";
import {
  Upload,
  Download,
  MoveHorizontal,
  RefreshCw,
  Sparkles,
} from "lucide-react";

const AiImageExpander = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size should be under 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target.result);
      setExpandedImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleExpandImage = async () => {};

  return (
    <div className="min-w-96 bg-[#111] p-4 rounded-2xl shadow-xl space-y-4 text-white max-w-xl mx-auto">
      <div className="flex items-center space-x-2">
        <MoveHorizontal className="text-[#00ffd5]" />
        <h2 className="text-xl font-semibold">AI Image Expander (Uncrop)</h2>
      </div>

      <label className="block cursor-pointer">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            uploadedImage
              ? "border-[#23b5b5] bg-[#23b5b5]/10"
              : "border-gray-700 hover:border-gray-600"
          }`}
        >
          {uploadedImage ? (
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="max-w-sm mx-auto rounded-lg shadow"
            />
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg text-gray-300">
                Click to upload an image (JPG/PNG/WebP)
              </p>
              <p className="text-sm text-gray-500">Max size: 10MB</p>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>

      {uploadedImage && !expandedImage && (
        <button
          onClick={handleExpandImage}
          disabled={loading}
          className="w-full bg-[#00ffd5] text-black font-medium px-4 py-2 rounded-xl hover:bg-[#00e6c0] transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="animate-spin" />
              Expanding...
            </>
          ) : (
            <>
              <Sparkles />
              Expand Image
            </>
          )}
        </button>
      )}

      {expandedImage && (
        <div className="space-y-4">
          <img
            src={expandedImage}
            alt="Expanded"
            className="max-w-sm mx-auto rounded-lg shadow-lg"
          />
          <a
            href={expandedImage}
            download="expanded-image.png"
            className="w-full bg-white text-black text-center font-medium px-4 py-2 rounded-xl hover:bg-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Download />
            Download Expanded Image
          </a>
        </div>
      )}

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default AiImageExpander;