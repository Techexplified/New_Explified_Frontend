import { useNavigate } from "react-router-dom";

function WorkFlowButton({ tool }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/workflows/create${tool}`)}
      className="fixed z-[100] bottom-4 right-4 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-400"
    >
      Workflow
    </button>
  );
}

export default WorkFlowButton;
