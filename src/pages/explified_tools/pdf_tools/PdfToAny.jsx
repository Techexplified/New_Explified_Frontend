import React, { useState, useRef } from "react";
import {
  Upload,
  FileDown,
  CheckCircle,
  Loader2,
  Trash2,
} from "lucide-react";

const mimeMap = {
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  png: "image/png",
  jpg: "image/jpeg",
  txt: "text/plain",
};

const outputFormats = [
  { label: "Word (.docx)", value: "docx" },
  { label: "PowerPoint (.pptx)", value: "pptx" },
  { label: "Excel (.xlsx)", value: "xlsx" },
  { label: "Text (.txt)", value: "txt" },
  { label: "Image (.png)", value: "png" },
  { label: "Image (.jpg)", value: "jpg" },
  { label: "HTML (.html)", value: "html" },
];

const PDFConverter = () => {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState("docx");
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [convertedFileURL, setConvertedFileURL] = useState(null);
  const [convertedFileName, setConvertedFileName] = useState("");
  const inputRef = useRef();

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === "application/pdf") {
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
    inputRef.current.value = ""; // reset file input
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

      const response = await fetch(
        `${import.meta.env.VITE_APP_URL}pdftoany/convert?to=${format}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Conversion failed");
      }

      const result = await response.json();
      if (format === "png") {
        result.Files.forEach((fileObj, index) => {
          const base64Data = fileObj.FileData;
          const fileName = fileObj.FileName || `page${index + 1}.png`;

          const byteCharacters = atob(base64Data);
          const byteArray = new Uint8Array(
            [...byteCharacters].map((char) => char.charCodeAt(0))
          );
          const blob = new Blob([byteArray], { type: "image/png" });
          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          a.click();
        });
      } else {
        // ✅ For single file formats (docx, pptx, etc)
        const base64Data = result.Files[0].FileData;
        const fileName = result.Files[0].FileName;

        const byteCharacters = atob(base64Data);
        const byteArray = new Uint8Array(
          [...byteCharacters].map((char) => char.charCodeAt(0))
        );
        const blob = new Blob([byteArray], { type: mimeMap[format] });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err.message);
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-[#111] p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-[#23b5b5]">PDF Converter</h1>
          <p className="text-gray-400">Convert PDF to any format easily</p>
        </div>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center mb-6 bg-[#181818]">
          <Upload className="mx-auto h-12 w-12 text-gray-500 mb-4 animate-bounce" />
          <p className="text-lg font-medium mb-2">Upload your PDF file</p>
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            id="fileInput"
            ref={inputRef}
            onChange={handleFileSelect}
          />
          <label
            htmlFor="fileInput"
            className="inline-flex items-center px-5 py-2 rounded-md font-semibold text-black cursor-pointer"
            style={{ backgroundColor: "#23b5b5" }}
          >
            <Upload className="w-4 h-4 mr-2" />
            Browse PDF
          </label>
        </div>

        {/* File Info + Remove */}
        {file && (
          <div className="flex justify-between items-center mb-4 p-3 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-300">
            <span>
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </span>
            <button
              onClick={handleRemoveFile}
              className="text-red-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Format Selector */}
        <div className="mb-4">
          <label className="block mb-2 text-sm text-gray-300 font-medium">
            Choose output format:
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
          >
            {outputFormats.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Error */}
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
                  Convert to {format.toUpperCase()}
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

        <div className="mt-8 text-center text-xs text-gray-500">
          Powered by ConvertAPI
        </div>
      </div>
    </div>
  );
};

export default PDFConverter;
