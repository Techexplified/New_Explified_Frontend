import { MdOutlineCreateNewFolder } from "react-icons/md";
import ExplifiedTools from "./ExplifiedTools";
import { IoCreateOutline } from "react-icons/io5";
import { RiCompassDiscoverLine } from "react-icons/ri";

function Sidebar() {
  return (
    <aside className="flex h-full overflow-y-auto gap-4 text-white border-r border-gray-700 p-4">
      <div className="flex flex-col items-center space-y-8 text-sm font-semibold">
        <div className="flex flex-col items-center justify-center rounded-xl ">
          <IoCreateOutline size={30} />
          <span className="text-white text-xs text-center">Create</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl ">
          <MdOutlineCreateNewFolder size={30} />
          <span className="text-white text-xs text-center">Your Creations</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl ">
          <RiCompassDiscoverLine size={30} />
          <span className="text-white text-xs text-center">Discover</span>
        </div>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search Tool....."
          className="w-full p-2 rounded bg-white text-black placeholder-gray-500"
        />
        <ExplifiedTools />
      </div>
    </aside>
  );
}

export default Sidebar;
