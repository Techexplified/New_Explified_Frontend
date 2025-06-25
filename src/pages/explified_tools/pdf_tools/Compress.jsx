import React, { useState } from "react";
import {
  Upload,
  FileText,
  Download,
  Zap,
  Settings,
  CheckCircle,
} from "lucide-react";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preset, setPreset] = useState("web");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const calculateCompressionRatio = () => {
    if (originalSize && compressedSize) {
      return Math.round(((originalSize - compressedSize) / originalSize) * 100);
    }
    return 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setOriginalSize(file ? file.size : 0);
    setDownloadUrl("");
    setCompressedSize(0);
  };

  const handleCompress = async () => {
    if (!selectedFile) return alert("Please select a file");

    setIsCompressing(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("preset", preset);

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}compress/compress-pdf`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setDownloadUrl(data.downloadUrl);

      const sizeResponse = await fetch(data.downloadUrl, { method: "HEAD" });
      const size = parseInt(sizeResponse.headers.get("content-length") || "0");
      setCompressedSize(size);
    } catch (err) {
      console.error(err);
      alert("Compression failed");
    } finally {
      setIsCompressing(false);
    }
  };

  const compressionOptions = [
    { value: "web", label: "Balanced", desc: "Good balance" },
    { value: "archive", label: "Max Compression", desc: "Smallest size" },
    { value: "printer", label: "High Quality", desc: "Best quality" },
    { value: "ebook", label: "E-Reader", desc: "Optimized for reading" },
    { value: "text", label: "Text Docs", desc: "Best for text" },
    { value: "none", label: "No Compression", desc: "Original size" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-[#23b5b5] mr-3" />
            <h1 className="text-4xl font-bold">PDF Compressor</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Reduce PDF size while maintaining quality
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-700">
              <div className="flex items-center mb-6">
                <Upload className="w-6 h-6 text-[#23b5b5] mr-3" />
                <h2 className="text-xl font-semibold">Upload PDF</h2>
              </div>

              <div className="border-2 border-dashed border-zinc-600 rounded-xl p-8 text-center hover:border-[#23b5b5] transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-10 h-10 text-zinc-400 mx-auto mb-4" />
                  <p className="font-medium mb-2">Click to upload PDF</p>
                  <p className="text-gray-400 text-sm">or drag and drop here</p>
                </label>
              </div>

              {selectedFile && (
                <div className="mt-6 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-[#23b5b5] mr-3" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-gray-400 text-sm">
                        Size: {formatFileSize(originalSize)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Compression Settings */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-700">
              <div className="flex items-center mb-6">
                <Settings className="w-6 h-6 text-[#23b5b5] mr-3" />
                <h2 className="text-xl font-semibold">Compression Settings</h2>
              </div>

              <div className="grid gap-3">
                {compressionOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 rounded-lg text-sm border cursor-pointer transition-all ${
                      preset === option.value
                        ? "border-[#23b5b5] bg-[#23b5b5]/10"
                        : "border-zinc-700 hover:border-zinc-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="preset"
                      value={option.value}
                      checked={preset === option.value}
                      onChange={(e) => setPreset(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 mr-3 ${
                        preset === option.value
                          ? "border-[#23b5b5] bg-[#23b5b5]"
                          : "border-gray-500"
                      }`}
                    />
                    <div>
                      <p className="text-white">{option.label}</p>
                      <p className="text-gray-400 text-xs">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={handleCompress}
                disabled={!selectedFile || isCompressing}
                className="w-full mt-6 bg-[#23b5b5] hover:bg-[#1aa5a5] disabled:bg-gray-600 text-black font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center"
              >
                {isCompressing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                    Compressing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-3" />
                    Compress PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {(compressedSize > 0 || downloadUrl) && (
            <div className="mt-10 bg-zinc-900 rounded-2xl p-6 border border-zinc-700">
              <div className="flex items-center mb-6">
                <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                <h2 className="text-xl font-semibold">Compression Complete</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-zinc-800 rounded-xl border border-zinc-700">
                  <p className="text-gray-400 text-sm mb-2">Original Size</p>
                  <p className="text-2xl font-bold">
                    {formatFileSize(originalSize)}
                  </p>
                </div>
                <div className="text-center p-4 bg-zinc-800 rounded-xl border border-zinc-700">
                  <p className="text-gray-400 text-sm mb-2">Compressed Size</p>
                  <p className="text-2xl font-bold text-[#23b5b5]">
                    {formatFileSize(compressedSize)}
                  </p>
                </div>
                <div className="text-center p-4 bg-zinc-800 rounded-xl border border-zinc-700">
                  <p className="text-gray-400 text-sm mb-2">Space Saved</p>
                  <p className="text-2xl font-bold text-green-400">
                    {calculateCompressionRatio()}%
                  </p>
                </div>
              </div>

              {downloadUrl && (
                <div className="text-center">
                  <a
                    href={downloadUrl}
                    download={`${selectedFile.name.replace(
                      /\.pdf$/i,
                      ""
                    )}_compressed.pdf`}
                    className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-8 rounded-xl transition-all"
                  >
                    <Download className="w-5 h-5 mr-3" />
                    Download Compressed PDF
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
