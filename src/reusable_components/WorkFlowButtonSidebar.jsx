import { useNavigate } from "react-router-dom";

function WorkFlowButtonSidebar({ id }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`w?id=${id}`, { relative: "path" })}
      className="w-full bg-gradient-to-r mb-2 from-minimal-primary to-minimal-primary/80 hover:from-minimal-primary/80 hover:to-minimal-primary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-minimal-primary/25"
    >
      Workflow
    </button>
  );
}

export default WorkFlowButtonSidebar;
