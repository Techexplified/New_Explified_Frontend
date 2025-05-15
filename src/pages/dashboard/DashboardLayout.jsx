import { MdMenu } from "react-icons/md";
import Logo from "../../reusable_components/Logo";
import Sidebar from "./Sidebar";
import Tabs from "../../reusable_components/Tabs";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "../../reusable_components/DashboardNavbar";
import Header from "../../reusable_components/Header";

const DashboardLayout = () => {
  return (
    <>
      <Header index={0} />

      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="grid grid-cols-[auto_1fr] pt-20 h-screen">
          <Sidebar />

          <main className="flex-1 flex flex-col justify-between p-8 h-full">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
