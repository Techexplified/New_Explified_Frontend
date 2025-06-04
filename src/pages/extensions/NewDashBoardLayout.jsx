import { Link, Outlet, useNavigate } from "react-router-dom";
import { BsGrid } from "react-icons/bs";
import { useEffect, useState } from "react";
import { FaYoutube } from "react-icons/fa6";
import { LucideLogOut, X } from "lucide-react";

import { ExplifiedLogo } from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../../utils/auth_slice/UserSlice";
import { addTool } from "../../utils/tool_slice/ToolSlice";
import { FaAccessibleIcon, FaAirbnb } from "react-icons/fa";

const tools = [
  { type: "divider", name: "Independent" },

  {
    id: 1,
    name: "Youtube Summarizer",
    icon: <FaYoutube />,
    link: "/youtube-summarizer",
  },
  { type: "divider", name: "Create" },

  { type: "divider", name: "Publish" },
  // { id: 3, name: "Tool3", icon: <FaYoutube /> },
  // { id: 4, name: "Tool4", icon: <FaYoutube /> },
  // { id: 5, name: "Tool5", icon: <FaYoutube /> },
  // { id: 6, name: "Tool6", icon: <FaYoutube /> },
  // { id: 7, name: "Tool7", icon: <FaYoutube /> },
  // { id: 8, name: "Tool8", icon: <FaYoutube /> },
  // { id: 9, name: "Tool9", icon: <FaYoutube /> },
];

function NewDashBoardLayout() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const activeTools = useSelector((state) => state.tool);
  const currentTool = tools.find((tool) => tool.name === activeTools);
  console.log(user, activeTools);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleToolClick1 = (tool) => {
    dispatch(addTool(tool.name));
    setDropdownOpen(false);
    navigate(tool?.link);
  };

  const logOut = () => {
    window.postMessage(
      {
        source: "explified-auth",
        type: "logout",
      },
      "*"
    );
    dispatch(removeUser());
    localStorage.removeItem("explified");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      <nav className="fixed top-0 w-full bg-black border-b border-gray-500 py-2 px-4 z-[60] flex justify-between">
        <Link to="/">
          <div className="flex items-center gap-3">
            <img className="h-8" alt="Logo" src={ExplifiedLogo} />
            <h1 className="text-xl font-semibold text-white">Explified</h1>
          </div>
        </Link>
        {user?.given_name && (
          <div className="flex gap-2 items-center">
            <div className="capitalize text-sm">Hi, {user?.given_name}</div>
            <div
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="h-8 w-8"
            >
              <img
                src="/defaultUser.png"
                alt="user"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        )}

        {userDropdownOpen && (
          <div className="absolute right-4 top-12 w-36 z-[12] bg-gray-800 shadow-lg rounded-lg ">
            <button
              onClick={logOut}
              className="px-4 py-2 w-full flex items-center gap-2 hover:bg-gray-400"
            >
              <span>
                <LucideLogOut />
              </span>
              <span>Log out</span>
            </button>
          </div>
        )}
      </nav>
      <div className="grid grid-cols-[auto_1fr] h-screen ">
        {/* sidebar section */}
        <aside className="w-20 h-screen fixed z-20 bg-black p-2  pt-16 border-r border-gray-700 space-y-4">
          {currentTool && (
            <div className="bg-[#23b5b5] rounded-md p-2 flex justify-center">
              {currentTool.icon}
            </div>
          )}

          <div onClick={toggleDropdown} className="pt-8 text-center">
            <button className="bg-gray-900 p-2 rounded-md">
              <BsGrid />
            </button>
          </div>

          <div className="flex flex-col gap-4 text-sm pt-4">
            <span className="hover:bg-[#23b5b5] px-2 py-1 rounded-md">
              Create
            </span>

            <span className="hover:bg-[#23b5b5] p-2 py-1 rounded-md">
              Publish
            </span>

            <span className="hover:bg-[#23b5b5] px-2 py-1 rounded-md">
              Grow
            </span>
          </div>
          {dropdownOpen && (
            <div className="absolute left-20 top-20 w-[200px] bg-gray-900 border border-gray-700 rounded-lg p-2 flex flex-col gap-2 z-10">
              {tools.map((tool, index) =>
                tool.type === "divider" ? (
                  <div
                    key={index}
                    className="bg-gray-400 text-black font-semibold text-sm px-4 py-2"
                  >
                    {tool.name}
                  </div>
                ) : (
                  <button
                    key={tool.id}
                    onClick={() => handleToolClick1(tool)}
                    className="flex items-center gap-2 text-white px-3 py-2 hover:bg-gray-700 rounded-md"
                  >
                    <span className="text-lg">{tool.icon}</span>
                    <span className="text-sm">{tool.name}</span>
                  </button>
                )
              )}
            </div>
          )}
        </aside>
        <div className="w-20"></div>
        {/* main section */}
        <main className="flex-1 p-8 pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default NewDashBoardLayout;

{
  /* <div className="flex flex-col relative">
  <h1 className="text-4xl font-semibold text-center mb-6">
    Summarize YouTube Videos
  </h1> */
}

{
  /* Scrollable summary section */
}

//   <div className="max-w-4xl mx-auto w-full flex-1 overflow-y-auto p-4 pb-20 rounded-md ">
//     {summary}
//   </div>
//   {loading && (
//     <h1 className="max-w-4xl mx-auto w-full text-center flex-1 overflow-y-auto p-4 pb-20 rounded-md ">
//       Generating summary...
//     </h1>
//   )}

{
  /* Fixed input at bottom */
}
//   <div className="fixed bottom-0 left-20 md:left-44 right-0 bg-black z-10">
//     <div className="max-w-4xl mx-auto w-full p-4 flex gap-4 items-center">
//       <input
//         type="text"
//         value={videoUrl}
//         onChange={handleUrl}
//         placeholder="Enter YouTube URL"
//         className="flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]"
//       />
//       <button
//         onClick={() => getTranscript(videoId)}
//         disabled={loading}
//         className={`px-6 py-3 bg-[#23b5b5] rounded-lg font-semibold flex items-center gap-2 transition ${
//           loading ? "opacity-35" : null
//         }`}
//       >
//         Summarize
//       </button>
//     </div>
//   </div>
// </div>;
