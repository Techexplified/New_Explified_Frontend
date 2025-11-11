import {
  X,
  LogIn,
  LogOut,
  MessageSquare,
  Mail,
  BoomBox,
  Zap,
  History,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { clearUser } from "../utils/auth_slice/UserSlice";

const UserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isLoggedIn = !!user;

  const userData = {
    name: user?.name || "Guest",
    email: user?.email || "guest@example.com",
    avatar:
      user?.given_name?.[0]?.toUpperCase() +
        user?.family_name?.[0]?.toUpperCase() || "JD",
  };

  const handleFeedbackClick = () => {
    window.location.href = "https://admin.explified.com/";
  };

  return (
    // <div className="bg-black text-white flex h-screen relative overflow-hidden">
    // <div className="absolute inset-0 rounded-xl opacity-30 pointer-events-none bg-gradient-to-br from-transparent via-cyan-500 to-transparent animate-pulse" style={{zIndex:0}}></div>
    <div className="bg-black text-white flex h-screen relative overflow-hidden">
      <div className="absolute inset-0 rounded-xl opacity-30 pointer-events-none bg-gradient-to-br from-transparent via-cyan-500 to-transparent"></div>
      {/* <div
    className="absolute inset-0 rounded-xl opacity-30 pointer-events-none 
               bg-gradient-to-br from-transparent via-cyan-600 to-transparent 
               animate-pulse brightness-75"
    style={{ zIndex: 0 }}
  ></div> */}

      <div className="w-full h-full flex justify-center items-center lg:grid-cols-[1fr_auto_1fr] gap-0 relative z-10">
        {/* Left Column */}
        <div className="flex flex-col items-center justify-center gap-4 p-6 lg:p-8 w-full max-w-md mx-auto">
          {/* User Profile */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-[#23b5b5] rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-2xl">
                {userData.name[0]}
              </span>
            </div>
            <h2 className="mt-4 text-white text-2xl font-bold break-words">
              {userData.name}
            </h2>
            <p className="text-gray-400 text-sm break-all">{userData.email}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-10 w-full">
            {/* Login / Logout */}
            <button
              type="button"
              onClick={() => {
                if (isLoggedIn) {
                  signOut(auth)
                    .then(() => {
                      dispatch(clearUser());
                      localStorage.removeItem("explified");
                      navigate("/login");
                    })
                    .catch((error) => console.error("Logout failed:", error));
                } else {
                  navigate("/login");
                }
              }}
              className="flex items-center justify-center min-w-[120px] h-11 px-6 rounded-[22px] border-2 border-[#23b5b5] text-base font-bold bg-gradient-to-r from-[#10191f] via-[#18272e] to-[#10191f] text-white shadow-md hover:border-[#7ce4de] hover:bg-gradient-to-r hover:from-[#18272e] hover:via-[#23b5b5]/30 hover:to-[#18272e] hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/40"
            >
              {isLoggedIn ? (
                <LogOut size={16} className="mr-2" />
              ) : (
                <LogIn className="w-5 h-5 mr-3" />
              )}
              {isLoggedIn ? "Log Out" : "Login"}
            </button>

            {isLoggedIn && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handleFeedbackClick}
                    className="flex items-center justify-center min-w-[120px] h-11 px-6 rounded-[22px] border-2 border-[#23b5b5] text-base font-bold bg-gradient-to-r from-[#10191f] via-[#18272e] to-[#10191f] text-white shadow-md hover:border-[#7ce4de] hover:bg-gradient-to-r hover:from-[#18272e] hover:via-[#23b5b5]/30 hover:to-[#18272e] hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/40"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" /> Feedback
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/socials")}
                    className="flex items-center justify-center min-w-[120px] h-11 px-6 rounded-[22px] border-2 border-[#23b5b5] text-base font-bold bg-gradient-to-r from-[#10191f] via-[#18272e] to-[#10191f] text-white shadow-md hover:border-[#7ce4de] hover:bg-gradient-to-r hover:from-[#18272e] hover:via-[#23b5b5]/30 hover:to-[#18272e] hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/40"
                  >
                    <BoomBox className="w-5 h-5 mr-2" /> Socials
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/integrations")}
                    className="flex items-center justify-center min-w-[120px] h-11 px-6 rounded-[22px] border-2 border-[#23b5b5] text-base font-bold bg-gradient-to-r from-[#10191f] via-[#18272e] to-[#10191f] text-white shadow-md hover:border-[#7ce4de] hover:bg-gradient-to-r hover:from-[#18272e] hover:via-[#23b5b5]/30 hover:to-[#18272e] hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/40"
                  >
                    <Zap className="w-5 h-5 mr-2" /> Integrations
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/history")}
                    className="flex items-center justify-center min-w-[120px] h-11 px-6 rounded-[22px] border-2 border-[#23b5b5] text-base font-bold bg-gradient-to-r from-[#10191f] via-[#18272e] to-[#10191f] text-white shadow-md hover:border-[#7ce4de] hover:bg-gradient-to-r hover:from-[#18272e] hover:via-[#23b5b5]/30 hover:to-[#18272e] hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/40"
                  >
                    <History className="w-5 h-5 mr-2" /> History
                  </button>
                </div>
              </>
            )}

            <button
              type="button"
              className="flex items-center justify-center min-w-[120px] h-11 px-6 rounded-[22px] border-2 border-[#23b5b5] text-base font-bold bg-gradient-to-r from-[#10191f] via-[#18272e] to-[#10191f] text-green-300 shadow-md hover:border-[#7ce4de] hover:bg-gradient-to-r hover:from-[#18272e] hover:via-[#23b5b5]/30 hover:to-[#18272e] hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/40"
            >
              <Mail className="w-5 h-5 mr-3" />{" "}
              <Link
                className="text-white text-sm font-semibold hover:text-[#23b5b5]"
                to={"https://explified.com/explified-labs"}
              >
                For Enterprises
              </Link>
            </button>
          </div>
        </div>

        {/* Divider */}

        {/* Right Column */}
        {/* <div className="flex flex-col gap-6 items-center justify-center text-center px-6 lg:px-12">
          <p className="text-3xl text-gray-300">Time saved</p>
          <p className="text-3xl mb-4">
            Using{" "}
            <span className="text-[#23b5b5] font-semibold">Explified</span>
          </p>
          <h1 className="text-5xl font-bold">00 Hours</h1>
          <span className="text-3xl font-semibold">&</span>
          <h1 className="text-5xl font-bold">00 Minutes</h1>
          <p className="mt-6 text-lg text-gray-400 cursor-pointer hover:underline">
            See how?
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default UserPage;
