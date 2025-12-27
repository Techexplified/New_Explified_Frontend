import { Link } from "react-router";

const DashboardComp = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative flex flex-col items-center justify-center px-4">
      <div className="absolute top-12 right-4">
        <Link
          to="/flowstate/login"
          style={{ backgroundColor: "#23b5b5" }}
          className="hover:opacity-90 px-4 py-2 rounded-md text-sm font-medium transition"
        >
          Admin
        </Link>
      </div>

      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-[#23b5b5]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 13l2-2m0 0l7-7 7 7M13 5v6h6m-7 4h8a2 2 0 012 2v3H3v-3a2 2 0 012-2h8z"
            />
          </svg>
          <h1 className="text-3xl md:text-4xl font-bold">
            Car Inventory Stall
          </h1>
        </div>

        <Link
          style={{ backgroundColor: "#23b5b5" }}
          to="/chat"
          className="hover:opacity-90 px-6 py-3 rounded-md text-lg font-medium transition"
        >
          AI Assistant
        </Link>
      </div>
    </div>
  );
};

export default DashboardComp;
