import { useState, useRef } from "react";
import { Image, Music, Paperclip, Mic, X } from "lucide-react";
import { MdSpeed } from "react-icons/md";
import {
  PiClosedCaptioningFill,
  PiClosedCaptioningLight,
} from "react-icons/pi";
import Inspiration from "./Inspiration";

export default function AIMemeGenerator() {
  const [inputText, setInputText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState("");
  const [captionOn, setCaptionOn] = useState(true);

  const handleToggle = () => {
    setCaptionOn((prev) => !prev);
  };

  const speeds = [
    { label: "5 sec", value: 5 },
    { label: "10 sec", value: 10 },
    { label: "15 sec", value: 15 },
  ];

  // Refs for file inputs
  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleMemeGenerate = () => {
    console.log("Generating meme with:", inputText);
    console.log("Uploaded files:", uploadedFiles);
    console.log("Audio blob:", audioBlob);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              type: "image",
              name: file.name,
              url: e.target.result,
              file: file,
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
    event.target.value = ""; // Reset input
  };
  const handleDocumentUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      setUploadedFiles((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          type: "document",
          name: file.name,
          file: file,
        },
      ]);
    });
    event.target.value = ""; // Reset input
  };
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);
        setUploadedFiles((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "audio",
            name: `Recording_${new Date().toLocaleTimeString()}.wav`,
            blob: audioBlob,
          },
        ]);

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-6">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold tracking-tight">AI Meme Generator</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4">
        {/* Input Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">
            Describe your meme!
          </h2>

          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="What's on your mind? Type it out or attach a link — we'll meme it!"
              className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none"
            />

            {/* Input Actions */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                {/* Document Upload */}
                <input
                  type="file"
                  ref={documentInputRef}
                  onChange={handleDocumentUpload}
                  accept=".pdf,.doc,.docx,.txt,.rtf"
                  className="hidden"
                  multiple
                />
                <button
                  onClick={() => documentInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Upload document"
                >
                  <Paperclip size={20} />
                </button>

                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  multiple
                />
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Upload document"
                >
                  <Image size={20} />
                </button>

                {/* Voice Recording */}
                <button
                  onClick={toggleRecording}
                  className={`p-2 transition-colors ${
                    isRecording
                      ? "text-red-500 hover:text-red-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title={isRecording ? "Stop recording" : "Start recording"}
                >
                  <Mic size={20} />
                  {isRecording && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="flex flex-col items-center gap-2 hover:bg-gray-700 p-2 rounded-lg transition-colors"
                >
                  <MdSpeed size={20} />
                  <span className="text-[8px]">
                    {selectedSpeed ? selectedSpeed : "Duration"}
                  </span>
                </button>

                {showDropdown && (
                  <div className="absolute top-full mt-1 w-28 bg-gray-800 border border-gray-600 rounded shadow-lg z-50">
                    {speeds.map((speed) => (
                      <div
                        key={speed.value}
                        onClick={() => {
                          setSelectedSpeed(speed.label);
                          setShowDropdown(false);
                          // Add speed logic here if needed
                        }}
                        className="px-4 py-2 text-sm hover:bg-gray-700 cursor-pointer"
                      >
                        {speed.label}
                      </div>
                    ))}
                  </div>
                )}

                <button className="flex flex-col items-center gap-2 hover:bg-gray-700 p-2 rounded-lg transition-colors">
                  <Music size={20} />
                  <span className="text-[8px]">Background Song</span>
                </button>

                <button
                  onClick={handleToggle}
                  className="flex flex-col items-center gap-2 hover:bg-gray-700 p-2 rounded-lg transition-colors"
                >
                  {captionOn ? (
                    <PiClosedCaptioningFill size={20} />
                  ) : (
                    <PiClosedCaptioningLight size={20} />
                  )}
                  <span className="text-[8px]">
                    {captionOn ? "Caption" : "No Caption"}
                  </span>
                </button>

                <button
                  onClick={handleMemeGenerate}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
                >
                  Meme
                </button>
              </div>
            </div>
          </div>

          {/* Uploaded Files Display */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-300">
                Uploaded Files:
              </h3>
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="relative group">
                    {file.type === "image" ? (
                      <div className="relative">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                        />
                        <button
                          onClick={() => removeFile(file.id)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg border border-gray-600">
                        <div className="text-xs text-gray-300 max-w-32 truncate">
                          {file.name}
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Inspiration />
    </div>
  );
}
