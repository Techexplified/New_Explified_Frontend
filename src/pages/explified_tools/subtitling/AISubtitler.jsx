/* global process */

// src/AiSubtitlerApp.jsx
import React, { useRef, useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

/* ----------------------------- Helpers ----------------------------- */

const backendOrigin = (
  import.meta.env.VITE_API_ORIGIN ||
  import.meta.env.REACT_APP_API_ORIGIN ||
  "https://api-pf6diz22ka-uc.a.run.app"
).replace(/\/$/, "");

// const backendOrigin = (
//   import.meta.env.REACT_APP_API_ORIGIN || "http://localhost:4000"
// ).replace(/\/$/, "");

function normalizeVttUrl(vttUrl) {
  if (!vttUrl) return null;
  if (/^https?:\/\//i.test(vttUrl)) return vttUrl;
  return backendOrigin + (vttUrl.startsWith("/") ? vttUrl : "/" + vttUrl);
}

function timeStrToSec(t) {
  const parts = t.split(":").map(parseFloat);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parseFloat(t) || 0;
}

function formatTime(t) {
  if (!t || isNaN(t)) t = 0;
  const hrs = Math.floor(t / 3600);
  const mins = Math.floor((t % 3600) / 60);
  const secs = Math.floor(t % 60);
  const ms = Math.floor((t % 1) * 1000);
  if (hrs)
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  return `${mins}:${String(secs).padStart(2, "0")}.${String(ms).padStart(
    3,
    "0"
  )}`;
}

/* ----------------------------- AISubtitler (Uploader) ----------------------------- */

function AISubtitler() {
  const [showUploadOverlay, setShowUploadOverlay] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [pasteValue, setPasteValue] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractingMessage, setExtractingMessage] =
    useState("Extracting Video");

  // NEW: stepper state
  const [extractSteps, setExtractSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const navigate = useNavigate();
  const fileInputRef = useRef();

  const onFilePicked = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/quicktime",
      ];
      if (!validTypes.includes(file.type) && !file.type.startsWith("audio/")) {
        alert(
          "Please select a valid video/audio file (MP4, WebM, OGG, MOV, WAV)"
        );
        return;
      }

      setSelectedFile(file);
      setSelectedFileName(file.name);
      setPasteValue("");
    }
  };

  const isLikelyUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  // Extract metadata from blob (for file uploads)
  const extractMetadataFromBlob = (blobUrl, timeoutMs = 8000) =>
    new Promise((resolve, reject) => {
      const video = document.createElement("video");
      let timerId = null;
      let settled = false;

      video.preload = "metadata";

      const cleanup = () => {
        if (timerId) clearTimeout(timerId);
        try {
          video.pause();
          video.src = "";
        } catch (e) {
          void e;
        }
        video.onloadedmetadata = null;
        video.onerror = null;
      };

      const fail = (msg) => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error(msg));
      };

      video.onloadedmetadata = () => {
        if (settled) return;
        settled = true;
        const meta = {
          duration: Number.isFinite(video.duration) ? video.duration : 0,
          width: video.videoWidth || 0,
          height: video.videoHeight || 0,
          aspectRatio:
            video.videoWidth && video.videoHeight
              ? video.videoWidth > video.videoHeight
                ? "landscape"
                : "portrait"
              : "landscape",
        };
        cleanup();
        console.info("[blob-probe] metadata loaded", meta);
        resolve(meta);
      };

      video.onerror = (ev) => {
        const error = video.error;
        console.warn("[blob-probe] error:", {
          code: error?.code,
          message: error?.message,
          netState: video.networkState,
          readyState: video.readyState,
        });
        fail("Failed to load video metadata");
      };

      timerId = setTimeout(() => {
        if (!settled) {
          console.warn("[blob-probe] timeout waiting for metadata");
          fail("Timeout: metadata extraction failed");
        }
      }, timeoutMs);

      try {
        video.src = blobUrl;
        video.load();
      } catch (err) {
        fail("Error loading video: " + err.message);
      }
    });

  async function uploadFileToBackend(file, onProgress) {
    const UPLOAD_URL = backendOrigin + "/api/subtitler/upload-audio";
    const form = new FormData();
    form.append("file", file);

    onProgress?.({
      stage: "uploading",
      message: "Uploading file...",
      progress: 20,
    });

    const res = await fetch(UPLOAD_URL, {
      method: "POST",
      // ❌ REMOVE HEADERS entirely when using FormData for file upload
      // headers: {
      //   'Content-Type': 'multipart/form-data', // This breaks the boundary generation
      // },
      body: form,
    });

    if (!res.ok) {
      const txt = await res.text();
      // Check for specific backend URL prefix if needed, but keep the core logic
      throw new Error(`Upload failed ${res.status}: ${txt}`);
    }

    const json = await res.json();
    console.log("📥 Backend response:", json);
    console.log("📥 transcriptId:", json.transcriptId);

    return json;
  }

  // Upload URL to backend (downloads + transcribes)
  async function uploadUrlToBackend(url) {
    const UPLOAD_URL = backendOrigin + "/api/subtitler/upload-from-url";

    setExtractingMessage("Downloading video from URL...");

    const res = await fetch(UPLOAD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`URL upload failed ${res.status}: ${txt}`);
    }

    const json = await res.json();
    return json;
  }

  // Main generate handler
  const handleGenerate = async (
    overrideSelectedFile = null,
    overridePasteValue = null
  ) => {
    const fileToUse = overrideSelectedFile ?? selectedFile;
    const pasteToUse = overridePasteValue ?? pasteValue;

    if (!fileToUse && !pasteToUse) {
      alert("Please select a file or paste a URL first");
      return;
    }

    setIsExtracting(true);
    setExtractingMessage("Extracting Video");

    try {
      let videoUrl = null;
      let videoMetadata = {
        duration: 0,
        width: 0,
        height: 0,
        aspectRatio: "landscape",
      };

      if (fileToUse) {
        // FILE UPLOAD FLOW
        // Setup stepper for file flow
        setExtractSteps([
          "Extracting metadata",
          "Uploading file",
          "Transcribing",
          "Finalizing",
        ]);
        setCurrentStep(0); // extracting metadata

        videoUrl = URL.createObjectURL(fileToUse);

        try {
          const meta = await extractMetadataFromBlob(videoUrl);
          videoMetadata = meta;
        } catch (metaErr) {
          console.warn("Could not extract file metadata:", metaErr);
        }

        // advance to upload
        setExtractingMessage("Uploading and transcribing...");
        setCurrentStep(1); // uploading file

        // Upload to backend and wait for transcription
        try {
          const result = await uploadFileToBackend(fileToUse, () => {});
          const { text, segments, vttUrl } = result || {};

          // mark transcribing/finalizing
          setExtractingMessage("Finalizing...");
          setCurrentStep(2);

          // small delay so stepper shows progress (optional)
          await new Promise((r) => setTimeout(r, 300));

          setIsExtracting(false);

          const absoluteVtt = normalizeVttUrl(vttUrl);

          navigate("/ai-subtitler-ui", {
            state: {
              videoUrl,
              videoMetadata,
              fileName: selectedFileName || "Video from device",
              sourceType: "file",
              subtitles: segments || [],
              vttUrl: absoluteVtt,
              transcriptionText: text || "",
              originalUrl: null,
              transcriptId:
                result?.transcriptId || result?.transcript_id || null,
              detectedLanguage:
                result?.detectedLanguage ||
                result?.detected_language ||
                result?.language ||
                null,
            },
          });

          return;
        } catch (err) {
          console.error("Upload/transcription error:", err);
          setIsExtracting(false);
          alert("Failed to upload / transcribe file: " + (err.message || err));
          return;
        }
      } else {
        // URL FLOW: Send URL to backend for download + transcription
        if (!isLikelyUrl(pasteToUse)) {
          setIsExtracting(false);
          alert("Invalid URL — please paste a valid link");
          return;
        }

        // Setup stepper for URL flow
        setExtractSteps([
          "Downloading video",
          "Uploading to cloud",
          "Transcribing",
          "Creating playback URL",
        ]);
        setCurrentStep(0);
        setExtractingMessage("Downloading video from URL...");

        try {
          // Send URL to backend
          const result = await uploadUrlToBackend(pasteToUse);

          // after backend returns, we are usually at "uploaded/transcribed" step
          setExtractingMessage("Creating video URL for playback...");
          setCurrentStep(3);

          const { text, segments, vttUrl, cloudinaryUrl } = result || {};

          videoUrl = cloudinaryUrl;
          videoMetadata = {
            duration: 0,
            width: 0,
            height: 0,
            aspectRatio: "landscape",
          };

          const absoluteVtt = normalizeVttUrl(vttUrl);

          setIsExtracting(false);
          navigate("/ai-subtitler-ui", {
            state: {
              videoUrl,
              videoMetadata,
              fileName: "Video from URL",
              sourceType: "url",
              subtitles: segments || [],
              vttUrl: absoluteVtt,
              transcriptionText: text || "",
              originalUrl: pasteToUse,
              transcriptId:
                result?.transcriptId || result?.transcript_id || null,
              detectedLanguage:
                result?.detectedLanguage ||
                result?.detected_language ||
                result?.language ||
                null,
            },
          });

          return;
        } catch (err) {
          setIsExtracting(false);
          console.error("URL processing error:", err);
          alert("Failed to process video from URL: " + (err.message || err));
          return;
        }
      }
    } catch (err) {
      setIsExtracting(false);
      console.error(err);
      alert("An error occurred while processing the video. Please try again.");
    }
  };

  /* ---------- UI ---------- */
  const colors = {
    pageBg: "#060708",
    panelBg: "#121516",
    panelInner: "#0f1414",
    accent: "#19b5ac",
    muted: "#9aa2a2",
    lightText: "#e6eef0",
    bulletDot: "#14bfb3",
  };

  const sx = {
    page: {
      minHeight: "100vh",
      background:
        "linear-gradient(180deg, rgba(9,10,10,1) 0%, rgba(11,12,12,1) 40%, rgba(15,16,16,1) 100%)",
      color: colors.lightText,
      fontFamily:
        "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      padding: "48px 32px",
      boxSizing: "border-box",
      position: "relative",
    },
    explifiedBadge: {
      position: "fixed",
      top: 18,
      left: 18,
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "8px 12px",
      borderRadius: 8,
      boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
    },
    explifiedIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      background: colors.accent,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#022",
      fontWeight: 800,
      marginLeft: 30,
    },
    titleWrap: {
      textAlign: "center",
      marginTop: 20,
      marginBottom: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
    },
    centerArea: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 16,
    },
    modalOuter: {
      width: "1100px",
      maxWidth: "94vw",
      height: "80%",
      borderRadius: 12,
      background:
        "linear-gradient(180deg, rgba(17,18,18,0.96), rgba(14,16,16,0.96))",
      padding: "40px 20px",
      boxShadow: "0 40px 80px rgba(0,0,0,0.65)",
      border: "1px solid rgba(30,130,125,0.06)",
      marginTop: 30,
      position: "relative",
      overflow: "visible",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    chooseBoxWrap: {
      display: "flex",
      justifyContent: "center",
      marginTop: -8,
      marginBottom: 18,
      pointerEvents: "none",
    },
    chooseBox: {
      width: "340px",
      height: "210px",
      borderRadius: 8,
      background: "linear-gradient(180deg, rgba(14,20,20,1), rgba(10,12,12,1))",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.02), 0 8px 30px rgba(0,0,0,0.5)",
      border: `1px solid rgba(255,255,255,0.02)`,
      pointerEvents: "auto",
      zIndex: 5,
      padding: "24px",
    },
    uploadIcon: {
      width: 40,
      height: 40,
      borderRadius: 6,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 6,
      color: colors.accent,
      background: "rgba(20,30,30,0.4)",
      boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
      transform: "scale(1.2)",
    },
    chooseTitle: {
      fontWeight: 700,
      fontSize: 25,
      color: "#fff",
      marginTop: 12,
      marginBottom: 4,
    },
    chooseSubtitle: {
      color: "#9fb0b0",
      fontSize: 18,
      marginTop: 6,
    },
    bulletsWrap: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 20,
      marginTop: "60px",
      marginBottom: "10px",
    },
    bulletColumn: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
    bulletItem: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: "#c8d2d2",
      fontSize: 18,
    },
    bulletDot: {
      width: 10,
      height: 10,
      borderRadius: 6,
      background: colors.bulletDot,
      boxShadow: "0 2px 8px rgba(25,181,172,0.18)",
      flexShrink: 0,
    },
    generateWrap: {
      display: "flex",
      justifyContent: "center",
      marginTop: 36,
    },
    generateBtn: {
      background: `linear-gradient(90deg, ${colors.accent}, #13b7b0)`,
      color: "white",
      borderRadius: 10,
      padding: "14px 36px",
      fontWeight: 800,
      fontSize: 30,
      border: "none",
      cursor: "pointer",
      boxShadow: "0 12px 30px rgba(19,181,172,0.18)",
    },
    selectedFileNote: {
      marginTop: 10,
      fontSize: 16,
      color: "#9fb0b0",
      textAlign: "center",
    },
    extractingOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.92)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    },
    extractingCard: {
      width: 700,
      height: 320,
      borderRadius: 12,
      background:
        "linear-gradient(180deg, rgba(30,40,40,0.98), rgba(20,25,25,0.98))",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 18,
      boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
    },
    spinner: {
      width: 60,
      height: 60,
      border: "4px solid rgba(25,181,172,0.2)",
      borderTop: "4px solid #19b5ac",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    extractingText: {
      fontSize: 22,
      fontWeight: 700,
      color: "#fff",
    },
    // stepper styles
    stepperWrap: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      width: "90%",
      maxWidth: 820,
      justifyContent: "center",
      marginTop: 8,
    },
    stepItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      minWidth: 100,
    },
    stepDot: {
      width: 16,
      height: 16,
      borderRadius: 16,
      border: "2px solid rgba(255,255,255,0.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    stepLabel: {
      fontSize: 13,
      color: "#cbd6d6",
      textAlign: "center",
      maxWidth: 120,
    },
    stepLine: {
      height: 2,
      flex: 1,
      background: "rgba(255,255,255,0.06)",
    },
  };

  return (
    <div style={sx.page}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={sx.titleWrap}>
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-minimal-primary to-minimal-primary/80 rounded-2xl flex items-center justify-center animate-pulse">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white tracking-wide">
              AI SUBTITLE GENERATOR
            </h1>
          </div>
          <p className="mt-2 text-lg text-neutral-300 text-center">
            Your Voice. Global Impact. One Subtitle at a Time.
          </p>
        </div>
      </div>

      <div style={sx.centerArea}>
        <div style={sx.modalOuter}>
          <div style={sx.chooseBoxWrap}>
            <div
              role="button"
              onClick={() => setShowUploadOverlay(true)}
              style={sx.chooseBox}
              title="Choose a file"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  setShowUploadOverlay(true);
              }}
            >
              <div style={sx.uploadIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3v10"
                    stroke={colors.accent}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 7l4-4 4 4"
                    stroke={colors.accent}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="3"
                    y="13"
                    width="18"
                    height="8"
                    rx="2"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1.2"
                    fill="rgba(255,255,255,0.01)"
                  />
                </svg>
              </div>

              <div style={sx.chooseTitle}>
                {selectedFileName ? "File Selected" : "Choose a file"}
              </div>

              <div style={sx.chooseSubtitle}>
                {selectedFileName || "Upload a video to get started"}
              </div>
            </div>
          </div>

          {selectedFileName && (
            <div style={sx.selectedFileNote}>✓ {selectedFileName}</div>
          )}

          <div style={sx.bulletsWrap}>
            <div style={sx.bulletColumn}>
              <div style={sx.bulletItem}>
                <div style={sx.bulletDot} />
                Multi-Language Support
              </div>
              <div style={sx.bulletItem}>
                <div style={sx.bulletDot} />
                Caption Editing
              </div>
            </div>

            <div style={sx.bulletColumn}>
              <div style={sx.bulletItem}>
                <div style={sx.bulletDot} />
                Font Color Control
              </div>
              <div style={sx.bulletItem}>
                <div style={sx.bulletDot} />
                Auto Mode
              </div>
            </div>

            <div style={sx.bulletColumn}>
              <div style={sx.bulletItem}>
                <div style={sx.bulletDot} />
                Font Style Customization
              </div>
              <div style={sx.bulletItem}>
                <div style={sx.bulletDot} />
                Real-Time Preview
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={sx.generateWrap}>
        <button style={sx.generateBtn} onClick={() => handleGenerate()}>
          Generate ✨
        </button>
      </div>

      {/* Upload Overlay */}
      {showUploadOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
            padding: 20,
          }}
          onClick={() => setShowUploadOverlay(false)}
        >
          <div
            style={{
              width: 1300,
              height: 600,
              maxWidth: "95%",
              borderRadius: 8,
              background: "rgba(20,20,20,0.95)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
              padding: 28,
              position: "relative",
              color: "#e6efef",
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="video/*,audio/*"
              style={{ display: "none" }}
              onChange={onFilePicked}
            />

            {/* Upload File Section */}
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 22,
                  marginBottom: 18,
                  color: "#dff7f5",
                }}
              >
                Upload File
              </div>

              <div
                role="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload from device"
                style={{
                  width: "100%",
                  maxWidth: 800,
                  height: 250,
                  borderRadius: 6,
                  background: "linear-gradient(180deg,#122826,#0d2424)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  gap: 18,
                  margin: "0 auto",
                }}
              >
                <div style={{ transform: "scale(1.4)" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 3v10"
                      stroke={colors.accent}
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 7l4-4 4 4"
                      stroke={colors.accent}
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="3"
                      y="13"
                      width="18"
                      height="8"
                      rx="2"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1.6"
                      fill="rgba(255,255,255,0.04)"
                    />
                  </svg>
                </div>

                <div
                  style={{ fontSize: 34, fontWeight: 800, color: "#dff7f5" }}
                >
                  Upload file
                </div>
                <div style={{ color: "#9fb0b0", fontSize: 18 }}>
                  Click or drag & drop file here
                </div>
              </div>

              {selectedFileName && (
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 14,
                    color: "#19b5ac",
                    textAlign: "center",
                  }}
                >
                  ✓ File selected: <strong>{selectedFileName}</strong>
                </div>
              )}

              {selectedFileName && (
                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => {
                      setShowUploadOverlay(false);
                      handleGenerate();
                    }}
                    style={{
                      padding: "12px 32px",
                      borderRadius: 8,
                      background: `linear-gradient(90deg, ${colors.accent}, #13b7b0)`,
                      border: "none",
                      color: "#022",
                      fontWeight: 800,
                      fontSize: 16,
                      cursor: "pointer",
                      boxShadow: "0 8px 20px rgba(19,181,172,0.2)",
                    }}
                  >
                    Generate ✨
                  </button>
                </div>
              )}
            </div>

            {/* Paste URL Section */}
            <div style={{ paddingTop: 24 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 22,
                  marginBottom: 18,
                  color: "#dff7f5",
                }}
              >
                Paste Video URL
              </div>

              <div style={{ maxWidth: 800, margin: "0 auto" }}>
                <input
                  type="text"
                  placeholder="Paste direct video URL here (MP4, WebM, etc.)"
                  value={pasteValue}
                  onChange={(e) => {
                    setPasteValue(e.target.value);
                    if (e.target.value) {
                      setSelectedFile(null);
                      setSelectedFileName(null);
                    }
                  }}
                  style={{
                    width: "100%",
                    height: 52,
                    borderRadius: 8,
                    background: "linear-gradient(180deg,#122826,#0d2424)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    padding: "0 16px",
                    color: "#e6efef",
                    fontSize: 16,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && pasteValue) {
                      setShowUploadOverlay(false);
                      handleGenerate(null, pasteValue);
                    }
                  }}
                />

                <div style={{ marginTop: 12, color: "#9fb0b0", fontSize: 13 }}>
                  Tip: Paste a direct link to a video file (e.g.,
                  https://example.com/video.mp4). The backend will download and
                  transcribe the video automatically.
                </div>

                {pasteValue && (
                  <div
                    style={{
                      marginTop: 18,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={() => {
                        setShowUploadOverlay(false);
                        handleGenerate(null, pasteValue);
                      }}
                      style={{
                        padding: "12px 32px",
                        borderRadius: 8,
                        background: `linear-gradient(90deg, ${colors.accent}, #13b7b0)`,
                        border: "none",
                        color: "#022",
                        fontWeight: 800,
                        fontSize: 16,
                        cursor: "pointer",
                        boxShadow: "0 8px 20px rgba(19,181,172,0.2)",
                      }}
                    >
                      Generate ✨
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                right: 15,
                top: 12,
                fontSize: 28,
                color: "#cbd6d6",
                cursor: "pointer",
                lineHeight: "20px",
              }}
              onClick={() => setShowUploadOverlay(false)}
            >
              ×
            </div>
          </div>
        </div>
      )}

      {isExtracting && (
        <div style={sx.extractingOverlay}>
          <div style={sx.extractingCard}>
            <div style={sx.spinner}></div>
            <div style={sx.extractingText}>{extractingMessage}</div>

            {/* STEPper UI */}
            <div style={sx.stepperWrap}>
              {extractSteps && extractSteps.length > 0 ? (
                extractSteps.map((label, idx) => {
                  const isActive = idx === currentStep;
                  const isCompleted = idx < currentStep;
                  return (
                    <React.Fragment key={idx}>
                      <div style={sx.stepItem}>
                        <div
                          style={{
                            ...sx.stepDot,
                            background: isCompleted
                              ? colors.accent
                              : isActive
                              ? colors.bulletDot
                              : "transparent",
                            border:
                              isActive || isCompleted
                                ? `2px solid ${colors.accent}`
                                : sx.stepDot.border,
                            color: isCompleted ? "#022" : "#fff",
                            fontSize: 11,
                          }}
                        >
                          {isCompleted ? "✓" : idx + 1}
                        </div>
                        <div
                          style={{
                            ...sx.stepLabel,
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? "#fff" : "#cbd6d6",
                          }}
                        >
                          {label}
                        </div>
                      </div>

                      {/* draw a line except after the last item */}
                      {idx !== extractSteps.length - 1 && (
                        <div
                          style={{
                            ...sx.stepLine,
                            background:
                              idx < currentStep
                                ? `linear-gradient(90deg, ${colors.accent}, #13b7b0)`
                                : sx.stepLine.background,
                            width: 36,
                          }}
                        />
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <div style={{ color: "#9fb0b0" }}>Preparing…</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Player Component ----------------------------- */

function AiSubtitlerPlayer() {
  const loc = useLocation();
  const state = loc.state || {};
  const videoRef = useRef(null);
  const [subtitles, setSubtitles] = useState(state.subtitles || []);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [isTrackLoaded, setIsTrackLoaded] = useState(false);

  useEffect(() => {
    const vttUrl = state.vttUrl;
    const providedSegments = state.subtitles || [];

    if (videoRef.current && state.videoUrl) {
      // robust loading with fallback
      const videoEl = videoRef.current;
      let settled = false;

      const tryUrl = async (url, attemptProxyFallback = true) => {
        // Clean previous sources/tracks
        try {
          videoEl.pause();
          videoEl.removeAttribute("src");
          while (videoEl.firstChild) videoEl.removeChild(videoEl.firstChild);
        } catch (e) {
          void e;
        }

        const srcEl = document.createElement("source");
        srcEl.src = url;
        const ext = url.split("?")[0].split(".").pop().toLowerCase();
        if (ext === "mp4") srcEl.type = "video/mp4";
        else if (ext === "webm") srcEl.type = "video/webm";
        else if (ext === "m3u8") srcEl.type = "application/vnd.apple.mpegurl";

        videoEl.appendChild(srcEl);
        videoEl.crossOrigin = "anonymous";

        const onLoad = () => {
          if (settled) return;
          settled = true;
          cleanup();
          // success
        };
        const onError = (ev) => {
          if (settled) return;
          settled = true;
          cleanup();
          console.warn("[player] video load error for URL:", url, ev);

          if (attemptProxyFallback) {
            // fallback to proxy using originalUrl if provided, else try proxy of the url itself
            const fallbackSource = state.originalUrl
              ? `${backendOrigin}/api/subtitler/proxy/video?url=${encodeURIComponent(
                  state.originalUrl
                )}`
              : `${backendOrigin}/api/subtitler/proxy/video?url=${encodeURIComponent(
                  url
                )}`;

            setTimeout(() => tryUrl(fallbackSource, false), 150);
          }
        };

        const cleanup = () => {
          videoEl.removeEventListener("loadedmetadata", onLoad);
          videoEl.removeEventListener("error", onError);
        };

        videoEl.addEventListener("loadedmetadata", onLoad);
        videoEl.addEventListener("error", onError);

        try {
          videoEl.load();
        } catch (e) {
          onError(e);
        }

        // safety timeout
        setTimeout(() => {
          if (!settled) {
            settled = true;
            cleanup();
            onError(new Error("Timeout waiting for video metadata"));
          }
        }, 12000);
      };

      // start trying the primary URL
      tryUrl(state.videoUrl);
    }

    if (videoRef.current && vttUrl) {
      const prev = videoRef.current.querySelector("track[data-generated-vtt]");
      if (prev) prev.remove();

      const trackEl = document.createElement("track");
      trackEl.kind = "subtitles";
      trackEl.label = "AI Subtitles";
      // use detected language from state, fallback to 'en' (defensive)
      const srclang = state.detectedLanguage || state.detected_language || "en";
      trackEl.srclang = srclang;
      trackEl.setAttribute("data-generated-vtt", "true");
      trackEl.default = false;
      trackEl.src = vttUrl;
      videoRef.current.appendChild(trackEl);

      trackEl.addEventListener("load", () => {
        try {
          trackEl.track.mode = "hidden";
        } catch {}
        const cues = Array.from(trackEl.track?.cues || []);
        if (cues.length > 0) {
          const mapped = cues.map((c) => ({
            start: c.startTime,
            end: c.endTime,
            text: c.text,
          }));
          setSubtitles(mapped);
        } else if (
          Array.isArray(providedSegments) &&
          providedSegments.length > 0
        ) {
          setSubtitles(providedSegments);
        }
        setIsTrackLoaded(true);
      });
    } else if (Array.isArray(providedSegments) && providedSegments.length > 0) {
      setSubtitles(providedSegments);
    }
  }, [state.videoUrl, state.vttUrl, state.subtitles, state.originalUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => {
      const t = video.currentTime;
      const found = subtitles.find((s) => t >= s.start && t <= s.end);
      setCurrentSubtitle(found ? found.text : "");
    };
    video.addEventListener("timeupdate", onTime);
    return () => video.removeEventListener("timeupdate", onTime);
  }, [subtitles]);

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Subtitler Player</h2>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div
          style={{
            background: "#000",
            position: "relative",
            paddingTop: "56.25%",
          }}
        >
          <video
            ref={videoRef}
            controls
            crossOrigin="anonymous"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
            }}
          >
            Your browser does not support video tag.
          </video>

          {currentSubtitle && (
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.8)",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: 8,
                maxWidth: "90%",
                textAlign: "center",
              }}
            >
              {currentSubtitle}
            </div>
          )}
        </div>

        <div style={{ marginTop: 16 }}>
          <strong>Subtitles:</strong>
          <div
            style={{
              marginTop: 8,
              maxHeight: 260,
              overflow: "auto",
              background: "#111",
              color: "#ddd",
              padding: 12,
            }}
          >
            {subtitles.length === 0 ? (
              <div style={{ color: "#777" }}>No subtitles yet</div>
            ) : (
              subtitles.map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div style={{ fontSize: 13, color: "#9fb0b0" }}>
                    {formatTime(s.start)} → {formatTime(s.end)}
                  </div>
                  <div style={{ marginTop: 6 }}>{s.text}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- App Wrapper ----------------------------- */

export default function AiSubtitlerApp() {
  const location = useLocation();

  if (location.pathname === "/ai-subtitler-ui") {
    return <AiSubtitlerPlayer />;
  }

  return <AISubtitler />;
}
