import { useNavigate } from "react-router-dom";

function WorkFlowButtonSidebar({ id }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`w?id=${id}`, { relative: "path" })}
      className="w-full mb-4 bg-black border-2 border-minimal-primary hover:from-minimal-primary/80 hover:to-minimal-primary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 "
    >
      Workflow
    </button>
  );
}

export default WorkFlowButtonSidebar;
