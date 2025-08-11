import React, { useState, useRef, useEffect } from "react";
import { Mic, Camera, Upload, Image } from "lucide-react";
import axiosInstance from "../../../network/axiosInstance";
import DownloadButtons from "./DownloadButtons";
import { MdSpeed } from "react-icons/md";
import { PiVideoLight } from "react-icons/pi";
const speeds = [
  { label: "0.5x", value: 0.5 },
  { label: "1x", value: 1 },
  { label: "1.5x", value: 1.5 },
  { label: "2x", value: 2 },
];

const qualities = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Ultra", value: "ultra" },
];
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
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
  const [showQualityDropdown, setShowQualityDropdown] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [inspirationGifs, setInspirationGifs] = useState({}); // { [category]: GifObject[] }
  const [isInspirationLoading, setIsInspirationLoading] = useState(false);
  const [urlMimeType, setUrlMimeType] = useState("");

  const fileInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const objectUrlRef = useRef(null);

  const tabs = ["Humor", "Witty", "Relatable", "Work"];

  const fetchCategoryGifs = async (category) => {
    setIsInspirationLoading(true);
    try {
      const API_KEY =
        import.meta.env.VITE_GIPHY_API_KEY || "your_giphy_api_key";
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(
          category
        )}&limit=6&rating=g&lang=en`
      );
      const json = await response.json();
      const gifs = Array.isArray(json?.data) ? json.data : [];
      setInspirationGifs((prev) => ({ ...prev, [category]: gifs }));
    } catch (error) {
      console.error("Failed to fetch inspiration GIFs:", error);
      setInspirationGifs((prev) => ({ ...prev, [category]: [] }));
    } finally {
      setIsInspirationLoading(false);
    }
  };

  useEffect(() => {
    if (!inspirationGifs[activeTab]) {
      fetchCategoryGifs(activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

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

  // Free tier with rate limits - Hugging Face Inference API
  const generateGif = async (prompt, attempt = 0) => {
    const HUGGING_FACE_TOKEN =
      import.meta.env.VITE_HUGGING_FACE_TOKEN ||
      "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";
    const response = await fetch(
      "https://api-inference.huggingface.co/models/damo-vilab/text-to-video-ms-1.7b",
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/json, image/gif, video/mp4, */*",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            num_frames: 16,
            guidance_scale: 7.5,
            num_inference_steps: 25,
          },
          options: {
            wait_for_model: true,
          },
        }),
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      let errorPayload = null;
      try {
        errorPayload = JSON.parse(errorText);
      } catch (_) {
        // non-JSON payload
      }
      if (response.status === 503 && errorPayload?.estimated_time) {
        const waitMs = Math.ceil((errorPayload.estimated_time + 0.5) * 1000);
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, waitMs));
          return generateGif(prompt, attempt + 1);
        }
        throw new Error(
          `Model is loading. Please try again in ~${Math.ceil(
            errorPayload.estimated_time
          )}s.`
        );
      }
      if (response.status === 401) {
        throw new Error("Unauthorized. Check Hugging Face token.");
      }
      if (response.status === 403) {
        throw new Error(
          "Forbidden. Token lacks access to Inference API or model is restricted."
        );
      }
      if (response.status === 429) {
        throw new Error("Rate limit reached. Please wait and try again.");
      }
      const fallbackText = errorPayload?.error || errorText;
      throw new Error(`HF API error ${response.status}: ${fallbackText}`);
    }
    return await response.blob();
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      alert("Please enter a prompt to generate a GIF.");
      return;
    }

    setIsLoading(true);
    try {
      const blob = await generateGif(inputText.trim());
      const newUrl = URL.createObjectURL(blob);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      objectUrlRef.current = newUrl;
      setUrl(newUrl);
      setUrlMimeType(blob.type || "");
    } catch (error) {
      console.error(error);
      // Fallback to free, tokenless generation
      try {
        // Try AI Horde first (multiple frames), then Pollinations
        let frames = [];
        try {
          frames = await generateGifViaAIHorde(inputText.trim());
        } catch (e1) {
          // fall back to pollinations
        }

        let dataUri = null;
        if (frames.length > 1) {
          // We already have multiple frames from AI Horde; stitch to GIF
          if (!window.gifshot) {
            await loadScriptOnce(
              "https://cdn.jsdelivr.net/npm/gifshot@0.3.2/build/gifshot.min.js"
            );
          }
          dataUri = await new Promise((resolve, reject) => {
            window.gifshot.createGIF(
              {
                images: frames,
                gifWidth: 512,
                gifHeight: 512,
                interval: 0.18,
                numFrames: frames.length,
              },
              (obj) => {
                if (!obj || obj.error) return reject(obj?.error || "gif error");
                resolve(obj.image);
              }
            );
          });
        } else {
          dataUri = await generateGifViaPollinations(inputText.trim());
        }
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = null;
        }
        setUrl(dataUri);
        setUrlMimeType("image/gif");
      } catch (fallbackErr) {
        console.error("Fallback generation failed:", fallbackErr);
        alert(error?.message || "Failed to generate GIF.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // -------- Free fallback: Pollinations images -> GIF via gifshot --------
  const loadScriptOnce = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        return resolve();
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  };

  const blobToDataUrl = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  // -------- Free fallback #1: AI Horde (no key required, anonymous) --------
  const generateGifViaAIHorde = async (prompt) => {
    // Request a small set of frames
    const requestBody = {
      prompt,
      params: {
        steps: 20,
        width: 512,
        height: 512,
        n: 6,
        cfg_scale: 7,
        sampler_name: "k_euler",
      },
      nsfw: false,
      r2: true,
      slow_workers: false,
      trusted_workers: false,
      models: ["SDXL 1.0", "Deliberate"],
    };

    const postResp = await fetch("https://aihorde.net/api/v2/generate/async", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: "0000000000",
        "Client-Agent": "ExplifiedFrontend:0.1:(no-contact)",
      },
      body: JSON.stringify(requestBody),
    });
    if (!postResp.ok) {
      throw new Error(`AI Horde request failed: ${await postResp.text()}`);
    }
    const { id } = await postResp.json();
    if (!id) throw new Error("AI Horde returned no job id");

    // Poll for completion
    let done = false;
    let attempts = 0;
    let last;
    while (!done && attempts < 60) {
      attempts += 1;
      const statusResp = await fetch(
        `https://aihorde.net/api/v2/generate/status/${id}`,
        {
          headers: {
            apikey: "0000000000",
            "Client-Agent": "ExplifiedFrontend:0.1:(no-contact)",
          },
        }
      );
      if (!statusResp.ok) {
        throw new Error(`AI Horde status failed: ${await statusResp.text()}`);
      }
      last = await statusResp.json();
      if (last?.done || last?.finished || Array.isArray(last?.generations)) {
        done = true;
        break;
      }
      await delay(2000);
    }

    const gens = last?.generations || [];
    if (!gens.length) throw new Error("AI Horde produced no images");
    // Convert base64 images to data URLs
    const dataUrls = gens
      .map((g) => g?.img)
      .filter(Boolean)
      .map((b64) => `data:image/png;base64,${b64}`);
    return dataUrls;
  };

  const generateGifViaPollinations = async (prompt) => {
    const targetFrames = 8;
    const size = 512;

    const fetchImageAsDataUrl = async (imgUrl) => {
      // Try direct
      try {
        const resp = await fetch(imgUrl, {
          cache: "no-store",
          headers: { Accept: "image/*" },
        });
        if (resp.ok) {
          const blob = await resp.blob();
          return await blobToDataUrl(blob);
        }
      } catch (_) {}

      // Fallback via CORS proxy (jina)
      try {
        const proxied = `https://r.jina.ai/http://${imgUrl.replace(
          /^https?:\/\//,
          ""
        )}`;
        const resp2 = await fetch(proxied, {
          cache: "no-store",
          headers: { Accept: "image/*" },
        });
        if (resp2.ok) {
          const blob2 = await resp2.blob();
          return await blobToDataUrl(blob2);
        }
      } catch (_) {}

      throw new Error("Failed to fetch frame image");
    };

    const collectedDataUrls = [];
    for (let i = 0; i < targetFrames; i += 1) {
      let success = false;
      for (let attempt = 0; attempt < 4 && !success; attempt += 1) {
        const seed = Math.floor(Math.random() * 1_000_000) + i + attempt;
        const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
          prompt
        )}?width=${size}&height=${size}&seed=${seed}&nologo=true`;
        try {
          const dataUri = await fetchImageAsDataUrl(imgUrl);
          collectedDataUrls.push(dataUri);
          success = true;
        } catch (_) {
          // try next attempt/seed
        }
      }
    }

    if (collectedDataUrls.length < 2) {
      throw new Error("Not enough frames fetched from Pollinations");
    }

    while (collectedDataUrls.length < targetFrames) {
      collectedDataUrls.push(collectedDataUrls[collectedDataUrls.length - 1]);
    }

    if (!window.gifshot) {
      await loadScriptOnce(
        "https://cdn.jsdelivr.net/npm/gifshot@0.3.2/build/gifshot.min.js"
      );
    }

    return new Promise((resolve, reject) => {
      try {
        window.gifshot.createGIF(
          {
            images: collectedDataUrls,
            gifWidth: size,
            gifHeight: size,
            interval: 0.18,
            numFrames: collectedDataUrls.length,
          },
          (obj) => {
            if (!obj || obj.error) {
              return reject(obj?.error || "Failed to create GIF");
            }
            resolve(obj.image);
          }
        );
      } catch (e) {
        reject(e);
      }
    });
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

  // Finds the "best" existing GIF for the given text using Giphy's translate endpoint
  const translateToGif = async (text) => {
    const API_KEY = import.meta.env.VITE_GIPHY_API_KEY || "your_giphy_api_key";
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/translate?api_key=${API_KEY}&s=${encodeURIComponent(
        text
      )}`
    );
    const data = await response.json();
    return data.data; // Returns single GIF object
  };

  const handleFindBestGif = async () => {
    if (!inputText.trim()) {
      alert("Please enter some text to search for a GIF.");
      return;
    }

    setIsLoading(true);
    try {
      const gifData = await translateToGif(inputText.trim());
      const imageUrl =
        gifData?.images?.downsized_medium?.url ||
        gifData?.images?.downsized?.url ||
        gifData?.images?.original?.url;

      if (imageUrl) {
        setUrl(imageUrl);
      } else {
        alert("No GIF found for the given text. Try different words.");
      }
    } catch (error) {
      console.error("Error fetching GIF from Giphy:", error);
      alert("Failed to fetch GIF. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {url ? (
        <div className="flex flex-col gap-2 items-center w-full">
          <h1 className="text-3xl mb-6">Your GIF is Ready!</h1>
          <div className="flex items-center gap-4">
            <DownloadButtons url={url} />
            {urlMimeType && urlMimeType.includes("video") ? (
              <video
                src={url}
                className="h-72 w-72 object-cover rounded-lg border border-gray-300 shadow"
                autoPlay
                loop
                muted
                controls
              />
            ) : (
              <img
                src={url}
                alt="gif"
                className="h-72 w-72 object-cover rounded-lg border border-gray-300 shadow"
              />
            )}
          </div>
          <div className="flex relative items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  setShowQualityDropdown((prev) => !prev);
                  setShowSpeedDropdown(false); // Close other dropdown
                }}
                className="flex flex-col items-center gap-2 hover:bg-gray-700 p-2 rounded-lg transition-colors"
              >
                <PiVideoLight size={20} />
                <span className="text-[8px]">
                  {selectedQuality ? selectedQuality : "Quality"}
                </span>
              </button>

              {showQualityDropdown && (
                <div className="absolute top-12 mt-1 w-20 bg-gray-800 border border-gray-600 rounded shadow-lg z-50">
                  {qualities.map((quality) => (
                    <div
                      key={quality.value}
                      onClick={() => {
                        setSelectedQuality(quality.label);
                        setShowQualityDropdown(false);
                        // Add quality logic here if needed
                      }}
                      className="px-4 py-2 text-sm hover:bg-gray-700 cursor-pointer"
                    >
                      {quality.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Speed Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSpeedDropdown((prev) => !prev);
                  setShowQualityDropdown(false); // Close other dropdown
                }}
                className="flex flex-col items-center gap-2 hover:bg-gray-700 p-2 rounded-lg transition-colors"
              >
                <MdSpeed size={20} />
                <span className="text-[8px]">
                  {selectedSpeed ? selectedSpeed : "Speed"}
                </span>
              </button>

              {showSpeedDropdown && (
                <div className="absolute top-12 mt-1 w-20 bg-gray-800 border border-gray-600 rounded shadow-lg z-50">
                  {speeds.map((speed) => (
                    <div
                      key={speed.value}
                      onClick={() => {
                        setSelectedSpeed(speed.label);
                        setShowSpeedDropdown(false);
                        // Add speed logic here if needed
                      }}
                      className="px-4 py-2 text-sm hover:bg-gray-700 cursor-pointer"
                    >
                      {speed.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
              }
              setUrl("");
              setShowQualityDropdown(false);
              setShowSpeedDropdown(false);
            }}
            className="mt-4 bg-[#23b5b5] hover:bg-[#1da3a3] text-white font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-200"
          >
            Generate More
          </button>
        </div>
      ) : (
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
                  title={
                    isRecording ? "Stop Recording" : "Start Voice Recording"
                  }
                >
                  <Mic size={20} />
                </button>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isLoading
                      ? "bg-teal-600/60 cursor-not-allowed"
                      : "bg-teal-600 hover:bg-teal-700"
                  }`}
                >
                  {isLoading ? "Generating..." : "Generate"}
                </button>
                <button
                  onClick={handleFindBestGif}
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Find Best GIF
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
            {url && (
              <div className="flex  items-center gap-4">
                <DownloadButtons url={url} />
                {urlMimeType && urlMimeType.includes("video") ? (
                  <video
                    src={url}
                    className="h-48 w-48 object-cover rounded-lg border border-gray-300 shadow"
                    autoPlay
                    loop
                    muted
                    controls
                  />
                ) : (
                  <img
                    src={url}
                    alt="gif"
                    className="h-48 w-48 object-cover rounded-lg border border-gray-300 shadow"
                  />
                )}
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
              {isInspirationLoading && !inspirationGifs[activeTab]
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="aspect-square bg-gray-800 animate-pulse rounded-lg"
                    />
                  ))
                : (inspirationGifs[activeTab] || []).map((gif) => {
                    const imgUrl =
                      gif?.images?.fixed_width_small?.url ||
                      gif?.images?.downsized_small?.mp4 ||
                      gif?.images?.downsized_medium?.url ||
                      gif?.images?.original?.url;
                    return (
                      <button
                        key={gif.id}
                        onClick={() => {
                          const urlToUse =
                            gif?.images?.downsized_medium?.url ||
                            gif?.images?.original?.url ||
                            imgUrl;
                          if (urlToUse) setUrl(urlToUse);
                        }}
                        className="aspect-square bg-gray-700 rounded-lg overflow-hidden hover:opacity-90 transition"
                        title={gif?.title || activeTab}
                      >
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={gif?.title || activeTab}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800" />
                        )}
                      </button>
                    );
                  })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
