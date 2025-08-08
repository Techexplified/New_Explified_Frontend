import React, { useState, useRef } from 'react';
import { Upload, Download, X, Loader2, ImageIcon, Trash2, RotateCcw, Zap } from 'lucide-react';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setSelectedFile(file);
    setProcessedImage(null);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/api/bg/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to remove background");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `no-bg-${selectedFile?.name?.replace(/\.[^/.]+$/, '')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    setSelectedFile(null);
    setPreview(null);
    setProcessedImage(null);
    setError(null);
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#23b5b5] to-cyan-400 rounded-full mb-4">
            <Zap className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            AI Background <span className="text-[#23b5b5]">Remover</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Transform your images with AI-powered background removal. Upload, process, and download in seconds.
          </p>
        </div>

        {/* File Upload Area */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8 transition-all hover:border-gray-700">
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-[#23b5b5] bg-[#23b5b5]/10'
                : selectedFile
                ? 'border-[#23b5b5]/50 bg-[#23b5b5]/5'
                : 'border-gray-600 hover:border-[#23b5b5]/50 hover:bg-[#23b5b5]/5'
            }`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {selectedFile ? (
              <div className="space-y-6">
                <div className="w-20 h-20 mx-auto bg-[#23b5b5]/20 border border-[#23b5b5]/30 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-[#23b5b5]" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-white mb-2">
                    {selectedFile.name}
                  </p>
                  <p className="text-gray-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetAll();
                  }}
                  className="inline-flex items-center px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove File
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-20 h-20 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white mb-3">
                    Drag & drop your image here
                  </p>
                  <p className="text-gray-400 text-lg mb-6">
                    or click to browse files
                  </p>
                  <div className="inline-flex items-center px-6 py-3 bg-[#23b5b5] text-black font-medium rounded-lg hover:bg-[#23b5b5]/90 transition-all">
                    <Upload className="w-5 h-5 mr-2" />
                    Choose File
                  </div>
                  <p className="text-gray-500 text-sm mt-4">
                    Supports: JPEG, PNG, WebP • Max size: 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <X className="w-5 h-5 text-red-400 mr-3" />
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Process Button */}
        {selectedFile && !processedImage && (
          <div className="text-center mb-8">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-[#23b5b5] to-cyan-400 text-black font-bold text-lg rounded-xl hover:from-[#23b5b5]/90 hover:to-cyan-400/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:shadow-[#23b5b5]/20 transform hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Processing Magic...
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6 mr-3" />
                  Remove Background
                </>
              )}
            </button>
          </div>
        )}

        {/* Image Comparison */}
        {preview && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Original Image */}
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <h3 className="text-xl font-semibold text-white bg-gray-800 px-4 py-2 rounded-lg">
                    Original Image
                  </h3>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <img
                    src={preview}
                    alt="Original"
                    className="w-full h-auto max-h-96 object-contain mx-auto rounded-lg"
                  />
                </div>
              </div>

              {/* Processed Image */}
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <h3 className="text-xl font-semibold text-white bg-gradient-to-r from-[#23b5b5] to-cyan-400 bg-clip-text text-transparent bg-gray-800 px-4 py-2 rounded-lg">
                    <span className="text-[#23b5b5]">Background Removed</span>
                  </h3>
                </div>
                <div className="bg-gray-800 rounded-xl border border-gray-700">
                  {processedImage ? (
                    <div className="p-4">
                      <div className="checkered-bg rounded-lg p-6">
                        <img
                          src={processedImage}
                          alt="Processed"
                          className="w-full h-auto max-h-96 object-contain mx-auto"
                        />
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={downloadImage}
                          className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-[#23b5b5] text-black font-semibold rounded-lg hover:bg-[#23b5b5]/90 transition-all"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download PNG
                        </button>
                        <button
                          onClick={resetAll}
                          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-lg">Processed image will appear here</p>
                        <p className="text-sm text-gray-600 mt-2">Upload and process to see the magic</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats or Info */}
            {processedImage && (
              <div className="mt-8 pt-6 border-t border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-[#23b5b5] font-semibold">File Format</p>
                    <p className="text-white">PNG with transparency</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-[#23b5b5] font-semibold">Processing Time</p>
                    <p className="text-white">Lightning fast</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-[#23b5b5] font-semibold">Quality</p>
                    <p className="text-white">AI-powered precision</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .checkered-bg {
          background-image: 
            linear-gradient(45deg, #374151 25%, transparent 25%), 
            linear-gradient(-45deg, #374151 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #374151 75%), 
            linear-gradient(-45deg, transparent 75%, #374151 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          background-color: #1f2937;
        }
      `}</style>
    </div>
  );
};

export default App;