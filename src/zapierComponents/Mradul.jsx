import React, { useState, useRef } from "react";
import { Camera, UploadCloud, Download, Loader2 } from "lucide-react";

export default function RemoveBgApp() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultImg, setResultImg] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResultImg(null);
  };

  const startCamera = async () => {
    setShowCamera(true);
    setResultImg(null);
    setSelectedFile(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      console.error("Camera error:", err);
      alert("Failed to access camera");
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], "camera-photo.png", { type: "image/png" });
      setSelectedFile(file);
      setShowCamera(false);
      video.srcObject.getTracks().forEach((track) => track.stop());
    }, "image/png");
  };

  const handleRemove = async () => {
  if (!selectedFile) return alert("Select a file first!");
  setLoading(true);
  const formData = new FormData();
  formData.append("image", selectedFile);

  try {
    const res = await fetch("http://localhost:8000/api/bg/remove", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Background processing failed");

    const blob = await res.blob();
    setResultImg(URL.createObjectURL(blob));
  } catch (err) {
    alert("Error: " + err.message);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className=" w-full bg-black text-teal-300 px-4 py-10 flex flex-col justify-center items-center space-y-8">
      <h1 className="text-3xl font-semibold">AI Background Remover</h1>

      {showCamera ? (
        <div className="w-full max-w-md flex flex-col items-center">
          <video
            ref={videoRef}
            className="rounded-lg border-2 border-teal-600 shadow mb-4"
            autoPlay
          />
          <button
            onClick={takePhoto}
            className="bg-teal-600 hover:bg-teal-500 px-5 py-2 rounded-full text-black font-medium"
          >
            Capture Photo
          </button>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      ) : (
        <>
          <div
            onClick={() => inputRef.current.click()}
            className="w-full max-w-md p-6 border-2 border-dashed border-teal-500 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-black/30 transition"
          >
            {selectedFile ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected"
                className="max-h-64 object-contain rounded-lg"
              />
            ) : (
              <>
                <UploadCloud className="w-16 h-16 mb-4 stroke-teal-400" />
                <p className="text-sm opacity-70">Click or drag an image to upload</p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleRemove}
              disabled={!selectedFile || loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-teal-600 text-black font-medium hover:bg-teal-500 disabled:opacity-50"
            >
              {loading && <Loader2 className="animate-spin" />}
              Remove Background
            </button>
            <button
              onClick={startCamera}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-teal-500"
            >
              <Camera />
              Use Camera
            </button>
          </div>
        </>
      )}

      {resultImg && (
        <div className="w-full max-w-md mt-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Result</h2>
          <img
            src={resultImg}
            alt="Result"
            className="rounded-lg shadow-xl mb-4"
          />
          <a
            href={resultImg}
            download="removed-bg.png"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-500"
          >
            <Download className="w-5 h-5" />
            Download
          </a>
        </div>
      )}
    </div>
  );
}