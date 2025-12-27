import React, { useState } from "react";
import {
  Upload,
  FileDown,
  CheckCircle,
  Loader2,
  Trash2,
} from "lucide-react";

const PDFToWordConverter = () => {
  const [file, setFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [convertedFileURL, setConvertedFileURL] = useState(null);
  const [convertedFileName, setConvertedFileName] = useState("");

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
      setIsSuccess(false);
      setConvertedFileURL(null);
    } else {
      setError("Please select a valid PDF file");
      setFile(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    setIsSuccess(false);
    setConvertedFileURL(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setError(null);
    setIsSuccess(false);
    setConvertedFileURL(null);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await fetch(`${import.meta.env.VITE_APP_URL}pdftoword/convert`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Conversion failed");
      }

      const result = await response.json();
      const base64Data = result.Files[0].FileData;
      const fileName = result.Files[0].FileName;
      setConvertedFileName(fileName);

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = URL.createObjectURL(blob);
      setConvertedFileURL(url);
      setIsSuccess(true);

      // Auto-download
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadAgain = () => {
    if (convertedFileURL) {
      const a = document.createElement("a");
      a.href = convertedFileURL;
      a.download = convertedFileName;
      a.click();
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start p-6"
      style={{ backgroundColor: "#000000", color: "#ffffff" }}
    >
      <div className="w-full max-w-3xl">
        <div
          className="rounded-xl shadow-xl p-8 transition-all"
          style={{ backgroundColor: "#111111" }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-[#23b5b5] tracking-wide">
              PDF to Word Converter
            </h1>
            <p className="text-gray-400 text-lg">
              Easily convert your PDF to .docx
            </p>
          </div>

          {/* File Upload Section */}
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center mb-6">
            <Upload className="mx-auto h-12 w-12 text-gray-500 mb-4 animate-bounce" />
            <p className="text-xl font-medium mb-2">Upload a PDF to convert</p>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              id="fileInput"
              onChange={handleFileSelect}
            />
            <label
              htmlFor="fileInput"
              className="inline-flex items-center px-5 py-2 rounded-md font-semibold text-black transition duration-200 cursor-pointer"
              style={{ backgroundColor: "#23b5b5" }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Browse File
            </label>
          </div>

          {/* File Info and Remove */}
          {file && (
            <div className="flex justify-between items-center mb-4 p-3 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-300">
              <span>
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
              <button
                onClick={handleRemoveFile}
                className="text-red-400 hover:text-red-600"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-md text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Convert Button */}
          {!isSuccess && (
            <div className="text-center mt-6">
              <button
                onClick={handleConvert}
                disabled={!file || isConverting}
                className={`inline-flex items-center px-6 py-3 rounded-md font-semibold transition duration-300 ${
                  !file || isConverting
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "text-black hover:brightness-110"
                }`}
                style={{
                  backgroundColor:
                    !file || isConverting ? "#333333" : "#23b5b5",
                }}
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4 mr-2" />
                    Convert to Word
                  </>
                )}
              </button>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3 text-green-400 text-lg">
                <CheckCircle className="w-5 h-5" />
                Converted Successfully!
              </div>
              <button
                onClick={handleDownloadAgain}
                className="inline-flex items-center px-5 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-md"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Download Again
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            Powered by ConvertAPI
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFToWordConverter;

