import React, { useState, useCallback } from 'react';
import {
  Upload,
  FileText,
  X,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const PDFMerger = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [mergeStatus, setMergeStatus] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const pdfFiles = droppedFiles.filter(file => file.type === 'application/pdf');
      setFiles(prev => [...prev, ...pdfFiles.map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
      }))]);
    }
  }, []);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    setFiles(prev => [...prev, ...pdfFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
    }))]);
  };

  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setMergeStatus({ type: 'error', message: 'Please select at least 2 PDF files to merge.' });
      return;
    }

    setIsUploading(true);
    setMergeStatus(null);

    const formData = new FormData();
    files.forEach(fileObj => {
      formData.append('pdfs', fileObj.file);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}merge/merge-pdfs`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to merge PDFs');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `merged-pdfs-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMergeStatus({ type: 'success', message: 'PDFs merged successfully! Download started.' });
      setFiles([]);
    } catch (error) {
      setMergeStatus({ type: 'error', message: 'Failed to merge PDFs. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  const moveFile = (fromIndex, toIndex) => {
    const newFiles = [...files];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);
    setFiles(newFiles);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start p-6"
      style={{ backgroundColor: '#000000', color: '#ffffff' }}
    >
      <div className="w-full max-w-4xl">
        <div className="rounded-xl shadow-xl p-8 transition-all" style={{ backgroundColor: '#111111' }}>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-[#23b5b5] tracking-wide">PDF Merger</h1>
            <p className="text-gray-400 text-lg">Combine multiple PDFs into a single file easily</p>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
              dragActive ? 'border-[#23b5b5] bg-[#1a1a1a] shadow-[0_0_10px_#23b5b5]' : 'border-gray-700 hover:border-[#23b5b5]'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-500 mb-4 animate-bounce" />
            <p className="text-xl font-medium mb-2">Drop PDF files here or click to upload</p>
            <p className="text-sm text-gray-400 mb-4">Supports multiple files (PDF only)</p>
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="inline-flex items-center px-5 py-2 rounded-md font-semibold text-black transition duration-200"
              style={{ backgroundColor: '#23b5b5' }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Browse Files
            </label>
          </div>

          {mergeStatus && (
            <div
              className={`mt-5 p-4 rounded-md flex items-center text-sm transition-all ${
                mergeStatus.type === 'success' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'
              }`}
            >
              {mergeStatus.type === 'success' ? <CheckCircle className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
              {mergeStatus.message}
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-8 animate-fade-in-up">
              <h3 className="text-lg font-semibold mb-4">Selected Files ({files.length})</h3>
              <div className="space-y-2 transition-all">
                {files.map((fileObj, index) => (
                  <div
                    key={fileObj.id}
                    className="flex items-center justify-between p-3 rounded-lg border transition-colors duration-200"
                    style={{ backgroundColor: '#1a1a1a', borderColor: '#333' }}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                      moveFile(fromIndex, index);
                    }}
                  >
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-[#23b5b5] mr-3" />
                      <div>
                        <p className="font-medium">{fileObj.name}</p>
                        <p className="text-sm text-gray-400">{formatFileSize(fileObj.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">#{index + 1}</span>
                      <button
                        onClick={() => removeFile(fileObj.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={mergePDFs}
                  disabled={isUploading || files.length < 2}
                  className="inline-flex items-center px-6 py-3 rounded-md text-black font-semibold transition duration-300 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: isUploading || files.length < 2 ? '#333' : '#23b5b5',
                  }}
                >
                  {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                  {isUploading ? 'Merging...' : 'Merge PDFs'}
                </button>
              </div>
            </div>
          )}

          <div className="mt-10 p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
            <h4 className="font-semibold mb-2 text-[#23b5b5]">Tips:</h4>
            <ul className="text-sm text-gray-400 space-y-1 list-disc pl-5">
              <li>Upload at least 2 PDF files</li>
              <li>Reorder by dragging the file tiles</li>
              <li>Click "Merge PDFs" to combine and download</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFMerger;
