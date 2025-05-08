import { MdMenu } from "react-icons/md";
import Logo from "./Logo";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex gap-6 fixed w-screen p-4 border-b border-gray-700">
        <Logo />
        <div className="flex gap-4 ml-52">
          <button className="bg-[#23b5b5] text-white px-6 py-1 rounded">
            Create
          </button>
          <button className="bg-white text-black px-6 py-1 rounded">
            Publish
          </button>
          <button className="bg-white text-black px-6 py-1 rounded">
            Grow
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr] pt-20 h-screen relative">
        <Sidebar />

        <main className="flex-1 flex flex-col justify-between p-8 h-full">
          <h2>Dashboard</h2>
          <div className="text-center my-12">
            <h1 className="text-3xl font-bold mb-2">
              What are you looking for ?
            </h1>
            <p>Some Tagline or Description</p>
          </div>

          <div className="space-y-4 ">
            <h1>Suggested Tool</h1>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <button
                  key={i}
                  className="bg-gray-800 p-3 rounded text-center text-sm"
                >
                  Any Tool Name/Topic Suggestions
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Write your prompt here..."
              className="w-full p-3 bg-gray-800 rounded text-white placeholder-gray-400"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
