import { useState } from "react";
import ExpliIntegration from "../expli/ExpliIntegration";
import ExpliSidebar from "../expli/ExpliSidebar";
import { Outlet } from "react-router-dom";

function Trone() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  return (
    <div className="flex relative text-white h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Animated Background with Multiple Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] animate-float-slower" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[100px] animate-pulse-slow" />

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Animated Scanline Effect */}
        <div
          className="absolute inset-0 opacity-[0.02] animate-scan"
          style={{
            background:
              "linear-gradient(transparent 50%, rgba(6, 182, 212, 0.1) 50%)",
            backgroundSize: "100% 4px",
          }}
        />
      </div>

      {/* <ExpliSidebar link={"https://explified.com/expli/"} /> */}

      <button
        className="lg:hidden absolute top-4 left-4 z-10 bg-black/70 text-white p-2 rounded-md"
        onClick={() => setIsMobileOpen(true)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <ExpliSidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        link={"https://explified.com/expli/"}
      />

      {/* <Outlet /> */}
      <Outlet />

      {/* <ExpliIntegration /> */}
      {/* Advanced Animation Styles */}
      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-30px, 30px) scale(0.95);
          }
        }

        @keyframes float-slower {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-40px, 40px) scale(1.1);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-float-slower {
          animation: float-slower 25s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 15s ease-in-out infinite;
        }

        .animate-scan {
          animation: scan 8s linear infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        /* Glassmorphism Enhancement */
        .backdrop-blur-xl {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(
            180deg,
            rgba(6, 182, 212, 0.5),
            rgba(59, 130, 246, 0.5)
          );
          border-radius: 10px;
          border: 2px solid transparent;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            180deg,
            rgba(6, 182, 212, 0.8),
            rgba(59, 130, 246, 0.8)
          );
        }
      `}</style>
    </div>
  );
}

export default Trone;
