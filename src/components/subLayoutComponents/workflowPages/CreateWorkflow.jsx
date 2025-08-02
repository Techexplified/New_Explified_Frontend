import React from "react";
import Toolbar from "../../../zapierComponents/Toolbar";
const CreateWorkflow = () => {
  const dotGrid = {
    backgroundImage: "radial-gradient(#ffffff 1.2px, transparent 1.2px)",
    backgroundSize: "48px 48px",
  };

  return (
    <div
      className="relative min-h-screen pt-10 text-white overflow-x-hidden"
      style={dotGrid}
    >
      <Toolbar />
    </div>
  );
};

export default CreateWorkflow;
