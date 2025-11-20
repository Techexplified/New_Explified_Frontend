// src/pages/explified_tools/subtitling/AiSubtitlerPage.jsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
} from "react";
import { useLocation } from "react-router-dom";
import {
  Sparkles,
  Wrench,
  Folder,
  RotateCcw,
  X,
  Play,
  Download,
  Maximize2,
  Minimize2,
  Cpu,
  Save,
  Undo2,
  Redo2,
  Layers,
  Paintbrush,
  Languages,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import { Player } from "@remotion/player";
import { Video, AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { transcodeWebmBlobToMp4 } from "../../../lib/ffmpeg-loader";

// Backend origin
const BACKEND_ORIGIN = (
  import.meta.env.VITE_API_ORIGIN || "http://localhost:4000"
).replace(/\/$/, "");

// Optional Cloudinary env (unsigned upload preset)
const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || null;
const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || null;

/* ---------------------- helpers ---------------------- */
function normalizeVttUrl(vttUrl) {
  if (!vttUrl) return null;
  if (/^https?:\/\//i.test(vttUrl)) return vttUrl;
  return BACKEND_ORIGIN + (vttUrl.startsWith("/") ? vttUrl : "/" + vttUrl);
}
function isLikelyUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}
function youtubeToEmbed(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (!v) return null;
      return `https://www.youtube.com/embed/${v}?rel=0&enablejsapi=1`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      if (!id) return null;
      return `https://www.youtube.com/embed/${id}?rel=0&enablejsapi=1`;
    }
    return null;
  } catch (e) {
    return null;
  }
}

// Upload file to your backend (existing)

// Optionally upload to Cloudinary (unsigned). Returns secure_url on success.
async function uploadFileToCloudinary(file) {
  if (!CLOUDINARY_CLOUD || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Cloudinary not configured");
  }
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/auto/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  const res = await fetch(url, { method: "POST", body: form });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Cloudinary upload failed ${res.status}: ${txt}`);
  }
  const json = await res.json();
  return json.secure_url || json.url;
}

// small language name -> code map (extend as needed for your dropdown)
const LANG_NAME_TO_CODE = {
  english: "en",
  en: "en",
  hindi: "hi",
  hi: "hi",
  spanish: "es",
  es: "es",
  french: "fr",
  fr: "fr",
  chinese: "zh-CN",
  "chinese (simplified)": "zh-CN",
  chinese_simplified: "zh-CN",
  "chinese (traditional)": "zh-TW",
  chinese_traditional: "zh-TW",
  japanese: "ja",
  ja: "ja",
  korean: "ko",
  ko: "ko",
  german: "de",
  de: "de",
  italian: "it",
  it: "it",
  portuguese: "pt",
  pt: "pt",
  russian: "ru",
  ru: "ru",
  arabic: "ar",
  ar: "ar",
  turkish: "tr",
  tr: "tr",
  // add any extra labels you show
};

function normalizeTargetLang(input) {
  if (!input) return null;
  const s = String(input).trim();
  // if already like "en" or "en-US" or "zh-CN"
  if (/^[A-Za-z]{2}(-[A-Za-z]{2,4})?$/.test(s)) {
    // normalize region to uppercase: en-us -> en-US
    const parts = s.split("-");
    if (parts.length === 2)
      return parts[0].toLowerCase() + "-" + parts[1].toUpperCase();
    return s.toLowerCase();
  }
  const key = s.toLowerCase().replace(/\s+/g, "_").replace(/[()]/g, "");
  return LANG_NAME_TO_CODE[key] || null;
}

// Upload remote URL to backend for transcribing (your backend endpoint)
async function translateSubtitlesToBackend(
  segments,
  targetLangCode,
  srcLangCode = "en"
) {
  if (!targetLangCode) throw new Error("Missing targetLang");
  if (!segments || !Array.isArray(segments) || segments.length === 0) {
    throw new Error("No segments provided to translate (frontend).");
  }

  // ensure codes
  const target = normalizeTargetLang(targetLangCode) || targetLangCode;

  // Prefer explicit srcLangCode argument, else try videoData.detectedLanguage (component state),
  // else fallback to 'auto' so backend can decide
  const detectedLanguage =
    srcLangCode || (videoData && videoData.detectedLanguage) || "auto";

  const endpoint = `${BACKEND_ORIGIN}/translate-subtitles`;
  const payload = { segments, targetLang: target, detectedLanguage };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let body;
  try {
    body = await res.json();
  } catch (e) {
    const text = await res.text().catch(() => "");
    throw new Error("Translate endpoint returned non-json: " + text);
  }

  if (!res.ok || !body.ok) {
    const errMsg = body?.error || `HTTP ${res.status} ${res.statusText}`;
    throw new Error(`Translation failed: ${errMsg}`);
  }

  const translatedSegments = body.segments || [];
  const vttUrl = body.vttUrl || body.vttUrlPath || null;
  return { segments: translatedSegments, vttUrl };
}

// small VTT -> segments parser
function parseVttToSegments(vttText) {
  const lines = (vttText || "").split(/\r?\n/);
  const segments = [];
  let i = 0;
  while (i < lines.length) {
    let line = lines[i].trim();
    // skip numeric cue index
    if (/^\d+$/.test(line)) {
      i++;
      line = lines[i] ? lines[i].trim() : "";
    }

    // timecode line
    const timeMatch = line.match(
      /^(\d{2}:\d{2}:\d{2}\.\d{3}|\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3}|\d{2}:\d{2}\.\d{3})/
    );
    if (timeMatch) {
      const startStr = timeMatch[1];
      const endStr = timeMatch[2];
      const parse = (ts) => {
        const parts = ts.split(":").map(Number);
        if (parts.length === 3)
          return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return 0;
      };
      const start = parse(startStr);
      const end = parse(endStr);
      i++;
      const textLines = [];
      while (i < lines.length && lines[i].trim() !== "") {
        textLines.push(lines[i]);
        i++;
      }
      const text = textLines.join("\n").trim();
      segments.push({ start, end, text });
      i++;
      continue;
    }
    i++;
  }
  return segments;
}

// -------------------- helper: extractTranscriptId --------------------
// ----------------- robust transcriptId extractor -----------------
function extractTranscriptId(result) {
  // defensive parsing for a few common server shapes
  // returns { id: string|null, payload: theParsedPayload }
  let payload = result;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch (err) {
      // leave as-is
    }
  }

  const id =
    payload?.transcriptId ||
    payload?.transcript_id ||
    payload?.id ||
    (payload?.transcript &&
      (payload.transcript.id ||
        payload.transcriptId ||
        payload.transcript_id)) ||
    (payload?.raw && (payload.raw.id || payload.raw.transcriptId)) ||
    null;

  return { id, payload };
}

// small probe: try to load metadata for a remote src in a hidden <video>
async function probeVideoUrl(url, timeout = 5000) {
  try {
    const head = await fetch(url, { method: "HEAD", mode: "cors" });
    if (!head.ok) {
      return {
        ok: false,
        status: head.status,
        statusText: head.statusText,
        headers: Object.fromEntries(head.headers),
      };
    }
    const ct = head.headers.get("content-type") || "";
    const ar = head.headers.get("accept-ranges") || "";
    if (!/video|audio|application\/octet-stream/.test(ct.toLowerCase())) {
      return {
        ok: false,
        timeout: false,
        contentType: ct,
        acceptRanges: ar,
        headers: Object.fromEntries(head.headers),
      };
    }
  } catch (err) {
    // HEAD failed — continue to in-browser probe
  }

  return new Promise((resolve) => {
    const v = document.createElement("video");
    v.preload = "metadata";
    v.crossOrigin = "anonymous";
    let settled = false;

    const clean = () => {
      try {
        v.pause();
        v.removeAttribute("src");
        v.load?.();
        v.remove();
      } catch (e) {}
    };

    const onLoaded = () => {
      if (settled) return;
      settled = true;
      const meta = {
        ok: true,
        duration: isFinite(v.duration) ? v.duration : 0,
        width: v.videoWidth || 0,
        height: v.videoHeight || 0,
      };
      clean();
      resolve(meta);
    };
    const onErr = (ev) => {
      if (settled) return;
      settled = true;
      clean();
      resolve({ ok: false, errorEvent: ev?.type || true });
    };

    v.addEventListener("loadedmetadata", onLoaded, { once: true });
    v.addEventListener("error", onErr, { once: true });

    v.src = url;

    setTimeout(() => {
      if (settled) return;
      settled = true;
      clean();
      resolve({ ok: false, timeout: true });
    }, timeout);
  });
}

/* ---------------------- InlineSubtitleEditor ---------------------- */
const InlineSubtitleEditor = ({
  subtitleStyle = {},
  subtitleText = "",
  onSave = () => {},
  onRequestOpenEditor = () => {},
}) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(subtitleText);

  useEffect(() => {
    setText(subtitleText);
  }, [subtitleText]);

  if (!editing) {
    return (
      <div
        className="inline-block px-4 py-2 rounded-md cursor-text select-none"
        onClick={() => setEditing(true)}
        style={{
          background: subtitleStyle.backgroundEnabled
            ? subtitleStyle.backgroundColor
            : "transparent",
          opacity: subtitleStyle.backgroundOpacity ?? 0.9,
          color: subtitleStyle.color ?? "#fff",
          fontSize: (subtitleStyle.fontSize || 16) + "px",
          fontFamily: subtitleStyle.fontFamily || "inherit",
          fontWeight: subtitleStyle.fontWeight || 400,
          minWidth: "260px", // 👈 ensures width is consistent
        }}
      >
        {text}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "inline-block",
        minWidth: "260px", // 👈 keeps width same when editing
      }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        className="p-2 rounded bg-gray-900 text-white w-full" // 👈 match container width
        style={{
          fontSize: (subtitleStyle.fontSize || 16) + "px",
          fontFamily: subtitleStyle.fontFamily || "inherit",
          fontWeight: subtitleStyle.fontWeight || 400,
          color: subtitleStyle.color ?? "#fff",
        }}
      />
      <div className="mt-2 flex gap-2 justify-center">
        <button
          onClick={() => {
            setEditing(false);
            onSave(text);
          }}
          className="px-3 py-1 bg-cyan-600 rounded"
        >
          Save
        </button>
        <button
          onClick={() => {
            setEditing(false);
            setText(subtitleText);
          }}
          className="px-3 py-1 bg-gray-700 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

/* ---------------------- Subtitles Remotion Composition (for preview) ---------------------- */
const SubtitlesComposition = ({
  videoUrl,
  subtitles = [],
  subtitleStyle = {},
}) => {
  const { fps, width, height, durationInFrames } = useVideoConfig
    ? useVideoConfig()
    : { fps: 30, width: 1280, height: 720, durationInFrames: 1 };
  const frame = useCurrentFrame();
  const currentSec = frame / (fps || 30);
  const visible = subtitles.filter(
    (s) => currentSec >= s.start && currentSec <= s.end
  );

  const baseStyle = {
    pointerEvents: "none",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    paddingBottom: 80,
    boxSizing: "border-box",
  };

  const textStyle = {
    background: subtitleStyle.backgroundEnabled
      ? subtitleStyle.backgroundColor || "rgba(0,0,0,0.7)"
      : "transparent",
    color: subtitleStyle.color || "#fff",
    fontSize: subtitleStyle.fontSize || 18,
    fontFamily: subtitleStyle.fontFamily || "Inter, system-ui, sans-serif",
    fontWeight: subtitleStyle.fontWeight || 600,
    padding: "8px 16px",
    borderRadius: 8,
    maxWidth: "85%",
    textAlign: "center",
    lineHeight: 1.25,
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Video
        src={videoUrl}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      <div style={baseStyle}>
        {visible.length === 0 ? null : (
          <div style={textStyle}>
            {visible.map((v, i) => (
              <div key={i} style={{ margin: "6px 0" }}>
                {v.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------- Remotion Preview Modal ---------------------- */
function RemotionPreviewModal({
  open,
  onClose,
  videoUrl,
  duration = 10,
  subtitles = [],
  subtitleStyle = {},
  width = 1280,
  height = 720,
  fps = 30,
}) {
  if (!open) return null;
  const durationInFrames = Math.max(1, Math.round((duration || 10) * fps));
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 4000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "95%",
          maxWidth: Math.min(1400, width + 40),
          background: "#071018",
          borderRadius: 10,
          padding: 12,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <h3 style={{ color: "#dff7f5", margin: 0 }}>
            Preview Burned-in Subtitles
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#ccc",
              fontSize: 20,
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{ background: "#000", borderRadius: 8, overflow: "hidden" }}
        >
          <Player
            component={SubtitlesComposition}
            durationInFrames={durationInFrames}
            compositionWidth={width}
            compositionHeight={height}
            fps={fps}
            controls
            style={{ width: "100%", height: "auto", background: "#000" }}
            inputProps={{
              videoUrl,
              subtitles,
              subtitleStyle,
            }}
          />
        </div>
        <div style={{ marginTop: 8, color: "#9fb0b0", fontSize: 13 }}>
          Tip: This preview uses Remotion's Player. For final export (MP4), use
          a Remotion render script on the server/CLI.
        </div>
      </div>
    </div>
  );
}

/* ---------------------- PlayerContainer ---------------------- */
const PlayerContainer = ({
  videoRef,
  videoData,
  videoMetadata,
  isMaximized,
  setIsMaximized,
  currentSubtitle,
  subtitles,
  subtitleStyle = {},
  onSeekTo,
  view,
  onEditCueAtPlayhead,
  onRequestOpenEditor,
}) => {
  const [localVideoMetadata, setLocalVideoMetadata] = useState(
    videoMetadata || null
  );

  const maximizedContainerStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    zIndex: 10,
    backgroundColor: "black",
  };

  const isPortrait = localVideoMetadata?.aspectRatio === "portrait";
  const aspectRatioPadding = isPortrait ? "177.78%" : "56.25%";
  const normalContainerClasses = `w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden ${
    isPortrait ? "max-w-md" : "max-w-xl"
  }`;

  useEffect(() => {
    if (view !== "editor") return;
    if (!videoData?.videoUrl || videoData?.sourceType === "youtube") return;
    if (!videoRef?.current) return;

    const v = videoRef.current;
    try {
      v.crossOrigin = "anonymous";
      v.src = videoData.videoUrl;
      v.load();

      // ensure native tracks are removed right away
      try {
        removeNativeTracks(v);
      } catch (e) {}
    } catch (err) {
      console.warn("Error setting video src:", err);
    }

    const onLoaded = () => {
      const ar = v.videoWidth > v.videoHeight ? "landscape" : "portrait";
      setLocalVideoMetadata({
        duration: v.duration || 0,
        width: v.videoWidth || 0,
        height: v.videoHeight || 0,
        aspectRatio: ar,
      });
      try {
        removeNativeTracks(v);
      } catch (e) {}
    };

    const onError = async (ev) => {
      console.warn("Video element failed to load source event:", ev);
      try {
        const head = await fetch(videoData.videoUrl, {
          method: "HEAD",
          mode: "cors",
        });
        console.warn(
          "HEAD response for video:",
          head.status,
          head.statusText,
          Object.fromEntries(head.headers)
        );
        alert(
          `Failed to load the provided video source.\n\nServer response: ${
            head.status
          } ${head.statusText}\nContent-Type: ${
            head.headers.get("content-type") || "unknown"
          }\nAccept-Ranges: ${
            head.headers.get("accept-ranges") || "unknown"
          }\n\nCheck network / CORS / proxy.`
        );
      } catch (e) {
        console.warn("HEAD probe failed (likely CORS):", e);
        alert(
          "Failed to load the provided video source. The server may be blocking cross-origin access or is unreachable from your browser."
        );
      }
    };

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("error", onError);

    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("error", onError);
    };
  }, [view, videoData, videoRef]);

  const overlayStyle = {
    fontFamily: subtitleStyle.fontFamily || "Inter, system-ui, sans-serif",
    fontSize: (subtitleStyle.fontSize || 18) + "px",
    fontWeight: subtitleStyle.fontWeight || 600,
    color: subtitleStyle.color || "#fff",
    textShadow: subtitleStyle.textShadow || "0 2px 8px rgba(0,0,0,0.7)",
    lineHeight: 1.25,
    background: subtitleStyle.backgroundEnabled
      ? `${subtitleStyle.backgroundColor || "#000000"}`
      : "transparent",
    backgroundOpacity: subtitleStyle.backgroundOpacity ?? 0.85,
  };

  return (
    <div
      className="relative w-full h-full max-h-[85vh] flex items-center justify-center"
      style={isMaximized ? maximizedContainerStyle : {}}
    >
      <div className={isMaximized ? "w-full h-full" : normalContainerClasses}>
        <div
          className={isMaximized ? "w-full h-full relative" : "relative"}
          style={isMaximized ? {} : { paddingTop: aspectRatioPadding }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            {videoData?.sourceType === "youtube" && videoData?.embedUrl ? (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <iframe
                  src={videoData.embedUrl}
                  title="YouTube preview"
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </div>
            ) : videoData?.videoUrl ? (
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                controls
                crossOrigin="anonymous"
                style={{ backgroundColor: "#000" }}
              >
                <source src={videoData?.videoUrl} type="video/mp4" />
                <source src={videoData?.videoUrl} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-gray-400 text-xl">
                Video Placeholder (
                {localVideoMetadata?.aspectRatio === "portrait"
                  ? "9:16"
                  : "16:9"}
                )
              </div>
            )}
          </div>

          <AnimatePresence>
            {currentSubtitle && (
              <motion.div
                key={`subtitle-${currentSubtitle}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.18 }}
                className="absolute bottom-16 left-0 right-0 text-center z-50 px-4"
              >
                <InlineSubtitleEditor
                  subtitleStyle={subtitleStyle}
                  subtitleText={currentSubtitle}
                  onSave={(newText) => {
                    if (typeof onEditCueAtPlayhead === "function") {
                      onEditCueAtPlayhead(newText);
                    } else {
                      console.warn("onEditCueAtPlayhead not provided");
                    }
                  }}
                  onRequestOpenEditor={() => {
                    if (typeof onRequestOpenEditor === "function")
                      onRequestOpenEditor();
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* {subtitles?.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-20"
            >
              ✓ {subtitles.length} Subtitles
            </motion.div>
          )} */}

          <button
            title={isMaximized ? "Minimize" : "Maximize"}
            className="absolute bottom-3 right-3 p-2 bg-gray-900/70 text-gray-300 hover:text-white rounded-lg transition-all z-20"
            onClick={(e) => {
              e.stopPropagation();
              setIsMaximized(!isMaximized);
            }}
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------- SmallRuler / UI primitives ---------------------- */
function SmallRuler({ duration, currentTime, onSeek }) {
  const ticks = [];
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const major = safeDuration > 60 ? 10 : 5;
  const ceilDur = Math.ceil(safeDuration || 1);
  for (let t = 0; t <= ceilDur; t += 1) ticks.push(t);
  return (
    <div className="h-8 px-2 flex items-end">
      <div className="w-full relative">
        {ticks.map((t) => {
          const left = (t / (safeDuration || 1)) * 100;
          const isMajor = t % major === 0;
          return (
            <div
              key={t}
              style={{
                position: "absolute",
                left: `${left}%`,
                transform: "translateX(-50%)",
                height: isMajor ? "100%" : "50%",
                width: 1,
                background: isMajor
                  ? "rgba(255,255,255,0.35)"
                  : "rgba(255,255,255,0.12)",
              }}
            >
              {isMajor && (
                <div
                  style={{
                    position: "absolute",
                    top: "-1.2rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: 10,
                    color: "#cbd5e1",
                  }}
                >
                  {Math.floor(t / 60)}:{String(t % 60).padStart(2, "0")}
                </div>
              )}
            </div>
          );
        })}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            onSeek(pct * (safeDuration || 1));
          }}
          style={{ position: "absolute", inset: 0, cursor: "pointer" }}
        />
        <div
          style={{
            position: "absolute",
            left: `${(currentTime / (safeDuration || 1)) * 100}%`,
            top: 0,
            bottom: 0,
            width: 2,
            transform: "translateX(-1px)",
            background: "white",
          }}
        />
      </div>
    </div>
  );
}

/* ---------------------- Lazy loader for react-video-timelines-slider --------------- */
const LazyTimeRange = (props) => {
  const [Comp, setComp] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let mounted = true;

    const tryImportName = async (name) => {
      try {
        const spec = name;
        const mod = await import(/* @vite-ignore */ spec);
        return mod;
      } catch (err) {
        return null;
      }
    };

    (async () => {
      const candidates = [
        "react-video-timelines-slider",
        "react-video-timelines-slider/dist/index.esm.js",
        "react-video-timelines-slider/dist/index.js",
        "react-video-timelines-slider/dist/index.cjs",
      ];

      for (let i = 0; i < candidates.length; i++) {
        const name = candidates[i];
        try {
          const mod = await tryImportName(name);
          if (mod) {
            const C = mod?.default || mod;
            if (mounted && C) {
              setComp(() => C);
              console.info("[LazyTimeRange] loaded:", name);
              return;
            }
          }
        } catch (err) {
          // ignore and continue
        }
      }

      if (mounted) {
        console.info(
          "[LazyTimeRange] no timeline slider available; using fallback SmallRuler"
        );
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!Comp) return null;
  return <Comp {...props} />;
};

/**
 * Custom hook to manage video element interactions for time/duration
 */
function useVideoPlayback(videoRef, initialDuration) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(() => {
    return Number.isFinite(initialDuration) && initialDuration > 0
      ? initialDuration
      : 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      const t = video.currentTime || 0;
      setCurrentTime(Number.isFinite(t) ? t : 0);
    };
    const updateDuration = () => {
      let d = video.duration;
      if (!Number.isFinite(d) || d <= 0) {
        d = 0;
      }
      setDuration(d);
    };
    const updatePlayState = () => setIsPlaying(!video.paused);

    if (Number.isFinite(video.duration) && video.duration > 0) {
      setDuration(video.duration);
    }

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("durationchange", updateDuration);
    video.addEventListener("play", updatePlayState);
    video.addEventListener("pause", updatePlayState);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("durationchange", updateDuration);
      video.removeEventListener("play", updatePlayState);
      video.removeEventListener("pause", updatePlayState);
    };
  }, [videoRef]);

  const togglePlay = useCallback(async () => {
    const v = videoRef.current;
    if (!v || !v.src) {
      alert(v ? "No video loaded" : "No video element available");
      return;
    }
    try {
      if (v.paused) {
        await v.play().catch(console.warn);
      } else {
        v.pause();
      }
    } catch (err) {
      console.warn("Play/pause toggle failed:", err);
    }
  }, [videoRef]);

  return { currentTime, duration, isPlaying, togglePlay };
}

// Icon components
const PauseIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);
const PlayIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const PlusIcon = ({ className = "w-3 h-3" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

// -------------------- NEW: aggressive native-track remover --------------------
function removeNativeTracks(video) {
  if (!video) return;
  try {
    // 1) disable textTracks (if present)
    try {
      const tt = video.textTracks || [];
      for (let i = 0; i < tt.length; i++) {
        try {
          tt[i].mode = "disabled";
        } catch (e) {}
        try {
          tt[i].mode = "hidden";
        } catch (e) {}
      }
    } catch (e) {}

    // 2) remove any <track> elements from the video element DOM
    try {
      const tracks = video.querySelectorAll
        ? video.querySelectorAll("track")
        : [];
      tracks.forEach((t) => {
        try {
          const src = t.src || t.getAttribute("src");
          if (src && src.startsWith("blob:")) {
            try {
              URL.revokeObjectURL(src);
            } catch (e) {}
          }
        } catch (e) {}
        try {
          t.remove();
        } catch (e) {}
      });
    } catch (e) {}

    // 3) small trick: briefly pause/resume to nudge the browser to repaint without native captions
    try {
      const cur = video.currentTime || 0;
      const wasPaused = video.paused;
      video.pause?.();
      setTimeout(() => {
        try {
          if (!wasPaused) video.play?.().catch(() => {});
          video.currentTime = cur;
        } catch (e) {}
      }, 50);
    } catch (e) {}
  } catch (e) {
    console.warn("removeNativeTracks failed:", e);
  }
}

function disableNativeTracks(video) {
  removeNativeTracks(video);
}
// -------------------- end native-track helper --------------------

/* ---------------------- ModernTimelineEditor ---------------------- */
function ModernTimelineEditor({
  videoRef,
  videoMetadata,
  subtitles,
  onSeek,
  onAddCue,
}) {
  const containerRef = useRef(null);
  const { currentTime, duration, isPlaying, togglePlay } = useVideoPlayback(
    videoRef,
    videoMetadata.duration
  );

  const formatShort = (time) => {
    if (isNaN(time) || time < 0) return "0:00.00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 100);
    return `${m}:${String(s).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;
  };

  const onScrubClick = (e) => {
    if (duration <= 0 || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width)); // Clamp 0-1
    const time = pct * duration;
    if (onSeek) onSeek(time);
  };

  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const progressPct = safeDuration > 0 ? (currentTime / safeDuration) * 100 : 0;

  const MAX_UI_DURATION = 3600;

  const Ticks = useMemo(() => {
    const sd = Number.isFinite(duration) && duration > 0 ? duration : 0;
    if (sd === 0) {
      return [
        { time: 0, label: "0:00", isMajor: true },
        { time: 1, label: null, isMajor: false },
      ];
    }
    const clampDuration = Math.min(sd, MAX_UI_DURATION);
    let majorInterval;
    if (clampDuration > 1200) majorInterval = 300;
    else if (clampDuration > 600) majorInterval = 120;
    else if (clampDuration > 120) majorInterval = 30;
    else if (clampDuration > 30) majorInterval = 10;
    else majorInterval = 5;

    const maxTicks = 2000;
    const ticks = [];
    const ceilDur = Math.ceil(clampDuration);
    const step = 1;

    for (let t = 0; t <= ceilDur; t += step) {
      if (ticks.length > maxTicks) break;
      const isMajor = t % majorInterval === 0;
      ticks.push({
        time: t,
        label: isMajor
          ? `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`
          : null,
        isMajor,
      });
    }

    if (!ticks.some((x) => x.time === ceilDur)) {
      ticks.push({
        time: ceilDur,
        label: `${Math.floor(ceilDur / 60)}:${String(ceilDur % 60).padStart(
          2,
          "0"
        )}`,
        isMajor: true,
      });
    }

    return ticks.filter((t) => t.time <= sd);
  }, [duration]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-2 bg-[#0f172a] rounded-xl shadow-2xl py-3 px-4 font-sans border border-gray-700">
      <div className="flex items-center gap-4 w-full px-2">
        <button
          className={`p-2 rounded-full transition-colors shadow-lg flex-shrink-0 ${
            isPlaying
              ? "bg-cyan-700 hover:bg-cyan-600"
              : "bg-teal-500 hover:bg-teal-400"
          }`}
          onClick={togglePlay}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <PauseIcon className="w-5 h-5 text-black fill-current" />
          ) : (
            <PlayIcon className="w-5 h-5 text-black fill-current" />
          )}
        </button>

        <div className="flex-1 text-center text-xl font-bold text-gray-100">
          <span className="text-[#19b5ac] font-mono tracking-wide">
            {formatShort(currentTime)}
          </span>
          <span className="text-gray-400"> / {formatShort(safeDuration)}</span>
        </div>

        <button
          onClick={() => {
            if (onAddCue) onAddCue(currentTime);
          }}
          className="p-1.5 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition-colors text-sm font-medium flex items-center gap-1"
          title="Add subtitle cue at current time"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Add Cue
        </button>
      </div>

      <div className="w-full relative h-[75px] my-2">
        <div className="absolute top-0 left-0 right-0 h-4 flex items-end">
          <div className="relative w-full h-full">
            {Ticks.map((t) => {
              const left = (t.time / (safeDuration || 1)) * 100;
              return (
                <div
                  key={t.time}
                  style={{ left: `${left}%` }}
                  className={`absolute translate-x-[-50%] ${
                    t.isMajor
                      ? "h-full w-[2px] bg-gray-500"
                      : "h-1/2 w-[1px] bg-gray-700"
                  }`}
                >
                  {t.isMajor && (
                    <span className="absolute bottom-4 text-xs text-gray-400 translate-x-[-50%] whitespace-nowrap">
                      {t.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="absolute top-5 left-0 right-0 bottom-0 bg-gray-900 rounded-md overflow-hidden cursor-pointer"
          onClick={onScrubClick}
          ref={containerRef}
        >
          <div className="absolute inset-0 bg-gray-800 border-2 border-gray-700"></div>

          {safeDuration > 0 &&
            subtitles.map((s, i) => {
              const left = (s.start / (safeDuration || 1)) * 100;
              const width = Math.max(
                0.5,
                ((s.end - s.start) / (safeDuration || 1)) * 100
              );
              const isActive = currentTime >= s.start && currentTime < s.end;

              return (
                <div
                  key={i}
                  title={`${s.text} (${s.start.toFixed(2)}s - ${s.end.toFixed(
                    2
                  )}s)`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSeek) onSeek(s.start);
                  }}
                  className={`absolute top-[4px] bottom-[4px] rounded-md transition-all duration-100 ease-in-out cursor-pointer group flex items-center justify-between text-white text-[10px] px-1 overflow-hidden shadow-md ${
                    isActive
                      ? "bg-[#14bfb3] border-2 border-[#dff7f5]"
                      : "bg-cyan-700/60 border border-cyan-500/50 hover:bg-cyan-600/70"
                  }`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                >
                  <div className="absolute inset-y-0 left-0 w-[4px] cursor-col-resize opacity-0 group-hover:opacity-100 bg-white/30 z-10" />

                  <div
                    className={`truncate px-1 flex-1 ${
                      isActive ? "text-black font-semibold" : "text-white"
                    }`}
                  >
                    {s.text}
                  </div>

                  <div className="absolute inset-y-0 right-0 w-[4px] cursor-col-resize opacity-0 group-hover:opacity-100 bg-white/30 z-10" />
                </div>
              );
            })}

          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none z-20 transition-all duration-100 ease-linear"
            style={{ left: `${progressPct}%`, transform: "translateX(-50%)" }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full border-2 border-[#19b5ac] shadow-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------- ExportModal ---------------------- */

// CHANGES SUMMARY:
// 1. Removed preview button from EditorView (lines were ~2870-2879)
// 2. Modified ExportModal to remove subtitle list preview and cue counter

// src/pages/explified_tools/subtitling/AiSubtitlerPage.jsx
// [All imports and helper functions remain the same up to ExportModal]

/* ---------------------- ExportModal (UPDATED) ---------------------- */

function ExportModal({
  isOpen,
  onClose,
  subtitles = [],
  videoData = {},
  subtitleStyle = {},
  videoMetadata = {},
}) {
  if (!isOpen) return null;

  // ui state
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  const [exportProgress, setExportProgress] = useState(0); // 0..1
  const progressRef = useRef(0);
  const cancelledRef = useRef(false);
  const recorderRef = useRef(null);
  const timeoutRef = useRef(null);

  // Helper: transcode with timeout fallback
  async function transcodeWithTimeout(recordedBlob, onProgress, timeoutMs = 60_000) {
    return Promise.race([
      transcodeWebmBlobToMp4(recordedBlob, onProgress),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("transcode-timeout")), timeoutMs)
      ),
    ]);
  }

  // Download helper (handles Blob or URL)
  const downloadBlob = (blobOrUrl, filename) => {
    const a = document.createElement("a");
    a.style.display = "none";

    let url = blobOrUrl;
    if (blobOrUrl instanceof Blob) url = URL.createObjectURL(blobOrUrl);

    a.href = url;
    a.download = filename || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();

    if (blobOrUrl instanceof Blob) setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // SRT / VTT download helpers unchanged (kept simple)
  const fmtSrtTime = (time = 0) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
  };

  const fmtVttTime = (time = 0) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
  };

  const downloadSRT = () => {
    let srt = "";
    subtitles.forEach((sub, i) => {
      srt += `${i + 1}\n${fmtSrtTime(sub.start)} --> ${fmtSrtTime(sub.end)}\n${
        sub.text
      }\n\n`;
    });
    const blob = new Blob([srt], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, "subtitles.srt");
  };

  const downloadVTT = () => {
    let vtt = "WEBVTT\n\n";
    subtitles.forEach((sub) => {
      vtt += `${fmtVttTime(sub.start)} --> ${fmtVttTime(sub.end)}\n${
        sub.text
      }\n\n`;
    });
    const blob = new Blob([vtt], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, "subtitles.vtt");
  };

  // spinner helpers that update React state
  const startSpinner = (msg = "Processing…") => {
    setExportMessage(msg);
    setExportProgress(0);
    progressRef.current = 0;
    cancelledRef.current = false;
    setExporting(true);
  };
  const setSpinnerProgress = (ratio) => {
    const r = Math.max(0, Math.min(1, Number(ratio) || 0));
    if (r > progressRef.current) {
      progressRef.current = r;
      setExportProgress(r);
    }
  };
  const stopSpinner = (msg = "Done") => {
    setExportMessage(msg);
    clearTimeout(timeoutRef.current);
    setTimeout(() => {
      setExporting(false);
      setExportProgress(0);
      progressRef.current = 0;
      setExportMessage("");
      cancelledRef.current = false;
    }, 600);
  };

  // Cancel handler (user aborts export)
  const cancelExport = () => {
    console.log("[export] user requested cancel");
    cancelledRef.current = true;
    // stop recorder if running
    try {
      const r = recorderRef.current;
      if (r && r.state !== "inactive") {
        r.stop();
      }
    } catch (e) {}
    stopSpinner("Cancelled");
  };

  // Main export function
const exportBurnedInVideo = async () => {
    if (!videoData?.videoUrl) {
      alert("No video loaded.");
      return;
    }

    try {
      const vid = document.createElement("video");
      vid.crossOrigin = "anonymous";
      vid.src = videoData.videoUrl;
      vid.playsInline = true;
      vid.muted = true;

      await new Promise((res, rej) => {
        const onLoaded = () => {
          cleanupListeners();
          res();
        };
        const onError = (e) => {
          cleanupListeners();
          rej(new Error("Failed to load video"));
        };
        function cleanupListeners() {
          vid.removeEventListener("loadedmetadata", onLoaded);
          vid.removeEventListener("error", onError);
        }
        vid.addEventListener("loadedmetadata", onLoaded, { once: true });
        vid.addEventListener("error", onError, { once: true });
      });

      const w = vid.videoWidth || 1280;
      const h = vid.videoHeight || 720;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");

      const fontFamily =
        subtitleStyle.fontFamily || "Inter, system-ui, sans-serif";
      const fontSizePx = subtitleStyle.fontSize || 18;
      const fontWeight = subtitleStyle.fontWeight || 600;
      const color = subtitleStyle.color || "#ffffff";
      const bgEnabled = !!subtitleStyle.backgroundEnabled;
      const bgColor = subtitleStyle.backgroundColor || "#000000";
      const bgOpacity = subtitleStyle.backgroundOpacity ?? 0.85;

      try {
        await vid.play();
      } catch (playErr) {
        console.warn(
          "Muted autoplay may be blocked; user gesture might be required.",
          playErr
        );
      }

      const canvasStream = canvas.captureStream(30);
      const finalStream = new MediaStream();
      const canvasVideoTracks = canvasStream.getVideoTracks();
      canvasVideoTracks.forEach((t) => finalStream.addTrack(t));

      let audioCtx;
      let mediaElementSource;
      let audioDestination;
      try {
        let audioTracks = [];

        if (typeof vid.captureStream === "function") {
          try {
            const audioSourceStream = vid.captureStream();
            if (audioSourceStream && audioSourceStream.getAudioTracks) {
              audioTracks = audioSourceStream.getAudioTracks();
            }
          } catch (e) {
            console.warn("vid.captureStream() threw:", e);
          }
        }

        if (!audioTracks.length) {
          try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === "suspended") {
              try {
                await audioCtx.resume();
              } catch (e) {
                console.warn(
                  "AudioContext resume failed (may require user gesture).",
                  e
                );
              }
            }

            mediaElementSource = audioCtx.createMediaElementSource(vid);
            audioDestination = audioCtx.createMediaStreamDestination();
            mediaElementSource.connect(audioDestination);
            const destTracks = audioDestination.stream.getAudioTracks();
            if (destTracks && destTracks.length) audioTracks = destTracks;
          } catch (webaudioErr) {
            console.warn("WebAudio fallback failed:", webaudioErr);
          }
        }

        if (!audioTracks.length) {
          try {
            const pageVid = document.querySelector("video");
            if (pageVid && typeof pageVid.captureStream === "function") {
              const s2 = pageVid.captureStream();
              if (s2 && s2.getAudioTracks) audioTracks = s2.getAudioTracks();
            }
          } catch (e) {
            console.warn("Fallback page video capture failed:", e);
          }
        }

        audioTracks.forEach((t) => {
          try {
            finalStream.addTrack(t);
          } catch (err) {
            console.warn("Failed to add audio track to final stream:", err);
          }
        });
      } catch (err) {
        console.warn("Audio capture attempt failed:", err);
      }

      let mime = "video/webm;codecs=vp9,opus";
      if (!MediaRecorder.isTypeSupported(mime))
        mime = "video/webm;codecs=vp8,opus";
      if (!MediaRecorder.isTypeSupported(mime)) mime = "video/webm";

      const recordedChunks = [];
      const recorder = new MediaRecorder(finalStream, { mimeType: mime });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size) recordedChunks.push(e.data);
      };

      const finishRecording = () =>
        new Promise((resolve) => {
          recorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: mime });
            resolve(blob);
          };
        });

      let rafId;
      const drawFrame = () => {
        try {
          ctx.drawImage(vid, 0, 0, w, h);
        } catch (err) {
          console.error("Canvas drawImage error:", err);
          cancelAnimationFrame(rafId);
          if (recorder.state !== "inactive") recorder.stop();
          alert(
            "Unable to draw video to canvas. Cross-origin restrictions may apply."
          );
          return;
        }

        const t = vid.currentTime;
        const active = subtitles.filter((s) => t >= s.start && t <= s.end);
        if (active.length > 0) {
          const text = active.map((a) => a.text).join(" ");
          const paddingX = Math.round(w * 0.02);
          const paddingY = 8;
          const maxWidth = Math.round(w * 0.9);

          ctx.font = `${fontWeight} ${fontSizePx}px ${fontFamily}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";

          const words = text.split(" ");
          const lines = [];
          let line = "";
          for (let i = 0; i < words.length; i++) {
            const testLine = line ? `${line} ${words[i]}` : words[i];
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line) {
              lines.push(line);
              line = words[i];
            } else {
              line = testLine;
            }
          }
          if (line) lines.push(line);

          const lineHeight = fontSizePx * 1.25;
          const boxHeight = lineHeight * lines.length + paddingY * 2;
          const boxWidth = Math.min(
            maxWidth,
            ctx.measureText(
              lines.reduce((a, b) => (a.length > b.length ? a : b))
            ).width +
              paddingX * 2
          );

          const boxX = w / 2 - boxWidth / 2;
          const boxY = h - boxHeight - Math.round(h * 0.03);

          if (bgEnabled) {
            ctx.globalAlpha = bgOpacity;
            ctx.fillStyle = bgColor;
            ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
            ctx.globalAlpha = 1;
          }

          ctx.fillStyle = color;
          for (let i = 0; i < lines.length; i++) {
            const y = boxY + paddingY + (i + 1) * lineHeight - 4;
            ctx.fillText(lines[i], w / 2, y);
          }
        }

        rafId = requestAnimationFrame(drawFrame);
      };

      recorder.start(250);
      drawFrame();

      await new Promise((res) => {
        const onEnded = () => {
          cancelAnimationFrame(rafId);
          if (recorder.state !== "inactive") recorder.stop();
          res();
        };
        vid.addEventListener("ended", onEnded, { once: true });

        const expectedMs =
          (videoMetadata.duration || vid.duration || 0) * 1000 + 1000;
        const timeoutId = setTimeout(() => {
          try {
            if (!vid.ended) vid.currentTime = vid.duration;
          } catch (e) {}
          if (recorder.state !== "inactive") recorder.stop();
          cancelAnimationFrame(rafId);
          res();
        }, Math.max(8000, expectedMs));

        const cleanupAfter = () => clearTimeout(timeoutId);
        recorder.addEventListener("stop", cleanupAfter, { once: true });
      });

      const recordedBlob = await finishRecording();
      downloadBlob(
        recordedBlob,
        (videoData.fileName || "video") + "-burned.webm"
      );

      try {
        vid.pause();
        vid.src = "";
        finalStream.getTracks().forEach((t) => {
          try {
            t.stop();
          } catch {}
        });
        canvasStream.getTracks().forEach((t) => {
          try {
            t.stop();
          } catch {}
        });

        if (mediaElementSource && audioDestination) {
          try {
            mediaElementSource.disconnect(audioDestination);
          } catch {}
        }
        if (audioCtx && typeof audioCtx.close === "function") {
          try {
            await audioCtx.close();
          } catch {}
        }
      } catch (e) {
        /* ignore cleanup errors */
      } finally {
        if (rafId) cancelAnimationFrame(rafId);
        try {
          canvas.remove();
        } catch {}
      }
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed: " + (err.message || err));
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1500,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 520,
          maxWidth: "92vw",
          background: "#0f1720",
          color: "#fff",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <h3 style={{ margin: 0 }}>Export Subtitles</h3>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#bbb",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button
            onClick={downloadSRT}
            style={{
              flex: 1,
              padding: 10,
              background: "#06b6d4",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Download SRT
          </button>
          <button
            onClick={downloadVTT}
            style={{
              flex: 1,
              padding: 10,
              background: "#34d399",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Download VTT
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button
            onClick={exportBurnedInVideo}
            style={{
              flex: 1,
              padding: 10,
              background: "#ef4444",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              cursor: "pointer",
              color: "#fff",
            }}
            disabled={exporting}
          >
            {exporting ? "Exporting…" : "Export Video"}
          </button>
        </div>
      </div>

      {/* Export overlay */}
      {exporting && (
  <div
    aria-live="polite"
    style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 1600,
    }}
  >
    <div
      role="status"
      style={{
        width: 520,
        maxWidth: "94vw",
        background: "rgba(10, 15, 20, 0.96)",
        color: "#fff",
        padding: 18,
        borderRadius: 12,
        boxShadow: "0 14px 50px rgba(0,0,0,0.7)",
        textAlign: "left",
        pointerEvents: "auto",
        display: "flex",
        gap: 14,
        alignItems: "center",
      }}
    >
      {/* left: stepper */}
      <div style={{ width: 220, display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { key: "prepare", label: "Preparing" },
          { key: "capture", label: "Capturing" },
          { key: "transcode", label: "Transcoding" },
          { key: "download", label: "Downloading" },
          { key: "done", label: "Done" },
        ].map((step, i) => {
          const stepPct = i / 4; // 0..1 for five steps
          const progress = exportProgress || 0;
          const done = progress >= stepPct + 0.22 || (!exporting && step.key === "done");
          const active = progress >= stepPct && progress < stepPct + 0.22;
          return (
            <div key={step.key} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: done ? "#10b981" : active ? "#06b6d4" : "rgba(255,255,255,0.04)",
                  color: done ? "#042018" : "#fff",
                  fontWeight: 700,
                  boxShadow: active ? "0 6px 18px rgba(6,182,212,0.08)" : "none",
                  fontSize: 13,
                }}
              >
                {done ? "✓" : i + 1}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 13, fontWeight: active ? 700 : 600, color: active ? "#e6f7f7" : "#cbd5e1" }}>
                  {step.label}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                  {/* show the exportMessage only for the active step to avoid flicker */}
                  {active ? exportMessage || "Working…" : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* right: progress + actions */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{exportMessage || "Exporting..."}</div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>{Math.round((exportProgress || 0) * 100)}%</div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, height: 12, overflow: "hidden" }}>
          <div
            style={{
              width: `${Math.round((exportProgress || 0) * 100)}%`,
              height: "100%",
              background: "linear-gradient(90deg,#06b6d4,#34d399)",
              transition: "width 220ms linear",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
          <button
            onClick={() => {
              // cancel: prefer your stopSpinner helper if in scope, else fallback to setting exporting false
              try {
                if (typeof stopSpinner === "function") stopSpinner("Cancelled");
              } catch (e) {
                // best-effort fallback:
                // setExporting(false) // can't call setExporting here because it's inside component scope — we rely on stopSpinner
                console.warn("stopSpinner not available in overlay scope; export cancelled (UI fallback).", e);
              }
            }}
            style={{
              padding: "8px 12px",
              background: "#ff6b6b",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={() => {
              alert("Tip: If export hangs, try downloading the raw WebM (no transcode) or check console for 'Final stream tracks' to verify audio capture.");
            }}
            style={{
              padding: "8px 12px",
              background: "#374151",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Help
          </button>
        </div>

        <div style={{ fontSize: 12, color: "#9fb0b0", marginTop: 6 }}>
          Do not close the window while export is running. This overlay shows which stage is active and approximate progress.
        </div>
      </div>
    </div>
  </div>
)}


      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ============================================================
// In the EditorView section, remove/comment the preview button:
// Change this section (around line 2870):
//
// <button
//   onClick={(e) => {
//     e.stopPropagation();
//     setPreviewOpen(true);
//   }}
//   disabled={!videoData?.videoUrl || subtitles.length === 0}
//   className="px-3 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold"
// >
//   Preview
// </button>
//
// TO: (commented out or deleted)
// {/* <button ... Preview button removed ... */ }
//
// ============================================================

/* ---------------------- MAIN COMPONENT ---------------------- */
export default function AiSubtitlerPage() {
  const location = useLocation();
  const initialVideoData = location?.state || {};

  const [view, setView] = useState(
    initialVideoData?.videoUrl ? "editor" : "landing"
  );
  const [showUploadOverlay, setShowUploadOverlay] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [pasteValue, setPasteValue] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef();

  const [videoData, setVideoData] = useState(initialVideoData || {});
  const [activePanel, setActivePanel] = useState(null);
  const [selectedToolKey, setSelectedToolKey] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [subtitles, setSubtitles] = useState(initialVideoData?.subtitles || []);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({
    stage: "",
    message: "Ready...",
    progress: 0,
  });

  // NEW: preview state
  const [previewOpen, setPreviewOpen] = useState(false);

  const videoRef = useRef(null);

  const [videoMetadata, setVideoMetadata] = useState({
    duration: 0,
    width: 0,
    height: 0,
    aspectRatio: "landscape",
  });

  const [subtitleStyle, setSubtitleStyle] = useState({
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: 18,
    fontWeight: 600,
    color: "#ffffff",
    backgroundEnabled: true,
    backgroundColor: "#000000",
    backgroundOpacity: 0.85,
  });

  // NEW: transcriptId state
  const [transcriptId, setTranscriptId] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("auto");

  const uploadFileToBackend = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("languageCode", selectedLanguage || "auto");
    const res = await fetch(`${BACKEND_ORIGIN}/upload-audio`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Upload failed: ${errText}`);
    }
    const result = await res.json();
    return result;
  };

  async function uploadUrlToBackend(url) {
    const endpoint = `${BACKEND_ORIGIN}/upload-from-url`;

    const parseBodySafely = async (res) => {
      const text = await res.text().catch(() => "");
      try {
        return JSON.parse(text);
      } catch {
        return text || null;
      }
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2 * 60 * 1000);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ url, languageCode: selectedLanguage || "auto" }),
      });

      const body = await parseBodySafely(res);

      if (!res.ok) {
        const errMsg =
          (body && (body.error || JSON.stringify(body))) ||
          `HTTP ${res.status} ${res.statusText}`;
        const err = new Error(`URL upload failed: ${errMsg}`);
        err.status = res.status;
        err.body = body;
        throw err;
      }

      return body;
    } catch (err) {
      if (err.name === "AbortError") {
        const e = new Error("URL upload timed out (request aborted)");
        e.name = "TimeoutError";
        throw e;
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  // file picker
  const onFilePicked = (e) => {
    const file = e?.target?.files?.[0] || e;
    if (!file) return;
    const supportedFormats = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "audio/mpeg",
      "audio/webm",
      "audio/wav",
    ];
    if (
      !supportedFormats.includes(file.type) &&
      !file.type.startsWith("video/") &&
      !file.type.startsWith("audio/")
    ) {
      alert(
        "Please select a supported video/audio format (mp4, webm, ogg, mp3, wav)."
      );
      return;
    }
    setSelectedFile(file);
    setSelectedFileName(file.name);
    setPasteValue("");
  };

  // handleGenerate (file or URL)
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

    const ytEmbed = pasteToUse ? youtubeToEmbed(pasteToUse) : null;
    if (ytEmbed) {
      const meta = {
        duration: 0,
        width: 1280,
        height: 720,
        aspectRatio: "landscape",
      };
      const newData = {
        videoUrl: pasteToUse,
        embedUrl: ytEmbed,
        sourceType: "youtube",
        videoMetadata: meta,
        fileName: "YouTube video",
        subtitles: [],
        vttUrl: null,
        transcriptionText: "",
        transcriptId: null,
      };
      setVideoData(newData);
      setVideoMetadata(meta);
      setSubtitles([]);
      setTranscriptId(null);
      setShowUploadOverlay(false);
      setView("editor");
      return;
    }

    setIsExtracting(true);
    setGenerationProgress({
      stage: "start",
      message: "Starting...",
      progress: 5,
    });

    try {
      if (fileToUse) {
        let meta = {
          duration: 0,
          width: 0,
          height: 0,
          aspectRatio: "landscape",
        };
        try {
          const v = document.createElement("video");
          v.preload = "metadata";
          v.src = URL.createObjectURL(fileToUse);
          await new Promise((res, rej) => {
            const t = setTimeout(res, 1500);
            v.onloadedmetadata = () => {
              clearTimeout(t);
              meta = {
                duration: v.duration || 0,
                width: v.videoWidth || 0,
                height: v.videoHeight || 0,
                aspectRatio:
                  (v.videoWidth || 1280) > (v.videoHeight || 720)
                    ? "landscape"
                    : "portrait",
              };
              try {
                URL.revokeObjectURL(v.src);
              } catch {}
              res();
            };
            v.onerror = () => {
              clearTimeout(t);
              try {
                URL.revokeObjectURL(v.src);
              } catch {}
              res();
            };
          });
        } catch (e) {
          console.warn("Local metadata probe failed:", e);
        }

        setGenerationProgress({
          stage: "upload",
          message: "Uploading...",
          progress: 12,
        });

        if (CLOUDINARY_CLOUD && CLOUDINARY_UPLOAD_PRESET) {
          try {
            setGenerationProgress({
              stage: "upload",
              message: "Uploading to Cloudinary...",
              progress: 18,
            });
            const cloudUrl = await uploadFileToCloudinary(fileToUse);

            setGenerationProgress({
              stage: "submit",
              message: "Requesting transcription for uploaded file...",
              progress: 40,
            });

            const result = await uploadUrlToBackend(cloudUrl);

            const returnedTranscriptId =
              result?.transcriptId || result?.transcript_id || null;
            setTranscriptId(returnedTranscriptId);

            const { text, segments, vttUrl, detectedLanguage } = result || {};
            const newData = {
              videoUrl: cloudUrl,
              videoMetadata: meta,
              fileName:
                selectedFileName || fileToUse.name || "Video from device",
              sourceType: "cloudinary",
              subtitles: segments || [],
              vttUrl: normalizeVttUrl(vttUrl),
              transcriptionText: text || "",
              transcriptId: returnedTranscriptId,
              detectedLanguage: detectedLanguage || null,
            };
            setVideoData(newData);
            setVideoMetadata(meta);
            setSubtitles(segments || []);

            setShowUploadOverlay(false);
            setView("editor");
            setIsExtracting(false);
            setGenerationProgress({
              stage: "done",
              message: "Done",
              progress: 100,
            });
            return;
          } catch (cloudErr) {
            console.warn("Cloudinary failed, falling back:", cloudErr);
          }
        }

        try {
          setGenerationProgress({
            stage: "upload",
            message: "Uploading to server...",
            progress: 20,
          });

          const result = await uploadFileToBackend(fileToUse);

          const returnedTranscriptId =
            result?.transcriptId || result?.transcript_id || null;
          setTranscriptId(returnedTranscriptId);

          const { text, segments, vttUrl, detectedLanguage } = result || {};

          const objectUrl = URL.createObjectURL(fileToUse);

          const newData = {
            videoUrl: objectUrl,
            videoMetadata: meta,
            fileName: selectedFileName || fileToUse.name || "Video from device",
            sourceType: "file",
            subtitles: segments || [],
            vttUrl: normalizeVttUrl(vttUrl),
            transcriptionText: text || "",
            transcriptId: returnedTranscriptId,
            detectedLanguage: detectedLanguage || null,
          };

          setVideoData(newData);
          setVideoMetadata(meta);
          setSubtitles(segments || []);

          // ensure native tracks removed on local object URL video
          setTimeout(() => {
            const v = videoRef.current;
            if (v) {
              try {
                removeNativeTracks(v);
              } catch (e) {}
              const onLoadedMeta = () => {
                try {
                  URL.revokeObjectURL(objectUrl);
                } catch {}
                v.removeEventListener("loadedmetadata", onLoadedMeta);
              };
              v.addEventListener("loadedmetadata", onLoadedMeta);
            }
          }, 400);

          setShowUploadOverlay(false);
          setView("editor");
          setIsExtracting(false);
          setGenerationProgress({
            stage: "done",
            message: "Done",
            progress: 100,
          });
          return;
        } catch (err) {
          console.error("Upload error:", err);
          setIsExtracting(false);
          setGenerationProgress({
            stage: "error",
            message: "Upload failed",
            progress: 0,
          });
          alert("Failed to upload / transcribe file: " + (err.message || err));
          return;
        }
      }

      if (!isLikelyUrl(pasteToUse)) {
        setIsExtracting(false);
        alert("Invalid URL");
        return;
      }

      setGenerationProgress({
        stage: "probe",
        message: "Checking URL...",
        progress: 8,
      });
      const probe = await probeVideoUrl(pasteToUse);

      if (!probe.ok) {
        const tryAnyway = window.confirm(
          "This link did not behave like a direct video file (it may be a webpage or protected stream). Attempt server-side download/transcription anyway? (OK = try, Cancel = abort)"
        );
        if (!tryAnyway) {
          setIsExtracting(false);
          setGenerationProgress({
            stage: "aborted",
            message: "User aborted",
            progress: 0,
          });
          return;
        }
      }

      setGenerationProgress({
        stage: "download",
        message: "Sending URL to server...",
        progress: 15,
      });

      try {
        const result = await uploadUrlToBackend(pasteToUse);

        const { text, segments, vttUrl, cloudinaryUrl, detectedLanguage } =
          result || {};

        const returnedTranscriptId =
          result?.transcriptId || result?.transcript_id || null;
        setTranscriptId(returnedTranscriptId);

        const finalVideoUrl = cloudinaryUrl || pasteToUse;
        const meta = probe.ok
          ? {
              duration: probe.duration || 0,
              width: probe.width || 1280,
              height: probe.height || 720,
              aspectRatio:
                (probe.width || 1280) > (probe.height || 720)
                  ? "landscape"
                  : "portrait",
            }
          : { duration: 0, width: 1280, height: 720, aspectRatio: "landscape" };

        const newData = {
          videoUrl: finalVideoUrl,
          videoMetadata: meta,
          fileName: "Video from URL",
          sourceType: "url",
          subtitles: segments || [],
          vttUrl: normalizeVttUrl(vttUrl),
          transcriptionText: text || "",
          transcriptId: returnedTranscriptId,
          detectedLanguage: detectedLanguage || null,
        };

        setVideoData(newData);
        setVideoMetadata(meta);
        setSubtitles(segments || []);
        setShowUploadOverlay(false);
        setView("editor");
        setIsExtracting(false);
        setGenerationProgress({
          stage: "done",
          message: "Done",
          progress: 100,
        });
        return;
      } catch (err) {
        console.error("URL processing error:", err);

        const backendBody = err.body || null;
        const backendStatus = err.status || null;
        const friendly =
          backendBody?.error ||
          err.message ||
          "Failed to process video from URL";

        if (backendStatus === 400 || backendStatus === 403) {
          alert(
            `${friendly}\n\nSuggestions:\n• Paste a direct .mp4/.webm/.mov file link.\n• For YouTube paste the watch URL (we will embed it).\n• Or upload the file from your device.`
          );
          const tryProxy = window.confirm(
            "Try to play the URL via backend proxy for testing? (OK = try)"
          );
          if (tryProxy) {
            const prox = `${BACKEND_ORIGIN}/proxy/video?url=${encodeURIComponent(
              pasteToUse
            )}`;
            const meta = {
              duration: 0,
              width: 1280,
              height: 720,
              aspectRatio: "landscape",
            };
            setVideoData({
              videoUrl: prox,
              videoMetadata: meta,
              fileName: "Proxied URL",
              sourceType: "proxy",
              transcriptId: null,
            });
            setVideoMetadata(meta);
            setTranscriptId(null);
            setView("editor");
            setIsExtracting(false);
            setGenerationProgress({
              stage: "proxy",
              message: "Using proxied playback",
              progress: 60,
            });
            return;
          }
        } else {
          alert("Failed to process video from URL: " + (err.message || err));
        }

        setIsExtracting(false);
        setGenerationProgress({
          stage: "error",
          message: "URL processing failed",
          progress: 0,
        });
        return;
      }
    } catch (err) {
      console.error("handleGenerate unexpected error:", err);
      alert("An unexpected error occurred: " + (err.message || err));
      setIsExtracting(false);
      setGenerationProgress({
        stage: "error",
        message: "Unexpected error",
        progress: 0,
      });
    }
  };

  // disableNativeTracks helper used in various places
  function disableNativeTracksWrapper(video) {
    try {
      disableNativeTracks(video);
    } catch (e) {
      console.warn("disableNativeTracksWrapper failed:", e);
    }
  }

  // keep video element src updated when view/editor and sourceType not youtube
  useEffect(() => {
    if (view !== "editor") return;
    if (!videoData?.videoUrl || videoData?.sourceType === "youtube") return;
    if (!videoRef?.current) return;

    const v = videoRef.current;
    try {
      v.src = videoData.videoUrl;
      v.load();

      try {
        removeNativeTracks(v);
      } catch (e) {}
    } catch (err) {
      console.warn("Error setting video src:", err);
    }

    const onLoaded = () => {
      const ar = v.videoWidth > v.videoHeight ? "landscape" : "portrait";
      setVideoMetadata({
        duration: v.duration || 0,
        width: v.videoWidth || 0,
        height: v.videoHeight || 0,
        aspectRatio: ar,
      });
      try {
        removeNativeTracks(v);
      } catch (e) {}
    };
    const onError = (ev) => {
      console.warn("Video element failed to load source:", ev);
      alert(
        "Failed to load the provided video source. It may be inaccessible or in an unsupported format."
      );
    };

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("error", onError);

    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("error", onError);
    };
  }, [view, videoData]);

  // timeupdate -> subtitle display
  useEffect(() => {
    if (view !== "editor") return;
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      const t = v.currentTime;
      const found = subtitles.find((s) => t >= s.start && t <= s.end);
      setCurrentSubtitle(found ? found.text : "");
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [view, subtitles]);

  // disable native tracks whenever video element changes src
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    disableNativeTracksWrapper(vid);

    const onLoadedMeta = () => disableNativeTracksWrapper(vid);
    const onError = () => disableNativeTracksWrapper(vid);

    vid.addEventListener("loadedmetadata", onLoadedMeta);
    vid.addEventListener("error", onError);

    return () => {
      try {
        vid.removeEventListener("loadedmetadata", onLoadedMeta);
        vid.removeEventListener("error", onError);
      } catch (e) {}
    };
  }, [videoData?.videoUrl]);

  // subtitle/style helpers
  const handleGenerateSubtitles = async () => {
    setIsGenerating(true);
    setGenerationProgress({
      stage: "extract",
      message: "Extracting audio...",
      progress: 10,
    });
    try {
      await new Promise((r) => setTimeout(r, 1200));
      const dummy = [
        {
          start: 0,
          end: Math.min(4, videoMetadata.duration || 4),
          text: "Generated placeholder subtitle — replace with real transcriber.",
        },
      ];
      setSubtitles(dummy);
      setGenerationProgress({
        stage: "done",
        message: "Subtitles generated (placeholder)",
        progress: 100,
      });
      alert(
        "Auto-generation placeholder complete — plug in your transcription function here."
      );
      setActivePanel(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // helper: create VTT text from segments [{ start, end, text }, ...]
  function segmentsToVtt(segments = []) {
    const lines = ["WEBVTT\n"];
    segments.forEach((s, i) => {
      const start = Number(s.start).toFixed(3);
      const end = Number(s.end).toFixed(3);
      const toTime = (sec) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const sRem = (sec % 60).toFixed(3);
        const pad = (n, digits = 2) => String(n).padStart(digits, "0");
        return `${pad(h)}:${pad(m)}:${pad(Math.floor(sRem))}.${String(sRem)
          .split(".")[1]
          .padEnd(3, "0")}`;
      };
      lines.push(`${i + 1}`);
      lines.push(`${toTime(parseFloat(start))} --> ${toTime(parseFloat(end))}`);
      const safeText = (s.text || "").replace(/<\/?[^>]+(>|$)/g, "");
      lines.push(safeText);
      lines.push("");
    });
    return lines.join("\n");
  }

  async function handleTranslate(targetLangRaw) {
    if (!videoRef?.current) {
      alert("Video element not available for translation.");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress({
      stage: "translating",
      message: `Translating to ${targetLangRaw || "target language"}...`,
      progress: 20,
    });

    try {
      const targetLang = normalizeTargetLang(targetLangRaw) || targetLangRaw;
      if (!targetLang)
        throw new Error("Unsupported or missing target language.");

      const srcLang =
        (videoData && videoData.detectedLanguage) ||
        (transcriptId ? "auto" : "auto") ||
        "auto";

      const segmentsToSend =
        Array.isArray(subtitles) && subtitles.length > 0 ? subtitles : [];

      setGenerationProgress({
        stage: "request",
        message: "Sending translation request to server...",
        progress: 35,
      });

      const res = await translateSubtitlesToBackend(
        segmentsToSend,
        targetLang,
        srcLang
      );

      const translatedSegments = Array.isArray(res.segments)
        ? res.segments
        : [];
      const backendVttUrl = res.vttUrl || res.vttUrlPath || null;

      setGenerationProgress({
        stage: "building",
        message: "Applying translated subtitles...",
        progress: 65,
      });

      let finalVttUrl = null;
      let createdBlob = false;
      if (backendVttUrl) {
        if (/^https?:\/\//i.test(backendVttUrl)) finalVttUrl = backendVttUrl;
        else
          finalVttUrl = `${BACKEND_ORIGIN}${
            backendVttUrl.startsWith("/") ? "" : "/"
          }${backendVttUrl}`;
      } else {
        const vttText = segmentsToVtt(translatedSegments);
        const blob = new Blob([vttText], { type: "text/vtt" });
        finalVttUrl = URL.createObjectURL(blob);
        createdBlob = true;
      }

      setVideoData((prev) => {
        try {
          const prevVtt = prev?.vttUrl;
          if (
            prevVtt &&
            typeof prevVtt === "string" &&
            prevVtt.startsWith("blob:")
          ) {
            try {
              URL.revokeObjectURL(prevVtt);
            } catch (e) {}
          }
        } catch (e) {}
        return {
          ...(prev || {}),
          subtitles: translatedSegments,
          vttUrl: finalVttUrl,
        };
      });

      setSubtitles(translatedSegments);

      const vid = videoRef.current;
      if (vid) {
        try {
          const prevGenerated = vid.querySelector("track[data-generated-vtt]");
          if (prevGenerated) {
            try {
              const prevSrc = prevGenerated.src;
              if (prevSrc && prevSrc.startsWith("blob:"))
                URL.revokeObjectURL(prevSrc);
            } catch (e) {}
            prevGenerated.remove();
          }
        } catch (e) {
          console.warn("Could not remove previous generated track:", e);
        }

        disableNativeTracksWrapper(vid);

        const trackEl = document.createElement("track");
        trackEl.kind = "subtitles";
        trackEl.label = `AI Subtitles (${targetLang})`;
        trackEl.srclang = String(targetLang).slice(0, 2) || "en";
        trackEl.setAttribute("data-generated-vtt", "true");

        trackEl.src = finalVttUrl;
        vid.appendChild(trackEl);

        const onLoad = () => {
          try {
            if (trackEl.track) {
              try {
                trackEl.track.mode = "hidden";
              } catch (e) {
                try {
                  trackEl.track.mode = "disabled";
                } catch (ee) {}
              }

              const cues = Array.from(trackEl.track?.cues || []);
              if (cues.length) {
                const mapped = cues.map((c) => ({
                  start: c.startTime,
                  end: c.endTime,
                  text: c.text,
                }));
                setSubtitles(mapped);
              }
            }

            disableNativeTracksWrapper(vid);
          } catch (e) {
            console.warn("track load handler error:", e);
          }
        };

        trackEl.addEventListener("load", onLoad, { once: true });

        const fallbackTimer = setTimeout(() => {
          try {
            if (trackEl.track) {
              try {
                trackEl.track.mode = "hidden";
              } catch (e) {
                try {
                  trackEl.track.mode = "disabled";
                } catch (ee) {}
              }
            }
            disableNativeTracksWrapper(vid);
          } catch (e) {}
        }, 250);

        setTimeout(() => clearTimeout(fallbackTimer), 2000);
      }

      setGenerationProgress({
        stage: "done",
        message: "Translation applied",
        progress: 100,
      });

      return translatedSegments;
    } catch (err) {
      console.error("translate error", err);
      setGenerationProgress({
        stage: "error",
        message: "Translation failed: " + (err?.message || String(err)),
        progress: 0,
      });
      alert("Translation failed: " + (err?.message || String(err)));
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }

  function vttTimeToSeconds(timeStr) {
    const parts = timeStr.split(":");
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const secondsParts = parts[2].split(".");
    const seconds = parseInt(secondsParts[0]);
    const milliseconds = parseInt(secondsParts[1] || 0);

    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
  }

  const applyStyle = (partial) =>
    setSubtitleStyle((s) => ({ ...s, ...partial }));
  const applyColor = (hex) => setSubtitleStyle((s) => ({ ...s, color: hex }));
  const updateSubtitleStyle = (partial) =>
    setSubtitleStyle((s) => ({ ...s, ...partial }));

  const seekTo = (t) => {
    if (videoRef.current) videoRef.current.currentTime = t;
  };
  const playFrom = (t) => {
    if (videoRef.current) {
      videoRef.current.currentTime = t;
      videoRef.current.play();
    }
  };

  const editCueText = (index, newText) => {
    setSubtitles((s) => {
      const copy = [...s];
      copy[index] = { ...copy[index], text: newText };
      return copy;
    });
  };

  const editCueAtPlayhead = (newText) => {
    const t = videoRef.current?.currentTime ?? 0;
    const idx = subtitles.findIndex((s) => t >= s.start && t <= s.end);
    if (idx >= 0) {
      editCueText(idx, newText);
      return;
    }
    const dur = Math.min(4, (videoMetadata.duration || 4) - t) || 2;
    const newCue = { start: t, end: t + dur, text: newText };
    setSubtitles((s) => [...s, newCue].sort((a, b) => a.start - b.start));
  };

  const deleteCue = (index) => {
    if (!confirm("Delete this cue?")) return;
    setSubtitles((s) => s.filter((_, i) => i !== index));
  };
  const addCueAtCurrent = () => {
    const t = videoRef.current?.currentTime || 0;
    const dur = Math.min(4, (videoMetadata.duration || 4) - t);
    const newCue = { start: t, end: t + (dur || 2), text: "New subtitle…" };
    setSubtitles((s) => [...s, newCue].sort((a, b) => a.start - b.start));
  };

  // projects (unchanged)
  const projectsKey = "ai_sub_projects";
  const loadProjects = () => {
    try {
      const raw = localStorage.getItem(projectsKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };
  const saveProject = (name) => {
    const projects = loadProjects();
    const project = {
      id: "p_" + Date.now(),
      name,
      createdAt: Date.now(),
      payload: { videoData, videoMetadata, subtitles, subtitleStyle },
    };
    const next = [project, ...projects];
    localStorage.setItem(projectsKey, JSON.stringify(next));
    return project;
  };
  const loadProject = (payload) => {
    if (!payload) {
      alert("Invalid project payload");
      return;
    }
    setVideoData(payload.videoData || {});
    setVideoMetadata(
      payload.videoMetadata || { aspectRatio: "landscape", duration: 0 }
    );
    setSubtitles(payload.subtitles || []);
    setSubtitleStyle(payload.subtitleStyle || subtitleStyle);
    setTranscriptId(payload.videoData?.transcriptId || null);
    setView("editor");
  };

  // LandingView
  const LandingView = (
    <div
      style={{
        minHeight: "100vh",
        background: "#060708",
        color: "#e6eef0",
        fontFamily: "Inter, sans-serif",
        padding: 32,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              background: "#19b5ac",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#022",
              fontWeight: 800,
              fontSize: 24,
            }}
          >
            E
          </div>
          <h1 style={{ fontSize: 32, margin: 0, fontWeight: 700 }}>
            AI SUBTITLE GENERATOR
          </h1>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: 1000,
            maxWidth: "94vw",
            background:
              "linear-gradient(180deg, rgba(17,18,18,0.96), rgba(14,16,16,0.96))",
            borderRadius: 12,
            padding: 40,
            border: "1px solid rgba(30,130,125,0.06)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.65)",
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <button
              onClick={() => setShowUploadOverlay(true)}
              style={{
                width: "100%",
                maxWidth: 340,
                height: 210,
                borderRadius: 8,
                background:
                  "linear-gradient(180deg, rgba(14,20,20,1), rgba(10,12,12,1))",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.02)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.02), 0 8px 30px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#19b5ac",
                  background: "rgba(20,30,30,0.4)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
                  marginBottom: 6,
                }}
              >
                ⬆️
              </div>
              <div
                style={{
                  fontSize: 25,
                  fontWeight: 700,
                  color: "#fff",
                  marginTop: 12,
                }}
              >
                {selectedFileName ? "File Selected" : "Choose a file"}
              </div>
              <div style={{ color: "#9fb0b0", fontSize: 18, marginTop: 6 }}>
                {selectedFileName || "Upload a video to get started"}
              </div>
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              marginTop: 60,
              marginBottom: 36,
            }}
          >
            {[
              { title: "Multi-Language Support", icon: "🌐" },
              { title: "Caption Editing", icon: "✏️" },
              { title: "Font Color Control", icon: "🎨" },
              { title: "Auto Mode", icon: "⚙️" },
              { title: "Font Style Customization", icon: "📝" },
              { title: "Real-Time Preview", icon: "👁️" },
            ].map((item, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 6,
                    background: "#14bfb3",
                    boxShadow: "0 2px 8px rgba(25,181,172,0.18)",
                    flexShrink: 0,
                  }}
                />
                <div style={{ color: "#c8d2d2", fontSize: 18 }}>
                  {item.title}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={() => handleGenerate()}
              style={{
                background: "linear-gradient(90deg,#19b5ac,#13b7b0)",
                color: "#022",
                borderRadius: 10,
                padding: "14px 36px",
                fontWeight: 800,
                fontSize: 30,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 12px 30px rgba(19,181,172,0.18)",
              }}
            >
              Generate ✨
            </button>
          </div>
        </div>
      </div>

      {showUploadOverlay && (
        <div
          onClick={() => setShowUploadOverlay(false)}
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
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 1300,
              maxWidth: "95%",
              height: 600,
              maxHeight: "95vh",
              borderRadius: 8,
              background: "rgba(20,20,20,0.95)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
              padding: 28,
              position: "relative",
              color: "#e6efef",
              display: "flex",
              flexDirection: "column",
              gap: 28,
              overflowY: "auto",
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="video/*,audio/*"
              style={{ display: "none" }}
              onChange={onFilePicked}
            />
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
                onClick={() => fileInputRef.current?.click()}
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
                <div style={{ fontSize: 36 }}>📤</div>
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
                      background: "linear-gradient(90deg,#19b5ac,#13b7b0)",
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

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.05)",
                paddingTop: 24,
              }}
            >
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
              <input
                type="text"
                placeholder="Paste your link here (MP4, WebM, OGG) or YouTube watch URL"
                value={pasteValue}
                onChange={(e) => {
                  setPasteValue(e.target.value);
                  setSelectedFile(null);
                  setSelectedFileName(null);
                }}
                style={{
                  width: "100%",
                  maxWidth: 800,
                  height: 52,
                  borderRadius: 8,
                  background: "linear-gradient(180deg,#122826,#0d2424)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: "0 16px",
                  color: "#e6efef",
                  fontSize: 16,
                  outline: "none",
                  boxSizing: "border-box",
                  margin: "0 auto",
                  display: "block",
                }}
              />
              <div
                style={{
                  marginTop: 12,
                  color: "#9fb0b0",
                  fontSize: 13,
                  maxWidth: 800,
                  margin: "12px auto 0",
                }}
              >
                Tip: Paste a direct link to an accessible video file. For
                YouTube paste the watch URL (we will embed it).
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
                      background: "linear-gradient(90deg,#19b5ac,#13b7b0)",
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

            <div
              onClick={() => setShowUploadOverlay(false)}
              style={{
                position: "absolute",
                right: 15,
                top: 12,
                fontSize: 28,
                color: "#cbd6d6",
                cursor: "pointer",
                lineHeight: "20px",
              }}
            >
              ×
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const EditorView = (
    <div
      className="min-h-screen bg-black flex text-white font-inter"
      style={{ minHeight: "100vh" }}
    >
      <Sidebar
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        selectedToolKey={selectedToolKey}
        setSelectedToolKey={setSelectedToolKey}
        onApplyStyle={applyStyle}
        onApplyColor={applyColor}
        onUpdateStyle={updateSubtitleStyle}
        subtitleStyle={subtitleStyle}
        onGenerateSubtitles={handleGenerateSubtitles}
        isGenerating={isGenerating}
        generationProgress={generationProgress}
        onLoadProject={loadProject}
        onSaveProject={saveProject}
        onTranslate={handleTranslate}
      />

      <main
        className="flex-1 flex flex-col items-center justify-center relative transition-all gap-[70px] duration-300 p-8 "
        style={{ marginLeft: "5rem" }}
        onClick={() => {
          if (activePanel) setActivePanel(null);
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            gap: 8,
            zIndex: 60,
          }}
        >
          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              setPreviewOpen(true);
            }}
            disabled={!videoData?.videoUrl || subtitles.length === 0}
            className="px-3 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold"
          >
            Preview
          </button> */}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowExportModal(true);
            }}
            disabled={subtitles.length === 0}
            className="px-3 py-2 rounded bg-cyan-700 hover:bg-cyan-600 text-white font-bold"
          >
            EXPORT
          </button>
        </div>

        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div style={{ width: "100%", maxWidth: 1100 }}>
            <PlayerContainer
              videoRef={videoRef}
              videoData={videoData}
              videoMetadata={videoMetadata}
              isMaximized={isMaximized}
              setIsMaximized={setIsMaximized}
              currentSubtitle={currentSubtitle}
              subtitles={subtitles}
              subtitleStyle={subtitleStyle}
              onSeekTo={seekTo}
              view={view}
              onEditCueAtPlayhead={editCueAtPlayhead}
              onRequestOpenEditor={() => setActivePanel("subtitleList")}
            />
          </div>
        </div>

        <div style={{ width: "100%", maxWidth: 1100 }}>
          <ModernTimelineEditor
            videoRef={videoRef}
            videoMetadata={videoMetadata}
            subtitles={subtitles}
            onSeek={seekTo}
            onAddCue={addCueAtCurrent}
          />
        </div>
      </main>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        subtitles={subtitles}
        videoData={videoData}
        subtitleStyle={subtitleStyle}
        videoMetadata={videoMetadata}
      />

      <RemotionPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        videoUrl={videoData?.videoUrl}
        duration={videoMetadata?.duration || 10}
        subtitles={subtitles}
        subtitleStyle={subtitleStyle}
        width={videoMetadata?.width || 1280}
        height={videoMetadata?.height || 720}
        fps={30}
      />
    </div>
  );

  return view === "landing" ? LandingView : EditorView;
}
