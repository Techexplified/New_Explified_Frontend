import { useEffect } from "react";
import WorkflowEngine from "../WorkflowEngine";
<<<<<<< HEAD
=======
import { Link } from "react-router-dom";
import { Pin, PinOff } from "lucide-react";
import SidebarOnHover from "../../../reusable_components/SidebarOnHover";
>>>>>>> fb4b60570db27d0b4c4841adb8c28c93450d8346

const MainWorkflowPage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center p-10">
<<<<<<< HEAD
=======
      <SidebarOnHover
        link={"https://explified.com/8x-workflows/"}
        toolName={"Workflows"}
      />

>>>>>>> fb4b60570db27d0b4c4841adb8c28c93450d8346
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
