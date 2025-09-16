import { useState } from "react";
import {
  FiArrowLeft,
  FiChevronDown,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import { Link } from "react-router";
import * as XLSX from "xlsx";
import axios from "axios";

const InventoryComp = () => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [excelPreviews, setExcelPreviews] = useState([]);
  const [collapsedStates, setCollapsedStates] = useState({});

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingFiles((prev) => [...prev, ...files.map((file) => file.name)]);

    for (const file of files) {
      const reader = new FileReader();

      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        setExcelPreviews((prev) => [
          ...prev,
          { fileName: file.name, data: jsonData },
        ]);

        setCollapsedStates((prev) => ({
          ...prev,
          [file.name]: true, // collapse initially
        }));
      };

      reader.readAsArrayBuffer(file);

      // Upload file to backend
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "http://localhost:3000/api/upload",
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress((prev) => ({
                ...prev,
                [file.name]: percent,
              }));
            },
          }
        );

        const fileUrl = response.data?.fileUrl || "";
        setUploadedFiles((prev) => [
          ...prev,
          { name: file.name, url: fileUrl },
        ]);

        setTimeout(() => {
          setUploadingFiles((prev) =>
            prev.filter((name) => name !== file.name)
          );
          setUploadProgress((prev) => {
            const updated = { ...prev };
            delete updated[file.name];
            return updated;
          });
        }, 1000);
      } catch (err) {
        console.error("Upload failed for", file.name, err);
        setUploadProgress((prev) => ({ ...prev, [file.name]: -1 }));
      }
    }

    e.target.value = "";
  };

  const toggleCollapse = (fileName) => {
    setCollapsedStates((prev) => ({
      ...prev,
      [fileName]: !prev[fileName],
    }));
  };

  const removePreview = (fileName) => {
    setExcelPreviews((prev) => prev.filter((f) => f.fileName !== fileName));
    setCollapsedStates((prev) => {
      const copy = { ...prev };
      delete copy[fileName];
      return copy;
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col">
      {/* Top bar */}
      <div className="p-4 flex items-center border-b border-gray-700 bg-gray-800">
        <Link
          to="/admin"
          className="text-gray-300 hover:text-white transition flex items-center gap-2 px-3 py-2 rounded-md border border-transparent hover:border-[#23b5b5] bg-gray-900 hover:bg-[#23b5b5]/20"
        >
          <FiArrowLeft size={24} />
          Back
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 gap-6">
        <label
          htmlFor="file-upload"
          className="cursor-pointer w-64 h-16 bg-[#23b5b5] hover:bg-[#1a8a8a] text-white text-xl font-semibold rounded-xl shadow-lg flex items-center justify-center transition"
        >
          Upload Excel Files
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx,.xls,.csv"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Progress Bars */}
        {uploadingFiles.length > 0 && (
          <div className="w-full max-w-xl space-y-4">
            {uploadingFiles.map((fileName) => {
              const progress = uploadProgress[fileName] ?? 0;
              return (
                <div key={fileName}>
                  <div className="text-gray-200 mb-1">{fileName}</div>
                  <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ease-in-out ${
                        progress === -1 ? "bg-red-500" : "bg-[#23b5b5]"
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm text-gray-400 mt-1">
                    {progress === -1
                      ? "❌ Upload failed"
                      : `${progress || 0}% complete`}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Uploaded Files Links */}
        {uploadedFiles.length > 0 && (
          <div className="w-full max-w-xl mt-8">
            <h3 className="text-lg text-white font-semibold mb-3">
              ✅ Uploaded Files
            </h3>
            <ul className="space-y-2">
              {uploadedFiles.map((file, idx) => (
                <li
                  key={idx}
                  className="text-gray-300 hover:text-white underline transition"
                >
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Excel Previews */}
        {excelPreviews.length > 0 && (
          <div className="w-full max-w-6xl mt-10 space-y-8">
            {excelPreviews.map((preview) => {
              const isCollapsed = collapsedStates[preview.fileName];
              return (
                <div
                  key={preview.fileName}
                  className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg"
                >
                  <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
                    <button
                      onClick={() => toggleCollapse(preview.fileName)}
                      className="flex items-center gap-2 text-white font-semibold"
                    >
                      {isCollapsed ? <FiChevronRight /> : <FiChevronDown />}
                      {preview.fileName} ({preview.data.length} rows)
                    </button>

                    <button
                      onClick={() => removePreview(preview.fileName)}
                      className="text-gray-400 hover:text-red-500"
                      title="Remove preview"
                    >
                      <FiX size={18} />
                    </button>
                  </div>

                  {!isCollapsed && (
                    <div className="overflow-auto p-4">
                      <table className="min-w-full border-collapse border border-gray-700 text-white">
                        <tbody>
                          {preview.data.map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className={rowIndex === 0 ? "bg-[#23b5b5]" : ""}
                            >
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className={`border border-gray-700 px-3 py-1 text-sm ${
                                    rowIndex === 0
                                      ? "font-semibold text-white"
                                      : "text-white"
                                  }`}
                                >
                                  {cell !== undefined ? cell.toString() : ""}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryComp;
