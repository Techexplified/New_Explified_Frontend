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
      className="w-full h-full flex flex-col items-center p-10 relative overflow-hidden bg-black text-white"
      style={{ minHeight: "100vh" }}
    >
      {/* Background gradient overlay with animation */}
      <div
        className="absolute inset-0 rounded-xl opacity-30 pointer-events-none bg-gradient-to-br from-transparent via-cyan-500 to-transparent animate-pulse brightness-75"
        style={{ zIndex: 0 }}
      ></div>

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
