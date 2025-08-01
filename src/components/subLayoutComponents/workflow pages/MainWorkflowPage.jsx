import WorkflowEngine from "../WorkflowEngine";

const MainWorkflowPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center p-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-cyan-400 mb-4">Workflows</h1>
        <p className="text-slate-400 text-lg">
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
