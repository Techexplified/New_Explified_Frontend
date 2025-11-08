import {
  CircleUserRound,
  Layers,
  LayoutDashboard,
  PlugZap,
  Workflow,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  {
    path: "/",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    path: "/all-apps",
    label: "All Apps",
    icon: <Layers className="w-4 h-4" />,
  },
  {
    path: "/workflows",
    label: "Workflows",
    icon: <Workflow className="w-4 h-4" />,
  },
  {
    path: "/integrations",
    label: "Integrations",
    icon: <PlugZap className="w-4 h-4" />,
  },
];

export default function MainSidebar({ setIsProfileSettingsOpen }) {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 h-full bg-black text-white border-r border-gray-800 shadow-inner flex flex-col justify-between w-16 px-2 py-4 z-50">
      {/* Navigation */}
      <nav className="flex flex-col items-center gap-4 mt-2">
        {menuItems.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-1 py-3 rounded-lg transition-all ${
                isActive
                  ? "text-[#23b5b5]  shadow-sm shadow-[#23b5b5]/10"
                  : "text-gray-400 hover:text-[#23b5b5] hover:bg-minimal-cardHover/50"
              }`
            }
          >
            <div>{icon}</div>
            <span className="text-[9px] text-center font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Profile Button */}
      <div className="flex flex-col items-center pb-4">
        <button
          onClick={() => setIsProfileSettingsOpen(true)}
          className="flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-gray-300 hover:text-[#23b5b5] hover:bg-minimal-cardHover/50 transition-all"
        >
          <CircleUserRound className="w-5 h-5" />
          <span className="text-[11px] font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
}
