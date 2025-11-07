import {
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  FileText,
  Grip,
  Layers,
  LayoutDashboard,
  PlugZap,
  Plus,
  Search,
  Workflow,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
const menuItems = [
  {
    path: "/",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-5" />,
  },
  {
    path: "/all-apps",
    label: "All Apps",
    icon: <Layers className="w-4 h-5" />,
  },
  {
    path: "/workflows",
    label: "Workflows",
    icon: <Workflow className="w-4 h-5" />,
  },
  {
    path: "/integrations",
    label: "Integrations",
    icon: <PlugZap className="w-4 h-5" />,
  },
];
function MainSidebar({ isProfileSettingsOpen, setIsProfileSettingsOpen }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [closeSidebar, setCloseSidebar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  // Profile dropdown handlers
  let profileTimeoutId;
  const handleProfileEnter = () => {
    clearTimeout(profileTimeoutId);
    setIsProfileOpen(true);
  };
  const handleProfileLeave = () => {
    profileTimeoutId = setTimeout(() => setIsProfileOpen(false), 200);
  };
  return (
    <>
      {" "}
      {/* Sidebar Trigger Area */}
      <div
        className="fixed left-0 top-0 h-full w-6 z-30 hover-zone"
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      />
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-black text-white border-r border-gray-900 shadow-inner flex flex-col justify-between transition-all duration-300 ease-in-out z-50 ${
          sidebarOpen ? "w-60 px-4" : "w-12"
        }`}
      >
        {/* Collapse/Expand Button */}
        <div
          className={`mt-6 flex ${
            sidebarOpen ? "justify-end" : "justify-center"
          } `}
        >
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="p-2 rounded-md bg-minimal-cardHover hover:bg-minimal-cardHover/70 text-minimal-primary transition-all"
          >
            {sidebarOpen ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        </div>
        {/* Navigation */}
        <div className="flex-1 mt-3">
          <nav className="space-y-2">
            {menuItems.map(({ path, label, icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `relative block transition-all duration-300 ease-in-out`
                }
              >
                {({ isActive }) => (
                  <div
                    className={`flex items-center font-medium px-2 py-1 rounded-lg transition-all duration-300 group relative
            ${
              isActive
                ? "bg-minimal-cardHover text-[#23b5b5] shadow-sm shadow-[#23b5b5]/10"
                : "text-gray-300 hover:text-[#23b5b5] hover:bg-minimal-cardHover/70"
            }`}
                  >
                    {/* 🔹 Left line indicator */}
                    <span
                      className={`absolute left-0 top-0 h-full w-[3px] rounded-r-md transition-all duration-300 ${
                        isActive
                          ? "bg-[#23b5b5] opacity-100"
                          : "bg-transparent opacity-0 group-hover:opacity-50 group-hover:bg-[#23b5b5]/50"
                      }`}
                    ></span>

                    {/* 🔹 Icon */}
                    <div
                      className={`p-2 rounded-md transition-all duration-300 flex-shrink-0 ${
                        collapsed ? "mx-auto" : ""
                      } ${
                        isActive
                          ? "text-[#23b5b5] scale-110 drop-shadow-[0_0_8px_#23b5b5]"
                          : "text-gray-300 group-hover:text-[#23b5b5] group-hover:scale-105"
                      }`}
                    >
                      {icon}
                    </div>

                    {/* 🔹 Label (collapse animation) */}
                    <span
                      className={`whitespace-nowrap text-sm overflow-hidden transition-all duration-300 ease-in-out ${
                        collapsed ? "opacity-0 w-0" : "opacity-100 w-auto ml-2"
                      } ${
                        isActive
                          ? "text-[#23b5b5]"
                          : "text-gray-300 group-hover:text-[#23b5b5]"
                      }`}
                    >
                      {label}
                    </span>

                    {/* 🔹 Tooltip (only when collapsed) */}
                    {!sidebarOpen && (
                      <div
                        className="
      absolute left-[4rem] top-1/2 -translate-y-1/2
      bg-[#111] text-white text-xs font-medium rounded-lg
      py-1.5 px-3
      opacity-0 group-hover:opacity-100
      scale-95 group-hover:scale-100
      transition-all duration-100 ease-out
      whitespace-nowrap z-50 border border-[#222] shadow-lg
      pointer-events-none
    "
                      >
                        {label}
                        <span
                          className="
        absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full
        border-y-transparent border-y-6 border-r-6 border-r-[#111]
      "
                        ></span>
                      </div>
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Profile */}
        {/* Profile */}
        <div
          className="relative flex flex-col items-center justify-center mt-auto mb-4 group"
          onMouseEnter={handleProfileEnter}
          onMouseLeave={handleProfileLeave}
        >
          {/* Profile button (opens the centered modal) */}
          <button
            onClick={() => setIsProfileSettingsOpen(true)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl w-full transition-all duration-200"
          >
            <CircleUserRound className="w-5 h-5" />
            {sidebarOpen && (
              <span className="text-sm font-medium text-white">Profile</span>
            )}
          </button>

          {/* Tooltip for collapsed state */}
          {!sidebarOpen && (
            <span className="absolute left-full ml-3 bottom-2 bg-gray-900 text-white text-xs rounded-md py-1 px-2 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-40 shadow-lg border border-gray-700">
              Profile
            </span>
          )}

          {/* Small dropdown (optional) */}
          {isProfileOpen && sidebarOpen && (
            <div className="absolute bottom-14 left-0 min-w-[220px] bg-gradient-to-br from-[#0d1418] to-[#111c20] backdrop-blur-xl border border-[#23b5b5]/40 rounded-xl shadow-lg p-4 flex flex-col items-center z-50">
              {/* ... small dropdown items if you still want them ... */}
              <button
                onClick={() => setIsProfileSettingsOpen(true)}
                className="w-full py-2 rounded-lg text-white bg-[#23b5b5]/10"
              >
                Open Profile Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MainSidebar;
