import React, { useEffect, useRef, useState } from "react";

const GeminiOrbEffect = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [volume, setVolume] = useState(0);
  const rotationRef = useRef(0);

  useEffect(() => {
    let audioContext, analyser, dataArray, source, rafId;

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateAudio = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg =
            dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
          // Smooth volume changes
          setVolume((prev) => prev * 0.85 + avg * 0.15);
          rafId = requestAnimationFrame(updateAudio);
        };
        updateAudio();
      } catch (err) {
        console.error("🎤 Mic permission error:", err);
      }
    };

    initAudio();
    return () => {
      if (audioContext) audioContext.close();
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let time = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) / 2.4;

      ctx.clearRect(0, 0, w, h);

      // Background glow (main theme #23b5b5)
      const bgGradient = ctx.createRadialGradient(
        cx,
        cy,
        radius * 0.4,
        cx,
        cy,
        radius * 1.2
      );
      bgGradient.addColorStop(0, "rgba(35,181,181,0.22)");
      bgGradient.addColorStop(0.6, "rgba(35,181,181,0.10)");
      bgGradient.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, w, h);

      // Layers
      const layers = 3;
      const speaking = volume > 0.05;

      for (let i = 0; i < layers; i++) {
        const waveGradient = ctx.createLinearGradient(0, 0, w, h);
        waveGradient.addColorStop(
          0,
          `rgba(35,181,181,${0.22 - i * 0.05 + (speaking ? 0.05 : 0)})`
        );
        waveGradient.addColorStop(
          0.5,
          `rgba(35,181,181,${0.18 - i * 0.06 + (speaking ? 0.06 : 0)})`
        );
        waveGradient.addColorStop(
          1,
          `rgba(35,181,181,${0.13 - i * 0.05 + (speaking ? 0.05 : 0)})`
        );
        ctx.fillStyle = waveGradient;

        ctx.beginPath();
        const waveCount = 6;
        const baseAmplitude = 8;
        const amplitude =
          baseAmplitude + (speaking ? volume * 60 : volume * 20);
        const phase = time * 0.015 + i * 0.01;

        for (
          let angle = 0;
          angle <= Math.PI * 2;
          angle += Math.PI / (waveCount * 15)
        ) {
          const r =
            radius +
            Math.sin(angle * waveCount + phase) * amplitude * (0.9 - i * 0.25) +
            Math.cos(angle * waveCount * 0.6 + phase * 0.7) *
              (amplitude * 0.25);
          const x = cx + r * Math.cos(angle + rotationRef.current);
          const y = cy + r * Math.sin(angle + rotationRef.current);
          if (angle === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.closePath();
        ctx.shadowBlur = speaking ? 55 : 35;
        ctx.shadowColor = "rgba(35,181,181,0.7)";
        ctx.fill();
      }

      // Outer ring with increased amplitude when speaking
      const ringGradient = ctx.createRadialGradient(
        cx,
        cy,
        radius * 0.6,
        cx,
        cy,
        radius * 1.1
      );
      ringGradient.addColorStop(0, "rgba(35,181,181,0.08)");
      ringGradient.addColorStop(0.8, "rgba(35,181,181,0.25)");
      ringGradient.addColorStop(1, "rgba(35,181,181,0.10)");
      ctx.strokeStyle = ringGradient;
      // Make the ring radius and thickness expand even more dramatically when speaking
      const ringAmplitude = speaking ? 30 + volume * 120 : 2;
      ctx.lineWidth = 3 + (speaking ? volume * 40 : volume * 3);
      ctx.beginPath();
      ctx.arc(cx, cy, radius + ringAmplitude, 0, Math.PI * 2);
      ctx.stroke();

      // Rotate continuously (even slower, constant speed)
      rotationRef.current += 0.0002; // ultra slow, constant rotation
      time += 0.015;

      requestAnimationFrame(draw);
    };

    draw();
  }, [volume]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
      <button
        onClick={onClose}
        className="absolute top-6 right-8 bg-black/60 hover:bg-black/80 text-white rounded-full p-4 shadow-lg transition"
        aria-label="Close Gemini Orb"
        style={{ zIndex: 100 }}
      >
        <svg width="28" height="28" viewBox="0 0 20 20" fill="none">
          <path
            d="M6 6L14 14M14 6L6 14"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div className="flex items-center justify-center w-full h-full">
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            width: "250px",
            height: "250px",
            boxShadow: "0 0 40px 0 #23b5b5",
          }}
        >
          <canvas
            ref={canvasRef}
            width={220}
            height={220}
            className="w-full h-full rounded-full bg-transparent"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 to-transparent blur-2xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default GeminiOrbEffect;
