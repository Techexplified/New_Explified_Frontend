import { MdMenu } from "react-icons/md";
import Logo from "./Logo";
import Sidebar from "./Sidebar";
import Tabs from "./Tabs";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex gap-6 fixed w-screen p-4 border-b border-gray-700">
        <Logo />
        <Tabs />
      </div>

      <div className="grid grid-cols-[auto_1fr] pt-20 h-screen relative">
        <Sidebar />

        <main className="flex-1 flex flex-col justify-between p-8 h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
