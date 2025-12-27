import React from "react";
import Toolbar from "../../../zapierComponents/Toolbar";

const CreateWorkflow = () => {
  // const dotGrid = {
  //   backgroundImage:
  //     "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)", // teal dots
  //   backgroundSize: "24px 24px", // spacious grid
  //   backgroundColor: "#000000", // black base
  // };
  const dotGrid = {
    backgroundColor: "#121212", // example dark bg
    backgroundImage: "radial-gradient(#6b7280  1px, transparent 1px)",
    backgroundSize: "28px 28px",
  };

  return (
    <div
      className="relative min-h-screen  text-white overflow-x-hidden"
      style={dotGrid}
    >
      <Toolbar />
    </div>
  );
};

export default CreateWorkflow;
