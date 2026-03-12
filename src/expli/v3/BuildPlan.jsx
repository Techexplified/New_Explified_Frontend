import React, { useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import ReactMarkdown from "react-markdown";
import {
  Target,
  Milestone,
  ListChecks,
  CheckSquare,
  Pencil,
  MoreHorizontal,
  ArrowUp,
  Sparkles,
  Download,
  FileSpreadsheet,
  Check,
  ChevronRight,
  Clock,
  Flag,
} from "lucide-react";

// ====== PLAN RIGHT SIDEBAR ======
function BuildPlanSidebar({ planData, onExportPDF, onExportCSV }) {
  const completedTasks = planData?.checklist?.filter((c) => c.done).length || 0;
  const totalTasks = planData?.checklist?.length || 0;
  const totalMilestones = planData?.milestones?.length || 0;

  return (
    <div className="expli-v3-plan-sidebar">
      {/* Export Plan */}
      <div>
        <div className="expli-v3-plan-sidebar__section-title">Export Plan</div>
        <div className="flex flex-col gap-2">
          <button
            className="expli-v3-plan-sidebar__export-btn"
            onClick={onExportPDF}
            disabled={!planData}
            style={!planData ? { opacity: 0.4, cursor: "not-allowed" } : {}}
          >
            <Download
              size={16}
              className="expli-v3-plan-sidebar__export-icon"
            />
            Download PDF
          </button>
          <button
            className="expli-v3-plan-sidebar__export-btn"
            onClick={onExportCSV}
            disabled={!planData}
            style={!planData ? { opacity: 0.4, cursor: "not-allowed" } : {}}
          >
            <FileSpreadsheet
              size={16}
              className="expli-v3-plan-sidebar__export-icon"
            />
            Export CSV
          </button>
        </div>
      </div>

      {/* Plan Overview */}
      {planData && (
        <div>
          <div className="expli-v3-plan-sidebar__section-title">
            Plan Overview
          </div>
          <div className="expli-v3-plan-sidebar__overview">
            <div className="expli-v3-plan-sidebar__overview-row">
              <span className="expli-v3-plan-sidebar__overview-label">
                Total Tasks
              </span>
              <span className="expli-v3-plan-sidebar__overview-value">
                {totalTasks}
              </span>
            </div>
            <div className="expli-v3-plan-sidebar__overview-row">
              <span className="expli-v3-plan-sidebar__overview-label">
                Milestones
              </span>
              <span className="expli-v3-plan-sidebar__overview-value">
                {totalMilestones}
              </span>
            </div>
            <div className="expli-v3-plan-sidebar__overview-row">
              <span className="expli-v3-plan-sidebar__overview-label">
                Duration
              </span>
              <span className="expli-v3-plan-sidebar__overview-value">
                {planData.duration || "42 days"}
              </span>
            </div>
            <div className="expli-v3-plan-sidebar__overview-row">
              <span className="expli-v3-plan-sidebar__overview-label">
                Completion
              </span>
              <span className="expli-v3-plan-sidebar__overview-value expli-v3-plan-sidebar__overview-value--teal">
                {totalTasks > 0
                  ? Math.round((completedTasks / totalTasks) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ====== DURATION OPTIONS ======
const DURATION_OPTIONS = [
  {
    id: "quick",
    name: "Quick Plan",
    time: "1-7 days",
    desc: "Fast action outline",
  },
  {
    id: "standard",
    name: "Standard Plan",
    time: "2-4 weeks",
    desc: "Structured execution",
  },
  {
    id: "strategic",
    name: "Strategic Plan",
    time: "1-3 months",
    desc: "Detailed roadmap",
  },
];

// ====== RICH TEXT RENDERER ======
function RichText({ text }) {
  if (!text) return null;
  return (
    <div className="expli-v3-markdown">
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => <p className="mb-1.5" {...props} />,
          strong: ({ node, ...props }) => (
            <strong className="text-gray-200 font-bold" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="text-gray-300" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code
              className="bg-[#23b5b5]/10 text-[#23b5b5] px-1.5 py-0.5 rounded text-[0.9em]"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc ml-5 mb-1.5" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="mb-1 text-inherit" {...props} />
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

// ====== MAIN BUILD PLAN PAGE ======
export default function BuildPlan() {
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("standard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [planData, setPlanData] = useState(null);
  const [refinementInput, setRefinementInput] = useState("");
  const resultRef = useRef(null);

  const scrollToResult = () => {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  // ====== CLEAN TEXT HELPER ======
  const cleanText = (str) => {
    if (!str) return "";
    return str
      .replace(/\*\*/g, "") // remove bold markers
      .replace(/\*/g, "") // remove italic markers
      .replace(/`/g, "") // remove code markers
      .replace(/^[-•*]\s+/gm, "") // remove bullet markers
      .replace(/^#+\s+/gm, "") // remove heading markers
      .trim();
  };

  const parsePlanResponse = (text) => {
    const plan = {
      objective: "",
      objectiveTags: [],
      milestones: [],
      taskGroups: [],
      checklist: [],
      duration: "",
    };

    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    let currentSection = "";
    let currentMilestone = null;
    let currentTaskGroup = null;

    for (const line of lines) {
      const lower = line.toLowerCase();

      if (
        lower.includes("objective") &&
        (lower.startsWith("#") || lower.startsWith("**"))
      ) {
        currentSection = "objective";
        continue;
      }
      if (
        lower.includes("milestone") &&
        (lower.startsWith("#") || lower.startsWith("**"))
      ) {
        currentSection = "milestones";
        continue;
      }
      if (
        (lower.includes("task") || lower.includes("breakdown")) &&
        (lower.startsWith("#") || lower.startsWith("**"))
      ) {
        currentSection = "tasks";
        continue;
      }
      if (
        (lower.includes("checklist") || lower.includes("action")) &&
        (lower.startsWith("#") || lower.startsWith("**"))
      ) {
        currentSection = "checklist";
        continue;
      }

      if (currentSection === "objective") {
        const cl = cleanText(line);
        if (cl.length > 10) plan.objective += (plan.objective ? " " : "") + cl;
        const tagMatch = cl.match(
          /(\d+\s*(?:weeks?|months?|days?))|(?:high\s*priority)|(?:product\s*launch)|(?:mvp)/gi,
        );
        if (tagMatch) plan.objectiveTags.push(...tagMatch.map((t) => t.trim()));
      }

      if (currentSection === "milestones") {
        const milestoneMatch = line.match(
          /^(?:[-•*]|\d+\.)\s*\*?\*?(Week\s*\d+[-–]\d+|Phase\s*\d+|Milestone\s*\d+)[:\s]*(.+?)\*?\*?\s*$/i,
        );
        if (milestoneMatch) {
          currentMilestone = {
            title: cleanText(`${milestoneMatch[1]}: ${milestoneMatch[2]}`),
            desc: "",
            status: plan.milestones.length === 0 ? "In Progress" : "Upcoming",
            days: "",
          };
          plan.milestones.push(currentMilestone);
        } else if (currentMilestone && line.match(/^[-•*]\s*/)) {
          const desc = cleanText(line.replace(/^[-•*]\s*/, ""));
          currentMilestone.desc += (currentMilestone.desc ? ", " : "") + desc;
        } else if (line.match(/^(?:[-•*]|\d+\.)\s*.+/)) {
          const cl = cleanText(line.replace(/^(?:[-•*]|\d+\.)\s*/, ""));
          plan.milestones.push({
            title: cl,
            desc: "",
            status: plan.milestones.length === 0 ? "In Progress" : "Upcoming",
            days: "",
          });
        }
      }

      if (currentSection === "tasks") {
        const groupMatch = line.match(/^(?:\*\*|#{1,3}\s*)(.+?)(?:\*\*|$)/);
        if (groupMatch && !line.match(/^[-•*]/)) {
          currentTaskGroup = { title: cleanText(groupMatch[1]), tasks: [] };
          plan.taskGroups.push(currentTaskGroup);
        } else if (line.match(/^[-•*]\s*/)) {
          const task = cleanText(line.replace(/^[-•*]\s*/, ""));
          if (currentTaskGroup) {
            currentTaskGroup.tasks.push(task);
          } else {
            if (plan.taskGroups.length === 0)
              plan.taskGroups.push({ title: "Tasks", tasks: [] });
            plan.taskGroups[plan.taskGroups.length - 1].tasks.push(task);
          }
        }
      }

      if (currentSection === "checklist") {
        if (line.match(/^[-•*]\s*/) || line.match(/^\d+\.\s*/)) {
          const item = cleanText(
            line
              .replace(/^[-•*]\s*/, "")
              .replace(/^\d+\.\s*/, "")
              .replace(/^\[.\]\s*/, ""),
          );
          if (item.length > 3) plan.checklist.push({ text: item, done: false });
        }
      }
    }

    plan.milestones.forEach((m, i) => {
      if (!m.days) {
        const daysPerMilestone = Math.ceil(
          42 / Math.max(plan.milestones.length, 1),
        );
        m.days = `Days ${i * daysPerMilestone + 1}-${(i + 1) * daysPerMilestone}`;
      }
    });

    if (plan.objectiveTags.length === 0) {
      const d = DURATION_OPTIONS.find((d) => d.id === duration);
      plan.objectiveTags = [
        d?.time || "2-4 weeks",
        "Product Launch",
        "High Priority",
      ];
    }

    plan.duration =
      duration === "quick"
        ? "7 days"
        : duration === "standard"
          ? "42 days"
          : "90 days";
    const doneCount = Math.max(1, Math.floor(plan.checklist.length * 0.25));
    for (let i = 0; i < doneCount && i < plan.checklist.length; i++)
      plan.checklist[i].done = true;

    return plan;
  };

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setIsGenerating(true);
    setPlanData(null);

    try {
      const apiKey =
        import.meta.env.VITE_TRONE_GEMINI_API_KEY ||
        import.meta.env.VITE_GEMINI_API_KEY;
      const durationLabel = DURATION_OPTIONS.find((d) => d.id === duration);
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const prompt = `You are a professional project planner. Create a detailed, structured action plan for the following goal:\n\nGoal: "${goal.trim()}"\nDuration: ${durationLabel?.name} (${durationLabel?.time})\n\nPlease provide the plan in this EXACT format:\n\n## Objective\nWrite a clear 1-2 sentence objective statement.\n\n## Milestones\n- Week 1-2: Research & Planning\n  - Define scope and requirements\n- Week 3-4: Development Sprint\n  - Build core features\n- Week 5-6: Testing & Launch\n  - QA and deployment\n\n## Task Breakdown\n**Research Phase**\n- Market research & competitor analysis\n- User persona development\n- Feature prioritization matrix\n\n**Development**\n- Set up development environment\n- Build authentication system\n- Implement core features\n\n## Execution Checklist\n- Define core product features and MVP scope\n- Create user personas and journey maps\n- Select technology stack and tools\n- Design wireframes and user flows\n- Set up development environment\n- Build authentication and user management\n- Implement core functionality\n- Create API integrations\n- Write unit and integration tests\n- Conduct user acceptance testing\n- Prepare launch materials\n- Deploy to production\n\nMake sure each section has clear, actionable items. For milestones, use "Week X-Y: Title" format. Include at least 3 milestones, 2 task groups, and 10+ checklist items.`;

      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 3000,
        },
      };

      const res = await axios.post(apiUrl, payload, {
        timeout: 45000,
        headers: { "Content-Type": "application/json" },
      });
      const responseText =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const parsed = parsePlanResponse(responseText);
      setPlanData(parsed);
      scrollToResult();
    } catch (err) {
      console.error("Plan generation error:", err);
      setPlanData({
        objective: `Launch a structured execution plan for "${goal.trim()}" with clear milestones and measurable outcomes.`,
        objectiveTags: [
          DURATION_OPTIONS.find((d) => d.id === duration)?.time || "2-4 weeks",
          "Product Launch",
          "High Priority",
        ],
        milestones: [
          {
            title: "Week 1-2: Research & Planning",
            desc: "Define product scope and technical requirements",
            status: "In Progress",
            days: "Days 1-14",
          },
          {
            title: "Week 3-4: Development Sprint",
            desc: "Build core features and user interface",
            status: "Upcoming",
            days: "Days 15-28",
          },
          {
            title: "Week 5-6: Testing & Launch",
            desc: "QA testing, bug fixes, and public launch",
            status: "Upcoming",
            days: "Days 29-42",
          },
        ],
        taskGroups: [
          {
            title: "Research Phase",
            tasks: [
              "Market research & competitor analysis",
              "User persona development",
              "Feature prioritization matrix",
            ],
          },
          {
            title: "Development",
            tasks: [
              "Set up development environment",
              "Build authentication system",
            ],
          },
        ],
        checklist: [
          { text: "Define core product features and MVP scope", done: true },
          { text: "Create user personas and journey maps", done: true },
          { text: "Select technology stack and tools", done: true },
          { text: "Design wireframes and user flows", done: false },
          { text: "Set up development environment", done: false },
          { text: "Build authentication and user management", done: false },
          { text: "Implement core functionality", done: false },
          { text: "Create API integrations", done: false },
          { text: "Write unit tests", done: false },
          { text: "Conduct user acceptance testing", done: false },
          { text: "Prepare launch materials", done: false },
          { text: "Deploy to production", done: false },
        ],
        duration:
          duration === "quick"
            ? "7 days"
            : duration === "standard"
              ? "42 days"
              : "90 days",
      });
      scrollToResult();
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleChecklistItem = (idx) => {
    setPlanData((prev) => {
      if (!prev) return prev;
      const newChecklist = [...prev.checklist];
      newChecklist[idx] = {
        ...newChecklist[idx],
        done: !newChecklist[idx].done,
      };
      return { ...prev, checklist: newChecklist };
    });
  };

  // ====== EXPORT PDF ======
  const handleExportPDF = () => {
    if (!planData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 0;

    // Colors
    const teal = [35, 181, 181];
    const darkGray = [40, 40, 40];
    const lightGray = [100, 100, 100];
    const borderGray = [220, 220, 220];

    const checkPage = (needed) => {
      if (y + needed > pageHeight - 25) {
        doc.addPage();
        y = 20;
        return true;
      }
      return false;
    };

    const drawSectionHeader = (title) => {
      checkPage(15);
      y += 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...teal);
      doc.text(title.toUpperCase(), 20, y);
      y += 2;
      doc.setDrawColor(...teal);
      doc.setLineWidth(0.5);
      doc.line(20, y, 40, y);
      y += 8;
    };

    // Header Background
    doc.setFillColor(248, 252, 252);
    doc.rect(0, 0, pageWidth, 50, "F");
    doc.setDrawColor(...teal);
    doc.setLineWidth(1);
    doc.line(0, 50, pageWidth, 50);

    // Title
    y = 25;
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...teal);
    doc.text("Action Plan", 20, y);

    // Subtitle Info
    y = 35;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...lightGray);
    doc.text("Generated by Expli • Professional Roadmap", 20, y);

    y = 65;
    // Goal Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    const goalLines = doc.splitTextToSize(`Project: ${goal}`, pageWidth - 40);
    doc.text(goalLines, 20, y);
    y += goalLines.length * 7 + 2;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...lightGray);
    doc.text(
      `Duration: ${planData.duration} • ${planData.milestones.length} Milestones`,
      20,
      y,
    );
    y += 15;

    // Objective
    drawSectionHeader("Objective");
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkGray);
    const objLines = doc.splitTextToSize(planData.objective, pageWidth - 40);
    doc.text(objLines, 20, y);
    y += objLines.length * 6 + 10;

    // Milestones
    drawSectionHeader("Strategic Milestones");
    planData.milestones.forEach((m, idx) => {
      checkPage(25);

      // Milestone Box
      doc.setDrawColor(...borderGray);
      doc.setLineWidth(0.2);
      doc.line(20, y - 5, pageWidth - 20, y - 5);

      y += 5;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...darkGray);
      doc.text(`${m.title}`, 25, y);

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...teal);
      const statusWidth = doc.getTextWidth(m.status);
      doc.text(m.status, pageWidth - 25 - statusWidth, y);

      y += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...lightGray);
      const mDescLines = doc.splitTextToSize(
        m.desc || "Planned objectives for this phase.",
        pageWidth - 55,
      );
      doc.text(mDescLines, 25, y);

      y += mDescLines.length * 5 + 4;
      doc.setFontSize(9);
      doc.setTextColor(...lightGray);
      doc.text(m.days, 25, y);
      y += 10;
    });

    // Tasks
    if (planData.taskGroups.length > 0) {
      drawSectionHeader("Execution Breakdown");
      planData.taskGroups.forEach((group) => {
        checkPage(20);
        y += 5;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...darkGray);
        doc.text(group.title, 20, y);
        y += 7;

        group.tasks.forEach((task) => {
          checkPage(10);
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...darkGray);
          // Bullet
          doc.setDrawColor(...teal);
          doc.setLineWidth(0.5);
          doc.circle(23, y - 1, 0.5, "S");

          const taskLines = doc.splitTextToSize(task, pageWidth - 50);
          doc.text(taskLines, 28, y);
          y += taskLines.length * 6;
        });
        y += 5;
      });
    }

    // Checklist
    drawSectionHeader("Final Checklist");
    doc.setFontSize(9);
    doc.setTextColor(...lightGray);
    const comp = planData.checklist.filter((c) => c.done).length;
    doc.text(`${comp} of ${planData.checklist.length} tasks completed`, 20, y);
    y += 10;

    planData.checklist.forEach((item) => {
      const lines = doc.splitTextToSize(item.text, pageWidth - 55);
      const needed = lines.length * 6 + 4;
      checkPage(needed);

      // Draw Checkbox
      doc.setDrawColor(...borderGray);
      doc.setLineWidth(0.3);
      doc.rect(20, y - 3.5, 4, 4);
      if (item.done) {
        doc.setDrawColor(...teal);
        doc.setLineWidth(0.5);
        doc.line(20.5, y - 1.5, 22, y - 0.5);
        doc.line(22, y - 0.5, 23.5, y - 3);
      }

      doc.setFontSize(10);
      doc.setFont("helvetica", item.done ? "italic" : "normal");
      doc.setTextColor(...(item.done ? lightGray : darkGray));
      doc.text(lines, 28, y);
      y += needed;
    });

    // Footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(180, 180, 180);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, {
        align: "center",
      });
      doc.text("EXPLI | Smart Action Blueprint", 20, pageHeight - 10);
      doc.text(
        new Date().toLocaleDateString(),
        pageWidth - 40,
        pageHeight - 10,
      );
    }

    doc.save(
      `plan-${goal.trim().toLowerCase().replace(/\s+/g, "-").slice(0, 30)}.pdf`,
    );
  };

  // ====== EXPORT CSV ======
  const handleExportCSV = () => {
    if (!planData) return;

    const rows = [];
    rows.push(["Section", "Item", "Details", "Status"]);

    // Objective
    rows.push([
      "Objective",
      planData.objective,
      planData.objectiveTags.join(", "),
      "",
    ]);

    // Milestones
    planData.milestones.forEach((m) => {
      rows.push(["Milestone", m.title, m.desc, `${m.status} - ${m.days}`]);
    });

    // Tasks
    planData.taskGroups.forEach((group) => {
      group.tasks.forEach((task) => {
        rows.push(["Task", task, group.title, ""]);
      });
    });

    // Checklist
    planData.checklist.forEach((item) => {
      rows.push(["Checklist", item.text, "", item.done ? "Done" : "Pending"]);
    });

    // Escape CSV values
    const escapeCsv = (val) => {
      const str = String(val || "");
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = rows
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `plan-${goal.trim().toLowerCase().replace(/\s+/g, "-").slice(0, 30)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const completedCount = planData?.checklist?.filter((c) => c.done).length || 0;
  const totalCount = planData?.checklist?.length || 0;

  return (
    <div className="expli-v3-plan flex flex-1 overflow-hidden relative z-10">
      {/* Background orbs */}
      <div className="expli-v3-main__bg">
        <div className="expli-v3-main__bg-orb-1" />
        <div className="expli-v3-main__bg-orb-2" />
      </div>
      <div className="expli-v3-plan__main flex-1 overflow-y-auto relative z-1">
        {/* Header */}
        <div className="px-8 pt-6">
          <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-1">
            <span className="text-gray-400 cursor-pointer">Plans</span>
            <ChevronRight size={14} />
            <span className="text-gray-200 font-medium">
              Action Plan Builder
            </span>
          </div>
          <p className="text-[13px] text-gray-500 mt-2">
            Create a structured action plan for any goal—from projects to
            learning paths
          </p>
        </div>

        {/* Goal Input */}
        <div className="px-8 py-6">
          <label className="text-sm font-medium text-gray-400 mb-2.5 block">
            What do you want to accomplish?
          </label>
          <input
            type="text"
            placeholder="Launch a SaaS product MVP in 6 weeks"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGenerate();
            }}
            className="w-full px-[18px] py-3.5 rounded-xl border border-white/5 bg-[#16161f] text-gray-200 text-[15px] font-inherit outline-none box-border transition-all duration-200 focus:border-[#23b5b5]/30 focus:shadow-[0_0_0_3px_rgba(35,181,181,0.08)]"
          />
        </div>

        {/* Duration Selector */}
        <div className="px-8 pb-6">
          <div className="text-sm font-medium text-gray-400 mb-3">
            Plan Duration
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {DURATION_OPTIONS.map((opt) => (
              <div
                key={opt.id}
                onClick={() => setDuration(opt.id)}
                className={`p-4 rounded-xl text-center cursor-pointer transition-all duration-250 border ${
                  duration === opt.id
                    ? "border-[#23b5b5] bg-[#23b5b5]/15"
                    : "border-white/5 bg-[#16161f]"
                }`}
              >
                <div
                  className={`text-sm font-semibold mb-1 ${duration === opt.id ? "text-[#23b5b5]" : "text-gray-200"}`}
                >
                  {opt.name}
                </div>
                <div className="text-xs text-[#23b5b5] font-medium mb-0.5">
                  {opt.time}
                </div>
                <div className="text-[11px] text-gray-500">{opt.desc}</div>
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={!goal.trim() || isGenerating}
            className={`flex items-center gap-2 px-7 py-3 rounded-xl border-none bg-gradient-to-br from-[#23b5b5] to-[#1a9494] text-black text-sm font-bold font-inherit mx-auto transition-all duration-250 shadow-[0_4px_20px_rgba(35,181,181,0.25)] ${
              !goal.trim() || isGenerating
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:shadow-[0_6px_25px_rgba(35,181,181,0.35)]"
            }`}
          >
            <Sparkles size={16} />
            {isGenerating ? "Generating Plan..." : "Generate Plan"}
          </button>
        </div>

        {/* Loading */}
        {isGenerating && (
          <div className="px-8 py-6 flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="expli-v3-skeleton h-20 rounded-[14px]" />
            ))}
          </div>
        )}

        {/* Generated Plan Result */}
        {planData && !isGenerating && (
          <div
            ref={resultRef}
            style={{
              padding: "24px 32px 100px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Objective */}
            <div className="expli-v3-plan__section">
              <div className="expli-v3-plan__section-header">
                <div className="expli-v3-plan__section-title-row">
                  <div className="expli-v3-plan__section-icon">
                    <Target size={18} />
                  </div>
                  <span className="expli-v3-plan__section-title">
                    Objective
                  </span>
                </div>
                <div className="expli-v3-plan__section-actions">
                  <button className="expli-v3-plan__section-action">
                    <Pencil size={14} />
                  </button>
                  <button className="expli-v3-plan__section-action">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
              <div className="expli-v3-plan__section-body">
                <div className="expli-v3-plan__objective-text">
                  <RichText text={planData.objective} />
                </div>
                <div className="expli-v3-plan__objective-tags">
                  {planData.objectiveTags.map((tag, i) => (
                    <span key={i} className="expli-v3-plan__objective-tag">
                      <span className="expli-v3-plan__objective-tag-icon">
                        {i === 0 ? (
                          <Clock size={12} />
                        ) : i === 1 ? (
                          <Flag size={12} />
                        ) : (
                          "🔥"
                        )}
                      </span>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="expli-v3-plan__section">
              <div className="expli-v3-plan__section-header">
                <div className="expli-v3-plan__section-title-row">
                  <div className="expli-v3-plan__section-icon">
                    <Milestone size={18} />
                  </div>
                  <span className="expli-v3-plan__section-title">
                    Milestones
                  </span>
                </div>
                <div className="expli-v3-plan__section-actions">
                  <button className="expli-v3-plan__section-action">
                    <Pencil size={14} />
                  </button>
                  <button className="expli-v3-plan__section-action">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
              <div className="expli-v3-plan__section-body">
                {planData.milestones.map((milestone, i) => (
                  <div key={i} className="expli-v3-plan__milestone">
                    <div
                      className={`expli-v3-plan__milestone-dot ${
                        milestone.status === "In Progress"
                          ? "expli-v3-plan__milestone-dot--active"
                          : "expli-v3-plan__milestone-dot--upcoming"
                      }`}
                    />
                    <div className="expli-v3-plan__milestone-info">
                      <div className="expli-v3-plan__milestone-title">
                        {milestone.title}
                      </div>
                      <div className="expli-v3-plan__milestone-desc">
                        {milestone.desc}
                      </div>
                      <span
                        className={`expli-v3-plan__milestone-badge ${
                          milestone.status === "In Progress"
                            ? "expli-v3-plan__milestone-badge--progress"
                            : "expli-v3-plan__milestone-badge--upcoming"
                        }`}
                      >
                        • {milestone.status}
                      </span>
                    </div>
                    <span className="expli-v3-plan__milestone-days">
                      {milestone.days}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Breakdown */}
            {planData.taskGroups.length > 0 && (
              <div className="expli-v3-plan__section">
                <div className="expli-v3-plan__section-header">
                  <div className="expli-v3-plan__section-title-row">
                    <div className="expli-v3-plan__section-icon">
                      <ListChecks size={18} />
                    </div>
                    <span className="expli-v3-plan__section-title">
                      Task Breakdown
                    </span>
                  </div>
                  <div className="expli-v3-plan__section-actions">
                    <button className="expli-v3-plan__section-action">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>
                <div className="expli-v3-plan__section-body">
                  {planData.taskGroups.map((group, gi) => (
                    <div key={gi} className="expli-v3-plan__task-group">
                      <div
                        className={`expli-v3-plan__task-group-title ${
                          gi === 0
                            ? "expli-v3-plan__task-group-title--research"
                            : "expli-v3-plan__task-group-title--dev"
                        }`}
                      >
                        {group.title}
                      </div>
                      {group.tasks.map((task, ti) => (
                        <div key={ti} className="expli-v3-plan__task-item">
                          <div className="expli-v3-plan__task-checkbox" />
                          {task}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Execution Checklist */}
            <div className="expli-v3-plan__section">
              <div className="expli-v3-plan__section-header">
                <div className="expli-v3-plan__section-title-row">
                  <div className="expli-v3-plan__section-icon">
                    <CheckSquare size={18} />
                  </div>
                  <span className="expli-v3-plan__section-title">
                    Execution Checklist
                  </span>
                  <span className="text-[11px] text-gray-500 font-normal">
                    Auto-generated actionable steps
                  </span>
                </div>
                <div className="expli-v3-plan__checklist-progress">
                  <div className="expli-v3-plan__checklist-bar">
                    <div
                      className="expli-v3-plan__checklist-bar-fill"
                      style={{
                        width:
                          totalCount > 0
                            ? `${(completedCount / totalCount) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                  <span className="expli-v3-plan__checklist-count">
                    {completedCount}/{totalCount}
                  </span>
                </div>
              </div>
              <div className="expli-v3-plan__section-body">
                {planData.checklist.map((item, i) => (
                  <div
                    key={i}
                    className={`expli-v3-plan__checklist-item ${item.done ? "expli-v3-plan__checklist-item--done" : ""}`}
                    onClick={() => toggleChecklistItem(i)}
                  >
                    <div className="expli-v3-plan__checklist-item-left">
                      <div
                        className={`expli-v3-plan__checklist-check ${item.done ? "expli-v3-plan__checklist-check--done" : ""}`}
                      >
                        {item.done && (
                          <Check size={14} style={{ color: "#000" }} />
                        )}
                      </div>
                      <span
                        className={`expli-v3-plan__checklist-text ${item.done ? "expli-v3-plan__checklist-text--done" : ""}`}
                      >
                        {item.text}
                      </span>
                    </div>
                    <button className="expli-v3-plan__checklist-more">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Refinement Input */}
        {planData && (
          <div className="sticky bottom-0 px-8 pt-4 pb-5 bg-gradient-to-b from-transparent to-[#0a0a0f] via-[#0a0a0f]/80">
            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#111118] px-4 py-2.5">
              <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#23b5b5]/20 bg-[#23b5b5]/15 text-[#23b5b5] text-xs font-semibold cursor-pointer whitespace-nowrap font-inherit">
                <Sparkles size={14} />
                Add milestone
              </button>
              <input
                placeholder="Refine your plan or ask for adjustments..."
                value={refinementInput}
                onChange={(e) => setRefinementInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && refinementInput.trim()) {
                    setGoal(refinementInput.trim());
                    setRefinementInput("");
                    handleGenerate();
                  }
                }}
                className="flex-1 bg-transparent border-none outline-none text-gray-200 text-sm font-inherit placeholder:text-gray-500"
              />
              <button
                onClick={() => {
                  if (refinementInput.trim()) {
                    setGoal(refinementInput.trim());
                    setRefinementInput("");
                    handleGenerate();
                  }
                }}
                className={`w-9 h-9 rounded-xl border-none flex items-center justify-center shrink-0 transition-all duration-200 ${
                  refinementInput.trim()
                    ? "bg-[#23b5b5] text-black cursor-pointer shadow-[0_4px_16px_rgba(35,181,181,0.25)] hover:bg-[#20a3a3]"
                    : "bg-white/5 text-white/15 cursor-default"
                }`}
              >
                <ArrowUp size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <BuildPlanSidebar
        planData={planData}
        onExportPDF={handleExportPDF}
        onExportCSV={handleExportCSV}
      />
    </div>
  );
}
