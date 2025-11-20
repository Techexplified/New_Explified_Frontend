// src/lib/ffmpeg-loader.js
// Helper: dynamically load @ffmpeg/ffmpeg (local or CDN fallback) and provide a transcode helper.
// Usage: import { transcodeWebmBlobToMp4 } from 'src/lib/ffmpeg-loader';

export async function initFfmpeg({ onProgress } = {}) {
  // Try to dynamic-import the local package first (lets Vite handle resolution).
  let mod = null;
  try {
    mod = await import("@ffmpeg/ffmpeg");
  } catch (err) {
    console.warn("Local @ffmpeg/ffmpeg import failed — falling back to CDN:", err);
  }

  if (!mod) {
    // CDN fallback (explicit version chosen to match your installed version)
    const cdnUrl = "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.15/dist/ffmpeg.min.js";
    try {
      mod = await import(/* @vite-ignore */ cdnUrl);
    } catch (cdnErr) {
      console.error("Failed to import ffmpeg from CDN", cdnErr);
      throw cdnErr;
    }
  }

  const { createFFmpeg, fetchFile, FFmpeg } = mod;

  let ffmpeg;
  // Normalize API: support both older createFFmpeg and newer FFmpeg class
  if (typeof createFFmpeg === "function") {
    ffmpeg = createFFmpeg({ log: true });
    if (onProgress && typeof ffmpeg.setProgress === "function") ffmpeg.setProgress(onProgress);
    await ffmpeg.load();
  } else if (typeof FFmpeg === "function") {
    ffmpeg = new FFmpeg({ log: true });
    if (onProgress && typeof ffmpeg.setProgress === "function") ffmpeg.setProgress(onProgress);

    // For the newer API, we must supply corePath. Use the CDN core matching the version.
    const corePath = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.15/dist/esm/ffmpeg-core.js";
    await ffmpeg.load({ corePath });
  } else {
    throw new Error("ffmpeg package did not expose createFFmpeg or FFmpeg");
  }

  return { ffmpeg, fetchFile };
}

/**
 * transcodeWebmBlobToMp4
 * - webmBlob : Blob (recorded webm)
 * - onProgress : optional callback (0..1) for load/run progress
 * Returns: Blob (mp4)
 */
export async function transcodeWebmBlobToMp4(webmBlob, onProgress) {
  const { ffmpeg, fetchFile } = await initFfmpeg({
    onProgress: (p) => {
      // different builds may pass objects; normalize to number 0..1
      try {
        if (typeof onProgress === "function") {
          // if p is an object with 'ratio' property
          if (p && typeof p === "object" && "ratio" in p) onProgress(Number(p.ratio) || 0);
          else if (typeof p === "number") onProgress(p);
          else onProgress(0);
        }
      } catch (e) {
        console.warn("onProgress handler threw", e);
      }
    },
  });

  // write input
  ffmpeg.FS("writeFile", "input.webm", await fetchFile(webmBlob));

  // run ffmpeg (libx264 + aac). Tweak crf/preset as desired.
  await ffmpeg.run(
    "-i",
    "input.webm",
    "-c:v",
    "libx264",
    "-crf",
    "23",
    "-preset",
    "veryfast",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-movflags",
    "+faststart",
    "output.mp4"
  );

  // read result
  const data = ffmpeg.FS("readFile", "output.mp4");
  const mp4Blob = new Blob([data.buffer], { type: "video/mp4" });

  // try to clean up ffmpeg FS
  try {
    ffmpeg.FS("unlink", "input.webm");
    ffmpeg.FS("unlink", "output.mp4");
  } catch (e) {
    console.warn("ffmpeg FS cleanup failed:", e);
  }

  return mp4Blob;
}
