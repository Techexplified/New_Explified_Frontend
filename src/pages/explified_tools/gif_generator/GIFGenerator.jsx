import React, { useState, useRef } from "react";
import { Mic, Camera, Upload, Type, Image, Video } from "lucide-react";
import axiosInstance from "../../../network/axiosInstance";

export default function AIGIFGenerator() {
  const [inputText, setInputText] = useState("");
  const [activeTab, setActiveTab] = useState("Humor");
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uid, setUid] = useState("cmdos6rth00o51e0z2ptt3ddw");
  const [url, setUrl] = useState("");

  const fileInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const tabs = ["Humor", "Witty", "Relatable", "Work"];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedDocument(file);
    }
  };

  const handleCameraCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      streamRef.current = stream;
      setIsCameraOpen(true);

      // Wait for the modal to render before setting video source
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current
            .play()
            .catch((e) => console.error("Error playing video:", e));
        }
      }, 100);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Error accessing camera. Please check permissions and make sure you're using HTTPS or localhost."
      );
    }
  };

  const capturePhoto = () => {
    if (
      videoRef.current &&
      canvasRef.current &&
      videoRef.current.videoWidth > 0
    ) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      // Draw the video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob and then to data URL
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              setUploadedImage(e.target.result);
              closeCamera();
            };
            reader.readAsDataURL(blob);
          }
        },
        "image/jpeg",
        0.8
      );
    } else {
      alert("Camera not ready. Please wait a moment and try again.");
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Error accessing microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleGenerate = async () => {
    // console.log("Generating GIF with:", {
    //   text: inputText,
    //   image: uploadedImage,
    //   document: uploadedDocument,
    //   audio: audioBlob,
    //   category: activeTab,
    // });

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("api/aiGifGenerator", {
        prompt: inputText,
      });

      console.log(response);
      setUid(response?.data?.content);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGIF = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("api/aiGifGenerator/getgif", {
        uid,
      });

      console.log(response);
      setUrl(response?.data?.content);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-12">
          AI GIF Generator
        </h1>

        {/* Generate GIF Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Generate GIF</h2>

          {/* Input Container */}
          <div className="relative mb-4">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Describe what the GIF should communicate — the story, the mood, or the core message behind the visual"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400 resize-none h-24 pr-32"
            />

            {/* Control Icons */}
            <div className="absolute right-3 bottom-3 flex items-center space-x-3">
              {/* Document Upload */}
              <button
                onClick={() => documentInputRef.current?.click()}
                className="text-gray-400 hover:text-white transition-colors"
                title="Upload Document"
              >
                <Upload size={20} />
              </button>
              <input
                ref={documentInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.rtf"
                onChange={handleDocumentUpload}
                className="hidden"
              />

              {/* <button className="text-gray-400 hover:text-white transition-colors">
                <Type size={20} />
              </button> */}

              {/* Image Upload from Gallery */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-white transition-colors"
                title="Upload Image from Gallery"
              >
                <Image size={20} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Camera Capture */}
              <button
                onClick={startCamera}
                className="text-gray-400 hover:text-white transition-colors"
                title="Take Photo with Camera"
              >
                <Camera size={20} />
              </button>

              {/* Voice Recording */}
              <button
                onClick={handleMicClick}
                className={`transition-colors ${
                  isRecording
                    ? "text-red-500"
                    : "text-gray-400 hover:text-white"
                }`}
                title={isRecording ? "Stop Recording" : "Start Voice Recording"}
              >
                <Mic size={20} />
              </button>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Generate
              </button>
            </div>
          </div>

          {/* Upload Status */}
          <div className="flex items-center space-x-4 text-sm">
            {uploadedDocument && (
              <div className="flex items-center space-x-2 text-green-400">
                <Upload size={16} />
                <span>Document uploaded: {uploadedDocument.name}</span>
              </div>
            )}
            {uploadedImage && (
              <div className="flex items-center space-x-2 text-green-400">
                <Image size={16} />
                <span>Image uploaded</span>
              </div>
            )}
            {audioBlob && (
              <div className="flex items-center space-x-2 text-green-400">
                <Mic size={16} />
                <span>Audio recorded</span>
              </div>
            )}
            {isRecording && (
              <div className="flex items-center space-x-2 text-red-400">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Recording...</span>
              </div>
            )}
          </div>
        </div>

        {/* Camera Modal */}
        {isCameraOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Take a Photo</h3>
                <button
                  onClick={closeCamera}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="relative mb-4 bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover"
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      videoRef.current.play();
                    }
                  }}
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={closeCamera}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={capturePhoto}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
                >
                  Take Photo
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-6 mt-6">
          <button
            onClick={getGIF}
            className="bg-[#23b5b5] hover:bg-[#1da3a3] text-white font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-200"
          >
            Get GIF
          </button>

          {url && (
            <div className="flex flex-col items-center gap-4">
              <img
                src={url}
                alt="gif"
                className="h-48 w-48 object-cover rounded-lg border border-gray-300 shadow"
              />
              <a href={url} download="my-gif.gif">
                <button className="bg-[#23b5b5] hover:bg-[#1da3a3] text-white font-medium px-4 py-2 rounded-full shadow transition duration-200">
                  Download GIF
                </button>
              </a>
            </div>
          )}
        </div>

        {/* Looking for Inspiration Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Looking for Inspiration?
          </h2>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-white text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="aspect-square bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
              >
                {/* Placeholder for inspiration content */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
