import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { BsGrid } from "react-icons/bs";
import { useEffect, useState } from "react";
import { FaYoutube } from "react-icons/fa6";
import { LucideLogOut, X } from "lucide-react";

import { ExplifiedLogo } from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../../utils/auth_slice/UserSlice";

const tools = [
  {
    id: 1,
    name: "Youtube Summarizer",
    icon: <FaYoutube />,
    link: "/youtube-summarizer",
  },
  // { id: 2, name: "Tool2", icon: <FaYoutube />, link: "/youtube-summarizer" },
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
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const str = location?.pathname;
    const result = str.replace(/^\//, "");
    setSelected(result);
  }, [location]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleToolClick = (tool) => {
    setSelected(tool.name);
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
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="grid grid-cols-[auto_1fr] h-screen ">
        {/* sidebar section */}
        <div className="w-20 md:w-44 h-screen fixed z-20 bg-black p-2 px-4 border-r border-gray-700 space-y-4">
          <Link to="/">
            <div className="flex items-center gap-3">
              <img className="h-8" alt="Logo" src={ExplifiedLogo} />
              <h1 className="text-xl font-semibold text-white">Explified</h1>
            </div>
          </Link>

          {/* Explore Tools Label */}
          {selected && (
            <div className="bg-[#23b5b5] capitalize text-center rounded-md px-3 py-2 flex justify-between items-center">
              {selected.split("-").join(" ")}
            </div>
          )}

          <div
            onClick={toggleDropdown}
            className="flex items-center pt-4 gap-2"
          >
            <div className="bg-gray-900 p-2 rounded-md">
              <BsGrid />
            </div>
            <span>Explore</span>
          </div>
          {dropdownOpen && (
            <div className="absolute left-44 w-[300px] bg-gray-900 border border-gray-700 rounded-lg p-4 grid grid-cols-3 gap-4 z-10">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  className="w-16 h-16 bg-gray-800  hover:bg-gray-700 rounded-xl flex flex-col items-center justify-center text-white"
                >
                  <div className="text-2xl">{tool.icon}</div>
                  <div className="text-[10px] text-center leading-tight px-1">
                    {tool.name}
                  </div>
                </button>
              ))}
            </div>
          )}
          <div
            onClick={logOut}
            className="absolute left-10 bottom-6 text-center flex justify-center items-center gap-2"
          >
            <LucideLogOut /> Logout
          </div>
        </div>
        <div className="w-20 md:w-40"></div>
        {/* main section */}
        <main className="flex-1 p-8 pt-12 relative">
          <Outlet />
          {user?.given_name && (
            <div className="absolute top-4 right-4 ">
              <div className="h-8 w-8">
                <img
                  src="/defaultUser.png"
                  alt="user"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="capitalize text-sm">{user?.given_name}</div>
            </div>
          )}
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
