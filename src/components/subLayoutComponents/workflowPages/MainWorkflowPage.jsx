import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WorkflowEngine from "../WorkflowEngine";
import SidebarOnHover from "../../../reusable_components/SidebarOnHover";
import { ArrowLeft } from "lucide-react";

const MainWorkflowPage = () => {
  const navigate = useNavigate();

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

      {/* Back Button */}
      <div className="absolute top-6 left-20 z-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 p-4 rounded-full bg-black text-gray-300 hover:text-[#23b5b5] border border-gray-800 hover:border-[#23b5b5]/40 transition-all duration-200 shadow-md"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Page content */}
      <div className="relative z-10 w-full max-w-6xl">
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

        {/* Workflows Engine */}
        <WorkflowEngine />
      </div>
    </div>
  );
};

export default MainWorkflowPage;
