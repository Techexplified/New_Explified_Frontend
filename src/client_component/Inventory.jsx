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
  const API_BASE_URL = "https://explified-app.web.app/api/trainingmodule";

  // Fetch all text entries when component mounts
  useEffect(() => {
    fetchTextEntries();
  }, []);

  // GET - Fetch all text entries from backend
  const fetchTextEntries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/get/text`);
      // Extract the data array from the response
      setTextStack(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching text entries:", err);
      setError("Failed to fetch text entries");
      setTextStack([]); // Ensure textStack is always an array
    } finally {
      setLoading(false);
    }
  };

  // POST - Create new text entry
  const createTextEntry = async (textContent) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/text`, {
        text: textContent,
        timestamp: new Date().toISOString()
      });
      
      // Extract the created item (handle nested response structure)
      const newItem = response.data.data || response.data;
      
      // Add the new text to the TOP of the stack with the ID from backend
      setTextStack((prev) => [newItem, ...(prev || [])]);
      setError(null);
      return newItem;
    } catch (err) {
      console.error("Error creating text:", err);
      setError("Failed to create text entry");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // PUT - Update existing text entry
  const updateTextEntry = async (textId, textContent) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/text/update/${textId}`, {
        text: textContent,
        updatedAt: new Date().toISOString()
      });

      // Extract the updated item (handle nested response structure)
      const updatedItem = response.data.data || response.data;

      // Update local state
      setTextStack((prev) => 
        (prev || []).map((item) => 
          (item.id || item._id) === textId ? updatedItem : item
        )
      );
      
      setError(null);
      return updatedItem;
    } catch (err) {
      console.error("Error updating text:", err);
      setError("Failed to update text entry");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // DELETE - Remove text entry from backend
  const deleteTextEntry = async (textId) => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/text/delete/${textId}`);
      
      // Remove from local state
      setTextStack((prev) => (prev || []).filter((item) => (item.id || item._id) !== textId));
      
      setError(null);
    } catch (err) {
      console.error("Error deleting text:", err);
      setError("Failed to delete text entry");
      throw err;
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
      await createTextEntry(inputText.trim());
      setInputText("");
    } catch {
      // Error is already handled in createTextEntry function
    }
  };

  // DELETE - Remove text entry from backend
  const handleDeleteText = async (idx) => {
    const textEntry = textStack[idx];
    const textId = textEntry.id || textEntry._id; // Handle both id formats

    try {
      await deleteTextEntry(textId);
      
      if (editIndex === idx) {
        setEditIndex(null);
        setEditValue("");
      }
    } catch {
      // Error is already handled in deleteTextEntry function
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
      await updateTextEntry(textId, editValue.trim());
      
      setEditIndex(null);
      setEditValue("");
    } catch {
      // Error is already handled in updateTextEntry function
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
    <div
      className="w-full h-full flex flex-col items-center relative overflow-hidden text-white"
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0f12 0%, #0d1418 25%, #111c20 50%, #0d1418 75%, #0a0f12 100%)", backgroundSize: "400% 400%", animation: "gradientShift 3s ease-in-out infinite" }}
    >
      {/* Animated background overlays */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#23b5b5]/20 via-transparent to-[#23b5b5]/10 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,_rgba(35,181,181,0.15)_0%,_transparent_50%)]" style={{ animation: "float1 2.5s ease-in-out infinite" }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,_rgba(35,181,181,0.12)_0%,_transparent_50%)]" style={{ animation: "float2 3s ease-in-out infinite reverse" }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,_rgba(35,181,181,0.08)_0%,_transparent_60%)]" style={{ animation: "float3 3.5s ease-in-out infinite" }}></div>
      </div>
      {/* Subtle moving particles */}
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ zIndex: 1 }}>
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#23b5b5] rounded-full animate-ping" style={{animationDelay: '0s', animationDuration: '1.5s'}}></div>
        <div className="absolute top-3/4 right-1/3 w-0.5 h-0.5 bg-[#23b5b5] rounded-full animate-ping" style={{animationDelay: '0.5s', animationDuration: '2s'}}></div>
        <div className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-[#23b5b5] rounded-full animate-ping" style={{animationDelay: '1s', animationDuration: '1.8s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-[#23b5b5] rounded-full animate-ping" style={{animationDelay: '0.3s', animationDuration: '2.2s'}}></div>
        <div className="absolute top-1/6 right-1/6 w-0.5 h-0.5 bg-[#23b5b5] rounded-full animate-ping" style={{animationDelay: '0.8s', animationDuration: '1.6s'}}></div>
      </div>
      {/* CSS Keyframes for custom animations */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10px, -15px) scale(1.1); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-15px, 10px) scale(0.9); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5px, -20px) scale(1.05); }
        }
      `}</style>
      {/* Top bar */}
      <div className="p-4 flex items-center border-b border-[#23b5b5]/30 bg-transparent w-full max-w-6xl mx-auto" style={{zIndex: 2}}>
        <button
          onClick={() => navigate(-1)}
          className="text-[#23b5b5] hover:text-white transition flex items-center gap-2 px-3 py-2 rounded-md border border-[#23b5b5] bg-transparent hover:bg-[#23b5b5]/20 focus:outline-none focus:ring-2 focus:ring-[#23b5b5] font-semibold"
        >
          <FiArrowLeft size={24} />
          Back
        </button>
        <h1 className="ml-6 text-2xl font-bold text-white tracking-wide">Inventory Management</h1>
      </div>
      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 mx-6 mt-4 rounded-lg shadow" style={{zIndex: 2}}>
          {error}
        </div>
      )}
      {/* Main content: 2 columns */}
      <div className="flex flex-1 w-full max-w-6xl mx-auto relative z-10">
        {/* Left: Text stack with scrollable area, input pinned at bottom */}
        <div className="flex flex-col flex-1 max-w-xl px-8 py-10">
          <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="inline-block w-2 h-6 bg-[#23b5b5] rounded-full mr-2"></span>
            Text Stack {loading && <span className="text-base text-gray-400 font-normal">(Loading...)</span>}
          </h2>
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2 space-y-3" style={{ maxHeight: 'calc(100vh - 260px)' }}>
              {textStack.length > 0 ? (
                textStack.map((textEntry, idx) => {
                  // Handle both string and object formats
                  const text = typeof textEntry === 'string' ? textEntry : textEntry.text;
                  return (
                    <div
                      key={textEntry.id || textEntry._id || idx}
                      className="bg-[#181f23] text-white px-4 py-2 rounded-lg text-base flex items-center justify-between gap-2 border border-[#23b5b5]/10 transition-colors duration-150 group hover:border-[#23b5b5] hover:bg-[#181f23]/90"
                      style={{ maxWidth: '100%' }}
                    >
                      {editIndex === idx ? (
                        <>
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-2 py-1 rounded bg-gray-100 text-gray-900 text-base mr-2 border border-[#23b5b5] focus:outline-none focus:ring-2 focus:ring-[#23b5b5]"
                            disabled={loading}
                          />
                          <button
                            onClick={() => handleEditSave(idx)}
                            disabled={loading}
                            className="bg-[#23b5b5] hover:bg-[#1a8a8a] text-white px-3 py-1 rounded border border-[#23b5b5] hover:border-[#1a8a8a] disabled:opacity-50 font-medium"
                          >
                            {loading ? "..." : "Save"}
                          </button>
                          <button
                            onClick={() => { setEditIndex(null); setEditValue(""); }}
                            disabled={loading}
                            className="bg-gray-700 hover:bg-gray-900 text-white px-3 py-1 rounded border border-gray-700 hover:border-gray-900 disabled:opacity-50 font-medium"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 font-medium group-hover:text-white transition-colors duration-150 overflow-hidden text-ellipsis whitespace-nowrap min-w-0 text-base">{text}</span>
                          <button
                            onClick={() => handleEditText(idx)}
                            disabled={loading}
                            className="bg-[#232b2f] hover:bg-[#23b5b5] text-white font-medium px-3 py-1 rounded border border-[#232b2f] hover:border-[#23b5b5] transition-colors duration-150 mr-2 disabled:opacity-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteText(idx)}
                            disabled={loading}
                            className="bg-[#181f23] hover:bg-red-600 text-white px-3 py-1 rounded border border-[#181f23] hover:border-red-600 transition-colors duration-150 disabled:opacity-50 font-medium"
                          >
                            {loading ? "..." : "Delete"}
                          </button>
                        </>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-400 text-base font-medium">
                  {loading ? "Loading text entries..." : "No texts added yet."}
                </div>
              )}
            </div>
            {/* Input box pinned at the bottom of left column */}
            <form onSubmit={handleTextSubmit} className="pt-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text and press Enter"
                  className="flex-1 px-5 py-3 rounded-lg bg-[#232b2f] text-white border border-[#23b5b5]/30 focus:outline-none focus:border-[#23b5b5] text-lg"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="bg-[#23b5b5] hover:bg-[#1a8a8a] text-white font-bold px-7 py-3 rounded-lg text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Right: File upload and Excel preview */}
        <div className="flex flex-col flex-1 px-8 py-10 border-l border-[#23b5b5]/20 min-w-[350px] bg-transparent">
          <div className="mb-8">
            <label
              htmlFor="file-upload"
              className="cursor-pointer w-56 h-12 bg-[#23b5b5] hover:bg-[#1a8a8a] text-white text-lg font-bold rounded-lg flex items-center justify-center transition px-6"
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
            <div className="w-full max-w-xl space-y-4 mb-8">
              {uploadingFiles.map((fileName) => {
                const progress = uploadProgress[fileName] ?? 0;
                return (
                  <div key={fileName}>
                    <div className="text-gray-200 mb-1 font-semibold">{fileName}</div>
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
            <div className="w-full max-w-xl mt-8 overflow-y-auto mb-8" style={{ maxHeight: '200px' }}>
              <h3 className="text-lg text-white font-bold mb-3">
                ✅ Uploaded Files
              </h3>
              <ul className="space-y-2">
                {uploadedFiles.map((file, idx) => (
                  <li
                    key={idx}
                    className="text-[#23b5b5] hover:text-white underline transition font-semibold"
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
                    className="bg-[#181f23] rounded-lg border border-[#23b5b5]/20"
                  >
                    <div className="flex justify-between items-center px-4 py-3 border-b border-[#23b5b5]/20">
                      <button
                        onClick={() => toggleCollapse(preview.fileName)}
                        className="flex items-center gap-2 text-white font-bold"
                      >
                        {isCollapsed ? <FiChevronRight /> : <FiChevronDown />}
                        {preview.fileName} <span className="ml-2 text-[#23b5b5] font-semibold">({preview.data.length} rows)</span>
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
                        <table className="min-w-full border-collapse border border-[#23b5b5]/20 text-white rounded-lg overflow-hidden">
                          <tbody>
                            {preview.data.map((row, rowIndex) => (
                              <tr
                                key={rowIndex}
                                className={rowIndex === 0 ? "bg-[#23b5b5] text-black" : ""}
                              >
                                {row.map((cell, cellIndex) => (
                                  <td
                                    key={cellIndex}
                                    className={`border border-[#23b5b5]/20 px-3 py-1 text-sm ${
                                      rowIndex === 0
                                        ? "font-bold text-black"
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