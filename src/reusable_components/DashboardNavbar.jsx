import Logo from "./Logo";
import Tabs from "./Tabs";

const DashboardNavbar = () => {
  return (
    <nav className="flex gap-6 fixed w-screen p-4 border-b border-gray-700">
      <Logo />
      <Tabs />
    </nav>
  );
};

export default DashboardNavbar;
