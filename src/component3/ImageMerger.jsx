import React, { useState } from "react";
import { Upload, Plus, Sparkles, SquaresUnite } from "lucide-react";

const AiImageMerge = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [mergePrompt, setMergePrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedImage, setMergedImage] = useState(null);

  const handleImageUpload = (imageNumber, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (imageNumber === 1) {
          setImage1(e.target.result);
        } else {
          setImage2(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMerge = () => {
    if (!image1 || !image2) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // For demo purposes, we'll use one of the uploaded images as the result
      setMergedImage(image1);
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <SquaresUnite className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">AI Image Merge</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 py-12 space-y-8">
        
        {/* Upload Areas */}
        <div className="flex items-center space-x-8">
          {/* Image 1 Upload */}
          <div className="relative">
            <label className="block">
              <div className="w-80 h-64 border-2 border-gray-600 rounded-3xl bg-gray-900/50 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-all duration-300">
                {image1 ? (
                  <img
                    src={image1}
                    alt="Image 1"
                    className="w-full h-full object-cover rounded-3xl"
                  />
                ) : (
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-medium text-gray-300">
                      Upload your Image 1
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Upload className="w-5 h-5" />
                      <span>Upload Image</span>
                    </div>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(1, e)}
                className="hidden"
              />
            </label>
          </div>

          {/* Plus Icon */}
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
          </div>

          {/* Image 2 Upload */}
          <div className="relative">
            <label className="block">
              <div className="w-80 h-64 border-2 border-gray-600 rounded-3xl bg-gray-900/50 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-all duration-300">
                {image2 ? (
                  <img
                    src={image2}
                    alt="Image 2"
                    className="w-full h-full object-cover rounded-3xl"
                  />
                ) : (
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-medium text-gray-300">
                      Upload your Image 2
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Upload className="w-5 h-5" />
                      <span>Upload Image</span>
                    </div>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(2, e)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="w-full max-w-4xl">
          <div className="relative">
            <textarea
              value={mergePrompt}
              onChange={(e) => setMergePrompt(e.target.value)}
              placeholder="Tell us how you want to merge your photos—be as creative or specific as you like!"
              className="w-full h-32 bg-transparent border-2 border-gray-600 rounded-3xl px-6 py-4 text-gray-300 placeholder-gray-500 resize-none focus:outline-none focus:border-[#23b5b5] transition-colors"
            />
          </div>
        </div>

        {/* Merge Button */}
        <button
          onClick={handleMerge}
          disabled={!image1 || !image2 || isProcessing}
          className={`px-8 py-3 rounded-2xl font-medium text-lg transition-all duration-300 ${
            image1 && image2 && !isProcessing
              ? "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Merging...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Merge</span>
            </div>
          )}
        </button>

        {/* Result Preview */}
        {mergedImage && (
          <div className="mt-12 space-y-6">
            <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Merged Result
            </h3>
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={mergedImage}
                  alt="Merged result"
                  className="max-w-md rounded-3xl shadow-2xl border-2 border-gray-600"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
              </div>
            </div>
            <div className="text-center">
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl font-medium transition-all duration-300 transform hover:scale-105">
                Download Result
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default AiImageMerge;