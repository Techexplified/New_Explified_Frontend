import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [inputText, setInputText] = useState("");
  const [textStack, setTextStack] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Replace with your actual backend API base URL
  const API_BASE_URL = "http://localhost:3000/api"; // Update this to your backend URL

  // Fetch all text entries when component mounts
  useEffect(() => {
    fetchTextEntries();
  }, []);

  // GET - Fetch all text entries from backend
  const fetchTextEntries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/texts`);
      setTextStack(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching text entries:", err);
      setError("Failed to fetch text entries");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
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
          [file.name]: true,
        }));
      };
      reader.readAsArrayBuffer(file);
      
      // Upload file to backend
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axios.post(
          `${API_BASE_URL}/upload`,
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

  // POST - Add new text entry to backend
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim() === "") return;

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/texts`, {
        text: inputText.trim(),
        timestamp: new Date().toISOString()
      });
      
      // Add the new text to the stack with the ID from backend
      setTextStack((prev) => [...prev, response.data]);
      setInputText("");
      setError(null);
    } catch (err) {
      console.error("Error adding text:", err);
      setError("Failed to add text entry");
    } finally {
      setLoading(false);
    }
  };

  // DELETE - Remove text entry from backend
  const handleDeleteText = async (idx) => {
    const textEntry = textStack[idx];
    const textId = textEntry.id || textEntry._id; // Handle both id formats

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/texts/${textId}`);
      
      // Remove from local state
      setTextStack((prev) => prev.filter((_, i) => i !== idx));
      
      if (editIndex === idx) {
        setEditIndex(null);
        setEditValue("");
      }
      setError(null);
    } catch (err) {
      console.error("Error deleting text:", err);
      setError("Failed to delete text entry");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit mode
  const handleEditText = (idx) => {
    setEditIndex(idx);
    const textEntry = textStack[idx];
    setEditValue(typeof textEntry === 'string' ? textEntry : textEntry.text);
  };

  // PUT - Update text entry in backend
  const handleEditSave = async (idx) => {
    if (editValue.trim() === "") return;

    const textEntry = textStack[idx];
    const textId = textEntry.id || textEntry._id; // Handle both id formats

    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/texts/${textId}`, {
        text: editValue.trim(),
        updatedAt: new Date().toISOString()
      });

      // Update local state
      setTextStack((prev) => 
        prev.map((item, i) => 
          i === idx ? response.data : item
        )
      );
      
      setEditIndex(null);
      setEditValue("");
      setError(null);
    } catch (err) {
      console.error("Error updating text:", err);
      setError("Failed to update text entry");
    } finally {
      setLoading(false);
    }
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

  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col">
      {/* Top bar */}
      <div className="p-4 flex items-center border-b border-gray-700 bg-gray-800">
        <button
          onClick={() => navigate('/admin')}
          className="text-gray-300 hover:text-white transition flex items-center gap-2 px-3 py-2 rounded-md border border-transparent hover:border-[#23b5b5] bg-gray-900 hover:bg-[#23b5b5]/20 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]"
        >
          <FiArrowLeft size={24} />
          Back
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 mx-6 mt-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Main content: 2 columns */}
      <div className="flex flex-1 w-full">
        {/* Left: Text stack with scrollable area, input pinned at bottom */}
        <div className="flex flex-col flex-1 max-w-xl px-6 py-8">
          <h2 className="text-white text-xl font-semibold mb-4">
            Text Stack {loading && <span className="text-sm text-gray-400">(Loading...)</span>}
          </h2>
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2 space-y-2" style={{ maxHeight: 'calc(100vh - 260px)' }}>
              {textStack.length > 0 ? (
                textStack.map((textEntry, idx) => {
                  // Handle both string and object formats
                  const text = typeof textEntry === 'string' ? textEntry : textEntry.text;
                  
                  return (
                    <div
                      key={textEntry.id || textEntry._id || idx}
                      className="bg-[#182c36] text-white px-4 py-2 rounded-lg shadow text-lg flex items-center justify-between gap-2 border border-transparent transition-all duration-200 group hover:border-[#23b5b5] hover:bg-[#22394a] hover:scale-[1.03] hover:shadow-lg animate-fadein"
                      style={{ boxShadow: '0 2px 8px 0 rgba(35,181,181,0.10)' }}
                    >
                      {editIndex === idx ? (
                        <>
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-2 py-1 rounded bg-gray-100 text-gray-900 text-lg mr-2 border border-[#23b5b5] focus:outline-none focus:ring-2 focus:ring-[#23b5b5]"
                            disabled={loading}
                          />
                          <button
                            onClick={() => handleEditSave(idx)}
                            disabled={loading}
                            className="bg-[#312e81] hover:bg-[#1e1b4b] text-white px-3 py-1 rounded shadow transition-colors duration-150 mr-2 border border-[#312e81] hover:border-[#1e1b4b] disabled:opacity-50"
                          >
                            {loading ? "..." : "Save"}
                          </button>
                          <button
                            onClick={() => { setEditIndex(null); setEditValue(""); }}
                            disabled={loading}
                            className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1 rounded shadow border border-gray-800 hover:border-gray-900 transition-colors duration-150 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 font-medium group-hover:text-white transition-colors duration-150">{text}</span>
                          <button
                            onClick={() => handleEditText(idx)}
                            disabled={loading}
                            className="bg-[#334155] hover:bg-[#1e293b] text-white font-semibold px-3 py-1 rounded shadow border border-[#334155] hover:border-[#1e293b] transition-colors duration-150 mr-2 disabled:opacity-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteText(idx)}
                            disabled={loading}
                            className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-3 py-1 rounded shadow border border-[#0f172a] hover:border-[#1e293b] transition-colors duration-150 disabled:opacity-50"
                          >
                            {loading ? "..." : "Delete"}
                          </button>
                        </>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-400">
                  {loading ? "Loading text entries..." : "No texts added yet."}
                </div>
              )}
            </div>
            {/* Input box pinned at the bottom of left column */}
            <form onSubmit={handleTextSubmit} className="pt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text and press Enter"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-[#23b5b5] text-lg"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="bg-[#23b5b5] hover:bg-[#1a8a8a] text-white font-semibold px-6 py-2 rounded-lg text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: File upload and Excel preview */}
        <div className="flex flex-col flex-1 px-6 py-8 border-l border-gray-800 min-w-[350px]">
          <div className="mb-6">
            <label
              htmlFor="file-upload"
              className="cursor-pointer w-48 h-10 bg-[#23b5b5] hover:bg-[#1a8a8a] text-white text-base font-semibold rounded-lg shadow flex items-center justify-center transition px-4"
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
          </div>

          {/* Progress Bars */}
          {uploadingFiles.length > 0 && (
            <div className="w-full max-w-xl space-y-4 mb-6">
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

          {/* Uploaded Files Links (scrollable) */}
          {uploadedFiles.length > 0 && (
            <div className="w-full max-w-xl mt-8 overflow-y-auto mb-6" style={{ maxHeight: '200px' }}>
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
    </div>
  );
};

export default InventoryComp;