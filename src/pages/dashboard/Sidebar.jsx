import { MdOutlineCreateNewFolder } from "react-icons/md";
import ExplifiedTools from "./ExplifiedTools";
import { IoCreateOutline } from "react-icons/io5";
import { RiCompassDiscoverLine } from "react-icons/ri";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="flex h-full overflow-y-auto gap-4 text-white border-r border-gray-700 p-4">
      <div className="flex flex-col items-center space-y-8 text-sm font-semibold">
        <Link to={'/'}>
          <div className="flex flex-col items-center justify-center rounded-xl ">
            <IoCreateOutline size={30} />
            <span className="text-white text-xs text-center">Create</span>
          </div>
        </Link>
        <div className="flex flex-col items-center justify-center rounded-xl ">
          <MdOutlineCreateNewFolder size={30} />
          <span className="text-white text-xs text-center">Your Creations</span>
        </div>
        <Link to="/dashboard/discover">
          <div className="flex flex-col items-center justify-center rounded-xl ">
            <RiCompassDiscoverLine size={30} />
            <span className="text-white text-xs text-center">Discover</span>
          </div>
        </Link>
      </div>

      <ExplifiedTools />
    </aside>
  );
}

export default Sidebar;
