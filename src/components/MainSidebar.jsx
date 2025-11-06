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
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    path: "/all-apps",
    label: "All Apps",
    icon: <Layers className="w-5 h-5" />,
  },
  {
    path: "/workflows",
    label: "Workflows",
    icon: <Workflow className="w-5 h-5" />,
  },
  {
    path: "/integrations",
    label: "Integrations",
    icon: <PlugZap className="w-5 h-5" />,
  },
];
function MainSidebar() {
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
          sidebarOpen ? "w-60 px-4" : "w-16"
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
        <div className="flex-1 mt-6">
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
                    className={`flex items-center font-medium px-3 py-2 rounded-lg transition-all duration-300 group relative
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
                      title={!sidebarOpen ? label : ""}
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
                    {collapsed && (
                      <span
                        className="
                absolute left-full ml-3 top-1/2 -translate-y-1/2
                bg-gray-900 text-white text-xs rounded-md py-1 px-2
                invisible group-hover:visible
                whitespace-nowrap z-50 shadow-lg border border-gray-700
                pointer-events-none
              "
                      >
                        {label}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Profile */}
        <div
          onMouseEnter={handleProfileEnter}
          onMouseLeave={handleProfileLeave}
          className="relative flex flex-col items-center justify-center mt-auto mb-4 group"
        >
          {/* Profile Button */}
          <button
            onClick={() => navigate?.("/profile")}
            className={`flex items-center justify-center gap-3  py-2 rounded-xl w-full transition-all duration-200 transform relative
      ${
        location.pathname === "/profile"
          ? "scale-105 text-[#23b5b5] bg-minimal-primary/20 border border-[#23b5b5]/40"
          : "text-minimal-white hover:text-[#23b5b5] hover:bg-minimal-cardHover"
      }`}
          >
            {/* Left Accent Strip (Active State) */}
            {location.pathname === "/profile" && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#23b5b5] rounded-r-sm transition-all duration-200" />
            )}

            <CircleUserRound className="w-5 h-5 flex-shrink-0" />

            {/* Label visible only when expanded */}
            {sidebarOpen && (
              <span className="text-sm font-medium text-white whitespace-nowrap">
                Profile
              </span>
            )}
          </button>

          {/* Tooltip for collapsed state */}
          {!sidebarOpen && (
            <span className="absolute left-full ml-3 bottom-2 bg-gray-900 text-white text-xs rounded-md py-1 px-2 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-40 shadow-lg border border-gray-700">
              Profile
            </span>
          )}

          {/* Dropdown (adjusted position to prevent overlap) */}
          {isProfileOpen && (
            <div
              className="absolute bottom-14 left-0 min-w-[220px]
      bg-gradient-to-br from-[#0d1418] to-[#111c20]
      backdrop-blur-xl border border-[#23b5b5]/40 rounded-xl shadow-lg
      p-4 flex flex-col items-center z-50
      transform transition-all duration-300 ease-out
      animate-in fade-in-20 scale-in-95"
            >
              {/* For Enterprises */}
              <a
                className="w-full h-9 mb-3 rounded-lg border border-[#23b5b5]/40 text-sm font-medium text-white
          bg-transparent hover:bg-[#23b5b5]/15 hover:border-[#23b5b5]
          hover:shadow-md hover:shadow-cyan-500/20 transition-all duration-200 flex items-center justify-center"
                href="https://explified.com/explified-labs"
                target="_blank"
                rel="noopener noreferrer"
              >
                For Enterprises
              </a>

              {/* Quick Tools */}
              <div className="flex gap-2 w-full mb-3">
                {[
                  { icon: Plus, to: "/expli" },
                  { icon: FileText, to: "/tasks" },
                ].map(({ icon: Icon, to }, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      navigate?.(to);
                      setIsProfileOpen(false);
                    }}
                    className="flex-1 h-9 flex items-center justify-center rounded-lg border border-[#23b5b5]/40 bg-transparent
                hover:bg-[#23b5b5]/15 hover:border-[#23b5b5] hover:shadow-sm hover:shadow-cyan-500/20
                text-white transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <div className="flex gap-2 w-full mb-3">
                {[{ icon: Search, to: "/discover" }].map(
                  ({ icon: Icon, to }, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        navigate?.(to);
                        setIsProfileOpen(false);
                      }}
                      className="flex-1 h-9 flex items-center justify-center rounded-lg border border-[#23b5b5]/40 bg-transparent
              hover:bg-[#23b5b5]/15 hover:border-[#23b5b5] hover:shadow-sm hover:shadow-cyan-500/20
              text-white transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  )
                )}
              </div>

              {/* Workflows */}
              <div className="mb-3 w-full">
                <h3 className="text-white text-xs font-semibold opacity-80 mb-2">
                  Workflows
                </h3>
                <div className="flex gap-2 w-full">
                  {[
                    { icon: Workflow, to: "/workflows" },
                    { icon: Zap, to: "/integrations" },
                  ].map(({ icon: Icon, to }, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        navigate?.(to);
                        setIsProfileOpen(false);
                      }}
                      className="flex-1 h-9 flex items-center justify-center rounded-lg border border-[#23b5b5]/40 bg-transparent
                  hover:bg-[#23b5b5]/15 hover:border-[#23b5b5] hover:shadow-sm hover:shadow-cyan-500/20
                  text-white transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* All Tools */}
              <div className="w-full mb-1">
                <h3 className="text-white text-xs font-semibold opacity-80 mb-2">
                  All Tools
                </h3>
                <button
                  onClick={() => {
                    navigate?.("/alltools");
                    setIsProfileOpen(false);
                  }}
                  className="flex items-center justify-center w-12 h-12 mx-auto rounded-lg border border-[#23b5b5]/40 
            text-white bg-transparent hover:bg-[#23b5b5]/15 hover:border-[#23b5b5]
            hover:shadow-md hover:shadow-cyan-500/20 transition-all duration-200"
                >
                  <Grip className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MainSidebar;
