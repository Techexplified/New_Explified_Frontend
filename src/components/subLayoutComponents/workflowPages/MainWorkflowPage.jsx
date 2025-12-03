import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WorkflowEngine from "../WorkflowEngine";
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
      {/* Back Button */}
      <div className="absolute top-6 left-20 z-20">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 p-4 rounded-full bg-black text-gray-300 hover:text-[#23b5b5] border border-gray-800 hover:border-[#23b5b5]/40 transition-all duration-200 shadow-md"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Page content */}
      <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-0">
          <h1 className="text-5xl font-bold bg-minimal-primary bg-clip-text text-transparent mb-2 pb-2">
            Workflows
          </h1>
          <p className="text-gray-400 text-lg">
            Create, manage, and automate your processes with ease. Workflows
            help you streamline tasks, improve efficiency, and keep your team
            aligned—every step of the way.
          </p>
        </div>

        {/* Workflows Engine */}
        <WorkflowEngine />
      </div>
    </div>
  );
};

export default MainWorkflowPage;
