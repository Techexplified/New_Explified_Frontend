import { useEffect } from "react";
import WorkflowEngine from "../WorkflowEngine";
import SidebarOnHover from "../../../reusable_components/SidebarOnHover";
import { Link } from "react-router-dom";

const MainWorkflowPage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div
      className="w-full h-full flex flex-col items-center p-10 relative overflow-hidden text-white"
      style={{ 
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0f12 0%, #0d1418 25%, #111c20 50%, #0d1418 75%, #0a0f12 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 3s ease-in-out infinite"
      }}
    >
      {/* Enhanced animated background overlays */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{ zIndex: 0 }}
      >
        {/* Multiple moving gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#23b5b5]/20 via-transparent to-[#23b5b5]/10 animate-pulse"></div>
        <div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,_rgba(35,181,181,0.15)_0%,_transparent_50%)]"
          style={{
            animation: "float1 2.5s ease-in-out infinite"
          }}
        ></div>
        <div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,_rgba(35,181,181,0.12)_0%,_transparent_50%)]"
          style={{
            animation: "float2 3s ease-in-out infinite reverse"
          }}
        ></div>
        <div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,_rgba(35,181,181,0.08)_0%,_transparent_60%)]"
          style={{
            animation: "float3 3.5s ease-in-out infinite"
          }}
        ></div>
      </div>

      {/* Subtle moving particles */}
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ zIndex: 1 }}>
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#23b5b5] rounded-full animate-ping" style={{animationDelay: '0s', animationDuration: '1.5s'}}></div>
        <div className="absolute top-3/4 right-1/3 w-0.5 h-0.5 bg-[#23b5b5] rounded-full animate-ping" style={{animationDelay: '0.5s', animationDuration: '2s'}}></div>
        <div className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-[#23b5b5] rounded-full animate-ping" style={{animationDelay: '1s', animationDuration: '1.8s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-[#23b5b5] rounded-full animate-ping" style={{animationDelay: '0.3s', animationDuration: '2.2s'}}></div>
        <div className="absolute top-1/6 right-1/6 w-0.5 h-0.5 bg-[#23b5b5] rounded-full animate-ping" style={{animationDelay: '0.8s', animationDuration: '1.6s'}}></div>
      </div>

      {/* CSS Keyframes for custom animations */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10px, -15px) scale(1.1); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-15px, 10px) scale(0.9); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5px, -20px) scale(1.05); }
        }
      `}</style>

      {/* Page content - placed above background */}
      <div className="relative z-10 w-full max-w-6xl">
        <SidebarOnHover
          link={"https://explified.com/8x-workflows/"}
          toolName={"Workflows"}
        />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-minimal-white mb-4">
            Workflows
          </h1>
          <p className="text-minimal-muted text-lg">
            Create, manage, and automate your processes with ease. Workflows
            help you streamline tasks,
            <br /> improve efficiency, and keep your team aligned—every step of
            the way.
          </p>
        </div>

        {/* workflows engine */}
        <WorkflowEngine />
      </div>
    </div>
  );
};

export default MainWorkflowPage;
