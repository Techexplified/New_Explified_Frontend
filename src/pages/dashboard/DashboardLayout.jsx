import { MdMenu } from "react-icons/md";
import Logo from "../../reusable_components/Logo";
import Sidebar from "./Sidebar";
import Tabs from "../../reusable_components/Tabs";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "../../reusable_components/DashboardNavbar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <DashboardNavbar />

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
