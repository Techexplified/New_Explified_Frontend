import { useEffect } from "react";
import WorkflowEngine from "../WorkflowEngine";

const MainWorkflowPage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center p-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-minimal-white mb-4">
          Workflows
        </h1>
        <p className="text-minimal-muted text-lg">
          Create, manage, and automate your processes with ease. Workflows help
          you streamline tasks,
          <br /> improve efficiency, and keep your team aligned—every step of
          the way.
        </p>
      </div>
      {/* workflows engine */}
      <WorkflowEngine />
    </div>
  );
};

export default MainWorkflowPage;
