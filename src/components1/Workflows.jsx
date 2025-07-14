import React from "react";
import { CirclePlus, Plus, Square } from "lucide-react";
import { useNavigate } from "react-router-dom";

function WorkflowCard({ isCreate = false }) {
  
  if (isCreate) {
    return (
      <div className="w-56 h-52 flex flex-col items-center justify-center space-y-4 transition border border-[#23b5b5] rounded-2xl">
        <button
          type="button"
          className="w-full h-full flex flex-col items-center justify-center space-y-4 border-b border-gray-600"
        >
          <Plus size={56} strokeWidth={1.5} />
        </button>
        <div className="text-sm flex items-center gap-2 p-2">
          <CirclePlus size={18} strokeWidth={1.5} />
          Create New
        </div>
      </div>
    );
  }

  return (
    <div className="w-56 h-48 rounded-3xl border border-gray-600 p-4 flex flex-col justify-between hover:bg-cyan-800/5 transition">
      <div className="flex items-center justify-center space-x-2 border-b border-gray-600 h-32">
        <Square size={22} className="fill-white stroke-0" />
        <Square size={22} className="fill-white stroke-0" />
        <Square size={22} className="fill-white stroke-0" />
      </div>
      <div className="text-sm text-cyan-300 mt-2 text-center">Receive Automatic Updates To Google Sheets with ChatGpt Insights</div>
    </div>
  );
}

function WorkflowCardUnfinished({ isCreate = false }) {
  if (isCreate) return <WorkflowCard isCreate />;

  return (
    <div className="w-56 h-48 rounded-3xl border border-gray-600 p-4 flex flex-col justify-between hover:bg-cyan-800/5 transition">
      <div className="flex flex-col items-center justify-center space-x-2 border-b border-gray-600 h-32">
        <div className="flex items-center justify-center space-x-2">
          <Square size={22} className="fill-white stroke-0" />
          <Square size={22} className="fill-white stroke-0" />
          <Square size={22} className="fill-white stroke-0" />
        </div>
        <div className="text-sm text-red-300 mt-2 text-center">Authentication Pending</div>
      </div>
      <div className="text-sm text-cyan-300 mt-2 text-center">Save New Gmail Attachment to Google Drive</div>
    </div>
  );
}

function WorkflowSection({ title, children }) {
  return (
    <section className="border border-cyan-400/40 rounded-2xl p-6 space-y-4">
      <h2 className="text-lg font-semibold pb-2 border-b border-gray-600">{title}</h2>
      {children}
    </section>
  );
}

export default function WorkflowDashboard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black text-white p-8 space-y-12">
      {/* Create-new + Most Popular */}
      <div className="flex gap-8 flex-wrap">
        <div className="border border-[#23b5b5]/60 p-4 rounded-2xl flex flex-col justify-between w-60 h-52" onClick={() => navigate("/workflows/new")}>
          <div className="flex-1 flex justify-center items-center">
            <Plus size={56} />
          </div>
          <div className="flex gap-2 h-12 pt-3 border-t border-gray-600 items-center justify-center">
            <CirclePlus size={18} />
            Create New
          </div>
        </div>

        <div className="flex-1 min-w-[18rem]">
          <WorkflowSection title="Most Popular Workflows">
            <div className="flex flex-wrap justify-around gap-2">
              <WorkflowCard />
              <WorkflowCard />
              <WorkflowCard />
            </div>
          </WorkflowSection>
        </div>
      </div>

      {/* Recommended */}
      <WorkflowSection title="Recommended For You">
        <div className="flex flex-wrap justify-around gap-4">
          <WorkflowCard />
          <WorkflowCard />
          <WorkflowCard />
          <WorkflowCard />
          <WorkflowCard />
          
        </div>
      </WorkflowSection>

      {/* Unfinished & Existing */}
      <div className="flex gap-10 flex-wrap">
        <div className="flex-1 min-w-[18rem]">
          <WorkflowSection title="Unfinished Workflows">
            <div className="flex flex-wrap justify-around gap-2">
              <WorkflowCardUnfinished />
              <WorkflowCardUnfinished />
              <WorkflowCardUnfinished />
            </div>
          </WorkflowSection>
        </div>

        <div className="flex-1 min-w-[18rem]">
          <WorkflowSection title="Existing Workflows">
            <div className="flex flex-wrap justify-around gap-2">
              <WorkflowCard />
              <WorkflowCard />
              <WorkflowCard />
            </div>
          </WorkflowSection>
        </div>
      </div>
    </div>
  );
}
